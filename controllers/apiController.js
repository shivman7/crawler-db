var CrawlerDB = require('../model/model.js');
var bodyparser = require('body-parser');

let start = false;

module.exports = function(app) {

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true}));
    
    app.get('/', function(req, res) {
        res.sendStatus(200);
    });

    app.get('/result/:page', function(req, res) {
       console.log(req.params.page); 
    });

    app.get('/:start', function(req, res) {

    });
}