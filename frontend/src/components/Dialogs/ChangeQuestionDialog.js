import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { getCollabSocket } from '../../api/socketApi'
import Completed from '../common/completed'

export default function ChangeQuestionDialog (props) {
  const [dialogToShow, setDialogToShow] = useState(props.type)

  useEffect(() => {
    const collabSocket = getCollabSocket()
    collabSocket.on('changeQuestionRes', handleResponse)
  }, [])

  useEffect(() => {
    if (dialogToShow === 'rejected') {
      setTimeout(() => {
        setDialogToShow('request')
        handleClose()
      }, 2000)
    }
  }, [dialogToShow])

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return
    }
    props.setOpen(false)
  }

  const requestQuestionChange = () => {
    getCollabSocket().emit('changeQuestion')
    setDialogToShow('waitingPartner')
  }

  const handleResponse = useCallback((rsp) => {
    setDialogToShow(rsp ? 'waitingQuestion' : 'rejected')
  }, [])

  const rejectQuestionChange = () => {
    getCollabSocket().emit('changeQuestionRsp', false)
    handleClose()
  }

  const acceptQuestionChange = () => {
    getCollabSocket().emit('changeQuestionRsp', true)
    setDialogToShow('waitingQuestion')
  }

  const RequestChangeDialogContent = () => {
    return (
            <>
                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>Change Question</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: (theme) => theme.palette.grey[500]
                        }}
                        >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ width: '30vw' }}>
                    <DialogContentText>
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>
                            Would you like to change the question? Your partner will have to approve the change.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant={'contained'} onClick={requestQuestionChange}>Change Question</Button>
                </DialogActions>
            </>
    )
  }

  const ReceiveChangeDialogContent = () => {
    return (
          <>
              <DialogTitle>
                  <Typography variant={'h3'} class={'poppins'}>Change Question</Typography>
                  <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                      }}
                      >
                      <CloseIcon />
                  </IconButton>
              </DialogTitle>
              <DialogContent sx={{ width: '30vw' }}>
                  <DialogContentText>
                      <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>
                          Your partner has requested to change the question. Would you like to approve the change?
                      </Typography>
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={rejectQuestionChange}>Cancel</Button>
                  <Button variant={'contained'} onClick={acceptQuestionChange}>Change Question</Button>
              </DialogActions>
          </>
    )
  }

  const AwaitingResponseDialogContent = (text) => {
    return (
      <Box display={'flex'} justifyContent="center" alignItems="center" flexDirection="column" sx={{ width: '35vw', height: '23vh' }}>
        <DialogContent sx={{ width: '30vw', height: '20vh' }}>
            <Box display={'flex'} justifyContent="center" alignItems="center">
                <CircularProgress size={80}/>
            </Box>
            <DialogTitle>
                <Box display={'flex'} justifyContent="center" alignItems="center">
                    <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>{text.text}</Typography>
                </Box>
            </DialogTitle>
        </DialogContent>
      </Box>
    )
  }

  return (
        <Dialog open={props.open} onClose={handleClose} sx={{ minWidth: '30vw' }}>
          { dialogToShow === 'request' && <RequestChangeDialogContent /> }
          { dialogToShow === 'receive' && <ReceiveChangeDialogContent /> }

          { dialogToShow === 'waitingPartner' && <AwaitingResponseDialogContent text='Waiting for your partner...' /> }
          { dialogToShow === 'waitingQuestion' && <AwaitingResponseDialogContent text='Waiting for new question...' /> }
          { dialogToShow === 'rejected' && <Completed type={'failed'} text='Your partner does not want to change the question!' />}
        </Dialog>
  )
}
