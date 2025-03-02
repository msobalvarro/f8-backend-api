import type { JobsPropierties } from '@/utils/interfaces'
import { subscribeMailsModel } from '@/models/subscribed_mail'
import { sendEmail } from './sendMail'

export const notificationNewJob = async (job: JobsPropierties) => {
  const clients = await subscribeMailsModel.find({ active: true })


  for (const client of clients) {
    await sendEmail({
      email: client.email,
      subject: 'Nuevo Empleo F8Technologie',
      templateName: 'notification_job',
      variables: {
        jobaName: job.description,
      }
    })

  }
}