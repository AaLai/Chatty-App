import React, { Component } from 'react';
import Message from './message.jsx'

class MessageList extends Component {

  render() {

  {/*  const messageList = this.state.messages.map(Data => (
    <messages key={Data.id} data={data} />
    )) */}

    return (
      <main className='messages'>
        <Message />
      </main>
    );
  }
}

export default MessageList;