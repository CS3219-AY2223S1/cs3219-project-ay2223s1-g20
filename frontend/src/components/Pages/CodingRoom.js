import {
  Box
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeaderBar from '../common/HeaderBar'
import LeaveRoomDialog from '../Dialogs/LeaveRoomDialog'
import CloseRoomDialog from '../Dialogs/CloseRoomDialog'
import QuestionDrawer from '../Drawers/QuestionDrawer'
import Editor from '../common/CodeEditor'
import { getSocket } from '../../api/socketApi'
import { CLOSE_ROOM } from '../../util/constants'
import { isInRoom, removeMatchId, setMatchId } from '../../api/cookieApi'
import ChatDrawer from '../Drawers/ChatDrawer'

function CodingRoom () {
  const navigate = useNavigate()
  const location = useLocation()

  const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false)
  const [showCloseRoomDialog, setShowCloseRoomDialog] = useState(false)
  const [isInPair, setIsInPair] = useState(true)

  // ------- HANDLE LEAVE ROOM ------
  useEffect(() => {
    if (location.pathname !== '/room') {
      handleLeaveRoom()
    }
  }, [location])

  const handleLocationChange = (e) => {
    e.preventDefault()
    e.returnValue = 'Are you sure you want to leave your room?\n This action cannot be undone.'
    return 'Are you sure you want to leave your room?\n This action cannot be undone.'
  }

  const handleLeaveRoom = () => {
    if (isInPair) {
      console.log('emit leave event')
      getSocket().emit('leave')
    }
    removeMatchId()
    navigate('/landing')
  }

  const handleBackButtonClick = (e) => {
    console.log('back button pressed')
    e.preventDefault()
    setShowLeaveRoomDialog(true)
  }

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname)
    window.addEventListener('popstate', handleBackButtonClick)
    window.addEventListener('unload', handleLocationChange)
    window.addEventListener('beforeunload', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleBackButtonClick)
      window.removeEventListener('unload', handleLocationChange)
      window.removeEventListener('beforeunload', handleLocationChange)
    }
  }, [])

  // ----- HANDLE CLOSE ROOM -----
  const handleCloseRoom = () => {
    // If we receive a handle closeRoom event, we tell the user with a popup.
    setIsInPair(false)
    setShowCloseRoomDialog(true)
  }

  useEffect(() => {
    getSocket().on(CLOSE_ROOM, handleCloseRoom)
  }, [])

  useEffect(() => {
    if (location.state == null) {
      if (!isInRoom()) {
        navigate('/landing')
      }
    } else {
      setMatchId(location.state.matchID)
    }
  })

  const handleOnClick = () => {
    setShowLeaveRoomDialog(true)
  }

  const CodingRoomContent = () => {
    return (
      <Box display={'flex'} flexDirection={'horizontal'}>
          <QuestionDrawer />

          <Box display={'flex'} justifyContent="center" alignItems="center" width="50vw" sx={{ mt: '65px', height: 'calc(100vh - 65px)' }}>
            <Editor handleOnClick={handleOnClick}/>
          </Box>

          <ChatDrawer />
      </Box>
    )
  }

  return (
        <Box>
            <HeaderBar />
            <CodingRoomContent />
            {showLeaveRoomDialog && <LeaveRoomDialog open={showLeaveRoomDialog} setOpen={setShowLeaveRoomDialog} handleLeaveRoom={handleLeaveRoom}/>}
            {showCloseRoomDialog && <CloseRoomDialog open={showCloseRoomDialog} setOpen={setShowCloseRoomDialog} handleLeaveRoom={handleLeaveRoom}/>}
        </Box>

  )
}

export default CodingRoom
