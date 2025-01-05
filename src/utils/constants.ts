import dotenv from 'dotenv'

dotenv.config()

export const {
  DB = '',
  JWT_SECRET = '',
  PUBLIC_FOLDER = '',
  PORT = 300
} = process.env