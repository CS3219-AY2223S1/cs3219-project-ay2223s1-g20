import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../api/cookieApi'

export const PrivateRoute = () => {
  const auth = isAuthenticated()

  if (!auth) {
    return <Navigate to="/login" />
  } else {
    return <Outlet />
  }
}
