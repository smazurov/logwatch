#!/usr/bin/env node
var path = process.argv[2];
if (!path) return util.puts("Usage: node <index.js> <filename>");

var wsServer = require('./wsServer');

wsServer.start(path);