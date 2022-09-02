import React, {useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {USER_SVC_PREFIX, ACCOUNTS} from "../../util/configs";
import {STATUS_CODE_SUCCESS} from "../../util/constants";
import { del } from "../../api/baseApi";
import { getUsername, getJwtToken, removeJwtAndUsernameCookie } from '../../api/cookieApi';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccountDialog(props) {
    const navigate = useNavigate();

    const jwtToken = getJwtToken();
    const username = getUsername();

    const [showErrorMsg, setShowErrorMsg] = useState(false);

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleDeleteAccount = () => {
        // ---- SEND TO USER SERVICE ----
        const json = JSON.stringify({ jwt: jwtToken });
        let response = del(USER_SVC_PREFIX + ACCOUNTS + username, json);

        response
            .then((res) => {
                if (res.status !== STATUS_CODE_SUCCESS) {
                    setShowErrorMsg(true);
                    return;
                }
            })
            .then(res => res.json())
            .then(res => {
                handleClose();
                removeJwtAndUsernameCookie();
                navigate("/");
            })
    }

    return (
        <Dialog open={props.open} onClose={handleClose} sx={{minWidth:'30vw'}}>
            <DialogTitle>
                <Typography variant={"h3"} class={"poppins"}>Delete Account</Typography>
                <IconButton
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
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{width:'30vw'}}>
                <DialogContentText>
                    <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro'}}>
                        Would you like to delete your account? This action is cannot be undone.
                    </Typography>
                </DialogContentText>
                {showErrorMsg && (
                    <Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color:'red'}}>Something went wrong. Please try again later.</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant={"contained"} onClick={handleDeleteAccount}>Delete Account</Button>
            </DialogActions>
        </Dialog>
    );
}
