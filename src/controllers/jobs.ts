import type { JobsCreateProps, JobsUpdateProps } from '@/utils/interfaces'
import { apiLimiter, authMiddleware } from '@/middleware'
import { jobsModel } from '@/models/jobs'
import {
  createApplicationJob,
  createNewJobValidation,
  updateJobValidation
} from '@/utils/validations'
import { Router, type Request, type Response } from 'express'
import { jobApplicationModel } from '@/models/job_applications'

export const routerJobs = Router()

routerJobs.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    // type TypeNewJobProps = z.infer<typeof createNewJobValidation>
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

routerJobs.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data: JobsUpdateProps = req.body
    await updateJobValidation.parse(data)

    const jobUpdated = await jobsModel.updateOne(
      { _id: data.jobId },
      {
        description: data.description,
        image: data.image,
        tags: data.tags,
        location: data.location,
        title: data.title
      }
    )

    res.send(jobUpdated)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerJobs.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const active = Boolean(req.query.active === 'true')
    const jobs = await jobsModel.find({ active }).sort({ createdAt: -1 })
    res.send(jobs)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerJobs.get('/all', async (req: Request, res: Response) => {
  try {
    const jobs = await jobsModel.find({ active: true }).sort({ createdAt: -1 })
    res.send(jobs)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerJobs.delete('/:jobId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = req.params
    if (!data.jobId) throw new Error('jobId is required')
    const jobDeleted = await jobsModel.deleteOne({ _id: data.jobId })

    res.send(jobDeleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerJobs.delete('/applicationJob/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = req.params
    if (!req.params.id) throw new Error('jobId is required')
    const applicationDeleted = await jobApplicationModel.deleteOne({ _id: req.params.id })

    res.send(applicationDeleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

routerJobs.get('/applications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const applicationDeleted = await jobApplicationModel.find().sort({ createdAt: -1 }).populate('job')

    res.send(applicationDeleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})
