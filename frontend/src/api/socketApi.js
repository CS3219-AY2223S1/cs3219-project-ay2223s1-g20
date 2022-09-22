import { URI_MATCHING_SVC } from '../util/configs'
import io from 'socket.io-client'

export let ioSocket = null

export const setSocket = (socket) => {
  ioSocket = socket
}

export const haveSocket = () => {
  return ioSocket != null
}

export const getSocket = () => {
  if (!haveSocket()) {
    console.log('socket connecting')
    const socket = io(URI_MATCHING_SVC, { transports: ['websocket'] })
    socket.connect()
    setSocket(socket)
  }
  console.log(ioSocket)
  return ioSocket
}
