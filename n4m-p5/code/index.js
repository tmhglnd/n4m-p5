//====================================================================
// Node4Max - p5.js communication
// with socket.io
// 
// by Timo Hoogland (c) 2020, www.timohoogland.com
// MIT License
//====================================================================

// require dependencies
const express = require('express');
const max = require('max-api');
const socket = require('socket.io');

// init the app server and port to listen on
const app = express();
const server = app.listen(8000);

// connect via socket io
const io = socket(server);

// post socket id to max console
io.sockets.on('connection', function(socket){
	// print ID when new connection is made
	max.post("new connection", socket.id);
	
	// listen for messages and output to Max
	socket.on('message', function(msg){
		max.outlet(msg);
	});
});

// send messages to the connected device
max.addHandler('send', (address, ...args) => {
	io.sockets.emit('message', [address, ...args]);
});