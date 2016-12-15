/* eslint-disable no-console, newline-before-return */

'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const petsPath = path.join(__dirname, 'pets.json');

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(data);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.send(pets[id]);
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
