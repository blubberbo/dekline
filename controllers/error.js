// Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const error = require('../models/error');

// POST HTTP method to /error
router.post('/', (req, res, next) => {
  error.logError({ status: req.body.stack, message: req.body.message, stack: req.body.stack }, (err) => {
    if (err) {
      res.json({success: false, message: `Failed to log the error. Error: ${err}`});
    }
    else {
      res.json({success: true, message: 'Error logged successfully!'});
    }
    res.end();
  });
});

// //DELETE HTTP method to /bucketlist. Here, we pass in a param which is the object id.

// router.delete('/:id', (req,res,next)=> {
//   //access the parameter which is the id of the item to be deleted
//     let id = req.params.id;
//   //Call the model method deleteListById
//     bucketlist.deleteListById(id,(err,list) => {
//         if(err) {
//             res.json({success:false, message: `Failed to delete the list. Error: ${err}`});
//         }
//         else if(list) {
//             res.json({success:true, message: "Deleted successfully"});
//         }
//         else
//             res.json({success:false});
//     })
// });

module.exports = router;
