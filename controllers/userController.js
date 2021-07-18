const db = require("../models");
var jwt = require("jsonwebtoken");
var validator = require("validator");
var http = require('http')
var uniqid = require('uniqid');
var admin = require("firebase-admin");
const https = require('https');
var serviceAccount = require("../firebase.json");
const { title } = require("process");
const accountSid = 'ACed872c1bb3f451a2d2a5ccc116f25007'; 
const authToken = '652b515da44e9a55d2d715c676759f84'; 
const client = require('twilio')(accountSid, authToken); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://harveststores-6e6a5.firebaseio.com"
});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.sendOTP = async function (req, res, next) {
  try {
    console.log(req.body);
    if (validator.isMobilePhone(req.body.phone)) {

      const user2 = await db.User.findOne({ phone: req.body.phone });
      if (user2 != null) {
        if (user2.isAdmin) {
          var options = {
            method: "GET",
            hostname: "2factor.in",
            port: null,
            path: `/API/V1/${process.env.AUTH_KEY}/SMS/${req.body.phone}/AUTOGEN/OTPHARV`,
            headers: {},
          };
  
          var req_in = http.request(options, function (res_in) {
            var chunks = [];
            res_in.on("data", function (chunk) {
              chunks.push(chunk);
            });
  
            res_in.on("end", function () {
              var body = Buffer.concat(chunks);
              const OTPresponse = JSON.parse(body.toString());
              if (OTPresponse.Status === "Success") {
                res.status(200).json(OTPresponse);
              } else {
                res.status(400).json(OTPresponse.Details);
              }
            });
          });
          req_in.write("{}");
          req_in.end();
        }else{
  
        var options = {
              method: "GET",
              hostname: "2factor.in",
              port: null,
              path: `/API/V1/${process.env.AUTH_KEY}/SMS/${req.body.phone}/AUTOGEN/OTPHARV`,
              headers: {},
            };

            var req_in = http.request(options, function (res_in) {
              var chunks = [];
              res_in.on("data", function (chunk) {
                chunks.push(chunk);
              });

              res_in.on("end", function () {
                var body = Buffer.concat(chunks);
                const OTPresponse = JSON.parse(body.toString());
                if (OTPresponse.Status === "Success") {
                  res.status(200).json(OTPresponse);
                } else {
                  res.status(400).json(OTPresponse.Details);

                }
              });
            });
            req_in.write("{}");
            req_in.end();
     
          
}
        
      } else {
       await db.User.create({ phone: req.body.phone, verified: false, mycart: [], myorders: [] });
        
        // const user = db.Location.findOne({
        //   userId: use._id,
        //   location: {
        //     $geoWithin: {
        //       $geometry: {
        //         type: "Polygon",
        //         coordinates: [
        //           [
        //             [17.5215578, 78.379194],
        //             [17.5226098, 78.3788471],
        //             [17.5187472, 78.3841335],
        //             [17.5211034, 78.3855789],
        //             [17.5227589, 78.3852478],
        //             [17.5227589, 78.3852478],
        //           ],
        //         ],
        //       },
        //     },
        //   },
        // });
        //if (user) {
          var options = {
            method: "GET",
            hostname: "2factor.in",
            port: null,
            path: `/API/V1/${process.env.AUTH_KEY}/SMS/${req.body.phone}/AUTOGEN/OTPHARV`,
            headers: {},
          };

          var req_in = http.request(options, function (res_in) {
            var chunks = [];
            res_in.on("data", function (chunk) {
              chunks.push(chunk);
            });

            res_in.on("end", function () {
              var body = Buffer.concat(chunks);
              const OTPresponse = JSON.parse(body.toString());
              if (OTPresponse.Status === "Success") {
                res.status(200).json(OTPresponse);
              } else {
                res.status(400).json(OTPresponse.Details);
              }
            });
          });
          req_in.write("{}");
          req_in.end();
        // } else {
        //   res.status(409).json({ message: "out of bounds" });
        // }

      }
    } else {
      res.status(400).json({ message: "invalid number" });
    }
  } catch (error) {
    res.status(500).json(error.stack)
  }
};
exports.verifyOTP = async function (req, res, next) {
  try {
    console.log(req.body);
    var options = {
      method: "GET",
      hostname: "2factor.in",
      port: null,
      path: `/API/V1/${process.env.AUTH_KEY}/SMS/VERIFY/${req.body.encodedOtp}/${req.body.cOtp}`,
      headers: {},
    };

    var req_in = http.request(options, function (res_in) {
      var chunks = [];
      res_in.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res_in.on("end", async function () {
        var body = Buffer.concat(chunks);
        const OTPresponse = JSON.parse(body.toString());
        if (OTPresponse.Status === "Success") {
          // let newUser = {
          //     name: req.body.name,
          //     username: req.body.username,
          //     email: req.body.email,
          //     phone: req.body.phone,
          //     age: req.body.age,
          //     password: req.body.password,
          //     gender: req.body.gender,
          //     DOB: req.body.DOB
          // };
          try {
            let user = await db.User.findOne({ phone: req.body.phone });
            if (user.isAdmin) {
              var id = user._id;
              let token = jwt.sign(
                { id },
                process.env.SECRET_KEY,
              );
              user.token = token;
              user.registrationToken = req.body.registrationToken;
              user.save();
              return res.status(200).json({

                user: user,
                token: token,
                isAdmin: true,
                OTPresponse: OTPresponse,
              });
            } else {
              var id = user._id;
              let token = jwt.sign(
                { id },
                process.env.SECRET_KEY,
              );
              user.token = token;
              user.registrationToken = req.body.registrationToken;
              user.save();
              return res.status(200).json({

                user: user,
                token: token,
                isAdmin: false,
                OTPresponse: OTPresponse,
              });
            }
          } catch (error) {
            if (error.code == 11000) {
              error.message = "error encountered";
            }
            res.status(400).json(error.message)

          }
        } else {
          res.status(400).json(OTPresponse)

        }
      });
    });
    req_in.write("{}");
    req_in.end();
  } catch (error) {
    console.log(error);
    res.status(400).json(error.stack)

  }
};

