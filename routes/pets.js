'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, '../pets.json');

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(data);

    res.send(pets);
  });
});

router.get('/pets/:id', (req, res, next) => {
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

router.post('/pets', (req, res, next) => {
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

router.put('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const id = Number.parseInt(req.params.id);

    if (id < 0 || id >= pets.length || !/^[0-9]+$/.test(id)) {
      return res.sendStatus(404);
    }

    const { kind, name } = req.body;
    const pet = { kind, name };

    pet.age = Number.parseInt(req.body.age);

    if (!kind || !name || !/^[0-9]+$/.test(pet.age)) {
      return res.sendStatus(400);
    }

    pets[id] = pet;
    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

router.patch('/pets/:id', (req, res, next) => {
  // eslint-disable-next-line max-statements
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);
    const pet = pets[id];

    if (id < 0 || id >= pets.length || !/^[0-9]+$/.test(id)) {
      return res.sendStatus(404);
    }

    const { kind, name } = req.body;
    const age = Number.parseInt(req.body.age);

    if (!kind && !name && !age) {
      return res.sendStatus(400);
    }

    if (isNaN(age)) {
      return res.sendStatus(400);
    }

    if (age) {
      pet.age = age;
    }
    if (kind) {
      pet.kind = kind;
    }
    if (name) {
      pet.name = name;
    }

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

router.delete('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (id < 0 || id >= pets.length || !/^[0-9]+$/.test(id)) {
      return res.sendStatus(404);
    }

    const pet = pets.splice(id, 1)[0];
    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

module.exports = router;
