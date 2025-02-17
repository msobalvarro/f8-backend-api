import { z } from 'zod'
import type { JobsPropierties } from './interfaces'

export const createAndUpdateProductValidation = z.object({
  name: z.string({
    message: 'Product name is required (min 3 characters)'
  }).min(3),
  description: z.string({
    message: 'Product description is required (min 3 characters)'
  }).min(3),
  images: z.array(
    z.string({
      message: 'image param must be string'
    }),
    {
      message: 'images is required'
    }
  ),
  pinned: z.boolean({ message: 'pinned is required' }),
})

export const createUserValidation = z.object({
  name: z.string({ message: 'name is required' }),
  username: z.string({ message: 'username is required' }),
  password: z.string({ message: 'password is required' }),
})

export const loginValidation = z.object({
  username: z.string({ message: 'username is required' }),
  password: z.string({ message: 'password is required' }),
})

export const createPreferenceValidation = z.object({
  key: z.string({ message: 'name preference is required' }),
  value: z.string({ message: 'value preference is required' }),
})

export const deletePreferenceValidation = z.object({
  _id: z.string({ message: 'id preference is required' }),
})

export const updatePreferenceValidation = z.object({
  _id: z.string({ message: 'id preference is required' }),
  key: z.string({ message: 'name preference is required' }),
  value: z.string({ message: 'value preference is required' }),
})

export const createMessage = z.object({
  fullName: z.string({ message: 'name is required' }),
  phoneNumber: z.string({ message: 'phone number is required' }),
  message: z.string({ message: 'message is required' }),
  email: z.string({ message: 'email is required' }).email({ message: 'email format is not valid' }),
})


export const createAndUpdateServiceValidation = z.object({
  title: z.string({
    message: 'Title is required (min 3 characters)'
  }).min(3),
  description: z.string({
    message: 'Product description is required (min 3 characters)'
  }).min(3),
  images: z.array(
    z.string({
      message: 'image param must be string'
    }),
    {
      message: 'images is required'
    }
  ),
  pinned: z.boolean({ message: 'pinned is required' }),
})

export const updateUserPassword = z.object({
  password: z.string({ message: 'password is required' }),
})

export const deleteUser = z.object({
  id: z.string({ message: 'id is required' }),
})

export const createNewJobValidation = z.object({
  title: z.string({ message: 'title is required' }),
  description: z.string({ message: 'description is required' }),
})

export const createApplicationJob = z.object({
  fullName: z.string({ message: 'full name is required' }),
  email: z.string({ message: 'email is required' }),
  phoneNumber: z.string({ message: 'phone number is required' }),
  cv: z.string({ message: 'cv is required' }),
  jobId: z.string({ message: 'job id is required' }),
})
