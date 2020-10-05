const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();
//routes
const shopRoutes = require("./routes/shopRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const { protect } = require("./middleware/auth.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("dev"));
const version = "V1.0";

app.use(`/shop`, shopRoutes);
app.use(`/user`, userRoutes);
app.get("/", (req, res) => {
  res.redirect("/shop");
});
var port = process.env.PORT || 3200;

app.listen(port, function () {
  console.log(`Server is running at the ${port}`);
});
module.exports = app;
