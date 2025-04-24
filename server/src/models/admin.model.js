import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken:{
        type: String
      }

}, { timestamps: true })


// Password hash and compare logic as in Agent/Client
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10); // Hash the password before saving
    next();
  });
  
  // Instance method to check if the password is correct
  adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare given password with hashed password
  };
  

  adminSchema.methods.generateAccessToken =  function () {
    return jwt.sign(
      {
        _id: this._id,
        name: this.name, // fixed property name
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
    );
  };
  
  adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
  };
  


export const Admin =  mongoose.model("Admin", adminSchema)