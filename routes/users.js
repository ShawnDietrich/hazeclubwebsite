var express = require('express');
var router = express.Router();

/* Add users after purchase is successfull */
router.get('/', function(req, res, next) {
  res.status(200).render('user')
});

module.exports = router;
