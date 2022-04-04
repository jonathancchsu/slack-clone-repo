
import React from 'react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector} from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import './NavBar.css'


const NavBar = () => {
  const [userMenu, setuserMenu] = useState(false)
  const [userShowMenu, setUserShowMenu] = useState('')
  const user = useSelector(state => state.session.user)
  // console.log(user, 'current user')

  useEffect(() => {
    if (userMenu) {
      setUserShowMenu('show-user-info')
      // console.log('show')
      // console.log(userShowMenu)
    } else {
      setUserShowMenu('')
    }
  }, [userMenu])

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
        </ul>
        <div className='search'>
          <p style={{fontSize:10}}>Search Workspace</p>
          <img src='./static/search.png' alt='search' className='search-btn'/>
        </div>
        <div className='nav-profile' onClick={() => setuserMenu(!userMenu)}>
          {user.profile_picture ? <div><img src={user.profile_picture} alt='profile' />🟢</div> : <div style={{color:'white'}}>{user.username}🟢</div>}
          <div className={`user-menu ${userShowMenu}`}>
            <div className='user-info'>
              <div className='user-info-picture'>
                {user.profile_picture ? <img src={user.profile_picture} alt='profile' /> : <div>{user.username}</div>}
              </div>
              <div className='user-status'>
                <h6>{user.username}</h6>
                <p>🟢 Active</p>
              </div>
            </div>
            <div style={{height:30}}>
              <LogoutButton />
            </div>
          </div>
        </div>
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
