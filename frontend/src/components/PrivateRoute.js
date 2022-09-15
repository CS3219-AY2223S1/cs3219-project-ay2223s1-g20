import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../api/cookieApi';
import { isInRoom } from '../api/localStorageApi';

export const PrivateRoute = () => {
    const auth = isAuthenticated();
    const inRoom = isInRoom();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page

    if (inRoom) {
        return <Navigate to="/room" />;
    } else if (!auth) {
        return <Navigate to="/login" />;
    } else {
        return <Outlet />
    }
}