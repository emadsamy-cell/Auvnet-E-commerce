const mongoose = require("mongoose");
// const dev = require('../dev/user/user.dev');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected successfully....");
  // await dev.active();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
  // console.log("Database connection closed.");
});
