const express = require('express')
const app = express();
require('dotenv/config')
var cors = require('cors')
// MiddleWares Library
// Middleware to parse JSON in request bodies
const cookieParser = require('cookie-parser')
app.use(cors())
const userRoutes = require('../Routes/UserRouter')
const morgan = require('morgan')
app.use(morgan('dev'))
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const dbConnect = require('../config/db');
const userModel = require('../models/userModel');
dbConnect();
// Serve static files from the 'public' directory
app.use(express.static('public'));


app.use(cors({
    origin: 'https://life-care-solutionq.vercel.app/',
    credentials: true,
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.get('/', (req, res) => {
    res.status(200).json([{ message: 'Hello Mr vipin Nagar', status: true }])

})
app.use('/api', userRoutes)



const port = process.env.PORT || 8000;

const host = '0.0.0.0'; // Listen on all available network interfaces
app.listen(port, host, () => {
    console.log(`Mr Vipin Your Serveer is Running on server ${port}`)
})