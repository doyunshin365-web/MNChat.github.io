const mongoose = require("mongoose");

const chattingSchema = new mongoose.Schema({
    user : {type: String, required: true},
    content: { type: String, required: true },
    email: { type: String, required: true },
    date: {type: Date, required: true}
      
});

module.exports = mongoose.model("Contact", chattingSchema);
