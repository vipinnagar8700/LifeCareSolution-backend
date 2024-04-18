const Availability = require("../models/availabilityModel");
const { Doctor } = require("../models/userModel");


const AddAvailibility = async (req, res) => {
  try {
    // Extract availability data from request body
    const { availability,doctor_id } = req.body;
console.log(availability,doctor_id,"availability")
    // Validate if availability data is provided
    if (!availability || !Array.isArray(availability) || availability.length !== 7) {
      return res.status(400).json({ message: 'Availability data is required for all 7 days.', success: false });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctor_id);

    // Check if doctor exists
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.', success: false });
    }

    // Update doctor's availability
    doctor.availability = availability;

    // Save the updated doctor data
    await doctor.save();

    return res.status(200).json({ message: 'Doctor availability updated successfully.', success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update doctor availability.', success: false, error: error.message });
  }
};


module.exports = {
    AddAvailibility,
};
