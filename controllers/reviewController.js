const asyncHandler = require("express-async-handler");
const Review = require('../models/reviewsModel')
require("dotenv/config");

const Reviews =  async (req, res) => {
    const { patient_id, doctor_id, comment } = req.body;
  
    try {
      const newReview = new Review({ patient_id, doctor_id, comment });
      await newReview.save();
      res.status(201).json([{
        message:"Review Successfully Posted!",status:true
      }]);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' ,status:false});
    }
  };
  
  // Route to get all reviews
 const AllReviews = async (req, res) => {
    try {
      const reviews = await Review.find().populate('patient_id').populate('doctor_id');
      const length = reviews.length;
      res.status(200).json([{
        message :"all Reviews",status:true,data:reviews,
        length
      }]);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
// Route to get all reviews
const DoctorReview = async (req, res) => {
    const doctor_id = req.params.doctor_id; // Assuming doctor_id is in the request parameters
  
    try {
      const reviews = await Review.find({ doctor_id }).populate('patient_id').populate('doctor_id');
      const length = reviews.length;
      res.status(200).json([{
        message:"All Doctor Reviews",status:true,
        data:reviews,
        length
      }]);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' ,status:false,});
    }
  };

  
  const PatientReview = async (req, res) => {
    const patient_id = req.params.patient_id; // Assuming doctor_id is in the request parameters
  
    try {
      const reviews = await Review.find({ patient_id }).populate('patient_id').populate('doctor_id');
      const length = reviews.length;
      res.status(200).json([{
        message:"All Patient Reviews",status:true,
        data:reviews,
        length
      }]);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' ,status:false});
    }
  };

  // Route to like a review
 const LikeReview = async (req, res) => {
    const id = req.params.id;
  
    try {
      const review = await Review.findById(id).populate('patient_id').populate('doctor_id');;
      if (!review) {
        res.status(404).json({ error: 'Review not found' });
      } else {
        review.likes += 1;
        await review.save();
        res.status(200).json([{
            messsage:"Like Successfully!",
            status:true
        }]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error',status:false});
    }
  };
  
  // Route to dislike a review
 const DislikeReview =  async (req, res) => {
    const id = req.params.id;
  
    try {
      const review = await Review.findById(id).populate('patient_id').populate('doctor_id');;
      if (!review) {
        res.status(404).json({ error: 'Review not found' });
      } else {
        review.dislikes += 1;
        await review.save();
        res.status(200).json(review);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



module.exports = {
    Reviews,DislikeReview,LikeReview,DoctorReview,PatientReview,AllReviews
};
