const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The Schemas
var BlogPostSchema = new Schema({
    title: {type: String, required: true},
    contents: {type: String, required: true},
    postDate: {type: Date}
})


//The Models
var BlogPost = mongoose.model("BlogPost", BlogPostSchema);



//Export the model
module.exports = BlogPost;