/* eslint-disable no-console */

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

app.get('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(data);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.send(pets[id]);
  });
});

app.post('/pets', (req, res, next) => {
  const age = Number.parseInt(req.body.age);
  const { kind, name } = req.body;
  const pet = { age, kind, name };

  if (!kind || !name || Number.isNaN(age)) {
    return res.sendStatus(400);
  }

  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(data);

    pets.push(pet);
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

app.use((err, req, res, next) => { // eslint-disable-line
  if (err) {
    console.error(err.stack);

    return res.sendStatus(500);
  }
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
