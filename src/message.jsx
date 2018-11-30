import React, { Component } from 'react';

// changes message display format and contents based on message type from props

class Message extends Component {

  render() {
    switch(this.props.messageData.type) {

      case "incomingMessage":

        if (this.props.messageData.url) {
          return (
            <div className="message">
              <span className="message-username" style={{color: this.props.messageData.color}}>{this.props.messageData.username}</span>
              <span className="message-content">{this.props.messageData.content}</span>
              <img src={this.props.messageData.url}/>
            </div>
          );

        } else {

          return (
            <div className="message">
              <span className="message-username" style={{color: this.props.messageData.color}}>{this.props.messageData.username}</span>
              <span className="message-content">{this.props.messageData.content}</span>
            </div>
          );
        }
        break;

      case "incomingRoom":
        return (
          <div className="message system">
            {this.props.messageData.currentUser} has joined!
          </div>
        );
        break;

      case "leavingRoom":
        return (
          <div className="message system">
            {this.props.messageData.currentUser} moved on!
          </div>
        );
        break;

      case "changeRoomState":
        return (
          <div className="message system">
            You have moved to {this.props.messageData.roomName}!
          </div>
        );
        break;

      case "incomingNotification":
        return (
          <div className="message system">
            {this.props.messageData.oldUserName} has changed their name to {this.props.messageData.username}
          </div>
        );
        break;

      case "incomingLogin":
        return (
           <div className="message system">
            {this.props.messageData.username} has logged in
          </div>
        );

      case "incomingLogout":
        return (
           <div className="message system">
            {this.props.messageData.username} has logged out
          </div>
        );
    };
  };
};

export default Message;

