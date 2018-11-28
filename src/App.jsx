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

    const addMessage = (messageContent) => {
      const content = messageContent;
      const newMessageState = this.state.messages.concat(messageContent);
      content.type = "postMessage";
      // this.setState({messages: newMessageState });
      this.socket.send(JSON.stringify(content));
    }

    const changeUser = (userName) => {
      const user = {username: userName};
      user.oldUserName = this.state.currentUser;
      user.type = "postNotification",
      this.setState({ currentUser: userName });
      this.socket.send(JSON.stringify(user));
    }



    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages= {this.state.messages} />
        <ChatBar currentUser= {this.state.currentUser} addMessage={ addMessage } changeUser= { changeUser } />
      </div>
    );
  }
}

export default App;
