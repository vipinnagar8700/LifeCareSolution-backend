const express = require("express");
const app = express();
require("dotenv/config");
const admin = require('firebase-admin');
const cors = require("cors");
const userRoutes = require("../Routes/UserRouter");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dbConnect = require("../config/db");
const path = require('path');

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK only if it's not already initialized
  const serviceAccount = require("../config/lifecaresolution-984c5-firebase-adminsdk-20orx-a1a89421cf.json"); // Replace with the path to your service account key JSON file
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
dbConnect();
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

app.get("/", (req, res) => {
  res.json({
    "message": "Successfully Run!",
    "status": true
  });
});





app.use("/api", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mr Vipin Your Server is Running on port ${port}`);
});
