// Websocket server requires
const express = require('express');
const SocketServer = require('ws').Server;
const uuidTime = require('uuid/v1');


// Serverside variables and functions for chatroom functionality
let rooms = { '0': {    users: [],
                         name: "The Labs",
                     messages: []
                   },
              '1': {    users: [],
                         name: "The Great Outdoors",
                     messages: []
                   }
            };

const sendToRoomMembers = (room, message) => {
  room.forEach(user => {
    user.send(JSON.stringify(message));
  });
};

const roomChanger = (sourceRoom, client, changeRoomFN, parsedMessage) => {
  let clientChangedRoom = Object.assign({}, parsedMessage);
  let userJoiningNotification = Object.assign({}, parsedMessage);
  let userLeavingNotification = Object.assign({}, parsedMessage);
  const destinationRoom = (sourceRoom === '1') ? '0' : '1';
  clientChangedRoom.type = "changeRoomState"
  userJoiningNotification.type = "incomingRoom"
  userLeavingNotification.type = "leavingRoom"

  let remainingClients = rooms[sourceRoom].users.filter(user => user !== client);
  rooms[sourceRoom].users = remainingClients;
  rooms[destinationRoom].users.push(client);
  clientChangedRoom.count = rooms[destinationRoom].users.length;
  clientChangedRoom.roomName = rooms[destinationRoom].name;
  changeRoomFN(destinationRoom);

  if (rooms[sourceRoom].users.length) {
    userLeavingNotification.count = rooms[sourceRoom].users.length;
    sendToRoomMembers(rooms[sourceRoom].users, userLeavingNotification);
  }

  if (rooms[destinationRoom].users.length) {
    userJoiningNotification.count = rooms[destinationRoom].users.length;
    const everyoneButSender = rooms[destinationRoom].users.filter(user => user !== client);
    everyoneButSender.forEach(user => {
      user.send(JSON.stringify(userJoiningNotification));
    });
  };

  client.send(JSON.stringify(clientChangedRoom));
};

// Image functionality and color assignment
const regexImage = /(http(s?):)([/|.|\w|\s|-])*\.(jpg|gif|png)/g;
const imageCheck = (content) => {
  return content.match(regexImage);
};


const colors = ['#00FF00', '#DAA520', '#0000FF', '#FF0000', '#FF00FF', '#000000', '#C0C0C0']
let number = 0;
const colorSelector = () => {
  if (number >= 6) {
    return number = 0;
  }
  else {
    return number += 1;
  };
};


// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


// Opens socket connection to clients and assign colours
wss.on('connection', (client) => {
  console.log('Client connected');
    rooms[0].users.push(client);
    let clientUsername = 'Anon';
    let clientRoom = '0';
    const userColor = {  type: 'color',
                        color: colors[colorSelector()]
                      };
    client.send(JSON.stringify(userColor));


// Message handler based on incoming message type
  client.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);
    parsedMessage.id = uuidTime();

    switch(parsedMessage.type) {

      case "postMessage":
        let newMessage = Object.assign({}, parsedMessage);
        const image = imageCheck(newMessage.content);
        if (image) {
          newMessage.url = image[0];
        };
        rooms[clientRoom].messages.push(newMessage);
        newMessage.type = "incomingMessage";
        sendToRoomMembers(rooms[clientRoom].users, newMessage);
        break;

      case "postNotification":
        let newNotification = Object.assign({}, parsedMessage);
        newNotification.type = "incomingNotification";
        clientUsername = newNotification.username;
        sendToRoomMembers(rooms[clientRoom].users, newNotification);
        break;

      case "postLogin":
        let newLogin = Object.assign({}, parsedMessage);
        newLogin.type = "incomingLogin";
        newLogin.count = rooms[clientRoom].users.length;
        sendToRoomMembers(rooms[clientRoom].users, newLogin);
        break;

      case "roomChange":
        roomChanger(clientRoom, client, ((room)=> {clientRoom = room}), parsedMessage);
        break;

    };
  });


// Updates remaining user counts and sends a logout message
  client.on('close', () => {
    console.log('Client disconnected');
    let remainingClients = rooms[clientRoom].users.filter(element => element !== client);
    rooms[clientRoom].users = remainingClients;
    let logout = { type: "incomingLogout",
                  count: rooms[clientRoom].users.length,
               username: clientUsername
                 };
    if (rooms[clientRoom].length) {
      sendToRoomMembers(rooms[clientRoom].users, logout);
    };
  });
});