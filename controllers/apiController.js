let bodyparser = require('body-parser');
let CrawlerDB = require('./../model/model.js');
let crawler = require('./../crawler.js');
// let redis = require('./../redis.js');

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

    app.get('/abc', function(req, res) {
        CrawlerDB.find({url : 'xyz'}).then((data) => {
            res.send(data);
        })
    })

    app.get('/update', function(req, res) {
        CrawlerDB.findOneAndUpdate({url : 'xyz'}, {$set : {
                url : 'nigga'
            }, $inc : {
                count : 1
            }
        }, {new : true}).then((data) => {
            if(data) {
                console.log('updated')
            } else {
                console.log('Hello')
            }
            res.send(data);
        });
        // CrawlerDB.findByIdAndUpdate({ url : 'xyz'}, )
    });


    app.get('/status/:toggle', function(req, res) {
        if (req.params.toggle == 'start') {
            start = true;
            console.log('Starting');
            //TODO : clear db;
            crawler.toggleCrawling('https://www.medium.com', start)
            res.send('Started');
        } else if (req.params.toggle == 'stop') {
            start = false;
            console.log('Stopping');
            crawler.toggleCrawling('', start);
            res.send('Stopped');
        } else if (req.params.toggle == 'resume') {
            start = true;
            console.log('Resumed');
            crawler.toggleCrawling('', start);
            res.send('Resuming');
        }
    });
}