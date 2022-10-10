var express = require('express');
var router = express.Router();
var myJSON = require('../portfolio.json');
var fs = require('fs');

/* GET all notes. */
router.get('/', (req, res, next) => {
  // We return an HTTP 200 and send the notes as response 
  res.status(200).send(myJSON);
});

/* GET a note by its id. */
router.get('/:id', (req, res, next) => {
  // We get the id from the parameters of the request
  const {
    id
  } = req.params;
    // We get the list of IDs to create a brand new unique one
    const occurence = myJSON.notes.map(note => note.id).indexOf(Number(id));
  // We return an HTTP 200 and send the note specified in param
  res.status(200).send(myJSON.notes[occurence]);
});

/* POST a new note. */
router.post('/', (req, res, next) => {
  // We assign the request's body to a constant variable
  const informationsToAdd = req.body;
  // We get the list of IDs to create a brand new unique one
  const ids = myJSON.notes.map(note => note.id).sort((a, b) => a - b);
  // We create a new ID in accordance with the last ID we have in the array
  const lastID = ids[ids.length - 1];
  // We compose an object to add to the notes array
  const newAddition = {
    id: lastID + 1,
    ...informationsToAdd
  };

  // We verify if all the informations are here so we can properly create a note
  if (newAddition.title && newAddition.title !== '' &&
    newAddition.content && newAddition.content != []) {
    // We push the new additions to the array of notes
    myJSON.notes.push(newAddition);
    // We write in the JSON file to store the data
    fs.writeFile('notes.json', JSON.stringify(myJSON), (err) => {
      // We return an error and an HTTP 500 if we cannot write in the file
      if (err)
        res.status(500).send('Internal Server Error');
    });
    // We return an HTTP 201 with a message when the note is created
    res.status(201).send('Your note has been created.');
  } else
    res.status(500).send('An error occured...');
  // We return an HTTP 500 if anything happens
});

/* PUT an edition of a specific note. */
router.put('/:id', (req, res, next) => {
  // We get the id from the parameters of the request
  const {
    id
  } = req.params;
  // We assign the request's body to a constant variable
  const edition = req.body;
  // Find the occurence of the specified ID in JSON
  const occurence = myJSON.notes.map(note => note.id).indexOf(Number(id));
  // If the ID is not in the array, we return an error along with an HTTP 500
  if (id > Object.keys(myJSON.notes).length)
    res.status(500).send('An error occured...');
  // If the title has been changed, we update it
  if (edition.title && edition.title !== '')
    myJSON.notes[occurence].title = edition.title;
  // If the content has been changed, we update it
  if (edition.content && edition.content !== [])
    myJSON.notes[occurence].content = edition.content;
  // We write in the JSON file to store the data
  fs.writeFile('notes.json', JSON.stringify(myJSON), (err) => {
    // We return an error and an HTTP 500 if we cannot write in the file
    if (err)
      res.status(500).send('Internal Server Error');
  });
  // We return an HTTP 201 with a message when the note is updated
  res.status(201).send('Your note has been updated.');
});

/* DELETE a specific note. */
router.delete('/:id', (req, res, next) => {
  // We get the id from the parameters of the request
  const {
    id
  } = req.params;
  // Find the occurence of the specified ID in JSON
  const occurence = myJSON.notes.map(note => note.id).indexOf(Number(id));


  // If the ID is not in the array, we return an error along with an HTTP 500
  if (id > Object.keys(myJSON.notes).length)
    res.status(500).send('An error occured...');
  // We delete the occurence of the ID in the JSON file
  myJSON.notes.splice(occurence, 1)

  // We write in the JSON file to store the data
  fs.writeFile('notes.json', JSON.stringify(myJSON), (err) => {
    // We return an error and an HTTP 500 if we cannot write in the file
    if (err)
      res.status(500).send('Internal Server Error');
  });
  // We return an HTTP 201 with a message when the note is deleted
  res.send('The note has been deleted.');
});

module.exports = router;