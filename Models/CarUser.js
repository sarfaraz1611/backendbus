const mongoose = require("mongoose");

const caruserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  adds: {
    type: Array,
  },
});

const CarUser = mongoose.model("carUser", caruserSchema);

module.exports = CarUser;
