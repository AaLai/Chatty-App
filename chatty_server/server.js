
const express = require('express');
const SocketServer = require('ws').Server;
const uuidTime = require('uuid/v1');

const messageLog = [];
let clientsLoggedIn = [];

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
    clientsLoggedIn.push(client);
    let clientUsername = 'Anon';
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

        messageLog.push(latestMessage);
        latestMessage.type = "incomingMessage";
        sendToRoomMembers(clientsLoggedIn, latestMessage);
        break;

      case "postNotification":
        latestMessage.type = "incomingNotification";
        clientUsername = latestMessage.username;
        sendToRoomMembers(clientsLoggedIn, latestMessage);
        break;

      case "postLogin":
        latestMessage.type = "incomingLogin"
        latestMessage.count = clientsLoggedIn.length;
        sendToRoomMembers(clientsLoggedIn, latestMessage);
        break;


      // console.log(`user ${latestMessage.username} said ${latestMessage.content} and ${latestMessage.id}`);
        // const everyoneButSender = clientsLoggedIn.filter(user => user !== client);

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
    let remainingClients = clientsLoggedIn.filter(element => element !== client);
    clientsLoggedIn = remainingClients
    let logout = { type: "incomingLogout",
                  count: clientsLoggedIn.length,
               username: clientUsername
                 }
    sendToRoomMembers(clientsLoggedIn, logout);
  });
});