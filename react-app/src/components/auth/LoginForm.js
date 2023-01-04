import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import './Login.css'


const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='log-in-form-container'>
      <img src='/static/logo.svg' className='slack-logo' style={{ height: 50 }} alt="logo"></img>
      <h1>Sign in to Slack</h1>
      <h4>We suggest using the email address you use at work</h4>
      <form onSubmit={onLogin} className='log-in-form'>
        <div>
          {errors.map((error, ind) => (
            <div key={ind} style={{color: 'red'}}>{error}</div>
          ))}
        </div>
        <div>
          <input
            name='email'
            type='text'
            placeholder='  name@work-email.com'
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div>
          <input
            name='password'
            type='password'
            placeholder='  password'
            value={password}
            onChange={updatePassword}
          />
        </div>
        <button type='submit' className='sign-in-btn'>Sign In with Email</button>
      </form>
      <p>Don't have an account? <a className='login-sgnup' href='/sign-up' style={{textDecoration:'none'}}>Sign up</a></p>
      <p>Want to check out the site? Log in as a <button className='demo-btn' onClick={() => dispatch(login('demo@demo.com', 'password'))}>Demo user</button></p>
      <footer>
        <div className='contact'>
          Contact Us:
          <a href="https://github.com/Watts-Blake">Blake Watts</a>
          <a href="https://github.com/twincarlos">Carlos Rodriguez</a>
          <a href="https://github.com/skyline502">Johnny San</a>
          <a href="https://github.com/jonathancchsu">Jonathan Hsu</a>
        </div>
      </footer>
   </div>
  );
};

export default LoginForm;
