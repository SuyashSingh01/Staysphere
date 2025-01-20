import React ,{useState,useEffect} from 'react';
import { Outlet,useNavigate,useLocation }  from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar/Navbar.jsx';
import Footer from './Footer/Footer.jsx';
import logo from '../assets/logo.svg';

const Layout = () => {


  return (
    <>
      <Navbar />
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col mt-20 ">
        <Outlet />
      </div>
      <Footer />
      
    </>
  );
};

export default Layout;
