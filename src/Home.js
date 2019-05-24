import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import Navigation from './Navigation';
import Content from './Content';
import Sidebar from './Sidebar';
import CreateRoom from './CreateRoom';
import axios from 'axios';

const Home = (props) => {
  const [rooms, setRooms] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [createModalError, setCreateModalError] = useState('');

  function getNewRoom(){
    axios.get('http://localhost:3001/rooms')
    .then((res) => {
      console.log(res);
      setRooms(res.data.data);
      setCreateModal(false);
    })
  }

  // function createRoomRequest(roomName){
  //   console.log(roomName);
  //   const obj = {
  //     roomName
  //   }
  //   axios.post('http://localhost:3001/rooms', obj)
  //   .then((res) => {
  //     console.log(res);
  //     axios.get('http://localhost:3001/rooms')
  //     .then((res) => {
  //       console.log(res);
  //       setRooms(res.data.data);
  //       setCreateModal(false);
  //     })
  //   })
  //   .catch((err) => {
  //     if(err.response.status === 409){
  //       setCreateModalError('')
  //     }
  //   })
  // }

  useEffect(() => {
    axios.get('http://localhost:3001/rooms')
    .then((res) => {
      setRooms(res.data.data);
    })
  }, [])

  return (
    <div className={styles.container}>
      <Navigation rooms={rooms} showCreateModal={() => setCreateModal(true)}/>
      <Content />
      <Sidebar />
      { createModal ? <CreateRoom hideCreateModal={() => setCreateModal(false)} getNewRoom={getNewRoom}/> : null }
    </div>
  )
}

export default Home;
