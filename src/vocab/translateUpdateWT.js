// translationUpdate worker
"use strict";

var debug = false;

var hof = require("../lib/hof");

// first argument is filename
var fromFilename = "eng.txt";
var fromLangCode = "en";
// english
var toFilename = "eng.txt";
var toLangCode = "en";

this.onmessage = function(message) {
    postMessage("status "+ message.data + " recieved");
// parse message into two arguments
var tuple = message.split(" "),
    toFilename = tuple[0],
    toLangCode = tuple[1];
    postMessage("status "+ toFilename + " starting");
    postMessage(toFilename + " done");
    self.close();
};
