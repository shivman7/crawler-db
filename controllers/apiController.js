let bodyparser = require('body-parser');
let CrawlerDB = require('./../model/model.js');
let crawler = require('./../crawler.js');

let start = false;

module.exports = function(app) {

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true}));
    
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

    app.get('/status/:toggle', function(req, res) {
        if (req.params.toggle == 'start') {
            console.log('Starting');
            CrawlerDB.remove().then(() => {
            crawler.toggleCrawling('https://medium.com/', 'start');
            })
            res.send('Started');
        } else if (req.params.toggle == 'stop') {
            start = false;
            console.log('Stopping');
            crawler.toggleCrawling('', 'stop');
            res.send('Stopped');
        } else if (req.params.toggle == 'resume') {
            start = true;
            console.log('Resuming');
            crawler.toggleCrawling('', 'resume');
            res.send('Resumed');
        }
    });
}