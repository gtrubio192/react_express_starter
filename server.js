const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const emailRoute = require('./api/routes/sendEmail');
const mapsRoute = require('./api/routes/googleRoutes');


const port = process.env.PORT || 5000;


app.use('/api/sendEmail', emailRoute);
app.use('/api/distance', mapsRoute);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

app.listen(port, () => `Server running on port ${port}`);