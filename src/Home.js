import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Home.module.css';
import Navigation from './Navigation';
import Content from './Content';
import Sidebar from './Sidebar';
import CreateRoom from './CreateRoom';
import RemoveRoom from './RemoveRoom';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Home = (props) => {

  const currentPath = props.location.pathname.substring(5);

  const [redirectLogin, setRedirectLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({});
  const [createModal, setCreateModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [membersData, setMembersData] = useState([]);

  function emitData(){
    socket.emit('all data');
  }

  function newMember(){
    socket.emit('new_member', { username });
  }

  function getNewRoom(){
    axios.get('/rooms')
    .then((res) => {
      setRooms(res.data.data);
      setCreateModal(false);
      setRemoveModal(false);
    })
  }

  useEffect(() => {
    let found = rooms.find((room) => room.roomName === currentPath.substring(1))
    setCurrentRoom(found);
  },[currentPath, rooms])

  useEffect(() => {
    if(!props.location.state) {
      setRedirectLogin(true);
      return;
    }
    else {
      setUsername(props.location.state.username);

      socket = io('http://localhost:3001/');
      socket.on('connect', function(){
        socket.emit('new_connection', props.location.state.username);
        console.log('connected');
      })
      socket.on('new_connection', function(data){
        setMembersData(data.data);
      })
      socket.on('all data', function(data){
        setRooms(data.data);
      })
      socket.on('new_member', function(data){
        setMembersData(data.data);
      })
      socket.on('user_disconnect', function(data){
        setMembersData(data.data);
      })
    }
    axios.get('/rooms')
    .then((res) => {
      setRooms(res.data.data);
    })
  }, [])

  function redirectLoginFunc(){
    new Promise ((resolve, reject) => {
      socket.emit('user_disconnect');
      resolve();
    })
    .then(() => {
      setRedirectLogin(true);
    })
  }

  if(redirectLogin){
    return (
      <Redirect to='/'/>
    )
  }
  return (
    <div className={styles.container}>
      <Navigation rooms={rooms} showCreateModal={() => setCreateModal(true)} showRemoveModal={() => setRemoveModal(true)} username={username} redirectLoginFunc={redirectLoginFunc}/>
      <Content currentRoom={currentRoom} username={username} getNewRoom={getNewRoom} emitMessage={emitData} emitNewMember={newMember} />
      <Sidebar currentRoom={currentRoom} membersData={membersData}/>
      { createModal ? <CreateRoom hideCreateModal={() => setCreateModal(false)} emitCreateRoom={emitData} /> : null }
      { removeModal ? <RemoveRoom hideRemoveModal={() => setRemoveModal(false)} emitRemoveRoom={emitData} /> : null }
    </div>
  )
}

export default Home;
