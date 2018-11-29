import React, { Component } from 'react';
import Message from './message.jsx'

// Iterates through messages list with map and passes down individual messages

class MessageList extends Component {

  render() {

    const messageList = this.props.messages.map(data => (
      <Message key={data.id} data={data} />
    ));

    return (
      <main className='messages'>
       <ul>{messageList}</ul>
      </main>
    );
  };
};

export default MessageList;