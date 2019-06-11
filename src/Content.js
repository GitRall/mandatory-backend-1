import React, { useState, useRef, useEffect } from 'react';
import styles from './Content.module.css';
import Header from './Header';
import Emoji from './Emoji';
import axios from 'axios';

const emojisData = [
  {str: ':grin:', icon: '😀'},
  {str: ':sweat_smile:', icon: '😃'},
  {str: ':heart_eyes:', icon: '😍'},
  {str: ':heart:', icon: '🧡'},
  {str: ':cry:', icon: '😢'},
  {str: ':joy:', icon: '😂'},
  {str: ':girl:', icon: '👧'},
  {str: ':boy:', icon: '👦'},
  {str: ':beer:', icon: '🍺'},
  {str: ':older_man:', icon: '👴'},
  {str: ':older_woman:', icon: '👵'}
]

const Content = (props) => {
  const [myMessage, setMyMessage] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState('');
  const msgContainer = useRef(null);
  const editInputRef = useRef(null);

  function addEmoji(emoji){
    let newMessage = myMessage + emoji;
    setMyMessage(newMessage);
  }

  function msgContainsEmoji(){
    for(let x of emojisData){
      if(myMessage.includes(x.str)){
        let newMessage = myMessage.replace(x.str, x.icon);
        setMyMessage(newMessage);
      }
    }
  }

  useEffect(() => {
    msgContainsEmoji();
  },[myMessage]);

  function editContainsEmoji(){
    for(let x of emojisData){
      if(editText.includes(x.str)){
        let newEdit = editText.replace(x.str, x.icon);
        setEditText(newEdit);
      }
    }
  }

  useEffect(() => {
    editContainsEmoji();
  },[editText]);


  function hideEditInput(e){
    setEditIdx(null);
    setEditText('');
  }

  function showEditInput(msgId, message){
    new Promise ((resolve, reject) => {
      setEditText(message);
      setEditIdx(msgId);
      resolve();
    })
    .then(() => {
      editInputRef.current.focus();
    })
  }

  function onEditChange(e){
    setEditText(e.target.value);
  }

  function onMsgEdit(msgId, roomId){
    let obj = {
      message: editText
    }
    axios.patch(`/room/${roomId}/msg/${msgId}`, obj)
    .then((res) => {
      hideEditInput();
      props.emitMessage();
    })
  }

  function onMsgDelete(msgId, roomId){
    axios.delete(`/room/${roomId}/msg/${msgId}`)
    .then((res) => {
      props.emitMessage();
    })
  }

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
              if(message.user.toLowerCase() === props.username.toLowerCase()){
                if(message.msgId === editIdx){
                  return(
                    <div className={styles['msg-wrapper']} key={message.msgId}>
                      <span className={styles['msg-user']}>{message.user}<button className={styles['edit-btn']} onClick={hideEditInput}>edit</button><button className={styles['remove-btn']} onClick={() => onMsgDelete(message.msgId, props.currentRoom.roomId)}>remove</button></span>
                      <textarea className={styles['edit-textarea']} rows='4' value={editText} onChange={onEditChange} ref={editInputRef}/>
                      <div className={styles['edit-btns-wrapper']}>
                        <button className={styles['edit-cancel-btn']} onClick={hideEditInput}>Cancel</button>
                        <button className={styles['edit-save-btn']} onClick={() => onMsgEdit(message.msgId, props.currentRoom.roomId)}>Save Changes</button>
                      </div>
                    </div>
                  )
                }
                return(
                  <div className={styles['msg-wrapper']} key={message.msgId}>
                    <span className={styles['msg-user']}>{message.user}<button className={styles['edit-btn']} onClick={() => showEditInput(message.msgId, message.message)}>edit</button><button className={styles['remove-btn']} onClick={() => onMsgDelete(message.msgId, props.currentRoom.roomId)}>remove</button></span>
                    <span className={styles['msg']}>{message.message}</span>
                  </div>
                )
              }
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
          <Emoji emojisData={emojisData} addEmoji={addEmoji}/>
        </form>

      </section>
    )
  }
}

export default Content;
