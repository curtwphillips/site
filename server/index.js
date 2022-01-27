const path = require("path");
const mongo = require("./mongo");

const { app } = require("./app");
const { seedDb } = require("./scripts/seedDb");

const envPath = process.env.NODE_ENV === "development" ? "../.env.development" : "../.env.production";
require("dotenv").config({ path: path.join(__dirname, envPath) });

function clearConsole () {
  process.stdout.write("\u001b[3J\u001b[1J");
  console.clear();
};
clearConsole();

(async () => {
  await mongo.connect(process.env.MONGO_URI);
  await seedDb();

  app.listen(process.env.API_PORT, () => {
    console.log('Server port:', process.env.API_PORT);
  });
})();