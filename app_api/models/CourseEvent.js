const mongoose = require("mongoose");

const courseEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  color: {
    primary: {
      type: String,
    },
    seconday: {
      type: String,
    },
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  resizable: {
    beforeStart: {
      type: Boolean,
      default: true,
    },
    afterEnd: {
      type: Boolean,
      default: true,
    },
  },
  allDay: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("CourseEvent", courseEventSchema);
