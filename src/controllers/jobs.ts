import { authMiddleware } from '@/middleware'
import { jobApplicationModel } from '@/models/job_applications'
import { jobsModel } from '@/models/jobs'
import type { JobsWithApplicationsCountResponse } from '@/utils/interfaces'
import {
  createAndUpdateJobValidation,
  updateStatusJobValidation
} from '@/utils/validations'
import { Router, type Request, type Response } from 'express'

export const routerJobs = Router()

// Create a new job
routerJobs.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = await createAndUpdateJobValidation.parse(req.body)

    const newJob = await jobsModel.create(data)
    res.send(newJob)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// update state job (active/disabled)
routerJobs.put('/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { active, jobId } = updateStatusJobValidation.parse(req.body)
    const job = await jobsModel.updateOne({ _id: jobId }, { active })

    res.send(job)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// Update a job by id
routerJobs.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = await createAndUpdateJobValidation.parse(req.body)

    const jobUpdated = await jobsModel.updateOne({ _id: req.params.id }, data)

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

    const response: JobsWithApplicationsCountResponse[] = []

    for (const job of jobs) {
      const applicationsCount = await jobApplicationModel.countDocuments({ job: job._id })
      response.push({ ...job.toObject(), applicationsCount })
    }

    res.send(response)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// Get all jobs for websites
routerJobs.get('/all', async (req: Request, res: Response) => {
  try {
    const jobs = await jobsModel.find({ active: true }).sort({ createdAt: -1 })
    // const jobs = await jobsModel.find()
    res.send(jobs)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// get specific job by id
routerJobs.get('/detail/:jobId', async (req: Request, res: Response) => {
  try {
    const data = req.params
    if (!data.jobId) throw new Error('jobId is required')
    const job = await jobsModel.findById(data.jobId)

    res.send(job)
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
