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

export default function LeaveRoomDialog (props) {
  // const [loading, setLoading] = useState(false)
  // const [signoutCompleted, setSignoutCompleted] = useState(false)
  const loading = false
  const signoutCompleted = false

  const handleClose = () => {
    props.setOpen(false)
  }

  const LeaveRoomDialogContent = () => {
    return (
            <>
                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>Leave Room</Typography>
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
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>Are you sure you want to leave your room?</Typography>
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>This action cannot be undone.</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant={'contained'} onClick={props.handleLeaveRoom}>Leave Room</Button>
                </DialogActions>
            </>
    )
  }

  return (
        <Dialog open={props.open} onClose={handleClose} sx={{ minWidth: '30vw' }}>
            { loading && <Loading />}
            { (!loading && !signoutCompleted) && <LeaveRoomDialogContent /> }
            { signoutCompleted && <Completed type={'success'} text={'You have been signed out. You will be redirected soon...'} />}
        </Dialog>
  )
}
