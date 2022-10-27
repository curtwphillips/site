const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (!req.secure) {
    const host = req.headers.host.includes(':')
      ? req.headers.host.split(':')[0]
      : req.headers.host;

    console.log(
      'redirecting to ',
      `https://${host}:${process.env.API_PORT_HTTPS}${req.url}`
    );

    return res.redirect(
      `https://${host}:${process.env.API_PORT_HTTPS}${req.url}`
    );
  }
  next();
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.static(path.join(__dirname, '../build')));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use(routes);

app.use((req, res, next) => {
  console.log('Unhandled request URL:', req.url);
  next();
});

module.exports = { app };
