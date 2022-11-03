import {
  Box
} from '@mui/material'
import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeaderBar from '../common/HeaderBar'
import LeaveRoomDialog from '../Dialogs/LeaveRoomDialog'
import CloseRoomDialog from '../Dialogs/CloseRoomDialog'
import QuestionDrawer from '../CodingRoomComponents/QuestionDrawer'
import ChatDrawer from '../CodingRoomComponents/ChatDrawer'
import Editor from '../CodingRoomComponents/CodeEditor'
import { getCollabSocket, getMatchingSocket } from '../../api/socketApi'
import { CLOSE_ROOM } from '../../util/constants'
import { isInRoom, removeMatchId, setMatchId, getUsername } from '../../api/cookieApi'
import { getQuestionFromQuestionNum } from '../../api/questionApi'
import { postQuestionIdByUsername } from '../../api/historyApi'
import Loading from '../common/loading'

function CodingRoom () {
  const navigate = useNavigate()
  const location = useLocation()
  const matchId = location.state.matchID
  const difficulty = location.state.difficulty

  const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false)
  const [showCloseRoomDialog, setShowCloseRoomDialog] = useState(false)
  const [isInPair, setIsInPair] = useState(true)
  const [questionDataRetrieved, setQuestionDataRetrieved] = useState(false)
  const [questionData, setQuestionData] = useState({})

  // ------- HANDLE COLLAB START SESSION ------
  useEffect(() => {
    startCollabSession()
  }, [])

  const startCollabSession = () => {
    const collabSocket = getCollabSocket()
    collabSocket.emit('startSession', { roomId: matchId, username: getUsername(), difficulty })
    collabSocket.on('sessionSuccess', handleSessionStartSuccess)
  }

  const handleSessionStartSuccess = useCallback((message) => {
    const qnNum = message.questionNumber.data
    const response = getQuestionFromQuestionNum(qnNum)
    response
      .then(res => res.json())
      .then(res => {
        setQuestionData(res)
        setQuestionDataRetrieved(true)
      })
    postQuestionIdByUsername(getUsername(), qnNum)
  }, [])

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
      getMatchingSocket().emit('leave')
      getCollabSocket().emit('leaveRoom')
    }
    removeMatchId()
    navigate('/landing')
  }

  const handleBackButtonClick = (e) => {
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
    getMatchingSocket().on(CLOSE_ROOM, handleCloseRoom)
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
          <QuestionDrawer questionData={questionData}/>

          <Box display={'flex'} justifyContent="center" alignItems="center" width="50vw" sx={{ mt: '65px', height: 'calc(100vh - 65px)' }}>
            <Editor handleOnClick={handleOnClick}/>
          </Box>

          <ChatDrawer />
      </Box>
    )
  }

  const CodingRoomWrapper = () => {
    return (<Box>
      <HeaderBar />
      <CodingRoomContent />
      {showLeaveRoomDialog && <LeaveRoomDialog open={showLeaveRoomDialog} setOpen={setShowLeaveRoomDialog} handleLeaveRoom={handleLeaveRoom}/>}
      {showCloseRoomDialog && <CloseRoomDialog open={showCloseRoomDialog} setOpen={setShowCloseRoomDialog} handleLeaveRoom={handleLeaveRoom}/>}
    </Box>)
  }

  const FormattedLoading = () => {
    return (
      <Box display={'flex'} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Loading size={100}/>
      </Box>
    )
  }

  return (
    <>
      {questionDataRetrieved && <CodingRoomWrapper />}
      {!questionDataRetrieved && <FormattedLoading />}
    </>
  )
}

export default CodingRoom
