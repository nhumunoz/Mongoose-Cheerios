//*********************
// DEPENDENCIES/MODELS
//*********************
var mongoose = require("mongoose");
var logger = require("morgan");

//*********************
// INITIALISE EXPRESS + PORT
//*********************
var express = require("express");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 3000;

// *********************
// SCRAPING TOOLS
// *********************
// var axios = require("axios");
// var cheerio = require("cheerio");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));

// Make public a static folder
app.use(express.static(process.cwd() + "/public"));
// app.use(express.static("public"));

//HANDLEBARS
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



//CONNECTING TO MONGODB
// mongoose.connect("mongodb://localhost/{PUTSOMETHINGHERE}");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Mongoose-Cheerios";
mongoose.connect(MONGODB_URI, { userNewUrlParser: true });

var db = mongoose.connection;

db.on("error", function (err) {
  console.log("Database Error:", err);
});
db.once("open", function () {
  console.log("Connected to Mongoose!");
});


//ROUTES
// var routes = require("./controller/controller");
// app.use("/", routes);

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost: " + PORT + " ===> 🌎");
});