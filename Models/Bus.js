const mongoose = require("mongoose");

const busSchema = mongoose.Schema({
  operatorId: {
    type: String,
    // required: true,
  },
  busName: {
    type: String,
    // required: true,
  },
  busRno: {
    type: String,
    // required: true,
  },
  route: {
    type: String,
  },
  startPoint: {
    type: String,
    // required: true,
  },
  lastPoint: {
    type: String,
    // required: true,
  },

  status: {
    type: String,
    // required: true,
  },
  long: {
    type: String,
  },
  lant: {
    type: String,
  },
  path: [
    {
      longitude: Number,
      latitude: Number,
    },
  ],
  // stop1: {
  //   type: String,
  //   // required: true,
  // },
  // stop2: {
  //   type: String,
  //   // required: true,
  // },
  // stop3: {
  //   type: String,
  //   // required: true,
  // },
  // stop4: {
  //   type: String,
  //   // required: true,
  // },
  // stop5: {
  //   type: String,
  //   // required: true,
  // },
  // stop6: {
  //   type: String,
  //   // required: true,
  // },
  // stop1time: {
  //   type: String,
  //   //  required: false,
  // },
  // stop2time: {
  //   type: String,
  //   // required: true,
  // },
  // stop3time: {
  //   type: String,
  //   //  required: true,
  // },
  // stop4time: {
  //   type: String,
  //   //  required: true,
  // },
  // stop5time: {
  //   type: String,
  //   //  required: true,
  // },
  // stop6time: {
  //   type: String,
  //   //  required: true,
  // },
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
