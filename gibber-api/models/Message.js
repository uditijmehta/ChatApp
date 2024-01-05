const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: mongoose.Types.ObjectId,
  user: {type: mongoose.Types.ObjectId, ref: 'User'},
  text: [{language: String, text: String}],
  originalLang: String,
  originalText: String,
  image: String,
  video: String,
  audio: String,
  location: {latitude: Number, longitude: Number},
  seenBy: [{type: mongoose.Types.ObjectId}],
  createdAt: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Message', MessageSchema);
