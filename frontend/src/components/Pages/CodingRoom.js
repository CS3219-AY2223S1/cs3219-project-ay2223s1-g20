import {
    Box,
    Button,
    Modal,
    Typography
} from "@mui/material";
import React from "react";
import HeaderBar from "../common/HeaderBar";
import {useNavigate} from "react-router-dom";

function CodingRoom() {
    const navigate = useNavigate();

    const handleLeaveRoom = () => {
        //TODO: Add popup modal to confirm.
        navigate("/landing");
    }

    function content() {
        return (
            <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" minHeight="100vh">
                <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" width="80vw">
                    <Typography variant={"h1"} class={"poppins"}>Let's start coding!</Typography>
                    <Box display={"flex"} width='100%' justifyContent="center" alignItems="center" sx={{marginTop:1}}>
                        <Button variant={"contained"} onClick={handleLeaveRoom} fullWidth>Leave Room</Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <HeaderBar />
            {content()}
        </Box>

    )
}

export default CodingRoom;
