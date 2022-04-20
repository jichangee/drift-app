import { Router } from "express";
import { hash, genSalt, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AuthToken } from '@/lib/models/AuthToken';
import { User } from "@/lib/models/User";
import config from "@/lib/config";

export const auth = Router();

auth.post("/signup", async (req, res, next) => {
  try {
    const username = req.body.username.toLowerCase();
    const existingUser = await User.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new Error("用户已存在");
    }

    const { count } = await User.findAndCountAll();

    const user = {
      username,
      password: await hash(req.body.password, await genSalt(10)),
      role: count === 0 ? "admin" : "user",
    };

    const created_user = await User.create(user);
    const token = await generateAccessToken(created_user)
    res.status(201).json({ userId: created_user.id, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

auth.post('/signin', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const existingUser = await User.findOne({ where: { username } })
    if (!existingUser) {
      throw new Error('用户名或密码错误')
    }
    const isValidPassword = await compare(password, existingUser.password)
    if (!isValidPassword) {
      throw new Error('用户名或密码错误')
    }
    const token = await generateAccessToken(existingUser)
    res.status(201).json({ userId: existingUser.id, token })
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
})

async function generateAccessToken(user: User) {
  const token = await sign({ id: user.id }, config.jwt_secret, {
    expiresIn: "2d",
  });
  const authToken = new AuthToken({
    userId: user.id,
    token,
  })
  authToken.save()
  return token
}
