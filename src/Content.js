import React, { useState } from 'react';
import styles from './Content.module.css';
import Header from './Header';
import axios from 'axios';

const Content = (props) => {
  const [myMessage, setMyMessage] = useState('');
  function sendMessageRequest(e){
    e.preventDefault();
    if(!myMessage) return;
    let obj = {
      user: props.username,
      message: myMessage
    }
    axios.post(`/rooms/${props.currentRoom.roomId}`, obj)
    .then((res) => {
      props.emitMessage();
      setMyMessage('');
      console.log(res);
    })
  }

  if(!props.currentRoom || !Object.entries(props.currentRoom).length){
    return (
      <section className={styles.container}>
        <Header />
        <h3>Please enter channel</h3>
      </section>
    )
  }
  else{
    return (
      <section className={styles.container}>
        <Header />
        <div className={styles['message-container']}>
          {
            props.currentRoom.messages.map((message) => {
              return(
                <div className={styles['msg-wrapper']} key={message.msgId}>
                  <span className={styles['msg-user']}>{message.user}</span>
                  <span className={styles['msg']}>{message.message}</span>
                </div>
              )
            })
          }
        </div>
        <form onSubmit={sendMessageRequest} className={styles['input-wrapper']}>
          <input className={styles['message-input']} value={myMessage} onChange={(e) => setMyMessage(e.target.value)}/>
        </form>

      </section>
    )
  }
}

export default Content;
