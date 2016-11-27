const PORT = 8080;

const WebSocketServer = require('ws').Server;
const server = new WebSocketServer({
  port: PORT
});

server.on('connection', function connection(websocket) {
  websocket.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  websocket.send('something');
});
