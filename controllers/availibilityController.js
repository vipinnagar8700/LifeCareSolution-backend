const Availability = require("../models/availabilityModel");


const AddAvailibility = async (req, res) => {
  try {
    const { doctor_id, day, from, to } = req.body;
    
    // Check if there are already 7 availability records for the doctor
    const doctorAvailabilityCount = await Availability.countDocuments({ doctor_id });
    if (doctorAvailabilityCount >= 7) {
      return res.status(400).json({
        message: "Cannot add more than 7 availability records for a doctor.",
        success: false,
      });
    }

    // Check if availability record already exists for the doctor on the same day
    const existingAvailability = await Availability.findOne({ doctor_id, day });

    if (existingAvailability) {
      return res.status(400).json({
        message: "Availability record already exists for the same day.",
        success: false,
      });
    } else {
      // Create a new availability record
      await Availability.create({
        doctor_id,
        day,
        from,
        to
      });

      return res.status(201).json({
        message: "Availability Successfully Booked!",
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to book Availability.",
      success: false,
      error: error.message,
    });
  }
};


const AllAvailabilitys = async (req, res) => {
  try {
    const AvailabilityA = await Availability.find()
      .populate("doctor_id")
  .sort({ createdAt: -1 }); // Exclude the 'password' field;
    const length = AvailabilityA.length;
    res.status(200).json([
      {
        message: "All Availability data retrieved successfully!",
        data: AvailabilityA,
        status: true,
        length,
      },
    ]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const editAvailability = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const AvailabilityA = await Availability.findById(id)
      .populate("doctor_id")
    console.log(AvailabilityA); // Exclude the 'password' field
    if (!Availability) {
      res.status(404).json({
        // Correct the status code to 404 (Not Found)
        message: "Availability was not found!",
        success: false,
      });
    } else {
      res.status(200).json({
        // Correct the status code to 200 (OK)
        message: "Data successfully Retrieved!",
        success: true,
        data: AvailabilityA,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve Data!",
      success: false, // Correct the key to 'success'
    });
  }
};

const UpdateAvailability = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body

  // Make sure to exclude the 'role' field from the updateData

  try {
    const editAvailability = await Availability.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!editAvailability) {
      res.status(200).json({
        message: "Availability was not found!",
      });
    } else {
      res.status(201).json({
        message: "Data successfully updated!",
        success: true,
        data: editAvailability,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update data!",
      status: false,
    });
  }
};

const deleteAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the Availability by ID
    const AvailabilityA = await Availability.findById(id);

    if (!AvailabilityA) {
      return res.status(200).json({
        message: "Availability was not found!",
      });
    }

    // If the Availability is not an admin, proceed with the deletion
    const deletedAvailability = await Availability.findByIdAndDelete(id).sort({ createdAt: -1 });

    if (!deletedAvailability) {
      return res.status(200).json({
        message: "Availability was not found!",
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
};

const doctor_Availabilitys = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve Availabilitys for the given doctor
    const Availabilitys = await Availability.find({ doctor_id: id , status: 'active'})
      .populate("doctor_id")
      .sort({ createdAt: -1 }) // Sort by date in descending order
      .exec();

    const length = Availabilitys.length;

    // Check if Availabilitys exist
    if (!Availabilitys || Availabilitys.length === 0) {
      return res.status(404).json({
        message: "No Availabilitys found for the doctor!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Availabilitys by doctor retrieved successfully!",
      data: Availabilitys,
      length,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve data!",
      success: false,
    });
  }
};

const UpdateAvailabilityStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedAvailability = await Availability.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
  
      if (!updatedAvailability) {
        return res.status(404).json({
          message: "Availability was not found!",
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "Availability status updated successfully",
          success: true,
          data: updatedAvailability,
        });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
  
      return res.status(500).json({
        message: "Failed to update Availability status!",
        success: false,
        error: error.message, // Provide the error message in the response
      });
    }
  };
  

module.exports = {
    AddAvailibility,
  editAvailability,
  UpdateAvailability,
  deleteAvailability,AllAvailabilitys,
  doctor_Availabilitys,
  UpdateAvailabilityStatus,
  
};
