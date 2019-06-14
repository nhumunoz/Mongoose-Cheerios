// DEPENDENCIES
//*************
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static(process.cwd() + "/public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

mongoose.connect("mongodb://localhost/scraped_news");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Database Error:", error);
});
db.once("open", function(){
  console.log("Connected to Mongoose!");
});

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost: " + PORT + " ===> 🌎");
});