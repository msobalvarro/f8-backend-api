import 'dotenv'
import crypto from 'crypto'
import { sign, verify } from 'jsonwebtoken'
import { unknown } from 'zod'

const SECRET_KEY: string = (process.env.JWT_SECRET || '').replace('s', "$")

export const createHash = (data: string): string => crypto.createHash('sha256').update(data).digest('hex')

export const verifyToken = (jwt: string) => verify(jwt, SECRET_KEY)

export const generateToken = (props = unknown) => sign(props, SECRET_KEY, { expiresIn: '24h' })