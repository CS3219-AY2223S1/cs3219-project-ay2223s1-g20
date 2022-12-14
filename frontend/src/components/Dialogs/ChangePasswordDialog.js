import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { USER_SVC_PREFIX, ACCOUNTS } from '../../util/configs'
import { STATUS_CODE_SUCCESS, ERR_INCORRECT_PASSWORD, ERR_UNKNOWN_USERNAME } from '../../util/constants'
import { put } from '../../api/baseApi'
import { getUsername, getJwtToken, isAuthenticated } from '../../api/cookieApi'
import Loading from '../common/loading'
import Completed from '../common/completed'

export default function ChangePasswordDialog (props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [showNetworkErrorMsg, setShowNetworkErrorMsg] = useState(false)
  const [completedChangePassword, setCompletedChangePassword] = useState(false)

  const jwtToken = getJwtToken()
  const username = getUsername()

  const handleClose = () => {
    props.setOpen(false)
  }

  const resetErrorMsgs = () => {
    setShowErrorMsg(false)
    setShowNetworkErrorMsg(false)
  }

  const getErrorMsgToDisplay = (err) => {
    if (err === ERR_INCORRECT_PASSWORD) {
      return 'The old password is incorrect.'
    } else if (err === ERR_UNKNOWN_USERNAME) {
      return 'Username is incorrect.'
    } else {
      return 'Something went wrong.'
    }
  }

  const handlePasswordChange = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { error: true } })
      return
    }

    resetErrorMsgs()

    // ---- CHECK INPUT VALIDITY ----
    const anyFieldNotFilled = oldPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0
    const passwordNotSame = newPassword !== confirmPassword

    if (anyFieldNotFilled) {
      setErrorMsg('Please fill in all fields.')
      setShowErrorMsg(true)
      return
    } else if (passwordNotSame) {
      setErrorMsg('The two passwords do not match.')
      setShowErrorMsg(true)
      return
    } else {
      setShowErrorMsg(false)
    }

    // ---- SEND TO USER SERVICE ----
    const json = JSON.stringify({
      ...jwtToken,
      old_password: oldPassword,
      new_password: newPassword
    })
    setLoading(true)
    const response = await put(USER_SVC_PREFIX + ACCOUNTS + username, json)
    const data = await response.json()
    setLoading(false)

    if (response.status === STATUS_CODE_SUCCESS) {
      setCompletedChangePassword(true)
      setTimeout(() => {
        handleClose()
      }, 3000)
    } else {
      setErrorMsg(getErrorMsgToDisplay(data.err))
      setShowErrorMsg(true)
    }
  }

  const ChangePasswordDialogContent = () => {
    return (
            <>
                <DialogTitle>
                    <Typography variant={'h3'} class={'poppins'}>Change Password</Typography>
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
                    {showErrorMsg && (
                        <Box display={'flex'} alignItems="left">
                            <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color: 'red' }}>{errorMsg}</Typography>
                        </Box>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Old Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        inputProps={{ style: { fontFamily: 'Source Sans Pro' } }}
                        InputLabelProps={{ style: { fontFamily: 'Source Sans Pro' } }}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        inputProps={{ style: { fontFamily: 'Source Sans Pro' } }}
                        InputLabelProps={{ style: { fontFamily: 'Source Sans Pro' } }}
                    />
                    <TextField
                        margin="dense"
                        id="confirmpassword"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{ style: { fontFamily: 'Source Sans Pro' } }}
                        InputLabelProps={{ style: { fontFamily: 'Source Sans Pro' } }}
                    />
                    {showNetworkErrorMsg && (
                        <Box display={'flex'} justifyContent="center" alignItems="left">
                            <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color: 'red' }}>Something went wrong. Please try again later.</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant={'contained'} onClick={handlePasswordChange}>Change Password</Button>
                </DialogActions>
            </>
    )
  }

  return (
        <Dialog open={props.open} onClose={handleClose} sx={{ minWidth: '40vw' }} alignItems="center" justifyContent="center">
            { loading && <Loading /> }
            { (!loading && !completedChangePassword) && ChangePasswordDialogContent()}
            { completedChangePassword && <Completed type={'success'} text={'Your password has been changed.'} />}
        </Dialog>
  )
}
