import React, { Component } from 'react';
import MessageList from './messageList.jsx'
import ChatBar from './chatBar.jsx'

class App extends Component {
  constructor(props){
  super();
  this.state = {currentUser: 'bob',
                  messages: [
                    {       id: 0,
                      username: "Bob",
                       content: "Has anyone seen my marbles?",
                    },
                    {       id: 1,
                      username: "Anonymous",
                       content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
                    }
                  ]
               }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages= {this.state} />
        <ChatBar currentUser= {this.state.currentUser} />
      </div>
    );
  }
}

export default App;
