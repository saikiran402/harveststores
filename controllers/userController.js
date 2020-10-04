const db=require("../models");


exports.home= async function (req,res) {

  res.render()
}


  exports.sendOTP = async function (req, res, next) {
    try {

            if (validator.isMobilePhone(req.body.phone)) {
                let user = null;
                user = await db.User.findOne({ phone: req.body.phone });
                if (user != null) {
                    if (user.phone === req.body.phone) {
                        return next(new AppError("Mobile already registered", 400));
                    }
                }
                else {
                    var options = {
                        "method": "GET",
                        "hostname": "2factor.in",
                        "port": null,
                        "path": `/API/V1/${process.env.AUTH_KEY}/SMS/${req.body.phone}/AUTOGEN/OTPHARV`,
                        "headers": {}
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
                            }
                            else {
                                next(new AppError(OTPresponse.Details, 400));
                            }
                        });
                    });
                    req_in.write("{}");
                    req_in.end();
                }
            }
            else {
                next(new AppError("Invalid Mobile Number", 400));
            }

    }
    catch (error) {
        return next(new AppError(error, 400));
    }
}
exports.verifyOTP = async function (req, res, next) {
    try {

            var options = {
                "method": "GET",
                "hostname": "2factor.in",
                "port": null,
                "path": `/API/V1/${process.env.AUTH_KEY}/SMS/VERIFY/${req.body.encodedOtp}/${req.body.cOtp}`,
                "headers": {}
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
                          req.body.myorders=[];
                          req.body.mycart=[];
                            let user = await db.User.create(req.body);
                            let locations = await db.Location.create({ user: user.id })
                            user.location = locations.id;
                            user.save();
                            let { id, username } = user;
                            let token = jwt.sign({
                                id,
                                username
                            }, process.env.SECRET_KEY);
                            return res.status(200).json({'id':id, 'user': user, 'token': token, "OTPresponse": OTPresponse });
                        } catch (error) {
                            if (error.code == 11000) {
                                error.message = "error encountered";
                            }
                            next(new AppError(error.message, 400));
                        }
                    }
                    else {
                        next(new AppError(OTPresponse, 400));
                    }
                });
            });
            req_in.write("{}");
            req_in.end();

    }
    catch (error) {
        next(new AppError(error, 400));
    }
};
