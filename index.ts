import express from 'express'
import http from 'http'
import cors from 'cors'
import { routerLogin } from './src/controllers/login'
import { connect } from 'mongoose'
import { DB, PORT } from './src/utils/constants'
import { initializeSocket } from './src/socket'
import { routerMessage } from './src/controllers/message'
import { routerPreference } from './src/controllers/preferences'
import { routerProducts } from './src/controllers/products'
import { routerService } from './src/controllers/services'
import { routerImage } from './src/controllers/files'
import { routerUser } from '@/controllers/user'

const app = express()

// Middleware para analizar JSON
app.use(express.json())
app.use(cors())

connect(DB).then(() => {
  app.use('/login', routerLogin)
  app.use('/message', routerMessage)
  app.use('/preferences', routerPreference)
  app.use('/products', routerProducts)
  app.use('/services', routerService)
  app.use('/images', routerImage)
  app.use('/user', routerUser)

  const server = http.createServer(app)
  const io = initializeSocket(server)

  io.on('connection', (client) => {
    console.log('Client connected ', client.id)
  })

  // Inicia el servidor
  server.listen(PORT, () => {
    console.log(`server running on PORT:${PORT}`)
  })
})

