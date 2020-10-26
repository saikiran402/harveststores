const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();
moment = require("moment");
const fs = require("fs");
const fastcsv = require("fast-csv");
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
app.locals.moment = moment;
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


app.get('/adddata', async function(req,res){
  let stream = fs.createReadStream("sample.csv");
  let csvData = [];
  
  let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
      csvData.push({
        category: data[0],
        type: data[1],
        image: data[2],
        product_name: data[3],
        product_description: data[4],
        quantity: data[5],
        isveg: Boolean(data[6]),
        product_price: Number(data[7])
      });
    })
    .on("end", function() {
      // remove the first line: header
      csvData.shift();
      console.log(csvData);
      db.Product.insertMany(csvData, (err, res) => {
          if (err) throw err;
          console.log(`Inserted: ${csvData.length} rows`);
        });
      // save to the MongoDB database collection
    });
  
  stream.pipe(csvStream);
  return res.status(200).json({message:"Done"})
});

var port = process.env.PORT || 3200;

app.listen(port, function () {
  console.log(`Server is running at the ${port}`);
});
module.exports = app;
