const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    // Common user fields
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    address: String,
    city: String,
    state: String,
    refreshToken: String,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["patient", "pharmacy", "doctor"],
      required: true,
    },
    image: {
      default: null,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resettoken;
};

const User = mongoose.model("User", userSchema);

const patientSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Patient-specific fields
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    address: String,
    city: String,
    state: String,
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    weight: {
      type: String,
      default: null,
    },
    height: {
      type: String,
      default: null,
    },
    age: {
      type: String,
      default: null,
    },
    blood_type: {
      type: String,
      default: null,
    },
    heart_rate: {
      type: String,
      default: null,
    },
    Blood_preasure: {
      type: String,
      default: null,
    },
    Glucose_Level: {
      type: String,
      default: null,
    },
    Allergies: {
      type: String,
      default: null,
    },
    pre_exisiting_conditions: {
      type: String,
      default: null,
    },
    medication: {
      type: String,
      default: null,
    },
    member: {
      type: String,
      default: null,
    },
    permission: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const pharmacySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Pharmacy-specific fields
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: String,
      default: null,
    },
    address: String,
    city: String,
    state: String,
    Website_Name: {
      type: String,
      default: null,
    },
    Website_Logo: {
      type: String,
      default: null,
    },
    Favicon: {
      type: String,
      default: null,
    },
    permission: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const doctorSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Pharmacy-specific fields
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: String,
      default: null,
    },
    address: String,
    city: String,
    state: String,
    Website_Name: {
      type: String,
      default: null,
    },
    Website_Logo: {
      type: String,
      default: null,
    },
    Favicon: {
      type: String,
      default: null,
    },
    permission: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const Patient = mongoose.model("Patient", patientSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = { User, Patient, Pharmacy,Doctor };
