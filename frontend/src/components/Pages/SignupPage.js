import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import {USER_SVC_PREFIX, REGISTER} from "../../util/configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED} from "../../util/constants";
import { useNavigate} from "react-router-dom";
import { post } from "../../api/baseApi";
import { setJwtAndUsernameCookie, isAuthenticated } from "../../api/cookieApi";

function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if(isAuthenticated()) {
            navigate("/landing");
        }
    }, [])

    const handleError = (status) => {
        if( status === STATUS_CODE_CONFLICT ) {
            setErrorMsg("This username already exists.")
            setShowErrorMsg(true);
        } else {
            setErrorMsg("Something went wrong. Please try again later.");
            setShowErrorMsg(true);
        }
    };

    const handleSignup = async () => {

        // ---- CHECK INPUT VALIDITY ----
        if (username.length === 0 || password.length === 0 || confirmPassword.length === 0 ) {
            setErrorMsg("Please fill in all fields.");
            setShowErrorMsg(true);
            return;
        } else if (password != confirmPassword) {
            setErrorMsg("The two passwords do not match.")
            setShowErrorMsg(true);
            return;
        } else {
            setShowErrorMsg(false);
        }

        // ---- SEND TO USER SERVICE ----
        const json = JSON.stringify({ username: username, password: password });
        let response = post(USER_SVC_PREFIX + REGISTER, json);

        response
            .then((res) => {
                if (res.status != STATUS_CODE_CREATED) {
                    handleError(res.status);
                    return;
                }
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

            <Card variant="outlined" sx={{p:4, width: '30vw'}} >
                <CardContent>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Typography variant={"h2"} class={"poppins"}>Welcome to PeerPrep.</Typography>
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
    )
}

export default SignupPage;
