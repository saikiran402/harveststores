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
var http = require('http')
var xmpp = require('simple-xmpp');

const { v4: uuidv4 } = require('uuid');
let uuid = uuidv4();
var options = {
  token: {
    key: "./AuthKey_W7N784P5DU.p8",
    keyId: "W7N784P5DU",
    teamId: "BKZH922A79"
  },
  production: false
};

// var apnProvider = new apn.Provider(options);

let deviceToken = "edabbfe41a9994397f46aa8b5a9c211312016bafd1831460bad397daf7bb616a"



// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
// note.badge = 3;
// note.title = 'Test';
// note.sound = "ping.aiff";
// note.action = 'Notifications';

// note.titleLocKey = 'Test';
// note.alert = {
//   "title" : "Game Request",
//   "subtitle" : "Five Card Draw",
//   "body" : "Bob wants to play poker"
// };
// note.payload = {'messageFrom': 'John Appleseed'};
// note.topic = "com.osos.spaarksapps";
// var note = new apn.Notification();
// note.expiry = 0; // Expires 1 hour from now.
// note.badge = 5;
// note.sound = "ping.aiff";
// note.payload = {"uuid":'678987678-65678909876-98765678-87656789',"handle":'Unknown',"callerName":'Unknown'};
// note.topic = "com.osos.spaarksapps.voip";
// note.pushType = 'background';
// note.userInteraction = true;
// note.expiry = 0; // Expires 1 hour from now.
// note.badge = 1;
// note.sound = "ping.aiff";
// // note.alert = "You have a new incomming call";
// note.pushType = "voip";
// note.payload = {
//   "uuid":uuid,
//   "handle":"genric",
//   "callerName":"Saikiran",
//   "content-available":1
// };
// note.topic = "com.osos.spaarksapps.voip";
// note.pushType = 'background';
// note.contentAvailable = 1
// note.action='userAction';
// note.setAction('userAction')
// note.expiry = 0; // Expires 1 hour from now.
//             note.alert = {
//               "title" : 'receiver.title',
//               "body" : 'receiver.body'
//             };
//             note.payload = {
//               postId:'receiver.postId.toString()',
//               apnType:'PostSpecificScreen',
//               featureName:'receiver.feature'
//             };

// note.topic = "net.conversely.app.background";

// apnProvider.send(note, 'edabbfe41a9994397f46aa8b5a9c211312016bafd1831460bad397daf7bb616a').then( (result) => {
//     // see documentation for an explanation of result
//     console.log(JSON.stringify(result));
// });



// curl -v -d '{"aps":{"alert":"hello"}}' --http2 --cert Certificates.pem:Spaarksweb@2020 https://api.push.apple.com/3/device/229d6e97c88945244ad57dc6061a56f2a43c6ca90ccf432254b492bc5831dab7

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://harveststores-6e6a5.firebaseio.com"
// });
const accountSid = 'ACed872c1bb3f451a2d2a5ccc116f25007'; 
const authToken = '652b515da44e9a55d2d715c676759f84'; 
const client = require('twilio')(accountSid, authToken); 



// xmpp.on('online', function(data) {
// 	console.log('Connected with JID: ' + data.jid.user);
// 	console.log('Yes, I\'m connected!');
// });

// xmpp.on('chat', function(from, message) {
// 	console.log(from,message)
// });

// xmpp.on('error', function(err) {
// 	console.error(err);
// });

// xmpp.on('subscribe', function(from) {
// console.log(from)
// });

// xmpp.setPresence('chat', 'Ready');

// xmpp.connect({
// 	jid: '6094e7b46e8d967dd5fc5fff@chat.spaarksweb.com',
// 	password: 'rEJQ1QvDN1',
// 	host: 'chat.spaarksweb.com',
// 	port: 5222
// });

// xmpp.on('stanza', function(stanza) {
//   console.log(stanza);
// });

// setTimeout(() => {
//   xmpp.acceptSubscription('60a629153fb1b60e5931a75b@chat.spaarksweb.com');
//   xmpp.subscribe('60a629153fb1b60e5931a75b@chat.spaarksweb.com');
//   var a = xmpp.getRoster();
//   console.log('Roster----------------------------------',a)
// }, 2000);



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

app.get('/getallp',async function(req,res){
  var prod = await db.Product.find({});
  return res.status(200).json(prod)
});

app.get('/sendapn',async function(req,res){
  apnProvider.send(note, deviceToken).then( (result) => {
    // see documentation for an explanation of result
    console.log(result)
    return res.status(200).json({message:result})
  });
})

app.get('/clearcart',async function(req,res){
  const data = await db.User.find({});
   for(var i of data){
     i.mycart = [];
     i.save()
   }
  return res.status(200).json('updated succesfully');
})

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


app.get('/getorders',async function(req,res){
  var data = await db.Order.find({});
  return res.status(200).json({message:data})
})

// app.get('/adddata', async function(req,res){
//   let stream = fs.createReadStream("oil.csv");
//   let csvData = [];
  
//   let csvStream = fastcsv
//     .parse()
//     .on("data", function(data) {
//       csvData.push({
//         category: data[0],
//         type: data[1],
//         image: data[2],
//         product_name: data[3],
//         product_description: data[4],
//         quantity: data[5],
//         isveg: Boolean(data[6]),
//         product_price: Number(data[7]),
//         original_price: Number(data[8])
//       });
//     })
//     .on("end", function() {
//       // remove the first line: header
//       csvData.shift();
//       console.log(csvData);
//       // db.Product.insertMany(csvData, (err, res) => {
//       //     if (err) throw err;
//       //     console.log(`Inserted: ${csvData.length} rows`);
//       //   });
//       // save to the MongoDB database collection
//     });
  
