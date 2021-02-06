// Import modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Setup
const app = express();
const port = process.env.PORT || 9000;
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Routes
app.get('/', (request, response) => {
  response.status(200).json(
    {
      message: "hi"
    });
});

app.listen(port, () => console.log(`Listening on ${port}`));
