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
import {USER_SVC_PREFIX, REGISTER} from "../util/configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED} from "../util/constants";
import {Link, useNavigate} from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { post } from "../api/baseApi";
import { setJwtAndUsernameCookie } from "../api/cookieApi";

function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [showPasswordErrorMsg, setShowPasswordErrorMsg] = useState(false);

    const handleError = (status) => {
        if( status === STATUS_CODE_CONFLICT ) {
            setErrorDialog('This username already exists')
        } else {
            setErrorDialog('Please try again later')
        }
    };

    const handleSignup = async () => {
        setIsSignupSuccess(false);

        // ---- CHECK INPUT VALIDITY ----
        if (username.length === 0 || password.length === 0 || confirmPassword.length === 0 ) {
            setShowErrorMsg(true);
            return;
        } else if (password != confirmPassword) {
            setShowPasswordErrorMsg(true);
            return;
        } else {
            setShowPasswordErrorMsg(false);
            setShowErrorMsg(false);
        }

        // ---- SEND TO USER SERVICE ----
        const json = JSON.stringify({ username: username, password: password });
        let response = post(USER_SVC_PREFIX + REGISTER, json);

        response
            .then((res) => {
                if (res.status != STATUS_CODE_CREATED) {
                    handleError(res.status);
                }
                return res;
            })
            .then(res => res.json())
            .then(res => {
                setIsSignupSuccess(true);
                setJwtAndUsernameCookie(res.data, username);
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

            <Card variant="outlined" sx={{p:4, width: '30vw'}} >
                <CardContent>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h2"} class={"poppins"}>Welcome to PeerPrep.</Typography>
                    </Box>

                    {showErrorMsg && <Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Montserrat', color:'red'}}>Please fill in all fields.</Typography>
                    </Box>}

                    {showPasswordErrorMsg && <Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Montserrat', color:'red'}}>The two passwords do not match.</Typography>
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
                    <TextField
                        fullWidth
                        size="small"
                        label="Confirm Password"
                        variant="outlined"
                        margin="normal"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{style: {fontFamily: 'Source Sans Pro'}}}
                        InputLabelProps={{style: {fontFamily: 'Source Sans Pro'}}}
                    />
                    <Box display={"flex"} width='100%' justifyContent="center" alignItems="center" sx={{marginTop:1}}>
                        <Button variant={"contained"} onClick={handleSignup} fullWidth>Sign up</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
        </ThemeProvider>
    )
}

export default SignupPage;
