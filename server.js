const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();


var admin = require("firebase-admin");

var serviceAccount = require("./firebase.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://harveststores-6e6a5.firebaseio.com"
// });

//routes
const shopRoutes = require("./routes/shopRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const { protect } = require("./middleware/auth.js");
const cookieParser = require('cookie-parser');
const db  = require("./models");
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
app.get("/demo", async(req, res) => {
  // const data = await db.Product.find({type:'product'});
  // for(var i of data){
  //   i.varient.push(i._id);
  //   i.save()
  // }
  var t='dTEJ6LCASZe-i2NfVRQ73r:APA91bFhoCiEvVuC0A2ALfgoZCqfVyRWgue1sKBosi-oqc5JHArXw_atZYIIW3PuKtM9Jn_RFFsITXbhtcEBs47oGAbIryuzUY6iWEMOZv4cA6yYkWD4Nq-JLpI7NDIXJaqXz6e-bpZd';
  const payload_from={
    notification:{
      title:"title",
      body:"body",
      icon:'ic_notification',
      sound:'default',
      priority:'normal'
    },
    data:{
      title:"title",
      body:"body",
      icon:'ic_notification',
      sound:'default',
      priority:'normal'
    }
  };
  const options={
    priority:'normal',
    timeToLive:60*60*24
  };
 var a = await admin.messaging().sendToDevice(t,payload_from,options)
  res.status(200).json({message:a});
});
var port = process.env.PORT || 3200;

app.listen(port, function () {
  console.log(`Server is running at the ${port}`);
});
module.exports = app;
