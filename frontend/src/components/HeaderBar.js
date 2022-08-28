import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Typography
} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function HeaderBar() {
    const navigate = useNavigate();

    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event) => {
        // setAnchorEl(event.currentTarget);
        console.log("click on menu");
    };

    const handleSignOut = (event) => {
        navigate("/signup");
    }

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    return (
        <AppBar position="fixed" color="transparent" elevation={0} sx={{borderBottom: 0.5, borderColor: 'lightgray'}}>
            <Toolbar>
                <Typography variant={"h1"} sx={{ flexGrow: 1, fontSize: '64', fontFamily: 'Raleway'}}>PeerPrep</Typography>
                <Button variant={"outlined"} onClick={handleSignOut}>Sign Out</Button>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderBar;
