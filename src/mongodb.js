const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;


db.user = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    budget: String
  })
);


async function connectToMongoDB(mongoConnectionUrl) {
  await db.mongoose.connect(mongoConnectionUrl);
  console.log("Connected to MongoDB.");
}

function disconnectFromMongoDB(mongoConnectionUrl) {
  db.mongoose.connection.close(mongoConnectionUrl);
  console.log("Disconnected from MongoDB.");
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  db,
};