//==============================>logged function
exports.updateLocation = async function (req, res, next) {
  console.log(req.body);
  var user = await db.Location.findOne({userId:req.user._id});
  if(user){
    var lo = {type:"Point",coordinates:[req.body.longitude,req.body.latitude]}
  const location = await db.Location.findOneAndUpdate({userId:req.user._id}, { location: lo });
  res.status(200).json({ message: "updated" })
  }else{
    var locations = {type:"Point",coordinates:[req.body.longitude,req.body.latitude]}
    var locc = {
      userId:req.user._id,
      location:locations
    }
  
    await db.Location.create(locc);
    res.status(200).json({ message: "updated" })
  }

  }

exports.within = async function (req, res, next) {
  console.log(req.user._id)

  const user = await db.Location.findOne({
    userId: req.user._id,
    location: {
      $geoWithin: {
        $geometry: 
        {
          "coordinates": [
            [
              [
                78.3846295,
                17.5242577
              ],
              [
                78.3844149,
                17.5237769
              ],
              [
                78.3842754,
                17.5234137
              ],
              [
                78.3840609,
                17.5228203
              ],
              [
                78.3839804,
                17.5225799
              ],
              [
                78.3837175,
                17.5226464
              ],
              [
                78.3832455,
                17.5225645
              ],
              [
                78.3829021,
                17.5224673
              ],
              [
                78.3827412,
                17.5220479
              ],
              [
                78.3826017,
                17.5216284
              ],
              [
                78.3822745,
                17.5217665
              ],
              [
                78.3821887,
                17.5215517
              ],
              [
                78.3817703,
                17.5214442
              ],
              [
                78.3813196,
                17.5215772
              ],
              [
                78.3812016,
                17.521521
              ],
              [
                78.3809441,
                17.5212754
              ],
              [
                78.3808744,
                17.5211219
              ],
              [
                78.380692,
                17.5211424
              ],
              [
                78.3805203,
                17.5210452
              ],
              [
                78.3804613,
                17.5207025
              ],
              [
                78.3804882,
                17.5204518
              ],
              [
                78.3805096,
                17.5201756
              ],
              [
                78.3803594,
                17.5196538
              ],
              [
                78.380236,
                17.5192957
              ],
              [
                78.380236,
                17.5191422
              ],
              [
                78.3805525,
                17.5190143
              ],
              [
                78.3806491,
                17.5189171
              ],
              [
                78.3805794,
                17.5187432
              ],
              [
                78.3806813,
                17.5186562
              ],
              [
                78.3805847,
                17.5184925
              ],
              [
                78.380574,
                17.5183186
              ],
              [
                78.3804131,
                17.5180782
              ],
              [
                78.3803058,
                17.5179094
              ],
              [
                78.3801931,
                17.5177815
              ],
              [
                78.3801395,
                17.5177303
              ],
              [
                78.3807725,
                17.5172648
              ],
              [
                78.3814484,
                17.5169374
              ],
              [
                78.382076,
                17.5163798
              ],
              [
                78.3826795,
                17.5168632
              ],
              [
                78.382878,
                17.5171983
              ],
              [
                78.382878,
                17.5171983
              ],
              [
                78.3835727,
                17.5171011
              ],
              [
                78.384313,
                17.5170499
              ],
              [
                78.3846778,
                17.5173876
              ],
              [
                78.385359,
                17.517541
              ],
              [
                78.3854449,
                17.5179452
              ],
              [
                78.3857185,
                17.518692
              ],
              [
                78.3857936,
                17.5189785
              ],
              [
                78.3858472,
                17.5195208
              ],
              [
                78.3860457,
                17.5200784
              ],
              [
                78.3867002,
                17.5209429
              ],
              [
                78.3875048,
                17.5218484
              ],
              [
                78.387773,
                17.5221757
              ],
              [
                78.3872795,
                17.522984
              ],
              [
                78.3870488,
                17.523337
              ],
              [
                78.3868182,
                17.5237206
              ],
              [
                78.3859438,
                17.5239866
              ],
              [
                78.3856487,
                17.5240838
              ],
              [
                78.3852088,
                17.5242219
              ],
              [
                78.3846295,
                17.5242577
              ]
            ]
          ],
          "type": "Polygon"
        }
      },
    },
  });
  if (user) {
    console.log(user);
    next()
  } else {
    next()
    //res.status(409).json({ message: "out of bounds" });
  }
};
exports.getAllcategories = async function (req, res) {
  const data = await db.Category.find({});
  res.status(200).json({ data: data });
};

