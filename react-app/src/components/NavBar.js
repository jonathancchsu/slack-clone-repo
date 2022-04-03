
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import './NavBar.css'
import reducer from '../store/session';

const NavBar = () => {
  const user = useSelector(state => state.session.user)
  console.log(user, 'current user')
  if (user) {
    return (
      <nav className='nav-bar'>
        <ul>
          <li>
            <NavLink to='/' exact={true} activeClassName='active'>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to='/users' exact={true} activeClassName='active'>
              Users
            </NavLink>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
        {user.profile_picture ? <img src={user.profile_picture} alt='profile' style={{ height: 25, marginRight:5 }} /> : <div style={{marginRight:5}}>{user.username}</div>}
      </nav>
    )
  }
  return (
    <nav className='nav-bar'>
      <ul>
        <li>
          <NavLink to='/' exact={true} activeClassName='active'>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to='/login' exact={true} activeClassName='active'>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to='/sign-up' exact={true} activeClassName='active'>
            Sign Up
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
