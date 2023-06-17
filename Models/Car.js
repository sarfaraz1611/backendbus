const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  carName: {
    type: String,
    // required: true,
  },
  carNo: {
    type: String,
    // required: true,
  },
  // route: {
  //   type: String,
  //   // required: true,
  // },
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
});

const car = mongoose.model("car", carSchema);

module.exports = car;
