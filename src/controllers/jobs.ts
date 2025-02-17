import { authMiddleware } from '@/middleware';
import { jobsModel } from '@/models/jobs';
import type { JobsCreateProps } from '@/utils/interfaces';
import { createNewJobValidation } from '@/utils/validations';
import { Router, type Request, type Response } from 'express';

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