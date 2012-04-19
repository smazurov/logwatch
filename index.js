#!/usr/bin/env node
var filename = process.argv[2];
if (!filename) return util.puts("Usage: node <index.js> <filename>");

var filewatch = require('./filewatch'),
    wsServer = require('./wsServer');

wsServer.start('log', filename, filewatch);