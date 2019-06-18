//************
//DEPENDENCIES
//************
var mongoose = require("mongoose");
//************************
//SAVE REFERENCE TO SCHEMA
//************************

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  Note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

var Articles = mongoose.model("Articles", ArticleSchema);
//*************************
// EXPORT ARTICLE
//*************************
module.exports = Articles;