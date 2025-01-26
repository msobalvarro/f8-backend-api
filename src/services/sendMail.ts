import { HOST_MAIL, PASS_EMAIL, PORT_MAIL, USER_EMAIL } from '@/utils/constants'
import nodemailer from 'nodemailer'

const configutation = {
  host: HOST_MAIL,
  port: PORT_MAIL,
  secure: false,
  auth: {
    user: USER_EMAIL,
    pass: PASS_EMAIL,
  },
}

const transporter = nodemailer.createTransport(configutation as nodemailer.TransportOptions)

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmailTest(email: string): Promise<void> {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"F8 Technologies" <hola@8technologies.com>',
    to: email,
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>',
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}