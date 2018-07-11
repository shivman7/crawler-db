let request_promise = require('request-promise');
let CrawlerDB = require('./model/model.js');
let scrapper = require('./scrapper.js');
// let redis = require('./redis.js');

var   currentRunning = 0;
var   running = false;
const requestQueue = [];
const maxConcurrent = 5;
const countKey = '_count';
const paramsKey = '_params';
const validUrl=/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

function bfsCrawler() {
    let request = requestQueue.shift();
    CrawlerDB.findOneAndUpdate({url : request.url}, {
        $set : {
            timeStamp : new Date().getTime()
        }, $inc : {
            count : 1
        }, $addToSet : {
            params : request.params
        }
    }, { new : true }).then(data => {
        if(data) {
            if(requestQueue.length > 0) {
                currentRunning--;
                nextRequest();
            } else {
                console.log('Crawling Finished!')
            }
        } else {
            let newUrlData = CrawlerDB({
                url : request.url,
                params : request.params,
                count : 1,
                timeStamp : new Date().getTime()       
            });
            newUrlData.save()
                .then(data => request_promise.get(request.url))
                .then(html => {
                    var urls = scrapper.getUrlsFromBody(html);
                    urls.forEach((eachUrl) => {
                        if(validUrl.test(eachUrl.url)) {
                            requestQueue.push(eachUrl);
                        }
                    });
                    if(requestQueue.length > 0) {
                        currentRunning--;
                        nextRequest();
                    } else {
                        console.log('Crawling Finised!');
                    }
                }, err => {
                    console.log("Erroed URL " + request.url);
                    if(requestQueue.length > 0) {
                        currentRunning--;
                        nextRequest();
                    } else {
                        console.log('Crawling Finised!');
                    }
                }).catch(err => {
                    console.log(err);
                });
        }
    }).catch(err => {
        console.log(err);
    });
}

function nextRequest() {
    if (currentRunning < maxConcurrent && currentRunning >= 0) {
        if (running) {
            while (currentRunning <= maxConcurrent)
            {
            if (requestQueue.length == 0) { break; }
            currentRunning++;
            bfsCrawler();
          }
        }
    }
}

function toggleCrawling(url, toggleRunning) {
    running = toggleRunning;
    if (running) {
        requestQueue.push({'url' : url, 'params' : []});
        currentRunning++;
        bfsCrawler();
    } 
}

module.exports = {
    toggleCrawling : toggleCrawling
};