import type { JobsPropierties } from '@/utils/interfaces'
import { subscribeMailsModel } from '@/models/subscribed_mail'
import { sendEmail } from './sendMail'
import { FRONTEND_URL } from '@/utils/constants'

export const notificationNewJob = async (job: JobsPropierties) => {
  const clients = await subscribeMailsModel.find({ active: true })

  for (const client of clients) {
    await sendEmail({
      email: client.email,
      subject: 'Nuevo Empleo F8Technologies',
      templateName: 'notification_job',
      variables: {
        jobaName: job.description,
        jobUrl: `${FRONTEND_URL}/jobs/${job._id}`,
        unsubscribeUrl: `${FRONTEND_URL}/unsubscribe/${client._id}`
      }
    })
  }
}
