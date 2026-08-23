const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const userModel = require("./middleware/authMiddleware");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes.js");
const watchListRoutes = require("./routes/watchListRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/watchlist", watchListRoutes);
app.use("/comments", commentRoutes);

app.listen(process.env.PORT, (error) => {
  console.log(`Server started at port ${process.env.PORT}`);
});

mongoose
  .connect(process.env.MOGO_URI)
  .then(() => {
    console.log("MonogDB connected successfully... ");
  })
  .catch((error) => {
    console.log("MongoDB connection failed :(", process.env.MOGO_URI, error);
  });
