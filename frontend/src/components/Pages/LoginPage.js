import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {USER_SVC_PREFIX, LOG_IN} from "../../util/configs";
import {STATUS_CODE_UNAUTHORIZED, STATUS_CODE_NOT_FOUND, STATUS_CODE_SUCCESS} from "../../util/constants";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { post } from "../../api/baseApi";
import { setJwtAndUsernameCookie, isAuthenticated } from "../../api/cookieApi";

function LoginPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAuthorisationError, setShowAuthorisationError] = useState(false);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if(isAuthenticated()) {
            navigate("/landing");
        }
    }, [])

    useEffect(() => {
        if ((location.state !== null) && (location.state.error)) {
            setShowAuthorisationError(true);
            navigate(location.pathname, { replace: true });
        }
    }, [])

    const handleError = (status) => {
        if( status === STATUS_CODE_UNAUTHORIZED ) {
            setErrorMsg('Incorrect Password.')
        } else if (status === STATUS_CODE_NOT_FOUND) {
            setErrorMsg('Username does not exist.')
        } else {
            setErrorMsg('Something went wrong. Please try again later.')
        }
        setShowErrorMsg(true);
        return;
    };

    const handleLogin = async () => {

        // ---- CHECK INPUT VALIDITY ----
        if (username.length === 0 || password.length === 0) {
            setErrorMsg("Please fill in both fields.");
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
                    handleError(res.status); // NEED TO FIX
                    return;
                }
                return res;
            })
            .then(res => res.json())
            .then(res => {
                setJwtAndUsernameCookie(res.data, username);
                navigate("/landing");
            })
    }

    return (

        <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems="center" minHeight="100vh">

            <Box display={"flex"} width='100%' justifyContent="center" alignItems="center" marginBottom={4}>
                <Typography variant={"h1"} sx={{ fontSize: '4rem', fontFamily: 'Raleway'}}>PeerPrep</Typography>
            </Box>

            <Card variant="outlined" sx={{p:4, width: '30vw'}}>
                <CardContent>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h2"} class={"poppins"}>Log In</Typography>
                    </Box>

                    { showAuthorisationError && (<Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color:'red'}}>Please login again.</Typography>
                    </Box>)}

                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h4"} class={"montserrat"}>New User? &nbsp;</Typography>
                        <Link to="/signup" variant={"h4"} class={"montserrat"}>Create a new account.</Link>
                    </Box>

                    {showErrorMsg && <Box display={"flex"} justifyContent="center" alignItems="left">
                        <Typography variant={"body"} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro', color:'red'}}>{errorMsg}</Typography>
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
                        <Button variant={"contained"} onClick={handleLogin} fullWidth>Log In</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default LoginPage;
