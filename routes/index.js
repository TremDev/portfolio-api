var express = require('express');
var router = express.Router();

/* Basic API ping. */
router.get('/', function (req, res, next) {
  res.send('API is up and running.');
});

module.exports = router;