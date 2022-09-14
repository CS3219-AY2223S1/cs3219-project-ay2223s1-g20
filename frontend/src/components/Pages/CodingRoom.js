import {
    Box,
    Button,
    Modal,
    Typography
} from "@mui/material";
import React, { useState, useEffect, useRouter } from "react";
import HeaderBar from "../common/HeaderBar";
import {useNavigate} from "react-router-dom";
import LeaveRoomDialog from "../Dialogs/LeaveRoomDialog";

function CodingRoom() {
    const navigate = useNavigate();

    const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false);

    const handleLeaveRoom = (e) => {
        // emit socket event to leave room.
        navigate('/landing');
    }

    const handleBackButtonClick = (e) => {
        e.preventDefault();
        setShowLeaveRoomDialog(true);
    }

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handleBackButtonClick);
        return () => {
          window.removeEventListener('popstate', handleBackButtonClick);
        };
      }, []);

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
        </Box>

    )
}

export default CodingRoom;