//   stream.pipe(csvStream);
//   return res.status(200).json({message:"Done"})
// });

// app.get('/generate', async function(req,res){
//   await db.Product.find({ category:'5f96ef11b6627a0017e7882f' }).remove().exec();
 
//   return res.status(200).json({message:"Done"});
// });

// app.get('/setmrp',async function(req,res){
//  var pro = await db.Product.find({});
//  if(pro){
//    pro.forEach(list=>{
//     list.original_price = list.product_price;
//     list.save();
//    });
//  }
//  return res.status(200).json({message:"Updated Succesfully"})
// });

// function relDiff(a, b) {
//   return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
//  }
// app.get('/calculatepercentage',async function(req,res){
//   var pro = await db.Product.find({});
//   if(pro){
//     pro.forEach(list=>{
//      var diff =  relDiff(list.original_price,list.product_price)
//      list.percent_off = diff.toFixed();
//      list.save();
//     });
//   }
//   return res.status(200).json({message:"Calculated Succesfully"})
//  });

//  app.get('/calculatesave',async function(req,res){
//   var pro = await db.Product.find({});
//   if(pro){
//     pro.forEach(list=>{
//      list.you_save=(list.original_price - list.product_price).toFixed(2);
//      list.save();
//     });
//   }
//   return res.status(200).json({message:"Calculated Succesfully"})
//  });

//  app.get('/init',async function(req,res){
//   var pro = await db.Category.find({});
//   if(pro){
//     pro.forEach(list=>{
//      list.order = 0;
//      list.save();
//     });
//   }
//   return res.status(200).json({message:"Init Succesfully"})
//  });


// app.get('/remove',async function(req,res){

//   var a = await db.Product.find({category:"5f7af4785b54032158c8442f"});

// a.forEach(async list=>{
//   list.varient = []
//   // list.varient.forEach(lust=>{
//   //   if(list._id == lust){

//   //   }else{
//   //     await db.Product.findByIdAndRemove(list);
//   //   }

//   // })
// list.save();
// })
  

//   return res.status(200).json({message:a.length});
// });



app.get('/sendmessage',async function(req,res){
  // const options = {
  //   hostname: '2factor.in',
  //   path: `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=a3c8bcb1-0643-11eb-9fa5-0200cd936042&to=8008551266&from=HARVST&templatename=HARVST&var1=There`,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // };


  var options = {
    method: "GET",
    hostname: "2factor.in",
    port: null,
    path: `/API/V1/${process.env.AUTH_KEY}/SMS/8008551266/AUTOGEN/ORDERRECEIVED`,
    headers: {},
  };

  // path: `/API/V1/${process.env.AUTH_KEY}/SMS/${phone}/AUTOGEN/SPAARKS`,

  var req_in = http.request(options, function (res_in) {
    var chunks = [];
    res_in.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res_in.on("end", function () {
      var body = Buffer.concat(chunks);
      const OTPresponse = JSON.parse(body.toString());
      if (OTPresponse.Status === "Success") {
        // res.status(200).json(OTPresponse);
        return res.status(200).json({message:"Done"})
      } else {
        // res.status(400).json(OTPresponse.Details);
        return res.status(200).json({message:"Done"})

      }
    });
  });
  req_in.write("{}");
  req_in.end();

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
  // client.messages 
  //     .create({ 
  //        body: 'Haevest Stores \n New Order Received ', 
  //        from: 'whatsapp:+14155238886',       
  //        to: 'whatsapp:+919949944524' 
  //      }) 
  //     .then(message => console.log(message.sid)) 
  //     .done();

})

app.get('/send',async function(req,res){

    // var tokensadmin = [];
    // a.forEach(list=>{
      // tokensadmin.push(list.registrationToken);
    // })
    // tokensadmin.forEach(list=>{
     //  console.log(a)
     var tok = "dxjQcIBRR3yqY2SAvuuneE:APA91bFB7KVw9CvXjin5kpjV7H-TxpKlyFPDSuDltxLp0xznKp1VoYWmzQDDF_SAa8ilspxXlRhPRYJ_DZmPPuQ6NZRhSCVUmik-w_jM4CCluEDSh_x2Py7n6boRwdxDqNqUyysu1e93";
     var s=await sendFcm(tok,"Harvest Stores","New Order Received");
      return res.status(200).json(s)
})


app.get('/delete-account', (req, res) => {
    // Get the email ID from the query parameters
    const emailId = 'https://mail.google.com/mail/u/0/#inbox?compose=new&to=harveststoresphaneendra@gmail.com';
  
    // Redirect to the mail app with the email ID
    if (emailId) {
      const mailAppUrl = `${emailId}`;
      res.redirect(mailAppUrl);
    } else {
      res.status(400).send('Something went wrong');
    }
  });

async function sendFcm(token,title,body){
  const payload_from={
    notification:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal',
      image:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'
    },
    data:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal',
      image:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'
    }
  };
  const options={
    priority:'normal',
    timeToLive:60*60*24
  };
 var a = await admin.messaging().sendToDevice(token,payload_from,options)
 console.log(a)
}

app.get('/delete-account', (req, res) => {
    // Get the email ID from the query parameters
    const emailId = 'https://mail.google.com/mail/u/0/#inbox?compose=new&to=harveststoresphaneendra@gmail.com';
  
    // Redirect to the mail app with the email ID
    if (emailId) {
      const mailAppUrl = `${emailId}`;
      res.redirect(mailAppUrl);
    } else {
      res.status(400).send('Something went wrong');
    }
  });

app.get('/privacy-policy',async function(req,res){
  res.render('policy');
});
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