exports.getCategorySpecificProducts = async function (req, res, next) {
  const data = await db.Product.find({ category: req.params.category, type: "product" }).populate('varient');
  //console.log(data);
  //console.log(req.user.mycart);
    for(var list of data){
      for(var cart of req.user.mycart){
      
        if(list._id.toString() == cart.product._id.toString()){
            list.count = cart.count;       
        }
        for(var varient of list.varient){
          
            if(varient._id.toString() == cart.product._id.toString()){
              varient.count = cart.count;
            }
          
        }
        
      }
      
    }

  
  res.status(200).json({ data: data })
};

exports.showProduct = async function (req, res, next) {
  const data = await db.Product.find({ _id: req.params.product });
  res.status(200).json({ data: data })
};

exports.addToCart = async function (req, res, next) {
  console.log(req.user);
  const products = await db.Product.findOne({ _id: req.body.pid });
  if(products){
  var found = false;
  if (req.user.mycart.length) {
    for (var item of req.user.mycart) {
      if (item.product._id.toString() == req.body.pid.toString()) {
        found = true;
        item.count++;
        item.price = item.count * item.product.product_price;
      }
    };
  }
  if (!found) {
    const obj = {
      product: req.body.pid,
      count: 1,
      price: products.product_price
    }
    req.user.mycart.push(obj);
  };
  req.user.save();
  res.status(200).json({ message: "added successfully" })
}else{

}
};

exports.getCartProducts = async function (req, res, next) {
  
  var obj = {
    cart: req.user.mycart,
    products: 0,
    totalBefore: 0,
    credits:req.user.credits,
    amountDue:req.user.amountDue,
    total: 0
  }
  if(req.user.mycart.length > 0){
  for (var cart of req.user.mycart) {
    if(cart.product != null){
    if (cart.product.inStock) {
      obj.products = obj.products + 1;
      obj.totalBefore = obj.total + cart.price;
      obj.total = obj.total + cart.price
    }
  }
  }
  var total1 = (obj.total - req.user.credits) + req.user.amountDue;
    if(total1>=0){
      obj.total=total1;
    }else{
      obj.total=0;
    }
  //obj.total = (obj.total - req.user.credits) + req.user.amountDue;
  res.status(200).json(obj)
  }else{
    var obj = {
      cart: req.user.mycart,
      products: 0,
      totalBefore: 0,
      credits:req.user.credits,
      amountDue:req.user.amountDue,
      total: 0
    }
    res.status(200).json(obj)
  }
};

