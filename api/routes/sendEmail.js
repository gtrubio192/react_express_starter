const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res, next) => {

  const userEmail = req.body.email;
  const userAddress = req.body.address;
  const userName = req.body.name;
  const quoteCost = req.body.cost;
  const containerType = req.body.container;
  const containerQuantity = req.body.quantity;

  // const auth = {
  //   auth: {
  //       api_key: process.env.API_KEY || 'mailgun_api_key', // TODO: 
  //       domain: process.env.DOMAIN || 'mailgun_domain' // TODO:
  //   }
  // };

// Step 2
  var transporter = nodemailer.createTransport( mailGun(auth) );

  // FOR PROD
  // User Sendgrid or Mailgun (remove 'gmail')
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sales@bobscontainers.com',
      pass: process.env.USER_PASSWORD
    }
  });
  

  var mailOptions = {
    from: 'tech@bobscontainers.com',
    bcc: 'sales@bobscontainers.com',
    to: `${userEmail}`,
    subject: 'You order with Bobs Containers has been placed!',
    html: `<h1>Hi ${userName}</h1>
          <p>We have received your order for <strong>${containerQuantity} - ${containerType}</strong> container for an estimated cost of <strong>$${quoteCost}</strong> to be shipped to ${userAddress}</p>
          <p>We appreciate your business and we will be contacting your shortly to get your container on the way.</p>
          <br><p>Best Regards,<br>Bobs Containers</p>`      
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
        res.status(200).json({
          message: 'Email Sent'
        });
    }
  });

});

module.exports = router;