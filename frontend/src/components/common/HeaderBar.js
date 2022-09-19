import React, {useState} from "react";
import {
    AppBar,
    Box,
    Button,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

import ChangePasswordDialog from "../Dialogs/ChangePasswordDialog";
import DeleteAccountDialog from "../Dialogs/DeleteAccountDialog";
import SignOutDialog from "../Dialogs/SignOutDialog";
import MatchingDialog from "../Dialogs/MatchingDialog";

const menu = ['Delete Account', 'Change Password'];

function HeaderBar() {

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
    const [openSignOutDialog, setOpenSignOutDialog] = useState(false);

    const handleMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleMenuAction = (action) => {
        console.log(action + " has been clicked");
        if (action === menu[1]) {
            setOpenChangePasswordDialog(true);
        } else {
            setOpenDeleteAccountDialog(true);
        }
        handleCloseUserMenu();
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const MenuDropdown = () => {
        return (
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {menu.map((action) => (
                    <MenuItem key={action} onClick={e => handleMenuAction(action)}>
                        <Typography textAlign="center" variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro'}}>{action}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        );
    }

    return (
        <AppBar position="fixed" color="transparent" elevation={0} sx={{borderBottom: 0.5, borderColor: 'lightgray'}}>
            <Toolbar>
                <Typography variant={"h1"} sx={{ flexGrow: 1, fontSize: '64', fontFamily: 'Raleway'}}>PeerPrep</Typography>
                <Box sx={{ flexGrow: 0 }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <MenuDropdown />
                </Box>
                <Button variant={"outlined"} onClick={e => setOpenSignOutDialog(true)}>Sign Out</Button>
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

export default HeaderBar;
