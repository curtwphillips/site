const fs = require('fs');
const https = require('https');
const path = require('path');

const envFiles = {
  production: '.env.production',
  development: '.env.development',
  local: '.env.local',
};

console.log('Starting env:', process.env.NODE_ENV);
const envFile = envFiles[process.env.NODE_ENV] || '.env.production';

require('dotenv').config({ path: path.join(__dirname, `../${envFile}`) });

const mongo = require('./mongo');
const { seedDb } = require('./scripts/seedDb');

const { app } = require('./app');

console.log('env port :', process.env.API_PORT);

if (!process.env.API_PORT) {
  throw new Error('missing env port');
}

// function clearConsole() {
//   process.stdout.write('\u001b[3J\u001b[1J');
//   console.clear();
// }

// clearConsole();

(async () => {
  try {
    if (!process.env.MONGO_OFF) {
      await mongo.connect(process.env.MONGO_URI);
      await seedDb();
    }

    app.listen(process.env.API_PORT, () => {
      console.log('HTTP  Server port:', process.env.API_PORT);
    });

    https
      .createServer(
        {
          key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem'), 'utf8'),
          cert: fs.readFileSync(
            path.join(__dirname, '../ssl/cert.pem'),
            'utf8'
          ),
        },
        app
      )
      .listen(process.env.API_PORT_HTTPS, () => {
        console.log('HTTPS Server port:', process.env.API_PORT_HTTPS);
      });
  } catch (err) {
    console.log(err);
    process.exit();
  }
})();
