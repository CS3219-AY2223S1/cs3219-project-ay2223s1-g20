import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Loading from '../common/loading'
import Completed from '../common/completed'

export default function CloseRoomDialog (props) {
  // const [loading, setLoading] = useState(false)
  // const [signoutCompleted, setSignoutCompleted] = useState(false)
  const loading = false
  const signoutCompleted = false

  const handleClose = () => {
    props.setOpen(false)
  }

  function CloseRoomDialogContent () {
    return (
      <>
        <DialogTitle>
          <Typography variant="h3" class="poppins">Your partner left :&#40;</Typography>
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
            <Typography variant="body" sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>Do you want to continue working in this room?</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleLeaveRoom}>Leave Room</Button>
          <Button variant="contained" onClick={handleClose}>Continue</Button>
        </DialogActions>
      </>
    )
  }

  return (
    <Dialog open={props.open} onClose={handleClose} sx={{ minWidth: '30vw' }}>
      { loading && <Loading />}
      { (!loading && !signoutCompleted) && <CloseRoomDialogContent /> }
      { signoutCompleted && <Completed type={'success'} text="You have been signed out. You will be redirected soon..." />}
    </Dialog>
  )
}
