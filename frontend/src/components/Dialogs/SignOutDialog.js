import React, { useState } from 'react'
import {
  Box,
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
import { USER_SVC_PREFIX, LOG_OUT } from '../../util/configs'
import { STATUS_CODE_SUCCESS } from '../../util/constants'
import { post } from '../../api/baseApi'
import { getJwtToken, isAuthenticated, removeJwtAndUsernameCookie } from '../../api/cookieApi'
import { useNavigate } from 'react-router-dom'
import Loading from '../common/loading'
import Completed from '../common/completed'

export default function SignOutDialog (props) {
  const navigate = useNavigate()

  const jwtToken = getJwtToken()

  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signoutCompleted, setSignoutCompleted] = useState(false)

  const handleClose = () => {
    props.setOpen(false)
  }

  const handleSignOut = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { error: true } })
      return
    }

    const json = JSON.stringify(jwtToken)
    setLoading(true)
    const response = post(USER_SVC_PREFIX + LOG_OUT, json)
    setLoading(false)

    response
      .then((res) => {
        if (res.status !== STATUS_CODE_SUCCESS) {
          setShowErrorMsg(true)
          return
        }
        return res
      })
      .then(res => res.json())
      .then(res => {
        setSignoutCompleted(true)
        setTimeout(() => {
          removeJwtAndUsernameCookie()
          navigate('/')
        }, 2000)
      })
  }

  const SignOutDialogContent = () => {
    return (
            <>
                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>Sign Out</Typography>
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
                        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>Would you like to sign out of your account?</Typography>
                    </DialogContentText>
                    {showErrorMsg && (
                        <Box display={'flex'} justifyContent="center" alignItems="left">
                            <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color: 'red' }}>Something went wrong. Please try again later.</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant={'contained'} onClick={handleSignOut}>Sign Out</Button>
                </DialogActions>
            </>
    )
  }

  return (
        <Dialog open={props.open} onClose={handleClose} sx={{ minWidth: '30vw' }}>
            { loading && <Loading />}
            { (!loading && !signoutCompleted) && <SignOutDialogContent /> }
            { signoutCompleted && <Completed type={'success'} text={'You have been signed out. You will be redirected soon...'} />}
        </Dialog>
  )
}
