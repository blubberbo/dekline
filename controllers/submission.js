// Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const submission = require('../models/submission');

// POST HTTP method to /submission
router.post('/', (req, res, next) => {
  submission.create({ deklineUserID: req.body.deklineUserID, sentence: req.body.sentence }, (err, submission) => {
    if (err) {
      res.json({success: false, message: `Failed to log the submission. Error: ${err}`});
    }
    else {
      res.json({success: true, message: 'Submission logged successfully!'});
    }
    res.end();
  });
});

module.exports = router;
