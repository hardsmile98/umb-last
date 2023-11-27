import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

function EmojiInput({
  id,
  type,
  name,
  placeholder,
  value,
  handleChange,
}) {
  const [isSelectEmoji, setSelectEmoji] = useState(false);

  const onEmojiClick = (_e, emojiObject) => {
    handleChange({
      target: {
        name,
        value: value + emojiObject.emoji,
      },
    });
  };

  return (
    <div className={styles.emojiWrapper}>
      {type === 'textarea' ? (
        <textarea
          className="form-control height-auto"
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          id={id}
        />
      ) : (
        <input
          className="form-control"
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          id={id}
        />
      )}

      <FontAwesomeIcon
        className={styles.iconButton}
        onClick={() => setSelectEmoji((prev) => !prev)}
        icon={faSmile}
      />

      <div className={`
      ${styles.pickerEmoji} 
      ${type === 'textarea'
        ? styles.pickerEmojiWithTextArea
        : styles.pickerEmojiWithInput} 
      ${isSelectEmoji ? '' : 'hidden'}`}
      >
        <Picker
          onEmojiClick={onEmojiClick}
          size={22}
          emojiStyle="apple"
        />
      </div>
    </div>
  );
}

export default EmojiInput;
