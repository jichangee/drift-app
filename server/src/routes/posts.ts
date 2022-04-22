import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import jwt from '@/lib/middleware/jwt'
import { Post } from "@/lib/models/Post";
import { User } from "@/lib/models/User";
import { UserJwtRequest } from "@/lib/middleware/jwt";
import { PostAuthor } from "@/lib/models/PostAuthor";
export const posts = Router();

const postVisibilitySchema = (value: string) => {
  if (value !== "public" && value !== "private") {
    throw new Error("Invalid post visibility");
  }
  return value
}

posts.post(
  "/create",
  jwt,
  celebrate({
    body: {
      title: Joi.string().required(),
      description: Joi.string().optional().min(0).max(256),
      content: Joi.string().required().max(5 * 1024),
      visibility: Joi.string().custom(postVisibilitySchema, "post visibility").required()
    }
  }),
  async (req: UserJwtRequest, res, next) => {
    try {
      const { id: userId } = req.user
      const { title, description, content, visibility } = req.body;
      const newPost = new Post({
        title,
        description,
        content,
        visibility
      });
      console.log('userId', userId)
      
      await newPost.save();
      await newPost.$add("users", userId);
      res.status(200).json(newPost);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

posts.get('/', jwt, async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title", "content", "description", "updatedAt"],
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json(error);
  }
})
posts.delete('/:id', jwt, async (req: UserJwtRequest, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id']
        }
      ]
    })
    if (!post) {
      return res.status(404).json({ error: '未找到文章' })
    }
    if (req.user.id !== post.users![0].id) {
      return res.status(403).json({ error: '没有权限' })
    }

    const postAuthor = await PostAuthor.findOne({
      where: {
        postId: post.id
      }
    })
    
    if (postAuthor) await postAuthor.destroy()
    await post.destroy()

    res.json({ message: '文章已删除' })
  } catch (error) {
    next(error)
  }
})