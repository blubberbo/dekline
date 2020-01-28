// We’ll declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const customError = require('./models/error');

// Importing the config
const config = require('./config/config.json');
// Importing the dekline controller
const dekline = require('./controllers/dekline');
// Importing the dictionary controller
const dictionary = require('./controllers/dictionary');
// Importing the scrape controller
const scrape = require('./controllers/scrape');
// Importing the error controller
const error = require('./controllers/error');
// Importing the submission controller
const submission = require('./controllers/submission');

// Connect mongoose to our database (depending on the offlineDevelopmentMode flag)
if (config.offlineDevelopmentMode) {
  mongoose.connect(config.databaseOffline, { autoIndex: false });
}
else {
  mongoose.connect(config.database, { autoIndex: false });
}

// Initialize our app variable
const app = express();
// Declaring Port
const port = 3000;

// Middleware for CORS
app.use(cors());

// Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//   // res.status(404).render('404_error_template', {title: 'Sorry, page not found'});
//   res.status(404).write('this was a 404');
// });

/* express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'dist')));
// app.use(express.static(path.join(__dirname, 'img')));

app.use('/img', express.static(path.join(__dirname, '/img')));
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

// Routing all HTTP requests to /api/dictionary to dictionary api controller
app.use('/api/dictionary', dictionary);

// Routing all HTTP requests to /api/error to error api controller
app.use('/api/error', error);

// Routing all HTTP requests to /api/scrape to scrape api controller
app.use('/api/scrape', scrape);

// Routing all HTTP requests to /api/submission to submission api controller
app.use('/api/submission', submission);

// Routing all HTTP requests to /api to dekline api controller
app.use('/api', dekline);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Handle Errors - Keep this as a last route
app.use(function (err, req, res, next) {
  customError.logError(err);
  res.status(500);
  res.send({status: 500, message: 'Internal Error Occurred'});
});

// // Handle 404 - Keep this as a last route - this should never be gotten to because the Angular App should catch all routing
// app.use(function (req, res, next) {
//   res.status(404);
//   res.send('404: Your Destination Does Not Exist on the Server');
// });

// Listen to port 3000
app.listen(process.env.PORT || port, () => {
  console.log(`Starting the server at port ${port}`);
});
