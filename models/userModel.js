const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unseenNotifications: {
      type: Array,
      default: [],
    },
    state:{
        type:String,
        required:[true,'City is required']
    },
    DOB:{
        type:String
    },
    gender:{
        type:String,
        required:[true,'Gender is required']
    },
    height:{
        type:String,
        required:[true,'Height is required']
    },
    weight:{
        type:String,
        required:[true,'Weight is required']
    },
    blood:{
        type:String,
        required:[true,'Blood Group is required']
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
