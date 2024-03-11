const express = require("express");
const app = express();
require("dotenv/config");
var cors = require("cors");
const Razorpay = require('razorpay');
// MiddleWares Library
// Middleware to parse JSON in request bodies
const cookieParser = require("cookie-parser");
app.use(cors());
const userRoutes = require("../Routes/UserRouter");
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const dbConnect = require("../config/db");
const userModel = require("../models/userModel");
dbConnect();
// Serve static files from the 'public' directory
app.use(express.static("public"));
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); 

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: 'rzp_test_CoJCpfnbEcmmJT',
  key_secret: 'aF2IAYUOsQD2dBjV19uzuiSC',
});

const corsOptions = {
  origin: "*",
};



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});


const path = require('path');
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('Views', path.join(__dirname, 'Views'));


app.get("/", (req, res) => {
  res.json({
    "message":"Successfully Run!",
    "status":true
  });
});

// Route to initiate UPI payment
// Route to initiate UPI payment
app.post('/initiate-upi-payment', async (req, res) => {
  try {
    const options = {
      amount: 10000, // Amount in paise (100 paise = 1 rupee)
      currency: 'INR',
      receipt: 'order_rcptid_11',
      payment_capture: 1, // Auto-capture payments
      notes: {
        merchant_name: 'Your Merchant Name',
        customer_name: 'Vipin Nagar',
        contact: '+918700504218',
        email: 'vipinnagar8700@gmail.com',
      },
      method: 'upi',
    };

    const response = await razorpay.orders.create(options);

    // Construct the payment URL
    const paymentUrl = `https://api.razorpay.com/v1/upi/${response.id}`;

    // Return the payment URL to the client
    res.json({ paymentUrl });
  } catch (error) {
    console.error('Error initiating UPI payment:', error);
    res.status(500).json({ error: 'An error occurred while initiating payment' });
  }
});


// Route to handle Razorpay webhook events (optional)
app.post('/razorpay-webhook', (req, res) => {
  // Handle Razorpay webhook events here
  console.log('Razorpay webhook event received:', req.body);
  res.status(200).send('Webhook received successfully');
});

app.use("/api", userRoutes);

const port = process.env.PORT || 3000; // Use 3000 as a fallback

app.listen(port, () => {
  console.log(`Mr Vipin Your Server is Running on port ${port}`);
});
