const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
//const helmet = require('helmet');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const nodemailer = require('nodemailer');
const isImage = require('is-image');
const multiparty = require('multiparty');
const PORT = process.env.PORT || 8000
const AWS = require("aws-sdk");
const LOCAL_PHOTO_PATH = 'public/images/';
const REMOTE_PHOTO_PATH = 'http://s3.amazonaws.com/personalwebsitecharlene-media'

//load configuration from staging or local environment
//local
//require('custom-env').env()
//staging
//require('custom-env').env('staging')

//Require model
var Message = require("./model/message.js");
var Comment = require("./model/comment.js");
var BlogPost = require("./model/blogPost.js");

//Template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
//middleware to check against well known vulnerabilities
//app.use(helmet());

//database connections
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//AWS access
//
//
//AWS.config.getCredentials(function(err) {
//  if (err) console.log(err.stack);
//  // credentials not loaded
//  else {
//    console.log("Access key:", AWS.config.credentials.accessKeyId);
//  }
//});



// TODO..
// Read from txt files in the files system or db, compile to a JSON string
//example posts in json format
const BLOG_POSTS = [
    {   _id: 1,
        title: "My Take On Minimalism",
        content: "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much. " +
                                                                    "alism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. Ialism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. It solves all the problems in the world for me people like me whose only worry is having too much." +
                                                                    "I think Minimalism is awesome. I"
    },
    {
        _id: 2,
        title: "A shorter post",
        content: "This is a much shorter most since no longer need to test lien spanning"
    },
]

var s3 = new AWS.S3();
var params = {Bucket: 'personalwebsitecharlene-media'}
var s3file = s3.getObject(params)
//console.log("s3 files are" + JSON.stringify(s3file));
//retrieve all the image path, check if the file is image and put it in photoPaths array
var rawPhotoPaths = fs.readdirSync(REMOTE_PHOTO_PATH);
var photoPaths=[];
//temporarily commented out
for (photo of rawPhotoPaths) {
    if (isImage(photo)) {
        photoPaths.push(photo);
    }
}

app.get('/', (req, res) => {
    //Render index.html with blog posts and comments from database before sending
    res.render('index', {
        photoPaths: photoPaths,
        blogPosts: BLOG_POSTS
    });

})

app.get('/get-comments/:id', (req, res) => {
    //retrieve the comment from the database that matches the request id
    var article_id = req.params.id;
    //do a database query based on article_id
    Comment.find({blogPostId: article_id}, function (err, docs) {
        res.send(docs);
        });
})

//Email setup
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'personalwebsitecharlene',
    pass: 'fiwkaz-vamwuw-fahtU8'
  }
});

var mailOptions = {
  from: 'personalwebsitecharlene@gmail.com',
  to: 'personalwebsitecharlene@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

app.post('/leave-comment', (req, res) => {
    let form = new multiparty.Form();
    let comment = {};
    comment.date = new Date();
    form.parse(req, (err, fields, files) => {
        console.log("comment fields are " + JSON.stringify(fields));
        //Process the FormData and add to comment object
        Object.keys(fields).forEach((key) => {
            comment[key] = fields[key][0];
        })
        console.log("comment is" + JSON.stringify(comment));
        Comment.create(comment).then((dbMessage) => {
            res.send(comment);
        }).catch((err) => {
            console.log("cannot save to database" + dbMessage);
            res.json(err);
        });
    });
});

app.post('/send-message', (req, res) => {
    let form = new multiparty.Form();
    let message = {};
    message.date = new Date();
    form.parse(req, (err, fields, files) => {
        console.log("message fields are " + JSON.stringify(fields));
        //Process the FormData and add to message object
        Object.keys(fields).forEach((key) => {
            message[key] = fields[key][0]
        })
        console.log("message is" + JSON.stringify(message));
        var mailOptions = {
          from: 'personalwebsitecharlene@gmail.com',
          to: 'personalwebsitecharlene@gmail.com',
          subject: `[PersonalWebsite message] Sender: ${message.name} Email: ${message.email}`,
          text: message.message,
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.send("cannot send email" + error);
          } else {
            console.log('Email sent: ' + info.response);
            res.send("success! + info.response");
          }
        });
        // no need to save message to database at this moment, instead just send email.
//        Message.create(message).then((dbMessage) => {
//            res.send(message);
//            //TODO..
//            //Send email
//        }).catch((err) => {
//            console.log("cannot save to database" + dbMessage);
//            res.json(err);
//        })
    })
})





app.listen(PORT)