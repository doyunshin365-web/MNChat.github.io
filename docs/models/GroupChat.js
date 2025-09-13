const mongoose = require("mongoose");

const chattingSchema = new mongoose.Schema({
    title : {type: String, required: true},
    partners: { type: Array, required: true },
    chattings: { type: Array, required: true }
});

module.exports = mongoose.model("GroupChatting", chattingSchema);
