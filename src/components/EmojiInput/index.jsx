/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';

class EmojiInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emoji: false,
    };

    this.toggleEmoji = this.toggleEmoji.bind(this);
    this.onEmojiClick = this.onEmojiClick.bind(this);
  }

  onEmojiClick(_e, emojiObject) {
    const { props } = this;

    props.handleChange({
      target: {
        name: props.name,
        value: props.value + emojiObject.emoji,
      },
    });
  }

  toggleEmoji() {
    this.setState({
      emoji: !this.state.emoji,
    });
  }

  render() {
    const { state, props } = this;

    return (
      <>
        {props.type === 'textarea'
          ? (
            <textarea
              className="form-control height-auto"
              name={props.name}
              placeholder={props.placeholder}
              onChange={props.handleChange}
              value={props.value}
              id={props.id}
            />
          )
          : (
            <input
              className="form-control"
              name={props.name}
              placeholder={props.placeholder}
              onChange={props.handleChange}
              value={props.value}
              id={props.id}
            />
          )}

        <FontAwesomeIcon
          class="icon-smile"
          onClick={this.toggleEmoji}
          icon={faSmile}
        />

        <div className={`emoji-wrapper ${state.emoji ? '' : 'hidden'}`}>
          <Picker
            onEmojiClick={this.onEmojiClick}
            size={22}
            emojiStyle="apple"
          />
        </div>
      </>
    );
  }
}

export default EmojiInput;
