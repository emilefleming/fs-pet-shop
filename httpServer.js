/* eslint-disable no-console */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const petsPath = path.join(__dirname, 'pets.json');

const server = http.createServer((req, res) => {
  const notFound = function() {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  };

  const match = req.url.match(/^(\/pets)\/*(.*)$/);

  if (req.method === 'GET' && match) {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const pets = JSON.parse(petsJSON);

      res.setHeader('Content-Type', 'application/json');
      if (match[2]) {
        if (!pets[match[2]]) {
          notFound();

          return;
        }
        res.end(JSON.stringify(pets[match[2]]));
      }
      else {
        res.end(petsJSON);
      }
    });
  }
  else if (req.method === 'POST') {
    let body = '';

    req.on('data', (data) => {
      body += data.toString();
    });

    req.on('end', () => {
      const pet = JSON.parse(body);

      if (!pet.age || !pet.kind || !pet.name) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');

        return;
      }

      pet.age = parseInt(pet.age);
      fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
        if (err) {
          console.error(err);

          return;
        }
        const pets = JSON.parse(petsJSON);

        pets.push(pet);
        const newPetsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, newPetsJSON, (werr) => {
          if (werr) {
            console.error(err);

            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(`${JSON.stringify(pet)}`);
        });

        pets.push(pet);
      });
    });
  }
  else {
    notFound();

    return;
  }
});
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
