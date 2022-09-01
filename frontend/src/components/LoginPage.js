import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import TextField from '@mui/material/TextField';
import {useState} from "react";
import axios from "axios";
import {USER_SVC_PREFIX, LOG_IN} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS} from "../constants";
import {Link, useNavigate} from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { post } from "../baseApi";
import { setJwtToken } from "../cookieApi";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isLoginSuccess, setIsLoginSuccess] = useState(false)
    const [showErrorMsg, setShowErrorMsg] = useState(false);

    const handleError = (status) => {
        if( status === STATUS_CODE_CONFLICT ) {
            setErrorDialog('This username already exists')
        } else {
            setErrorDialog('Please try again later')
        }
        return;
    };

    const handleSignup = async () => {
        setIsLoginSuccess(false);

        // ---- CHECK INPUT VALIDITY ----
        if (username.length === 0 || password.length === 0) {
            setShowErrorMsg(true);
            return;
        } else {
            setShowErrorMsg(false);
        }

        // ---- SEND TO USER SERVICE ----
        const json = JSON.stringify({ username: username, password: password });
        let response = post(USER_SVC_PREFIX + LOG_IN, json);

        response
            .then((res) => {
                if (res.status != STATUS_CODE_SUCCESS) {
                    handleError(res.status);
                }
                return res;
            })
            .then(res => res.json())
            .then(res => {
                setIsLoginSuccess(true);
                setJwtToken(res.data);
                navigate("/landing");
            })
    }

    const closeDialog = () => setIsDialogOpen(false)

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4188ff'
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
        <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" minHeight="100vh">

            <Box display={"flex"} width='100%' justifyContent="center" alignItems="center" marginBottom={4}>
                {/* <Typography variant={"h1"} class={"raleway"}>PeerPrep</Typography> */}
                <Typography variant={"h1"} sx={{ fontSize: '4rem', fontFamily: 'Raleway'}}>PeerPrep</Typography>
            </Box>

            <Card variant="outlined" sx={{p:4, width: '30vw'}}>
                <CardContent>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h2"} class={"poppins"}>Log In</Typography>
                    </Box>

                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h4"} class={"montserrat"}>New User? </Typography>
                        <Link to="/signup" class={"montserrat"}>Create a new account.</Link>
                    </Box>

                    {showErrorMsg && <Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Montserrat', color:'red'}}>Please fill in both fields.</Typography>
                    </Box>}

                    <TextField
                        fullWidth
                        size="small"
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        inputProps={{style: {fontFamily: 'Source Sans Pro'}}}
                        InputLabelProps={{style: {fontFamily: 'Source Sans Pro'}}}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{style: {fontFamily: 'Source Sans Pro'}}}
                        InputLabelProps={{style: {fontFamily: 'Source Sans Pro'}}}
                    />
                    <Box display={"flex"} width='100%' justifyContent="center" alignItems="center" sx={{marginTop:1}}>
                        <Button variant={"contained"} onClick={handleSignup} fullWidth>Log In</Button>
                    </Box>
                </CardContent>
            </Card>
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isLoginSuccess
                        ? <Button component={Link} to="/login">Log in</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
        </ThemeProvider>
    )
}

export default LoginPage;
