import React, {useEffect, useState, useCallback} from 'react';
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
import { getUsername } from '../../api/cookieApi';
import { io_socket } from "../../api/socketApi";
import { useNavigate } from 'react-router-dom';
import Loading from '../common/loading';
import { MATCH_SUCCESS, MATCH_PENDING, MATCH_FAILED } from '../../util/constants';

export default function MatchingDialog(props) {
    const navigate = useNavigate();

    const [matchStatus, setMatchStatus] = useState(MATCH_PENDING);
    const [description, setDescription] = useState('');

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleMatchFail = useCallback((message) => {
        setMatchStatus(MATCH_FAILED);
        setDescription(message);
        console.log(MATCH_FAILED + ': ' + message);
    }, []);

    const handleMatchPending = useCallback((message) => {
        setMatchStatus(MATCH_PENDING);
        setDescription(message);
        console.log(MATCH_PENDING + ': ' + message);
    }, []);

    const handleMatchSuccess = useCallback((message) => {
        setMatchStatus(MATCH_SUCCESS);
        setDescription(message);
        console.log(MATCH_SUCCESS + ': ' + message);
    }, []);

    const match = (level) => {
        io_socket.emit('match', {username: getUsername(), difficulty: level});
        io_socket.on(MATCH_FAILED, handleMatchFail);
        io_socket.on(MATCH_PENDING, handleMatchPending);
        io_socket.on(MATCH_SUCCESS, handleMatchSuccess);
    }

    useEffect(() => {
        match(props.difficulty);
    }, [])

    useEffect(() => {
        if (matchStatus === MATCH_SUCCESS) {
            setTimeout(() => {
                navigate("/room");
            }, 3000)
        }
    }, [matchStatus])

    const MatchPendingContent = () => {
        return (
            <div sx={{width:'30vw'}}>
                <DialogContent sx={{width:'30vw'}}>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Loading size={80}/>
                    </Box>
                </DialogContent>

                <DialogTitle>
                    <Typography variant={"h3"} class={"poppins"}>We're looking for a match...</Typography>
                    {/* <IconButton
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
                    </IconButton> */}
                </DialogTitle>
                <DialogContent sx={{width:'30vw'}}>
                    <DialogContentText>
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro'}}>{description}</Typography>
                    </DialogContentText>
                </DialogContent>
            </div>
        )
    }

    const MatchFailedContent = () => {
        return (
            <>
                <DialogTitle>
                    <Typography variant={"h3"} class={"poppins"}>We could not find a match for you :&#40;</Typography>
                    {/* <IconButton
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
                    </IconButton> */}
                </DialogTitle>
                <DialogContent sx={{width:'30vw'}}>
                    <DialogContentText>
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro'}}>{description}</Typography>
                    </DialogContentText>
                </DialogContent>
            </>
        )
    }

    const MatchSuccessContent = () => {
        return (
            <>
                <DialogTitle>
                    <Typography variant={"h3"} class={"poppins"}>Match Found!</Typography>
                    {/* <IconButton
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
                    </IconButton> */}
                </DialogTitle>
                <DialogContent sx={{width:'30vw'}}>
                    <DialogContentText>
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro'}}>Match Success! Please wait a while for us to redirect you...</Typography>
                    </DialogContentText>
                </DialogContent>
            </>
        )
    }

    return (
        <Dialog open={props.open} onClose={handleClose} sx={{minWidth:'30vw'}}>
            { (matchStatus === MATCH_SUCCESS) && <MatchSuccessContent /> }
            { (matchStatus === MATCH_PENDING) && <MatchPendingContent /> }
            { (matchStatus === MATCH_FAILED) && <MatchFailedContent />}
        </Dialog>
    );
}
