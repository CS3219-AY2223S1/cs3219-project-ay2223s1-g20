import {
    Box,
    Button,
    Modal,
    Typography
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderBar from "../common/HeaderBar";
import {useNavigate} from "react-router-dom";
import LeaveRoomDialog from "../Dialogs/LeaveRoomDialog";
import CloseRoomDialog from "../Dialogs/CloseRoomDialog";
import { io_socket } from "../../api/socketApi";
import { CLOSE_ROOM } from '../../util/constants';

function CodingRoom() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false);
    const [showCloseRoomDialog, setShowCloseRoomDialog] = useState(false);
    const [isInPair, setIsInPair] = useState(true);

    // ------- HANDLE LEAVE ROOM ------
    useEffect(() => {
        console.log(location);
        if (location.pathname != '/room') {
            handleLeaveRoom();
        }
    }, [location]);

    const handleLocationChange = (e) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave your room?\n This action cannot be undone."
        return "Are you sure you want to leave your room?\n This action cannot be undone."
    }

    const handleLeaveRoom = () => {
        if (isInPair) {
            console.log('emit leave event');
            io_socket.emit('leave');
        }
        navigate('/landing');
    }

    const handleBackButtonClick = (e) => {
        console.log('back button pressed');
        e.preventDefault();
        setShowLeaveRoomDialog(true);
    }

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handleBackButtonClick);
        window.addEventListener('unload', handleLocationChange);
        window.addEventListener('beforeunload', handleLocationChange);
        return () => {
          window.removeEventListener('popstate', handleBackButtonClick);
          window.removeEventListener('unload', handleLocationChange);
          window.removeEventListener('beforeunload', handleLocationChange);
        };
      }, []);

    // ----- HANDLE CLOSE ROOM -----
    const handleCloseRoom = () => {
        // If we receive a handle closeRoom event, we tell the user with a popup.
        setIsInPair(false);
        setShowCloseRoomDialog(true);
    }

    useEffect(() => {
        io_socket.on(CLOSE_ROOM, handleCloseRoom);
        handleCloseRoom();
    }, [])

    const CodingRoomContent = () => {
        return (
            <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" minHeight="100vh">
                <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" width="80vw">
                    <Typography variant={"h1"} class={"poppins"}>Let's start coding!</Typography>
                    <Box display={"flex"} width='100%' justifyContent="center" alignItems="center" sx={{marginTop:1}}>
                        <Button variant={"contained"} onClick={(e) => {setShowLeaveRoomDialog(true)}} fullWidth>Leave Room</Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <HeaderBar />
            <CodingRoomContent />
            {showLeaveRoomDialog && <LeaveRoomDialog open={showLeaveRoomDialog} setOpen={setShowLeaveRoomDialog} handleLeaveRoom={handleLeaveRoom}/>}
            {showCloseRoomDialog && <CloseRoomDialog open={showCloseRoomDialog} setOpen={setShowCloseRoomDialog} handleLeaveRoom={handleLeaveRoom}/>}
        </Box>

    )
}

export default CodingRoom;
