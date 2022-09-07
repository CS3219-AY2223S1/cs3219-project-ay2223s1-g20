import React, {useEffect, useState} from 'react';
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

    const [matchStatus, setMatchStatus] = useState('');
    const [description, setDescription] = useState('');

    const handleClose = () => {
        props.setOpen(false);
    };

    const match = (level) => {
        io_socket.emit('match', {username: getUsername(), difficulty: level}, function (response) {
            console.log(response);
            setMatchStatus(MATCH_SUCCESS);
            setDescription(response.message);
        });
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
            { (matchStatus === '') && <Loading /> }
            { (matchStatus === MATCH_SUCCESS) && <MatchSuccessContent /> }
            { (matchStatus === MATCH_PENDING) && <MatchPendingContent /> }
            { (matchStatus === MATCH_FAILED) && <MatchFailedContent />}
        </Dialog>
    );
}
