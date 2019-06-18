//*************************
//DEPENDENCIES
//*************************
var express = require("express");
var router = express.Router();
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Articles.js");


//************************
// ROUTES
//************************
router.get("/", function (req, res) {
  res.redirect("/articles");
});

router.get("/scrape", function (req, res) {
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

          Article.count({ title: result.title }, function (err, test) {
            if (test === 0) {
              var entry = new Article(result);

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

router.get("/articles", function (req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render("index", artcl);
      }
    });
});

router.get("/articles-json", function (req, res) {
  Article.find({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.get("/clearAll", function (req, res) {
  if (res) {
    console.log(res);
  } else {
    console.log("Removed all articles!");
  }
  res.redirect("/articles-json");
});

router.get("/readArticle/:id", function (req, res) {
  var articleId = req.params.id;
  var hbsObj = {
    article: [],
    body: []
  };

  Article.findOne({ _id: articleId })
    .populate("note")
    .exec(function (err, doc) {
      if (err) {
        console.log("Error: " + err);
      } else {
        hbsObj.article = doc;
        var link = doc.link;
        axios(link, function (err, res, html) {
          var $ = cheerio.load(html);

          $(".l-col__main").each(function (i, element) {
            hbsObj.body = $(this)
              .children(".c-centry-content")
              .children("p")
              .text();

            res.render("article", hbsObj);
            return false;
          });
        });
      }
    });
});

router.post("/note/:id", function (req, res) {
  var user = req.body.name;
  var content = req.body.note;
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

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: doc._id } },
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
module.exports = router;