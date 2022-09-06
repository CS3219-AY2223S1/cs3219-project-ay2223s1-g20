import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {Box} from "@mui/material";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import React, { useState, useEffect } from 'react';

import SignupPage from './components/Pages/SignupPage';
import LandingPage from "./components/Pages/LandingPage";
import CodingRoom from "./components/Pages/CodingRoom";
import LoginPage from "./components/Pages/LoginPage";
import {PrivateRoute} from "./components/PrivateRoute";
import { socket } from "./api/socketApi";

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

    useEffect(() => {
        socket.on('connect', () => {
          console.log('connect to socket.io');
        });

        socket.on('disconnect', () => {
          console.log('disconnect from socket.io');
        });

        socket.emit('hello', () => {
            console.log('emit hello');
        })
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box display={"flex"} flexDirection={"column"}>
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                            <Route path="/signup" element={<SignupPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>

                            <Route exact path='/landing' element={<PrivateRoute/>}>
                                <Route exact path='/landing' element={<LandingPage/>}/>
                            </Route>
                            <Route exact path='/room' element={<PrivateRoute/>}>
                                <Route exact path='/room' element={<CodingRoom/>}/>
                            </Route>
                        </Routes>
                    </Router>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default App;
