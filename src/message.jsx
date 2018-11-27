import React, { Component } from 'react';

class Message extends Component {

  render() {

    return(
      <div className="message">
       <span className="message-username">{this.props.data.username}</span>
        <span className="message-content">{this.props.data.content}</span>
      </div>
    )
  }
}

export default Message;


<div className="message system">
        Anonymous1 changed their name to nomnom.
      </div>