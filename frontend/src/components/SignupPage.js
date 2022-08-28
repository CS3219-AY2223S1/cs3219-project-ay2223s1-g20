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
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED} from "../constants";
import {Link, useNavigate} from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";

function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)

    const handleSignup = async () => {
        setIsSignupSuccess(false)
        const res = await axios.post(URL_USER_SVC, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog('This username already exists')
                } else {
                    setErrorDialog('Please try again later')
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog('Account successfully created')
            setIsSignupSuccess(true)
            navigate("/landing");
        }
        navigate("/landing"); //TODO: remove later.
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

            <Card variant="outlined" sx={{p:4}}>
                <CardContent>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h2"} class={"poppins"}>Log In</Typography>
                    </Box>

                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h4"} class={"montserrat"}>New User? Create an account.</Typography>
                    </Box>

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
                        <Button variant={"contained"} onClick={handleSignup} fullWidth>Sign up</Button>
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
                    {isSignupSuccess
                        ? <Button component={Link} to="/login">Log in</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
        </ThemeProvider>
    )
}

export default SignupPage;
