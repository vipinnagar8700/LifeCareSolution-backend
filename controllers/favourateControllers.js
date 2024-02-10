const Favourate = require('../models/favouritesModel');
const asyncHandler = require('express-async-handler');

const AddFavourates = asyncHandler(async (req, res) => {
    try {
        const { patient_id, doctor_id } = req.body;

        // Check if the doctor is already in the favourites
        const existingFavourate = await Favourate.findOne({
            patient_id,
            doctors: doctor_id,
        });

        if (existingFavourate) {
            // If the doctor is already in the favourites, remove them
            const updatedFavourate = await Favourate.findOneAndUpdate(
                { patient_id },
                { $pull: { doctors: doctor_id } },
                { new: true }
            );

            res.status(200).json({
                message: "Doctor removed from favourites list!",
                success: true,
                data: updatedFavourate
            });
        } else {
            // If the doctor is not in the favourites, add them
            const newFavourate = await Favourate.findOneAndUpdate(
                { patient_id },
                { $addToSet: { doctors: doctor_id } },
                { new: true, upsert: true }
            );

            res.status(201).json({
                message: "Doctor successfully added to the favourites list!",
                success: true,
                data: newFavourate
            });
        }
    } catch (error) {
        console.error('Error:', error);

        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
});





const AllFavourates = async (req, res) => {
    const { id } = req.params;
    try {
        const favourateses = await Favourate.find({ patient_id: id }).populate('doctors')
            .populate({
                path: 'doctors',
                populate: {
                    path: 'Specailization', // Populate the Specialization field within each doctor object
                    select: '-_id -__v' // Exclude unnecessary fields
                }
            })
            .sort({ createdAt: -1 });
            let totalDoctors = 0;
            favourateses.forEach(favourate => {
                totalDoctors += favourate.doctors.length;
            });
    

        res.status(200).json({
            message: "All Doctor Favourates data retrieved successfully!",
            data: favourateses,
            status: true,
            length:totalDoctors 
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};




const deleteFavourate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const favourate = await Favourate.findByIdAndDelete(id);

        if (!favourate) {
            res.status(200).json({
                message: "Favourate was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Deleted!",
                success: true,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Deleted Data!",
            status: false
        });
    }
});

module.exports = {
    AddFavourates,
    deleteFavourate,AllFavourates
};
