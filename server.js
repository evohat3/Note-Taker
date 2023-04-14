// Import Express.js
const express = require('express');
const path = require('path');
const fs = require('fs')
const notes = require('./db/db.json')
const uniqid = require('./Helpers/uniqid')
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// **** Returns notes.html ****
app.get('/notes', (req, res) => { 
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// **** Gets the saved notes ****
app.get('/api/notes', (req, res) => {
  // *** Reads the db.json file ***
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(404).json({message: 'information not found'});
      return;
    }
    // *** parses the json data from db.json
    const notes = JSON.parse(data)
    // *** sends notes
    res.send(notes);
  });
});


app.delete('/api/notes/:id', (req, res) =>{
  // ** reads db.json file asynchronously
  readFileAsync('./db/db.json', 'utf8').then((notes) => {
      let filteredNotes;
      // Try catch method to make sure there are notes available to delete
      try {
        filteredNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        filteredNotes = [];
      }
      console.log('filteredNotes',filteredNotes)
      return filteredNotes;
    })
    // takes filtered notes and returns the new data with the removed 
    .then((notes) => notes.filter((note) => note.id !== req.params.id))
    .then((filteredNotes) => writeFileAsync('./db/db.json', JSON.stringify(filteredNotes)))
    .then(notes=> res.json(notes))
});


// app.delete('/api/notes/:id', (req, res) => {
//   const { id } = req.params;
//   const noteToDelete = notes.find(note => note.id === id);
  
//   if (!noteToDelete) {
//     return res.status(404).send('Note not found');
//   }

//   const noteIndex = notes.indexOf(noteToDelete);
//   notes.splice(noteIndex, 1);

//   return res.send('Note deleted');
// });


// *** Post request to Save the notes
app.post('/api/notes', (req,res) => {
  console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title, text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uniqid(),
      };
  
      notes.push(newNote);
      // Convert the data to a string so we can save it
      const noteString = JSON.stringify(notes);

      fs.writeFile(`./db/db.json`, noteString, (err) => {
        if (err) {
          console.error(err)
          res.status(500).json('Note could not be saved')
        } else {
          console.log(`review for ${newNote.title} has been saved!`);
          const response = {
            status: 'success',
            body: newNote,
          };
          console.log(response);
          res.status(201).json(response);
          
        }
      });
  }});

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

