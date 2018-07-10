let CrawlerDB = require('../model/model.js');
let bodyparser = require('body-parser');
let crawler = require('./../crawler.js');
let redis = require('./../redis.js');

let start = false;

module.exports = function(app) {

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true}));
    
    app.get('/', function(req, res) {
        res.sendStatus(200);
    });

    app.get('/result/:page', function(req, res) {
       let page = req.params.page;
       let limit = 50;
       let offset = (page - 1) * limit;
       CrawlerDB.find().then((data) => {
            res.send({noOfPages : (data.length)/limit, data : data.slice(offset, offset + limit)});
       }, (e) => {
           res.sendStatus(400).send(e);
       }); 
    });

    app.get('/:toggle', function(req, res) {
        if (req.params.toggle == 'start') {
            start = true;
            console.log('starting');
            redis.connect()
                .then(redis.clearRedis())
                .then(crawler.toggleCrawling('https://www.medium.com', start))
                .catch((err) => { console.log(err); })
        } else {
            start = false;
            console.log('stopping');
            crawler.toggleCrawling('', start);
        }
    });
}