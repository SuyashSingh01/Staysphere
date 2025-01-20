
import { SettingOutlined } from '@ant-design/icons';
import { FaHome } from "react-icons/fa";
import { BsHeart,BsListUl,BsPersonCircle,BsJournalPlus} from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";

import { BiCartAdd } from "react-icons/bi";
import { HiOutlineLogout} from "react-icons/hi";

import { Link } from 'react-router-dom';
import {LogOutHandler} from './LogOutHandler.jsx';


export const LoginItems = [
    {
      key: '1',
      label: 'My Account',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key:'2',
      label:<Link className='px-4 ' to='/'>Home</Link>,
      icon:<FaHome />,
    },
    {
      key: '3',
      label: <Link className='px-4' to='/account'>Profile</Link>,
      extra: '⌘P',
      icon:<BsPersonCircle />
    },
    {
      key: '4',
      label:(<Link className='px-4' to='/account/places'>Manage Listings</Link>),
      icon:<BsListUl />,
      extra: '⌘B',
    },
    {
      key: '5',
      label:(<Link className='px-4' to='/account/liked-place'>Favourites</Link>),
      icon:<BsHeart />,
      extra: '⌘B',

    },
    {
      key: '6',
      label:(<Link className='px-4' to='/account/places/new'>Host Listings</Link>),
      icon:<BsJournalPlus />,
      extra: '⌘B',
    },
    {
      key: '7',
      label:(<Link className='px-4' to='/account/bookings'>My Bookings</Link>),
      icon: <BiCartAdd />,
      extra: '⌘S',
    },
    {
      key: '8',
      label:(<Link className='px-4' to='/account/notification'>Notification</Link>),
      icon: <IoMdNotificationsOutline />,
      extra: '⌘S',
    },

    {
      key: '9',
      label:(<Link className='px-4' to='/account/setting'>Settings</Link>),
      icon: <SettingOutlined />,
      extra: '⌘S',
    },
    {
      key: '10',
      label:(<LogOutHandler className='px-4 flex items-center gap-2'/>),
      icon: <HiOutlineLogout />,
      extra: '⌘S',
    },
    
  ];


  export const LogoutItems = [
    {
      key: '1',
      label: <Link to='register'>Signup</Link>,
    },
    {
      key: '2',
      label: <Link to='login'>Signin</Link>,
    }
  ];
  