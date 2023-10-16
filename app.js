require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

// console.log(process.env.API_KEY);
// console.log(md5("567890"));

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true, 
useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
         });
    
         newUser.save();
        //  console.log(newUser);
         res.render("secrets");
    });
     
});

app.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: username });

        if (foundUser) {
            // Load hash from your password DB.
         bcrypt.compare(password, foundUser.password, function (err, result) {
            if (err) {
                console.log(err);
            } else if (result === true) {
                res.render("secrets");
            } else {
                res.render("login" , {error: "Incorrect details"});
            }
         });
        }  
    } catch (err) {
        console.log(err);
    }
});





app.listen(3000, function() {
    console.log("Server started on port 3000.");
})
