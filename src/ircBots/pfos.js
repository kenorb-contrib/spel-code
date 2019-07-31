#!/usr/bin/node
/* translational duties */
var io = require("../lib/io"),
    irc = require('irc'),
    hof = require("../lib/hof"),
    botb = require("./ircBotBase"),
    uniqueObj = JSON.parse(io.fileRead("unique-mega.json")),
    langObj = JSON.parse(io.fileRead("langWords-mega.json")),
    thesaurus = uniqueObj.thesaurus,
    blacklist = uniqueObj.blacklist,
    dictionary = JSON.parse(io.fileRead("dictionary.json")),
    mainWordsAr = Object.keys(dictionary.en.pyash_ablativeCase).map(
      function(word){ return word.substring(1); }),
    rootList = langObj.rootList,
    gramList = langObj.gramList,
    bot;
function translateWord(regional_dictionary, word) {
  var translation = regional_dictionary["X" + word];
  //console.log("w " + word + " t " + translation);
  if (translation === undefined) { translation = word; }
  return translation;
}
function repairWord(regional_dictionary, word) {
  function approvedWords(word) {
      if (regional_dictionary.pyash_dativeCase["X" + word] !== undefined) {
          return true;
      }
      return false;
  }
  function approvedEnWords(word) {
      if (dictionary.en.pyash_dativeCase["X" + word] !== undefined) {
          return true;
      }
      return false;
  }
  var result = "";
  var bword = regional_dictionary.blacklist["X" + word];
  var bentry = blacklist["X" + bword];
  //console.log("bentry " + bentry);
  if (approvedWords(word)) {
    result = word;
  } else if (bentry) {
    // assumed dictionary results in pyash word
    if (Array.isArray(bentry)) {
        //console.log(bentry.filter(approvedEnWords));
        //console.log(bentry.filter(approvedEnWords).map(translateWord.curry(
        //          dictionary.en.pyash_dativeCase)));
        result += bentry.filter(approvedEnWords).map(translateWord.curry(
                  dictionary.en.pyash_dativeCase)).map(translateWord.curry(
                  regional_dictionary.pyash_ablativeCase)).join(", ");
    }
    result =  '<<' + result + '>>';
  } else {
    result = "<<>>";
  }
  return result;
}
function randomWord(regional_dictionary) {
  var word =  mainWordsAr[Math.random() * mainWordsAr.length | 0];
  return word + " " + regional_dictionary.pyash_ablativeCase["X" + word];
}
function main () { 
message = process.argv[2];
"use strict";
  var newMessage = message;
  var channel_language_code = "en" || "pya";
  var regional_dictionary = dictionary[channel_language_code];
  var newMessageAr = newMessage.split(" ");
  if (newMessage === "tlat") {
    var word = randomWord(regional_dictionary); 
    console.log( word);
  } else if (newMessageAr[newMessageAr.length-1] === "kfintu") {
    if (thesaurus["X" + newMessageAr[0]]) {
      console.log(from + thesaurus["X" + newMessageAr[0]]);
    } else {
      console.log( from + newMessageAr[0] + " hfangwohli");
    }
  } else if (regional_dictionary) {
    //console.log("repairing " + newMessage);
    var repaired = (newMessage.split(" ").
          map(repairWord.curry(regional_dictionary))).join(" ");
    //console.log(JSON.stringify(repaired));
    console.log(  repaired);
    if (!/<</.test(repaired)) {
      var translated = repaired.split(" ").map(translateWord.curry(
          regional_dictionary.pyash_dativeCase)).join(" ");
      console.log(  translated);
    }
  } else if (!regional_dictionary) {
      console.log(  " no regional_dictionary");
      return;
}
}
main();
