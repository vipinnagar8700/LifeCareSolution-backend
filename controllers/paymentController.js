const axios = require('axios');
require("dotenv/config");
const crypto = require('crypto');

const Payment = require("../models/paymentModel");

const AllPayments = async (req, res) => {
  try {
    const PaymentDetails = await Payment.find().populate({
        path: 'appointment_id',
        populate: [
          { path: 'patient_id' },
          { path: 'doctor_id' },
          { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
        ],
      }).sort({ createdAt: -1 });

      // Exclude the 'PaymentDetails' field;
    const length = Appointment.length;
    res.status(200).json([
      {
        message: "All PaymentDetails data retrieved successfully!",
        data: PaymentDetails,
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

const AllDoctorPayment = async (req, res) => {
    const {id} = req.params;
    try {
      const PaymentDetails = await Payment.find({ 'appointment_id.doctor_id': id,}).populate({
          path: 'appointment_id',
          populate: [
            { path: 'patient_id' },
            { path: 'doctor_id' },
            { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
          ],
        });
  
        // Exclude the 'PaymentDetails' field;
      const length = Appointment.length;
      res.status(200).json([
        {
          message: "All PaymentDetails data retrieved successfully!",
          data: PaymentDetails,
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

 
const newPayment = async (req, res) => {
  try {
      const merchantTransactionId = 'M' + Date.now();
      const { user_id, price, phone, name } = req.body;
      
      const data = {
          merchantId: "PGTESTPAYUAT",
          merchantTransactionId: merchantTransactionId, // Use generated transaction ID
          merchantUserId: 'MUID' + user_id,
          name: name,
          amount: price * 100,
          redirectUrl: `http://localhost:3000/api/v1/status/${merchantTransactionId}`,
          redirectMode: 'POST',
          mobileNumber: phone,
          paymentInstrument: {
              type: 'PAY_PAGE'
          }
      };

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + 'a591cb50-dee6-4400-9ea3-ecbf55a76407'
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;

      const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
      
      const options = {
          method: 'POST',
          url: prod_URL,
          headers: {
              'Content-Type': 'application/json',
              'X-VERIFY': checksum
          },
          data: {
              request: payloadMain
          }
      };
      
      const response = await axios(options);
      return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: error.message,
          success: false
      });
  }
};
   const checkStatus = async(req, res) => {
    const merchantTransactionId = req.params['txnId']
    const merchantId = process.env.MERCHANT_ID
    const keyIndex = 2;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;
   const options = {
    method: 'GET',
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'X-VERIFY': checksum,
    'X-MERCHANT-ID': `${merchantId}`
    }
    };
   // CHECK PAYMENT STATUS
    axios.request(options).then(async(response) => {
    if (response.data.success === true) {
    console.log(response.data)
    return res.status(200).send({success: true, message:"Payment Success"});
    } else {
    return res.status(400).send({success: false, message:"Payment Failure"});
    }
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send({msg: err.message});
    });
   };



module.exports = {
    AllPayments,AllDoctorPayment,newPayment,checkStatus
};
