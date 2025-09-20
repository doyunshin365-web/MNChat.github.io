const mongoose = require("mongoose");

const chattingSchema = new mongoose.Schema({
    title : {type: String, required: true},
    content: { type: String, required: true },
    date: {type: Date, required: true},
    important: {type: Boolean, required: true}
      
});

module.exports = mongoose.model("DevelopVoice", chattingSchema);
