//*********************
// DEPENDENCIES/MODELS
//*********************
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

//*********************
// INITIALISE EXPRESS + PORT
//*********************
var express = require("express");
var app = express();

var PORT = process.env.PORT || 3000;

//ROUTES
var routes = require("./controller/controller");
app.use("/", routes);

// *********************
// SCRAPING TOOLS
// *********************
// var axios = require("axios");
// var cheerio = require("cheerio");


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false })
);

// Make public a static folder
app.use(express.static(process.cwd() + "/public"));
// app.use(express.static("public"));

//HANDLEBARS
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//CONNECTING TO MONGODB
// mongoose.connect("mongodb://localhost/{PUTSOMETHINGHERE}");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { userNewUrlParser: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", function () {
  console.log("Connected to Mongoose!");
});


//LOCALHOST PORT
app.listen(PORT, function () {
  console.log("Server listening on: http://localhost: " + PORT + " ===> 🌎");
});