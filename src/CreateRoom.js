import React, { useState, useEffect, useRef } from 'react';
import styles from './CreateRoom.module.css';
import axios from 'axios';

const CreateRoom = (props) => {
  const [channelName, setChannelName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();


  function createRoomRequest(){
    if(!channelName) return;
    const obj = {
      roomName: channelName,
    }
    axios.post('/rooms', obj, { cancelToken: source.token })
    .then((res) => {
      console.log(res);
      props.emitCreateRoom();
      closeCreateModal();
    })
    .catch((err) => {
      if(axios.isCancel(err)){
        console.log('request canceled');
      }
      else if(err.response.status === 409){
        setErrorMsg('Channel with that name already exists');
      }
      else{
        console.log(err);
        setErrorMsg('Must contain less than 20 characters');
      }
    })
  }

  function onChangeName(e){
    setChannelName(e.target.value);
    setErrorMsg('');
  }

  function closeCreateModal(){
    props.hideCreateModal();
  }

  useEffect(() => {
    inputRef.current.focus();
  },[])

  useEffect(() => {
    return () => {
      source.cancel('CANCELED');
    }
  })

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <span className={styles['close-wrapper']}>
            <i className={`material-icons ${styles['close-icon']}`} onClick={closeCreateModal}>close</i>
        </span>
        <span className={styles['title-wrapper']}>
          <i className={`fas fa-comments ${styles['title-icon']}`}></i>
          <h4 className={styles.title}>Create Channel</h4>
        </span>
        <div className={styles['content-wrapper']}>
          <span className={styles['input-wrapper']}>
            <input className={styles['name-input']} type='text' ref={inputRef} onChange={onChangeName} value={channelName}/>
            { errorMsg ? <span className={styles['error-msg']}>{errorMsg}</span> : null }
          </span>
          <span className={styles['btns-wrapper']}>
            <button className={styles['cancel-btn']} onClick={closeCreateModal}>Cancel</button>
            <button className={styles['create-btn']} onClick={createRoomRequest}>Create</button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CreateRoom;
