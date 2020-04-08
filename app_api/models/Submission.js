const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  _assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  directory: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
