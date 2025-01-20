import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children}) => {
    const {user,token}=useSelector((state)=>state.auth);
    if (user&&token) {
        return children;
    }
    else {
        return <Navigate to="/login" />;
    }
}

export default PrivateRoute;