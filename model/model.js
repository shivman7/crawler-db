let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let Schema = mongoose.Schema;

let crawlerSchema = new Schema({
    url : String,
    params : [String],
    count : Number,
    timeStamp : Number
})

let CrawlerDB = mongoose.model('CrawlerDB', crawlerSchema);

module.exports = CrawlerDB;