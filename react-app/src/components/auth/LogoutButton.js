import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { setUserWorkspaces } from '../../store/workspace';
import './Button.css'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
    dispatch(setUserWorkspaces(null));
  };

  return <button onClick={onLogout} className='sign-out-btn'>Sign out</button>;
};

export default LogoutButton;
