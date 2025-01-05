import express from 'express'
import http from 'http'
import { routerLogin } from './controllers/login'
import { connect } from 'mongoose'
import { DB, PORT } from './utils/constants'
import { initializeSocket } from './socket'
import { routerMessage } from './controllers/message'
import { routerPreference } from './controllers/preferences'
import { routerProducts } from './controllers/products'
const app = express()

// Middleware para analizar JSON
app.use(express.json())

connect(DB).then(() => {
  app.use('/login', routerLogin)
  app.use('/messages', routerMessage)
  app.use('/preferences', routerPreference)
  app.use('/products', routerProducts)
  
  const server = http.createServer(app)
  const io = initializeSocket(server)

  io.on('connection', (client) => { 
    console.log('Client connected ', client.id)
  })
  
  // Inicia el servidor
  app.listen(PORT, () => {
    console.log(`server running on PORT:${PORT}`)
  })
})

