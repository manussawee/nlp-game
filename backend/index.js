const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./src/config');
const router = require('./src/router');
const session = require('./src/session');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session.setup());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', false);
  next();
});
router(app);

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.port}!`),
);
