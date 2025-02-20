import type { JobsCreateProps, JobsUpdateProps } from '@/utils/interfaces'
import { apiLimiter, authMiddleware } from '@/middleware'
import { jobsModel } from '@/models/jobs'
import {
  createApplicationJob,
  createNewJobValidation,
  updateJobValidation,
  updateStatusJobValidation
} from '@/utils/validations'
import { Router, type Request, type Response } from 'express'
import { jobApplicationModel } from '@/models/job_applications'

export const routerJobs = Router()

// Create a new job
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

// Apply for a job
routerJobs.post('/apply', apiLimiter, async (req: Request, res: Response) => {
  try {
    const data = createApplicationJob.parse(req.body)

    const job = await jobsModel.findById(data.jobId)
    if (!job) throw new Error('job not found')

    const applicationExists = await jobApplicationModel.findOne({
      job: job._id,
      email: data.email
    })

    if (applicationExists) {
      throw new Error('Application already exists')
    }

    const newApplication = await jobApplicationModel.create({
      ...data,
      job
    })

    res.send(newApplication)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// Update a job
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

// Get all jobs for admin app
routerJobs.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const active = Boolean(req.query.active === 'true')
    const jobs = await jobsModel.find({ active }).sort({ createdAt: -1 })
    res.send(jobs)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// Get all jobs for websites
routerJobs.get('/all', async (req: Request, res: Response) => {
  try {
    const jobs = await jobsModel.find({ active: true }).sort({ createdAt: -1 })
    res.send(jobs)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// delete job by id
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

// delete application job by id
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

// Get all applications
routerJobs.get('/applications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const applicationDeleted = await jobApplicationModel.find().sort({ createdAt: -1 }).populate('job')

    res.send(applicationDeleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// update state job (active/disabled)
routerJobs.post('/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { active, jobId } = updateStatusJobValidation.parse(req.body)
    const job = await jobsModel.updateOne({ _id: jobId }, { active })

    res.send(job)
  } catch (error) {
    res.status(500).send(String(error))
  }
})