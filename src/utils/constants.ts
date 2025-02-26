import dotenv from 'dotenv'

dotenv.config()

export const {
  DB = '',
  JWT_SECRET = '',
  PUBLIC_FOLDER = '',
  PORT = 300,
  HOST_MAIL = '',
  PORT_MAIL = 0,
  USER_EMAIL = '',
  PASS_EMAIL = ''
} = process.env