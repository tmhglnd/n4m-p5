//====================================================================
// Node4Max - p5.js communication
// with socket.io
// 
// by Timo Hoogland (c) 2020, www.timohoogland.com
// MIT License
//====================================================================

// variables for user interface objects
var inPort, outPort, ipHost, inSubmit;

let color = [255, 255, 255, 255];

function setup(){
	createCanvas(windowWidth, windowHeight-50);
	menu();
	setupOsc('127.0.0.1', 12000, 8000);
}

function draw(){
	background(0, 20);

	fill(color);
	noStroke();
	ellipse(mouseX, mouseY, 50, 50);

	// send x and y position of mouse
	sendOsc('/pointer/x', mouseX/width);
	sendOsc('/pointer/y', (height-mouseY)/height);
}

// create some user interface objects to set ip and port numbers
function menu(){
	ipHost = createInput('127.0.0.1');
	inPort = createInput('12000');
	outPort = createInput('8000');
	inSubmit = createButton("MAKE CONNECTION");

	inSubmit.mousePressed(() => {
		setupOsc(ipHost.value(), inPort.value(), outPort.value());
	});
}

// send an osc message over specified port
function sendOsc(address, value){
	socket.emit('message', [address, value]);
}

// setup the osc message send and receive ports
// set isConnected to true when connection established
// specify number for incoming port and outgoing port
function setupOsc(hostIn, oscPortIn, oscPortOut){
	socket = io.connect("http://" + hostIn + ":" + oscPortOut);
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: hostIn},
			client: { port: oscPortOut, host: hostIn}
		});
	});

	socket.on('connect', function(){
		console.log('connected:', hostIn, oscPortIn, oscPortOut);
	});
	
	socket.on('message', function(msg){
		console.log('received:', ...msg);

		if (msg[0] == '/color'){
			color = msg.slice(1, 4);
		}
	});
}
