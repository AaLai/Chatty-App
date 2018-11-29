
const express = require('express');
const SocketServer = require('ws').Server;
const uuidTime = require('uuid/v1');

let rooms = { '0': {
                     users: [],
                      name: "The Main Stay",
                  messages: []
                   },
              '1': {
                     users: [],
                      name: "room 2",
                  messages: []
                   }
            }



// Image managers for giphy and regular images
const regImg = /(http(s?):)([/|.|\w|\s|-])*\.(jpg|gif|png)/g;
const regGiphy = /^\/giphy (\w.+)$/;
const imageCheck = (content) => {
  return content.match(regImg);
}

const giphyCheck = (content) => {
  return content.match(regGiphy);
}

// Send to room
const sendToRoomMembers = (room, message) => {
  room.forEach(user => {
    user.send(JSON.stringify(message));
  });
}

// Deals with assigning colors to users on login
const colors = ['#00FF00', '#DAA520', '#0000FF', '#FF0000', '#FF00FF', '#000000', '#C0C0C0']
let number = 0;
const colorSelector = () => {
  if (number >= 6) {
    return number = 0;
  } else {
    return number += 1;
  };
}

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (client) => {
  console.log('Client connected');
    rooms[0].users.push(client);
    let clientUsername = 'Anon';
    let clientRoom = '0';
    const userColor = {  type: 'color',
                        color: colors[colorSelector()]
                      };
    client.send(JSON.stringify(userColor));


  client.on('message', function incoming(data) {
    const latestMessage = JSON.parse(data);
    latestMessage.id = uuidTime();

    switch(latestMessage.type) {

      case "postMessage":

        const image = imageCheck(latestMessage.content);
        const giphy = giphyCheck(latestMessage.content);
        if (image) {
          latestMessage.content = latestMessage.content.replace(image[0], ' ');
          latestMessage.url = image[0];
        }

        rooms[0].messages.push(latestMessage);
        latestMessage.type = "incomingMessage";
        sendToRoomMembers(rooms[clientRoom].users, latestMessage);
        break;

      case "postNotification":
        latestMessage.type = "incomingNotification";
        clientUsername = latestMessage.username;
        sendToRoomMembers(rooms[clientRoom].users, latestMessage);
        break;

      case "postLogin":
        latestMessage.type = "incomingLogin"
        latestMessage.count = rooms[clientRoom].users.length;
        sendToRoomMembers(rooms[clientRoom].users, latestMessage);
        break;

      case "Roomchange":
        let clientRoomObject = Object.assign({}, latestMessage)
        clientRoomObject.type = "changeRoomState"
        latestMessage.type = "incomingRoom"
          if (clientRoom === '0') {

            let remainingClients = rooms[0].users.filter(element => element !== client);
            rooms[0].users = remainingClients
            rooms[1].users.push(client);
            clientRoomObject.count = rooms[1].users.length;
            clientRoomObject.roomname = rooms[1].name;
            clientRoom = '1';
            latestMessage.count = rooms[0].users.length;


            if (rooms[0].users.length) {
              sendToRoomMembers(rooms[0].users, latestMessage);
            }
            if (rooms[1].users.length) {
              latestMessage.count = rooms[1].users.length;
              sendToRoomMembers(rooms[1].users, latestMessage)
            }

            client.send(JSON.stringify(clientRoomObject));



            break;

          } else if (clientRoom === '1') {
              let remainingClients = rooms[1].users.filter(element => element !== client);
              rooms[1].users = remainingClients
              rooms[0].users.push(client);
              clientRoomObject.count = rooms[0].users.length;
              clientRoomObject.roomname = rooms[0].name;
              clientRoom = '0';
              latestMessage.count = rooms[1].users.length;
              client.send(JSON.stringify(clientRoomObject));
              if (rooms[1].users.length) {
                sendToRoomMembers(rooms[1].users, latestMessage);
              }
              if (rooms[0].users.length) {
                latestMessage.count = rooms[0].users.length;
                sendToRoomMembers(rooms[0].users, latestMessage)
              }

            break;
          }


      // console.log(`user ${latestMessage.username} said ${latestMessage.content} and ${latestMessage.id}`);
        // const everyoneButSender = rooms[0].users.filter(user => user !== client);

      // everyoneButSender.forEach(user => {
        // user.send(JSON.stringify(latestMessage));
      // })
    }
  });


  // Set up a callback for when a client closes the socket.
  // Also sends a logout message to remaining users along with
  // updated users logged in count
  client.on('close', () => {
    console.log('Client disconnected');
    let remainingClients = rooms[clientRoom].users.filter(element => element !== client);
    rooms[0].users = remainingClients
    let logout = { type: "incomingLogout",
                  count: rooms[clientRoom].users.length,
               username: clientUsername
                 }
    if (rooms[clientRoom.length]) {
      sendToRoomMembers(rooms[clientRoom].users, logout);
    }
  });
});