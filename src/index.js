require('dotenv').config();
import bubbles from './Bubbles';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

const sockets = {};

server.listen(port, () => {
  systemLog(`listening on *:${port}`);
});

// whenever a new socket connects, register event handlers
io.on('connection', (socket) => {
  const socketShortId = socket.id.substring(0, 5);

  systemLog(`user ${socketShortId} connected`);
  sockets[socket.id] = socket;

  socket.on('newVideoUrl', ({ roomCode, urlString }) => {
    socket.to(roomCode).emit('newVideoUrl', urlString);
  });

  socket.on('videoStateChange', ({ roomCode, eventCode, videoTime }) => {
    // eventCode is an integer - it corresponds to PLAY, PAUSE, etc, interpreted on the client side
    socket.to(roomCode).emit('videoStateChange', { eventCode, videoTime });
  });

  socket.on('newTextMessage', ({ roomCode, messageInfo }) => {
    // io emits the event to the sender too
    io.to(roomCode).emit('newTextMessage', messageInfo);
  });

  socket.on('disconnecting', () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });

  socket.on('disconnect', () => {
    // socket.rooms.size === 0

    systemLog(`user ${socketShortId} disconnected`);
    delete sockets[socket.id];
  });
});

app.get('/', (request, response) => {
  response.status(200).json({ message: 'herro' });
});

//-------------------Create Room-----------------------------
app.post('/createroom', (request, response) => {
  let roomCode = bubbles.createRoom();
  response.status(200).json({ message: roomCode });
});

//-------------------Join Room-----------------------------
app.post('/joinroom', bodyParser.json(), (request, response) => {
  const socketId = request.body.socketId;
  const roomCode = request.body.roomCode;
  const username = request.body.username;

  // Socket id not valid
  if (!(socketId in sockets)) {
    const error_msg = 'Error - invalid socket id';
    response.status(400).json({ error: error_msg });
    systemLog(error_msg);
    return;
  }

  // Cannot locate room
  if (!bubbles.hasRoom(roomCode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    systemLog(error_msg);
    return;
  }

  // Username not provided
  if (!username) {
    const error_msg = 'Error - username not provided';
    response.status(400).json({ error: error_msg });
    systemLog(error_msg);
    return;
  }

  // Subscribe socket to room
  const socket = sockets[socketId];
  socket.join(roomCode);
  systemLog(`${username} now subscribed to all events in the room (code: ${roomCode})`);

  // Let everyone in the room know
  io.to(roomCode).emit('newUserJoinedRoom', username);
  io.to(roomCode).emit('newTextMessage', { username: 'System', text: `${username} joined the room!` });
  systemLog(`Broadcasting to everyone in the room that ${username} joined!`);

  // Adding user to room
  bubbles.addUserToRoom(roomCode, username);
  systemLog(`${username} now physically in the room (code: ${roomCode})`);

  response.status(200).json({ message: 'room joined' });
  console.log(bubbles.rooms);
});

//-------------------Get Users-----------------------------
app.post('/getUsers', bodyParser.json(), (request, response) => {
  const roomcode = request.body['roomcode'];

  // Cannot locate room
  if (!bubbles.hasRoom(roomcode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  // Sending list of users
  response.status(200).json({
    users: bubbles.getUsersForRoom(roomcode)
  });
});

//-------------------Get current video-----------------------------
app.post('/getcurrentvideo', bodyParser.json(), (request, response) => {
  const roomcode = request.body['roomcode'];

  // Cannot locate room
  if (!bubbles.hasRoom(roomcode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  response.status(200).json({
    url: bubbles.getVideoUrlForRoom(roomcode)
  });
});

//-------------------Set current video-----------------------------
app.post('/setcurrentvideo', bodyParser.json(), (request, response) => {
  const roomcode = request.body['roomcode'];

  // Cannot locate room
  if (!bubbles.hasRoom(roomcode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  // needs error checking for url
  const url = request.body['url'];
  bubbles.setVideoUrlForRoom(roomcode, url);

  response.status(200).json({ message: 'ok' });
  console.log(bubbles.rooms);
});

const systemLog = (message) => {
  console.log(`System: ${message}`);
};
