const app = require("./app")
const { connectToMongoDB } = require("./mongodb");
const { port, mongoConnectionUrl } = require("./config");

(async function main() {
  await connectToMongoDB(mongoConnectionUrl);
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}.`);
  });
})();
