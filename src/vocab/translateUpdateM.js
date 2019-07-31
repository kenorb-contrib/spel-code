"use strict";

var hof = require("../lib/hof");

var Worker = require('webworker-threads').Worker,
    cores = 8,
    langs = 4,
    i = 0,
    langEntry = 0,
    workerPool = [],
    langArray = ["spa.txt es", "por.txt pt", "fra.txt fr",
        "zho.txt zh"];
    
function nextLang(workerIndex, event) {
    var message = event.data,
        tuple = message.split(" "),
        status = tuple[0];
    console.log(message);
    if (status === "status") return 0; 
    if (langEntry > langs) {
        workerPool[workerIndex].postMessage("close");
    } else {
        workerPool[workerIndex].postMessage(
            langArray[langEntry]);
        langEntry++;
    }
}

for (i = 0; i < cores && i < langs; i ++){
    workerPool[i]  = new Worker('translateUpdateWTB.js');
    workerPool[i].onmessage = nextLang.curry(i);
    //workerPool[i].onmessage = function(message) {
    //    console.log(message.data);
    //}
    console.log("starting worker " + i + " on " +
        langArray[langEntry]);
    workerPool[i].postMessage(langArray[langEntry]);
    langEntry++;
}

