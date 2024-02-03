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
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); 

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

app.use("/api", userRoutes);

const port = process.env.PORT || 3000; // Use 3000 as a fallback

app.listen(port, () => {
  console.log(`Mr Vipin Your Server is Running on port ${port}`);
});
