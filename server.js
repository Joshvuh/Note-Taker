const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const main = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Path for notes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(main, "notes.html"));
});
// API path for notes JSON file
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});
// API path for notes JSON file, specific ID within that file
app.get("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(storedNotes[Number(req.params.id)]);
});
// Default path if user inputs an invalid path
app.get("*", function(req, res) {
    res.sendFile(path.join(main, "index.html"));
});
// Stores new notes to JSON file
app.post("/api/notes", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (storedNotes.length).toString();
    newNote.id = uniqueID;
    storedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(storedNotes);
})
// Allows us to delete notes from JSON file through the user interface
app.delete("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    storedNotes = storedNotes.filter(currentNote => {
        return currentNote.id != noteID;
    })
    
    for (currentNote of storedNotes) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
    res.json(storedNotes);
})
// Initialize app
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);