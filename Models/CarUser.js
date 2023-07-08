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
  roles: {
    type: Array,
    default: ["driver"],
  },
});

const CarUser = mongoose.model("carUser", caruserSchema);

module.exports = CarUser;
