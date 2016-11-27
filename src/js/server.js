const PORT = 8080;

const WebSocketServer = require('ws').Server;
const server = new WebSocketServer({
  port: PORT
});

server.on('connection', websocket => {
  websocket.on('message', message => {
    console.log('received: %s', message);
  });

  websocket.send('something');
});
