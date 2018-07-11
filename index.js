let express = require('express');
let app = express();
let mongoose = require('mongoose');
let config = require('./config/config.js'); 
let apiController = require('./controllers/apiController.js');

var port = process.env.PORT || 8000;

app.use(express.static('public'));

mongoose.connect(config.getDBConnectionString());

apiController(app);

app.listen(port);