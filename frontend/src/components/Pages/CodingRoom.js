import {
  Box,
  Button,
  Typography
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeaderBar from '../common/HeaderBar'

import LeaveRoomDialog from '../Dialogs/LeaveRoomDialog'
import CloseRoomDialog from '../Dialogs/CloseRoomDialog'
import { getSocket } from '../../api/socketApi'
import { CLOSE_ROOM } from '../../util/constants'
// import { removeMatchId, setMatchId } from "../../api/localStorageApi";
import { isInRoom, removeMatchId, setMatchId } from '../../api/cookieApi'

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
            <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" minHeight="100vh">
                <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" width="80vw">
                    <Typography variant={'h1'} class={'poppins'}>{"Let's start coding!"}</Typography>
                    <Box display={'flex'} width='100%' justifyContent="center" alignItems="center" sx={{ marginTop: 1 }}>
                        <Button variant={'contained'} onClick={(e) => handleOnClick()} fullWidth>Leave Room</Button>
                    </Box>
                </Box>
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
