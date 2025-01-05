import 'dotenv'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import { JWT_SECRET } from '@/utils/constants'

export const createHash = (data: string): string => crypto.createHash('sha256').update(data).digest('hex')

export const verifyToken = (jwt: string) => jsonwebtoken.verify(jwt, JWT_SECRET)

export const generateToken = (props: { _id: string }) => jsonwebtoken.sign(props, JWT_SECRET, { expiresIn: '24h' })