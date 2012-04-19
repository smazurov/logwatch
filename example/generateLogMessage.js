var fs = require('fs'),
    http = require('http'),
    util = require('util');

var logFile = 'logs/example.log';


var fileWrite = function(data) {
    var writeStream = fs.createWriteStream(logFile, {flags:'a', encoding: 'ascii'});
    writeStream.write('\n' + data);
}

var factOptions = {
  host: 'www.randomfunfacts.com',
  port: 80,
  path: '/'
};

http.get(factOptions, function(res) {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function(){
        var time = new Date();
        var lz = function(x) {return(x<0||x>9?"":"0")+x};
        var date = util.format("%s:%s:%s %s/%s/%s", 
            lz(time.getHours()),lz(time.getMinutes()), lz(time.getSeconds()) ,
            time.getMonth(), time.getDay(), time.getFullYear());
        var fact = body.match(/<strong><i>(.*?)<\/i><\/strong>/i);
        var line = util.format("[%s] [%s] %s", 'DEBUG', date, fact[1]);    
        fileWrite(line);
    });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
