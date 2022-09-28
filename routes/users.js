var express = require('express');
var router = express.Router();

/* Add users after purchase is successfull */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
