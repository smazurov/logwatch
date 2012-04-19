var fs = require('fs');

var wsConnections = [];

var backlog_size = 2000;
function watch (filename) {
    fs.watchFile(filename, {interval: 100}, function (curr, prev) {
        fs.open(filename, 'r', function(err,fd) {
            var length = curr.size - prev.size;
            if(length > 0) {
                var buffer = new Buffer(length);
                fs.read(fd, buffer, 0, length, prev.size, function(err, bytesRead, buffer) {
                    if(err) {
                        console.error("Data could not be read: %s", err);
                    }
                    send({ tail : buffer.toString('utf-8').split("\n").reverse() });
                    
                    fs.close(fd);
                });    
            }
        });
    });  
}

function add (ws,filename) {
    wsConnections.push(ws);
    fs.stat(filename,function(err,stats){
        if (err) throw err;
        var start = (stats.size > backlog_size)?(stats.size - backlog_size):0;
        var stream = fs.createReadStream(filename,{start:start, end:stats.size});
        stream.addListener("data", function(lines){
            lines = lines.toString('utf-8');
            lines = lines.slice(lines.indexOf("\n")+1).split("\n");
            lines = lines.reverse();
            ws.send(JSON.stringify({ tail : lines}));
        });
    });
}

function remove (ws) {
    var index = wsConnections.indexOf(ws);
    if (index !== -1) {
        wsConnections.splice(index, 1);
    }
}

function send (message) {
    console.log(wsConnections.length);
    if (wsConnections.length > 0) {
        wsConnections.forEach(function (outputConnection) {
            outputConnection.send(JSON.stringify(message), {mask: true});
           
        });
    }
}

exports.watch = watch;
exports.send = send;
exports.add = add;
exports.remove = remove;