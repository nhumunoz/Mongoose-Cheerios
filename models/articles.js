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
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note: "
  }
});

var Article = mongoose.model("Article", ArticleSchema);
//*************************
// EXPORT ARTICLE
//*************************
module.exports = Article;