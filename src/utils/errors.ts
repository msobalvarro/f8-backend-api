import type { Response } from 'express'
import { ZodError } from 'zod'

export const responseError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    res.status(500).send(`${error.message[0]}`)
  } else {
    res.status(500).send(`${error}`)
  }
} 