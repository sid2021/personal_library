"use strict";

var expect = require("chai").expect;
var mongodb = require("mongodb");
var mongoose = require("mongoose");

module.exports = function (app) {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let librarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [{ type: String }],
    commentcount: Number,
  });

  let Book = mongoose.model("Book", librarySchema);

  app
    .route("/api/books")
    .get(function (req, res) {
      Book.find({}, "title _id commentcount", (error, arrayOfBooks) => {
        if (!error && arrayOfBooks) {
          return res.json(arrayOfBooks);
        }
      });
    })

    .post(function (req, res) {
      var title = req.body.title;

      if (!title) {
        return res.json("missing title");
      }

      Book.findOne({ title: title }, (error, foundBook) => {
        if (!error && foundBook != undefined) {
          return res.json("title already exists");
        } else if (!error) {
          var newBook = new Book({
            title: title,
            commentcount: 0,
          });

          newBook.save((error, savedBook) => {
            if (!error && savedBook) {
              //console.log(savedBook)
              return res.json(savedBook);
            }
          });
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'

      Book.deleteMany({}, (error, status) => {
        if (!error && status) {
          return res.json("complete delete successful");
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      var bookid = req.params.id;

      Book.findById(bookid, "_id title comments", (error, foundBook) => {
        if (!error && foundBook == undefined) {
          return res.json("no book exists");
        } else if (!error && foundBook) {
          return res.json(foundBook);
        }
      });
    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;

      Book.findByIdAndUpdate(
        bookid,
        { $push: { comments: comment }, $inc: { commentcount: 1 } },
        { new: true },
        (error, updatedBook) => {
          if (!error && updatedBook == undefined) {
            return res.json("no book exists");
          } else if (!error && updatedBook) {
            return res.json(updatedBook);
          }
        }
      );
    })

    .delete(function (req, res) {
      var bookid = req.params.id;

      Book.findByIdAndRemove(bookid, (error, deletedBook) => {
        if (!error && deletedBook) {
          return res.json("delete successful");
        } else if (!deletedBook) {
          return res.json("could not delete");
        }
      });
    });
};
