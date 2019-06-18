//************
//DEPENDENCIES
//************
var mongoose = require("mongoose");


//************************************
//SAVE REFERNECE TO CONSTRUCTOR/SCHEMA
//************************************
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  name: {
    type: String
  },
  body: {
    type: String,
    required: true
  }
});

var Note = mongoose.model("Note", NoteSchema);

//******************
//EXPORT NOTE MODEL
//******************
module.exports = Note;