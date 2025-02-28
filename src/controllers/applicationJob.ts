import { apiLimiterDefault, authMiddleware } from '@/middleware'
import { jobsModel } from '@/models/jobs'
import { createApplicationJob } from '@/utils/validations'
import { Router, type Request, type Response } from 'express'
import { jobApplicationModel } from '@/models/job_applications'
import { getSocket } from '@/socket'

export const routerApplicationJobs = Router()


// Apply for a job
routerApplicationJobs.post('/apply',  async (req: Request, res: Response) => {
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

    getSocket().emit('newApplication', {
      name: data.fullName,
      jobTitle: job.title
    })

    res.send(newApplication)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// delete application job by id
routerApplicationJobs.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = req.params
    if (!req.params.id) throw new Error('jobId is required')
    const applicationDeleted = await jobApplicationModel.deleteOne({ _id: req.params.id })

    res.send(applicationDeleted)
  } catch (error) {
    res.status(500).send(String(error))
  }
})


// Get all applications for a job by id
routerApplicationJobs.get('/job/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const applications = await jobApplicationModel
      .find({ job: { _id: req.params.id } })
      .sort({ createdAt: -1 })
      .select('-job')

    res.send(applications)
  } catch (error) {
    res.status(500).send(String(error))
  }
})


// Get all applications
routerApplicationJobs.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('test')
    const applications = await jobApplicationModel.find().sort({ createdAt: -1 }).populate('job')

    res.send(applications)
  } catch (error) {
    res.status(500).send(String(error))
  }
})

// get application detail by id
routerApplicationJobs.get('/detail/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const application = await jobApplicationModel.findById(req.params.id).populate('job')

    res.send(application)
  } catch (error) {
    res.status(500).send(String(error))
  }
})