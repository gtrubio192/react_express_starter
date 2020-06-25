const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const distance = require('google-distance-matrix');
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

router.get('/', (req, res, next) => {

  const origins = req.param('origins');
  const hubs = req.param('hubs').split(',');
  const mode = 'DRIVING';

  distance.key(GOOGLE_API_KEY);
  distance.units('imperial');

  distance.matrix([origins], hubs, function (err, distances) {
    if(err)
      return console.log(err);
    if(distances.status == 'OK')
      res.json(distances)
  });

  // res.status(200).json({
  //   message: 'Handling GET requests to /MAPS'
  // });
});

module.exports = router;