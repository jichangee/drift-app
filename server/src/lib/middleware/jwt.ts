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
  try {
    const user: User = await getUserByJWT(token)
    req.user = user

    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

export const getUserByJWT: any = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt_secret, async (err: any, user: User) => {
      if (err) {
        reject(err)
        return
      }
      const userObj = await UserModel.findByPk(user.id, {
        attributes: {
          exclude: ['password']
        }
      })
  
      if(!userObj) {
        reject()
        return
      }
      resolve(userObj)
    })
  })
}