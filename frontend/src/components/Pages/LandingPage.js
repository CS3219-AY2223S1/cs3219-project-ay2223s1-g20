import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from "@mui/material";
import HeaderBar from "../common/HeaderBar";
import { io_socket } from "../../api/socketApi";
import { getUsername } from "../../api/cookieApi";

function LandingPage() {

    const match = (level) => {
        console.log('match');
        console.log({username: getUsername(), difficulty: level});
        io_socket.emit('match', {username: getUsername(), difficulty: level});
    }

    const difficultyCard = (level) => {
        const imgUrl = "./static/" + level + ".png"
        return (
            <Card variant="outlined">
                <CardActionArea sx={{p:3}} onClick={e => match(level)}>
                    <CardMedia
                        component="img"
                        image={imgUrl}
                        height='100%'
                        width='100%'
                        alt="Difficulty Badge"
                    />
                    <CardContent>
                        <Box display={"flex"} justifyContent="center" alignItems="center">
                            <Typography variant={"h4"}> {level} </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }

    function difficultySelection() {
        return (
            <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" minHeight="100vh">
                <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" width="80vw">
                    <Typography variant={"h1"} class={"poppins"}>Get Matched!</Typography>
                    <Typography variant={"h2"} class={"source"} marginBottom={'3rem'}>Choose a difficulty</Typography>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={2}>{difficultyCard("Easy")}</Grid>
                        <Grid item xs={2}>{difficultyCard("Medium")}</Grid>
                        <Grid item xs={2}>{difficultyCard("Hard")}</Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <HeaderBar />
            {difficultySelection()}
        </Box>

    )
}

export default LandingPage;
