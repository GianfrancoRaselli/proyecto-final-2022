const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

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
  mongoose
    .connect(process.env.MONGO_ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("--> Atlas DB Connected ✅.");
    })
    .catch((err) => console.log(err));
});
