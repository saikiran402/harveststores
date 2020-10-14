const db = require("../models");
var jwt = require("jsonwebtoken");
var validator = require("validator");
var http = require('http')
var uniqid = require('uniqid');


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
  
        }
        if (user2.phone === req.body.phone) {
          const user = db.Location.findOne({
            userId: user2._id,
            location: {
              $geoWithin: {
                $geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [17.5215578, 78.379194],
                      [17.5226098, 78.3788471],
                      [17.5187472, 78.3841335],
                      [17.5211034, 78.3855789],
                      [17.5227589, 78.3852478],
                      [17.5227589, 78.3852478],
                    ],
                  ],
                },
              },
            },
          });
          if (user) {
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
          } else {
            res.status(409).json({ message: "out of bounds" });
          }

        }
      } else {
        const user1 = await db.User.create({ phone: req.body.phone, verified: false, mycart: [], myorders: [] });
        

        const locations = await db.Location.create({ userId: user1._id, location: req.body.location });
        const user = db.Location.findOne({
          userId: user1._id,
          location: {
            $geoWithin: {
              $geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [17.5215578, 78.379194],
                    [17.5226098, 78.3788471],
                    [17.5187472, 78.3841335],
                    [17.5211034, 78.3855789],
                    [17.5227589, 78.3852478],
                    [17.5227589, 78.3852478],
                  ],
                ],
              },
            },
          },
        });
        if (user) {
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
        } else {
          res.status(409).json({ message: "out of bounds" });
        }

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
              user.save();
              return res.status(200).json({

                user: user,
                token: token,
                isAdmin: true,
                OTPresponse: OTPresponse,
              });
            } else {
              let locations = await db.Location.findOne({ userId: user._id });

              user.location = locations.id;
              user.verified = true;

              var id = user._id;
              let token = jwt.sign(
                { id },
                process.env.SECRET_KEY,
              );
              user.token = token;
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
    res.status(400).json(error.stack)

  }
};


//==============================>logged function
exports.updateLocation = async function (req, res, next) {
  const location = await db.Location.findOneAndUpdate({userId:req.user._id}, { location: req.body.location });
  res.status(200).json({ message: "updated" })
}
exports.within = async function (req, res, next) {
  console.log("Im In")
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
    res.status(409).json({ message: "out of bounds" });
  }
};
exports.getAllcategories = async function (req, res) {
  const data = await db.Category.find({});
  res.status(200).json({ data: data });
};

exports.getCategorySpecificProducts = async function (req, res, next) {
  const data = await db.Product.find({ category: req.params.category, type: "product" }).populate('varient');
  res.status(200).json({ data: data })
};

exports.showProduct = async function (req, res, next) {
  const data = await db.Product.find({ _id: req.params.product });
  res.status(200).json({ data: data })
};

exports.addToCart = async function (req, res, next) {
  console.log(req.user);
  const products = await db.Product.findOne({ _id: req.body.pid });
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
};

exports.getCartProducts = async function (req, res, next) {
  var obj = {
    cart: req.user.mycart,
    products: 0,
    credits:req.user.credits,
    amountDue:req.user.amountDue,
    total: 0
  }
  for (var cart of req.user.mycart) {
    if (cart.product.inStock) {
      obj.products = obj.products + 1;
      obj.total = obj.total + cart.price
    }

  }
  total1 = (obj.total - req.user.credits) + req.user.amountDue;
    if(total1>=0){
      obj.total=total1;
      
    }else{
      obj.total=0;
      
    }
  //obj.total = (obj.total - req.user.credits) + req.user.amountDue;
  res.status(200).json(obj)
};


exports.placeOrders = async function (req, res, next) {
  const user = await db.User.findOne({ _id: req.user._id }).populate('mycart.product', 'location');
  //console.log(user.mycart[0].product);

  if (req.params.payment_method == 'false') {
    var total = 0
    var cart = [];
    for (var item of user.mycart) {
      //console.log(item.product.inStock);

      if (item.product.inStock.toString() == 'true') {
        total = total + item.price;
        cart.push(item);
      }

    }
    total1 = (total - req.user.credits) + req.user.amountDue;
    if(total1>=0){
      total=total1;
      req.user.credits=0
      req.user.save();
    }else{
      total=0;
      req.user.credits=Number(total1);
      req.user.save()
    }
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
    const data = await db.Order.create(obj)
    req.user.credits = 0;
    req.user.myorders.push(data._id);
    //req.user.mycart = [];
    req.user.save();
    res.status(200).json({ message: data })
  } else {
    res.status(200).json({ message: 'Order placed succesfuly' })
  }
};

exports.ongoingOrder = async function (req, res, next) {
  const orders = await db.Order.find({ userId: req.user._id, status: "pending" });

  res.status(200).json(orders);
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
    for (var item of req.user.mycart) {
      if (item.product._id.toString() == req.body.pid.toString()) {
        item.count--;
        item.price = item.count * item.product.product_price;
      }
    };
  }
  req.user.save();
  return res.status(200).json({ message: "done" })
};
