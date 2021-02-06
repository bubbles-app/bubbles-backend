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

const rooms = {}

// Routes
server.post('/createroom', (request, response) => {
  var randomwords = require('random-words');
  var randomnumber = require('random-number');
  var code = randomwords({exactly: 2, join: '-'}).concat('-',randomnumber({min:1, max:9, integer: true}));
  
  rooms[code] = {
    users: [],
    videoQueue: [],
    videoState: {
      time:0,
      isPaused: false
    }
  }
  
  response.status(200).json({
    message: code
  });
});

server.listen(port, () => console.log(`Listening on ${port}`));
