// Import Express.js
const express = require('express');
const path = require('path');
const fs = require('fs')
const notes = require('./db/db.json')

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
        // note_id: uuid(),
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
