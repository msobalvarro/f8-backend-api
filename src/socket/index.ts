import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

declare global {
  // eslint-disable-next-line
  var _io: SocketIOServer | undefined
}

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  if (!global._io) {
    global._io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*', // Cambia esto según tu configuración de seguridad
      },
    })
    console.log('Socket.IO initialized')
  }
  return global._io
}

export const getSocket = (): SocketIOServer => {
  if (!global._io) {
    throw new Error('Socket.IO is not initialized')
  }
  return global._io
}