const mongoose = require("mongoose");

const busSchema = mongoose.Schema({
  operatorId: {
    type: String,
    required: true,
  },
  busName: {
    type: String,
    required: true,
  },
  busRno: {
    type: String,
    required: true,
  },
  route: {
    type: String,
  },
  startPoint: {
    type: String,
    required: true,
  },
  lastPoint: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  stop1: {
    type: String, required: true,
      },
   stop2: {
    type: String,
   required: true,
  },
    stop3: {
    type: String,
 required: true,
  },
     stop4: {
    type: String,
   required: true,
  },
      stop5: {
    type: String,
 required: true,
  },
  stop6: {
          type: String,
 required: true,
  },
    stop1time: {
    type: Date,
     required: true,
  },
   stop2time: {
    type: Date,
    required: true,
  },
    stop3time: {
    type: Date,
 required: true,
  },
     stop4time: {
    type: Date,
 required: true,
  },
      stop5time: {
    type: Date,
 required: true,
  },
       stop6time: {
    type: Date,
 required: true,
  },
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
