import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './Button.css'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
  };

  return <button onClick={onLogout} className='sign-out-btn'>Sign out</button>;
};

export default LogoutButton;
