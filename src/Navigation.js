import React from 'react';
import styles from './Navigation.module.css';
import { Link } from 'react-router-dom';

const Navigation = (props) => {

  function renderRoomsList(){
    return props.rooms.map((room) => {
      return (
        <li key={room.roomId} className={styles['list-item']}>
          <Link to={`/home/${room.roomName}`} className={styles['list-link']}>{room.roomName}</Link>
        </li>
      )
    })
  }

  return (
    <nav className={styles.container}>
      <h4 className={styles['nav-title']}>{props.username}</h4>
      <ul className={styles.list}>
        <li className={styles['list-item']}>
          <button className={styles['nav-btn']} onClick={props.showCreateModal}>Create channel</button>
        </li>
        <li className={styles['list-item']}>
          <button className={styles['nav-btn']} onClick={props.showRemoveModal}>Remove channel</button>
        </li>
      </ul>
      <h4 className={styles['nav-title']}>Channels</h4>
      <ul className={styles.list}>
        {renderRoomsList()}
      </ul>
    </nav>
  )
}

export default Navigation;
