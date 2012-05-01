
var WebSocketServer = require('ws').Server, 
    http = require('http'),
    fs = require('fs'),
    pool = require('./pool'),
    filewatch = require('./filewatch');

function start (path) {
    var server = http.createServer(function(request, response) {
        if (request.url == "/") {
            fs.readFile('example/test-view.html', 'utf8', function(err, data) {
                if (err) {
                    response.writeHead(404);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    response.end(data);
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
    server.listen(8080, function() {
        filewatch.watch(path);
        console.log((new Date()) + ' Server is listening on port 8080');
    });
    
    var wss = new WebSocketServer({port:'8888', host:'0.0.0.0'});
    wss.on('connection', function(connection) {
        pool.add(connection, filewatch);
        connection.on('message', function(message) {
            connection.file = 'foo';
            message = JSON.parse(message);
            var exists = function(file) {
                return (message.watch === file);
            };
            // console.log(wss);
            if(filewatch.filelist().some(exists)) {
                    pool.newFile(message.watch, connection, filewatch);
            }
        });
        //connection.send(JSON.stringify({filename: filename}));
        connection.on('close', function(code, message) {
            pool.remove(connection);
            console.log((new Date()) + ' Peer disconnected.');
        });
    });
    wss.on('error', function(e) {
        console.log(e);
    });
}

exports.start = start;