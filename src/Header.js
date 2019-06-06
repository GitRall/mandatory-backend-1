import React from 'react';
import styles from './Header.module.css';

const Header = (props) => {
  if(!props.currentRoom){
    return(
      <header className={styles.header}>
        <div>
          <h4></h4>
        </div>
      </header>
    )
  }
  return (
    <header className={styles.header}>
      <span className={styles.members}><i className={`fas fa-users ${styles.icon}`}></i> {props.currentRoom.members.length}</span>
      <h4 className={styles['room-name']}>{props.currentRoom.roomName}</h4>
    </header>
  )
}

export default Header;
