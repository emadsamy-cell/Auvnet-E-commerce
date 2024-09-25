const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected successfully....");
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("Database connection closed.");
});