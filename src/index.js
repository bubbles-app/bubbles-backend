// Import modules
const express = require('express');
const bodyParser = require('body-parser');
import app from './App';
import rooms from './Rooms';

// Setup
const server = express();
const port = process.env.PORT || 9000;
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
server.use(allowCrossDomain);
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.initialize();

server.get('/', (req, res) => {
  res.status(200).json({ message: 'herro' });
});

//-------------------Create Room-----------------------------
server.post('/createroom', (request, response) => {
  console.log(request.body);

  let code = rooms.createRoom();
  app.subscribeToTopic(code);

  response.status(200).json({
    message: code
  });
});

//-------------------Join Room-----------------------------
server.post('/joinroom', bodyParser.json(), (request, response) => {
  console.log(request.body);

  const roomcode = request.body['roomcode'];
  const username = request.body['username'];

  // Cannot locate room
  if (!rooms.hasRoom(roomcode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  // Adding user to room
  rooms.addUserToRoom(roomcode, username);
  response.status(200).json({ message: 'room joined' });

  // Publishing join message
  const message = JSON.stringify({
    messageType: 'newTextMessage',
    username: 'System',
    text: username.concat(' has joined the room.')
  });
  console.log('Publishing join message');
  app.publishMessage(roomcode, message);

  console.log(rooms.rooms);
});

//-------------------Get Users-----------------------------
server.post('/getUsers', bodyParser.json(), (request, response) => {
  console.log(request.body);

  const roomcode = request.body['roomcode'];

  // Cannot locate room
  if (!rooms.hasRoom(roomcode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  // Sending list of users
  response.status(200).json({
    users: rooms.getUsersForRoom(roomcode)
  });
});

//-------------------Leave Room-----------------------------
server.post('/exitRoom', bodyParser.json(), (request, response) => {
  console.log(request.body);
  
  const roomcode = request.body['roomcode'];
  const username = request.body['username'];

  // Cannot locate room
  if (!rooms.hasRoom(roomcode)) {
    const error_msg = 'Error - no such room exists';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  // Check user is in room
  if (!rooms.roomHasUser(roomcode, username)) {
    const error_msg = 'Error - no such user found in room';
    response.status(400).json({ error: error_msg });
    console.log(error_msg);
    return;
  }

  // Removing user from room
  rooms.removeUserFromRoom(roomcode, username);
  
  // Publishing exit message
  console.log('Publishing exit message');
  app.publishMessage(roomcode, JSON.stringify({ messageType: 'userExited', username: username }));

  // Sending list of users
  response.status(200).json({
    users: rooms[roomcode]['users']
  });
});

//-------------------Get current video-----------------------------
server.post('/getcurrentvideo', bodyParser.json(), (request, response) => {
  //Cannot locate room
  const roomcode = request.body['roomcode'];
  if (!(roomcode in rooms)) {
    response.status(400).json({ error: 'Error - no room exist' });
    return;
  }

  console.log(rooms[roomcode]);

  response.status(200).json({
    url: rooms[roomcode]['videoState']['url']
  });
});

//-------------------Set current video-----------------------------
server.post('/setcurrentvideo', bodyParser.json(), (request, response) => {
  //Cannot locate room
  const roomcode = request.body['roomcode'];
  if (!(roomcode in rooms)) {
    response.status(400).json({ error: 'Error - no room exist' });
    return;
  }

  // posting video url to global variable
  const url = request.body['url'];
  rooms[roomcode]['videoState']['url'] = url;

  response.status(200).json({
    message: 'ok'
  });

  console.log(rooms);
});

server.listen(port, () => console.log(`Listening on ${port}`));
