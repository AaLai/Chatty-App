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

      case "incomingLogin":
        return(
           <div className="message system">
            {this.props.data.username} has logged in
          </div>
        )

      case "incomingLogout":
        return(
           <div className="message system">
            {this.props.data.username} has logged out
          </div>
        )
    }
  }
}

export default Message;

