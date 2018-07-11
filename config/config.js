let yargs = require('yargs')

const argv = yargs
  .options({
    UserName : {
        demand: true,
        alias: 'uname',
        describe: 'UserName',
        string: true
    },
    Password : {
        demand: true,
        alias: 'pass',
        describe: 'Password',
        string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

module.exports = {
    getDBConnectionString : function()
    {
        return 'mongodb://' + argv.uname + ':' + argv.pass + '@ds133041.mlab.com:33041/crawler_db';
    }
};