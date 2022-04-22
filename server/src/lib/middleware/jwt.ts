import { Request, Response, NextFunction } from 'express'
import { AuthToken } from '@/lib/models/AuthToken'
import { User as UserModel } from '@/lib/models/User'
import * as jwt from 'jsonwebtoken'
import config from '@/lib/config'

export interface User {
  id: string
}

export interface UserJwtRequest extends Request {
  user: User
}

export default async function authenticateToken(req: UserJwtRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers ? req.headers['authorization'] : undefined
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  const authToken = await AuthToken.findOne({ where: { token } })

  if (!authToken) return res.sendStatus(401)

  if (authToken.deletedAt) {
    return res.sendStatus(401).json({ message: 'token已过期' })
  }

  jwt.verify(token, config.jwt_secret, async (err: any, user: User) => {
    if (err) return res.sendStatus(403)
    const userObj = await UserModel.findByPk(user.id, {
      attributes: {
        exclude: ['password']
      }
    })

    if(!userObj) return res.sendStatus(403)

    req.user = user

    next()
  })
}