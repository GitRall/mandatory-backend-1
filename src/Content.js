import React, { useState, useRef } from 'react';
import styles from './Content.module.css';
import Header from './Header';
import axios from 'axios';

const Content = (props) => {
  const [myMessage, setMyMessage] = useState('');
  const msgContainer = useRef(null);

  function onMessageChange(e){
    setMyMessage(e.target.value);
  }

  function sendMessageRequest(e){
    e.preventDefault();
    if(!myMessage) return;
    let obj = {
      user: props.username,
      message: myMessage
    }
    axios.post(`/rooms/${props.currentRoom.roomId}`, obj)
    .then((res) => {
        props.emitNewMember();
        props.emitMessage();
        setMyMessage('');
        setTimeout(() => {
          msgContainer.current.scrollTop = msgContainer.current.scrollHeight;
        },100)
    })

  }

  if(!props.currentRoom || !Object.entries(props.currentRoom).length){
    return (
      <section className={styles.container}>
        <Header />
        <div className={styles['alt-wrapper']}>
          <h3 className={styles['alt-message']}>
            Join a channel too start chatting with people
            <span className={styles['line-left']}></span>
            <span className={styles['line-right']}></span>
          </h3>
        </div>
      </section>
    )
  }
  else{
    return (
      <section className={styles.container}>
        <Header currentRoom={props.currentRoom}/>
        <div className={styles['message-container']} ref={msgContainer}>
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
          <input className={styles['message-input']} value={myMessage} onChange={onMessageChange}/>
        </form>

      </section>
    )
  }
}

export default Content;
