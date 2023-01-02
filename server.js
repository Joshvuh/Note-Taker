const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;
const main = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(main, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(storedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(main, "index.html"));
});

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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);