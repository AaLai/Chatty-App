import React, { Component } from 'react';
import MessageList from './messageList.jsx'
import ChatBar from './chatBar.jsx'


// Sorts through messages and renders the main chat app, also passes on inputs to server
class App extends Component {
  constructor(props){
  super();
  this.state = {currentUser: 'Anon',
                   messages: [],
                 usersCount: 0,
                      color: '',
                   roomName: "The House Of Cards"
               };
  this.socket = new WebSocket("ws://localhost:3001");
  }


// Sends login message to other users and for color assignment
  componentDidMount() {
    this.socket.onopen = (event) => {
      console.log("WebSocket is open now.");
      const login = {username: this.state.currentUser,
                            type: "postLogin"
                    }
      this.socket.send(JSON.stringify(login));
    };

    const scrollToBottom = () => {
     this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    };

// Message handler
    this.socket.onmessage = (newMessage) => {
      const fromServerMessage = (JSON.parse(newMessage.data));

      if (fromServerMessage.type === "color") {
        this.setState({color: fromServerMessage.color});
      }
      else {
        switch(fromServerMessage.type) {

          case "incomingLogin":
          case "incomingLogout":
          case "leavingRoom":
          case "incomingRoom":
            this.setState({usersCount: fromServerMessage.count});
            break;

          case "changeRoomState":
            this.setState({usersCount: fromServerMessage.count,
                             roomName: fromServerMessage.roomName
                          });
            break;
        };
        const convertedServerMessage = this.state.messages.concat(fromServerMessage);
        this.setState({messages: convertedServerMessage });
        scrollToBottom();
      };
    };
  };


// Modification functions
  addMessage = (messageContent) => {
    const content = messageContent;
    const newMessageState = this.state.messages.concat(messageContent);
    content.type = "postMessage";
    content.color = this.state.color;
    this.socket.send(JSON.stringify(content));
  };

  changeUser = (userName) => {
    const user = {username: userName};
    user.oldUserName = this.state.currentUser;
    user.type = "postNotification";
    this.setState({ currentUser: userName });
    this.socket.send(JSON.stringify(user));
  };

  changeRoom = (roomnumber) => {
    const rooms = {        type: 'roomChange',
                    currentUser: this.state.currentUser
                  };
    this.socket.send(JSON.stringify(rooms));
  };


  render() {

    return (

      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="navbar-count">{this.state.usersCount} users in {this.state.roomName}
            <button className="changeRoomButton" onClick = {this.changeRoom}> Change Room </button>
          </div>
        </nav>
        <div>
          <MessageList messages= {this.state.messages} />
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <ChatBar currentUser= {this.state.currentUser} addMessage={ this.addMessage } changeUser= { this.changeUser } />
      </div>

    );
  };
};

export default App;
