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
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {USER_SVC_PREFIX, LOG_OUT} from "../../util/configs";
import {STATUS_CODE_SUCCESS} from "../../util/constants";
import { post } from "../../api/baseApi";
import { getJwtToken, isAuthenticated, removeJwtAndUsernameCookie } from '../../api/cookieApi';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/loading';
import Completed from '../common/completed';

export default function CloseRoomDialog(props) {
    const navigate = useNavigate();

    const jwtToken = getJwtToken();

    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signoutCompleted, setSignoutCompleted] = useState(false);

    const handleClose = () => {
        props.setOpen(false);
    };

    const CloseRoomDialogContent = () => {
        return (
            <>
                <DialogTitle>
                    <Typography variant={"h3"} class={"poppins"}>Your partner left :&#40;</Typography>
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
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro'}}>Do you want to continue working in this room?</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleLeaveRoom}>Leave Room</Button>
                    <Button variant={"contained"} onClick={handleClose}>Continue</Button>
                </DialogActions>
            </>
        )
    }

    return (
        <Dialog open={props.open} onClose={handleClose} sx={{minWidth:'30vw'}}>
            { loading && <Loading />}
            { (!loading && !signoutCompleted) && <CloseRoomDialogContent /> }
            { signoutCompleted && <Completed text={"You have been signed out. You will be redirected soon..."} />}
        </Dialog>
    );
}
