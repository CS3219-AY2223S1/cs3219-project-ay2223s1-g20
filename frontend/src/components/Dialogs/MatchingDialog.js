import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'
import { getUsername } from '../../api/cookieApi'
import { getMatchingSocket } from '../../api/socketApi'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { MATCH_SUCCESS, MATCH_PENDING, MATCH_FAILED } from '../../util/constants'
// import { setStorageValue } from "../../api/localStorageApi";

export default function MatchingDialog (props) {
  const navigate = useNavigate()

  const [matchStatus, setMatchStatus] = useState(MATCH_PENDING)
  const [description, setDescription] = useState('')
  const [matchID, setMatchID] = useState('')
  const [timer, setTimer] = useState(30)
  let countdown = null

  const handleClose = () => {
    props.setOpen(false)
    console.log('emit leave event')
    getMatchingSocket().emit('leave')
  }

  const handleMatchFail = useCallback((message) => {
    setMatchStatus(MATCH_FAILED)
    setDescription(message)
    // console.log(MATCH_FAILED + ': ' + message);
  }, [])

  const handleMatchPending = useCallback((message) => {
    setMatchStatus(MATCH_PENDING)
    setDescription(message)
    // console.log(MATCH_PENDING + ': ' + message);
  }, [])

  const handleMatchSuccess = useCallback((response) => {
    setMatchStatus(MATCH_SUCCESS)
    setDescription(response.message)
    // TODO: perform some action to store the room info
    // setStorageValue(MATCH_ID, response.matchID);
    // setMatchId(response.matchID);
    setMatchID(response.matchID)
    console.log(matchID)
    console.log(MATCH_SUCCESS + ': ' + response.message)
  }, [])

  const match = (level) => {
    const matchingSocket = getMatchingSocket()
    matchingSocket.emit('match', { username: getUsername(), difficulty: level })
    matchingSocket.on(MATCH_FAILED, handleMatchFail)
    matchingSocket.on(MATCH_PENDING, handleMatchPending)
    matchingSocket.on(MATCH_SUCCESS, handleMatchSuccess)
  }

  useEffect(() => {
    match(props.difficulty)
    countdown = setInterval(() => {
      setTimer((time) => time - 1)
      if (timer <= 0) {
        clearInterval(countdown)
      }
    }, 1000)
    return () => { clearInterval(countdown) }
  }, [])

  useEffect(() => {
    if (timer === 0) {
      clearInterval(countdown)
      setMatchStatus(MATCH_FAILED)
      setDescription('Please try again later.')
      getMatchingSocket().emit('leave')
    }
  }, [timer])

  useEffect(() => {
    if (matchStatus === MATCH_SUCCESS) {
      setTimeout(() => {
        navigate('/room', { state: { matchID, difficulty: props.difficulty } })
      }, 3000)
    }
  }, [matchStatus])

  const MatchPendingContent = () => {
    return (
            <Box display={'flex'} justifyContent="center" alignItems="center" flexDirection="column">
                <DialogContent sx={{ width: '30vw', paddingX: 2, paddingBottom: 1, paddingTop: 2 }}>
                    <Box display={'flex'} justifyContent="center" alignItems="center">
                        <CircularProgress variant="determinate" value={(timer / 30) * 100} size={80}/>
                    </Box>
                    <DialogContentText>
                        <Box display={'flex'} justifyContent="center" alignItems="center">
                            <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>{timer} seconds...</Typography>
                        </Box>
                    </DialogContentText>
                </DialogContent>

                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>{"We're looking for a match..."}</Typography>
                    {/* <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        >
                        <CloseIcon />
                    </IconButton> */}
                </DialogTitle>
                <DialogContent sx={{ width: '30vw' }}>
                    <DialogContentText>
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>{description}</Typography>
                    </DialogContentText>
                </DialogContent>
            </Box>
    )
  }

  const MatchFailedContent = () => {
    return (
            <>
                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>We could not find a match for you :&#40;</Typography>
                    {/* <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        >
                        <CloseIcon />
                    </IconButton> */}
                </DialogTitle>
                <DialogContent sx={{ width: '30vw' }}>
                    <DialogContentText>
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>{description}</Typography>
                    </DialogContentText>
                </DialogContent>
            </>
    )
  }

  const MatchSuccessContent = () => {
    return (
            <>
                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>Match Found!</Typography>
                    {/* <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        >
                        <CloseIcon />
                    </IconButton> */}
                </DialogTitle>
                <DialogContent sx={{ width: '30vw' }}>
                    <DialogContentText>
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>Match Success! Please wait a while for us to redirect you...</Typography>
                    </DialogContentText>
                </DialogContent>
            </>
    )
  }

  return (
        <Dialog open={props.open} onClose={handleClose} sx={{ minWidth: '30vw' }}>
            { (matchStatus === MATCH_SUCCESS) && <MatchSuccessContent /> }
            { (matchStatus === MATCH_PENDING) && <MatchPendingContent /> }
            { (matchStatus === MATCH_FAILED) && <MatchFailedContent />}
        </Dialog>
  )
}
