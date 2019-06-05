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

  function emitData(){
    socket.emit('all data');
  }

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
  },[currentPath, rooms])

  useEffect(() => {
    if(!props.location.state) {
      setRedirectLogin(true);
      return;
    }
    else {
      socket = io('http://localhost:3001/');
      socket.on('connect', function(){
        console.log('connected');
        console.log(socket);
      })
      // socket.on('disconnect', function(){
      //   console.log('disconnect CLIENT');
        // socket.emit('user_disconnect');
      // })
      socket.on('all data', function(data){
        console.log(data);
        console.log(socket);
        setRooms(data.data);
      })
      socket.on('user_disconnect', function(data){
        console.log(data);
        console.log('HELLO')
      })
      console.log(socket);
      setUsername(props.location.state.username);
    }
    axios.get('/rooms')
    .then((res) => {
      setRooms(res.data.data);
    })
  }, [])

  // useEffect(() => {
  //   return () => {
  //     socket.emit('disconnect');
  //     console.log('hej');
  //     // emitData();
  //   }
  // },[])

  if(redirectLogin){
    return (
      <Redirect to='/'/>
    )
  }
  return (
    <div className={styles.container}>
      <Navigation rooms={rooms} showCreateModal={() => setCreateModal(true)} showRemoveModal={() => setRemoveModal(true)} username={username}/>
      <Content currentRoom={currentRoom} username={username} getNewRoom={getNewRoom} emitMessage={emitData}/>
      <Sidebar currentRoom={currentRoom}/>
      { createModal ? <CreateRoom hideCreateModal={() => setCreateModal(false)} emitCreateRoom={emitData} /> : null }
      { removeModal ? <RemoveRoom hideRemoveModal={() => setRemoveModal(false)} emitRemoveRoom={emitData} /> : null }
    </div>
  )
}

export default Home;
