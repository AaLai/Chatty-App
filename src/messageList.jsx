import React, { Component } from 'react';
import Message from './message.jsx'

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {allMessages: this.props.messages.messages};
  }

  render() {

  const messageList = this.state.allMessages.map(data => (
    <Message key={data.id} data={data} />
  ));

    return (
      <main className='messages'>
       <ul>{messageList}</ul>
      </main>
    );
  }
}

export default MessageList;