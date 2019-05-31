import React, { useState, useEffect } from 'react';
import styles from './RemoveRoom.module.css';
import axios from 'axios';

const RemoveRoom = (props) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  function removeRoomRequest(){
    axios.delete(`/rooms/${selectedRoom.roomId}`, { cancelToken: source.token })
    .then((res) => {
      props.emitRemoveRoom();
      props.hideRemoveModal();
      console.log(res);
    })
    .catch((err) => {
      if(axios.isCancel(err)){
        props.getNewRoom();
        console.log('delete canceled');
      }
    })
  }

  useEffect(() => {
    axios.get('/rooms', { cancelToken: source.token })
    .then((res) => {
      setRooms(res.data.data);
      console.log(res.data.data);
    })
    .catch((err) => {
      if(axios.isCancel(err)){
        console.log('request canceled');
      }
    })
  },[])

  useEffect(() => {
    return () => {
      source.cancel('CANCELED');
    }
  })

  return(
    <div className={styles.overlay}>
      <div className={styles.container}>
        <span className={styles['close-wrapper']}>
            <i className={`material-icons ${styles['close-icon']}`} onClick={props.hideRemoveModal}>close</i>
        </span>
        <span className={styles['title-wrapper']}>
          <i className={`fas fa-trash ${styles['title-icon']}`}></i>
          <h4 className={styles.title}>Remove Channel</h4>
        </span>
        <div className={styles['list-wrapper']}>
          {
            rooms.map((room) => {
              return(
                <div className={styles['list-item']} key={room.roomId}>
                  <input className={styles['list-radio']} type='radio' name='rooms' onChange={() => setSelectedRoom(room)}/>
                  <span className={styles['list-checkmark']} >{room.roomName}</span>
                </div>
              )
            })
          }
        </div>
        <div className={styles['btns-wrapper']}>
          <button className={styles['cancel-btn']} onClick={props.hideRemoveModal}>Cancel</button>
          <button className={styles['remove-btn']} onClick={removeRoomRequest}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default RemoveRoom;
