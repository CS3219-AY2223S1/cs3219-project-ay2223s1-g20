import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import IconButton from '@mui/material/IconButton'

import ChangePasswordDialog from '../Dialogs/ChangePasswordDialog'
import DeleteAccountDialog from '../Dialogs/DeleteAccountDialog'
import SignOutDialog from '../Dialogs/SignOutDialog'
import { getUsername } from '../../api/cookieApi'

const menu = ['Delete Account', 'Change Password']

function HeaderBar (props) {
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false)
  const [openSignOutDialog, setOpenSignOutDialog] = useState(false)
  const [showUserActions, setShowUserActions] = useState(false)

  useEffect(() => {
    setShowUserActions(props.showUserActions)
  }, [])

  const handleMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleMenuAction = (action) => {
    console.log(action + ' has been clicked')
    if (action === menu[1]) {
      setOpenChangePasswordDialog(true)
    } else {
      setOpenDeleteAccountDialog(true)
    }
    handleCloseUserMenu()
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const MenuDropdown = () => {
    return (
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {menu.map((action) => (
                    <MenuItem key={action} onClick={e => handleMenuAction(action)}>
                        <Typography textAlign="center" variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>{action}</Typography>
                    </MenuItem>
                ))}
            </Menu>
    )
  }

  return (
        <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: 0.5, borderColor: 'lightgray', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant={'h1'} sx={{ flexGrow: 1, fontSize: '64', fontFamily: 'Raleway' }}>PeerPrep</Typography>
                <Box display={'flex'} flexDirection={'row'} sx={{ flexGrow: 0 }}>
                    <Typography class={'source'} sx={{ paddingTop: 1.5 }}>{getUsername()}</Typography>
                    {showUserActions && <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>}
                    <MenuDropdown />
                </Box>
                {showUserActions && <Button variant={'outlined'} onClick={e => setOpenSignOutDialog(true)}>Sign Out</Button>}
            </Toolbar>
            {openChangePasswordDialog &&
                <ChangePasswordDialog
                    open={openChangePasswordDialog}
                    setOpen={setOpenChangePasswordDialog}
                />
            }
            {openDeleteAccountDialog &&
                <DeleteAccountDialog
                    open={openDeleteAccountDialog}
                    setOpen={setOpenDeleteAccountDialog}
                />
            }
            {openSignOutDialog &&
                <SignOutDialog
                    open={openSignOutDialog}
                    setOpen={setOpenSignOutDialog}
                />
            }

        </AppBar>
  )
}

export default HeaderBar
