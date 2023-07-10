const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  userId: {
    type: String,
  },
  gender: {
    type: String,
  },
  carName: {
    type: String,
    // required: true,
  },
  carNo: {
    type: String,
    // required: true,
  },

  startPoint: {
    type: String,
    // required: true,
  },
  lastPoint: {
    type: String,
    // required: true,
  },

  date: {
    type: String,
    // required: true,
  },
  phoneNO: {
    type: Number,
  },
  seats: {
    type: Number,
  },

  booking: {
    type: Array,
  },
});

const car = mongoose.model("car", carSchema);

module.exports = car;
