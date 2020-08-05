const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The Schemas
var MessageSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true}
})

//The Models
var Message = mongoose.model("Message", MessageSchema);



//Export the model
module.exports = Message;