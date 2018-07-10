var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crawlerSchema = new Schema({
    url : String,
    params : String,
    count : Number,
    timeStamp : String
})

var CrawlerDB = mongoose.model('CrawlerDB', crawlerSchema);

module.exports = CrawlerDB;