//*************************
//DEPENDENCIES
//*************************
var express = require("express");
var app = express();
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var Note = require("../models/Notes.js");
var Articles = require("../models/Articles.js");


//************************
// ROUTES
//************************
app.get("/", function (req, res) {
  res.redirect("/Articles");
});

app.get("/scrape", function (req, res) {
  axios("https://www.climbing.com/", function (err, res, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $(".c-entry-box--compact__title").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      if (result.title !== "" && result.link !== "") {
        if (titlesArray.indexOf(result.title) == -1) {
          titlesArray.push(result.title);

          Articles.count({ title: result.title }, function (err, test) {
            if (test === 0) {
              var entry = new Articles(result);

              entry.save(function (err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        } else {
          console.log("Article already exists!");
        }
      } else {
        console.log("Note saved to DB, but missing data!");
      }

    });
    res.redirect("/");
  });
});

app.get("/Articles", function (req, res) {
  Articles.find()
    .sort({ _id: -1 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { Article: doc };
        res.render("index", artcl);
      }
    });
});

app.get("/Articles-json", function (req, res) {
  Articles.find({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

app.get("/clearAll", function (req, res) {
  if (res) {
    console.log(res);
  } else {
    console.log("Removed all articles!");
  }
  res.redirect("/Articles-json");
});

app.get("/readArticle/:id", function (req, res) {
  var articleId = req.params.id;
  var hbsObj = {
    articles: [],
    body: []
  };

  Articles.findOne({ _id: articleId })
    .populate("Note")
    .exec(function (err, doc) {
      if (err) {
        console.log("Error: " + err);
      } else {
        hbsObj.Articles = doc;
        var link = doc.link;
        axios(link, function (err, res, html) {
          var $ = cheerio.load(html);

          $(".l-col__main").each(function (i, element) {
            hbsObj.body = $(this)
              .children(".c-centry-content")
              .children("p")
              .text();

            res.render("Article", hbsObj);
            return false;
          });
        });
      }
    });
});

app.post("/Note/:id", function (req, res) {
  var user = req.body.name;
  var content = req.body.Note;
  var articleId = req.params.id;

  var noteObj = {
    name: user,
    body: content
  };

  var newNote = new Note(noteObj);

  newNote.save(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);

      Articles.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { Note: doc._id } },
        { new: true }
      ).exec(function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/readArticle/" + articleId);
        }
      });
    }
  });
});

//************************
// EXPORT MODELS
//************************
module.exports = app;