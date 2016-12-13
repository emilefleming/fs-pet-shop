#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (!cmd) {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}

if (cmd === 'read') {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const petDb = JSON.parse(data);
    const index = process.argv[3];

    if (!index) {
      console.log(petDb);
      process.exit(0);
    }
    if (index == parseInt(index) && index > -1) { // eslint-disable-line
      if (!petDb[index]) {
        console.error(`No entry found at index ${index}`);
        process.exit(1);
      }
      console.log(petDb[index]);
      process.exit(0);
    }
    console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
    process.exit(1);
  });
}
else if (cmd === 'create') {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const petDb = JSON.parse(data);
    const age = parseInt(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];

    if (!name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    const newPet = { age, kind, name };

    petDb.push(newPet);
    const newDb = JSON.stringify(petDb);

    fs.writeFile(dbPath, newDb, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(newPet);
      process.exit(0);
    });
  });
}
else if (cmd === 'update') {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const petDb = JSON.parse(data);
    const index = parseInt(process.argv[3]);
    const age = parseInt(process.argv[4]);
    const kind = process.argv[5];
    const name = process.argv[6];

    if (!name) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    const newPet = { age, kind, name };

    petDb[index] = (newPet);
    const newDb = JSON.stringify(petDb);

    fs.writeFile(dbPath, newDb, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(newPet);
      process.exit(0);
    });
  });
}
else if (cmd === 'destroy') {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const petDb = JSON.parse(data);
    const index = process.argv[3];

    if (!index) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    const deleted = petDb.splice(parseInt(index), 1);
    const newDb = JSON.stringify(petDb);

    fs.writeFile(dbPath, newDb, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(deleted[0]);
      process.exit(0);
    });
  });
}
