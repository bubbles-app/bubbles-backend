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

// Routes
server.get('/', (request, response) => {
  response.status(200).json({
    message: 'hi'
  });
});

server.listen(port, () => console.log(`Listening on ${port}`));
