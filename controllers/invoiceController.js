
require("dotenv/config");

const Invoice = require("../models/invoiceModel");
const Appointment = require("../models/appointmentModel");

const AllInvoices = async (req, res) => {
    const { id } = req.params;
  try {
    const InvoiceDetails = await Invoice.find().populate({
        path: 'appointment_id',
        populate: [
          { path: 'patient_id' },
          { path: 'doctor_id' },
          { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
        ],
      }).sort({ createdAt: -1 });

      // Exclude the 'PaymentDetails' field;
    const length = InvoiceDetails.length;
    res.status(200).json([
      {
        message: "All InvoiceDetails data retrieved successfully!",
        data: InvoiceDetails,
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


const AllDoctorInvoice = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
      // Find appointments with the specified doctor_id
      const appointments = await Appointment.find({ doctor_id: id });

      // Extract the appointment IDs
      const appointmentIds = appointments.map(appointment => appointment._id);

      // Find invoices related to the extracted appointment IDs
      const invoiceDetails = await Invoice.find({ appointment_id: { $in: appointmentIds } }).populate({
        path: 'appointment_id',
        populate: [
            { path: 'patient_id' },
            { path: 'doctor_id' },
            { path: 'videoSlot_id' },
            {path:'slot_id'}
        ]
    })
          .sort({ createdAt: -1 });

      console.log("Invoice Details:", invoiceDetails); 

      const length = invoiceDetails.length;
      const message = length > 0
          ? "All InvoiceDetails data retrieved successfully!"
          : "No InvoiceDetails data found for the specified doctor_id.";

      res.status(200).json([
          {
              message,
              data: invoiceDetails,
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



const AllPatientInvoice  =  async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
      // Find appointments with the specified doctor_id
      const appointments = await Appointment.find({ patient_id: id });

      // Extract the appointment IDs
      const appointmentIds = appointments.map(appointment => appointment._id);

      // Find invoices related to the extracted appointment IDs
      const invoiceDetails = await Invoice.find({ appointment_id: { $in: appointmentIds } }).populate({
        path: 'appointment_id',
        populate: [
            { path: 'patient_id' },
            { path: 'doctor_id' },
            { path: 'videoSlot_id' },
            {path:'slot_id'}
        ]
    })
          .sort({ createdAt: -1 });

      console.log("Invoice Details:", invoiceDetails); 

      const length = invoiceDetails.length;
      const message = length > 0
          ? "All InvoiceDetails data retrieved successfully!"
          : "No InvoiceDetails data found for the specified doctor_id.";

      res.status(200).json([
          {
              message,
              data: invoiceDetails,
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

}

const SingleInvoices = async (req, res) => {
  const { id } = req.params;
try {
  const InvoiceDetails = await Invoice.findById(id).populate({
      path: 'appointment_id',
      populate: [
        { path: 'patient_id' },
        { path: 'doctor_id' },
        { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
        { path: 'slot_id' },
      ],
    }).sort({ createdAt: -1 });

    // Exclude the 'PaymentDetails' field;
  const length = InvoiceDetails.length;
  res.status(200).json([
    {
      message: "All InvoiceDetails data retrieved successfully!",
      data: InvoiceDetails,
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

module.exports = {
    AllInvoices,AllDoctorInvoice,AllPatientInvoice,SingleInvoices
};
