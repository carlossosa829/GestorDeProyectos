if (process.env.NODE_ENV !== "production")
  require("dotenv").config({ path: ".env" });

const express = require("express");
const app = express();
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const { API_PORT, API_VERSION, API_URL, ENV } = require("./config/config");

//CONFIG
app.set("port", API_PORT);

//MIDDLEWARES

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload());

//ROUTES
app.use(`${API_VERSION}`, require("./routes/index"));

//LOADING MODELS
require("./models/index");

//SERVER
app.listen(app.get("port"), (req, res) => {
  console.log(`${ENV.toUpperCase()} - API WORKING ON ${API_URL}`);
});
