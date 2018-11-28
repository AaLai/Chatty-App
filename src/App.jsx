import React, { Component } from 'react';
import MessageList from './messageList.jsx'
import ChatBar from './chatBar.jsx'

class App extends Component {
  constructor(props){
  super();
  this.state = {currentUser: 'bob',
                  messages: []
               };
  this.socket = new WebSocket("ws://localhost:3001");
  }



  componentDidMount() {
    this.socket.onopen = (event) => {
      console.log("WebSocket is open now.");
    };
    this.socket.onmessage = (newMessage) => {
      const convertedServerMessage = this.state.messages.concat(JSON.parse(newMessage.data));
      console.log(JSON.parse(newMessage.data));
      this.setState({messages: convertedServerMessage });
    }

  }


  render() {

    const addMessage = (message) => {
      const newMessageState = this.state.messages.concat(message);
      this.setState({messages: newMessageState });
      this.socket.send(JSON.stringify(message));
    }



    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages= {this.state.messages} />
        <ChatBar currentUser= {this.state.currentUser} addMessage={ addMessage } />
      </div>
    );
  }
}

export default App;
