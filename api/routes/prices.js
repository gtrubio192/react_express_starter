const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();


// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res, next) => {

  const type = req.param('type');
  const size = req.param('size');
  const location = req.param('location');
  // https://storeinventory-api.herokuapp.com/api/v1/getPriceByVendorAndLocation/current/ICC%20Solution/Atlanta/HC/price
  // https://storeinventory-api.herokuapp.com/api/v1/getPriceByLocationAndSize/current/Atlanta/20/HC/price
  
  axios.get(`https://storeinventory-api.herokuapp.com/api/v1/getPriceByLocationAndSize/current/${location}/${size}/${type}/price`)
  .then(res => res.data) 
  .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(404).json(error);
    });
});

module.exports = router;