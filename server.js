var express = require("express");
var bodyParser = require("body-parser");
var expect = require("chai").expect;

var apiRoutes = require("./routes/api.js");
var helmet = require("helmet");

let dotenv = require("dotenv");
dotenv.config();

var app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
const nocache = require("nocache");

app.use(nocache());

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Start our server and its!
let listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = app; //for unit/functional iting
