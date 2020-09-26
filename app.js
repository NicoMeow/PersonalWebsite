const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const nodemailer = require('nodemailer');
const isImage = require('is-image');
const multiparty = require('multiparty');
const PORT = 8000;


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

//database connections
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
                                                                    "I think Minimalism is awesome. I"
    },
    {
        _id: 2,
        title: "A shorter post",
        content: "This is a much shorter most since no longer need to test lien spanning"
    },
]
//retrieve all the image path, check if the file is image and put it in photoPaths array
var rawPhotoPaths = fs.readdirSync('public/images/');
var photoPaths=[];
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
//var transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//    user: 'avmikechi@gmail.com',
//    pass: 'stickTopl4n'
//  }
//});
//
//var mailOptions = {
//  from: 'avmikechi@gmail.com',
//  to: 'avmikechi@gmail.com',
//  subject: 'Sending Email using Node.js',
//  text: 'That was easy!'
//};
//
//transporter.sendMail(mailOptions, function(error, info){
//  if (error) {
//    console.log(error);
//  } else {
//    console.log('Email sent: ' + info.response);
//  }
//});

app.post('/send-message', (req, res) => {
    console.log("clicked on submit button");
    console.log("request body is " + req.body);
    console.log((JSON.stringify(req.body)));
    console.log("commenter name is" + req.body.name);
    Message.create(req.body).then((dbMessage) => {
        //If we are able to successfully create message, send it back to client;
        res.json(dbMessage);
    }).catch((err) => {
        //If an error occurred, send it to the client
        res.json(err);
    });
})

app.post('/leave-comment', (req, res) => {
    let form = new multiparty.Form();
    let comment = {};
    comment.date = new Date();
    form.parse(req, (err, fields, files) => {
        console.log("fields are " + JSON.stringify(fields));
        //console.log("files are " + JSON.stringify(files));
        Object.keys(fields).forEach((key) => {
            comment[key] = fields[key][0];
        })
        console.log("comment is" + JSON.stringify(comment));
        Comment.create(comment).then((dbMessage) => {
            res.send(comment);
            // Send the response should render the document with the new comment
        }).catch((err) => {
            console.log("code reached error");
            res.json(err);
        })
    })
//    console.log("clicked on submit button to leave comment");
//    console.log("request body is " + (JSON.stringify(req.body)));
//    let comment = req.body;
//    comment.date = new Date();
//    console.log("comment is" + JSON.stringify(comment));

})







app.listen(PORT)