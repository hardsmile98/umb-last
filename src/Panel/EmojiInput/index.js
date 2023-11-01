import React, { Component } from 'react'

import Picker, {EmojiStyle} from 'emoji-picker-react'

import ReactDOMServer from 'react-dom/server'


import renderEmoji from 'react-easy-emoji'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'

class EmojiInput extends Component {
    constructor(props) {
        super(props)
        this.contentEditable = React.createRef()
        this.state = {
            loading: false,
            emoji: false,
            content: "",
            realContent: ""
        }
        this.toggleEmoji = this.toggleEmoji.bind(this)
        this.onEmojiClick = this.onEmojiClick.bind(this)
    }
    
    toggleEmoji() {
        this.setState({
            emoji: !this.state.emoji
        })
    }

    onEmojiClick(event, emojiObject) {
        this.props.handleChange({target: {name: this.props.name,value: this.props.value + emojiObject.emoji}})
    }

    render() {
        return (
            <>
            {
                this.props.type == "textarea"
                ?
                <textarea
                className='form-control height-auto'
                name={this.props.name}
                placeholder={this.props.placeholder}
                onChange={this.props.handleChange}
                value={this.props.value}
                id={this.props.id}
                ></textarea>
                :
                <input
                className='form-control'
                name={this.props.name}
                placeholder={this.props.placeholder}
                onChange={this.props.handleChange}
                value={this.props.value}
                id={this.props.id}
                />
            }
                <FontAwesomeIcon class="icon-smile" onClick={this.toggleEmoji} icon={faSmile}/>
                <div className={"emoji-wrapper " + (this.state.emoji ? "" : "hidden")}>
                <Picker
                 onEmojiClick={this.onEmojiClick}
                 size={22}
                 emojiStyle="apple"
                  />
                </div>
            </>
        )
    }
}

export default EmojiInput