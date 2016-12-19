/* eslint-disable no-console */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.get('Authorization') !== 'Basic YWRtaW46bWVvd21peA==') {
    res.set('WWW-Authenticate', 'Basic realm="Required"');
    res.set('Content-Type', 'text/plain');

    return res.sendStatus(401);
  }
  next();
});

const pets = require('./routes/pets');

app.use(pets);

app.use((req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err.stack);

  return res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
