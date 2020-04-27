var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 8080;
var app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(logger("dev"));

//MongoDB database connection
mongoose.connect("mongodb://localhost/newsScrape", {
    useNewUrlParser: true
});

//routes
app.get("/scrape", function (req, res) {
    axios.get("hhttps://arstechnica.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        $('h2').each(function (i, element) {
            var result = {};
            result.title = $(element).text();
            result.link = $(element).children('a').attr("href");

            console.log(result);

            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });
        res.sendFile(__dirname + "/public/index.html");
        console.log("Scrape complete");

    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        console.log(err);

    });
});

// app.get("/articles/:id", function (req, res) {
//     //joining note associated with the article id
//     db.Article.findOne({
//         _id: req.params.id
//     }).populate("note").then(function (dbArticle) {
//         res.json(dbArticle);
//     }).catch(function (err) {
//         console.log(err);
//     });
//     res.json(dbArticle)
// });

app.put("/articles/:id", function (req, res) {
    //joining note associated with the article id
    db.Article.update({
        _id: req.params.id
    }, {$set: {saved:[true]}}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        console.log(err);
    });
    res.json(dbArticle)
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Start server
app.listen(PORT, function () {
    console.log("App running on PORT 🌎 http://localhost:" + PORT);
})