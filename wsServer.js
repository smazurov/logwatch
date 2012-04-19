
var WebSocketServer = require('ws').Server, 
    http = require('http'),
    fs = require('fs');

function start (protocol, filename, filewatch) {
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
        filewatch.watch(filename);
        console.log((new Date()) + ' Server is listening on port 8080');
    });
    
    var wss = new WebSocketServer({port:'8888', host:'0.0.0.0'});
    wss.on('connection', function(connection) {
    
        console.log((new Date()) + ' Connection accepted!');
        filewatch.add(connection, filename);
        connection.send(JSON.stringify({filename: filename}));
        connection.on('close', function(code, message) {
            filewatch.remove(connection);
            console.log((new Date()) + ' Peer disconnected.');
        });
    });
    wss.on('error', function(e) {
        console.log(e);
    });
}

exports.start = start;