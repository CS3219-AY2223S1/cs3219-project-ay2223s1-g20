import { URI_MATCHING_SVC, URI_COLLAB_SVC } from '../util/configs'
import io from 'socket.io-client'

export let matchingSocket = null
export let collabSocket = null

// ----- MATCHING SOCKET -----
export const setMatchingSocket = (socket) => {
  matchingSocket = socket
}

export const haveMatchingSocket = () => {
  return matchingSocket != null
}

export const getMatchingSocket = () => {
  if (!haveMatchingSocket()) {
    console.log('matchingsocket connecting')
    const socket = io(URI_MATCHING_SVC, { transports: ['websocket'] })
    socket.connect()
    setMatchingSocket(socket)
  }
  console.log('matchingsocket: ', matchingSocket)
  return matchingSocket
}

// ----- COLLAB SOCKET -----
export const setCollabSocket = (socket) => {
  collabSocket = socket
}

export const haveCollabSocket = () => {
  return collabSocket != null
}

export const getCollabSocket = () => {
  if (!haveCollabSocket()) {
    console.log('collabsocket connecting')
    const collabSocket = io(URI_COLLAB_SVC, { transports: ['websocket'] })
    collabSocket.connect()
    setCollabSocket(collabSocket)
  }
  console.log('collabsocket: ', collabSocket)
  return collabSocket
}
