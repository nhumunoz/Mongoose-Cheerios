//*********************
// DEPENDENCIES/MODELS
//*********************
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//*********************
// INITIALISE EXPRESS + PORT
//*********************
var app = express();
var PORT = process.env.PORT || 3000;

// *********************
// SCRAPING TOOLS
// *********************
var axios = require("axios");
var cheerio = require("cheerio");

// app.use(express.static(process.cwd() + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Make public a static folder
app.use(express.static("public"));


// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

mongoose.connect("mongodb://localhost/PLACEDATABASEHERE");


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