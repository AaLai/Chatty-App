import React, { Component } from 'react';

class Message extends Component {

  render() {
    switch(this.props.data.type) {

      case "incomingMessage":
        return(
          <div className="message">
          <span className="message-username">{this.props.data.username}</span>
          <span className="message-content">{this.props.data.content}</span>
        </div>
        )
        break;

      case "incomingNotification":
        return(
          <div className="message system">
            {this.props.data.oldUserName} has changed their name to {this.props.data.username}
          </div>
        )
        break;
    }
  }
}

export default Message;

