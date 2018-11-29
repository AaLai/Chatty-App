import React, { Component } from 'react';

// changes message display format and contents based on message type from props

class Message extends Component {

  render() {
    switch(this.props.data.type) {

      case "incomingMessage":

        if (this.props.data.url) {
          return (
            <div className="message">
              <span className="message-username" style={{color: this.props.data.color}}>{this.props.data.username}</span>
              <span className="message-content">{this.props.data.content}</span>
              <img src={this.props.data.url}/>
            </div>
          );
        } else {
          return (
            <div className="message">
              <span className="message-username" style={{color: this.props.data.color}}>{this.props.data.username}</span>
              <span className="message-content">{this.props.data.content}</span>
            </div>
          );
        }
        break;

      case "incomingNotification":
        return (
          <div className="message system">
            {this.props.data.oldUserName} has changed their name to {this.props.data.username}
          </div>
        );
        break;

      case "incomingLogin":
        return (
           <div className="message system">
            {this.props.data.username} has logged in
          </div>
        );

      case "incomingLogout":
        return (
           <div className="message system">
            {this.props.data.username} has logged out
          </div>
        );
    };
  };
};

export default Message;

