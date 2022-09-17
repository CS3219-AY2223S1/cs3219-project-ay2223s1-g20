import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isInRoom } from '../api/cookieApi';

export const PrivateRoute = () => {
    const auth = isAuthenticated();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page

    if (!auth) {
        return <Navigate to="/login" />;
    } else {
        return <Outlet />
    }
}