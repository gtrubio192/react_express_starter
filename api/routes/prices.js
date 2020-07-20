const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res, next) => {

  res.status(200).json({
    message: 'Handling GET requests to /PRICES'
  });
});

module.exports = router;