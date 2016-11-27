import { Server as WebSocketServer } from 'ws';
import http from 'http';
import { SERVER_PORT } from './constants';
import { Message, MESSAGE_HELLO } from './api';

const { server, wsServer } = createServers();
server.listen(SERVER_PORT, () => {
  console.log(`HTTP server started at ${SERVER_PORT}`);
});

wsServer.on('connection', ws => {
  console.log('connection');
  ws.on('message', message => {
    console.log('received: %s', message);
  });

  const helloMessage = createHelloMessage();
  ws.send(helloMessage.serialize());
});

function createServers() {
  const server = http.createServer();
  const wsServer = new WebSocketServer({
    server
  });
  return { server, wsServer };
}

function createHelloMessage() {
  return new Message({
    type: MESSAGE_HELLO,
    payload: {
      message: 'dupa'
    }
  });
}
