var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI;
var databaseUrl = 'mongodb://localhost/mongoHeadlines'

if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(databaseUrl)
};

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

//route for scraping
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

//getting all articles
app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        console.log(err);

    });
});

//route for pulling each article by its id and populating it with notes
app.get("/articles/:id", function (req, res) {

    db.Article.findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//route for saving article, so that "saved" is set to true
app.put("/articles/:id", function (req, res) {
    db.Article.update({
        _id: req.params.id
    }, {
        $set: {
            saved: true
        },
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        console.log(err);
    });
});

//route for posting notes to article
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

//route for deleting article
app.put("/articles/delete/:id", function (req, res) {
    db.Article.remove({
            _id: req.params.id
        }).then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.put("/articles/clear", function (req, res) {
    db.Article.drop({})
});

//Start server
app.listen(PORT, function () {
    console.log("App running on PORT 🌎 http://localhost:" + PORT);
})
