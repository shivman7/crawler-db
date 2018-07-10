let scrapper = require('./scrapper.js');
let request_promise = require('request-promise');
let redis = require('./redis.js');

var   currentRunning = 0;
var   running = false;
const requestQueue = [];
const maxConcurrent = 5;
const countKey = '_count';
const paramsKey = '_params';
const validUrl=/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

function bfsCrawler() {
    let request = requestQueue.shift();
    redis.getValue(countKey, request.url).then((value) => {
        if(value) {
            redis.setValue(countKey, request.url, parseInt(value) + 1)
                .then(redis.setParams(paramsKey, request.url, request.params))
                .then(() => {
                    if(requestQueue.length > 0) {
                        currentRunning--;
                        nextRequest();
                        // bfsCrawler();
                    } else {
                        console.log('Crawling Finished!')
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            redis.setValue(countKey, request.url, 1)
                .then(redis.setParams(paramsKey, request.url, request.params))
                .then(() => request_promise.get(request.url))
                .then((html) => {
                    var urls = scrapper.getUrlsFromBody(html);
                    urls.forEach((eachUrl) => {
                        if(validUrl.test(eachUrl.url)) {
                            requestQueue.push(eachUrl);
                        }
                    });
                    if(requestQueue.length > 0) {
                        currentRunning--;
                        nextRequest();
                        // bfsCrawler();
                    } else {
                        console.log('Crawling Finised!');
                    }
                }, (err) => {
                        console.log("Erroed URL " + request.url);
                        if(requestQueue.length > 0) {
                            currentRunning--;
                            nextRequest();
                            // bfsCrawler();
                        } else {
                            console.log('Crawling Finised!');
                        }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, (err) => {
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