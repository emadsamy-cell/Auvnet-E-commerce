// server config
const express = require("express");
const app = express();

// Environment variables
const dotenv = require("dotenv");
dotenv.config();

// cors options
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middlewares
const cors = require("cors");
const logger = require("morgan");
app.use(logger("dev"));
app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");
app.use(cookieParser()); 

// payload size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Database connection
const connectDB = require("./config/db.connection");
connectDB();

// Routes
const applicationRoutes = require("./routes/index.router");
applicationRoutes(app);

// Error handling middleware
const ErrorHandling = require("./middlewares/globalErrorHandling");
app.use(express.static("public"));
app.use(ErrorHandling.globalErrorHandling);
app.use(ErrorHandling.notFound);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
