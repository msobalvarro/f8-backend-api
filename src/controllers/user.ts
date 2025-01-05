import { usersModel } from '@/models/user'
import { UsersPropierties } from '@/utils/interfaces'
import { validateErrorResponse } from '@/utils/responseError'
import { newSha256, verifyHeaderToken } from '@/utils/validateToken'
import { createUserValidation } from '@/utils/validations'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await verifyHeaderToken(request)

    const params: UsersPropierties = await request.json()
    const { name, username, password: pwd } = createUserValidation.parse(params)

    const password = await newSha256(pwd)
    const newUser = await usersModel.create({
      name,
      username,
      password,
    })
    return NextResponse.json(newUser)
  } catch (error) {
    return validateErrorResponse(error)
  }
}