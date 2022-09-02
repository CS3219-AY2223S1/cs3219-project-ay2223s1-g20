import React, {useState} from 'react';
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
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {USER_SVC_PREFIX, ACCOUNTS} from "../../util/configs";
import {STATUS_CODE_SUCCESS} from "../../util/constants";
import { put } from "../../api/baseApi";
import { getUsername, getJwtToken } from '../../api/cookieApi';

export default function ChangePasswordDialog(props) {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [showNetworkErrorMsg, setShowNetworkErrorMsg] = useState(false);

    const jwtToken = getJwtToken();
    const username = getUsername();

    const handleClose = () => {
        props.setOpen(false);
    };

    const handlePasswordChange = () => {
        // ---- CHECK INPUT VALIDITY ----
        if (password.length === 0 || confirmPassword.length === 0 || password !== confirmPassword) {
            setShowErrorMsg(true);
            return;
        } else {
            setShowErrorMsg(false);
        }

        // ---- SEND TO USER SERVICE ----
        const json = JSON.stringify({
            jwt: jwtToken,
            old_password: password,
            new_password: confirmPassword
        });
        let response = put(USER_SVC_PREFIX + ACCOUNTS + username, json);

        response
            .then((res) => {
                if (res.status !== STATUS_CODE_SUCCESS) {
                    setShowNetworkErrorMsg(true);
                    return;
                }
            })
            .then(res => res.json())
            .then(res => {
                handleClose();
            })

    }

    return (
        <Dialog open={props.open} onClose={handleClose} sx={{minWidth:'30vw'}}>
            <DialogTitle>
                <Typography variant={"h3"} class={"poppins"}>Change Password</Typography>
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
                {showErrorMsg && (
                    <Box display={"flex"} alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color:'red'}}>The two passwords do not match.</Typography>
                    </Box>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{style: {fontFamily: 'Source Sans Pro'}}}
                    InputLabelProps={{style: {fontFamily: 'Source Sans Pro'}}}
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
                    inputProps={{style: {fontFamily: 'Source Sans Pro'}}}
                    InputLabelProps={{style: {fontFamily: 'Source Sans Pro'}}}
                />
                {showNetworkErrorMsg && (
                    <Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color:'red'}}>Something went wrong. Please try again later.</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant={"contained"} onClick={handlePasswordChange}>Change Password</Button>
            </DialogActions>
        </Dialog>
    );
}
