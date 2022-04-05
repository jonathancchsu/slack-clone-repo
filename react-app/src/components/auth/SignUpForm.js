import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import './SignUp.css'

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [profile_picture, setProfilePicture] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password, profile_picture));
      if (data) {
        setErrors(data)
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updateProfile = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  }

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='sign-up-container'>
      <img src='/static/logo.svg' className='slack-logo' style={{height:50}} alt="logo"></img>
      <h1>First, enter your information</h1>
      <h4>We suggest you using the email address you use at work.</h4>
      <form onSubmit={onSignUp} className='sign-up-form'>
        <div>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <input
            type='text'
            name='username'
            onChange={updateUsername}
            value={username}
            placeholder='  username'
          ></input>
        </div>
        <div>
          <input
            type='text'
            name='email'
            onChange={updateEmail}
            value={email}
            placeholder='  name@work-email.com'
          ></input>
        </div>
        <div>
          <input
            type='file'
            accept='image/*'
            name='profile_img'
            onChange={updateProfile}
            defaultValue={profile_picture}
            placeholder='  profile picture(optional)'
            />
        </div>
        <div>
          <input
            type='password'
            name='password'
            onChange={updatePassword}
            value={password}
            placeholder='  password'
          ></input>
        </div>
        <div>
          <input
            type='password'
            name='repeat_password'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
            placeholder='  confirm password'
          ></input>
        </div>
        <button type='submit' className='sign-up-btn'>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
