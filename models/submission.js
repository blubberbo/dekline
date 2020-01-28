// Require mongoose package
const mongoose = require('mongoose');

// Define SubmissionSchema
const SubmissionSchema = mongoose.Schema({
  deklineUserID: String,
  sentence: String
});

const Submission = mongoose.model('Submissions', SubmissionSchema, 'submissions');
module.exports = Submission;
