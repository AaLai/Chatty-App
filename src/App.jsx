import React, { Component } from 'react';
import MessageList from './messageList.jsx'
import ChatBar from './chatBar.jsx'

class App extends Component {
  constructor(props){
  super();
  this.state = {currentUser: 'bob',
                  messages: [
                    {       id: 1,
                      username: "Bob",
                       content: "Has anyone seen my marbles?",
                    },
                    {       id: 2,
                      username: "Anonymous",
                       content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
                    }
                  ]
               }
  this.socket = new WebSocket("ws://localhost:3001");
  }



  componentDidMount() {
    this.socket.onopen = function(event) {
      console.log("WebSocket is open now.");
    };
    console.log("componentDidMount < App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);

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
