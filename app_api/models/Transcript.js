const mongoose = require("mongoose");

const TranscriptSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Transcript", TranscriptSchema);
