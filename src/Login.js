import React, { useState} from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [redirectHome, setRedirectHome] = useState(false);
  const [errMsg, setErrMsg] = useState('')

  function onUsernameChange(e){
    setUsername(e.target.value);
    setErrMsg('');
  }

  function connectFunc(){
    if(!username) return;
    axios.get('/members')
    .then((res) => {
      let foundUser = res.data.data.find((member) => member.user.toLowerCase() === username.toLowerCase());
      if(!foundUser || !foundUser.isOnline){
        setRedirectHome(true);
      }
      else{
        setErrMsg('This username is already taken');
      }
    })
  }
  if(redirectHome){
    return (
      <Redirect to={{
          pathname: '/home',
          state: { username }
        }} />
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles['login-wrapper']}>
        <label className={styles['user-label']}>Username:
        <input className={styles['user-input']} onChange={onUsernameChange}/>
        </label>
        <button className={styles['connect-btn']} onClick={connectFunc}>Connect</button>
        {
          errMsg ? <span className={styles['error-msg']}>{errMsg}</span> : null
        }
      </div>
    </div>
  )
}

export default Login;
