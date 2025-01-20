import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/slices/AuthSlice';
import { useNavigate ,Link} from 'react-router-dom';

export const LogOutHandler = ({className}) => {
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Link onClick={handleLogout} className={className} >
      Logout
    </Link>
  );
};

