var json = JSON.stringify;
var wsConnections = [];

function add (ws, filewatch) {
    console.log((new Date()) + ' Connection accepted!');
    var fileObj = filewatch.fileObj();
    ws.filename = fileObj.filename;
    wsConnections.push(ws);
    filewatch.readFile(fileObj, this, wsConnections.indexOf(ws));
}

function newFile(filename, ws, filewatch) {
    var fileObj = filewatch.fileObj(filename);
    ws.filename = fileObj.filename;
    filewatch.readFile(fileObj, this, wsConnections.indexOf(ws));
}

function send(data, index) {
    data = json(data);
    if (typeof index == 'number' && wsConnections[index]) {
        wsConnections[index].send(data);
    } else {
        wsConnections.forEach(function(ws) {
            if(ws.filename == index) {
                ws.send(data);
            }
        });
    }
}

function remove (ws) {
    var index = wsConnections.indexOf(ws);
    if (index !== -1) {
        wsConnections.splice(index, 1);
    }
}

exports.add = add;
exports.newFile = newFile;
exports.remove = remove;
exports.send = send;
exports.sayHi = function() {
    console.log('hi');
};