// config env variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { isLocalhost, dbName } = require("./config");
const { seedDB } = require("./seeder");

// initializations
const PORT = 4000;
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/", require("./routes"));

// starting the server
app.listen(process.env.PORT || PORT, () => {
  console.log("Server on port: " + (process.env.PORT || PORT));

  //connect to db
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_ATLAS_URI, {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("--> Atlas DB Connected ✅.");

      // seed db
      if (isLocalhost && process.env.SEED_DB === "true") seedDB();
    })
    .catch((err) => console.log(err));
});
