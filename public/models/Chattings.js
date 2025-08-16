const mongoose = require('mongoose');

const chattingSchema = new mongoose.Schema({
    partner1: { type: String, required: true },
    partner2: { type: String, required: true },
    chattings: { type: Array, required: true }
});

module.exports = mongoose.model('Chatting', chattingSchema);