const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userModel = require('./middleware/authMiddleware');
const mongoose = require('mongoose');


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.listen(process.env.PORT, (error) => {
    console.log(`Sever started at port ${process.env.PORT}`);
});

mongoose.connect(process.env.MOGO_URI)
    .then(
        () => {
            console.log("MonogDB connected successfully... ");
        }
    )
    .catch(
        (error) => {
            console.log("MongoDB connection failed :(", process.env.MOGO_URI, error);
        }
    );