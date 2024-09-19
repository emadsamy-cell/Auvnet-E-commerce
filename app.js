const cors = require("cors");
const logger = require("morgan");
const express = require("express");
const indexRouter = require("./routes/index.router");
const connectDB = require("./config/db.connection");
const { globalErrorHandling } = require("./middlewares/globalErrorHandling");

const app = express();

// Connect to MongoDB
// connectDB();

// Setup middlewares
app.use(
  cors({
    origin: process.env.frontendBaseURL,
    credentials: true,
  })
);
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));

// Middleware to log requests
app.use(logger("dev"));

// Routes
app.use("/api", indexRouter);

//Invalid routing
app.use((req, res, next) => {
  next(Error("404 Page not found In-valid Routing or method", { cause: 404 }));
});

// Error handling middleware
app.use(globalErrorHandling);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
