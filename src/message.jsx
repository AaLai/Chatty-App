import React, { Component } from 'react';

class Message extends Component {
  constructor(props) {
  super(props);
  console.log("hi", this.props.data);
  }

  render() {

    return(
      <div>
      <div className="message">
       <span className="message-username">{this.props.data.username}</span>
        <span className="message-content">{this.props.data.content}</span>
      </div>
      <div className="message system">
        Anonymous1 changed their name to nomnom.
      </div>
      </div>
    )
  }
}

export default Message;