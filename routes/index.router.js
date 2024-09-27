const path = require("path");
const v1IndexRouter = require("./versionOne/v1.index.router")

module.exports = (app) => {

  app.get("/", (req, res) => {
    if (process.env.MODE === "DEV") {
      return res.status(200).json({
        version: "1.0.0",
        status: "OK",
        message: "Server is up",
      });
    } else {
      return res.sendFile(
        path.join(__dirname, "..", "public", "notFound.html")
      );
    }
  });
  
  app.use('/v1', v1IndexRouter)
};
