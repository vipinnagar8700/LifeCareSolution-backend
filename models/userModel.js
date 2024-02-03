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
  //   // status: {
  //   // type: String,
  //   // enum: ['pending', 'approved', 'blocked'],
  //   // default: 'pending',
  // },
    address: String,
    city: String,
    state: String,
    refreshToken: String,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["patient", "pharmacy", "doctor","admin","lab","subadmin"],
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
  const resetToken = crypto.randomBytes(32).toString("hex"); // Corrected variable name
  console.log("Generated Reset Token:", resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
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
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
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
    dob: {
      type: String,
      default: null,
    },
    pincode: {
      type: String,
      default: null,
    },
    country: {
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
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
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
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
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
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    Registered_Clinic_address: {
      type: String,
      default: null,
    },
    Registered_Clinic_city: {
      type: String,
      default: null,
    },
    Registered_Clinic_state: {
      type: String,
      default: null,
    },
    Pincode: {
      type: String,
      default: null,
    },
    Certification: {
      type: String,
      default: null,
    },
    Aadhar_id: {
      type: String,
      default: null,
    },
    clinic_employment: {
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
    fb_Url: {
      type: String,
      default: null,
    },
    Twitter_Url: {
      type: String,
      default: null,
    },
    Instagram_Url: {
      type: String,
      default: null,
    },
    Pinterest_url: {
      type: String,
      default: null,
    },
    Linked_In_Url: {
      type: String,
      default: null,
    },
    YouTube_Url: {
      type: String,
      default: null,
    },
    UserName: {
      type: String,
      default: null,
    },
    About: {
      type: String,
      default: null,
    },
    ClinicName: {
      type: String,
      default: null,
    },
    ClinicImage: {
      type: [
        {
          image: {
            type: String,
            default: null,
          },
          
        },
      ]
    },
    fees: {
      type: String,
      default: null,
    },
    CoustomPrice_perHour: {
      type: String,
      default: null,
    },
    Services: {
      type: [String],
      default: [],
    },
    Specailization:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Specialities" }],
    Education: {
      type: [
        {
          degree: {
            type: String,
            default: null,
          },
          college: {
            type: String,
            default: null,
          },
          year: {
            type: String, // You might want to use a different type if the year is a number
            default: null,
          },
        },
      ],
      default: [],
    },
    
    memberShips: {
      type: String,
      default: null,
    },
    Registrations: {
      type: String,
      default: null,
    },
    BankName: {
      type: String,
      default: null,
    },
    BranchName: {
      type: String,
      default: null,
    },
    Account_Number: {
      type: String,
      default: null,
    },
    AccountName: {
      type: String,
      default: null,
    },
    country: {
      type: String, 
      default: null,
    },
    Experience: {
      type: [
        {
          hospital_name: {
            type: String,
            default: null,
          },
          from: {
            type: String,
            default: null,
          },
          to: {
            type: String, // You might want to use a different type if the year is a number
            default: null,
          },
          Designation: {
            type: String, // You might want to use a different type if the year is a number
            default: null,
          },
        },
      ],
      default: [],
    },
    Total_Exp:{
type:String,
default:null
    },
    Awards: {
      type: [
        {
          Awards: {
            type: String,
            default: null,
          },
          Year: {
            type: String,
            default: null,
          },
          
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = { User, Patient, Pharmacy, Doctor };
