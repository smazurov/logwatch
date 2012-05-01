var fs = require('fs');
var json = JSON.stringify;

var files = [];
var backlog_size = 2000;
function watch (path) {
    fs.stat(path, function(err, stats) {
        if(err) throw err.code + ": " + err.path;
        if(stats.isFile()) {
            files.push({filename: path, index: 0});
        } else if (stats.isDirectory()) {
            fs.readdir(path, function(err, filenames) {
                filenames.forEach(function(filename, i) {
                    files.push({filename: path + '/' + filename, index: i});
                });
            });
        }
    });
}
function watchFile(fileObj, pool) {
    console.log((new Date()) + ' Watching ' + fileObj.filename);
    fs.watchFile(fileObj.filename, {interval: 100}, function (curr, prev) {
        if(curr.mtime > prev.mtime) {
            fs.open(fileObj.filename, 'r', function(err,fd) {
                var length = curr.size - prev.size;
                if(length > 0) {
                    var buffer = new Buffer(length);
                    fs.read(fd, buffer, 0, length, prev.size, function(err, bytesRead, buffer) {

                        if(err) {
                            console.error("Data could not be read: %s", err);
                        }
                        var lines = buffer.toString('utf-8').split("\n").reverse();
                        pool.send({tail : lines}, fileObj.filename);

                        fs.close(fd);
                    });    
                }
            });
        }
        //console.log('the current mtime is: ' + curr.mtime);
        //console.log('the previous mtime was: ' + prev.mtime);
        //console.log("time now: " + new Date());
        
    });
}

function readFile(fileObj, pool, index) {
    fs.stat(fileObj.filename, function(err,stats) {
        if (err) {throw err; }
        var start = (stats.size > backlog_size) ? (stats.size - backlog_size) : 0;
        var stream = fs.createReadStream(fileObj.filename, {start:start, end:stats.size});
        stream.addListener("data", function(lines) {
            lines = lines.toString('utf-8');
            lines = lines.slice(lines.indexOf("\n")+1).split("\n");
            lines = lines.reverse();
            
            var data = {
                filenames: filelist(),
                file: fileObj.filename,
                tail: lines
            };
            pool.send(data, index);
            //module.exports.emit('file-read', lines);
            //return lines;
        });
    });
    if (!fileObj.watch) {
        watchFile(fileObj,pool);
        fileObj.watch = true;
    }
}
module.exports.watch = watch;
module.exports.readFile = readFile;
module.exports.fileObj = function(name) {
    if(!name) {
        return files[0];    
    } else {
        for (var i=0; i < files.length; i++) {
            if (files[i].filename == name) {
                return files[i];
            }
        }
    }
};
module.exports.filelist = function() {
    var fileArray = [];
    files.forEach(function(fileObj) {
        fileArray.push(fileObj.filename);
    });
    return fileArray;
};