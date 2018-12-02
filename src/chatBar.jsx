import React, { Component } from 'react';


// Renders chatbar with user name and message entries
class ChatBar extends Component {

  submitMessage = (message) => {
    if (message.keyCode === 13) {
      const messageBody = message.target.value;
      const messageObject = { username: this.props.currentUser,
                               content: messageBody
                            }
      this.props.addMessage(messageObject);
      message.target.value = '';
    };
  };

  submitUser = (username) => {
    if (username.target.value !== this.props.currentUser) {
      if (username.target.value.length !== 0) {
        const user = username.target.value;
        this.props.changeUser(user);
      };
    };
  };


  render() {

    return(

      <footer className="chatbar">
          <input className="chatbar-username" onBlur = {this.submitUser} defaultValue= {this.props.currentUser} />
          <input className="chatbar-message" onKeyUp = {this.submitMessage} name="message" placeholder="Type a message and hit ENTER" />
      </footer>

    );
  };
};

export default ChatBar;