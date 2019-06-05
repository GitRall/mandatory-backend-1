import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = (props) => {
  console.log(props.currentRoom);

  function sortMembers(){
    let rv = [];
    props.currentRoom.members.map((member) => {
      if(member.isOnline){
        rv.push(member);
      }
    })
    props.currentRoom.members.map((member) => {
      if(!member.isOnline){
        rv.push(member);
      }
    })
    return rv;
  }

  function getMemberAmount(){
    if(!props.currentRoom || Object.entries(props.currentRoom).length <= 0) return;
    return Object.entries(props.currentRoom.members).length;
  }

  function getMemberList(){
    if(!props.currentRoom || Object.entries(props.currentRoom).length <= 0) return;

    let memberList = sortMembers();

    memberList = memberList.map((member) => {
      if(!member.isOnline){
        return (
          <li className={styles['list-item']} key={member.user}>
            <span className={styles.offline}></span>
            <span className={styles.username}>{member.user}</span>
          </li>
        )
      }
      else{
        return (
          <li className={styles['list-item']} key={member.user}>
            <span className={styles.online}></span>
            <span className={styles.username}>{member.user}</span>
          </li>
        )
      }
    })
    return memberList;
  }

  return (
    <div className={styles.container}>
      <div className={styles['head-wrapper']}>
        <h4 className={styles['head-title']}>{getMemberAmount()} Members</h4>
      </div>
      <ul className={styles.list}>
        {getMemberList()}
      </ul>
    </div>
  )
}

export default Sidebar;
