import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Home.module.css';
import Navigation from './Navigation';
import Content from './Content';
import Sidebar from './Sidebar';
import CreateRoom from './CreateRoom';
import RemoveRoom from './RemoveRoom';
import axios from 'axios';

const Home = (props) => {
  console.log(props.location);
  const currentPath = props.location.pathname.substring(5);

  const [redirectLogin, setRedirectLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({});
  const [createModal, setCreateModal] = useState(false);
  const [createModalError, setCreateModalError] = useState('');
  const [removeModal, setRemoveModal] = useState(false);

  function getNewRoom(){
    axios.get('/rooms')
    .then((res) => {
      console.log(res);
      setRooms(res.data.data);
      setCreateModal(false);
      setRemoveModal(false);
    })
  }

  useEffect(() => {
    let found = rooms.find((room) => room.roomName === currentPath.substring(1))
    setCurrentRoom(found);
  },[currentPath])

  useEffect(() => {
    if(!props.location.state) {
      setRedirectLogin(true);
      return;
    }
    else {
      setUsername(props.location.state.username);
    }
    axios.get('/rooms')
    .then((res) => {
      setRooms(res.data.data);
    })
  }, [])

  if(redirectLogin){
    return (
      <Redirect to='/'/>
    )
  }
  return (
    <div className={styles.container}>
      <Navigation rooms={rooms} showCreateModal={() => setCreateModal(true)} showRemoveModal={() => setRemoveModal(true)} username={username}/>
      <Content currentRoom={currentRoom} username={username}/>
      <Sidebar />
      { createModal ? <CreateRoom hideCreateModal={() => setCreateModal(false)} getNewRoom={getNewRoom} /> : null }
      { removeModal ? <RemoveRoom hideRemoveModal={() => setRemoveModal(false)} getNewRoom={getNewRoom} /> : null }
    </div>
  )
}

export default Home;
