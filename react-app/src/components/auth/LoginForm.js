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
            <div key={ind}>{error}</div>
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
    </div>
  );
};

export default LoginForm;
