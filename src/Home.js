import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import Navigation from './Navigation';
import Header from './Header';
import Content from './Content';
import Sidebar from './Sidebar';
import axios from 'axios';

const Home = (props) => {
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:3001/rooms')
    .then((res) => {
      setRooms(res.data.data);
    })
  }, [])

  return (
    <div className={styles.container}>
      <Navigation />
      <Content />
      <Sidebar />
    </div>
  )
}

export default Home;
