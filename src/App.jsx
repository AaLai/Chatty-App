import React, { Component } from 'react';
import MessageList from './messageList.jsx'
import ChatBar from './chatBar.jsx'

class App extends Component {
  constructor(props){
  super();
  this.state = {currentUser: 'Anon',
                   messages: [],
                 usersCount: 0,
                      color: '',
                   roomName: "The Main Stay"
               };
  this.socket = new WebSocket("ws://localhost:3001");
  }

  componentDidMount() {
    this.socket.onopen = (event) => {
      console.log("WebSocket is open now.");
      const login = {username: this.state.currentUser,
                            type: "postLogin"
                    }
      this.socket.send(JSON.stringify(login));
      console.log(login);
    };

    const scrollToBottom = () => {
     this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }


    this.socket.onmessage = (newMessage) => {
      const fromServerMessage = (JSON.parse(newMessage.data));
      if (fromServerMessage.type === "color") {
        console.log(fromServerMessage.color)
        this.setState({color: fromServerMessage.color})

      } else {

        switch(fromServerMessage.type) {

          case ("incomingLogin" || "incomingLogout" || "leavingRoom" || "incomingRoom"):
            this.setState({usersCount: fromServerMessage.count});
            break;

          case "changeRoomState":
            this.setState({usersCount: fromServerMessage.count,
                             roomName: fromServerMessage.roomName})
            console.log(fromServerMessage)
            break;
        }
        const convertedServerMessage = this.state.messages.concat(fromServerMessage);
        this.setState({messages: convertedServerMessage });
        scrollToBottom();
      }
    }
  }



  render() {

    const addMessage = (messageContent) => {
      const content = messageContent;
      const newMessageState = this.state.messages.concat(messageContent);
      content.type = "postMessage";
      content.color = this.state.color;
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

    const changeRoom = (roomnumber) => {
      const rooms = { type: 'roomChange',
               currentUser: this.state.currentUser
                    }
      this.socket.send(JSON.stringify(rooms))
    };



    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="navbar-count">{this.state.usersCount} users on {this.state.roomName}</div>
        </nav>
        <div>
          <MessageList messages= {this.state.messages} />
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <ChatBar currentUser= {this.state.currentUser} addMessage={ addMessage } changeUser= { changeUser } />
        <button onClick = {changeRoom}> pressme! </button>
      </div>
    );
  }
}

export default App;
