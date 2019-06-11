import React, { useState } from 'react';
import styles from './Emoji.module.css';
import EmojiDropdown from './EmojiDropdown';




const Emoji = (props) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  return (
    <div className={styles.container} >
      {toggleDropdown ? <EmojiDropdown emojisData={props.emojisData} addEmoji={props.addEmoji} hideDropdown={() => setToggleDropdown(false)}/> : null}
      <i className={`far fa-smile ${styles.icon}`} onClick={() => setToggleDropdown(!toggleDropdown)}></i>
    </div>
  )
}

export default Emoji
