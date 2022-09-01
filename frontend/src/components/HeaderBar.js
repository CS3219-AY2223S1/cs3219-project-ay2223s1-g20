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
import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import {Link, useNavigate} from "react-router-dom";

const menu = ['Delete Account', 'Change Password'];

function HeaderBar() {
    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleSignOut = (event) => {
        navigate("/login");
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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
                        {menu.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Button variant={"outlined"} onClick={handleSignOut}>Sign Out</Button>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderBar;
