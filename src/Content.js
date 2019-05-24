import React from 'react';
import styles from './Content.module.css';
import Header from './Header';

const Content = (props) => {
  return (
    <section className={styles.container}>
      <Header />
    </section>
  )
}

export default Content;
