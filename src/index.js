const express = require("express");
const app = express();
require("dotenv/config");
var cors = require("cors");
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

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

//
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json([{ message: "Hello Mr vipin Nagar", status: true }]);
});
app.use("/api", userRoutes);

const port = process.env.PORT || 3000; // Use 3000 as a fallback

app.listen(port, () => {
  console.log(`Mr Vipin Your Server is Running on port ${port}`);
});
