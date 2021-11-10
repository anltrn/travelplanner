const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { port } = require("./config");
const app = express();

const corsOptions = {
    origin: `http://localhost:${port}`,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes")(app);

module.exports = app
