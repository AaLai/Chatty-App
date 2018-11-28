import React, { Component } from 'react';

class ChatBar extends Component {



   onSubmit = evt => {
      if (evt.keyCode === 13) {
        const generateRandomString = () => {
          let r = Math.random().toString(36).substring(7);
          return r;
        }

        console.log(evt.target.value)
        const messageBody = evt.target.value;
        let randomNum = generateRandomString();
        const messageObject = {         id: randomNum,
                                  username: this.props.currentUser,
                                   content: messageBody
                              }
        this.props.addMessage(messageObject);
        evt.target.value = '';
      }
    };


  render() {

    return(
      <footer className="chatbar">
          <input className="chatbar-username" defaultValue= {this.props.currentUser} />
          <input className="chatbar-message" onKeyUp = {this.onSubmit} name="message" placeholder="Type a message and hit ENTER" />
      </footer>
    )
  }
}

export default ChatBar;