const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
console.log("server is working");
app.use(express.json())

require("./db/db");
let User = require("./db/models/users");
let Product = require('./db/models/AddProduct');
let Order = require("./db/models/Order");
let Otp = require("./db/models/Otp");
let Finalcart = require("./db/models/Finalcart");
let myFileSystem = require('fs');

let path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(req.file);
        let path = './Server/images';
        myFileSystem.mkdir(path, () => {
            // console.log("user created");
            cb(null, path)
            // console.log(path);

        })
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })



let users = [];

app.post('/create_user', async (req, res) => {
    // users.push(req.body);
    async function main() {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: "mzain197197@gmail.com",
                pass: "mbxwivotrmsbcpyo",
            },
        });
        let info = await transporter.sendMail({
            from: "mzain197197@gmail.com", // sender address
            to: req.body.email, //  receivers
            subject: "Thanks For Sending Emails ✔",
            text: "Hello world?",
            html: "<b>Email Sent Successfully </b>",
        });
        // console.log("Message sent: %s", info.messageId);
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    main().catch(console.error);
    //--------------------------------------------------------
    if (req.body.email == undefined) {
        res.json("not successfull")
    } else {
        let user = new User(req.body);
        await user.save();
        res.json({
            success: true
        })
    }
    // console.log("data a raha hai", req.body);
})


app.post('/login', async (req, res) => {
    const newuser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    })

    if (newuser) {
        res.json({ newuser });
    } else {
        res.json(null)
    }
});

let AddProducts = [];

app.post('/Add_product', upload.single("imgdata"), async (req, res) => {

    // console.log(req.body);
    req.body.imgdata = '/' + (req.file.originalname)
    // console.log(req.file);
    let newProducts = new Product(req.body);
    await newProducts.save();


    res.json({
        success: true
    })

});
app.get("/data_lao", async (req, res) => {

    let full = await Product.find()
    res.json(full)

})
app.get("/data_po", async (req, res) => {
    // console.log(req.query);
    let full = await Product.findById(req.query.id)

    res.json(full)
})

app.delete('/user-delete-karo', async (req, res) => {

    await Product.findByIdAndDelete(req.query.someID)
    // console.log(req.query.someID);
    res.json({
        success: true
    })
})


app.get('/productLao', async (req, res) => {

    let product = await Product.findById(req.query.id);
    res.json(product);
});

app.post('/product_Update', upload.single("imgdata"), async (req, res) => {
    req.body.imgdata = '/' + (req.file.originalname)
    // console.log(req.body)
    let a = await Product.findByIdAndUpdate(req.query.id, req.body)
    // console.log(a, "updated ha");
    res.json({
        success: true
    })

});

app.get("/get_users", async (req, res) => {
    let Logusers = await User.find()
    // console.log(Logusers);
    res.json(Logusers)
});

app.post('/Users_order', async (req, res) => {
    // console.log("data a raha hai", req.body);
    let details = new Order(req.body);
    await details.save();
    res.json({
        success: true
    })
})

app.post('/final_cart', async (req, res) => {

    let upa = await Product.findByIdAndUpdate(req.body._id, req.body)
    let a = await Product.findById(req.body._id)
    a.qnty = req.body.qnty * 0
    await a.save();
    res.json({
        success: true
    })

    // let cart = new Finalcart(req.body)
    // await cart.save()

})

app.get("/address_details_for_admin", async (req, res) => {
    let adressdetail = await Order.find()
    // console.log(adressdetail);
    res.json(adressdetail)
});

app.post("/forget_password", async (req, res) => {
    const emailHai = await User.findOne({ email: req.body.email })
    if (emailHai) {
        let otpcode = Math.floor((Math.random() * 10000) + 1);

        let saveOtpData = new Otp({
            email: req.body.email,
            code: otpcode
        })
        let otpResponse = saveOtpData.save();

        async function main() {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                auth: {
                    user: "mzain197197@gmail.com",
                    pass: "mbxwivotrmsbcpyo",
                },
            });
            let info = await transporter.sendMail({
                from: "mzain197197@gmail.com", // sender address
                to: req.body.email, //  receivers
                subject: otpcode,
                text: "Hello world?",
                html: "<b>Enter Correct OTP</b>",
            });

        }
        main().catch(console.error);
        res.json({
            success: true

        })
    } else {
        res.json({
            success: false
        })
    }

})
//for Valdation of Otp
app.get('/check-otp-for-validation', async (req, res) => {
    // console.log(req.query);
    let chkOtp = await Otp.findOne({ code: req.query.otp })
    if (chkOtp) {
        res.json(chkOtp)
    } else if (chkOtp === null) {
        res.json(null)
    }

});

app.post('/check_otp', async (req, res) => {
    // console.log(req.body);
    let otpMatched = await Otp.findOne({ code: req.body.otp })

    if (otpMatched) {
        let user = await User.findOne({ email: req.body.email })
        user.password = req.body.newpassword
        user.save();
        // console.log(user);
        res.json({
            success: true
        })
    } else {
        res.json({
            success: false
        })
    }
})

app.post('/Reset_name', async (req, res) => {
    let a = await User.findById(req.query.id)
    a.username = req.body.newname
    a.save()
    if (a) {
        res.json({ a });
    } else {
        res.json(null)
    }

});
app.post('/Reset_email', async (req, res) => {
    let a = await User.findById(req.query.id)
    a.email = req.body.newemail
    a.save()
    if (a) {
        res.json({ a });
    } else {
        res.json(null)
    }

});
app.post('/Reset_Password', async (req, res) => {

    let a = await User.findById(req.query.id)
    a.password = req.body.confirmpassword
    a.save()
    if (a) {
        res.json({ a });
    } else {
        res.json(null)
    }

});

app.delete('/Delete_user_Account', async (req, res) => {

    await User.findByIdAndDelete(req.query.someID)

    res.json({
        success: true
    })
})


app.use(express.static('./Server/images'))
app.listen(4000, () => {
    console.log("Port is listening");
})