let bodyparser = require('body-parser');
let CrawlerDB = require('./../model/model.js');
let crawler = require('./../crawler.js');

module.exports = function(app) {

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true}));
    
    app.get('/result/:page', function(req, res) {
       let page = req.params.page;
       let limit = 50;
       let offset = (page - 1) * limit;

       const countPromise = CrawlerDB.count();
       const queryPromise = CrawlerDB.find().skip(offset).limit(limit).sort({count : -1, timestamp : 1});
       Promise.all([countPromise, queryPromise]).then((data) => {
        res.send({count : data[0], pages : Math.ceil(data[0] / limit), data : data[1]});
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
            res.send('Paused');
        } else if (req.params.toggle == 'resume') {
            start = true;
            console.log('Resuming');
            crawler.toggleCrawling('', 'resume');
            res.send('Resumed');
        }
    });
}