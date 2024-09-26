const mongoose = require("mongoose");
const { createResponse } = require("../utils/createResponse");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // initiateSuperAdminAccount
    // const createSuperAdmin  = require("../utils/createSuperAdmin");
    // createSuperAdmin();

    console.log("Database connected successfully....");
  } catch (err) {
    console.error(createResponse(false, "Failed to connect to database !!!!", 500, err));
    process.exit(1); // Exit process with failure
  }
};
module.exports = connect;
