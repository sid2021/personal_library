/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let id = "";
let title = "";
let comment = "";

describe("Functional Tests", function () {
  describe("Routing tests", function () {
    describe("POST /api/books with title => create book object/expect book object", function () {
      it("Test POST /api/books with title", function (done) {
        title = "Malazan Book of the Fallen" + Math.floor(Math.random() * 1000);

        chai
          .request(server)
          .post("/api/books")
          .send({
            title: title,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, title);
            assert.isNotNull(res.body._id);
            id = res.body._id;
            done();
          });
      });

      it("Test POST /api/books with no title given", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: "",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing title");
            done();
          });
      });
    });

    describe("GET /api/books => array of books", function () {
      it("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    describe("GET /api/books/[id] => book object with [id]", function () {
      it("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + "5f9699b8017f1f0419e89b99")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });

      it("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, title);
            done();
          });
      });

      describe("POST /api/books/[id] => add comment/expect book object with id", function () {
        it("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({
              comment: "test comment",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, id);
              assert.equal(res.body.title, title);
              assert.isTrue(res.body.comments.includes("test comment"));
              assert.equal(res.body.comments, "test comment");
              assert.include(res.body.comments, "test comment");
              done();
            });
        });
      });
    });
  });
});
