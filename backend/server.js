// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const todoRoute = require("./routes/todo.route");
const authRoute = require("./routes/auth.router");
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
// routes
app.use("/api", todoRoute);
app.use("/api", authRoute);

// server start
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
