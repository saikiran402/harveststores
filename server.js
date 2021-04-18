const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();
moment = require("moment");
const fs = require("fs");
const fastcsv = require("fast-csv");
var admin = require("firebase-admin");
const {ObjectId} = require('mongodb');
var serviceAccount = require("./firebase.json");
const Blob = require("cross-blob");
const axios = require("axios");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://harveststores-6e6a5.firebaseio.com"
// });
const accountSid = 'ACed872c1bb3f451a2d2a5ccc116f25007'; 
const authToken = '652b515da44e9a55d2d715c676759f84'; 
const client = require('twilio')(accountSid, authToken); 


const https = require('https');
const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
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

// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

// Sentry.init({
//   dsn: "https://fb01474a091247e89364a9ea0ea80fe9@o471689.ingest.sentry.io/5504019",

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

// const transaction = Sentry.startTransaction({
//   op: "test",
//   name: "My First Test Transaction",
// });

// setTimeout(() => {
//   try {
//     foo();
//   } catch (e) {
//     Sentry.captureException(e);
//   } finally {
//     transaction.finish();
//   }
// }, 99);
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
  let stream = fs.createReadStream("../house/house.csv");
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
        product_price: Number(data[7]),
        original_price: Number(data[8])
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

app.get('/generate', async function(req,res){
  await db.Product.find({ category:'5f96ef11b6627a0017e7882f' }).remove().exec();
 
  return res.status(200).json({message:"Done"});
});

app.get('/setmrp',async function(req,res){
 var pro = await db.Product.find({});
 if(pro){
   pro.forEach(list=>{
    list.original_price = list.product_price;
    list.save();
   });
 }
 return res.status(200).json({message:"Updated Succesfully"})
});

function relDiff(a, b) {
  return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
 }
app.get('/calculatepercentage',async function(req,res){
  var pro = await db.Product.find({});
  if(pro){
    pro.forEach(list=>{
     var diff =  relDiff(list.original_price,list.product_price)
     list.percent_off = diff.toFixed();
     list.save();
    });
  }
  return res.status(200).json({message:"Calculated Succesfully"})
 });

 app.get('/calculatesave',async function(req,res){
  var pro = await db.Product.find({});
  if(pro){
    pro.forEach(list=>{
     list.you_save=(list.original_price - list.product_price).toFixed(2);
     list.save();
    });
  }
  return res.status(200).json({message:"Calculated Succesfully"})
 });

 app.get('/init',async function(req,res){
  var pro = await db.Category.find({});
  if(pro){
    pro.forEach(list=>{
     list.order = 0;
     list.save();
    });
  }
  return res.status(200).json({message:"Init Succesfully"})
 });


app.get('/remove',async function(req,res){

  var a = await db.Product.find({category:"5f7af4785b54032158c8442f"});

a.forEach(async list=>{
  list.varient = []
  // list.varient.forEach(lust=>{
  //   if(list._id == lust){

  //   }else{
  //     await db.Product.findByIdAndRemove(list);
  //   }

  // })
list.save();
})
  

  return res.status(200).json({message:a.length});
});



app.get('/sendmessage',async function(req,res){
  // const options = {
  //   hostname: '2factor.in',
  //   path: `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=a3c8bcb1-0643-11eb-9fa5-0200cd936042&to=8008551266&from=HARVST&templatename=HARVST&var1=There`,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // };

  // await axios.post(`https://2factor.in/API/R1/?module=TRANS_SMS&apikey=a3c8bcb1-0643-11eb-9fa5-0200cd936042&to=8008551266&from=HARVST&templatename=HARVST&var1=There`,{
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }}).then((resp)=>{
  //     console.log(resp)
  //   });
  // client.messages 
  // .create({ 
  //    body: 'Harvest Stores - New Order Received', 
  //    from: '+12063171942', 
  //    messagingServiceSid: 'MG39e7d22e1bacbd19602d743c7caf808e',      
  //    to: '+919949944524' 
  //  }) 
  // .then(message => console.log(message.sid)) 
  // .done();
  client.messages 
      .create({ 
         body: 'Haevest Stores \n New Order Received ', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+919949944524' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
  return res.status(200).json({message:"Done"})
})

app.get('/send',async function(req,res){

    // var tokensadmin = [];
    // a.forEach(list=>{
      // tokensadmin.push(list.registrationToken);
    // })
    // tokensadmin.forEach(list=>{
     //  console.log(a)
     var tok = "ba415ad341ad5800dc5d82737b698fe3b97e0e5a8eede8a970c409908fa612c4";
     var s=await sendFcm(tok,"Harvest Stores","New Order Received");
      return res.status(200).json(s)
})

async function sendFcm(token,title,body){
  const payload_from={
    notification:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal'
    },
    data:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal'
    }
  };
  const options={
    priority:'normal',
    timeToLive:60*60*24
  };
  await admin.messaging().sendToDevice(token,payload_from,options)
}

// app.get('/addtovarient',async function(req,res){

//   var a = await db.Product.find({type: "product"});
//   a.forEach(list=>{
//     list.varient.push(list._id)
//     list.save();
//   })
//   return res.status(200).json({message:"Done"});
// });
var port = process.env.PORT || 3200;

app.listen(port, function () {
  console.log(`Server is running at the ${port}`);
});
module.exports = app;












