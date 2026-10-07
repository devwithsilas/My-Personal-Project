const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
  
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      // min: 0,
      // max: 120,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum:["active", "pending", "closed"],
      default: "pending",
    },

    role: {
      type: String,
      enum: ["customer", "agent", "admin"],
      default: "customer",
    },

  },

  {
    timestamps: true,
  }

);

module.exports = mongoose.model("User", userSchema);