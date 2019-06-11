import React, {useEffect} from 'react';
import styles from './EmojiDropdown.module.css';

const EmojiDropdown = (props) => {

  function onEmojiClick(emojiIcon){
    props.addEmoji(emojiIcon);
    props.hideDropdown();
  }

  function emojiList(){
    return props.emojisData.map((emoji) => {
      return (
        <span className={styles.emoji} key={emoji.str} onClick={() => onEmojiClick(emoji.icon)}>{emoji.icon}</span>
      )
    })
  }

  function handleBodyClick(e){
    props.hideDropdown();
  }
  useEffect(() => {
    window.addEventListener('click', handleBodyClick);
    return () => {
      window.removeEventListener('click', handleBodyClick)
    }
  },[])

  return(
    <div className={styles['dropdown-container']} onClick={(e) => e.stopPropagation()}>
      {emojiList()}
    </div>
  )
}

export default EmojiDropdown;
