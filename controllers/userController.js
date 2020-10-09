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
        const location = {
          type: 'Point',
          coordinates: [req.body.latitude, req.body.longitude]
        };

        const locations = await db.Location.create({ userId: user1._id, location: location });
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
  const location = await db.Location.findByIdAndUpdate({ userId: user1._id }, { locations: req.body.location });
  res.status(200).json({ message: "updated" })
}
exports.within = async function (req, res, next) {
  const user = db.Location.findOne({
    userId: req.user._id,
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
    total: 0
  }
  for (var cart of req.user.mycart) {
    if (cart.product.inStock) {
      obj.products = obj.products + 1;
      obj.total = obj.total + cart.price
    }

  }
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