exports.placeOrders = async function (req, res, next) {
  try{
  const user = await db.User.findOne({ _id: req.user._id }).populate('mycart.product location');
  console.log(user.mycart);

  if (req.params.payment_method == 'false') {
    var total = 0
    var cart = [];
    for (var item of user.mycart) {
      //console.log(item.product.inStock);

      if (item.product.inStock) {
        total = total + item.price;
        cart.push(item);
      }

    }
    total1 = total + req.user.amountDue;
    if(req.user.credits > total1){
      req.user.credits = req.user.credits - total1;
      total1 = 0;
      total=total1;
      req.user.amountDue = 0;
    }else{
      total1 = total1 - req.user.credits;
      req.user.credits = 0;
      req.user.amountDue = 0;
      total=total1;
    }
    // if(total1>=0){
    //   total=total1;
    //   req.user.credits=0
      
    // }else{
    //   total=0;
    //   req.user.credits=Number(total1);
    // }
    //console.log(cart, total);

    var orderId = uniqid();
    obj = {
      status: "pending",
      payment_method: "COD",
      paid: false,
      userId: req.user._id,
      orderId: orderId,
      products: cart,
      order_total: total,
      delivery_location: user.location,
      order_created: Date.now(),
    }
    const data = await db.Order.create(obj);
    //console.log(data);
    // req.user.credits = 0;
    // req.user.amountDue = 0;
    req.user.name = req.body.name;
    req.user.address = req.body.address;
    req.user.myorders.push(data._id);
    req.user.mycart = [];
    req.user.save();
     var a = await db.User.findOne({phone:"9949944524"});
    // var tokensadmin = [];
    // a.forEach(list=>{
      // tokensadmin.push(list.registrationToken);
    // })
    // tokensadmin.forEach(list=>{
      // console.log(`https://2factor.in/API/R1/?module=TRANS_SMS&apikey=55706bfd-18b7-11ea-9fa5-0200cd936042&to=${order.uid.contact}&from=BUYMNO&templatename=SHIPPED&var1=${pname}&var2=${order.oid}&var3=${odate}&var4=${v4}`);
    
      sendFcm(a.registrationToken,"Harvest Stores","New Order Received");
      var options = {
        method: "GET",
        hostname: "2factor.in",
        port: null,
        path: `/API/V1/${process.env.AUTH_KEY}/SMS/9949944524/AUTOGEN/ORDERRECEIVED`,
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
      // client.messages 
      // .create({ 
      //    body: 'New Order Received ', 
      //    from: 'whatsapp:+14155238886',       
      //    to: 'whatsapp:+919949944524' 
      //  }) 
      // .then(message => console.log(message.sid)) 
      // .done();
    // })
    //sendFcm(req.user.registrationToken,"Harvest Stores","Order Placed Successfully");
    res.status(200).json({ message: data })
  } else {
    var total = 0
    var cart = [];
    for (var item of user.mycart) {
      //console.log(item.product.inStock);

      if (item.product.inStock) {
        total = total + item.price;
        cart.push(item);
      }

    }
    total1 = total + req.user.amountDue;
    if(req.user.credits > total1){
      req.user.credits = req.user.credits - total1;
      total1 = 0;
      total=total1;
      req.user.amountDue = 0;
    }else{
      total1 = total1 - req.user.credits;
      req.user.credits = 0;
      req.user.amountDue = 0;
      total=total1;
    }
    // if(total1>=0){
    //   total=total1;
    //   req.user.credits=0
      
    // }else{
    //   total=0;
    //   req.user.credits=Number(total1);
    // }
    //console.log(cart, total);

    var orderId = uniqid();
    obj = {
      status: "pending",
      payment_method: "ONLINE",
      paid: true,
      userId: req.user._id,
      orderId: orderId,
      products: cart,
      order_total: total,
      delivery_location: user.location,
      order_created: Date.now(),
    }
    const data = await db.Order.create(obj);
    //console.log(data);
    // req.user.credits = 0;
    // req.user.amountDue = 0;
    req.user.name = req.body.name;
    req.user.address = req.body.address;
    req.user.myorders.push(data._id);
    req.user.mycart = [];
    req.user.save();
     var a = await db.User.findOne({phone:"9949944524"});
    // var tokensadmin = [];
    // a.forEach(list=>{
      // tokensadmin.push(list.registrationToken);
    // })
    // tokensadmin.forEach(list=>{
      // console.log(`https://2factor.in/API/R1/?module=TRANS_SMS&apikey=55706bfd-18b7-11ea-9fa5-0200cd936042&to=${order.uid.contact}&from=BUYMNO&templatename=SHIPPED&var1=${pname}&var2=${order.oid}&var3=${odate}&var4=${v4}`);
    
      sendFcm(a.registrationToken,"Harvest Stores","New Order Received");
      var options = {
        method: "GET",
        hostname: "2factor.in",
        port: null,
        path: `/API/V1/${process.env.AUTH_KEY}/SMS/9949944524/AUTOGEN/ORDERRECEIVED`,
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
      // req_in.writeHead(200)
      // req_in.write("{}");
      // req_in.end();
      // client.messages 
      // .create({ 
      //    body: 'New Order Received ', 
      //    from: 'whatsapp:+14155238886',       
      //    to: 'whatsapp:+919949944524' 
      //  }) 
      // .then(message => console.log(message.sid)) 
      // .done();
    // })
    //sendFcm(req.user.registrationToken,"Harvest Stores","Order Placed Successfully");
    res.status(200).json({ message: data })
  }
  }catch(err){
    console.log(err)
  }
};
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
exports.ongoingOrder = async function (req, res, next) {
  const order = await db.Order.findOne({ _id:req.params.orderId },'order_created status payment_method orderId products order_total delivered_by delivered_contact delivery_location').populate({path:'products.product',select:'product_name quantity product_price image userId'}).populate({path:'delivered_by',select:'phone name'}).populate({path:'delivery_location',select:'location'}).populate({path:'userId',select:'name phone address'});
  res.status(200).json(order);
};

exports.ongoingOrderapp = async function (req, res, next) {
  const order = await db.Order.findOne({ _id:req.params.orderId },'order_created status payment_method orderId products order_total delivered_by delivered_contact delivery_location').populate({path:'products.product',select:'product_name quantity product_price image userId'}).populate({path:'delivered_by',select:'phone name'});
  res.status(200).json(order);
};

exports.myPayments = async function (req, res, next) {
  const orders = await db.Order.find({ userId: req.user._id, paid: true });

  res.status(200).json(orders);
};

exports.logout = async function (req, res, next) {
  await db.User.findOneAndUpdate({ _id: req.user._id }, { status: false, token: "" });
  res.status(200).json({ message: "logged out" });
};

exports.updateCart = async function (req, res, next) {
  if (req.user.mycart.length) {
    console.log(req.user.mycart);
    for (var item of req.user.mycart) {
 console.log(item)
      if (item.product._id.toString() === req.body.pid.toString()) {
        if(item.count>1){
        item.count = item.count - 1;
        item.price = item.count * item.product.product_price;
        item.save();
        }else{
          req.user.mycart =  req.user.mycart.filter(function(el) { return el.product._id != req.body.pid; });
        }
      }
    };
  }
  req.user.save();
  return res.status(200).json({ message: "done" })
};

exports.removeCart = async function (req, res, next) {
  var user = await db.User.findByIdAndUpdate(req.user._id,{$pull:{mycart:{product:req.body.pid}}});
  user.save();
  return res.status(200).json({ message: "done" })

};

exports.getproducts = async function (req, res, next) {
  // var a = await db.Product.find({type:"product"});
  // found = false;
  // a.forEach(product=>{
  //   product.__v = 0;
  //   req.user.mycart.forEach(cart=>{
  //     console.log(product._id.toString(),cart.product._id.toString())
  //     if(product._id.toString() == cart.product._id.toString() ){
  //       console.log("Im in")
  //       product.__v = cart.count;
  //       product.save()
  //       found = true;
  //     }
  //   })
  //   found = false;
  // })
  // return res.status(200).json(a)
  console.log("in ",req.user.mycart.length)
  
  //console.log(data);
  //console.log(req.user.mycart);
    if(req.user.mycart.length > 0){
      console.log("ins")
      const data = await db.Product.find({ type: "product" }).populate('varient').limit(10);
      if(req.user.mycart.length){}
    for(var cart of req.user.mycart){
        for(var list of data){
        if(list._id.toString() == cart.product._id.toString()){
            list.count = cart.count;       
        }
        for(var varient of list.varient){
          
            if(varient._id.toString() == cart.product._id.toString()){
              varient.count = cart.count;
            }
          
        }
        
      }
      
    }
  
        return res.status(200).json(data)
  }else{
    console.log("insss")
    const data = await db.Product.find({ type: "product" }).populate('varient').limit(10);
    console.log("insss")
    return res.status(200).json(data)
  }
     
};




exports.getmyOrders = async function (req, res, next) {
  var orders = await db.User.findOne({_id:req.user._id},'myorders').populate('myorders').populate('myorders.products.product');
  orders.myorders.reverse()
  return res.status(200).json(orders)
};


exports.banner = async function (req, res, next) {
  var b = await db.Banner.find({});
  return res.status(200).json(b)
};



