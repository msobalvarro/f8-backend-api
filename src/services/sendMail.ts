import { FRONTEND_URL, HOST_MAIL, PASS_EMAIL, PORT_MAIL, USER_EMAIL } from '@/utils/constants'
import fs from 'fs'
import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import path from 'path'

const transporter = nodemailer.createTransport(<nodemailer.TransportOptions>{
  host: HOST_MAIL,
  port: PORT_MAIL,
  requireTLS: true,
  auth: {
    user: USER_EMAIL,
    pass: PASS_EMAIL,
  },
})

type SendMailProps = {
  email: string
  subject: string
  templateName: string
  variables?: object
}

export async function sendEmail({ email, subject, templateName, variables }: SendMailProps): Promise<void> {
  const templatePath = path.join(process.cwd(), `src/templates/${templateName}.hbs`)
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(templateSource)

  const html = template({
    ...variables,
    siteUrl: FRONTEND_URL,
    logoUrl: `${FRONTEND_URL}/logo.png`
  })

  const info = await transporter.sendMail({
    from: USER_EMAIL,
    to: email,
    subject,
    html,
  })

  console.log('Message sent: %s', info.messageId)
}