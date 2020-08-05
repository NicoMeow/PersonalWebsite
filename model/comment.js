const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The Schemas
var CommentSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    content: {type: String, required: true},
    date: {type: Date, required: true},
    blogPostId: {type: String, required: true},
})


//The Models
var Comment = mongoose.model("Comment", CommentSchema);



//Export the model
module.exports = Comment;