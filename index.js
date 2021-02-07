// Import modules
const express = require('express');
const bodyParser = require('body-parser');
import app from './src/App';

// Setup
const server = express();
const port = process.env.PORT || 9000;
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
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

const rooms = {};

// Routes
//server.use(bodyParser);

//-------------------Create Room-----------------------------
server.post('/createroom', (request, response) => {
  var randomwords = require('random-words');
  var randomnumber = require('random-number');
  var code = randomwords({ exactly: 2, join: '-' }).concat('-', randomnumber({ min: 1, max: 9, integer: true }));

  //Subscribing to topic
  app.subscribeToTopic(code)
  
  rooms[code] = {
    users: [],
    videoQueue: [],
    videoState: {
      time: 0,
      isPaused: false
    }
  };

  response.status(200).json({
    message: code
  });
});

//-------------------Join Room-----------------------------
server.post('/joinroom', bodyParser.json(), (request, response) => {
  console.log(request.body);

  //Cannot locate room
  if (!(request.body['roomcode'] in rooms)) {
    response.status(400).json({ error: 'error joining room' });
    console.log("Error joining room - No Roomcode Exist");
    return;
  }

  //Adding user to room
  rooms[request.body['roomcode']]['users'].push(request.body['username']);
  response.status(200).json({ message: 'room joined' });
  
  //Publishing join message
  app.publishMessage(request.body['roomcode'], request.body['username'].concat(" joined the room."))
  console.log("Publishing join message")
  
  console.log(rooms);
});

//-------------------Get Users-----------------------------
server.get('/getUsers', bodyParser.json(), (request, response) => {
  console.log(request.body);
  
  //Cannot locate room
  if (!(request.body['roomcode'] in rooms)) {
    response.status(400).json({ error: 'Error - no room exist' });
    console.log("Error - No Roomcode Exist");
    return;
  }
  
  //Sending list of users
  response.status(200).json({
    message: request.body['roomcode']['users']
  });
});

server.listen(port, () => console.log(`Listening on ${port}`));
