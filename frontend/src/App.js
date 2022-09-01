import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import {Box} from "@mui/material";
import LandingPage from "./components/LandingPage";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import CodingRoom from "./components/CodingRoom";

function App() {

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '36',
            },
            logo: {
                fontSize: '36',
                fontWeight: 500,
                fontFamily: 'Raleway'
            },
            h4: {
                fontFamily: 'Montserrat'
            },
            body: {
                fontSize: '20'
            }
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box display={"flex"} flexDirection={"column"}>
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                            <Route path="/signup" element={<SignupPage/>}/>
                            <Route path="/landing" element={<LandingPage/>}/>
                            <Route path="/room" element={<CodingRoom/>}/>
                        </Routes>
                    </Router>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default App;
