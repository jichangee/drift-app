import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import * as crypto from 'crypto'
import jwt, { getUserByJWT } from "@/lib/middleware/jwt";
import { Post } from "@/lib/models/Post";
import { User } from "@/lib/models/User";
import { UserJwtRequest } from "@/lib/middleware/jwt";
import { PostAuthor } from "@/lib/models/PostAuthor";
import { Op } from "sequelize";
export const posts = Router();

const postVisibilitySchema = (value: string) => {
  if (value !== "public" && value !== "private" && value !== "protected") {
    throw new Error("Invalid post visibility");
  }
  return value;
};

posts.post(
  "/create",
  jwt,
  celebrate({
    body: {
      title: Joi.string().required(),
      description: Joi.string().optional().min(0).max(256),
      content: Joi.string()
        .required()
        .max(5 * 1024),
      visibility: Joi.string()
        .custom(postVisibilitySchema, "post visibility")
        .required(),
      password: Joi.string().optional().max(18)
    },
  }),
  async (req: UserJwtRequest, res, next) => {
    try {
      const { id: userId } = req.user;
      const { title, description, content, visibility, password } = req.body;
      let hashedPassword = ''
      if (visibility === 'protected' && !password) {
        return res.status(400).json({ message: '请输入密码' })
      } else if (visibility === 'protected') {
        hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
      }

      const newPost = new Post({
        title,
        description,
        content,
        visibility,
        password: hashedPassword
      });
      

      await newPost.save();
      await newPost.$add("users", userId);
      res.status(200).json(newPost);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

posts.get("/", jwt, async (req: UserJwtRequest, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Post,
          as: "posts",
          include: [
            {
              model: Post,
              as: "parent",
              attributes: ["id", "title", "visibility"],
            },
          ],
          attributes: ["id", "title", "description", "visibility", "createdAt"],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "未找到用户" });
    }

    const userPost = user.posts

    res.status(200).json({
      posts: userPost
    });
  } catch (error) {
    console.log('error', error)
    
    res.status(400).json(error);
  }
});



posts.get("/:id", async (req: UserJwtRequest, res) => {
  try {
    const authHeader = req.headers ? req.headers['authorization'] : undefined
    const token = authHeader && authHeader.split(' ')[1]
    const post = await Post.findByPk(req.params.id, fullPostSequelizeOptions);
    
    if (!post) {
      return res.status(404).json({ message: "未找到文章" });
    }

    let reqUser
    try {
      reqUser = await getUserByJWT(token)
    } catch (error) {
      
    }
    const isAuthor = reqUser?.id === post.users![0].id
    
    if (!isAuthor && post.visibility === 'private') {
      return res.status(403).json({ message: "暂无权限查看" });
    }
    if(!isAuthor && post.password !== '') {
      return res.status(200).json({ visibility: post.visibility })
    }
    res.status(200).json(post);
  } catch (error) {
    console.log('error', error)
    
    res.status(400).json(error);
  }
});
posts.get("/auth/:id", celebrate({
  query: {
    password: Joi.string().required()
  }
}), async (req: UserJwtRequest, res) => {
  try {
    const { password } = req.query
    const post = await Post.findByPk(req.params.id, {
      ...fullPostSequelizeOptions,
      attributes: [ ...fullPostSequelizeOptions.attributes, 'password' ]
    });
    
    if (!post) {
      return res.status(404).json({ message: "未找到文章" });
    }
    const hashedPassword = crypto.createHash('sha256').update(password?.toString() || '').digest('hex').toString()
    if (hashedPassword !== post.password) {
      return res.status(400).json({ error: '密码错误' })
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json(error);
  }
});
posts.get("/search", jwt, celebrate({
  query: {
    q: Joi.string().required().max(256)
  }
}), async (req: UserJwtRequest, res) => {
  const q = req.query.q;
  const posts = await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ],
      [Op.and]: [{ "$users.id$": req.user?.id || "" }],
    },
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "username"],
      },
      {
        model: Post,
        as: "parent",
        attributes: ["id", "title", "visibility"],
      },
    ],
    attributes: ["id", "title", "description", "visibility", "createdAt", 'deletedAt'],
    order: [["createdAt", "DESC"]]
  });
  res.status(201).json(posts)
});
posts.delete("/:id", jwt, async (req: UserJwtRequest, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id"],
        },
      ],
    });
    if (!post) {
      return res.status(404).json({ error: "未找到文章" });
    }
    if (req.user.id !== post.users![0].id) {
      return res.status(403).json({ error: "没有权限" });
    }

    const postAuthor = await PostAuthor.findOne({
      where: {
        postId: post.id,
      },
    });

    if (postAuthor) await postAuthor.destroy();
    await post.destroy();

    res.json({ message: "文章已删除" });
  } catch (error) {
    next(error);
  }
});

const fullPostSequelizeOptions = {
	include: [
		{
			model: User,
			as: "users",
			attributes: ["id", "username"]
		},
		{
			model: Post,
			as: "parent",
			attributes: ["id", "title", "visibility", "createdAt"]
		}
	],
	attributes: [
		"id",
		"title",
		"description",
		"visibility",
    "content",
		"createdAt",
		"updatedAt",
		"deletedAt",
		"expiresAt"
	]
}