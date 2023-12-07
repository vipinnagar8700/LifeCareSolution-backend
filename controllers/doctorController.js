const { generateToken } = require('../config/JwtToken');
const { Doctor} = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')


const AllDoctors = async (req, res) => {
    try {
        const doctor = await Doctor.find().select('-password'); // Exclude the 'password' field;
        const length = doctor.length;
        res.status(200).json([{
            message: "All doctor data retrieved successfully!",
            data: doctor,
            status: true,
            length
        }]);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};

const editDoctor = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const doctor = await Doctor.findById(id).select('-password'); 
        console.log(doctor)// Exclude the 'password' field
        if (!doctor) {
            res.status(404).json({  // Correct the status code to 404 (Not Found)
                message: "Doctor was not found!",
                success: false,
            });
        } else {
            res.status(200).json({  // Correct the status code to 200 (OK)
                message: "Data successfully Retrieved!",
                success: true,
                data: doctor
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,  // Correct the key to 'success'
        });
    }
}

const [special, setSpecial] = useState("");
const handleSelection = (selected) => {
    setSelectedOption(selected);
    // Assuming 'name' is the property you want to display in the input field
    setSpecial(selected.map(option => option.name).join(", "));
  };
  
const UpdateDoctor = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body
    const file = req.file;
    console.log(file, "aa")
    if (file) {
        updateData.image = file.filename; // Add the filename to the updateData object
    }

    // Make sure to exclude the 'role' field from the updateData
    delete updateData.role;

    try {
        const editDoctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!editDoctor) {
            res.status(200).json({
                message: "Doctor was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editDoctor
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}
const UpdateDoctorSocail_Media = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Create an object with only the social media fields you want to update
    const socialMediaUpdates = {
        fb_Url: updateData.fb_Url || null,
        Twitter_Url: updateData.Twitter_Url || null,
        Instagram_Url: updateData.Instagram_Url || null,
        Pinterest_url: updateData.Pinterest_url || null,
        Linked_In_Url: updateData.Linked_In_Url || null,
        YouTube_Url: updateData.YouTube_Url || null,
    };

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editDoctor = await Doctor.findByIdAndUpdate(id, socialMediaUpdates, { new: true });

        if (!editDoctor) {
            res.status(200).json({
                message: "Doctor was not found!",
            });
        } else {
            res.status(201).json({
                message: "Social media data successfully updated!",
                success: true,
                data: editDoctor
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update social media data!",
            status: false
        });
    }
}
const UpdateDoctorBankDetails = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Create an object with only the social media fields you want to update
    const socialMediaUpdates = {
        BankName: updateData.BankName || null,
        BranchName: updateData.BranchName || null,
        Account_Number: updateData.Account_Number || null,
        AccountName: updateData.AccountName || null,
      
    };

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editDoctor = await Doctor.findByIdAndUpdate(id, socialMediaUpdates, { new: true });

        if (!editDoctor) {
            res.status(200).json({
                message: "Doctor was not found!",
            });
        } else {
            res.status(201).json({
                message: "Bank Account  data successfully updated!",
                success: true,
                data: editDoctor
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update Bank Account  data !",
            status: false
        });
    }
}

const deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the Doctor by ID
        const Doctor = await Doctor.findById(id);

        if (!Doctor) {
            return res.status(200).json({
                message: "Doctor was not found!",
            });
        }

        if (Doctor.role === "admin") {
            return res.status(403).json({
                message: "Admin Doctor cannot be deleted.",
                status: false,
            });
        }

        // If the Doctor is not an admin, proceed with the deletion
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(200).json({
                message: "Doctor was not found!",
            });
        } else {
            return res.status(201).json({
                message: "Data successfully deleted!",
                success: true,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete data!",
            status: false,
        });
    }
}

module.exports = {
     AllDoctors, editDoctor, UpdateDoctor, deleteDoctor,UpdateDoctorSocail_Media,UpdateDoctorBankDetails
}