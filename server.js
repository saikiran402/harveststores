const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();


var admin = require("firebase-admin");

var serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://harveststores-6e6a5.firebaseio.com"
});

//routes
const shopRoutes = require("./routes/shopRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const { protect } = require("./middleware/auth.js");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("dev"));
const version = "V1.0";

app.use(`/shop`, shopRoutes);
app.use(`/user`, userRoutes);
app.get("/", (req, res) => {
  res.render('Login_v1/index', { msg: "" })
  //res.redirect("/shop");
});
var port = process.env.PORT || 3200;

app.listen(port, function () {
  console.log(`Server is running at the ${port}`);
});
module.exports = app;
