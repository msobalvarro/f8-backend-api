import type { JobsCreateProps } from '@/utils/interfaces';
import { apiLimiter, authMiddleware } from '@/middleware';
import { jobsModel } from '@/models/jobs';
import { createApplicationJob, createNewJobValidation } from '@/utils/validations';
import { Router, type Request, type Response } from 'express';
import { jobApplicationModel } from '@/models/job_applications';

export const routerJobs = Router()

routerJobs.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data: JobsCreateProps = req.body
    await createNewJobValidation.parse(data)

    const newJob = await jobsModel.create(data)
    res.send(newJob)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerJobs.post('/apply', apiLimiter, async (req: Request, res: Response) => {
  try {
    const data = createApplicationJob.parse(req.body)

    const job = await jobsModel.findById(data.jobId)
    if (!job) throw new Error('job not found')

    const newApplication = await jobApplicationModel.create({
      ...data,
      job
    })

    res.send(newApplication)
  } catch (error) {
    res.status(500).send(String(error))
  }
})