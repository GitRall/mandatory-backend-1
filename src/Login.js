import React, { useState} from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [redirectHome, setRedirectHome] = useState(false);

  function connectFunc(){
    if(!username) return;
    setRedirectHome(true);
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
        <input className={styles['user-input']} onChange={(e) => setUsername(e.target.value)}/>
        </label>
        <button className={styles['connect-btn']} onClick={connectFunc}>Connect</button>
      </div>
    </div>
  )
}

export default Login;
