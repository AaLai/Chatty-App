
const express = require('express');
const SocketServer = require('ws').Server;
const uuidTime = require('uuid/v1');

const messageLog = [];
let clientsLoggedIn = [];

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

  client.on('message', function incoming(data) {
    const latestMessage = JSON.parse(data);
    latestMessage.id = uuidTime();

    switch(latestMessage.type) {

      case "postMessage":
        messageLog.push(latestMessage);
        latestMessage.type = "incomingMessage";
        console.log(latestMessage);
        clientsLoggedIn.forEach(user => {
          user.send(JSON.stringify(latestMessage));
        })
        break;

      case "postNotification":
        latestMessage.type = "incomingNotification";
        console.log(latestMessage)
        clientsLoggedIn.forEach(user => {
          user.send(JSON.stringify(latestMessage));
        });
        break;

      // console.log(`user ${latestMessage.username} said ${latestMessage.content} and ${latestMessage.id}`);
        // const everyoneButSender = clientsLoggedIn.filter(user => user !== client);

      // everyoneButSender.forEach(user => {
        // user.send(JSON.stringify(latestMessage));
      // })
    }
  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => {
    console.log('Client disconnected');
    let remainingClients = clientsLoggedIn.filter(element => element !== client);
    clientsLoggedIn = remainingClients
    console.log(clientsLoggedIn.length);
  });
});