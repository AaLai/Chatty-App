import React, { Component } from 'react';

class ChatBar extends Component {



  onSubmitContent = message => {
    if (message.keyCode === 13) {
      const messageBody = message.target.value;
      const messageObject = {   username: this.props.currentUser,
                                 content: messageBody
                            }
      this.props.addMessage(messageObject);
      message.target.value = '';
      }
    };


  onSubmitUser = username => {
      const user = username.target.value;
      this.props.changeUser(user);
    };



  render() {

    return(
      <footer className="chatbar">
          <input className="chatbar-username" onBlur = {this.onSubmitUser} defaultValue= {this.props.currentUser} />
          <input className="chatbar-message" onKeyUp = {this.onSubmitContent} name="message" placeholder="Type a message and hit ENTER" />
      </footer>
    )
  }
}

export default ChatBar;