import { HOST_MAIL, PASS_EMAIL, PORT_MAIL, USER_EMAIL } from '@/utils/constants'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport(<nodemailer.TransportOptions>{
  host: HOST_MAIL,
  port: PORT_MAIL,
  requireTLS: true,
  auth: {
    user: USER_EMAIL,
    pass: PASS_EMAIL,
  },
})

export async function sendEmailTest(email: string): Promise<void> {
  const info = await transporter.sendMail({
    from: 'hola@8technologies.com',
    to: email,
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>',
  })

  console.log('Message sent: %s', info.messageId)
}