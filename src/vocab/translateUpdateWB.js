(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
//var Sentence = require("./sentence");
module.exports = Clause;
var className = "Clause";
// Clause{
// "be":"Clause",
// "clauseTerm":Word,
// "sentence":Sentence,
// "clauseWord":Word}
//
function Clause(language, input){
var Sentence = require("./sentence");
	this.be = className;
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === className){
			//if (input.tail)
			//this.tail = 
			//new Word(language, input.tail);
			this.body = 
			new Sentence(language, input.body);
			this.head = 
			new Word(language, input.head);
			return this;
		}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	// parse last phrase
	var grammar = language.grammar;
	var clauseInitial = grammar.wordOrder.clauseInitial;
	var clauseWord, otherTokens, clauseWordI;
	var clause;
	// if clause initial 
	if (clauseInitial){
	clauseWordI = tokens.length-1;
	otherTokens = tokens.slice(0,clauseWordI+1);
	clause = parse.adjacentClause(grammar,otherTokens);
	clauseWord = clause[clauseWordI];
	otherTokens = clause.slice(0,clauseWordI);
	// if clauseTerminator exists set it
	// and remove from otherTokens
	if (parse.wordMatch(grammar.clauseTerminator,
				clause[0])){
		//this.tail=new 
		//	Word(language, clause[0]);
		otherTokens.shift();
	}
	}
	// if clause final
	else {
		clauseWordI = 0;
		clause = parse.adjacentClause(grammar,tokens,
				clauseWordI);
		clauseTermI = clause.length-1;
		clauseWord = clause[0];
		otherTokens = clause.slice(clauseWordI+1);
		// if clauseTerminator exists set it
		// and remove from otherTokens
		if (parse.wordMatch(grammar.clauseTerminator,
					clause[clauseTermI])){
			//this.tail=new 
			//Word(language, clause[clauseTermI]);
			otherTokens.pop();
		}
	}
	this.body = new Sentence(language, otherTokens);
	this.head = new Word(language, clauseWord);
	////this.clause = new Sentence();
	return this;
}
Clause.prototype.toString = function(format){
	var joiner = ' ';
	var result = new String();
	var clauseTerm = undefined;//this.tail;
	var sentence = this.body;
	var clauseWord = this.head;
	if (clauseTerm) 
		result += clauseTerm.toString(format)+joiner;
	if (sentence) 
		result += sentence.toString(format);
	if (clauseWord) result += clauseWord.toString(format);
	return result;
};
Clause.prototype.toLocaleString = 
function(language,format,type,conjLevel){
	var joiner = ' ';
if (format && format.joiner !== undefined) joiner = format.joiner;
var conj = new Object();
if (conjLevel >= 3) conj = language.grammar.conjugation;
if (conj && conj.format && conj.format.joiner !== undefined) {
var joiner = conj.format.joiner;}

	var result = new String();
	var clauseTerm = undefined; //this.tail;
	var sentence = this.body;
	var clauseWord = this.head;

if (language.grammar.wordOrder.clauseInitial){
//if (clauseTerm) result += 
//clauseTerm.toLocaleString(language,format,"lh",conjLevel)+joiner;
if (sentence) result += 
sentence.toLocaleString( language,format,type,conjLevel)
.replace(/ $/,joiner)
;
if (clauseWord) result += 
clauseWord.toLocaleString(language,format,"lh",conjLevel)
 ;
}
else {
if (clauseWord) result += clauseWord.toLocaleString(
		language,format,"lh",conjLevel)+joiner;
if (sentence) result += sentence.toLocaleString(
	language,format,type,conjLevel).replace(/ $/,joiner);
if (clauseTerm) result += clauseTerm.toLocaleString(
		language,format,"lh",conjLevel)+joiner;
}
return result;
};
Clause.prototype.isLike= function(language,input){
	var match = clauseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
Clause.prototype.isSubset= function(language,input){
	var match = clauseInputToMatch(language,input);
	if (this.head.isSubset(language, match.head)
		&& this.body.isSubset(language,match.body))
		return true;
	return false;
};
Clause.prototype.copy = function(language,conjugationLevel){
return new Clause(language,
JSON.parse(JSON.stringify(this)),conjugationLevel);
}
Clause.prototype.isSuperset= function(language,input){
var match = clauseInputToMatch(language,input);
var result = true;
if (match.body && !this.body || match.head && ! this.head)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
return result;
};
function clauseInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Clause(language, input);
	else if (typeof input === "object"
		&& input.be === className)
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+className);
}

},{"../compile/parse":11,"../compile/tokenize":12,"./quote":4,"./sentence":5,"./type":9,"./word":10}],2:[function(require,module,exports){
"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Phrase = require("./phrase");
var Clause = require("./clause");
module.exports = Junction;
function Junction(language, input,partOfSpeech){

this.be = "Junction";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "Junction"){
var i;
if (input.body.length > 0) this.body = new Array();
if (input.clas) this.clas = input.clas;
var Clas = Type;
if (input.clas && input.clas === "Phrase") Clas = Phrase;
for (i=0;i<input.body.length;i++)
this.body[i]=new Clas(language, input.body[i],partOfSpeech);
this.head = new Word(language, input.head);
return this;
}
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);

// junction constructor algorithm de
// assumes head word be junction class ya
// if clause initial then be get from end ya
// be get ob junction word ya
// be set ob head as the junction ya
// be get ob last word yand be identify class ya
// su junction retrieve ob class from tokens with junction de 
// be set ob other tokens from after junction word til head ya
// su class retrieve ob class from tokens de 
// be get ob an object of the class from other tokens ya
// be add ob the object to body array ya
// su class retrieve be end ya
// be set ob other tokens from before junction word ya
// be parse ob the class from other tokens ya
// if head word be not matching to last word
// then throw error that this word and last word not matching
// else if tail word be matching junction
// then be junction retrieve ya
// else  be class retrieve ya
// su clause initial conditional be end ya
// 
// if clause final then be get from start ya
// be get ob junction word ya
// be set ob head as the junction ya
// be get ob first word yand be identify class ya
// su junction retrieve ob class from tokens with junction de 
// be set ob other tokens from before junction word til head ya
// su class retrieve ob class from tokens de 
// be get ob an object of the class from other tokens ya
// be add ob the object to body array ya
// su class retrieve be end ya
// be set ob other tokens from after junction word ya
// be parse ob the class from other tokens ya
// if head word be not matching to last word
// then throw error that this word and last word not matching
// else if tail word be matching junction
// then be junction retrieve ya
// else  be class retrieve ya
// su clause final conditional be end ya

// set output do


this.be = "Junction";
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var postpositional = wordOrder.postpositional;
var clauseInitial = wordOrder.clauseInitial;
var head, body = new Array();
var bodyI = 0;

// assumes head word be junction class ya
// if clause initial then be get from end ya
if (clauseInitial){
// be get ob junction word ya
var junctionWordI = parse.lastJunctionWordIndex(grammar,tokens);
// be set ob head as the junction ya
head = tokens[junctionWordI];
// be get ob last word yand be identify class ya
var headWordI = tokens.length-1
var lastWord = tokens[headWordI];
var clas, otherTokens;
if (parse.wordMatch(grammar.phraseWords,lastWord))
clas = "Phrase";
else 
clas = "Type";
// su junction retrieve ob class from tokens 
// with junction and head word de 
body = 
lastJunctionRetrieve(language, junctionWordI,
headWordI,tokens,body,head,clas,partOfSpeech);
body.reverse();
}// su clause initial conditional be end ya

// if clause final then be get from end ya
if (clauseInitial === false){
// be get ob junction word ya
var junctionWordI = parse.firstJunctionWordIndex(grammar,tokens);
// be set ob head as the junction ya
head = tokens[junctionWordI];
// be get ob last word yand be identify class ya
var headWordI = 0;
var firstWord = tokens[headWordI];
var clas, otherTokens;
if (parse.wordMatch(grammar.phraseWords,firstWord))
clas = "Phrase";
else 
clas = "Type";
// su junction retrieve ob class from tokens 
// with junction and head word de 
body = 
firstJunctionRetrieve(language,
junctionWordI,headWordI,tokens,body,head, clas,partOfSpeech);
}// su clause final conditional be end ya

// set output do
if (clas) this.clas = clas;
if (body) this.body = body;
if (head) this.head = new Word(language,head);
return this;
}// end of Junction Constructor ya

/* start of junction constructor helper functions */
// su class retrieve ob class from tokens de 
function classRetrieve(language, otherTokens,clas,body,
partOfSpeech){

// be get ob an object of the class from other tokens ya
var object;
if (clas === "Phrase")
object = new Phrase(language,otherTokens);
else 
object = new Type(language,otherTokens, partOfSpeech);
// be add ob the object to body array ya
body[body.length]=object;
return body;
}// su class retrieve be end ya

function 
lastJunctionRetrieve(language,
junctionWI,headWordI,tokens,body,head,clas,partOfSpeech)
{
var lastWord = tokens[tokens.length-1];
// be set ob other tokens 
// from after junction word til last word ya
var otherTokens = tokens.slice(junctionWI+1,headWordI+1);
// su class retrieve ob class from tokens de 
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
// be set ob other tokens from before junction word ya
otherTokens = tokens.slice(0,junctionWI);
// be parse ob the class from other tokens ya
var classIndexes;
var grammar = language.grammar;
if (clas === "Phrase")
classIndexes = parse.lastPhraseIndex(grammar,otherTokens);
else if (clas === "Type")
classIndexes = parse.lastTypeIndex(grammar,otherTokens);
// if head word be not matching to last word
headWordI = classIndexes[1]-1;
var tailWordI = classIndexes[0];
var headWord = otherTokens[headWordI];
var tailWord = otherTokens[tailWordI];
if (headWord !== lastWord && clas !== "Type")
// then throw error that this word and last word not matching
throw Error(headWord + " and " + lastWord + " be not match ya");
// else if tail word be matching junction
else if (tailWord === head)
// then be junction retrieve ya
body = 
lastJunctionRetrieve(language,
tailWordI, headWordI, otherTokens, body, head,clas, partOfSpeech);
// else  be class retrieve ya
else{
otherTokens = otherTokens.slice(tailWordI,headWordI+1);
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
}
return body;
}// su junction retrieve be end ya


function 
firstJunctionRetrieve(language,
junctionWI,headWordI,tokens,body,head,clas,partOfSpeech
){
// be set ob other tokens 
// from first word til before junction word ya
var otherTokens = tokens.slice(headWordI,junctionWI);
// su class retrieve ob class from tokens de 
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
// be set ob other tokens from after junction word ya
otherTokens = tokens.slice(junctionWI+1);
// be parse ob the class from other tokens ya
var classIndexes;
var grammar = language.grammar;
if (clas === "Phrase")
classIndexes = parse.firstPhraseIndex(grammar,otherTokens);
else if (clas === "Type"){
classIndexes = parse.firstTypeIndex(grammar,otherTokens);
}
// if head word be not matching to last word
headWordI = classIndexes[0];
var tailWordI = classIndexes[1]-1;
var headWord = otherTokens[headWordI];
var tailWord = otherTokens[tailWordI];
var firstWord = tokens[0];
if (headWord !== firstWord && clas !== "Type")
// then throw error that this word and last word not matching
throw Error(headWord + " and " + firstWord + " be not match ya");
// else if tail word be matching junction
else if (tailWord === head)
// then be junction retrieve ya
body = 
firstJunctionRetrieve(language, tailWordI, headWordI, 
otherTokens, body, head,clas, partOfSpeech);
// else  be class retrieve ya
else{
otherTokens = otherTokens.slice(headWordI,tailWordI+1);
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
}
return body;
}// su junction retrieve be end ya

/* end of helper functions */


function junctionInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Junction(language, input,
partOfSpeech);
	else if (typeof input === "object"
		&& input.be === "Junction")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"Junction");
}
Junction.prototype.isSubset= function(language,input){
var match = junctionInputToMatch(language,input);
var result = true;
if(!match.body && this.body 
|| !match.head && this.head
|| !match.clause && this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSubset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSubset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSubset(language,match.clause))
result = false;
return result;
};
Junction.prototype.isSuperset= function(language,input){
var match = junctionInputToMatch(language,input);
var result = true;
if(match.body && !this.body 
|| match.head && ! this.head
|| match.clause && !this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSuperset(language,match.clause))
result = false;
return result;
};
Junction.prototype.isLike= function(language,input){
	var match = junctionInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
Junction.prototype.copy = function(){
 	return new Junction(language, JSON.parse(JSON.stringify(this)));
}
Junction.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	return this.body.valueGet();
}
Junction.prototype.toString = function(format){
var joiner = ' ';
var phraseJoiner = ' ';
var result = new String();
// algorithm de
// for each ob element of body til second last element de
// be add ob it to result with head and joiner ya
// be add ob last element with joiner ya
var i;
var body = this.body;
var headS = new String();
if (this.head) headS = this.head.toString(format);
var clas = this.clas;
// for each ob element of body de
for (i=0;i<body.length-1;i++)
// be add ob it to result with head and joiner ya
if (clas === "Phrase")
result += body[i].toString(format) + headS + joiner;
else
result += body[i].toString(format) + joiner + headS + phraseJoiner;
// be add ob last element with joiner ya
result += body[i].toString(format);
return result;
};
Junction.prototype.toLocaleString = 
function(language, format,type, conjLevel){
var conj = new Object;
var joiner = ' ';
var phraseJoiner = " ";
if (format && format.joiner!==undefined) joiner = format.joiner;
if (conjLevel >= 3) conj = language.grammar.conjugation;
if (conj && conj.format && conj.format.joiner !== undefined) {
joiner = conj.format.joiner;}
var result = new String();
// algorithm de
// for each ob element of body til second last element de
// be add ob it to result with head and joiner ya
// be add ob last element with joiner ya
var i;
var body = this.body;
var headS = new String();
if (this.head) 
headS = this.head.toLocaleString(language,format,"jh", 
conjLevel);
// for each ob element of body de
var clas = this.clas;
for (i=0;i<body.length-1;i++)
// be add ob it to result with head and joiner ya
if (clas === "Phrase"){
var bodyR =  body[i].toLocaleString(language,format,type,
conjLevel);
result += bodyR.replace(/ $/,joiner)+headS+phraseJoiner;}
else
result += body[i].toLocaleString(language,format,type,
conjLevel) 
+ joiner + headS + phraseJoiner;
// be add ob last element with joiner ya
result += body[i].toLocaleString(language,format,type,
conjLevel) ;
return result;
}


},{"../compile/parse":11,"../compile/tokenize":12,"./clause":1,"./phrase":3,"./quote":4,"./type":9,"./word":10}],3:[function(require,module,exports){
"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Clause = require("./clause");
var err = require("../lib/error");
module.exports = Phrase;
function Phrase(language, input, conjLevel ){
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Phrase error: language undefined";
    }
this.be = "Phrase";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "Phrase"){
if (input.subPhrase)
this.subPhrase = new
Phrase(language,input.subPhrase,undefined,conjLevel);
if (input.clause)
this.clause = new Clause(language,input.clause);
if (typeof input.body === "object"){
if (input.body.be === "Type")
this.body = new Type(language, input.body, partOfSpeech);
else if (input.body.be === "Junction"){
var Junction = require("./junction");
this.body = new Junction(language,input.body,partOfSpeech);}
}
else  this.body = input.body;
this.head = new Word(language, input.head);
return this;
}
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);
// phrase parsing algorithm de
// be get ob phrase do
// if clauseInitial then get phrase from end ya else
// if clauseFinal then get phrase from begining ya
// be get ob case word do
// if postpositional then last word is head case 
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
// and first word is tail ya else
// if prepositional then first word is head case 
// and last word is tail ya
// if tail word is junction then return junction ya
// be get ob genitive sub phrase do
// if genitive found then get and set genitive phrase ya
// if genitive initial then get last sub phrase word ya else
// if genitive final then get first sub phrase word ya
// be get ob adjacent clause do
// set output do
// body and limb from other tokens

var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var postpositional = wordOrder.postpositional;
var thePhrase;

// be get ob phrase do
// if clauseInitial get phrase from end
if (wordOrder.clauseInitial)
thePhrase = parse.lastPhrase(grammar,tokens);
// if clauseFinal get phrase from begining
else thePhrase = parse.firstPhrase(grammar,tokens);

// be get ob case word do
var caseWordI = null;
var caseWordsN = 1;
var tailIndex = null;
var otherTokens = new Array();
// if postpositional then last word is head case 
// yand first word is tail ya else

if (postpositional){
caseWordI = thePhrase.length-1;
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
if (thePhrase[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.phraseWords,thePhrase[caseWordI-1])){
caseWordI--;
caseWordsN++;}
tailIndex = 0;
otherTokens = thePhrase.slice(0,caseWordI);
}
// if prepositional then first word is head case 
// and last word is tail ya
else if (postpositional === false){
caseWordI = 0;
if (thePhrase[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.phraseWords,thePhrase[caseWordI+1])){
caseWordsN++;}
tailIndex = thePhrase.length-1;
otherTokens = thePhrase.slice(caseWordI+caseWordsN);
}

// if tail word is junction then return junction ya
var tail = thePhrase[tailIndex];
var Junction = require("./junction");
if (parse.wordMatch(grammar.junctions,tail)){
return new Junction(language,tokens,partOfSpeech);
}

// be get ob adjacent clause do
var clauseI = 
parse.adjacentClauseIndex(language.grammar, otherTokens);
if (clauseI){ 
var start = clauseI[0];
var end = clauseI[1];
var clauseOtherTokens = otherTokens.slice(0);
clauseOtherTokens.splice(start,end-start);
}

// be get ob genitive sub phrase do
// if genitive found then get and set genitive phrase ya
var genitiveTokens, genitiveI, genitiveOtherTokens;
var genitiveWordI = -1;
// if genitive initial then get last sub phrase ya else
if (wordOrder.genitiveInitial){
genitiveWordI = 
parse.lastSubPhraseWordIndex(grammar,otherTokens);
if (genitiveWordI !== -1){
genitiveTokens = otherTokens.slice(0,genitiveWordI+1);
genitiveI = parse.lastPhraseIndex(grammar,genitiveTokens);
var start = genitiveI[0];
var end = genitiveI[1];
genitiveOtherTokens = otherTokens.slice(0);
genitiveOtherTokens.splice(start,end-start);
}}
// if genitive final then get first sub phrase ya
else if (wordOrder.genitiveInitial === false){
genitiveWordI = 
parse.firstSubPhraseWordIndex(grammar,otherTokens);
if (genitiveWordI !== -1){
genitiveTokens = otherTokens.slice(genitiveWordI);
genitiveI = parse.firstPhraseIndex(grammar,genitiveTokens);
var start = genitiveI[0]+genitiveWordI;
var end = genitiveI[1]+genitiveWordI;
genitiveI = [start,end];
genitiveOtherTokens = otherTokens.slice(0);
genitiveOtherTokens.splice(start,end-start);
}}

// set output ya

// set the closest of either clause or genitive ya
// if genitiveInitial and clauseInitial then set the greater ya
// else if genitiveFinal and clauseFinal then set the lesser ya
// else be set ob both if available ya

function clauseSet(){
if (clauseI && clauseI.length > 0){
var cTokens = otherTokens.slice(clauseI[0],clauseI[1]);
return  new Clause(language, cTokens );
}}
function
genitiveSet(language,genitiveI,otherTokens,conjLevel){
if (genitiveI){
var gTokens = otherTokens.slice(genitiveI[0],genitiveI[1]);
return new Phrase(language, gTokens,conjLevel);
}}

// if genitiveInitial and clauseInitial then set the greater ya

if (clauseI && genitiveI){
if (wordOrder.genitiveInitial && wordOrder.clauseInitial){
if (clauseI[1]>genitiveI[1]){
this.clause = clauseSet(); 
otherTokens=clauseOtherTokens;}
else {
this.subPhrase =
genitiveSet(language,genitiveI,otherTokens,conjLevel);
otherTokens=genitiveOtherTokens;}
}
// else if genitiveFinal and clauseFinal then set the lesser ya
else if (!wordOrder.genitiveInitial &&!wordOrder.clauseInitial){
if (clauseI[0]<genitiveI[0]) {
this.clause = clauseSet();
otherTokens=clauseOtherTokens;}
else {
this.subPhrase =
genitiveSet(language,otherTokens,genitiveI,conjLevel);
otherTokens=genitiveOtherTokens;}
}
}
// else be set ob both if available ya
else{ 
if (clauseI){
this.clause = clauseSet(clauseI,otherTokens); 
otherTokens = clauseOtherTokens;}
if (genitiveI){
this.subPhrase =
genitiveSet(language,genitiveI,otherTokens,conjLevel); 
otherTokens = genitiveOtherTokens;
}}


// identify body part of speech

var caseWord = new Word(language,
tokens.slice(caseWordI,caseWordI+caseWordsN), "adposition");
var partOfSpeech;
if (caseWord.head === "hi" 
|| caseWord.head.body && caseWord.head.body[0] === "hi")
partOfSpeech = "verb";
else partOfSpeech = "noun";
//if (partOfSpeech === "noun")

// body and limb from other tokens
if (otherTokens && otherTokens.length >0){
this.body = new Type(language,otherTokens,partOfSpeech);
}
this.head = caseWord;

return this;
}

function phraseInputToMatch(language,input,conjLevel){
	if (typeof input === "string"
		|| Array.isArray(input))
	return new Phrase(language, input, conjLevel);
	else if (typeof input === "object"
		&& input.be === "Phrase")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"Phrase");
}
Phrase.prototype.isSubset= function(language,input){
var match = phraseInputToMatch(language,input);
var result = true;
if(!match.body && this.body 
|| !match.head && this.head
|| !match.clause && this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSubset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSubset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSubset(language,match.clause))
result = false;
return result;
};
Phrase.prototype.isSuperset= function(language,input){
var match = phraseInputToMatch(language,input);
var result = true;
if(match.body && !this.body 
|| match.head && ! this.head
|| match.clause && !this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSuperset(language,match.clause))
result = false;
return result;
};
Phrase.prototype.isLike= function(language,input){
	var match = phraseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
Phrase.prototype.copy = function(language,conjLevel){
return new Phrase(language,
JSON.parse(JSON.stringify(this)),conjLevel);
}
Phrase.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	//console.log(this.body);
	return this.body.valueGet();
}
Phrase.prototype.toString = function(format){
var joiner = ' ';
var content,result;
var result = new String();
if (this.clause) result+= this.clause.toString()+ joiner;
if (this.subPhrase) result+= this.subPhrase.toString();
if (typeof this.body === "object")
content = this.body.toString();
else content = this.body;
if (Array.isArray(content) && content.length>1
&& tokenize.isTokens(content))
joiner = ' ';
if (content) result += content.toString() + joiner;
if (this.head) result += this.head.toString() +joiner;
return result;
};
Phrase.prototype.toLocaleString = 
function(language, format,type,conjLevel){
// algorithm


var conj = new Object();
if (conjLevel >= 3){
 conj = language.grammar.conjugation;

if (this.head && this.head.head){
if( conj.verbPhrase && this.head.head === "hi"){
return conj.verbPhrase(language,this,format,conjLevel);
}
else if( conj.subjectPhrase && this.head.head === "hu"){
return conj.subjectPhrase(language,this,format,conjLevel);
}
else if( conj.objectPhrase && this.head.head === "ha"){
return conj.objectPhrase(language,this,format,conjLevel);
}
else if( conj.dativePhrase && this.head.head === "ta"){
return conj.dativePhrase(language,this,format,conjLevel);
}
else if( conj.instrumentalPhrase && 
(this.head.head === "wu" || this.head.head === "mwa")){
return conj.instrumentalPhrase(language,this,format,conjLevel);
}
else if(conj.phrase)
return conj.phrase(language,this,format,conjLevel);
}
else if(conj.phrase)
return conj.phrase(language,this,format,conjLevel);
}

var joiner = " ";
if (format && format.joiner !== undefined) joiner = format.joiner;
if (conj && conj.format && conj.format.joiner !== undefined) {
var joiner = conj.format.joiner;}
var phraseJoiner = " ";
var clauseJoiner = " ";
var content;
var syntaxType = 'ch';
if (type) syntaxType=type;
var result = new String();
var clause = new String();
var subPhrase = new String();
if (this.clause)
clause = this.clause.toLocaleString(language, format, undefined,
conjLevel);
if (this.subPhrase)
subPhrase =
this.subPhrase.toLocaleString(language,format,'gh',conjLevel);
if (typeof this.body === "object" ){

if (this.head && 
(this.head.head === "hi" 
|| this.head.body && this.head.body[0] === "hi"))
content =
this.body.toLocaleString(language,format,"v",conjLevel);
else content = this.body.toLocaleString(language,format,"n",
conjLevel);
}
else if (this.body) content = this.body;
else content = '';
if (!/ $/.test(content)) content += joiner;
var caseWord = new String();
if (this.head && this.head.head === "hi")
caseWord = this.head.toLocaleString( language,format,"vh",
conjLevel);
else if (this.head ) 
caseWord = this.head.toLocaleString( language,format
,"ch", conjLevel);
var positionPhrase = content;
var wordOrder = language.grammar.wordOrder;


if (subPhrase.length > 0){
if (wordOrder.genitiveInitial)
positionPhrase = subPhrase + positionPhrase;
else if (wordOrder.genitiveInitial === false)
positionPhrase = positionPhrase +subPhrase;}

if ((!type && wordOrder.postpositional )
  || (type && wordOrder.genitiveInitial))
positionPhrase = positionPhrase+caseWord+phraseJoiner;
else if ((!type && wordOrder.postpositional === false)
       || (type && wordOrder.genitiveInitial === false))
positionPhrase = caseWord+joiner+positionPhrase;

if (clause.length > 0){
if (wordOrder.clauseInitial===true)
result = clause + clauseJoiner + positionPhrase;
else if (wordOrder.clauseInitial===false)
result = positionPhrase + clause;}
else result = positionPhrase;
return(result);
};

},{"../compile/parse":11,"../compile/tokenize":12,"../lib/error":17,"./clause":1,"./junction":2,"./quote":4,"./type":9,"./word":10}],4:[function(require,module,exports){
var tokenize = require("../compile/tokenize");
var err = require("../lib/error");

//var parse = require("../compile/parse");
function Quote(input) {
    console.log("Quote");
    "use strict";
    this.be = "Quote";
    var tokens;
    if (typeof input === "string") {
        tokens = tokenize.stringToWords(input);
    } else if (Array.isArray(input)) { tokens = input;
        } else if (typeof input === "object" &&
                input.be === "Quote") {
        tokens[0] = input.content;
        tokens[1] = input.quoteWord;
    } else { throw new TypeError(JSON.stringify(input) +
            " not valid for " + this.be); }
    // assume single word quote
    this.content = tokens[0];
    this.quoteWord = tokens[1];
    return this;
}
function quoteInputToMatch(input) {
    "use strict";
    var result = Object.create(null);
    if (typeof input === "string" ||
            Array.isArray(input)) {
        result = new Quote(input);
    } else if (input.be === "Quote") {
        result = input;
    } else { 
        var error = new TypeError(input + " not valid match"); 
        throw error.stack;
    }
    return result;
}
module.exports = Quote;
Quote.prototype.isSuperset = function (input) {
    "use strict";
    var match = quoteInputToMatch(input);
    // if match is undefined then is subset
    if (match.content !== undefined &&
            !match.content.equals(this.content)) {
        return false;
    }
    if (match.quoteWord !== undefined &&
            !match.quoteWord.equals(this.quoteWord)) {
        return false;
    }
    return true;
};
Quote.prototype.isSubset = function (input) {
    "use strict";
    return this.equals(input);
};
Quote.prototype.isLike = function (input) {
    "use strict";
    return this.equals(input);
};
Quote.prototype.equals = function (input) {
    "use strict";
    var match = quoteInputToMatch(input);
    if (match.content === this.content &&
            match.quoteWord === this.quoteWord) {
        return true;
    }
    return false;
};
Quote.prototype.valueGet = function () {
    "use strict";
    return this.content;
};
Quote.prototype.toString = function () {
    "use strict";
    return String(this.content + " " + this.quoteWord);
};

},{"../compile/tokenize":12,"../lib/error":17}],5:[function(require,module,exports){
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var translate = require("../compile/translate");
var Word = require("./word");
var Phrase = require("./phrase");
var Junction = require("./junction");
var TopClause = require("./topClause");
var err = require("../lib/error");
/// su sentence be object ya
function Sentence(language, input, conjLevel) {
    "use strict";
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Sentence error: language undefined";
    }
    this.be = "Sentence";
    var tokens, i, error;
    if (typeof input === "string") {
        tokens = tokenize.stringToWords(input);
    } else if (typeof input === "object" &&
            input.be === "Sentence") {
        this.phrases = [];
        for (i = 0; i < input.phrases.length; i = i + 1) {
            if (input.phrases[i].be === "Phrase") {
                this.phrases[i] = new Phrase(language,
                    input.phrases[i], conjLevel);
            } else if (input.phrases[i].be === "Junction") {
                this.phrases[i] = new Junction(language,
                    input.phrases[i]);
            } else if (input.phrases[i].be === "TopClause") {
                this.phrases[i] = new TopClause(language,
                    input.phrases[i]);
            }
        }
        if (input.head) {
            this.head = new Word(language, input.head);
        }
        if (input.mood !== undefined) {
            this.mood = new Word(language, input.mood);
        }
        if (input.nominal !== undefined) {
            this.nominal = input.nominal;
        }
        return this;
    }
    else if (Array.isArray(input)) {
        tokens = input;
    } else {
        error = new TypeError(input +
            " is not a valid Phrase input");
        console.log(error.stack);
        throw error;
    }

// algorithm de
//
// if conjLevel set then disconjugate ya
// be extract ob quotes ya
// be get ob last case word index ya
// be get ob last word or mood word of sentence ya
// if postpositional then ob last words of sentence at end ya
// if prepositional then ob last words of sentence at start ya
// be get ob each phrase or top clause ya
// if clause initial then be get via last ya
// if clause final then be get via first ya
// if intransitive and intransitiveWord set
// then adjust accordingly ya
// be set ob many part of this ya
// if conjLevel set then disjugate ya
    if (conjLevel) {
    var string = tokens.join(" ");
    //var disjug =
    //translate.disjugate(language,string,conjLevel);
    //tokens = tokenize.stringToWords(disjug);
    }
// extract quotes
    tokens = parse.quotesExtract(language,tokens);
//if (!tokenize.isTokens(tokens))
//    throw new TypeError("su Phrase be need bo tokens ya");
    //this.string = tokens.join("");
    //this.tokens = tokens;


    var grammar = language.grammar;
    var wordOrder = grammar.wordOrder;
    // get last case word index
    var lastCaseIndex =parse.lastCaseIndex(grammar,tokens);
    var lastTopClauseIndex =
    parse.lastTopClauseWordIndex(grammar,tokens);
    if (lastTopClauseIndex === -1) lastTopClauseIndex = -1;
    var lastAnyCaseI =
    Math.max(lastTopClauseIndex,lastCaseIndex);
    if (lastCaseIndex === -1) parse.phraseError(grammar,tokens);
    lastCaseIndex++;
    lastAnyCaseI++;
    var lastWord,
        otherTokens,
        mood;       
// be get ob last word or mood word of sentence ya
// if postpositional then last words of sentence at end ya
    if (wordOrder.postpositional) {
        var lastWordStart = parse.lastSentenceWordIndex(grammar,
            tokens);
        if (lastWordStart == -1) {
            lastWordStart = tokens.length;
        }
        if (lastWord!==-1) {
            lastWord = tokens.slice(lastWordStart,
                lastWordStart + 1);
            if (lastWordStart > lastAnyCaseI) {
                mood = tokens.slice(lastAnyCaseI,lastWordStart);
            }
        }
        otherTokens = tokens.slice(0,lastAnyCaseI);
    } else {
// if prepositional then ob last words of sentence at start ya
        var firstCaseIndex =parse.firstCaseIndex(grammar,tokens);
        var firstTopClauseIndex =
        parse.firstTopClauseWordIndex(grammar,tokens);
        if (firstTopClauseIndex === -1)
        firstTopClauseIndex = tokens.length;
        var firstAnyCaseI =
        Math.min(firstTopClauseIndex,firstCaseIndex);
        var lastWordI =
        parse.lastSentenceWordIndex(grammar,tokens);
        if (lastWordI !== -1)
        lastWord = tokens[lastWordI];
        if (firstCaseIndex !== 0)
        mood = tokens.slice(0,firstAnyCaseI);
        otherTokens = tokens.slice(firstAnyCaseI,
                tokens.length);
    }

// be get ob each phrase or top clause ya
    var previousLength = 0;
    var phrases = [];
    var thePhraseI, thePhrase, phrase,
    theTopClauseI, theClause, topClause;
    while (otherTokens.length>0 &&
            otherTokens.length != previousLength) {
// avoid infinite loops from starter garbage
    previousLength = otherTokens.length;

// if clause initial then get via last phrases ya
    if (wordOrder.clauseInitial===true) {
    thePhraseI= parse.lastJunctionPhraseIndex(grammar, otherTokens);
    if (Array.isArray(otherTokens))
    theTopClauseI = parse.topClauseIndex(grammar, otherTokens);
    thePhrase= otherTokens.slice(thePhraseI[0],thePhraseI[1]);
    if (theTopClauseI && theTopClauseI[1]>thePhraseI[1]) {
    theClause= otherTokens.slice(theTopClauseI[0],theTopClauseI[1]);
    topClause = new TopClause(language, theClause);
    phrases.unshift(topClause);
    otherTokens.splice(theTopClauseI[0],
    theTopClauseI[1]-theTopClauseI[0]);
    }
    else if (thePhrase.length === 0) break;
    else {
    phrase =  new Phrase(language, thePhrase);
    phrases.unshift(phrase);
    otherTokens.splice(thePhraseI[0],
    thePhraseI[1]-thePhraseI[0]); }
    } // be end of if for clause initial ya
   
    // if clause final then get via first phrases ya
    else if (wordOrder.clauseInitial===false) {
    if (parse.firstCaseIndex(grammar,otherTokens) === -1) break;
    thePhraseI =
    parse.firstJunctionPhraseIndex(grammar, otherTokens);
    theTopClauseI = parse.topClauseIndex(grammar, otherTokens);
    var length = otherTokens.length;
    if (thePhraseI[0] === -1) thePhraseI[0]= length;
    if (theTopClauseI[0] === -1) theTopClauseI[0]= length;
    if (theTopClauseI && theTopClauseI[0]<thePhraseI[0]) {
    theClause= otherTokens.slice(theTopClauseI[0],theTopClauseI[1]);
    topClause = new TopClause(language, theClause);
    phrases.push(topClause);
    otherTokens.splice(theTopClauseI[0],
    theTopClauseI[1]-theTopClauseI[0]);
    }
    else if (thePhraseI[0]===length) break;
    else {
    thePhrase = otherTokens.slice(thePhraseI[0],thePhraseI[1]);
    phrase = new Phrase(language, thePhrase);
    phrases.push(phrase);
    otherTokens.splice(thePhraseI[0],
    thePhraseI[1]-thePhraseI[0]); }
    } // be end of else if for clause final ya
    } // be end of while loop  for phrase or top clause get ya
   
    // if intransitive and intransitiveWord set
    // then adjust accordingly ya
    // intransitives have 2 phrases, one of which is a verb ya
    var intransitiveWord = wordOrder.intransitiveWord;
    if (phrases.length === 2 && intransitiveWord)
    if (phrases[1].head.head === "hi" &&
            phrases[0].head.head === intransitiveWord)
        phrases[0].head.head = "hu";
    else if (phrases[0].head.head === "hi" &&
            phrases[1].head.head === intransitiveWord)
    phrases[1].head.head = "hu";
   
    // be set ob many part of this ya
    this.phrases = phrases;
    if (mood && mood.length>0)
    this.mood = new Word(language,mood);
    if (lastWord && lastWord.length>0)
    this.head = new Word(language,lastWord);
   
    var verbIndex = this.phrases.find(function(phrase) {
    var result = false;
    if (phrase.be === "TopClause" || phrase.head.head === "hi" &&
            phrase.body && phrase.body.body ||
            phrase.head.head === "fa" && phrase.head.body &&
            phrase.head.body.head === "hi" &&
            phrase.head.body.body && phrase.head.body.body.body)
        result= true;
        return result;
    });
    if (verbIndex === null) {
    this.nominal = true;}
   
    return this;
}// su sentence be end of constructor function ya



exports.sentenceInputToMatch = sentenceInputToMatch;
function sentenceInputToMatch(language, input) {
    if (typeof input === "string"||
        Array.isArray(input))
         return new Sentence(language, input);
    else if (input && input.be === "Sentence")
        return input;
    else throw new TypeError(input+" not valid match for "+"Sentence");
}
Sentence.prototype.isSubset = function(language,input) {
    var match = sentenceInputToMatch(language,input);
    if (this.head && !this.head.isSubset(match.head))
        return false;
    // check phrases are a subset
    var thisPhrases = this.phrases;
    var matchPhrases = match.phrases;
    var result = thisPhrases.every(function(thisPhrase) {
        if (!matchPhrases.some(function(phrase) {
            return thisPhrase.isSubset(language,phrase);}))
            return false;
        return true;
    });
    return result;
};
Sentence.prototype.isSuperset= function(language,input) {
var match = sentenceInputToMatch(language,input);
if (this.head && !this.head.isSuperset(match.head))
    return false;
// check phrases are a subset
var thisPhrases = this.phrases;
var matchPhrases = match.phrases;
var result = matchPhrases.every(function(matchPhrase) {
 if (!thisPhrases.some(function(phrase) {
  return phrase.isSuperset(language,matchPhrase);
 })) return false;
 else return true;
});
return result;
};
Sentence.prototype.isLike = function(language,input) {
var match = sentenceInputToMatch(language,input);
if (this.isSuperset(language,match) ||
        this.isSubset(language,match)) return true;
return false;
};
Sentence.prototype.equals = function(language,input) {
var match = sentenceInputToMatch(language,input);
if (this.isSuperset(language,match) &&
        this.isSubset(language,match)) return true;
    return false;
};


Sentence.prototype.indexOf = phraseIndexFind;
Sentence.prototype.phraseIndexFind = phraseIndexFind;
function phraseIndexFind(language,cases) {
var caseWord = cases;
var i, phrase,
phrases = this.phrases,
length = phrases.length;
var result = -1;

for (i=0;i<length;i++) {
phrase = phrases[i];
if(phrase.be === "Junction" &&
        phrase.body[0].head.isLike(language,caseWord) ||
        phrase.head.isLike(language,caseWord)) {
    result = i; break; }
}
return result;

}
/// su phraseGet be get bo phrase by cases ya

Sentence.prototype.phraseGet = phraseGet;
function phraseGet(language, input) {
    if (typeof input === "number")
        return this.byIndexPhraseGet(input);
    if (typeof input === "string" || Array.isArray(input))
        return this.phraseFindGet(language,input);
    // else
    throw new TypeError(JSON.stringify(input) +
        " not valid match for "+"phraseGet");
}
Sentence.prototype.phraseFindGet = phraseFindGet;
function phraseFindGet(language,cases) {
    var index = this.indexOf(language,cases);
    if (index === -1)
        return undefined;
    //    throw new RangeError(cases +" not found in "+this);
    return this.byIndexPhraseGet(index);
}
Sentence.prototype.byIndexPhraseGet = byIndexPhraseGet;
function byIndexPhraseGet(index) {
    err.indexCheck(this.phrases.length,index);
    return this.phrases[index];
}
///
Sentence.prototype.phraseFindDel = phraseFindDelete;
Sentence.prototype.phraseFindDelete = phraseFindDelete;
function phraseFindDelete(language,cases) {
    var index = this.indexOf(language,cases);
    if (index === -1) /// if none
        return this;/// return itself
    return this.byIndexPhraseDelete(index);
}
Sentence.prototype.byIndexPhraseDelete = byIndexPhraseDelete;
function byIndexPhraseDelete(index) {
    err.indexCheck(this.phrases.length,index);
    // remove phrase from array.
    var sentence = this;
    sentence.phrases.splice(index,1);
    return sentence;
}
Sentence.prototype.phraseDelete = phraseDelete;
Sentence.prototype.phraseDel = phraseDelete;
function phraseDelete(language, input) {
    if (typeof input === "number")
        return this.byIndexPhraseDelete(input);
    if (typeof input === "string" ||
            Array.isArray(input))
        return this.phraseFindDelete(language, input);
    // else
    throw new TypeError("unsupported type:"+input);
}
Sentence.prototype.phraseSet = function(input, replacement) {
    if (typeof input === "number")
        return this.byIndexPhraseSet(input,replacement);
    if (typeof input === "string" ||
            Array.isArray(input))
        return this.phraseFindSet(input,replacement);
    // else
    throw new TypeError("unsupported type:"+input+" "+replacement);
};
Sentence.prototype.phraseFindSet = function(match,replacement) {
    var index = this.indexOf(match);
    return this.byIndexPhraseSet(index,replacement);
};
Sentence.prototype.byIndexPhraseSet = function(index,replacement) {
    err.indexCheck(this.phrases.length,index);
    var phrase;
    if (typeof replacement === "string" ||
            Array.isArray(replacement))
        phrase = new Phrase(language, replacement);
    else if (replacement.be === "Phrase")
        phrase = replacement;
    else throw new TypeError("unrecognized type");
    // remove phrase from array.
    var sentence = this;
    sentence.phrases.splice(index,1,phrase);
    return sentence;
};
Sentence.prototype.copy = function(language) {
return new Sentence(language, JSON.parse(JSON.stringify(this)));
};
Sentence.prototype.toString = function(format) {
    var joiner = ' ';
    var mood = this.mood;
    var endWords = this.head;
    var ender = '';
    //if (tokenize.isTokens(endWords)) {
    //    joiner = "";
    //    ender = '\n'
    //}
    var result = "";
    var phrases = this.phrases;
    var phrasesLength = phrases.length;
    var i;
    for (i=0; i<phrasesLength; i++)
       
result += simpleClauseTermMaybeAdd(format,phrases[i],i);
    if (mood)
    result += mood.toString()+joiner;
    if (endWords)
    result += endWords.toString();
    result += ender;
    return result;
};


Sentence.prototype.toLocaleString =
function(language,format,type,conjLevel) {
// be convert bo sentence to language with format de
// algorithm:
// be set ob joiner and ender from format ya
// be set ob empty string for translation result ya
// be clone ob this sentence to working sentence ya
//
// if intransitive and intransitiveWord set then adjust
// accordingly ya
//
// if prepositional then translate mood and prepend to result
//
// be wh front ob the types with interrogative pronoun ya
//
// su performance grammar output ob langugage and working
// sentence to tuple of output and remainder ya
//
// su phrase order output
// be start of loop for each phrase in language phrase order de
// be get ob phrase from working sentence ya
// if found then
// be may add ob clause term to phrase translation ya
// if su prevTopClause boolean be set and su this be phrase
//    then be prepend ob clauseTerm to result ya
// if be top clause then be set ob prevTopClause boolean ya
// else if be phrase then be unset ob prevTopClause boolean ya
// be append ob it to result ya and
// be delete ob phrase from sentence ya
// be end of loop ya
//
// be loop for each phrase in working sentence de
// if head initial
// be append ob phrase translation to result ya
// if head final
// be prepend
//
// if postpositional then translate mood and append to result
//
// be translate ob end words ya
// be append to result ya
// be append ob ender ya
// if conjugation level set then be conjugate  ya
// return result ya
//


// be set bo joiner and ender from format ya
    var joiner = ' ';
if (format && format.joiner!==undefined) joiner = format.joiner;
var ender = '';
//var newline = '\n';
//if (newline && format.newline) newline = format.newline;
// be set bo empty string for translation result ya
    var result = "";
// be clone bo this sentence to working sentence ya
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var topClauseTerm =
new Word(language, grammar.topClauseTerminator[0]);
var conj = {};

if (conjLevel >= 3) conj = language.grammar.conjugation;
// if cant find verb, then is nominal sentence
if (conj.nominal) {
if (this.nominal)
return conj.nominal(language,this,format,type,conjLevel);
}
if (conj.sentence)
return conj.sentence(language,this,format,type,conjLevel);

var verbPhrase = "";
if (conj.verbAgreement) {
verbPhrase =
conj.verbAgreement(language,this,format,type,conjLevel);
}

if (conj && conj.format && conj.format.joiner !== undefined) {
joiner = conj.format.joiner;}

var sentence = this.copy(language);

var mood = this.mood;
var moodPhrase = "";
if (mood)
moodPhrase =
mood.toLocaleString(language,format,"mh",conjLevel);
//if (conj.mood) moodPhrase = conj.mood(moodPhrase);

var phraseJoiner = "";
if (conj.phraseJoiner) phraseJoiner = conj.phraseJoiner;

var prevTopClause = false;
var nextTopClause = false;

// if intransitive and intransitiveWord set then adjust
// accordingly ya
var phrases = sentence.phrases;
if (phrases.length === 2 && wordOrder.intransitiveWord)
if (phrases[1].head.head === "hi" &&
        phrases[0].head.head === "hu")
    phrases[0].head.head = wordOrder.intransitiveWord;
else if (phrases[0].head.head === "hi" &&
        phrases[1].head.head === "hu")
phrases[1].head.head = wordOrder.intransitiveWord;


//

var pendingPrepends = false;

// be vocative front ya
var vocativePair = vocativeFront(language,sentence);
var vocativeArray = vocativePair[0];
sentence = vocativePair[1];
if (vocativeArray.length > 0) pendingPrepends = true;

// be topClause extract ya
var topClausePair = topClauseFront(language,sentence);
var topClauseArray = topClausePair[0];
sentence = topClausePair[1];
if (topClauseArray.length > 0) pendingPrepends = true;

// be topic front
var topicPair = topicFront(language,sentence);
var topicArray = topicPair[0];
sentence = topicPair[1];
if (topicArray.length > 0) pendingPrepends = true;


// if subject prominent then subject front ya
if (wordOrder.subjectProminent===true) {
var subjectPair = subjectFront(language,sentence);
var subjectArray = subjectPair[0];
sentence = subjectPair[1];
if (subjectArray.length > 0) pendingPrepends = true;
}

// be wh front ob the types with interrogative pronoun ya
var whPair = whFront(language,sentence);
var whArray = whPair[0];
sentence = whPair[1];
if (whArray.length > 0) pendingPrepends = true;


var headFinal = wordOrder.headFinal;

// be start of loop for each phrase in language phrase order de
var phraseOrder = wordOrder.phraseOrder;
var phraseOrderLength = phraseOrder.length;
phrases = sentence.phrases;
var i;
var phraseIndex = -1;
prevTopClause = false;
var phraseTrans = "";

for (i=0; i<phraseOrderLength; i++) {
// be get bo phrase from working sentence ya
phraseIndex = sentence.indexOf(language,phraseOrder[i]);
if (phraseOrder[i]===grammar.verbWord && verbPhrase.length > 0)
phraseTrans = verbPhrase;
else {
// if found then
if (phraseIndex !== -1) {
// be may add ob clause term to phrase translation ya
var phrase = phrases[phraseIndex];
phraseTrans =
clauseTermMaybeAdd(language,phrase, format,type, conjLevel,
result.length, sentence.phrases, pendingPrepends);
if (wordOrder.postpositional === false) {
// if su prevTopClause boolean be set and su this be phrase
//    then be prepend ob clauseTerm to result ya
if (prevTopClause && phrase.be === "Phrase")
phraseTrans = topClauseTerm.toLocaleString(language, format, "jh",
conjLevel)+ joiner + phraseTrans;
// if be top clause then be set ob prevTopClause boolean ya
if ( phrase.be === "TopClause") {
prevTopClause = true;
}
// else if  be phrase then be unset ob prevTopClause boolean ya
else if (phrase.be === "Phrase")
prevTopClause = false;}
}}

if (phraseTrans.length > 0) {
// be append ob it to result ya and
result +=  phraseTrans;
// be delete ob phrase from sentence ya
if (phraseIndex !== -1)
sentence.byIndexPhraseDelete(phraseIndex);
}
phraseTrans = "";
// be end of loop for phrase order ya
}


// su performance grammar output ob langugage and working
// sentence to tuple of output and remainder ya
var performancePair = performanceGrammar(sentence);
var resultTailArray = performancePair[0];
var resultTail = "";
var clauseInitial = wordOrder.clauseInitial;
// if clause final reverse order of result tail array
if(clauseInitial === false)
resultTailArray.reverse();

var isNotLast = true;
var wasVerb = false;
for(i=0;i<resultTailArray.length;i++) {
if (i === resultTailArray.length-1) isNotLast = false;
var phrase = resultTailArray[i];
resultTail+=
clauseTermMaybeAdd(language,phrase,format,type,conjLevel,
result.length, sentence.phrases, pendingPrepends, isNotLast);
if (wasVerb && isNotLast) resultTail += phraseJoiner;
if (phrase.head.head === "hi") { wasVerb = true; }


}

sentence = performancePair[1];



//
// be loop for each phrase in working sentence de
var phrasesLength = phrases.length;
for (i=0; i<phrasesLength; i++) {
// if head initial
// be append bo phrase translation to result ya
if (headFinal === false) {
result +=
phrases[i].toLocaleString(language,format,type,
conjLevel);}
// if head final
// be prepend
else if (headFinal) {
result = phrases[i].toLocaleString(language,format,type,
conjLevel) +result;}
}
if (clauseInitial)
result = resultTail + result;
else if (clauseInitial === false)
result += resultTail;
//



// prepend subject
if (subjectArray && subjectArray.length>0) {
for (i = 0; i<subjectArray.length; i++) {
if (topicArray.length >0 || vocativeArray.length > 0 ||
        whArray.length || subjectArray.length -i > 1) {
    pendingPrepends = true;
} else {
    pendingPrepends = false;
}
var subject =
clauseTermMaybeAdd(language,subjectArray[i],format,type,
conjLevel,result.length, sentence.phrases, pendingPrepends);
if(conj.subject) subject = conj.subject(subject);
result = subject + result;
}
}

// prepend wh
if (whArray.length>0) {
for (i = 0; i<whArray.length; i++) {
if (topicArray.length >0 || vocativeArray.length > 0 ||
        whArray.length-i > 1)
pendingPrepends = true;
else pendingPrepends = false;
result =
clauseTermMaybeAdd(language,whArray[i],format,type, conjLevel,
result.length, sentence.phrases, pendingPrepends, true) + result;}
}

// prepend topic  if topicInitial
if (topicArray.length>0 && wordOrder.topicInitial !== false) {
for (i = 0; i<topicArray.length; i++) {
if (vocativeArray.length > 0 || (topicArray.length-i) > 1)
pendingPrepends = true; else pendingPrepends = false;
result =
clauseTermMaybeAdd(language,topicArray[i],format,type,
conjLevel, result.length, sentence.phrases,
pendingPrepends, true) + result;}
}
// append topic if topicFinal
if (topicArray.length>0 && wordOrder.topicInitial === false) {
for (i = 0; i<topicArray.length; i++) {
result += topicArray[i].toLocaleString(language,format,
type, conjLevel);
}
}

if (topClauseArray.length>0 ) {
var len = topClauseArray.length;
for (i = 0; i<len; i++) {
if (wordOrder.clauseInitial)
result = topClauseArray[len-(i+1)].toLocaleString(language,format,
type, conjLevel) + result;
else if (wordOrder.clauseInitial === false)
result += topClauseArray[i].toLocaleString(language,format,
type, conjLevel);
}
}

// prepend vocative
if (vocativeArray.length>0) {
for (i = 0; i<vocativeArray.length; i++) {
if ( vocativeArray.length-i > 1)
pendingPrepends = true;
else pendingPrepends = false;
result = clauseTermMaybeAdd(language,vocativeArray[i],format,type,
conjLevel, result.length, sentence.phrases, pendingPrepends, true) + result;}
}


// if postpositional then translate mood and append to result
if (mood && wordOrder.postpositional === true)
result+=moodPhrase+joiner;
// be translate bo end words ya
    if (this.head) {
var endWords = this.head.
toLocaleString(language,format,"sh",conjLevel);
//if (conj.sentenceHead) endWords = conj.sentenceHead(endWords);

// be append to result ya
    result = result+endWords;
        //result.replace(/  $/,joiner)+endWords;
    }
// be append bo ender ya
    result += ender;

// if prepositional then translate mood and prepend to result
if (mood && wordOrder.postpositional === false)
result=moodPhrase+joiner+result;

// if conjugation level set then be conjugate  ya
if (conjLevel)
result = translate.conjugate(language,result,conjLevel);
// return result ya
    return result;
};

function clauseTermMaybeAdd(language, phrase,format, type,
conjLevel,
resultLength, phrases, pendingPrepends, isFinal) {
// if clauseInitial and phrase has clause and result non zero
// or pendingPrepends
// then prepend clauseTerm translation ya
// if clauseFinal and phrase has clause
//    and phrases length is non zero
// then append clauseTerm translation ya

var phrasesLength = phrases.length;
var phraseTrans =
phrase.toLocaleString(language,format,type,
conjLevel);
var clause = phrase.clause;
var grammar = language.grammar;
var clauseInitial = grammar.wordOrder.clauseInitial;
var joiner = " ";

// if clauseInitial and phrase has clause and result non zero
// or pendingPrepends
if (clauseInitial && clause && ( pendingPrepends ||
        resultLength>0  && isFinal)) {
// then prepend clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return clauseTerm.toLocaleString(language,format,"lh",
conjLevel) +joiner+phraseTrans;}

// if clauseFinal and phrase has clause
//     and phrases length is non zero
else if ( clauseInitial===false && clause &&
        isFinal !== false && ((phrasesLength > 1) || isFinal &&
        resultLength > 0 ) ) {
// then append clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return phraseTrans+
clauseTerm.toLocaleString(language,format,"lh", conjLevel
)+joiner;}
return phraseTrans; }

function simpleClauseTermMaybeAdd(format, phrase, resultLength) {
// if phrase has clause and result non zero
// then prepend clauseTerm translation ya

var phraseTrans = phrase.toString(format);
// if phrase has clause and result non zero
var clause = phrase.clause;
if (clause && !clause.clauseTerm && resultLength > 0) {
var joiner = " ";
// then prepend clauseTerm translation ya
var clauseTerm = "tai"/* mwak clauseTerminator */ ;
return clauseTerm+joiner+phraseTrans;}
return phraseTrans; }



// su performance grammar output ob langugage and working
// sentence to tuple of output and remainder ya
//
// ideal? algorithm
// sort phrases by length comparison function
// get average by reduction
// for each that has length greater than average
// add to result tail and splice from phrases
// reverse tail if head initial
// output tuple
function performanceGrammar(sentence) {
// sort phrases by length comparison function
var phrases = sentence.phrases;
phrases.sort(function(first,second) {
return second.toString().length -
    first.toString().length ;
});
// get average by reduction
var avg = phrases.reduce(function(previous, current) {
var prev = previous.toString().split(" ").length;
var cur = current.toString().split(" ").length;
return prev+cur;
},0);
avg = (avg/phrases.length);
var basis = (avg*1.618*1).toFixed();
// for each that has length greater than basis
// add to result tail and splice from phrases
var i;
var tail = [];
for(i=0;i<phrases.length;i++) {
var phrase = phrases[i];
if( phrase.toString().split(" ").length > basis ||
        phrase.clause ) {
tail.push(phrases[i]);
phrases.splice(i,1);
i--;
}
}
// reverse tail if head initial
// output tuple
return [tail,sentence];
}
function simplePerformanceGrammar(sentence) {
//
// su simple algorithm de
// be identify ob first phrase with clause ya
// if found then
// be add ob it to tail yand
// remove it from sentences
// return tail and rest of sentences

// be identify ob first phrase with clause ya
var phrases = sentence.phrases;
var phrase = null;
var i;
var tail = "";
for (i=0;i<phrases.length;i++) {
// if found then
if (phrases[i].clause) {
// be add ob it to tail yand
tail = phrases[i];
// remove it from phrases
phrases.splice(i,1);
break;}
}
// return tail and rest of sentence
return [tail,sentence];
}

function whFront(language,sentence) {
// searches through phrases to see if any are headed by an
// interrogative pronoun, if so then add it to wh array
// and drop from sentence ya
// return pair consisting of wh array and sentence ya
function whCheck(phrase) {
if (phrase.body && phrase.body.head &&
    phrase.body.head.head === "ma") return true;
else return false;
}
var phrases = sentence.phrases;
var whArray = phrases.filter(whCheck);
var otherPhrases =
phrases.filter(function(phrase) { return !whCheck(phrase); });
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [whArray,newSentence];
}

function topicFront(language,sentence) {
// searches through phrases to see if any are headed by an
// topic case, if so then add it to topic array
// and drop from sentence ya
// return pair consisting of topic array and sentence ya
function topicMatch(language,phrase) {
if (phrase.head && phrase.head.head &&
        phrase.head.head === "fa")
if (clauseContains(phrase))  return false;
else return true;
else return false;
}
var phrases = sentence.phrases;
var topicArray = phrases.filter(function(phrase) {
return topicMatch(language,phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !topicMatch(language,phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [topicArray,newSentence];
}

function vocativeFront(language,sentence) {
// searches through phrases to see if any are headed by an
// vocative case, if so then add it to vocative array
// and drop from sentence ya
// return pair consisting of vocative array and sentence ya
function vocativeMatch(language, phrase) {
if (phrase.head && phrase.head.head  &&
        (phrase.head.head === "sla" || phrase.head.body &&
        phrase.head.body[0] === "sla")) return true;
else return false;
}
var phrases = sentence.phrases;
var vocativeArray = phrases.filter(function(phrase) {
return vocativeMatch(language,phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !vocativeMatch(language,phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [vocativeArray,newSentence];
}


function subjectFront(language,sentence) {
// searches through phrases to see if any are headed by an
// subject case, if so then add it to subject array
// and drop from sentence ya
// return pair consisting of subject array and sentence ya
function subjectMatch(phrase) {
if (phrase.head && phrase.head.head  &&
    (phrase.head.head === "hu" || phrase.head.body &&
    phrase.head.body[0] === "hu")) return true;
else return false;
}
var phrases = sentence.phrases;
var subjectArray = phrases.filter(function(phrase) {
return subjectMatch(phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !subjectMatch(phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [subjectArray,newSentence];
}

function clauseContains(phrase) {
if (phrase.clause) return true;
return false;
}


function topClauseFront(language,sentence) {
// searches through phrases to see if any are headed by an
// topClause case, if so then add it to topClause array
// and drop from sentence ya
// return pair consisting of topClause array and sentence ya
function topClauseMatch(language,phrase) {
if (phrase && phrase.be === "TopClause") return true;
else return false;
}
var phrases = sentence.phrases;
var topClauseArray = phrases.filter(function(phrase) {
return topClauseMatch(language,phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !topClauseMatch(language,phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [topClauseArray,newSentence];
}
module.exports = Sentence;

},{"../compile/parse":11,"../compile/tokenize":12,"../compile/translate":13,"../lib/error":17,"./junction":2,"./phrase":3,"./topClause":8,"./word":10}],6:[function(require,module,exports){
"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Clause = require("./clause");
module.exports = SubType;
function SubType(language, input, conjLevel,partOfSpeech ){
this.be = "SubType";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "SubType"){
if (typeof input.body === "object"){
if (input.body.be === "Type")
this.body = new Type(language, input.body, partOfSpeech);
else if (input.body.be === "Junction"){
var Junction = require("./junction");
this.body = new Junction(language,input.body,partOfSpeech);}
}
else  this.body = input.body;
this.head = new Word(language, input.head);
return this;
}
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);

// phrase parsing algorithm de
// be get ob phrase do
// if clauseInitial then get subType from end ya else
// if clauseFinal then get subType from begining ya
// be get ob case word do
// if postpositional then last word is head case 
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
// and first word is tail ya else
// if prepositional then first word is head case 
// and last word is tail ya
// if tail word is junction then return junction ya
// be get ob genitive sub phrase do
// if genitive found then get and set genitive phrase ya
// if genitive initial then get last sub phrase word ya else
// if genitive final then get first sub phrase word ya
// be get ob adjacent clause do
// set output do
// body and limb from other tokens

var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var postpositional = wordOrder.postpositional;
var theSubType;

// be get ob phrase do
// if clauseInitial get phrase from end
if (wordOrder.clauseInitial)
theSubType = parse.lastSubType(grammar,tokens);
// if clauseFinal get phrase from begining
else theSubType = parse.firstSubType(grammar,tokens);

// be get ob case word do
var caseWordI = null;
var caseWordsN = 1;
var tailIndex = null;
var otherTokens = new Array();
// if postpositional then last word is head case 
// yand first word is tail ya else

if (postpositional){
caseWordI = theSubType.length-1;
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
if (theSubType[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.subTypeWords,theSubType[caseWordI-1])){
caseWordI--;
caseWordsN++;}
tailIndex = 0;
otherTokens = theSubType.slice(0,caseWordI);
}
// if prepositional then first word is head case 
// and last word is tail ya
else if (postpositional === false){
caseWordI = 0;
if (theSubType[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.subTypeWords,theSubType[caseWordI+1])){
caseWordsN++;}
tailIndex = theSubType.length-1;
otherTokens = theSubType.slice(caseWordI+caseWordsN);
}

console.log("T "+tokens+" TCWI "+tokens[caseWordI]);
var caseWord = new Word(language,tokens[caseWordI]);
console.log("CW "+caseWord);

// set output ya


if (otherTokens && otherTokens.length >0){
this.body = new Type(language,otherTokens,partOfSpeech);
}
this.head = caseWord;

return this;
}

function phraseInputToMatch(language,input,conjLevel){
	if (typeof input === "string"
		|| Array.isArray(input))
	return new SubType(language, input, conjLevel);
	else if (typeof input === "object"
		&& input.be === "SubType")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"SubType");
}
SubType.prototype.isSubset= function(language,input){
var match = phraseInputToMatch(language,input);
var result = true;
if(!match.body && this.body 
|| !match.head && this.head
|| !match.clause && this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSubset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSubset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSubset(language,match.clause))
result = false;
return result;
};
SubType.prototype.isSuperset= function(language,input){
var match = phraseInputToMatch(language,input);
var result = true;
if(match.body && !this.body 
|| match.head && ! this.head
|| match.clause && !this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSuperset(language,match.clause))
result = false;
return result;
};
SubType.prototype.isLike= function(language,input){
	var match = phraseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
SubType.prototype.copy = function(language,conjLevel){
return new SubType(language,
JSON.parse(JSON.stringify(this)),conjLevel);
}
SubType.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	//console.log(this.body);
	return this.body.valueGet();
}
SubType.prototype.toString = function(format){
var joiner = ' ';
var content,result;
var result = new String();
if (typeof this.body === "object")
content = this.body.toString();
else content = this.body;
if (Array.isArray(content) && content.length>1
&& tokenize.isTokens(content))
joiner = '';
if (content) result += content.toString() + joiner;
if (this.head) result += this.head.toString() +joiner;
return result;
};
SubType.prototype.toLocaleString = 
function(language, format,type,conjLevel){
// algorithm


var conj = new Object();
if (conjLevel >= 3){
 conj = language.grammar.conjugation;

if (this.head && this.head.head){
if( conj.verbSubType && this.head.head === "hi"){
return conj.verbSubType(language,this,format,conjLevel);
}
else if( conj.subjectSubType && this.head.head === "hu"){
return conj.subjectSubType(language,this,format,conjLevel);
}
else if( conj.objectSubType && this.head.head === "ha"){
return conj.objectSubType(language,this,format,conjLevel);
}
else if( conj.dativeSubType && this.head.head === "ta"){
return conj.dativeSubType(language,this,format,conjLevel);
}
else if( conj.instrumentalSubType && 
(this.head.head === "wu" || this.head.head === "mwa")){
return conj.instrumentalSubType(language,this,format,conjLevel);
}
else if(conj.phrase)
return conj.phrase(language,this,format,conjLevel);
}
else if(conj.phrase)
return conj.phrase(language,this,format,conjLevel);
}

var joiner = " ";
if (format && format.joiner !== undefined) joiner = format.joiner;
if (conj && conj.format && conj.format.joiner !== undefined) {
var joiner = conj.format.joiner;}
var phraseJoiner = " ";
var clauseJoiner = " ";
var content;
var syntaxType = 'ch';
if (type) syntaxType=type;
var result = new String();
var clause = new String();
var subSubType = new String();
if (this.clause)
clause = this.clause.toLocaleString(language, format, undefined,
conjLevel);
if (this.subSubType)
subSubType =
this.subSubType.toLocaleString(language,format,'gh',conjLevel);
if (typeof this.body === "object" ){

if (this.head && 
(this.head.head === "hi" 
|| this.head.body && this.head.body[0] === "hi"))
content =
this.body.toLocaleString(language,format,"v",conjLevel);
else content = this.body.toLocaleString(language,format,"n",
conjLevel);
}
else if (this.body) content = this.body;
else content = '';
if (content) content += joiner;
var caseWord = new String();
if (this.head && this.head.head === "hi")
caseWord = this.head.toLocaleString( language,format,"vh",
conjLevel);
else if (this.head ) 
caseWord = this.head.toLocaleString( language,format
,"ch", conjLevel);
var positionSubType = content;
var wordOrder = language.grammar.wordOrder;


if (subSubType.length > 0){
if (wordOrder.genitiveInitial)
positionSubType = subSubType + positionSubType;
else if (wordOrder.genitiveInitial === false)
positionSubType = positionSubType +subSubType;}

if ((!type && wordOrder.postpositional )
  || (type && wordOrder.genitiveInitial))
positionSubType = positionSubType+caseWord+phraseJoiner;
else if ((!type && wordOrder.postpositional === false)
       || (type && wordOrder.genitiveInitial === false))
positionSubType = caseWord+joiner+positionSubType;

if (clause.length > 0){
if (wordOrder.clauseInitial===true)
result = clause + clauseJoiner + positionSubType;
else if (wordOrder.clauseInitial===false)
result = positionSubType + clause;}
else result = positionSubType;
return(result);
};

},{"../compile/parse":11,"../compile/tokenize":12,"./clause":1,"./junction":2,"./quote":4,"./type":9,"./word":10}],7:[function(require,module,exports){

var tokenize = require("../compile/tokenize");
var hof = require("../lib/hof");
var parse = require("../compile/parse");
var Sentence = require ("./sentence");
var Word = require ("./word");
var err = require("../lib/error");
module.exports = Text;
/// su sentence be object ya
function Text(language, input, conjLevel) {
    if (language === undefined) {
        throw "Text error: language undefined";
    }

this.be = "Text";
var tokens, i;
if (typeof input === "string"){
	tokens = tokenize.stringToWords(input);
}
else if (Array.isArray(input)) tokens = input;
else if (typeof input === "object"
    && this.be === "Text"){
	// assume json object
	if (input.title)
	this.title = new Word(language, input.title);
	this.sentences = new Array();
	for (i=0; i< input.sentences.length; i++)
		this.sentences[i]=new Sentence(language,
input.sentences[i],conjLevel);
	return this;
}
else throw new TypeError(input+" is not a valid Phrase input");
// algorithm de
// be extract quotes from tokens ya
// be get ob all sentences from tokens into sentences array ya
//
// if su first sentence be have ob startWord in verb
// yand ob subject then  be set ob title from subject ya
//
// be get ob subordinate texts and splice then in ya
//


// be extract quotes from tokens ya
tokens = parse.quotesExtract(language,tokens);

// be get ob all sentences from tokens into sentences array ya
var otherTokens = tokens;
var previousLength = 0;
var sentences = new Array();
var sentenceIndex = 0;
var sentence, firstSentence;
var grammar = language.grammar;
while (otherTokens.length>0 
&& otherTokens.length != previousLength){
// avoid infinite loops from starter garbage
previousLength = otherTokens.length;
firstSentence = parse.firstSentence(grammar,otherTokens);
if (firstSentence.length === 0) break;
sentence  = 
new Sentence(language, firstSentence, conjLevel);
sentences[sentenceIndex] = sentence;
sentenceIndex++;
otherTokens = otherTokens
.slice(firstSentence.length,otherTokens.length);
}

// if su first sentence be have ob startWord in verb
// yand ob subject then  be set ob title from subject ya
var title = titleExtract(language,sentences);
if (title) this.title = title;

// be get ob subordinate texts and splice them in
sentences = subordinateTextSplice(language,sentences);

this.sentences = sentences;
return this;
}

function titleExtract(language, sentences){
var title = undefined;
// if su first sentence be have ob startWord in verb
// yand ob subject then  be set ob title from subject ya
var startWord = language.grammar.startWord;
var firstSentence = sentences[0];
var Language = require ("../lang/language");
var mwak = new Language();
var firstVerbPhrase = firstSentence.phraseGet(mwak,"hi");
var firstSubjectPhrase = firstSentence.phraseGet(mwak,"hu");
if (firstVerbPhrase 
&& firstVerbPhrase.body.head === startWord 
&& firstSubjectPhrase) title = firstSubjectPhrase.body.body;
return title;
}

// subordinate text Splice
function subordinateTextSplice(language, sentences /*array*/){
// algorithm de
// skip initial title sentence
// find subordinate text indexes from sentences
// if not found then return sentences ya
// slice out subordinte sentences
// find title if applicable
// be subordinateTextSplice on subordinte sentences ya
// create text object using result
// splice in subordinate text
// repeat till end of sentences
// return 

// algorithm de
// skip initial title sentence
var startIndex = 1;
while(true){
// find subordinate text indexes from sentences
var subTextSentencesI = subordinateTextIndexExtract(language
,sentences,startIndex);
// if not found then return sentences ya
if (! subTextSentencesI ) return sentences;
startIndex = subTextSentencesI[1] + 1;
// slice out subordinte sentences
var subTextSentences = sentences.slice(
subTextSentencesI[0],subTextSentencesI[1]);
// find title if applicable
var title = titleExtract(language,subTextSentences);
// be subordinateTextSplice on subordinte sentences ya
var subTextSentences= subordinateTextSplice(language,
subTextSentences);
// create text object using result
var subTextObject = new Object();
subTextObject.be = "Text";
if (title) subTextObject.title = title;
subTextObject.sentences = subTextSentences;
var subText = new Text(language,subTextObject);
// splice in subordinate text
sentences.splice(subTextSentencesI[0],subTextSentences.length,
subText);
// repeat till end of sentences
} // end of while loop
}

// subordinate texts extract
function
subordinateTextIndexExtract(language,sentences,startIndex){
// algorithm de 
// be find ob sentence with start word in head of verb phrase ya
// if not found then return undefined ya
// be set ob found sentence index as start ya
// be get ob verb phrase and subject phrase from sentence ya
// be find ob end sentence tha with same ob subject phrase 
// and ob end version of verb phrase ya
// if no end sentence found, assume is end of sentences
// be set ob end index ya
// be return start and end ya


var sentences = sentences.slice(startIndex);
// be find ob sentence with start word in head of verb phrase ya
var Language = require ("../lang/language");
var mwak = new Language();
var startSentenceI = 
rawSentenceFindGet(mwak,"tip hi",sentences);
// if not found then return undefined ya
if (startSentenceI === -1) return undefined;
// be set ob found sentence index as start ya
var start = startSentenceI;
// be get ob verb phrase and subject phrase from sentence ya
var startSentence = sentences[startSentenceI];
var verbPhrase = startSentence.phraseGet(mwak,"hi");
var subjectPhrase = startSentence.phraseGet(mwak,"hu");
if (subjectPhrase === undefined) subjectPhrase = new String();
// be find ob end sentence tha with same ob subject phrase 
// and ob end version of verb phrase ya
var endVerbPhrase = verbPhrase.copy(mwak);
endVerbPhrase.body.head = "kit";
var searchString = subjectPhrase.toString()
+" "+endVerbPhrase.toString();
endSentenceI = rawSentenceFindGet(mwak,searchString,sentences);
// if no end sentence found, assume is end of sentences
if (endSentenceI === -1) endSentenceI = sentences.length -1;
// be set ob end index ya
var end = endSentenceI +1;
// be return start and end ya
return [start+startIndex,end+startIndex];
}


// copy or clone text
Text.prototype.copy = function(language){
 	return new Text(language, JSON.parse(JSON.stringify(this)));
}
/// su sentenceGet be get bo sentence by index ya
Text.prototype.sentenceGet = sentenceGet;
function sentenceGet(input){
	if (typeof input === "number")
		return this.byIndexSentenceGet(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindGet(language,input);
	// else
	throw new TypeError("unsupported type:"+input);
}

Text.prototype.byIndexSentenceGet = byIndexSentenceGet;
function byIndexSentenceGet(index){
	err.indexCheck(this.sentences.length,index);
	return this.sentences[index];
}
function sentenceInputToMatch(language, input){
if (input === undefined) 
throw new TypeError("undefined input for "
+" sentenceInputToMatch of Text object");
if (typeof input === "string"|| Array.isArray(input))
return new Sentence(language,input);
else if (input.be === "Sentence")
return input;
else throw new TypeError("unsupported type:"+input
+"for  sentenceInputToMatch of Text object");
}
Text.prototype.indexOf = sentenceFindGet;
Text.prototype.sentenceFindGet = sentenceFindGet;
function sentenceFindGet(language,input){
return rawSentenceFindGet(language,input,this.sentences);
}

function rawSentenceFindGet(language,input,sentences){
var match =
sentenceInputToMatch(language,input);
// reverse iterate through sentences or rfind
// if isLike match, then return
var index = sentences.rfind(function(sentence){
return sentence.isLike(language,match)
});
if (index === null) index = -1;
return index; 
}

// select like in SQL returns all matches as array
Text.prototype.select = sentenceFindAllGet;
function sentenceFindAllGet(language,input){
	var match =
sentenceInputToMatch(language,input);
	// filter sentences with
	// if isLike match, then return
	var sentences = this.sentences.filter(
	  function(sentence){
		return sentence.isLike(language,match);
	   });
	var newText = new Text(language, sentences.join("\n"));
	return newText;
}
Text.prototype.sentenceDelete = function(input){
	if (typeof input === "number")
		return this.byIndexSentenceDelete(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindDelete(input);
	// else
	throw new TypeError("unsupported type:"+input);
}
Text.prototype.sentenceFindDelete = sentenceFindDelete;
function sentenceFindDelete(language,input){
	var match =
sentenceInputToMatch(language,input);
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(match)});
	return this.byIndexSentenceDelete(index);
}
Text.prototype.byIndexSentenceDelete = byIndexSentenceDelete;
function byIndexSentenceDelete (index){
	err.indexCheck(this.sentences.length,index);
	// remove phrase from array.
	var newText = this;//.copy();
	newText.sentences.splice(index,1);
	return newText;
}
Text.prototype.sentenceUpdate = function(language,input,replacement){
	if (typeof input === "number")
		return this.byIndexSentenceUpdate(language,input,replacement);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindUpdate(language,input,replacement);
	// else
	throw new TypeError("unsupported type:"+input+" "+replacement);
}
Text.prototype.sentenceFindUpdate = sentenceFindUpdate;
function
sentenceFindUpdate(language,input,replacement){
	var match =
sentenceInputToMatch(language,input);
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(language,match)});
	if (index === null){
		throw Error("no match found for "+input+
				"\n in "+this.title);
	}
	return this.byIndexSentenceUpdate(language, index,replacement);
}
Text.prototype.byIndexSentenceUpdate = byIndexSentenceUpdate;
function
byIndexSentenceUpdate(language,index,replacement){
err.indexCheck(this.sentences.length,index);
var sentence =
sentenceInputToMatch(language,replacement);
// remove phrase from array.
var newText = this;//.copy();
newText.sentences.splice(index,1,sentence);
return newText;
}
Text.prototype.toString = function(format){
var result = new String();
var newline = '\n';
var lineLength = 64;
if (format ){
if (format.newline) newline = format.newline;
if (format.lineLength) lineLength = format.lineLength;
}
var sentences = this.sentences;
var sentencesLength = sentences.length;
var i;
for (i=0; i<sentencesLength; i++)
result += sentences[i].toString(format)+newline; 
// format by max line length;
return result;//this.string;
};
Text.prototype.toLocaleString =
function(language,format,type,conjLevel){
var result = new String();
var newline = '\n';
var lineLength = 64;
var conj = new Object()
if (conjLevel >= 4) conj = language.grammar.conjugation;

if (format){
if(format.newline !== undefined) newline = format.newline;
if(format.glyphsTransform) lineLength = 0;
else if(format.lineLength) lineLength = format.lineLength;
}
var sentences = this.sentences;
var sentencesLength = sentences.length;
var i;
for (i=0; i<sentencesLength; i++){
var theSentence = sentences[i];
if (conj.text && (theSentence.be === "Text"))
result+= conj.text(language,theSentence,format,type,conjLevel);
else result+= theSentence.toLocaleString(language, format, type,
conjLevel)+newline;
}
// format for max line length
//result = "\t"+result; /* indent text */
if (lineLength>0) result = wordWrap(result,lineLength);

if(conjLevel >= 8){
if (conj.header) result = conj.header + result;
if (conj.footer) result = result + conj.footer;
}

return result;
};

function wordWrap( str, width, brk, cut ) {

brk = brk || '\n';
width = width || 64;
width --;
cut = cut || false;

if (!str) { return str; }

var regex = 
'.{1,' +width+ '}(?=\\s|$)' + 
(cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');

var strA=str.match(RegExp(regex, 'g'))
/* remove leading spaces */
strA = strA.map(function(str){return str.replace(/^ /,"")});
return strA.join( brk );
}

Text.prototype.insert = function(language,index,input){
// algorithm
// make sentence object from input
// if index out of bounds throw range error
// splice the sentence into this.sentences

// make sentence object from input
var sentence = sentenceInputToMatch(language, input);
// if index out of bounds throw range error
if (index > this.sentences.length)  RangeError(index 
+ " exceeds number of sentences in this Text object");
// splice the sentence into this.sentences
this.sentences.splice(index,0,sentence);
return this;
}



},{"../compile/parse":11,"../compile/tokenize":12,"../lang/language":16,"../lib/error":17,"../lib/hof":18,"./sentence":5,"./word":10}],8:[function(require,module,exports){
"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
//var Sentence = require("./sentence");
module.exports = TopClause;
var className = "TopClause";
function TopClause(language, input){
var Sentence = require("./sentence");
this.be = className;
var tokens;
if (typeof input === "string"){
	tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === className){
if (input.tail)
this.tail = new Word(language, input.tail);
this.body = new Sentence(language, input.body);
this.head = new Word(language, input.head);
return this; }
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);
var grammar = language.grammar;

// be algorithm de
// be get ob clause word ya
//
// if clause initial
// then be get ob clause word from end 
// then be set ob other tokens ya
// if su clauseTerminator be exist then be set ob it
// and be remove from otherTokens
//
// if clause final
// then be get ob clause word from start
// then be set ob other tokens ya
// if su clauseTerminator be exist then be set ob it
// and be remove from otherTokens
//
// be set this parts

// be get ob clause word ya
var clauseInitial = grammar.wordOrder.clauseInitial;
var topClauseInitial = grammar.wordOrder.topClauseInitial;
var clauseWord, otherTokens, clauseWordI, newSlice;
var clause;
// if clause initial 
if (clauseInitial && !topClauseInitial === false){
// then be get ob clause word from end 
// then be set ob other tokens ya
clauseWordI = parse.lastTopClauseWordIndex(grammar, tokens);
var nextSlice = tokens.slice(0,clauseWordI+1);
clause = parse.topClause(grammar,nextSlice);
clauseWord = clause[clauseWordI];
otherTokens = clause.slice(0,clauseWordI);
// if clauseTerminator exists set it
// and remove from otherTokens
//if (parse.wordMatch(grammar.clauseTerminator, clause[0])){
//this.tail=new Word(language, clause[0]);
//otherTokens.shift();
//}
}// end of clause initial conditional ya

// if clause final
else if(clauseInitial === false || topClauseInitial === false)
{
// then be get ob clause word from start
// then be set ob other tokens ya
clauseWordI = parse.firstTopClauseWordIndex(grammar, tokens);
nextSlice = tokens.slice(clauseWordI);
clause = parse.topClause(grammar,nextSlice);
var clauseTermI = clause.length-1;
clauseWord = clause[0];
otherTokens = clause.slice(clauseWordI+1);
// if clauseTerminator exists set it
// and remove from otherTokens
//if (parse.wordMatch(grammar.clauseTerminator,
//			clause[clauseTermI])){
//	this.tail=new 
//	Word(language, clause[clauseTermI]);
//	otherTokens.pop();
//}
}
// set this parts
this.body = new Sentence(language, otherTokens);
this.head = new Word(language, clauseWord);
return this;
}
TopClause.prototype.toString = function(format){
var joiner = ' ';
var result = new String();
var clauseTerm = this.tail;
var sentence = this.body;
var clauseWord = this.head;
if (clauseTerm) result += clauseTerm.toString(format)+joiner;
if (sentence) result += sentence.toString(format);
if (clauseWord) 
result += clauseWord.toString(format) + joiner ;
return result;
};
TopClause.prototype.toLocaleString = 
function(language,format,type,conjugationLevel){
var joiner = ' ';
var result = new String();
var clauseTerm = this.tail;
var sentence = this.body;
var clauseWord = this.head;
var grammar = language.grammar;
var clauseInitial = grammar.wordOrder.clauseInitial;
var topClauseInitial = grammar.wordOrder.topClauseInitial;
if (clauseInitial && topClauseInitial !== false){
if (clauseTerm) result += clauseTerm.toLocaleString(
	language,format,"jh",conjugationLevel)+joiner;
if (sentence) result += sentence.toLocaleString(
		language,format,type,conjugationLevel);
if (clauseWord) result += clauseWord.toLocaleString(
	language,format,"jh",conjugationLevel) + joiner ;
}
else {
if (clauseWord) result += clauseWord.toLocaleString(
	language,format,"jh",conjugationLevel)+joiner;
if (sentence) result += sentence.toLocaleString(
	language,format,type,conjugationLevel);
if (clauseTerm) result += clauseTerm.toLocaleString(
	language,format,"jh",conjugationLevel)+joiner;
}
return result;
};
TopClause.prototype.isLike= function(language,input){
	var match = topClauseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
TopClause.prototype.isSubset= function(language,input){
var match = topClauseInputToMatch(language,input);
if (this.head.isSubset(language, match.head)
	&& this.body.isSubset(language,match.body))
		return true;
return false;
};
TopClause.prototype.isSuperset= function(language,input){
try{
var match = topClauseInputToMatch(language,input);
}catch(e){ return false;}
var result = true;
if (match.body && !this.body || match.head && ! this.head)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
return result;
};

function topClauseInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new TopClause(language, input);
	else if (typeof input === "object"
		&& input.be === className)
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+className);
}

},{"../compile/parse":11,"../compile/tokenize":12,"./quote":4,"./sentence":5,"./type":9,"./word":10}],9:[function(require,module,exports){
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
var err = require("../lib/error");
module.exports = Type;
function Type(language,input,partOfSpeech){
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Type error: language undefined";
    }
	this.be = "Type";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Type"){
	if (input.limb){
var SubType = require("./subType");
	this.limb = new SubType(language,input.limb);}
	if (input.type){
	this.type = input.type;
if( input.type === "mwq"){
	this.tail = new Word(language,input.tail);
	this.body = input.body;
	this.name = new Word(language,input.name);
	this.head = new Word(language,input.head);
	} 
else if (input.type === "nam"){
	this.type = input.type;
	this.body = input.body;
	this.head = new Word(language,input.head);
} else{
	this.type = input.type;
	this.body = new Word(language,input.body);
	this.head = new Word(language,input.head);
}
}
	else{
	if (input.type !== undefined)
	this.type = input.type;
	if (input.body !== undefined )
	this.body = new Word(language, input.body);
	if (input.head !== undefined)
	this.head = new Word(language, input.head);
	}
	return this;
	}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);

// algorithm de
// if type final then head word is last word
// else it is first word
// if head word is typeword then set it
// set multi word quote
// set number literal
// set single word quote
// else if has subType extract as limb, make rest body
// else make all of it body
// if contains junction word return Junction 

var tokensLength = tokens.length;
var juncTokens = tokens.slice(0);
if (tokensLength === 0) // if no tokens, return them.
	return tokens;
var firstToken = tokens[0];
if (typeof firstToken === "object") // such as Quote
	return firstToken;
var headWord = new String();
var otherTokens = new Array();
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
// if type final then head word is last word
if (wordOrder.typeFinal === true){
var index = tokensLength-1;
headWord = tokens[index];
otherTokens = tokens.slice(0,index); 
juncTokens.splice(index-1,2); // remove used tokens
}
// else it is first word
else if (wordOrder.typeFinal === false) {
headWord = tokens[0];
otherTokens = tokens.slice(1); 
juncTokens.splice(0,1); // remove used tokens
}
else throw Error(wordOrder+" typeFinal order not defined");

// if contains junction word return Junction 
if (! parse.wordMatch(grammar.quotes.multiWordHead, headWord)
&& juncTokens.length >0 && (juncTokens.rfind(
parse.wordMatch.curry(language.grammar.junctions))!==null
)){
var Junction = require("./junction");
return new Junction(language,tokens, partOfSpeech);
}
var dict = language.dictionary.toMwak
var translate = require("../compile/translate");
var transTokens = translate.array(dict,tokens);
var headI = parse.typeHeadIndex(grammar,transTokens);
var bodyWords = tokens.slice(headI[0],headI[1]);
var headWords = tokens.slice(headI[2],headI[3]);


// if head word is typeword then set it
var grammar = language.grammar;
if (language && parse.wordMatch(grammar.typeWords, headWord)){
// set multi word quote
if (parse.wordMatch(grammar.quotes.multiWordHead, headWord)){
// head is first two words, tail is last two, body is rest
var quoteI = parse.lastMultiWordQuoteIndex(grammar,tokens);
var prevT = tokens[quoteI[0]-1];
if (juncTokens && 
parse.wordMatch(language.grammar.junctions,prevT)) {
var Junction = require("./junction");
return new Junction(language,tokens, partOfSpeech);
}
var quoteT = tokens.slice(quoteI[0],quoteI[1]);
var len = quoteT.length;
this.type = "mwq"; // multi word quote type
if (grammar.wordOrder.typeFinal){
this.tail = new Word(language,quoteT.slice(0,1));
this.body = quoteT.slice(2,len-2);
this.name = new Word(language,quoteT.slice(1,2));
this.head = new Word(language,quoteT.slice(len-1,len));
}
else if (grammar.wordOrder.typeFinal === false){
this.tail = new Word(language,quoteT.slice(len-1,len));
this.body = quoteT.slice(2,len-2);
this.name = new Word(language,quoteT.slice(1,2));
this.head = new Word(language,quoteT.slice(0,1));
}
}
// set number literal
else if (parse.wordMatch(grammar.quotes.numeral, headWord)){
// if big endian then reverse order of numbers
this.type = "nam";
var numberTokens = new String();
if (grammar.wordOrder.littleEndian !== true)
numberTokens = tokensAndGlyphsReverse(otherTokens);
else numberTokens = otherTokens;
this.body = numberTokens;
this.head = new Word(language, headWord); 
}
// set single word quote
else {
// if typeword is literal set type to literal
if (parse.wordMatch(grammar.quotes.literal, headWord)) 
this.type = "lit";
if (otherTokens.length >0)
this.body = new Word(language, otherTokens, partOfSpeech);
this.head = new Word(language, headWord); }
// else return all tokens as word
}

// else if has subType extract as limb, make rest body
else if (bodyWords.indexOf(grammar.subTypeWords[0])>-1){
var subTypeI = bodyWords.indexOf(grammar.subTypeWords[0]);
if (wordOrder.typeFinal===true){
var subTypeTokens = bodyWords.slice(0,subTypeI+1);
var otherTokens =  bodyWords.slice(subTypeI+1); }
else if (wordOrder.typeFinal === false){
var subTypeTokens = bodyWords.slice(subTypeI);
var otherTokens =  bodyWords.slice(0,subTypeI); }
var SubType = require("./subType");
this.limb = new SubType(language,subTypeTokens,partOfSpeech);
if ( headWords.length > 0){ if (bodyWords.length >0){
this.body = new Word(language,otherTokens,partOfSpeech);
this.head = new Word(language,headWords);
}else{ this.head = new Word(language,headWords); }}
else{ this.body = new Word(language,otherTokens,partOfSpeech); }
}
else if ( headWords.length > 0){
if (bodyWords.length >0){
this.body = new Word(language,bodyWords,partOfSpeech);
this.head = new Word(language,headWords);
}else{
this.head = new Word(language,headWords);
}
}

// else make all of it body
else{ this.body = new Word(language, tokens, partOfSpeech);
}
return this;


}// end of Type constructor

//function limbIndexGet(language,tokens){
//var translate = require("../compile/translate");
//var dict = language.dictionary.fromMwak;
//var mwakTokens = translate.array(dict,otherTokens);
//var limbI = parse.limbIndex(grammar,mwakTokens);
//return limbI;
//}
//if (limbI !== null){
//var bodyTokens = mwakTokens.slice(limbI[0],limbI[1]);
//var limbTokens = mwakTokens.slice(limbI[2],limbI[3]);
//this.limb = new Word(language,limbTokens,partOfSpeech);
//this.body = new Type(language,bodyTokens,partOfSpeech);
//}

function typeInputToMatch(language, input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Type(language, input);
	else if (input.be === "Type")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+ " not valid match for "+"Type");
}
Type.prototype.isSuperset = function(language, input){
	var match = typeInputToMatch(language, input);
	//// if match is undefined then is subset
	if (match.body !== undefined
	    && !match.body.isSuperset(language, this.body)){
		return false;}
	if (match.head !== undefined
	    && !match.head.isSuperset(language, this.head)){
		return false;}
	return true;
}
Type.prototype.isSubset = function(language, input){
	return this.equals(language, input);
}
Type.prototype.isLike = function(language, input){
	return this.equals(language, input);
}
Type.equals = function(language, input){
	var match = typeInputToMatch(language, input);
	if (match.body === this.body
	   && match.head === this.head)
		return true;
	return false;
}
Type.prototype.toString = function(){
var result = new String();
var joiner = " ";
if (this.limb) result += this.limb.toString()+joiner;
if (this.type === "mwq"){
if (this.tail) result += this.tail.toString()+joiner;
if (this.name) result += this.name.toString()+joiner;
if (this.body) result += this.body.join(joiner);
if (this.name) result += joiner+this.name.toString();
if (this.head) result += joiner+this.head.toString();
}
else{
if (this.body) result += this.body.toString();
if (this.head && this.body) result += joiner;
if (this.head) result += this.head.toString();
}
return result;
}
Type.prototype.valueGet = function(){
var result = new String();
if (this.body) result += this.body.toString();
//if (this.head && this.body) result += " ";
else if (this.head) result += this.head.toString();
return result;
}
Type.prototype.toLocaleString = 
function(language, format, type, conjLevel){
var result = new String();
var joiner = new String();
var conj = new Object();

if (conjLevel >= 3){ conj = language.grammar.conjugation;
if (!this.type){ if (conj.nounType && type === "n"){
return conj.nounType(language,this,format,conjLevel);}
else if (conj.verbType && type === "v"){
return conj.verbType(language,this,format,conjLevel);}
}
}

var subType = new String(); if (this.limb) subType =
this.limb.toLocaleString(language,format,undefined,conjLevel);

if (this.body) joiner = " "; 
var wordOrder = language.grammar.wordOrder;

if (format && format.joiner !== undefined) joiner = format.joiner;
else if (conj && conj.format && conj.format.joiner !== undefined) 
joiner = conj.format.joiner;

// number quote
if (this.type === "nam" ){
if (conj.numeral) 
return conj.numeral(language,this,format,type,conjLevel);
if (wordOrder.littleEndian !== true && this.body !== undefined)
body = tokensAndGlyphsReverse(this.body).join(joiner);
else if (this.body) body = (this.body).join(joiner);
else body = new String();
result += body;
}
// other types
else if (this.body && this.type !== "mwq")
result += this.body.toLocaleString(language, format, type,
conjLevel);

if (this.head === undefined){
if (!subType) return result;
else if (wordOrder.typeFinal) result = subType+joiner+result;
else if (wordOrder.typeFinal=== false) 
result= result+joiner+subType;
return result;
}

// else check type order, append if true, prepend if
// false.
var typeTransl = 
this.head.toLocaleString(language, format, "th",
conjLevel);

if (this.type === "mwq"){
if (conj.foreignQuote) {
result += conj.foreignQuote(language,this,format);}
else{
var tail = new String();
var name = new String();
var body = new String();
if (this.tail) tail =
this.tail.toLocaleString(language,format,"th", conjLevel);
if (this.name) name =
this.name.toLocaleString(language,format,"th", conjLevel);
if (this.body) body = this.body.join(joiner);


if (language.grammar.wordOrder.typeFinal){
if (this.subType) result = subType+joiner;
result+= tail+joiner+name+joiner+body+joiner+name+joiner+typeTransl;
}
else if (language.grammar.wordOrder.typeFinal === false){
 result = 
typeTransl+joiner+name+joiner+body+joiner+name+joiner+tail
+subType+joiner;
}
}
}
else{
if (language.grammar.wordOrder.typeFinal){
if (this.subType) result = subType+ joiner + result;
if (typeTransl) result = result + joiner+ typeTransl ;
}
else if (language.grammar.wordOrder.typeFinal === false)
if (typeTransl) result =  typeTransl + joiner + result;
if (subType) result =  result +joiner +subType;
}

return result;
}

function tokensAndGlyphsReverse(tokens){
var outTokens = tokens.slice(0);
outTokens.reverse();
outTokens = outTokens.map(function(token){
return token.split("").reverse().join("");
});
return outTokens;

}

},{"../compile/parse":11,"../compile/tokenize":12,"../compile/translate":13,"../lib/error":17,"./junction":2,"./subType":6,"./word":10}],10:[function(require,module,exports){
var tokenize = require("../compile/tokenize");
var translate = require("../compile/translate");
var err = require("../lib/error");
//var emitter = require("events").EventEmitter;

// be order final ob tokens in language
// to other tokens and body tokens and head token de 
function finalOrder(language, tokens) {
    "use strict";
    // su head word be last input token
    var transDict = language.dictionary.toMwak,
        headTokenI = tokens.length - 1,
        bodyWords,
        otherTokens,
        headWord = translate.word(transDict, tokens[headTokenI]);
    // yand body is rest of tokens
    if (tokens.length > 1) {
        otherTokens = tokens.slice(0, headTokenI);
        bodyWords = translate.array(transDict, otherTokens);
    }
    return [bodyWords, headWord];
}

// be order initial ob tokens in language
// to other tokens and body tokens and head token de 
function initialOrder(language, tokens) {
    "use strict";
    // su head word be first input token
    var transDict = language.dictionary.toMwak,
        headTokenI = 0,
        bodyWords,
        otherTokens,
        headWord = translate.word(transDict, tokens[headTokenI]);
    // yand body is rest of tokens
    if (tokens.length > 1) {
        otherTokens = tokens.slice(headTokenI + 1);
        otherTokens.reverse();
        bodyWords = translate.array(transDict, otherTokens);
    }
    return [bodyWords, headWord];
}

// be order part of speech ob tokens in language 
// by part of speech
// to tuple of body tokens and head token de
function partOfSpeechOrder(language, tokens, partOfSpeech) {
    "use strict";
    var wordOrder = language.grammar.wordOrder,
        tokenTuple;
    // if su partOfSpeech  ob verb 
    // yand verb initial then be return ob initial order
    if (partOfSpeech === "verb") {
        if (wordOrder.verbFinal === false) {
            tokenTuple = initialOrder(language, tokens);
        } else if (wordOrder.verbFinal === true) {
            tokenTuple = finalOrder(language, tokens);
        }
    // else if su partOfSpeech ob noun 
    // yand noun initial then be return ob initial order 
    } else if (partOfSpeech === "noun") {
        if (wordOrder.nounFinal !== true &&
                wordOrder.headFinal === false) {
            tokenTuple = initialOrder(language, tokens);
        } else if (wordOrder.nounFinal) {
            tokenTuple = finalOrder(language, tokens);
        }
    // else if head initial then be return ob initial order 
    } else if (wordOrder.headFinal === false &&
            wordOrder.nounFinal !== true) {
        tokenTuple = initialOrder(language, tokens);
    // else be return ob final order
    } else {
        tokenTuple = finalOrder(language, tokens);
    }
    return tokenTuple;
}

function Word(language, input, partOfSpeech) {
    "use strict";
    // algorithm de
    //
    // be order final ob tokens in language
    // to tuple of body tokens and head token de 
    // su head word be last word
    // yand body be rest of tokens ya
    //
    // be order initial ob tokens in language
    // to tuple of body tokens and head token de 
    // su head word be first word
    // yand body be rest of tokens ya
    //
    // be order part of speech ob tokens in language 
    // by part of speech
    // to tuple of body tokens and head token de
    // if su partOfSpeech  ob verb 
    // yand verb initial then be initial order
    // else if su partOfSpeech ob noun 
    // yand noun initial then be initial order 
    // else if head initial then initial order 
    // else final order
    //
    // if su partOfSpeech be defined then be partOfSpeech order
    // else if head initial then initial order ya
    // else be final order ya
    //
    // be set ob this
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Word error: language undefined";
    }

    var tokens,
        wordOrder = language.grammar && language.grammar.wordOrder,
        tokenTuple,
        bodyTokens,
        headToken;
    this.be = "Word";
    if (typeof input === "object" && input.be === "Word") {
        this.head = input.head;
        if (input.body) { this.body = input.body; }
        return this;
    }
    if (typeof input === "string") {
        tokens = tokenize.stringToWords(input);
    } else if (Array.isArray(input)) {
        tokens = input;
    } else {
        throw new TypeError(JSON.stringify(input) +
            " unknown to " + this.be);
    }
    // if su partOfSpeech be defined then be partOfSpeech order
    if (partOfSpeech) {
        tokenTuple = partOfSpeechOrder(language, tokens, partOfSpeech);
    // else if head initial then initial order ya
    } else if (wordOrder.nounFinal !== true &&
            wordOrder.headFinal === false) {
        tokenTuple = initialOrder(language, tokens);
    // else be final order ya
    } else {
        tokenTuple = finalOrder(language, tokens);
    }
    bodyTokens = tokenTuple[0];
    headToken = tokenTuple[1];
    // be set ob this
    if (bodyTokens && bodyTokens.length > 0) {
        this.body = bodyTokens;
    }
    if (headToken && headToken.length > 0) {
        this.head = headToken;
    }
}// end of Word constructor

Word.prototype.copy = function (language) {
    "use strict";
    return new Word(language, JSON.parse(JSON.stringify(this)));
};
function wordInputToMatch(language, input) {
    "use strict";
    var result = {};
    if (typeof input === "string" ||
            Array.isArray(input)) {
        result = new Word(language, input);
    } else if (typeof input === "object" &&
            input.be === "Word") {
        result = input;
    } else if (input === undefined) {
        result = input;
    } else {
        throw new TypeError(JSON.stringify(input) +
            " not valid match for " + "Word");
    }
    return result;
}
Word.prototype.isSuperset = function (language, input) {
    "use strict";
    var match = wordInputToMatch(language, input);
    if (match === undefined) {
        return true;
    }
    if (match !== undefined &&
            this.head !== match.head) {
        return false;
    }
    if (match.body !== undefined &&
            !this.body.isSuperset(match.body)) {
        return false;
    }
    return true;
};
Word.prototype.isLike = function (language, input) {
    "use strict";
    return this.isSuperset(language, input);
};

Word.prototype.toString = function () {
    "use strict";
    var string = "";
    if (this.body !== undefined) {
        string = this.body.join(" ") + " ";
    }
    if (this.head !== undefined) {
        string += this.head;
    }
    return string;
};
Word.prototype.toLocaleString = function (language, format, type, conjLevel) {
    "use strict";
    var translation = "",
        joiner = " ",
        wordOrder = language.grammar.wordOrder,
        dict = language.dictionary.fromMwak,
        conj = {},
        bodyWords = [],
        translArray;
    if (format && format.joiner) {
        joiner = format.joiner;
    }
    // algorithm de
    // be add ob body to output ya
    // according to type if initial then reverse body words ya
    // be translate ob body words yand be add to translation ya
    // syntax formating and color-grapheme synesthesia
    // conjugation based on type
    //
    // conjugation based on type
    if (conjLevel >= 3) {
        conj = language.grammar.conjugation;
    }
    if (type) {
        if (conj.verb &&  type === "v") {
            return conj.verb(language, this, format, conjLevel);
        }
        if (conj.noun && type === "n") {
            return conj.noun(language, this, format, conjLevel);
        }
        if (conj.mood && type === "mh") {
            return conj.mood(language, this, format, conjLevel);
        }
        if (conj.sentenceHead && type === "sh") {
            return conj.sentenceHead(language, this, format, conjLevel);
        }
        if (conj.phraseHead && type === "ch") {
            return conj.phraseHead(language, this, format, conjLevel);
        }
        if (conj.verbHead && type === "vh") {
            return conj.verbHead(language, this, format, conjLevel);
        }
        if (conj.clauseHead && type === "lh") {
            return conj.verbHead(language, this, format, conjLevel);
        }
        if (conj.junctionHead && type === "jh") {
            return conj.verbHead(language, this, format, conjLevel);
        }
    }
    if (conj.word) {
        return conj.word(language, this, format, conjLevel);
    }
    // be add ob body to output
    if (this.body !== undefined) {
        bodyWords = this.body;
    }
    bodyWords = bodyWords.concat(this.head);
    // according to type if initial then reverse body words ya
    if (bodyWords.length > 1) {
        if (type) {
            if (type === "v" && wordOrder.verbFinal === false) {
                bodyWords.reverse();
            } else if (type === "n" &&
                    wordOrder.nounFinal === false) {
                bodyWords.reverse();
            } else if (type.search(/h/) >= 0 &&
                    wordOrder.typeFinal === false) {
                bodyWords.reverse();
            }
        } else if (wordOrder.nounFinal === false) {
            bodyWords.reverse();
        }
    }
    // be translate ob body words yand be add to translation ya
    translArray = translate.array(dict, bodyWords);
    translation = translArray.reduce(function (previousWord,
        currentWord) {
        var result;
        result = previousWord;
        if (previousWord !== "") {
            result += joiner + currentWord;
        } else { result += currentWord; }
        return result;
    }, "");
    //for (i = 0; i < translArray.length; i++) {
    //    translWord = translArray[i];
    //    translation+= translWord;
    //    if (i <translArray.length-1) {
    //        translation+= joiner;
    //    }
    //}
    // syntax formating and color-grapheme synesthesia
    if (format) {
        if (type && format.typeGlyphsTransform) {
            translation = format.typeGlyphsTransform(translation, type);
        } else if (format.glyphsTransform) {
            translation = format.glyphsTransform(translation);
        }
    }
    if (format && format.ipa && conj && conj.ipa) {
        translation = conj.ipa(translation);
    }
    return translation;
};
Word.prototype.isSubset = function (language, input) {
    "use strict";
    var match = wordInputToMatch(language, input),
        result = false;
    if (this.body === undefined) {
        result = true;
    } else if (this.body.isSubset(match.body) &&
            this.head.isSubset(match.body)) {
        result = true;
    }
    return result;
};

module.exports = Word;

},{"../compile/tokenize":12,"../compile/translate":13,"../lib/error":17}],11:[function(require,module,exports){
"use strict"
var hof = require("../lib/hof");
var tokenize = require("./tokenize");
var Grammar = require("../lang/grammar");
var Quote = require("../class/quote");
var Type = require("../class/type");
var grammar = new Grammar();
/// tokens be parse ya
//exports = new Object;
exports.wordMatch = wordMatch;
function wordMatch(wordArray,word){
if (wordArray.indexOf(word)!==-1) return true;
return false;
}
/// be parse bo next word ya
exports.firstWordIndex = firstWordIndexParse;
/// returns next word, skipping whitespace tokens
function firstWordIndexParse(tokens){
	return tokens.find(tokenize.isWord);
}
exports.lastWordIndex = lastWordIndexParse;
/// returns next word, skipping whitespace tokens
function lastWordIndexParse(tokens){
	return tokens.rfind(tokenize.isWord);
}

/// be parse bo quote  ya
/// be parse bo single word quote de
exports.firstSingleWordQuote = firstSingleWordQuoteParse;
function firstSingleWordQuoteParse(grammar,tokens){
var singleQuoteIndex=tokens.find(
		wordMatch.curry(grammar.quotes.singleWord));
// if not found return null.
if (singleQuoteIndex === null)
	return null;
// if found get previous word.
if (singleQuoteIndex!==-1){
	var previousTokens = tokens.slice(0,singleQuoteIndex);
	var quotedWordIndex = lastWordIndexParse(previousTokens);
	return tokens.slice(quotedWordIndex,singleQuoteIndex+1);
}
// else return null
return null;

}
/// be parse bo multi word quote de
exports.lastMultiWordQuote = lastMultiWordQuoteParse;
function lastMultiWordQuoteParse(grammar,tokens){
var index = lastMultiWordQuoteIndexParse(grammar,tokens);
//if su index ob null then be return ob null ya
if (index === null) return null;
return tokens.slice(index[0],index[1]);
}
exports.lastMultiWordQuoteIndex = lastMultiWordQuoteIndexParse;
function lastMultiWordQuoteIndexParse(grammar,tokens){
// algorithm:
// about from end be find ob quote head ya
// if not found then be return null
// else if found then be set as end yand
// be get ob preceding word as quote name 
// then be search for quote-name preceded by quote tail ya
// if found then be set as  start
// else be set ob start of tokens as start yand
// be give warning ya
// return start and end array

var head = new String();
var tail = new String();
var quotes = grammar.quotes;
if (grammar.wordOrder.typeFinal){
head = quotes.multiWordHead;
tail = quotes.multiWordTail;}
else if (grammar.wordOrder.typeFinal === false){
head = quotes.multiWordTail;
tail = quotes.multiWordHead;}

var start = null;
var end = null;

// about from end be find ob quote head ya
var quoteHeadI = tokens.rfind(wordMatch.curry(head));
// if not found then be return null
if (quoteHeadI === null) return null;
// else if be find then be set as end yand
else end = quoteHeadI+1;
// be get ob preceding word as quote name 
var quoteNameI = quoteHeadI-1;
var quoteName = tokens[quoteNameI];
// then be search for quote-name preceded by quote tail ya
while (true){
var otherTokens = tokens.slice(0,quoteNameI);
var quoteNameI = otherTokens.rfind(wordMatch.curry(quoteName));
// if be find then be set as  start
// else be set ob start of tokens as start yand
// be give warning ya
if (quoteNameI === -1) {
throw new Error("couldn't find quote start"+tokens);
start = 0; break}
else if (tokens[quoteNameI-1] === tail[0]) {
start = quoteNameI-1; break;}
// be give warning ya
if ((quoteHeadI-quoteNameI) > 128)
throw new Error("quote too long, is "+(quoteHeadI-quoteNameI)
+" tokens, contents ob " +tokens.slice(quoteNameI,quoteHeadI));
}
// return start and end array
return [start,end];
}

exports.firstMultiWordQuote = firstMultiWordQuoteParse;
function firstMultiWordQuoteParse(grammar,tokens){
var index = firstMultiWordQuoteIndexParse(grammar,tokens);
//if su index ob null then be return ob null ya
if (index === null) return null;
return tokens.slice(index[0],index[1]);
}
exports.firstMultiWordQuoteIndex = firstMultiWordQuoteIndexParse;
function firstMultiWordQuoteIndexParse(grammar,tokens){
// algorithm:
// about from start be find ob quote head ya
// if not found then be return null
// else if found then be set as start yand
// be get ob following word as quote name 
// then be search for quote-name following by quote tail ya
// if found then be set as  end
// else be set ob end of tokens as end yand
// be give warning ya
// return end and start array

var head = new String();
var tail = new String();
var quotes = grammar.quotes;
if (grammar.wordOrder.typeFinal === false){
head = quotes.multiWordHead;
tail = quotes.multiWordTail;}
else if (grammar.wordOrder.typeFinal){
head = quotes.multiWordTail;
tail = quotes.multiWordHead;}

var start = null;
var end = null;

// about from start be find ob quote head ya
var quoteHeadI = tokens.find(wordMatch.curry(head));
// if not found then be return null
if (quoteHeadI === null) return null;
// else if be find then be set as start yand
else start = quoteHeadI;
// be get ob following word as quote name 
var quoteNameI = quoteHeadI+1;
var quoteName = tokens[quoteNameI];
// then be search for quote-name followed by quote tail ya
var tailQuoteNameI = quoteNameI;
var extraTailI = 0;
var otherTokens = tokens.slice(0);
while (true){
var otherTokens = otherTokens.slice(tailQuoteNameI+1);
var tailQuoteNameI = otherTokens.find(wordMatch.curry(quoteName));
// if be find then be set as  end
// else be set ob end of tokens as end yand
// be give warning ya
if (tailQuoteNameI === null) {end = 0; break}
else if (otherTokens[tailQuoteNameI+1] === tail[0]) {
end = quoteNameI+extraTailI+tailQuoteNameI+3; break;}
extraTailI += tailQuoteNameI+1;
}
// return end and start array
return [start,end];
}

/// be parse bo surrounding quote de
exports.surroundingQuote = surroundingQuoteParse;
	/// if word is in quote, return quote
function surroundingQuoteParse(grammar,wordIndex,tokens){
	if (!Array.isArray(tokens))
		throw new TypeError
			("su surroundingQuoteParse be need array of tokens ya");
	/// check if is single word quote
	var restOfTokens = tokens.slice(wordIndex+1,tokens.length);
	var firstWordIndex = firstWordIndexParse(restOfTokens)+wordIndex+1;
	// if no next word, can't be quote so return null
	if(firstWordIndex === NaN)
		return null;
	var nextWord = tokens[firstWordIndex];
	if (grammar.quotes.singleWord.indexOf(nextWord)!==-1)
		return tokens.slice(wordIndex,firstWordIndex+1);
	/// if be not in quote then return null ya
	return null;
	
}
/// be parse bo type de
/// be parse bo phrase de
exports.lastCaseIndex = lastCaseIndexParse;
function lastCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var Index = tokens.rfind(wordMatch.curry(grammar.phraseWords));
if (Index=== null)
	return -1;
return Index;
}
exports.firstCaseIndex = firstCaseIndexParse;
function firstCaseIndexParse(grammar,tokens){
	if (!tokens.length) return -1;
	var Index = tokens.find(
			wordMatch.curry(grammar.phraseWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.lastSentenceWordIndex = lastSentenceWordIndexParse;
function lastSentenceWordIndexParse(grammar,tokens,fromIndex){
if (fromIndex !== undefined) tokens = tokens.slice(0,fromIndex);
var Index =tokens.rfind(wordMatch.curry(grammar.sentenceWords));
if (Index=== null) return -1;
return Index;
}
exports.firstSentenceWordIndex = firstSentenceWordIndexParse;
function firstSentenceWordIndexParse(grammar,tokens,fromIndex){
if (fromIndex !== undefined) tokens = tokens.slice(fromIndex+1);
var Index = tokens.find(wordMatch.curry(grammar.sentenceWords));
if (Index=== null) return -1;
if (fromIndex !== undefined) return (Index+fromIndex+1);
return Index;
}

exports.phraseError = phraseError;
function phraseError(grammar,tokens){
		throw new Error("su quo te "+tokens.join(" ")+" quo ted"
			+" be lack ob valid phrase ender"
			+" like one of ar wu "
			+grammar.phraseWords.join(" wu ")
			+" ya");
}
/// su first phrase be parse ya
exports. firstPhrase = 
	 firstPhraseParse;
function firstPhraseParse(grammar,tokens){
var startEnd = firstPhraseIndexParse(grammar,tokens);
return tokens.slice(startEnd[0],startEnd[1]);
}
exports. firstPhraseIndex = 
	 firstPhraseIndexParse;
function firstPhraseIndexParse(grammar,tokens){

// algorithm
//
// get first case word
// if prepositional set start as phraseHead
// and other tokens as what comes after
// if case before clause then slice before it ya
// get next case, subClause, topClause
// if nextClause available, set it's end as phrase end 
// unless it is right after, then get the following one ya
// if topClause is next then set it's start as end

// get first case word
var startEnd = new Array();
var phraseHeadIdx = firstAnyCaseIndexParse(grammar,tokens);
if (phraseHeadIdx === null) phraseError(grammar, tokens);
var otherSlice;
var wordOrder = grammar.wordOrder;

// if prepositional set start as phraseHead
// and other tokens as what comes after
if (wordOrder.postpositional=== false){
otherSlice = tokens.slice(phraseHeadIdx);
startEnd[0]=phraseHeadIdx;
}

// if clauseFinal
var offset = 1;
if (wordOrder.clauseInitial === false){ // clauseFinal
// if case before clause then slice before it ya
var nextSlice = otherSlice.slice(offset);
// get next case, subClause, topClause
var nextCaseI = firstCaseIndexParse(grammar,nextSlice);
// unless it is right after, then get the following one ya
if (nextCaseI === 0
&& tokens[phraseHeadIdx] === grammar.topicWord){
offset = 2
var nextSlice = otherSlice.slice(offset);
var nextCaseI = firstCaseIndexParse(grammar,nextSlice);
}
var nextSubClauseI = firstClauseWordIndexParse(grammar,nextSlice);
var nextTopClauseI = 
firstTopClauseWordIndexParse(grammar,nextSlice);
var length = nextSlice.length;
if (nextSubClauseI === -1) nextSubClauseI = length;
if (nextTopClauseI === -1) nextTopClauseI = length;
var nextClauseI = Math.min(nextSubClauseI, nextTopClauseI);
if (nextCaseI !== -1 && nextCaseI < nextClauseI) {
otherSlice = otherSlice.slice(0,nextCaseI+offset); }
// if nextClause available, set it's end as phrase end 
else if (nextSubClauseI !== length && 
nextSubClauseI < nextTopClauseI){
var clauseIdxs = adjacentClauseIndexParse(grammar,nextSlice);
startEnd[1]=clauseIdxs[1]+offset+phraseHeadIdx;
return startEnd; }
// if topClause is next then set it's start as end
else if (nextTopClauseI !== length){
startEnd[1]=nextTopClauseI+offset+phraseHeadIdx;
return startEnd;
} 
}// end of clauseFinal conditional ya
else { otherSlice = tokens.slice(0,phraseHeadIdx+offset); }

var resultI = lastPhraseIndexParse(grammar,otherSlice);
var result;
// if clause final, include start
if (wordOrder.clauseInitial=== false){
//result = tokens.slice(phraseHeadIdx,resultI[1]+phraseHeadIdx);
startEnd[0]=phraseHeadIdx;
startEnd[1]=resultI[1]+phraseHeadIdx;}
//else result = tokens.slice(resultI[0],resultI[1]);
else startEnd = resultI;
//return result;
return startEnd;
}/* firstPhraseIndexParse function's end */

/// su last phrase be parse ya
exports.lastPhrase = lastPhraseParse;
function lastPhraseParse(grammar,tokens){
	var indexes = lastPhraseIndexParse(grammar,tokens);
	return tokens.slice(indexes[0],indexes[1]);
}
exports. lastPhraseIndex =
	 lastPhraseIndexParse;
function lastPhraseIndexParse(grammar,tokens){
// algorithm:
// 	be find ob last case index ya
// 	be get ob adjacent clause indexes ya
//	if postpositional
//		if adjacent clause found and clause final then
//		end at clause's end
//		else end at phrase word
//		if adjacent clause found and clause initial then
//		start at clause's start
//		else
//		be get ob ar previous slice, previous case, 
//			previous sentence ender, prev top clause
//		for previous case if it is adjacent then get one
//		before it
//		be make su available one ob start ya
//		else 0 be start ya
//	if prepositional
//		if adjacent clause found and clause initial then
//		start at clause's start
//		else start at phrase word
//		if adjacent clause found and clause final then
//		end at clause's end
//		else
//		get sentence ender, adjacent clause
//		if available make end, else length is end
//
//
var lastCaseIndexP = lastCaseIndexParse.curry(grammar);
var clauseInitial = grammar.wordOrder.clauseInitial;
// 	be find ob last case index ya
var phraseWordIndex;
if (clauseInitial) 
phraseWordIndex = lastAnyCaseIndexParse(grammar,tokens);
else 
phraseWordIndex = firstAnyCaseIndexParse(grammar,tokens);

if (phraseWordIndex === -1) phraseError(grammar, tokens);
var start, end;
// 	be get ob adjacent clause ya
	var adjacentClauseI = adjacentClauseIndexParse(grammar,
			tokens, phraseWordIndex);
//	if postpositional
	if (grammar.wordOrder.postpositional){
//		if adjacent clause found and clause final then
		if (adjacentClauseI && !clauseInitial)
//		end at clause's end
		end = adjacentClauseI[1];
//		else end at phrase word
		else end = phraseWordIndex+1;
//		if adjacent clause found and clause initial then
		if (adjacentClauseI && clauseInitial)
//		start at clause's start
		start = adjacentClauseI[0];
//		else
		else {
//		end at phrase word
//		get previous slice, previous case, 
	var previousSlice = tokens.slice(0,phraseWordIndex);
	var previousCaseI = lastCaseIndexP(previousSlice);
//		for previous case if it is adjacent then get one
//		before it
if (tokens[phraseWordIndex]===grammar.topicWord 
&& ((phraseWordIndex)-previousCaseI)===1
&& previousCaseI !== -1){
previousSlice = tokens.slice(0,phraseWordIndex-1)
previousCaseI = lastCaseIndexP(previousSlice);
}
//			previous sentence ender, prev top clause
	var previousSentenceEnderI = lastSentenceWordIndexParse
		(grammar,previousSlice);
	var previousTopClauseI = lastTopClauseWordIndexParse
		(grammar,previousSlice);
//		be make su available one ob start ya
//		else 0 be start ya
	start = Math.max(previousCaseI,previousSentenceEnderI,
		previousTopClauseI,-1);
	start += 1;
		}
	}
//	if prepositional
	else {
//		if adjacent clause found and clause initial then
		if (adjacentClauseI && clauseInitial)
//		start at clause's start
		start = adjacentClauseI[0];
//		else start at phrase word
		else start = phraseWordIndex;
//		if adjacent clause found and clause final then
		if (adjacentClauseI!==null && !clauseInitial){
//		end at clause's end
		end = adjacentClauseI[1];
		}
//		else
		else{
//		get sentence ender
	var sentenceEnderIndex = lastSentenceWordIndexParse(
			grammar,tokens);
//		if available make end, else length is end
	if (sentenceEnderIndex !== -1)
		end = sentenceEnderIndex;
	else end = tokens.length;
		}
	}
	return [start,end];
}

// su first specific phrase be parse ya
exports.firstSpecificPhrase = firstSpecificPhraseParse;
function firstSpecificPhraseParse(grammar,tokens,phraseWord){
	var firstSpecificCase=tokens.find(wordMatch.curry([phraseWord]));
	var previousSlice = tokens.slice(0,firstSpecificCase+1);
	return lastPhraseParse(grammar,previousSlice);
}
// su last specific phrase be parse ya
exports.lastSpecificPhrase = lastSpecificPhraseParse;
function lastSpecificPhraseParse(grammar,tokens,phraseWord){
	var lastSpecificCase=tokens.rfind(wordMatch.curry([phraseWord]));
	var previousSlice = tokens.slice(0,lastSpecificCase+1);
	return lastPhraseParse(grammar,previousSlice);
}
/// be parse bo sentence de
exports.sentenceError = sentenceError;
function sentenceError(tokens){
		throw new Error("su quo te "+tokens.join(" ")+" quo ted"
			+" be lack ob valid sentence ender"
			+" like one of ar wu "
			+grammar.sentenceWords.join(" wu ")
			+" ya");
}
exports.firstSentence = firstSentenceParse;
function firstSentenceParse(grammar,tokens){
var sentenceIndex = firstSentenceIndexParse(grammar,tokens);
var start = sentenceIndex[0];
var end = sentenceIndex[1];
return tokens.slice(start,end);
}
function firstSentenceIndexParse(grammar, tokens){
	var sentenceEnder = tokens.find(wordMatch.curry(grammar.sentenceWords));
	if (sentenceEnder === null) sentenceError(tokens);
	// if followed by space include it
	if (tokenize.isSpace(tokens[sentenceEnder+1]))
		sentenceEnder=sentenceEnder+1;
	return [0,sentenceEnder+1];
}
exports.lastSentence = lastSentenceParse;
function lastSentenceParse(grammar,tokens){
	var lastSentWordIP = lastSentenceWordIndexParse.curry(grammar);
	var sentenceEnder = tokens.rfind(wordMatch.curry(grammar.sentenceWords));
	if (sentenceEnder === null) sentenceError(tokens);
	var sentenceEnder = lastSentWordIP(tokens);
	if (tokenize.isSpace(tokens[sentenceEnder+1]))
		sentenceEnder=sentenceEnder+1;
	var previousSlice = tokens.slice(0,sentenceEnder);
	var previousSentenceEnder = lastSentWordIP(previousSlice);
	if (previousSentenceEnder===-1)
		previousSentenceEnder=0;
	return tokens.slice(previousSentenceEnder+1,sentenceEnder+1);
}
exports.quotesExtract = quotesExtract;
// extracts quotes from word tokens, turning them into objects,
// splices them back in, and returns result.
function quotesExtract(language, tokens){

// algorithm:
// if type final
// go backwards through tokens
// else go forwards
// return result
var grammar = language.grammar;
var quotes = grammar.quotes;
var quoteHeads = quotes.quoteHeads;
var singleWordHead = quotes.singleWord[0];
var multiWordHead = quotes.multiWordHead[0];
var quoteExtractedTokens = new Array();
var i; 
var thisToken; 
var quote;
var prevQuotes = [""];
// if type final
// go backwards through tokens
if (language.grammar.wordOrder.typeFinal){
for (i = tokens.length-1 ; i >= 0; i--){
thisToken = tokens[i];
if (thisToken === prevQuotes[0])
prevQuotes.unshift(thisToken);
else prevQuotes = [thisToken];
if (prevQuotes.length >5)
throw new Error("quintuplication infinite loop detected "
+thisToken);

if (i===0) quoteExtractedTokens.unshift(thisToken);
else if (wordMatch(quoteHeads,thisToken)){
var quoteTokens = new Array();
if (thisToken === singleWordHead)
quoteTokens = [tokens[i-1],thisToken];
else if (thisToken === multiWordHead){
var otherTokens = tokens.slice(0,i+1);
quoteTokens = lastMultiWordQuoteParse(grammar,otherTokens);
}
quote = new Type(language, quoteTokens)
quoteExtractedTokens.unshift(quote);
i = i-quoteTokens.length+1;
}
else quoteExtractedTokens.unshift(thisToken);

var qetl = quoteExtractedTokens.length;
}
}
// else go forwards
else if (!language.grammar.wordOrder.typeFinal) { // type initial
for (i=0; i < tokens.length; i++){
thisToken = tokens[i];
if (i===tokens.length-1) quoteExtractedTokens.push(thisToken);
else if (wordMatch(quoteHeads,thisToken)){
var quoteTokens = new Array();
if (thisToken === multiWordHead){
var otherTokens = tokens.slice(i);
quoteTokens = firstMultiWordQuoteParse(grammar,otherTokens);
}
else //if (thisToken === singleWordHead)
quoteTokens = [thisToken,tokens[i+1]];
quote = new Type(language, quoteTokens)
quoteExtractedTokens.push(quote);
i = i+quoteTokens.length-1;
}
else quoteExtractedTokens.push(thisToken);
}
}
return quoteExtractedTokens;

}
exports.adjacentClause = adjacentClauseParse;
function adjacentClauseParse(grammar,tokens,caseWordIndex){
	var clauseIndexes = adjacentClauseIndexParse(
			grammar,tokens,caseWordIndex);
	if (clauseIndexes)
	return tokens.slice(clauseIndexes[0],clauseIndexes[1]);
	else return null;
}

exports.adjacentClauseIndex = adjacentClauseIndexParse;
function adjacentClauseIndexParse(grammar,tokens,caseWordIndex){
// algorithm:
// if clause initial then
// get previous clause word
// if none then return null
// else get previous case word, sentence word
// if clause word greater than case word and sentence word then
// set as end ya
// else return null ya
// get previous clause terminator ya
// max of sentence word and clause terminator set to start ya
//
// else if clause final then
// get next clause word
// if none then return null
// else get next case word, sentence word
// if clause word less than case word and sentence word then
// set as start  ya
// else return null ya
// get next clause temrinator
// min of sentence word and clause terminator set to end ya
// end if
// return start, end array
//
var start = 0, 
    end = tokens.length;
var caseWordI,
    sentenceWordI,
    clauseWordI,
    clauseTermI,
    otherTokens;
//
// if clause initial then
if (grammar.wordOrder.clauseInitial){
if (caseWordIndex)
otherTokens = tokens.slice(0,caseWordIndex);
else otherTokens = tokens;
// get previous clause word
clauseWordI = lastClauseWordIndexParse(grammar,otherTokens);
// if none then return null
if (clauseWordI === -1) return null;
// else get previous case word, sentence word
caseWordI = lastCaseIndexParse(grammar,otherTokens);
sentenceWordI = lastSentenceWordIndexParse(grammar,otherTokens);
// if clause word greater than case word and sentence word then
if (clauseWordI > Math.max(caseWordI,sentenceWordI))
// set as end ya 
end = clauseWordI+1;
// else return null ya
else return null;
// get previous clause terminator ya
clauseTermI = lastClauseTerminatorIndexParse(grammar,
		otherTokens);
// max of sentence word and clause terminator set to start ya
start = Math.max(sentenceWordI,clauseTermI,0);
}
//
// else if clause final then
else/* Clause Final*/{
if (caseWordIndex)
otherTokens = tokens.slice(caseWordIndex,tokens.length);
else {otherTokens = tokens;
	caseWordIndex = 0;}
// get next clause word
clauseWordI = firstClauseWordIndexParse(grammar,otherTokens);
// if none then return null
if (clauseWordI === -1) return null;
// else get next case word, sentence word
caseWordI = firstCaseIndexParse(grammar,otherTokens);
sentenceWordI = firstSentenceWordIndexParse(grammar,otherTokens);
// if clause word less than case word and sentence word then
if (clauseWordI < Math.max(caseWordI,sentenceWordI))
// set as start  ya
start = clauseWordI +caseWordIndex;
// else return null ya
else return null;
// get next clause terminator
clauseTermI = firstClauseTerminatorIndexParse(grammar,
		otherTokens);
// min of sentence word and clause terminator set to end ya

if (clauseTermI === -1) clauseTermI=tokens.length-1;
if (sentenceWordI === -1) sentenceWordI=tokens.length;
end = Math.min(sentenceWordI,clauseTermI+1)+caseWordIndex;
// end if
}
// return start end array
return [start,end];
}
exports.lastClauseWordIndex = lastClauseWordIndexParse;
function lastClauseWordIndexParse(grammar,tokens){
	var Index = tokens.rfind(
		wordMatch.curry(grammar.clauseWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.firstClauseWordIndex = firstClauseWordIndexParse;
function firstClauseWordIndexParse(grammar,tokens){
	var Index = tokens.find(
		wordMatch.curry(grammar.clauseWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.lastClauseTerminatorIndex = 
	lastClauseTerminatorIndexParse;
function lastClauseTerminatorIndexParse(grammar,tokens){
	var Index = tokens.rfind(
		wordMatch.curry(grammar.clauseTerminator));
	if (Index=== null)
		return -1;
	return Index;
}
exports.firstClauseTerminatorIndex = 
	firstClauseTerminatorIndexParse;
function firstClauseTerminatorIndexParse(grammar,tokens){
	var Index = tokens.find(
		wordMatch.curry(grammar.clauseTerminator));
	if (Index=== null)
		return -1;
	return Index;
}


exports. lastSubTypeWordIndex = 
	 lastSubTypeWordIndexParse;
function lastSubTypeWordIndexParse(grammar,tokens){
var Index = tokens.rfind(
		wordMatch.curry(grammar.subTypeWords));
if (Index=== null) return -1;
return Index;
}
exports. firstSubTypeWordIndex = 
	 firstSubTypeWordIndexParse;
function firstSubTypeWordIndexParse(grammar,tokens){
var Index = 
tokens.find(wordMatch.curry(grammar.subTypeWords));
if (Index=== null) return -1;
return Index;
}

exports. lastSubPhraseWordIndex = 
	 lastSubPhraseWordIndexParse;
function lastSubPhraseWordIndexParse(grammar,tokens){
var Index = tokens.rfind(
		wordMatch.curry(grammar.subPhraseWords));
if (Index=== null) return -1;
return Index;
}
exports. firstSubPhraseWordIndex = 
	 firstSubPhraseWordIndexParse;
function firstSubPhraseWordIndexParse(grammar,tokens){
var Index = 
tokens.find(wordMatch.curry(grammar.subPhraseWords));
if (Index=== null) return -1;
return Index;
}
exports.lastSubType = lastSubTypeGet;
function lastSubTypeGet(grammar,tokens){
return tokens;
}
exports.firstSubType = firstSubTypeGet;
function firstSubTypeGet(grammar,tokens){
return tokens;
}
exports. lastAnyCaseIndex = 
	 lastAnyCaseIndexParse;
function lastAnyCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var caseIndex  = 
tokens.rfind(wordMatch.curry(grammar.phraseWords));
if (caseIndex === null)    caseIndex = -1;
var subCaseIndex =
tokens.rfind(wordMatch.curry(grammar.subPhraseWords));
if (subCaseIndex === null) subCaseIndex = -1;
//var topClauseIndex =
//tokens.rfind(wordMatch.curry(grammar.topClauseWords));
//if (topClauseIndex === null) topClauseIndex = -1;
return Math.max(caseIndex,subCaseIndex);//,topClauseIndex)
}
exports. firstAnyCaseIndex = 
	 firstAnyCaseIndexParse;
function firstAnyCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var tokensLength = tokens.length;
var caseIndex = 
tokens.find(wordMatch.curry(grammar.phraseWords));
if (caseIndex=== null)    caseIndex = tokensLength;
var subCaseIndex = 
tokens.find(wordMatch.curry(grammar.subPhraseWords));
if (subCaseIndex=== null) subCaseIndex = tokensLength;
//var topClauseIndex = 
//tokens.find(wordMatch.curry(grammar.topClauseWords));
//if (topClauseIndex=== null) topClauseIndex = tokensLength;
//tokens.find(wordMatch.curry(grammar.phraseWords));
var result = Math.min(caseIndex,subCaseIndex);//,topClauseIndex);
if (result === tokensLength) return -1;
else return result;
}

exports. lastTopClauseWordIndex = 
	 lastTopClauseWordIndexParse;
function lastTopClauseWordIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var Index = 
tokens.rfind(wordMatch.curry(grammar.topClauseWords));
if (Index=== null) return -1;
return Index;
}

exports. firstTopClauseWordIndex = 
	 firstTopClauseWordIndexParse;
function firstTopClauseWordIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var Index = 
tokens.find(wordMatch.curry(grammar.topClauseWords));
if (Index=== null) return -1;
return Index;
}

exports. topClause = 
	 topClauseParse;
function topClauseParse(grammar,tokens){
var  indexes = topClauseIndexParse(grammar,tokens);
return tokens.slice(indexes[0],indexes[1]);
} 

exports. topClauseIndex = 
	 topClauseIndexParse;
function topClauseIndexParse(grammar,tokens){
// top clause algorithm de
//
// if clause initial then 
// be get ob last top clause word index ya
// if none then return null ya
// be set as end of top clause ya
// be get ob prev top clause index and sentence word index ya
// be set greatest of top clause word or sentence or 0 
// as start of top clause ya
//
// else if clause final then 
// be get ob first top clause word index ya
// if none then return null ya
// be set as start of top clause ya
// be get ob next top clause index and sentence word index ya
// be set least of top clause word or sentence or length
// as end of top clause ya
// 
// be return start and end as array ya

/* code start*/

var start, end;
var wordOrder = grammar.wordOrder;
var clauseInitial = wordOrder.clauseInitial;
var headWordI, otherTokens, otherHeadWordI, sentenceWordI;

// if clause initial then 
if (clauseInitial){
// be get ob last top clause word index ya
headWordI = lastTopClauseWordIndexParse(grammar,tokens);
// if none then return null ya
if (headWordI === null) return null;
// be set as end of top clause ya
end = headWordI+1;
// be get ob prev top clause index and sentence word index ya
otherTokens = tokens.slice(0,headWordI);
otherHeadWordI=lastTopClauseWordIndexParse(grammar,otherTokens);
sentenceWordI = lastSentenceWordIndexParse(grammar,otherTokens);
// be set greatest of top clause word or sentence or 0 
// as start of top clause ya
start = Math.max(sentenceWordI,otherHeadWordI,-1)+1;
}// be end of clauseInitial ya
//
// else if clause final then 
if (clauseInitial === false){
// be get ob first top clause word index ya
headWordI = firstTopClauseWordIndexParse(grammar,tokens);
// if none then return null ya
if (headWordI === null) return null;
// be set as start of top clause ya
start = headWordI;
// be get ob next top clause index and sentence word index ya
otherTokens = tokens.slice(headWordI+1);
otherHeadWordI=firstTopClauseWordIndexParse(grammar,otherTokens);
sentenceWordI= firstSentenceWordIndexParse(grammar,otherTokens);
// be set least of top clause word or sentence or length
// as end of top clause ya
var length = otherTokens.length;
if (otherHeadWordI === -1) otherHeadWordI = length;
if (sentenceWordI === -1) sentenceWordI = length;
end = headWordI+1+Math.min(otherHeadWordI,sentenceWordI,length);
}// be end of top clause ya
//
// be return start and end as array ya
return [start,end];
}//su top clause index parse be end ya


exports. lastAnyTopCaseIndex = 
	 lastAnyTopCaseIndexParse;
function lastAnyTopCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var caseIndex  = 
tokens.rfind(wordMatch.curry(grammar.phraseWords));
if (caseIndex === null)    caseIndex = -1;
var topClauseIndex =
tokens.rfind(wordMatch.curry(grammar.topClauseWords));
if (topClauseIndex === null) topClauseIndex = -1;
return Math.max(caseIndex,topClauseIndex)
}
exports. firstAnyTopCaseIndex = 
	 firstAnyTopCaseIndexParse;
function firstAnyTopCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var tokensLength = tokens.length;
var caseIndex = 
tokens.find(wordMatch.curry(grammar.phraseWords));
if (caseIndex=== null)    caseIndex = tokensLength;
var topClauseIndex = 
tokens.find(wordMatch.curry(grammar.topClauseWords));
if (topClauseIndex=== null) topClauseIndex = tokensLength;
tokens.find(wordMatch.curry(grammar.phraseWords));
var result = Math.min(caseIndex,topClauseIndex);
if (result === tokensLength) return -1;
else return result;
}

exports. lastJunctionWordIndex = 
	 lastJunctionWordIndexParse;
function lastJunctionWordIndexParse(grammar,tokens){
var Index = tokens.rfind(wordMatch.curry(grammar.junctions));
if (Index=== null) return -1;
return Index;
}
exports. firstJunctionWordIndex = 
	 firstJunctionWordIndexParse;
function firstJunctionWordIndexParse(grammar,tokens){
var Index = tokens.find(wordMatch.curry(grammar.junctions));
if (Index=== null) return -1;
return Index;
}
exports. lastJunction =
	 lastJunctionParse;
function lastJunctionParse(grammar,tokens){
var JI = lastJunctionIndexParse(grammar,tokens);
return tokens.slice(JI[0],JI[1]);
}
exports. lastJunctionIndex =
	 lastJunctionIndexParse;
function lastJunctionIndexParse(grammar,tokens){
// algorithm de
// get last junction word index
// if postpositional
// if directly preceded by phrase then parse previous phrase
// return result

var result = -1;
// get last junction word index
var lastJunctionWI = lastJunctionWordIndexParse(grammar,tokens);
if (lastJunctionWI >= -1){
var postpositional = grammar.wordOrder.postpositional;
// if postpositional
if (postpositional){
// if directly preceded by phrase then parse previous phrase
if (wordMatch(grammar.phraseWords,tokens[lastJunctionWI-1])){
var prevTokens = tokens.slice(0,lastJunctionWI)
result = lastPhraseIndexParse(grammar,prevTokens);
// include junction word
result[1] = result[1]+1;
}
}
}
// return result
return result;
}
exports. firstJunctionIndex =
	 firstJunctionIndexParse;
function firstJunctionIndexParse(grammar,tokens){
// algorithm de
// get next junction word index
// if prepositional
// if directly followed by phrase then parse next phrase
// return result

var result = -1;
// get last junction word index
var lastJunction = lastJunctionWordIndexParse(grammar,tokens);
if (lastJunction >= -1){
var prepositional = grammar.wordOrder.prepositional;
// if prepositional
if (prepositional){
// if directly followed by phrase then parse next phrase
}
}
// return result
return result;
}

exports. lastJunctionPhraseIndex = 
	 lastJunctionPhraseIndexParse;
function lastJunctionPhraseIndexParse(grammar,tokens){
// algorithm de
// be get ob last phrase indexes ya
// if tail word be junction 
// then recurse with previous tokens ya

// be get ob last phrase indexes ya
var lastPhraseI = lastPhraseIndexParse(grammar,tokens);
if (grammar.wordOrder.clauseInitial){
// if tail word be junction 
var tail = tokens[lastPhraseI[0]];
var prevPhraseI = lastPhraseI;
while (wordMatch(grammar.junctions,tail)){
// then recurse with previous tokens ya
var otherTokens = tokens.slice(0,prevPhraseI[0]);
prevPhraseI = lastPhraseIndexParse(grammar,otherTokens);
tail = tokens[prevPhraseI[0]];
}
lastPhraseI[0]=prevPhraseI[0];
}
return lastPhraseI;
}// end of last junction phrase index parse ya

exports. firstJunctionPhraseIndex = 
	 firstJunctionPhraseIndexParse;
function firstJunctionPhraseIndexParse(grammar,tokens){
// algorithm de
// be get ob first phrase indexes ya
// if tail word be junction 
// then recurse with next tokens ya

// be get ob first phrase indexes ya
var firstPhraseI = firstPhraseIndexParse(grammar,tokens);
if (grammar.wordOrder.clauseInitial === false){
// if tail word be junction 
var tail = tokens[firstPhraseI[1]-1];
var nextPhraseI = firstPhraseI;
var otherTokens = tokens;
var phraseEnd = firstPhraseI[1];
while (wordMatch(grammar.junctions,tail)){
// then recurse with next tokens ya
otherTokens = otherTokens.slice(nextPhraseI[1]);
nextPhraseI = firstPhraseIndexParse(grammar,otherTokens);
tail = tokens[nextPhraseI[1]-1];
phraseEnd += nextPhraseI[1]-2;
}
// if last token is top clause then subtract it
// if (tokens[phraseEnd])
firstPhraseI[1]=phraseEnd;
}
return firstPhraseI;
}// end of first junction phrase index parse ya


exports. lastType = 
	 lastTypeParse;
function lastTypeParse(grammar,tokens){
var indexes = lastTypeIndexParse(grammar,tokens);
return tokens.slice(indexes[0],indexes[1]);
}
exports. firstType = 
	 firstTypeParse;
function firstTypeParse(grammar,tokens){
var indexes = firstTypeIndexParse(grammar,tokens);
return tokens.slice(indexes[0],indexes[1]);
}

exports. lastTypeIndex = 
	 lastTypeIndexParse;
function lastTypeIndexParse(grammar,tokens){
// algorithm
// be get ob tokens from last ya
// assume end coincides with last word or length ya
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word before junction
// then set word after it as start ya
// return

// be get ob tokens from last ya
// assume end coincides with last word or length ya
var end = tokens.length;
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word before junction
var sentenceI 	= lastSentenceWordIndexParse(grammar, tokens);
var topClauseI 	= lastTopClauseWordIndexParse(grammar,tokens);
var caseI 	= lastCaseIndexParse(grammar,tokens);
var subPhraseI 	= lastSubPhraseWordIndexParse(grammar,tokens);
var subTypeI 	= lastSubTypeWordIndexParse(grammar,tokens);
var clauseI	= lastClauseWordIndexParse(grammar,tokens);
var junctionI	= lastJunctionWordIndexParse(grammar,tokens)-1;
var maxI = Math.max(-1, clauseI, subPhraseI, caseI, topClauseI, 
sentenceI, junctionI);
// then set word after it as start ya
var start = maxI+1;
// return
return [start,end];
}
exports. firstTypeIndex = 
	 firstTypeIndexParse;
function firstTypeIndexParse(grammar,tokens){
// algorithm
// be get ob tokens from first ya
// assume start coincides with first word or 0 ya
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word after junction
// then set word before it as end ya
// return

// be get ob tokens from first ya
// assume start coincides with first word or 0 ya
var start = 0;
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word before junction
var sentenceI 	= firstSentenceWordIndexParse(grammar, tokens);
var topClauseI 	= firstTopClauseWordIndexParse(grammar,tokens);
var caseI 	= firstCaseIndexParse(grammar,tokens);
var subPhraseI 	= firstSubPhraseWordIndexParse(grammar,tokens);
var subTypeI 	= firstSubTypeWordIndexParse(grammar,tokens);
var clauseI	= firstClauseWordIndexParse(grammar,tokens);
var junctionI	= firstJunctionWordIndexParse(grammar,tokens);
if (junctionI > -1) junctionI++;
// reset -1 to length
var length = tokens.length+1;
if (sentenceI  	<= -1) sentenceI  	= length;
if (topClauseI 	<= -1) topClauseI 	= length;
if (caseI 	<= -1) caseI 		= length;
if (subPhraseI 	<= -1) subPhraseI	= length;
if (clauseI	<= -1) clauseI		= length;
if (junctionI	<= -1) junctionI	= length;
var minI = Math.min(clauseI, subPhraseI, caseI, topClauseI, 
sentenceI, junctionI, length);
// then set word before it as end ya
var end = minI;
// return
return [start,end];
}

// Multi Sentence Quotes, or Subordinate Text Parsing
exports.subText = multiSentenceQuoteParse;
function multiSentenceQuoteParse(grammar, tokens){
var indexes = firstMultiSentenceQuoteIndexParse(grammar,tokens);
if (indexes === null) return new String();
return tokens.slice(indexes[0],indexes[1]);
}
function firstMultiSentenceQuoteIndexParse(grammar, tokens){
// algorithm de
// 
// be find ob verb phrase with start word at head ya
// be parse surrounding sentence of start phrase for start
// sentence ya
// be set ob start from start of start sentence ya
// be parse specific phrase ob verb phrase from start sentence
// ya
// be parse specific phrase ob subject phrase from start
// sentence ya
// be find ob end sentence tha with same ob subject phrase and
// verb phrase ya
// be set ob end from end of end sentence ya

// be find ob verb phrase with start word at head ya
// be parse surrounding sentence of start phrase for start
// sentence ya
// be set ob start from start of start sentence ya
// be parse specific phrase ob verb phrase from start sentence
// ya
// be parse specific phrase ob subject phrase from start
// sentence ya
// be find ob end sentence tha with same ob subject phrase and
// verb phrase ya
// be set ob end from end of end sentence ya


// be parse of first subordinate text ob tokens by grammar de
// aside data assignment  ya
// su quotes ob quotes of grammar ya
// su start word ob start word of quotes ya
// su verb word ob verb word of grammar ya
// su end word ob end word of quotes ya
//
// about main code ya
//
// about find ob start ya
// be find ob start word in tokens for start word index ya
// if su null be equal ob tha be check of verb phrase 
// ob tokens from start word index then return null ya
// su start ob tha be after ob previous sentence tail index ya
// 
// about find ob subject ya
// be slice ob tokens from previous sentence tail index
// till start sentence tail for start sentence ya
// be parse of specific phrase ob li su from start sentence 
// to subject phrase ya
// be slice ob tokens from start sentence tail index
// till length of tokens  for other tokens ya
//
// about find ob end verb ya
// be find ob end word in other tokens for end word index ya
// if su null be equal ob tha be check of verb phrase 
// ob tokens from end word index then return null ya
//
// about match ob subject phrase ya
// be parse of last sentence tail from end verb index 
// for end sentence start yand
// be parse of first sentence tail from end verb index
// for end sentence end ya
// be slice ob tokens from end sentence start til end sentence
// end  for end sentence ya
// if subject tokens not in end sentence
// then slice other tokens after it and jump to find end verb ya
//
// about set ob end ya
// su end ob that be after ob next sentence tail index ya
//
// be return ob start and end ya

// aside data assignment  ya
// su quotes ob quotes of grammar ya
var quotes = grammar.quotes;
// su start word ob start word of quotes ya
var startWord = quotes.startWord;
// su end word ob end word of quotes ya
var endWord = quotes.endWord;
//
// aside main code ya
//
// be find ob start word in tokens for start word index ya
var startWordIndex = tokens.find(wordMatch.curry([startWord]));
// if su null be equal ob tha be check of verb phrase 
// ob tokens by grammarfrom start word index 
// then be return ob null ya
if (false === verbPhraseCheck(grammar,tokens,startWordIndex))
return null;
// be parse of last sentence tail ob tokens from start word
// index for previous sentence tail index ya
var previousSentenceTailIndex = 
lastSentenceWordIndexParse(grammar,tokens,startWordIndex);
// su start ob tha be after ob previous sentence tail index ya
var start =  previousSentenceTailIndex+1;
//
// be parse of first sentence tail ob tokens from start word
// index for start sentence tail index ya
var startSentenceTailI = 1+
firstSentenceWordIndexParse(grammar,tokens,startWordIndex);
//
// be slice ob tokens from next sentence tail index
// till length of tokens  for other tokens ya
var otherTokens = tokens.slice(startSentenceTailI,tokens.length);

// about match ob subject phrase ya
// be find ob end word in other tokens for end word index ya
var endWordIndex = otherTokens.find(wordMatch.curry([endWord]));
// if su null be equal ob tha be check of verb phrase 
// ob tokens by grammar from end word index then return null ya
if (false === verbPhraseCheck(grammar,otherTokens,endWordIndex))
return null;
// be parse of first sentence tail ob tokens from end word
// index for next sentence tail index ya
var nextSentenceTailI = 
firstSentenceWordIndexParse(grammar,otherTokens,endWordIndex);

// about match ob subject phrase ya
// be parse of last sentence tail from end verb index 
// for end sentence start yand
// be parse of first sentence tail from end verb index
// for end sentence end ya
// be slice ob tokens from end sentence start til end sentence
// end  for end sentence ya
// if subject tokens not in end sentence
// then slice other tokens after it and jump to find end verb ya

// su end ob that be after ob next sentence tail index ya
var end = startSentenceTailI + nextSentenceTailI +1;
//
// be return ob start and end ya
return [start,end];
}


// be check of verb phrase ob tokens by grammar from index de
// su word order ob word order of grammar ya
// su postpositional ob postpositional of word order ya
// su verb word ob verb word of grammar ya
// if su postpositional be equal ob false 
// then tha if previous token be not equal ob verb word
// then tha be return ob null end-tha
// else tha if next token be not equal ob verb word 
// then tha be return ob null ya
// be return ob true ya

// be check of verb phrase ob tokens by grammar from index de
function verbPhraseCheck(grammar,tokens,index){
// su word order ob word order of grammar ya
var wordOrder = grammar.wordOrder;
// su postpositional ob postpositional of word order ya
var postpositional = wordOrder.postpositional;
// su verb word ob verb word of grammar ya
var verbWord = grammar.verbWord;
// if su postpositional be equal ob false 
if (postpositional === false){
// then tha if previous token be not equal ob verb word
// then tha be return ob false end-tha
if ( tokens[index-1] !== verbWord) return false;
}
// else tha if next token be not equal ob verb word 
// then tha be return ob false ya
else if (postpositional){
if ( tokens[index+1] !== verbWord) return false;
}
// be return ob true ya
return true;
}

function surroundingSentenceIndexParse(grammar,tokens,index){
// algorithm de
// be find ob sentence start ya
// be find ob sentence end ya
// be return ob start and end ya

// be find ob sentence start ya
var start = lastSentenceWordIndexParse(grammar,tokens,index);
// be find ob sentence end ya
var end = firstSentenceWordIndexParse(grammar,tokens,index);
// be return ob start and end ya
return [start,end];

}

// type head get
exports.typeHeadIndex = typeHeadIndexParse;
function typeHeadIndexParse(grammar, tokens){
var typeFinal = grammar.wordOrder.typeFinal;
var typeInitial = grammar.wordOrder.typeFinal === false;
var i;
var wordCount = 0;
if (typeFinal){
var length = tokens.length;
for (i = length-1; i>=0; i--){
if (tokenize.isGrammarWord(tokens[i]))
wordCount++;
else break;
}
// returns array of [bodyStart, bodyEnd, headStart, headEnd]
return [0,length-wordCount,length-wordCount,length];
}
else if (typeInitial){
var length = tokens.length;
for (i = 0; i<length; i++){
if (tokenize.isGrammarWord(tokens[i]))
wordCount++;
else break;
}
// returns array of [bodyStart, bodyEnd, headStart, headEnd]
return [wordCount,length,0,wordCount];
}
else throw new Error("typeFinal not defined in grammar");
}

},{"../class/quote":4,"../class/type":9,"../lang/grammar":15,"../lib/hof":18,"./tokenize":12}],12:[function(require,module,exports){
"use strict"
var hof = require("../lib/hof");
//module.exports = exports;
/// su tokenizer de
//var exports = new Object;
/// su stringToGlyphs be convert bo string to utf8 array ya
exports.stringToGlyphs= stringToGlyphs;
function stringToGlyphs(/*string*/string){
	return string.split('');
};
/// su glyphsToTokens bo glyphs utf8-array to word and space tokens de
/// be start of algorithm ya
/// be stencil bo glyphs with previous glyph 
///	by boundary detect to boundaries ya
/// be filter out bo empty value from boundaries ya
/// be stencil bo boundaries with previous boundary 
///	by slice glyphs to tokens ya
/// be optional filter out bo space tokens ya
/// be end of algorithm ya
///
function boundaryDetect(length,/*2 glyph array*/twoGlyphs,index){
	/// be algorithm bo quo te 
	///	get type of first and second glyph
	var previousGlyph =  twoGlyphs[0];
	var currentGlyph =  twoGlyphs[1];
	/// 	if type is boundary return index
	if (index+1===length) return index;
	if (previousGlyph==null) return index;
	///	if type is different return index
	if (/\s/.test(previousGlyph)!==/\s/.test(currentGlyph))
		return index;
	///	else return null ya
	return null;
}
exports.glyphsToTokens= glyphsToTokens;
function glyphsToTokens(/*glyph array*/glyphs){
//return tokens;
var glyphs = stringToGlyphs(string);
///	by boundary detect to boundaries ya
var boundaries = new Array();
//glyphs.stencil([-1,0],boundaryDetect.curry(glyphs.length));
var glyphsLength = glyphs.length;
var index;
for (index=0;index<=glyphsLength;index++){
	/// 	if type is boundary return index
	if (index===0||index===glyphsLength) boundaries.push(index);
	///	if type is different return index
	else if (/\s/.test(glyphs[index-1])!==/\s/.test(glyphs[index]))
		boundaries.push(index);
}
var tokens = new Array();
var boundariesLength = boundaries.length;
var startBoundary, endBoundary;
for (index=1;index<boundariesLength;index++){
	// return null if token is space
	startBoundary = boundaries[index-1];
	endBoundary = boundaries[index];
	tokens.push(
		glyphs.slice(startBoundary,endBoundary)
		.join(''));
	
}
return tokens;
};


exports.glyphsToWords = glyphsToWords;
function glyphsToWords(/*array*/glyphs){
var tokens = glyphsToTokens(glyphs);
/// be filter bo word tokens ya
var words = tokens.filter(isWord);
return words;
}
exports.stringToTokens = stringToTokens;
function stringToTokens(/*string*/string){
var glyphs = stringToGlyphs(string);
//var tokens = 
return glyphsToTokens(glyphs);
//return tokens;
}
exports.stringToWords = stringToWords;
function stringToWords(/*string*/string){
var glyphs = stringToGlyphs(string);
//var tokens = glyphsToTokens(glyphs);
///// be filter bo word tokens ya
////var words = 
//return tokens.filter(isWord);
//return words;
/// be stencil bo glyphs with previous glyph 
///	by boundary detect to boundaries ya
//
var boundaries = new Array();
//glyphs.stencil([-1,0],boundaryDetect.curry(glyphs.length));
var glyphsLength = glyphs.length;
var index;
for (index=0;index<=glyphsLength;index++){
	/// 	if type is boundary return index
	if (index===0||index===glyphsLength) boundaries.push(index);
	///	if type is different return index
	else if (/\s/.test(glyphs[index-1])!==/\s/.test(glyphs[index]))
		boundaries.push(index);
}
/// be stencil bo boundaries with previous boundary 
///	by glyphs slice to tokens ya
//var words = boundaries.stencil([-1,0],glyphsSlice);
//function glyphsSlice(sliceBounds){
//	if (sliceBounds[0]==null)
//		return null;
//	// return null if token is space
//	if (isSpace(glyphs[sliceBounds[0]])) return null;
//	return glyphs.slice(sliceBounds[0],sliceBounds[1]).join('');
//}
var words = new Array();
var boundariesLength = boundaries.length;
var startBoundary, endBoundary;
for (index=1;index<boundariesLength;index++){
	// return null if token is space
	startBoundary = boundaries[index-1];
	endBoundary = boundaries[index];
	if (!isSpace(glyphs[startBoundary])){
		words.push(
			glyphs.slice(startBoundary,endBoundary)
			.join(''));
	}
}
return  words;
//return tokens;
}

exports.isWord = isWord;
function isWord(string){
	return (/\S/.test(string)
		&& !/\s/.test(string));
}
exports.isSpace = isSpace;
function isSpace(string){
	return (/\s/.test(string)
		&& !/\S/.test(string));
}
exports.isTokens = isTokens;
function isTokens(inArray){
	if (!Array.isArray(inArray))
		return false;
	// if only one element, must be token
	if (inArray.length === 1)
		return true;
	var firstSpace = inArray.find(isSpace);
	var firstWord = inArray.find(isWord);
	if (firstWord !== null && firstSpace !== null)
		return true;
	return false;
}
exports.isWords = isWords;
function isWords(inArray){
	if (!Array.isArray(inArray))
		return false;
	var firstSpace = inArray.find(isSpace);
	var firstWord = inArray.find(isWord);
	if (firstWord !== null && firstSpace === null)
		return true;
	return false;
}

// recognize word based on phoneme class

// su phoneme class be dictionary of glyph with string ya
var phonemeClass = {
	".":["."],
	"H":["h"],
	"V":["i","a","e","o","u","6","I"],
	"C":["p","t","k","f","s","c","y","r","l","w","q",
		"m","n","x","b","d","g","z","j","v","C"],
	"T":["^","_"],
	"n":["n","m","q"], // nasals
	"f":["f","s","c","C","x","h","v","z","j"], // fricatives
	"p":["p","t","k","B","D","G"], // plosives
	"l":["l"], //liquids
	"t":["r"], // trills
	"g":["y","w"] // glides
}

function glyphClassGet(glyph){
if(phonemeClass["V"].indexOf(glyph)!==-1) return "V";
else 
if (phonemeClass["C"].indexOf(glyph)!==-1) return "C";
else 
if (phonemeClass["H"].indexOf(glyph)!==-1) return "H";
else return " ";
};


exports.wordClass = wordGlyphClassGet;
function wordGlyphClassGet(word){
var i;
var result = new String();
for (i=0;i<word.length;i++){
result += glyphClassGet(word[i]);
}
return result;
};


exports.isGrammarWord = isGrammarWord;
var grammarWords = ["CV","CCV"];
function isGrammarWord(word){
var glyphClass = wordGlyphClassGet(word);
if (grammarWords.indexOf(glyphClass) !== -1) return true;
/* else */ return false;
}

},{"../lib/hof":18}],13:[function(require,module,exports){
exports.word = wordTranslate;
function wordTranslate(subDictionary, word){
	if (subDictionary == undefined)
		return word; 
	var transl = subDictionary[word];	
	if ( transl == undefined){
		transl = word;
		//emi.on("warn",function(err){console.log(err)});
		//emi.emit("warn",word+" be lack bo translation ya");
		//console.error(word+" be lack bo translation ya");
		//throw new Error(word
		//	+" be lack bo translation ya"
		//	+" be check bo dictionary do");

	}
	return transl;

}
exports.array = arrayTranslate;
function arrayTranslate(subDictionary, array){
var result = new Array(),
    i;
for(i = 0; i<array.length; i++)
	result[i] = wordTranslate(subDictionary,array[i]);
return result;
}
exports.toJavascript =
	toJavascriptTranslate;
function toJavascriptTranslate(/*Text*/ textObject){
// algorithm: 
// assume is text object
//
// iterate through sentences
// turn phrases into an object

var sentences = textObject.sentences;
// iterate through sentences
var i;
for (i=0;i<sentences.length;i++){
// turn phrases into an object
var sentence = sentences[i];
var phrases = sentence.phrases;
var j;
for (j=0;j<phrases.length;j++){
phrases.head;
}
}
}
exports.conjugate = conjugate;
function conjugate(language,string,conjugationLevel){
    // search and replace based on grammar.conjugation
    var conjugation = language.grammar.conjugation;
    var stringBuffer = string.split("");
    if (conjugationLevel > 0){// conjugate
    var i;
    var reversible = conjugation.reversible;
    for (i=0;i<reversible.length;i++){
    var fromTo=reversible[i];
    var match=RegExp(fromTo[0],'g')
    var string = string.replace(match,fromTo[1]);
    }
    if (conjugationLevel > 1){// naturalize
    var irreversible = conjugation.irreversible;
    for (i=0;i<irreversible.length;i++){
    var fromTo=irreversible[i];
    var match = RegExp(fromTo[0],'g');
    var string =string.replace(match,fromTo[1]);
    } } }
    return string;
}
exports.disjugate = disjugate;
function disjugate(language,string,conjugationLevel){
// search and replace based on grammar.conjugation
}

},{}],14:[function(require,module,exports){

/// translator
/// be load bo dictionary from file ya
/// be translate bo word ya

var Text = require("../class/text");

module.exports = Dictionary;
function Dictionary(language, input){
	this.be = "Dictionary";
// make from mwak and to mwak objects
// algorithm:
//	make Text from input
	var text;
	if (typeof input === "string")
		text = new Text(language, input);
	else if (typeof input === "object"
		&& input.be === "Text")
		text = new Text(language, input);
	else if (typeof input === "object"
		&& input.be === "Dictionary"){
			this.fromMwak = input.fromMwak;
			this.toMwak = input.toMwak;
			return this;
		}
	//else if (Array.isArray(input)) toke
// if no input then blank dictionary ya
	else if (input === undefined){
		this.toMwak = new Object();
		this.fromMwak = new Object();
		return this;
	}
	else throw new TypeError(input+" unknown to "+this.be);
//	fromMwak is object mapping su contents to bo contents
	this.fromMwak = dictMake(language,text,["hu","ha"]);
//	toMwak is object mapping bo contents to su contents
	this.toMwak = dictMake(language,text,["ha","hu"]);
	return this;
}
Dictionary.prototype.copy = function(){
 	return new Dictionary(language, JSON.parse(JSON.stringify(this)));
}
function dictMake(language,text,cases){
// for each sentence ya 
// be get bo cases ya 
// be map bo key to value ya
// be return bo map ya
	// only select sentence with both cases
	var keyCase = cases[0];
	var valueCase = cases[1];
	var sentences = text.select(language,cases).sentences;
	var slength = sentences.length;
	var i, sentence, phrases,
	    j, plength, phrase, initial;
	var mapObject = new Object();
	for (i = 0; i < slength; i++){
		sentence = sentences[i];
		key = sentence.phraseGet(language,keyCase).valueGet();
		value = sentence.phraseGet(language,valueCase).valueGet();
		mapObject[key]=value;
	}
	return mapObject;
}

Dictionary.prototype.toString = function(format){
var joiner = ' ';
var newline = '\n';
var result = new String();
var fromMwak = this.fromMwak;
var suj = " li hu ";
var obj = " li ha ya";
for ( key in fromMwak )
if (fromMwak.hasOwnProperty(key))
result += key + suj + fromMwak[key] + obj+ newline;
return result;}

Dictionary.prototype.toLocaleString = function(language,format){
var joiner = ' ';
var newline = '\n';
if (format && format.newline) newline = format.newline;
var result = new String();
var fromMwak = this.fromMwak;
var Language = require("../lang/language");
var Sentence = require("../class/sentence");
var mwak = new Language();
var suj = " li hu ";
var obj = " li ha ya";
var wordOrder = language.grammar.wordOrder;
for ( key in fromMwak )
if (fromMwak.hasOwnProperty(key)){
value = fromMwak[key];
mwakSent = key + suj + value + obj;
sent = new Sentence(mwak, mwakSent);
result += sent.toLocaleString(language,format) + newline;
}
return result;
}


},{"../class/sentence":5,"../class/text":7,"../lang/language":16}],15:[function(require,module,exports){

var translate = require("../compile/translate");
module.exports = Grammar;
/// be load bo grammar de
function Grammar(wordOrder,dictionary,conjugation){
if (!dictionary&&!wordOrder&&!conjugation){
return mwakGrammar;
}
this.be = "Dictionary";
if (dictionary){
var dict = dictionary.fromMwak;
this.junctions=translate.array(dict, mwakGrammar.junctions);
this.typeWords=translate.array(dict, mwakGrammar.typeWords);
this.phraseWords=translate.array(dict, mwakGrammar.phraseWords);
this.pronouns=translate.array(dict, mwakGrammar.pronouns);
this.subjectWord=mwakGrammar.subjectWord;
this.objectWord=mwakGrammar.objectWord;
this.verbWord= translate.word(dict, mwakGrammar.verbWord);
this.topicWord=translate.word(dict, mwakGrammar.topicWord);
this.subPhraseWords=translate.array(dict,
		mwakGrammar.subPhraseWords);
this.subTypeWords=translate.array(dict,
		mwakGrammar.subTypeWords);
this.topClauseWords=translate.array(dict,
		mwakGrammar.topClauseWords);
this.topClauseTerminator=translate.array(dict,
		mwakGrammar.topClauseTerminator);
this.clauseWords=translate.array(dict,
		mwakGrammar.clauseWords);
this.clauseTerminator=translate.array(dict,
		mwakGrammar.clauseTerminator);
this.sentenceWords=translate.array(dict,
		mwakGrammar.sentenceWords);
this.number = new Object();
this.number.all=
translate.array(dict, mwakGrammar.number.all);
this.number.plural=
translate.word(dict, mwakGrammar.number.plural);
this.number.dual=
translate.word(dict, mwakGrammar.number.dual);
this.number.singular=
translate.word(dict, mwakGrammar.number.singular);
this.number.indefinite=
translate.word(dict, mwakGrammar.number.indefinite);
this.tense = new Object();
this.tense.all=
translate.array(dict, mwakGrammar.tense.all);
this.tense.past=
translate.word(dict, mwakGrammar.tense.past);
this.tense.present=
translate.word(dict, mwakGrammar.tense.present);
this.tense.future=
translate.word(dict, mwakGrammar.tense.future);
this.quotes = new Object();
this.quotes.quoteHeads=translate.array(dict, 
		mwakGrammar.quotes.quoteHeads);
this.quotes.singleWord=translate.array(dict, 
		mwakGrammar.quotes.singleWord);
this.quotes.numeral=translate.word(dict, 
		mwakGrammar.quotes.numeral);
this.quotes.multiWordHead=translate.array(dict, 
		mwakGrammar.quotes.multiWordHead);
this.quotes.multiWordTail=translate.array(dict, 
		mwakGrammar.quotes.multiWordTail);
this.quotes.literal=translate.array(dict, 
		mwakGrammar.quotes.literal);
this.quotes.startWord=translate.word(dict,
	mwakGrammar.quotes.startWord);
this.quotes.endWord=translate.word(dict,
	mwakGrammar.quotes.endWord);
}
this.wordOrder = new Object();
if (wordOrder){
this.wordOrder.headFinal= wordOrder.headFinal;
this.wordOrder.verbFinal= wordOrder.verbFinal;
this.wordOrder.nounFinal= wordOrder.nounFinal;
this.wordOrder.typeFinal= wordOrder.typeFinal;
this.wordOrder.topicInitial = wordOrder.topicInitial;
this.wordOrder.subjectProminent = wordOrder.subjectProminent;
this.wordOrder.postpositional= wordOrder.postpositional;
this.wordOrder.genitiveInitial= wordOrder.genitiveInitial;
this.wordOrder.clauseInitial= wordOrder.clauseInitial;
this.wordOrder.topClauseInitial= wordOrder.topClauseInitial;
this.wordOrder.phraseOrder= //wordOrder.phraseOrder;
translate.array(dict, wordOrder.phraseOrder);
this.wordOrder.littleEndian = wordOrder.littleEndian;
if (wordOrder.intransitiveWord)
this.wordOrder.intransitiveWord = wordOrder.intransitiveWord;
}
if(conjugation)
this.conjugation = conjugation;
return this;
}

var mwakGrammar = {
name: "mwak",
be: "Grammar",
junctions:["ki","wa","mwa"],
typeWords: ["li","sa","nyu","na","pa","yi","ni","tyi","nya"],
phraseWords: ["hi","ta","ha","hu","kya","su","ni","ka","mwa",
"fa","sla","la","tla","psu","pya","tsa","pli","su","wu"],
pronouns: ["mi","ti","si","tu","yu","tsi","pa"],
topicWord: "fa",
agentWord: "hu",
subjectWord: "hu",
objectWord: "ha",
verbWord: "hi",
subPhraseWords: ["kpi"],
subTypeWords: ["pi"],
topClauseWords: ["ku","twa","swi","pwa","kla","syu","kyu",
"sli","cya"],
topClauseTerminator: ["twa"],
clauseWords: ["kwa"],
clauseTerminator: ["klu"],
sentenceWords: ["ya","ci"],
number: {
all: ["lu","twu","fyu","myi"],
plural: "lu",
dual: "twu",
singular: "sya",
indefinite: "nyu",
paucal: "fyu",
multal: "myi"
},
tense: {
all: ["pu","nu","fu"],
past: "pu",
present: "nu",
future: "fu"
},
quotes: {
quoteHeads: ["li","tyi","na"],
singleWord: ["li"],
numeral: ["na"],
literal: ["li","tyi"],
multiWordHead: ["tyi"],
multiWordTail: ["ksa"],
startWord: "tip",
endWord: "kit"
},
wordOrder: {
headFinal: true,
verbFinal: true,
nounFinal: true,
typeFinal: true,
topicInitial: true,
subjectProminent: true,
postpositional: true,
clauseInitial: true,
topClauseInitial: true,
genitiveInitial: true,
littleEndian: false,
phraseOrder: ["ha","hi"],
intransitiveWord: "hu"
},
conjugation:{
    reversible:[],
    irreversible:[],
    phrase : (mwakPhrase),
    ipa : (mwakToIPA),
    word:(compoundWord),
    noun:(trochaicCompound),
    verb: (trochaicCompound),
    nounType: (typeCompound),
    verbType: (typeCompound),
    phraseHead: (phraseHead),
    verbHead: (phraseHead),
    clauseHead: (phraseHead),
    junctionHead: (phraseHead),
    sentenceHead: (phraseHead),
    mood: (trochaicCompound),
    format:{
        joiner:'',
        phraseJoiner:' ',
        clauseJoiner:' '
    },
}
} // end of mwak grammar object ya

function mwakPhrase(language, phrase, format, conjLevel) {
    var head = phrase.head && 
            phrase.head.toLocaleString(language, format, "ch", 
        conjLevel);
        body = phrase.body && 
            phrase.body.toLocaleString(language, format, "n", 
        conjLevel);
    if (body && head) return body + head;
    if (body) return body;
    if (head) return head;
    return "";
}

function mwakToIPA(string){
var i, glyph;
var len = string.length;
var result = new Array(len);
for (i=0;i<len;i++){
glyph = string[i];
if (glyph==="a") result[i]= "ä";
else if (glyph==="c") result[i]= "ʃ";
else if (glyph==="j") result[i]= "ʒ";
else if (glyph==="_") result[i]= "ʔ";
else if (glyph===".") result[i]= "ʔ";
else if (glyph==="y") result[i]= "j";
else if (glyph==="q") result[i]= "ŋ";
else if (glyph==="5") result[i]= "˦";
else if (glyph==="4") result[i]= "˨";
else if (glyph==="2") result[i]= "ə";
else if (glyph==="1") result[i]= "ɨ";
else if (glyph==="6") result[i]= "ɣ";
else result[i]=glyph;
}
return result.join("");
}


function byteAlign(IPA,word){
var pad= "h";
if (IPA === true) pad = "ʰ";
var result = new String();
if (word.length % 2 === 1) result = word+pad;
else result = word;
return result;
}

function stressByteAlign(IPA,word,index,array){
var pad= "h";
if (IPA === true) pad = "ʰ";
var result = new String();
var arLength = array.length;
var primaryStress = "\u02C8";
var secondaryStress = "\u02CC";
if (word.length % 2 === 1) result = word+pad;
else result = word;
if ((/*arLength-*/index) % 2 === 0) return primaryStress+result;
else return secondaryStress+result;
}

function compoundWord(language,wordO,format,conjLevel){
var head = new String();
var body = new String();
var IPA = format && format.ipa;
if (Array.isArray(wordO.head))
    head = wordO.head.map(byteAlign.curry(IPA)).join("");
else if (wordO.head) head = byteAlign(IPA,wordO.head);
if (Array.isArray(wordO.body))
    body = wordO.body.map(byteAlign.curry(language)).join("");
else if (wordO.body) body = byteAlign(IPA,wordO.body);
var result = body + head;
if (IPA === true) result = mwakToIPA(result) ;
return result;
}

function trochaicCompound(language,wordO,format,conjLevel){
if (format && format.rhythm !== true)
return wordO.toLocaleString(language,format,undefined,conjLevel);
var head = new String();
var body = new String();
var IPA = format && format.ipa;
var primaryStress = "\u02C8";
if (format && format.secondaryRhythm !== false)
var secondaryStress = "\u02CC";
else secondaryStress = new String();
if (Array.isArray(wordO.head))
head = wordO.head.map(byteAlign.curry(IPA)).join("");
else if (wordO.head) head = byteAlign(IPA,wordO.head);
if (Array.isArray(wordO.body))
body = wordO.body.map(stressByteAlign.curry(IPA)).join("");
else if (wordO.body) body = stressByteAlign(IPA,wordO.body);
var result = new String();
if (body.length>0)
result += body;
if (body.length%2===0) result +=  primaryStress+head;
else result +=  primaryStress+head;
if (IPA) return mwakToIPA(result) ;
else return result;
}


function phraseHead(language,wordO,format,conjLevel){
if (format && format.rhythm !== true)
return wordO.toLocaleString(language,format,undefined,conjLevel);
var head = new String();
var body = new String();
var IPA = format.ipa;
var primaryStress = "\u02C8";
if (format && format.secondaryRhythm !== false)
var secondaryStress = "\u02CC";
else secondaryStress = new String();
if (format.secondaryRhythm === false) secondaryStress = "";
if (Array.isArray(wordO.head))
head = wordO.head.map(byteAlign.curry(IPA));
else if (wordO.head) head = byteAlign(IPA,wordO.head);
if (Array.isArray(wordO.body))
body = wordO.body.map(byteAlign.curry(IPA));
else if (wordO.body) body = byteAlign(IPA,wordO.body);
var result = body+secondaryStress+head;
if (IPA) return mwakToIPA(result) ;
else return result;
}


function typeCompound(language,typeO,format,conjLevel){
if (format && format.rhythm !== true)
return typeO.toLocaleString(language,format,undefined,conjLevel);
var head = new String();
var body = new String();
var limb = new String();
var primaryStress = "\u02C8";
if (format && format.secondaryRhythm !== false)
var secondaryStress = "\u02CC";
else secondaryStress = new String();
if (typeO.limb)
limb = 
typeO.limb.toLocaleString(language,format,"th",conjLevel);
if ((typeO.head))
head =
typeO.head.toLocaleString(language,format,"th",conjLevel);
if ((typeO.body))
body = typeO.body.toLocaleString(language,format,"n",conjLevel);
var result = new String();
if (limb.length>0) result+= limb;
if (body.length >0 && head.length >0) 
result += body+secondaryStress+head;
else if (body.length >0) result += body;
else if (head.length  >0) result += primaryStress+head;
//if (format.ipa) return mwakToIPA(result) ;
//else return result;
return result;
}


},{"../compile/translate":13}],16:[function(require,module,exports){
var Grammar = require("./grammar");
var Dictionary = require("./dictionary");
module.exports = Language;
function Language(grammar,dictionary){
	this.be = "Language";
	if (!grammar) this.grammar = new Grammar();
	else this.grammar = grammar;
	if (!dictionary) this.dictionary = new Dictionary();
	else this.dictionary = dictionary;
	return this;
}

},{"./dictionary":14,"./grammar":15}],17:[function(require,module,exports){
exports.stackTrace = function stackTrace() {
    var err = new Error();
    return err.stack;
}
exports.indexCheck= function(length,index){
	if (typeof index != "number")
		throw new TypeError("su index bo "+index+" must be number ya"+
		"\n find version accepts string match ya");
	if (index === -1 || index >= length) // if none
		throw new RangeError("su index bo "+index+" be too large or small ya");
}

},{}],18:[function(require,module,exports){
////////////////////////////////////////////////////////////////
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file wordPhonotactics.js for higher order functions ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya

"use strict";
/// curry
Object.prototype.curry = function(args){
	return this.bind(null,args);
}
/// be expand bo array by function de
/// su expand be like bo map ya 
///	but if su function be return bo array 
///	then su expand be concat bo result ya
///	and if su function bo return bo null
///	then expand be skip bo element ya
Array.prototype.expand = function(func){
	if (typeof func != "function")
		throw new TypeError("su expand be need by function ya");
	var length = this.length >>> 0;
	var result = new Array();
	var providedThis = arguments[1];
	var i, val, res;
	for (i = 0; i < length; i ++){
		if (i in this) {
			val = this[i];
			res = func.call(providedThis, val, i, this);
			if (res !== null)
				result = result.concat(res);
		}
	}
	return result;
};
// stencil
/// be stencil bo array with offset array by function de
/// su stencil be like bo expand ya 
///	but with multiple element as input to function 
///		via array from offset array ya
exports.cofc = contigiousOffsetCheck;
function contigiousOffsetCheck(offsets){
	// if offsets are not one after other then false
	var prevOffset = null,
	    length = offsets.length,
	    offset, index;
	for (index=0; index < length; index++){
		offset = offsets[index];
		if (prevOffset !== null){
			prevOffset = prevOffset+1;
		   	if( prevOffset != offset)
				return false;
		}
		prevOffset = Number(offset);
	}	
	// else true
	return true;
}
Array.prototype.stencil = function(/*array*/offsets,func){
	//console.log("stenciling");
	if (typeof func != "function")
		throw new TypeError("su stencil be need by function ya");
	if (!Array.isArray(offsets))
		throw new TypeError("su stencil be need with offset array ya");
	var length = this.length >>> 0;
	var offsetsLength = offsets.length >>> 0;
	var contigiousOffsets = contigiousOffsetCheck(offsets);
	var valFunction = forStencil;
	function forStencil(array,index){ // default slow
			var val = new Array(); // to hold offsets
			var j, offset;
			//console.log("offsets"+offsets);
			//console.log(array);
			//console.log(length);
			for (j=0;j<offsetsLength;j++){
				offset = offsets[j];
				// if it does not exit make null
				if (index+offset<0
				   ||index+offset>length)
					val = val.concat(null);
				else val = val.concat(array[index+offset]);
			}
			//console.log("forSt "+val);
			return val;
	}
	var firstOffset = offsets[0];
	function sliceStencil(array,index){
		if (index+firstOffset<0
		   || index+offsetsLength>array.length){
			return forStencil(array,index);
		   }
		//console.log("sliceSt "+array.slice(index+firstOffset,
		//		   index+offsetsLength));
		return array.slice(index+firstOffset,
				   index+offsetsLength);
	}
	if (contigiousOffsets ){
		//console.log("slice stencil");
		valFunction = sliceStencil;
	}
	//else console.log("for stencil");
	var result = new Array();
	var providedThis = arguments[1];
	var i, res, val, offset;
	for (i = 0; i < length; i++){
		if (i in this) {
			val = valFunction(this,i);
			res = func.call(providedThis, val, i, this);
			if (res !== null)
				result = result.concat(res);
		}
	}
	return result;
};
// map
// reduce
/// su find be based on find from EcmaScript 6 ya
/// be return ob index or null ya
Array.prototype.find = function(func){
	if (typeof func != "function")
		throw new TypeError("su find be need by function ya");
	var length = this.length >>> 0;
	var providedThis = arguments[1];
	var i, j;
	for (i = 0; i < length; i++)
		if (i in this) 
			if (func.call(providedThis, this[i], i, this))
				return i;
	return null;
}
/// su rfind bo reverse find ya
Array.prototype.rfind = function(func){
	if (typeof func != "function")
		throw new TypeError("su find be need by function ya");
	var length = this.length >>> 0;
	var providedThis = arguments[1];
	var i, j;
	for (i = length-1; i >= 0; i--)
		if (i in this) 
			if (func.call(providedThis, this[i], i, this))
				return i;
	return null;
}
//
//// attach the .equals method to Array's prototype to call it on any array
//Array.prototype.equals = function (array) {
//// if the other array is a falsy value, return
//	if (!array)
//		return false;
//// compare lengths - can save a lot of time
//	if (this.length != array.length)
//		return false;
//	for (var i = 0, l=this.length; i < l; i++) {
//// Check if we have nested arrays
//		if (this[i] instanceof Array && array[i] instanceof Array) {
//// recurse into the nested arrays
//			if (!this[i].equals(array[i]))
//			return false;
//		}
//		else if (this[i] != array[i]) {
//// Warning - two different object instances will never be equal: {x:20} != {x:20}
//			return false;
//		}
//	}
//	return true;
//}

Object.prototype.equals = function(match){
	if (JSON.stringify(this)==(JSON.stringify(match)))
		return true;
	return false;
}
Array.prototype.isSubset = function(match){
	var i;
	var length = this.length;
	if (this.length===0)
		return true;//su empty set be always bo subset ya
	for (i=0;i<length;i++)
		if(match.indexOf(this[i])===-1)
			return false;
	return true;
}
Array.prototype.isSuperset = function(match){
	var i;
	var length = match.length;
	if (match.length===0)
		return true;//su empty set be always bo subset ya
	for (i=0;i<length;i++)
		if(this.indexOf(match[i])===-1)
			return false;
	return true;
}
Array.prototype.isLike = function(match){
	if (this.isSubset(match)
		||this.isSuperset(match))
		return true;
	return false;
}
//Object.prototype.copy = function(){
//	return JSON.parse(JSON.stringify(this));
//}


},{}],19:[function(require,module,exports){
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for input output functions files ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict";
var fs = require('fs');
/// IO
exports.fileRead = function(filename){
	function readFileCallback(err,data){
		if (err){
			throw err;
		}
		return data;
	}
	return fs.readFileSync(filename,"utf8",readFileCallback);
}
exports.fileWrite = function(filename,data){
	return fs.writeFileSync(filename,data);
}

},{"fs":45}],20:[function(require,module,exports){
"use strict";
var base = "../../";
var Text = require("../../class/text");
var Phrase = require("../../class/phrase");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var mwak = new Language();
var translate = require("../../compile/translate");
var wrld = require("../../locale/wrld/wrld");
var parse = require("../../compile/parse");

module.exports = English;
function English(srcBase){
try {
var engFile = require("./eng.txt.json");
var engText = new Text(mwak,engFile);
}
catch(e){
console.log(e);
console.log("JSON load failed, attempting from text");
var io = require("../../lib/io");
var engFile = io.fileRead("./eng.txt");
var engText = new Text(mwak,engFile);
}
var engDict = new Dictionary(mwak,engText);
var engWordOrder = {
	headFinal : false,
	verbFinal : false,
	nounFinal : true,
	typeFinal : false,
	topicInitial : false,
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["hu","hi","ha"],
};
var conjugation = {
reversible:[
],
irreversible:[
[" ya$",". "],
[" ya ",". "]
]
}

var isPronoun = wrld.conjugation.isPronoun;
//conjugation.copula = "is";
//conjugation.nominal = wrld.conjugation.copulaNominal;

function nounConjugate(language,Word,format,conjLevel,ender){
    if (ender === undefined) ender = "";
    var head, body,
        joiner = " ",
        nounSuffix = "an",
        fromMwak = language.dictionary.fromMwak;
    if (ender === "S") {
        nounSuffix = "a";
        ender = "";
    }
    if (Word.body){
        var body = translate.array(fromMwak, Word.body);
        body = body.map(function(word) { return word; });
        body = body.join(joiner);
    }
    if (Word.head){
        var head = translate.word(fromMwak, Word.head);
        head = head + nounSuffix + ender;
    }
    
    var result = new String();
    if (body && head) result = body + joiner + head;
    else { 
        if (head) result = head;
        else if (body)  result = body;
    }
    return result;
}
conjugation.noun = nounConjugate;


function pluralize(Type,body,head){
    var result = new String();
    var joiner = " ";
    var number = mwak.grammar.number;
    if (body){
        if (Type.head && Type.head.head && 
                parse.wordMatch(number.all, Type.head.head)){
            if (parse.wordMatch(number.plural, Type.head.head))
                result= body.replace(/$/, "s"); 
            else result= head+joiner+body.replace(/$/, "s"); 
        } else if (Type.head) {
            result = head + joiner + body;
        } else {
            result = body; 
        }
    }
    else if (head) result = head;
    return result + joiner;
}

function nounTypeConjugate(language,Type,format,conjLevel){
    var result = new String();
    var body = new String();
    var head = new String();
    var limb = new String();
    if (Type.limb)
    limb = Type.limb.toLocaleString(language, format, "n",
        conjLevel);
    if (Type.body) {
        var body = Type.body.toLocaleString(language, format,
            "n", conjLevel);
    }
    if (Type.head) {
        head = Type.head.toLocaleString(language, format, "th", 
            conjLevel);
    }
    // pluralize
    result = pluralize(Type, body, head)
    if (limb.length>0)
    result+= limb;
    return result;
}
conjugation.nounType = nounTypeConjugate;


function phraseConjugate(language,phrase,format,conjLevel,ender){
    var joiner = " ";
    if (phrase.body){
        var body = phrase.body.toLocaleString(language, format,
            "n", conjLevel);
    }
    if (phrase.head)
        var adposition = phrase.head.toLocaleString(language,
            format, "ch", conjLevel);
    if (phrase.clause)
        var clause = phrase.clause.toLocaleString(language, 
            format, "n", conjLevel);
    if(phrase.subPhrase){
        var subPhrase = phrase.subPhrase.toLocaleString(
            language, format, "n", conjLevel);
    }
    var result = new String();
    if (adposition) result += adposition + joiner;
    if (body) result += body + joiner;
    if (subPhrase) result += subPhrase + joiner;
    if (clause) result += clause + joiner;
    result = result.replace(/  $/, " ");
    return result;
}
conjugation.phrase = phraseConjugate;


function subjectPhraseConjugate(language,phrase,format,conjLevel){
    // exceptions
    var joiner = " ";
    var head = phrase && phrase.body && phrase.body.head 
        && phrase.body.head.head;
    if (head === "mi") return "I"+joiner;
    else if (head === "tu") return "thou"+joiner;
    else if (head === "yu") return "ye"+joiner;
    else if (head === "si") return "they"+joiner;
    // main
    var result = new String();
    var newPhrase = phrase.copy(language);
    delete newPhrase.head;
    var body;
    if (newPhrase.body && newPhrase.body.type === "mwq") {
        return wrld.conjugation.citationQuote(
            language,newPhrase.body, format) + " ";
    }
    if (phrase.body && phrase.body.be !== "Junction"){
        if (newPhrase.body.body) {
            var body = nounConjugate(language, 
                newPhrase.body.body, format, conjLevel, "S")
        }
        if (newPhrase.body.head) {
            var head = newPhrase.body.head.toLocaleString(
                language, format, conjLevel)
        }
        // pluralize
        var Type = phrase.body;
        result = pluralize(Type,body,head);
        delete newPhrase.body.body;
        delete newPhrase.body.head;
    }
    result +=
    phraseConjugate(language,newPhrase,format,conjLevel,"n")
    return result;
}
conjugation.subjectPhrase = subjectPhraseConjugate;

function 
objectPhraseConjugate(language,phrase,format,conjLevel){
    console.log(" eng obj phrase "+phrase.toString());
    var result = new String(),
        joiner = " ";
    var newPhrase = phrase.copy(language);
    delete newPhrase.head;
    var body;
    if (newPhrase.body && newPhrase.body.type === "mwq") {
        return wrld.conjugation.citationQuote(
            language,newPhrase.body, format) + " ";
    }
    if (phrase.body && phrase.body.be !== "Junction"){
        if (newPhrase.body.body) {
            var body = nounConjugate(language, 
                newPhrase.body.body, format, conjLevel)
        }
        if (newPhrase.body.head) {
            var head = newPhrase.body.head.toLocaleString(
                language, format, conjLevel)
        }
        // pluralize
        var Type = phrase.body;
        result = pluralize(Type,body,head);
        delete newPhrase.body.body;
        delete newPhrase.body.head;
    }
    result +=
    phraseConjugate(language,newPhrase,format,conjLevel,"n")
    if (isPronoun(phrase)) return result;
    return result;
}
conjugation.objectPhrase = objectPhraseConjugate;

function affixStrip(word){
if (isVowel(word[word.length-1]))
word=word.replace(/.$/,"");
return word;
}
var vowels = ["a","e","i","o","e"];
function isVowel(glyph){
if (vowels.indexOf(glyph)!== -1) return true;
else false;
}


conjugation.mood = moodConjugate;
function moodConjugate(language,Word,format,conjLevel){
    var fromMwak = language.dictionary.fromMwak;
    var word = translate.word(fromMwak,Word.head);
    word = word;
    return word+"e";
}


conjugation.verbAgreement = verbAgreementConjugate;
function verbAgreementConjugate(language,sentence,format,conjLevel){
var phrases = sentence.phrases;

var subjectIndex = phrases.find(function(phrase){
if (
( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hu"))
return true; else return false;
});

var subjectBody = new String();
if (subjectIndex !== null) 
subjectBody = phrases[subjectIndex].body.toString();

var verbIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hi"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hi")
return true; else return false;
});

if (verbIndex === null) var phrase = new Phrase(mwak,"hi");
else var phrase = phrases[verbIndex];

var joiner = " ";
var head = new String();
var verb = new String();
var adverbs = new Array();
if (phrase.body){
if (phrase.body.body){
var mwakVerb = phrase.body.body.head;
var mwakParticiples = phrase.body.body.body;
var fromMwak = language.dictionary.fromMwak;
verb = translate.word(fromMwak,mwakVerb);
if (mwakParticiples){
adverbs = translate.array(fromMwak,mwakParticiples);
}
}
if (phrase.body.head){
head = phrase.body.head.toLocaleString(language,format,"v",
conjLevel);}
}
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();
/* infinitive tense is default */

var verbMods = new String();
if (phrase.body && phrase.body.head
&& phrase.body.head.body){
verbMods = translate.array(fromMwak,phrase.body.head.body);
}
if (head.length>0 && verb.length>0) 
result = head+joiner+verbMods+verb+"eth";  
else if (head.length>0) result = head;
else if (verb.length>0) result = affixStrip(verb)+"eth";
else result = adposition;
 
if (verb.length > 0)/* normal conjugation */{
var tense = mwak.grammar.tense
var tenseWord = phrase.body 
&& phrase.body.head && phrase.body.head.head;
if (phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){

/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
verb = verbMods + joiner +affixStrip(verb);
if (subjectBody === "mi") result = verb+"e"; 
else if (subjectBody === "tu") result= verb+"est";
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = verb+"eth"; 
else if (subjectBody === "wi") result = verb;
else if (subjectBody === "yu") result= verb;
else if (subjectBody === "gents"
||  subjectBody === "ladies"
||  subjectBody === "si") result = verb+"eth"; 
else result = verb+"eth";


}
/* past tense */
else if (parse.wordMatch(tense.past,tenseWord)){
verb = verb;
if (subjectBody === "mi") result = verb+"ed"; 
else if (subjectBody === "tu") result= verb+"ed"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = verb+"ed"; 
else if (subjectBody === "wi") result = verb+"ed";
else if (subjectBody === "yu") result= verb+"ed"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = verb+"ed"; 
else result = verb+"ed";

}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
verb = verb;
if (subjectBody === "mi") result = "will "+verb+"e"; 
else if (subjectBody === "tu") result = "will "+verb+"est"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "will "+verb+"eth"; 
else if (subjectBody === "wi") result = "will "+verb+"eth"; 
else if (subjectBody === "yu") result = "will "+verb+"eth"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "will "+verb; 
else result = "will "+verb+"eth";
}
}
}
else if (verb.length <= 0 && sentence.nominal)/* nominal */{
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head){
tenseWord = phrase.body.head.head;
}
if (subjectBody.length > 0 && phrase.body && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
var body = adposition; /* be */
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = "was"; 
else if (subjectBody === "tu") result= "was"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "was"; 
else if (subjectBody === "wi") result= "were"; 
else if (subjectBody === "yu") result= "were"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "were"; 
else result =  "were";
}
/* present tense */
else if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = "am"; 
else if (subjectBody === "tu") result= "is"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = "is"; 
else if (subjectBody === "wi") result= "are"; 
else if (subjectBody === "yu") result= "are"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "are"; 
else result =  "is";
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
body = "will"
//if (subjectBody === "mi") result = body; 
//else if (subjectBody === "tu") result = body; 
//else if (subjectBody === "il"
//||  subjectBody === "elle"
//||  subjectBody === "ti") result = body; 
//else if (subjectBody === "wi") result = body; 
//else if (subjectBody === "yu") result = body; 
//else if (subjectBody === "ils"
//||  subjectBody === "elles"
//||  subjectBody === "si") result = body; 
}
}
}
else result = head+joiner+verb;


if (adverbs.length>0){
adverbs = adverbs.map(function(word){
return word + "ly"});
adverbs = adverbs.join(joiner);
result += joiner + adverbs;
}

return result+joiner;
} // end of verbAgreement

conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();


// tense
var tense = mwak.grammar.tense
if (phrase.body.head && phrase.body.head.head
&& parse.wordMatch(tense.all,phrase.body.head.head)){
result = body; 
}
else if (adposition)
result = adposition+joiner+body;
else result = body;
return result+joiner;
}

//conjugation.verbHead = verbHeadConjugate;
//function verbHeadConjugate(string) {
//return 'to';}
//conjugation.phraseHead = phraseHeadConjugate;
//function phraseHeadConjugate(string) {
//return string;}

conjugation.foreignQuote = 
wrld.conjugation.citationQuote;

var engGrammar = new Grammar(engWordOrder,engDict,conjugation);
var eng = new Language(engGrammar,engDict);
return eng;
}

exports.code = "eng";

},{"../../class/phrase":3,"../../class/text":7,"../../compile/parse":11,"../../compile/translate":13,"../../lang/dictionary":14,"../../lang/grammar":15,"../../lang/language":16,"../../lib/io":19,"../../locale/wrld/wrld":22,"./eng.txt.json":21}],21:[function(require,module,exports){
module.exports={"be":"Text","sentences":[{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"be"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ha"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ob"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"su"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"me"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ma"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"what"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"masculine"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ki"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"and"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ka"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"as"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ku"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"if"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"yi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"this"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"yu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"you"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"of"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"that"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"did"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"we"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"or"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"by"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ni"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"in"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"na"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"numeral"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"now"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"si"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"them"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"the"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"su"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"from"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ti"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"it"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ta"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"to"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"thee"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"li"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"li"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"la"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hey"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"lu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plural"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"feminine"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"about"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"will-be"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ci"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"eh?"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"eh?"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ca"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"neuter"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"and/or"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"myi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"many"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"maybe"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mwa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"with"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kyi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"near"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"aside"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kyu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"because"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kwa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"that-which"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ksi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"extreme"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ksa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"unquote"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ksu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"than"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kli"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"exclusive-or"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kla"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"but"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"klu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"clause-tail"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kfa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fraction"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kci"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"then"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kca"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"there"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pyi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"verb-affix"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"on"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pwa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"yaor"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"psi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"before"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"psa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"former"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"psu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"from-source"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pli"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"for-example"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pfi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"binary-value"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pci"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"also"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pca"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"should"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"namely"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nyi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"not"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nyu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"an"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"syi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"very"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"singular"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"syu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"so"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"swi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"while"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"swa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"otherwise"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"swu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"so"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sli"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"else-if"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sla"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hello"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tyi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"quote"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"after"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tyu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"him"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"twa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"outside-of"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"twu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"dual"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tsi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"yes"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tsa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"untill"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tsu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"except"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tli"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ord"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tla"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"for"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tlu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"floating-point-number"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tfa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"at"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tci"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"here"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tcu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"to-destination"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fyu"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"few"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fwa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"for"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cyi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"her"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cya"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"else"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cwa"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"byebye"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cla"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"in-language"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"make"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"miy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"memory"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"past"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"min"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"less"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"middle"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"machine"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"word"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"man"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"faith"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mass"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mother"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mix"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"month"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"male"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"help"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"full"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"compare"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kiy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"go"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"go"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"capable"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"main"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"high"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"each"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"come"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"head"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"know"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cause"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"get"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"all"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cathode"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"trade"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"grow"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"buy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"red"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"food"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"goal"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"small"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"negate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"write"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wait"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"some"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"read"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"width"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"limb"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"up"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"good"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yuw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"year"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"subtract"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"use"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"whole"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"good"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"multiply"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"white"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"piss"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"arm"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"body"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"more"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"paw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"place"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"meet"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pass"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"father"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"joy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"path"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"bad"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"child"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"poo"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"put"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sell"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"blue"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"empty"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"week"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"win"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"win"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"level"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tail"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"light"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"big"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"name"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"yet"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"niy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"need"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"without"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"net"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"energy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"energy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"number"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"exhale"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"naw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"present"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sibling"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"night"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"bare"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"new"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"anode"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"null"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"similar"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"height"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sip"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"set"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"easy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"same"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"agree"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"say"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"say"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"simple"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"saw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"black"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"san"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"self"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sound"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"saf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"space"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"suck"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lose"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pay"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"own"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"size"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"team"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hold"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"day"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"start"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wall"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"see"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"inhale"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"til"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"low"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"topic"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"add"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"put"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"touch"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"taw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"via"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"give"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"choose"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tie"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"below"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"temperature"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"drink"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"repeat"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"depth"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"down"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"result"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tool"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"difficult"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"toy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"charge"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"inside"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"live"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"glyph"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"left"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"end"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"love"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"female"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"family"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"happen"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"above"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"future"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hear"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"move"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ciy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"green"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sign"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"life"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"must"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"divide"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"home"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"thing"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"right"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"can"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"chance"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"shape"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"show"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"dream"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"remember"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ally"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"soft"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"math"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"value"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"venture"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"employ"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"import"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"moral"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"myuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"oppose"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mwis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"average"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mwit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"member"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mwas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wet"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mwat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"substance"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mwut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"resist"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"game"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cloth"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"general"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"than"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"credit"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"circle"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"corporation"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"carry"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"to-close"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hard"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"emergency"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"group"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fun"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"rule"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kyuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"excuse"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kwit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"gravity"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kwic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"village"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kwam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"unit-of-mass"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kwat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"strong"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kwul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"call"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"expect"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksiy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"expert"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"access"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"context"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"exit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"crystal"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"compete"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"dark"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tell"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"rope"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"advise"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"exact"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"explain"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"accident"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"exercise"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"communicate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"strange"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"brief"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"contract"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"collect"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"school"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"dry"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ksuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fall"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"science"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kliy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clear"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"electron"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"key"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"labour"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cry"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"clap"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klaw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"laugh"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"colony"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"class"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clause"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"claim"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"language"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"column"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"global"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hunger"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"closet"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"klut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"exclude"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kluc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"crime"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"config"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"effect"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"confirm"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fraction"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"adjective"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ear"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cup"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"conference"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kfus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"describe"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"chemical"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"agent"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"skill"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"estimate"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cure"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"occupy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hunt"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cost"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"eight"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cupboard"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"escape"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"commission"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"conjugate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mess"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"shell"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kcuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"enough"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"break"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"experience"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"predict"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"four"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"appeal"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"verb"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"peace"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"program"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"practice"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyaw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"couple"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"spread"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fast"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bring"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"parallel"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"perform"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wonder"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pronoun"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyuk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"publish"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"bird"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"process"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"proton"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"boil"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"proof"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pyuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"project"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pwit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"believe"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pwil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"variable"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pway"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"away"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pwan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pipe"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pwas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"answer"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pwus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"presence"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pwut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"approve"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"reverse"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"discrimination"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psiy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pressure"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"spin"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"speed"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"spell"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"praise"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"page"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"prepare"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"spit"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"expand"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"surface"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sail"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"reply"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"prize"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"protest"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"source"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"source"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"promise"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"breast"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"psuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"expression"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plane"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"particle"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plasma"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fwas","body":["lik","mast"]}},"head":{"be":"Word","head":"hi"}}],"head":{"be":"Word","head":"ya"}},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"apply"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"play"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"play"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plan"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"planet"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"problem"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pluk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"plug"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pluy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"popular"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"probably"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"plut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"dust"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"profession"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfiy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"behave"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fin"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"period"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"prefer"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"parent"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bury"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fail"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"plenty"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"open"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pfus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"bus"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"money"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"business"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"appreciate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"special"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"schedule"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"exchange"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"paw"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"spend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"jump"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hope"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"person"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pants"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bridge"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pcuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"eyebrow"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mirror"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"reference"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"unit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rise"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"enter"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nails"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"invite"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ionize"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"neutron"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nyul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"roll"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nwat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"equivalent"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"seven"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sick"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clean"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syiw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"serve"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"send"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cell"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"reserve"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"research"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"stay"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"awake"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"order"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyan"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"solid"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syuk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"strict"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rub"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"universe"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"syut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"support"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"switch"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"soul"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"conscious"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"water"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"equal"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"persuade"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"question"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"swun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sleep"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"example"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"single"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sliy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"secular"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"always"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cieling"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"to-split"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"word"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"stairs"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sublimate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"listen"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"side"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wrong"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"alone"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sluf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"follow"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tremble"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"decay"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"again"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"three"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"address"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cold"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"translate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"direction"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"atom"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"shout"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"try"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyaw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"idea"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"string"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"throw"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"justice"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"deliver"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"attend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"transition"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyuk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"object"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"robot"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"other"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"case"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"different"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tyuc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"teach"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"twis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"true"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tway"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"door"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"twal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"welcome"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"twuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"doorway"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"twuf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"two"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"together"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tax"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsiy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"story"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"step"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsiw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"satellite"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"instruction"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"deserve"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"trial"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"purpose"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"attack"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"star"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"respect"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"state"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"taste"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsac"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"increase"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"study"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsuk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"shop"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"stop"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"noun"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tsul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"adult"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"electricity"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ordinal"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"desire"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlic"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pleasure"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"belong"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"rectangle"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fold"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"treatment"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tradition"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"dish"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"only"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tlun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"triple-point"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"temporary"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"traffic"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"individual"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"difference"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"define"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"dirt"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"transfer"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"disaster"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"file"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"friend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"phone"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tfus"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"damage"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"dimension"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"check"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tciy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"change"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"chain"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"jail"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"chew"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"speak"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"attitude"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"transparent"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tree"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"chat"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"join"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcuk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"trick"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"attention"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"drop"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcuw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"outside"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"power"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tcul"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"title"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"immediate"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"offical"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"front"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pleasant"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fame"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyaw"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"adverb"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"celebrate"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"phrase"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"interpret"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"reform"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"warn"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fyut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fruit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fwis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kind"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fwil"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"force"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fway"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"variety"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fwap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"five"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fwas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"phase"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flim"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"metalloid"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"influence"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flute"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flay"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fly"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flood"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flat"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fluk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"flower"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flup"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"floor"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"please"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"float"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fluc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flow"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyik"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"share"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyip"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"news"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"learn"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyis"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"across"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyit"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"teeth"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"obvious"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hinge"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyap"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"branch"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"include"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"character"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyat"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"danger"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"shelf"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyaf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"reveal"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"room"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cyut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"condition"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cwif"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"recieve"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cwam"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"evening"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cwan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"vagina"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cwal"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"swallow"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cwuy"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"care"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clin"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"relation"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clak"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ankle"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clan"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"origin"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clas"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hall"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clum"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sentence"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clun"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"knee"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"clut"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"supercritical-fluid"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"miyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"minor"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"miyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"aware"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"miwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"death"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mink"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mind"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"minp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"between"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"minute"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"misp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"suspect"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"measure"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mils"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"military"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"milt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"melt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"milc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wash"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mift"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"method"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mention"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mayk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mark"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mayp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"map"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mayn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"harmony"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mays"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"border"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mayt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"land"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mayc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"image"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"brain"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"magenta"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mask"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mask"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"masp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bother"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mast"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"matter"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"malk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"advertisement"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"malp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"reward"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"malt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"metal"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"malf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"oil"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"malc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"regret"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"maft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"admit"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mack"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"imagine"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"major"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"improve"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fool"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"emote"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"die"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mouth"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"munk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"possible"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"munt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mood"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"musk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"music"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"musp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wrist"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"must"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"most"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"modulo"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"die"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"muct"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"important"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kimt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"comittee"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kiyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"paper"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kiyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"one"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"convert"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kisp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"exponent"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"replace"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kift"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"forgive"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"exceed"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kamp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"camp"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kamt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"amount"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kaym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"gather"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kayp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"edge"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kayn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"flow-current"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kays"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"grammatical-case"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kayt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"card"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kawp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cover"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kawn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hang"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kaws"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"gas"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kawt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bed"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kanp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"connect"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"constant"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kasp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"catch"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kast"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"create"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kalp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cable"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kals"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"galaxy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kalc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"complain"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kafp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"accept"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kaft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"active"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kact"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hot"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kump"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"complex"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"command"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"common"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"copy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"critical-point"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"code"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kunp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"shut"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kusp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"collapse"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kust"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"record"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kulp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"claw"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuls"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cruel"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"culture"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kulc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"spoon"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kufp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"recover"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"coat"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kucp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"skin"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kuct"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"knife"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yimt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"rhythm"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yiwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"revolt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yink"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ring"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yinp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"return"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"today"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"risk"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yisp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"export"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"yesterday"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yilk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yellow"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yils"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"age"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yilt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"Eulers-number"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yilc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"already"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yifk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wealthy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yift"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"worth"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"reject"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yamt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"admire"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yawt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ride"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rock"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yanp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ordinary"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rent"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yask"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ask"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yasp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"work"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yast"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"gratis"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yalk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"vehicle"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yalt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"early"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yalf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"travel"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yafk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"react"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yaft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"row"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yact"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ration"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yumk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"public"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mercy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yunk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"train"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yunt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"container"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yusk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"east"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yusp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rob"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yust"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"rest"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yulp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"role"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"utility"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yulf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"useful"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yuck"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"root"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"yuct"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"relate"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pimt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"possess"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"piyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"experiment"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"piyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"opine"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"piys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pi"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"piyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"depend"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"operate"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"penis"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"permit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pilt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ticket"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pest"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pamk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"prompt"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pamt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"permanent"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"paym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"port"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"payn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ban"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pays"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"base"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"payt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bite"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"payc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"price"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"trap"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"plant"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pask"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bag"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"past"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"produce"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"palk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"back"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pals"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"explode"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"palt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"politics"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pack"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"box"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pact"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"part"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"belly"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"stumble"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"grammatical-object"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bottom"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cross"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"report"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puyc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pour"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"provide"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"punk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"leg"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"punt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"point"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pusk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"load"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pust"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"mail"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pulk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"polygon"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"puls"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"kiss"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"bottle"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"pulf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"eyelid"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wind"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"invest"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ways"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"face"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wayt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wire"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"bowl"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wasp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"robe"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"walk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"wave"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wuym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"volume"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wuyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"vote"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wunk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"elbow"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wulp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rib"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wuls"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"responsible"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"old"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nimt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nonmetal"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"niyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nearby"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"niyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"avoid"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"niyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nth-root"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"niws"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nose"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"niwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"network"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"ingredient"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nisp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"principle"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nice"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nilk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nuclear"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nilt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"intelligence"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nift"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nine"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nick"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"naked"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"native"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"namt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"appoint"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"naym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"normal"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nayk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"deny"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nays"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"organize"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nayt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"rare"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nayc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"nation"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nask"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"interest"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nasp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"transport"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nast"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"install"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nals"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"contact"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nalt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nature"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nafk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"window"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"naft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"artificial"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nack"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"examine"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nact"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"interfere"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"numk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"economy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"numt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"note"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"announce"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"noise"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"north"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nusk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"anus"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nusp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"forget"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nust"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"notice"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nulk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"neck"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nulp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"noble"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuls"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"zero"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"birth"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hostile"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"nuck"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"never"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"simk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"one-second"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"simp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"seed"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"simt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"system"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"summary"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"secret"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"precise"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"seem"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suggest"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siyc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"series"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"siwc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"situation"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sink"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"decrease"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sinp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"appear"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"feel"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"silk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"six"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"silt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"settle"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"silf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"civilian"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sifk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"lack"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sifp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"position"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sift"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"shift"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sick"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sex"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sad"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"samk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"eye"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"samt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hour"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"saym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"stretch"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sayk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wise"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sayp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"supply"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sayn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"save"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sayt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"speed-of-light"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sayf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sacrifice"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sayc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"investigate"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"often"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sanp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"extend"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"art"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"salk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"kill"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"salp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"surplus"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"salt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"salt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"salf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"health"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"salc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"social"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"saft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"safety"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sack"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"twilight"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sacp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"punish"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sact"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"shoot"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sumk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"success"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sump"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"morning"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"subject"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suffer"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"absorb"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"structure"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"correct"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sunk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"trunk"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sunp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suppose"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sunt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"south"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"soldier"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sulc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"solution"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sufk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"spine"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sacred"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"suck"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"socket"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sucp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"spouse"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"timk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"grammar"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"late"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ten"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"type"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"continue"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"distance"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiyf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"drive"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiyc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"delay"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiwk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"develop"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tiws"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"theater"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tink"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"think"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tinp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tense"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"text"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tisp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"represent"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tilk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"label"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tilc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"technology"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tifk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"activity"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tick"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"debt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ticp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"almost"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tamk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"look"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tamp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"debate"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"taym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"time"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tayk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"attach"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tayp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"top"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tayn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"area"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tays"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"stand"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tayf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"offer"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tayc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"degree"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tawk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"authority"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sudden"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tanp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tape"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tape"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"task"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"task"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tasp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"arrest"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"talk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"talk"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"talp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"table"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tals"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pretend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"talf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hide"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"talc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"entitle"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tafp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"defend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tack"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"thank"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tacp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"discuss"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tumk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"vomit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tump"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"temple"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"world"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"doctor"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"prototype"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"turn"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"thief"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuyc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"destroy"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuwm"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"duration"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuwk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"duty"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuwn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tone"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tunk","body":["/sˈa5˧n","tɕjˈɑu2˧˥ʔ","ɕˈiɜŋ/","三角形",":zh.","/tɹˈaɪaŋɡəl/","triangle",":en.","/tɾiˈaŋɡulo/","triángulo",":es.","/tɾɪkˈoːɳ/","त्रिकोण",":hi.","/mθlθ/","مثلث",":ar.","/sˈɛɡi","tˈiɡa/","segi","tiga",":id.","/trʲiuɡˈoɭnik/","треугольник",":ru.","/pˈembe","tˈatu/","pembe","tatu",":sw.","/øtʃɟˈæn/","üçgen",":tr.","/kˈolmɪo/","kolmio",":fi.","/trˈiːaŋəl/","triangel",":sv.","/mosˈallas/","مثلث",":fa.","/trˈiɣonˌo/","τρίγωνο",":el.","10","t,","8","u,","8","n,","8","k,","8","a,","7","l,","7","i,","6","y,","4","m,","3","s,","3","c,","1","p,","1","f,","0","w,"]}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"triangle"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tunp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"adapt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tusk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"progress"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tusp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"gut"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tulk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"total"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tulp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"pain"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tufk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"aim"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"tuck"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"dictionary"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"limk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"perfect"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"limt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"limit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liquid"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"library"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"line"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liberty"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"leader"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liwk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"legal"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"liwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"gift"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"link"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"link"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"linp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"length"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"lend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"vacation"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"list"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"least"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lifk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"release"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lick"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"lecture"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"licp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"leaf"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lict"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"elect"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lamk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"law"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lamt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"local"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"layk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lake"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"layt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"eleven"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"layc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"literature"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"laws"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"lazy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tongue"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"slow"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lask"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"offend"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lasp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fight"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"last"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"list"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"laft"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"benefit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lumk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"logarithm"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"melody"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"luwt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lute"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lunk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"logic"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lunp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"loop"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lunt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"people"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lufk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lock"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fiym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"firm"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fiyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"prevent"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fiys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"version"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fiwn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"evidence"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fink"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"finger"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"find"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"affix"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"famk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"familiar"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"faym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"farm"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fayk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"factory"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fayt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fact"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"event"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fask"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"extra"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fast"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"visit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fals"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"false"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"falt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"default"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fack"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"fire"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fact"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sufficient"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"tomorrow"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fuym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"form"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fuyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"poor"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fuys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"offence"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"funk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"function"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"funt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"trust"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fusk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"focus"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fust"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"skirt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"hotel"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"fulc"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hair"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cimt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"imaginary-unit"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ciyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sure"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ciyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"region"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"ciwk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hamlet"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cink"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"wish"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cint"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"genital"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cisk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sharp"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cisp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"particular"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cist"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"history"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cilk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"cheek"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cils"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"resolve"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cilt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"stillness"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"camk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"shirt"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cayk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"judge"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cayp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"shame"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cayn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"survive"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cays"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"award"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cayf"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"jaw"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cawn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"animal"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cank"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"sign"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"canp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"habit"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cant"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hand"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cast"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"station"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"calk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"heart"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cafk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"victim"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cumt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"enemy"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cuym"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"rumour"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cuyk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"burn"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cuyp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"hip"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cuyn"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"river"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cuys"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"house"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cuyt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"city"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cunk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sing"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cunt"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"sew"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cusk"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"town"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cusp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"shoes"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cust"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"exist"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"culp"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"smell"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true},{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"cult"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"shoulder"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ha"}}],"head":{"be":"Word","head":"ya"},"nominal":true}]}
},{}],22:[function(require,module,exports){

var parse = require("../../compile/parse");
var Language = require("../../lang/language");
var mwak = new Language();
exports.wordOrder =  function(){return svoWordOrder;};
var svoWordOrder = {
headFinal : false,
verbFinal : false,
typeFinal : false,
subjectProminent: true,
clauseInitial: false,
genitiveInitial: false,
typeFinal : false,
phraseOrder: ["sla","ku","twa","hu","hi","ha"]
};
var conjugation = new Object();
conjugation.guillemetSpaceQuote = 
function(language,foreignQuoteObject,format){
var typeFinal = language.grammar.wordOrder.typeFinal;
if (typeFinal)
return '« '+foreignQuoteObject.body.join(" ")+' »'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (typeFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'« '+foreignQuoteObject.body.join(" ")+' »';
else return '« '+foreignQuoteObject.body.join(" ")+' »';
}
conjugation.guillemetQuote = 
function(language,foreignQuoteObject,format){
var typeFinal = language.grammar.wordOrder.typeFinal;
if (typeFinal)
return '«'+foreignQuoteObject.body.join(" ")+'»'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (typeFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'«'+foreignQuoteObject.body.join(" ")+'»';
else return '«'+foreignQuoteObject.body.join(" ")+'»';
}
conjugation.citationQuote = 
function (language,foreignQuoteObject,format){
console.log("citation quote");
var typeFinal = language.grammar.wordOrder.typeFinal;
if (typeFinal)
return '“'+foreignQuoteObject.body.join(" ")+'”'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (typeFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'“'+foreignQuoteObject.body.join(" ")+'”';
else return '“'+foreignQuoteObject.body.join(" ")+'”';
}


conjugation.copulaNominal =
function (language, sentence, format, conjLevel){

var result = new String();
var joiner = " ";
var copula = language.grammar.conjugation.copula;


var phrases = sentence.phrases;

var subjectIndex = sentence.phrases.find(function(phrase){
if ( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body.head === "hu")
return true; else return false;
});

if (subjectIndex !== null){
var subjectPhrase = sentence.phrases[subjectIndex];
result += subjectPhrase.toLocaleString
(language,format,"n",conjLevel);
}

var objectIndex = phrases.find(function(phrase){
if ( phrase.head.head === "ha"
|| phrase.head.head === "fa" && phrase.head.body.head === "ha")
return true; else return false;
});

result += copula + " "; 

if (objectIndex !== null){
var objectPhrase = phrases[objectIndex];
result +=
objectPhrase.toLocaleString(language,format,"n",conjLevel);
}

if (sentence.head)
result +=
sentence.head.toLocaleString(language,format,"sh",conjLevel);

return  result;

}

conjugation.isPronoun  = 
function (phrase){
var pronouns = mwak.grammar.pronouns;
var body = phrase && phrase.body
&& phrase.body.head && phrase.body.head.head;
var i;
if (parse.wordMatch(pronouns,body)){
 return true;
}

return false;
}



exports.conjugation = conjugation;



},{"../../compile/parse":11,"../../lang/language":16}],23:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.3.3
(function() {
  var FFI, fs, getOutput, libc, tmpDir, uniqId, uniqIdK;

  FFI = require("ffi");

  libc = new FFI.Library(null, {
    "system": ["int32", ["string"]]
  });

  fs = require("fs");

  uniqIdK = 0;

  uniqId = function() {
    var prefix;
    prefix = 'tmp';
    return prefix + (new Date()).getTime() + '' + (uniqIdK++) + ('' + Math.random()).split('.').join('');
  };

  tmpDir = function() {
    var dir, name, _i, _len, _ref;
    _ref = ['TMPDIR', 'TMP', 'TEMP'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      if (process.env[name] != null) {
        dir = process.env[name];
        if (dir.charAt(dir.length - 1) === '/') {
          return dir.substr(0, dir.length - 1);
        }
        return dir;
      }
    }
    return '/tmp';
  };

  getOutput = function(path) {
    var output;
    output = fs.readFileSync(path);
    fs.unlinkSync(path);
    output = "" + output;
    if (output.charAt(output.length - 1) === "\n") {
      output = output.substr(0, output.length - 1);
    }
    return output;
  };

  module.exports = function(cmd, returnOutAndErr) {
    var dir, error, id, result, stderr, stdout;
    if (returnOutAndErr == null) {
      returnOutAndErr = false;
    }
    id = uniqId();
    stdout = id + '.stdout';
    stderr = id + '.stderr';
    dir = tmpDir();
    cmd = "" + cmd + " > " + dir + "/" + stdout + " 2> " + dir + "/" + stderr;
    libc.system(cmd);
    result = getOutput("" + dir + "/" + stdout);
    error = getOutput("" + dir + "/" + stderr);
    if (returnOutAndErr) {
      return {
        stdout: result,
        stderr: error
      };
    } else {
      if (error !== '') {
        throw new Error(error);
      }
      return result;
    }
  };

}).call(this);

}).call(this,require('_process'))
},{"_process":53,"ffi":31,"fs":45}],24:[function(require,module,exports){
(function (process,Buffer){

/**
 * Module dependencies.
 */

var assert = require('assert')
  , debug = require('debug')('ffi:_ForeignFunction')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , FFI_ARG_SIZE = bindings.FFI_ARG_SIZE


function ForeignFunction (cif, funcPtr, returnType, argTypes) {
  debug('creating new ForeignFunction', funcPtr)

  var numArgs = argTypes.length
  var argsArraySize = numArgs * POINTER_SIZE

  // "result" must point to storage that is sizeof(long) or larger. For smaller
  // return value sizes, the ffi_arg or ffi_sarg integral type must be used to
  // hold the return value
  var resultSize = returnType.size >= ref.sizeof.long ? returnType.size : FFI_ARG_SIZE
  assert(resultSize > 0)

  /**
   * This is the actual JS function that gets returned.
   * It handles marshalling input arguments into C values,
   * and unmarshalling the return value back into a JS value
   */

  var proxy = function () {
    debug('invoking proxy function')

    if (arguments.length !== numArgs) {
      throw new TypeError('Expected ' + numArgs +
          ' arguments, got ' + arguments.length)
    }

    // storage buffers for input arguments and the return value
    var result = new Buffer(resultSize)
      , argsList = new Buffer(argsArraySize)

    // write arguments to storage areas
    var i, argType, val, valPtr
    try {
      for (i = 0; i < numArgs; i++) {
        argType = argTypes[i]
        val = arguments[i]
        valPtr = ref.alloc(argType, val)
        argsList.writePointer(valPtr, i * POINTER_SIZE)
      }
    } catch (e) {
      e.message = 'error setting argument ' + i + ' - ' + e.message
      throw e
    }

    // invoke the `ffi_call()` function
    bindings.ffi_call(cif, funcPtr, result, argsList)

    result.type = returnType
    return result.deref()
  }

  /**
   * The asynchronous version of the proxy function.
   */

  proxy.async = function () {
    debug('invoking async proxy function')

    var argc = arguments.length
    if (argc !== numArgs + 1) {
      throw new TypeError('Expected ' + (numArgs + 1) +
          ' arguments, got ' + argc)
    }

    var callback = arguments[argc - 1]
    if (typeof callback !== 'function') {
      throw new TypeError('Expected a callback function as argument number: ' +
          (argc - 1))
    }

    // storage buffers for input arguments and the return value
    var result = new Buffer(resultSize)
    var argsList = new Buffer(argsArraySize)

    // write arguments to storage areas
    var i, argType, val, valPtr
    try {
      for (i = 0; i < numArgs; i++) {
        argType = argTypes[i]
        val = arguments[i]
        valPtr = ref.alloc(argType, val)
        argsList.writePointer(valPtr, i * POINTER_SIZE)
      }
    } catch (e) {
      e.message = 'error setting argument ' + i + ' - ' + e.message
      return process.nextTick(callback.bind(null, e));
    }

    // invoke the `ffi_call()` function asynchronously
    bindings.ffi_call_async(cif, funcPtr, result, argsList, function (err) {
      // make sure that the 4 Buffers passed in above don't get GC'd while we're
      // doing work on the thread pool...
      cif = cif;
      funcPtr = funcPtr;
      argsList = argsList;

      // now invoke the user-provided callback function
      if (err) {
        callback(err)
      } else {
        result.type = returnType
        callback(null, result.deref())
      }
    })
  }

  return proxy
}
module.exports = ForeignFunction

}).call(this,require('_process'),require("buffer").Buffer)
},{"./bindings":25,"_process":53,"assert":46,"buffer":47,"debug":38,"ref":43}],25:[function(require,module,exports){

module.exports = require('bindings')('ffi_bindings.node')

},{"bindings":37}],26:[function(require,module,exports){

/**
 * Module dependencies.
 */

var ref = require('ref')
  , CIF = require('./cif')
  , assert = require('assert')
  , debug = require('debug')('ffi:Callback')
  , _Callback = require('./bindings').Callback

/**
 * Turns a JavaScript function into a C function pointer.
 * The function pointer may be used in other C functions that
 * accept C callback functions.
 */

function Callback (retType, argTypes, abi, func) {
  debug('creating new Callback')

  if (typeof abi === 'function') {
    func = abi
    abi = void(0)
  }

  // check args
  assert(!!retType, 'expected a return "type" object as the first argument')
  assert(Array.isArray(argTypes), 'expected Array of arg "type" objects as the second argument')
  assert.equal(typeof func, 'function', 'expected a function as the third argument')

  // normalize the "types" (they could be strings, so turn into real type
  // instances)
  retType = ref.coerceType(retType)
  argTypes = argTypes.map(ref.coerceType)

  // create the `ffi_cif *` instance
  var cif = CIF(retType, argTypes, abi)
  var argc = argTypes.length

  return _Callback(cif, retType.size, argc, function (retval, params) {
    debug('Callback function being invoked')

    var args = []
    for (var i = 0; i < argc; i++) {
      var type = argTypes[i]
      var argPtr = params.readPointer(i * ref.sizeof.pointer, type.size)
      argPtr.type = type
      args.push(argPtr.deref())
    }

    // Invoke the user-given function
    var result = func.apply(null, args)
    try {
      ref.set(retval, 0, result, retType)
    } catch (e) {
      e.message = 'error setting return value - ' + e.message
      throw e
    }
  })
}
module.exports = Callback

},{"./bindings":25,"./cif":27,"assert":46,"debug":38,"ref":43}],27:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var Type = require('./type')
  , assert = require('assert')
  , debug = require('debug')('ffi:cif')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , ffi_prep_cif = bindings.ffi_prep_cif
  , FFI_CIF_SIZE = bindings.FFI_CIF_SIZE
  , FFI_DEFAULT_ABI = bindings.FFI_DEFAULT_ABI
  // status codes
  , FFI_OK = bindings.FFI_OK
  , FFI_BAD_TYPEDEF = bindings.FFI_BAD_TYPEDEF
  , FFI_BAD_ABI = bindings.FFI_BAD_ABI

/**
 * JS wrapper for the `ffi_prep_cif` function.
 * Returns a Buffer instance representing a `ffi_cif *` instance.
 */

function CIF (rtype, types, abi) {
  debug('creating `ffi_cif *` instance')

  // the return and arg types are expected to be coerced at this point...
  assert(!!rtype, 'expected a return "type" object as the first argument')
  assert(Array.isArray(types), 'expected an Array of arg "type" objects as the second argument')

  // the buffer that will contain the return `ffi_cif *` instance
  var cif = new Buffer(FFI_CIF_SIZE)

  var numArgs = types.length
  var _argtypesptr = new Buffer(numArgs * POINTER_SIZE)
  var _rtypeptr = Type(rtype)

  for (var i = 0; i < numArgs; i++) {
    var type = types[i]
    var ffiType = Type(type)

    _argtypesptr.writePointer(ffiType, i * POINTER_SIZE)
  }

  // prevent GC of the arg type and rtn type buffers (not sure if this is required)
  cif.rtnTypePtr = _rtypeptr
  cif.argTypesPtr = _argtypesptr

  if (typeof abi === 'undefined') {
    debug('no ABI specified (this is OK), using FFI_DEFAULT_ABI')
    abi = FFI_DEFAULT_ABI
  }

  var status = ffi_prep_cif(cif, numArgs, _rtypeptr, _argtypesptr, abi)

  if (status !== FFI_OK) {
    switch (status) {
      case FFI_BAD_TYPEDEF:
        var err = new Error('ffi_prep_cif() returned an FFI_BAD_TYPEDEF error')
        err.code = 'FFI_BAD_TYPEDEF'
        err.errno = status
        throw err
        break;
      case FFI_BAD_ABI:
        var err = new Error('ffi_prep_cif() returned an FFI_BAD_ABI error')
        err.code = 'FFI_BAD_ABI'
        err.errno = status
        throw err
        break;
      default:
        throw new Error('ffi_prep_cif() returned an error: ' + status)
        break;
    }
  }

  return cif
}
module.exports = CIF

}).call(this,require("buffer").Buffer)
},{"./bindings":25,"./type":36,"assert":46,"buffer":47,"debug":38,"ref":43}],28:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var Type = require('./type')
  , assert = require('assert')
  , debug = require('debug')('ffi:cif_var')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , ffi_prep_cif_var = bindings.ffi_prep_cif_var
  , FFI_CIF_SIZE = bindings.FFI_CIF_SIZE
  , FFI_DEFAULT_ABI = bindings.FFI_DEFAULT_ABI
  // status codes
  , FFI_OK = bindings.FFI_OK
  , FFI_BAD_TYPEDEF = bindings.FFI_BAD_TYPEDEF
  , FFI_BAD_ABI = bindings.FFI_BAD_ABI

/**
 * JS wrapper for the `ffi_prep_cif_var` function.
 * Returns a Buffer instance representing a variadic `ffi_cif *` instance.
 */

function CIF_var (rtype, types, numFixedArgs, abi) {
  debug('creating `ffi_cif *` instance with `ffi_prep_cif_var()`')

  // the return and arg types are expected to be coerced at this point...
  assert(!!rtype, 'expected a return "type" object as the first argument')
  assert(Array.isArray(types), 'expected an Array of arg "type" objects as the second argument')
  assert(numFixedArgs >= 1, 'expected the number of fixed arguments to be at least 1')

  // the buffer that will contain the return `ffi_cif *` instance
  var cif = new Buffer(FFI_CIF_SIZE)

  var numTotalArgs = types.length
  var _argtypesptr = new Buffer(numTotalArgs * POINTER_SIZE)
  var _rtypeptr = Type(rtype)

  for (var i = 0; i < numTotalArgs; i++) {
    var ffiType = Type(types[i])
    _argtypesptr.writePointer(ffiType, i * POINTER_SIZE)
  }

  // prevent GC of the arg type and rtn type buffers (not sure if this is required)
  cif.rtnTypePtr = _rtypeptr
  cif.argTypesPtr = _argtypesptr

  if (typeof abi === 'undefined') {
    debug('no ABI specified (this is OK), using FFI_DEFAULT_ABI')
    abi = FFI_DEFAULT_ABI
  }

  var status = ffi_prep_cif_var(cif, numFixedArgs, numTotalArgs, _rtypeptr, _argtypesptr, abi)

  if (status !== FFI_OK) {
    switch (status) {
      case FFI_BAD_TYPEDEF:
        var err = new Error('ffi_prep_cif_var() returned an FFI_BAD_TYPEDEF error')
        err.code = 'FFI_BAD_TYPEDEF'
        err.errno = status
        throw err
        break;
      case FFI_BAD_ABI:
        var err = new Error('ffi_prep_cif_var() returned an FFI_BAD_ABI error')
        err.code = 'FFI_BAD_ABI'
        err.errno = status
        throw err
        break;
      default:
        var err = new Error('ffi_prep_cif_var() returned an error: ' + status)
        err.errno = status
        throw err
        break;
    }
  }

  return cif
}
module.exports = CIF_var

}).call(this,require("buffer").Buffer)
},{"./bindings":25,"./type":36,"assert":46,"buffer":47,"debug":38,"ref":43}],29:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var ForeignFunction = require('./foreign_function')
  , assert = require('assert')
  , debug = require('debug')('ffi:DynamicLibrary')
  , bindings = require('./bindings')
  , funcs = bindings.StaticFunctions
  , ref = require('ref')
  , read  = require('fs').readFileSync

// typedefs
var int = ref.types.int
  , voidPtr = ref.refType(ref.types.void)

var dlopen  = ForeignFunction(funcs.dlopen,  voidPtr, [ 'string', int ])
  , dlclose = ForeignFunction(funcs.dlclose, int,     [ voidPtr ])
  , dlsym   = ForeignFunction(funcs.dlsym,   voidPtr, [ voidPtr, 'string' ])
  , dlerror = ForeignFunction(funcs.dlerror, 'string', [ ])

/**
 * `DynamicLibrary` loads and fetches function pointers for dynamic libraries
 * (.so, .dylib, etc). After the libray's function pointer is acquired, then you
 * call `get(symbol)` to retreive a pointer to an exported symbol. You need to
 * call `get___()` on the pointer to dereference it into it's acutal value, or
 * turn the pointer into a callable function with `ForeignFunction`.
 */

function DynamicLibrary (path, mode) {
  if (!(this instanceof DynamicLibrary)) {
    return new DynamicLibrary(path, mode)
  }
  debug('new DynamicLibrary()', path, mode)

  if (null == mode) {
    mode = DynamicLibrary.FLAGS.RTLD_LAZY
  }

  this._handle = dlopen(path, mode)
  assert(Buffer.isBuffer(this._handle), 'expected a Buffer instance to be returned from `dlopen()`')

  if (this._handle.isNull()) {
    var err = this.error()

    // THIS CODE IS BASED ON GHC Trac ticket #2615
    // http://hackage.haskell.org/trac/ghc/attachment/ticket/2615

    // On some systems (e.g., Gentoo Linux) dynamic files (e.g. libc.so)
    // contain linker scripts rather than ELF-format object code. This
    // code handles the situation by recognizing the real object code
    // file name given in the linker script.

    // If an "invalid ELF header" error occurs, it is assumed that the
    // .so file contains a linker script instead of ELF object code.
    // In this case, the code looks for the GROUP ( ... ) linker
    // directive. If one is found, the first file name inside the
    // parentheses is treated as the name of a dynamic library and the
    // code attempts to dlopen that file. If this is also unsuccessful,
    // an error message is returned.

    // see if the error message is due to an invalid ELF header
    var match

    if (match = err.match(/^(([^ \t()])+\.so([^ \t:()])*):([ \t])*invalid ELF header$/)) {
      var content = read(match[1], 'ascii')
      // try to find a GROUP ( ... ) command
      if (match = content.match(/GROUP *\( *(([^ )])+)/)){
        return DynamicLibrary.call(this, match[1], mode)
      }
    }

    throw new Error('Dynamic Linking Error: ' + err)
  }
}
module.exports = DynamicLibrary

/**
 * Set the exported flags from "dlfcn.h"
 */

DynamicLibrary.FLAGS = {};
Object.keys(bindings).forEach(function (k) {
  if (!/^RTLD_/.test(k)) return;
  var desc = Object.getOwnPropertyDescriptor(bindings, k)
  Object.defineProperty(DynamicLibrary.FLAGS, k, desc)
});


/**
 * Close this library, returns the result of the dlclose() system function.
 */

DynamicLibrary.prototype.close = function () {
  debug('dlclose()')
  return dlclose(this._handle)
}

/**
 * Get a symbol from this library, returns a Pointer for (memory address of) the symbol
 */

DynamicLibrary.prototype.get = function (symbol) {
  debug('dlsym()', symbol)
  assert.equal('string', typeof symbol)

  var ptr = dlsym(this._handle, symbol)
  assert(Buffer.isBuffer(ptr))

  if (ptr.isNull()) {
    throw new Error('Dynamic Symbol Retrieval Error: ' + this.error())
  }

  ptr.name = symbol

  return ptr
}

/**
 * Returns the result of the dlerror() system function
 */

DynamicLibrary.prototype.error = function error () {
  debug('dlerror()')
  return dlerror()
}

}).call(this,require("buffer").Buffer)
},{"./bindings":25,"./foreign_function":32,"assert":46,"buffer":47,"debug":38,"fs":45,"ref":43}],30:[function(require,module,exports){
(function (process){

/**
 * Implementation of errno. This is a #define :/
 * On Linux, it's a global variable with the symbol `errno`,
 * On Darwin it's a method execution called `__error`.
 * On Windows it's a method execution called `_errno`.
 */

/**
 * Module dependencies.
 */

var DynamicLibrary = require('./dynamic_library')
  , ForeignFunction = require('./foreign_function')
  , ref = require('ref')
  , errnoPtr = null
  , int = ref.types.int
  , intPtr = ref.refType(int)

if (process.platform == 'darwin' || process.platform == 'mac') {
  var __error = DynamicLibrary().get('__error')
  errnoPtr = ForeignFunction(__error, intPtr, [])
} else if (process.platform == 'win32') {
  var _errno = DynamicLibrary('msvcrt.dll').get('_errno')
  errnoPtr = ForeignFunction(_errno, intPtr, [])
} else {  // linux, sunos, etc.
  var errnoGlobal = DynamicLibrary().get('errno').reinterpret(int.size)
  errnoPtr = function () { return errnoGlobal }
  // set the errno type
  errnoGlobal.type = int
}


function errno () {
  return errnoPtr().deref()
}
module.exports = errno

}).call(this,require('_process'))
},{"./dynamic_library":29,"./foreign_function":32,"_process":53,"ref":43}],31:[function(require,module,exports){

/**
 * Module dependencies.
 */

var ref = require('ref')
var assert = require('assert')
var debug = require('debug')('ffi:ffi')
var Struct = require('ref-struct')
var bindings = require('./bindings')

/**
 * Export some of the properties from the "bindings" file.
 */

;['HAS_OBJC', 'FFI_TYPES',
, 'FFI_OK', 'FFI_BAD_TYPEDEF', 'FFI_BAD_ABI'
, 'FFI_DEFAULT_ABI', 'FFI_FIRST_ABI', 'FFI_LAST_ABI', 'FFI_SYSV', 'FFI_UNIX64'
, 'FFI_WIN64', 'FFI_VFP', 'FFI_STDCALL', 'FFI_THISCALL', 'FFI_FASTCALL'
, 'RTLD_LAZY', 'RTLD_NOW', 'RTLD_LOCAL', 'RTLD_GLOBAL', 'RTLD_NOLOAD'
, 'RTLD_NODELETE', 'RTLD_FIRST', 'RTLD_NEXT', 'RTLD_DEFAULT', 'RTLD_SELF'
, 'RTLD_MAIN_ONLY', 'FFI_MS_CDECL'].forEach(function (prop) {
  if (!bindings.hasOwnProperty(prop)) {
    return debug('skipping exporting of non-existant property', prop)
  }
  var desc = Object.getOwnPropertyDescriptor(bindings, prop)
  Object.defineProperty(exports, prop, desc)
})

/**
 * Set the `ffi_type` property on the built-in types.
 */

Object.keys(bindings.FFI_TYPES).forEach(function (name) {
  var type = bindings.FFI_TYPES[name]
  type.name = name
  if (name === 'pointer') return // there is no "pointer" type...
  ref.types[name].ffi_type = type
})

// make `size_t` use the "ffi_type_pointer"
ref.types.size_t.ffi_type = bindings.FFI_TYPES.pointer

// make `Utf8String` use "ffi_type_pointer"
var CString = ref.types.CString || ref.types.Utf8String
CString.ffi_type = bindings.FFI_TYPES.pointer

// make `Object` use the "ffi_type_pointer"
ref.types.Object.ffi_type = bindings.FFI_TYPES.pointer


// libffi is weird when it comes to long data types (defaults to 64-bit),
// so we emulate here, since some platforms have 32-bit longs and some
// platforms have 64-bit longs.
switch (ref.sizeof.long) {
  case 4:
    ref.types.ulong.ffi_type = bindings.FFI_TYPES.uint32
    ref.types.long.ffi_type = bindings.FFI_TYPES.int32
    break;
  case 8:
    ref.types.ulong.ffi_type = bindings.FFI_TYPES.uint64
    ref.types.long.ffi_type = bindings.FFI_TYPES.int64
    break;
  default:
    throw new Error('unsupported "long" size: ' + ref.sizeof.long)
}

/**
 * Alias the "ref" types onto ffi's exports, for convenience...
 */

exports.types = ref.types

// Include our other modules
exports.CIF = require('./cif')
exports.CIF_var = require('./cif_var')
exports.Function = require('./function')
exports.ForeignFunction = require('./foreign_function')
exports.VariadicForeignFunction = require('./foreign_function_var')
exports.DynamicLibrary = require('./dynamic_library')
exports.Library = require('./library')
exports.Callback = require('./callback')
exports.errno = require('./errno')
exports.ffiType = require('./type')

// the shared library extension for this platform
exports.LIB_EXT = exports.Library.EXT

// the FFI_TYPE struct definition
exports.FFI_TYPE = exports.ffiType.FFI_TYPE

},{"./bindings":25,"./callback":26,"./cif":27,"./cif_var":28,"./dynamic_library":29,"./errno":30,"./foreign_function":32,"./foreign_function_var":33,"./function":34,"./library":35,"./type":36,"assert":46,"debug":38,"ref":43,"ref-struct":41}],32:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var CIF = require('./cif')
  , _ForeignFunction = require('./_foreign_function')
  , debug = require('debug')('ffi:ForeignFunction')
  , assert = require('assert')
  , ref = require('ref')

/**
 * Represents a foreign function in another library. Manages all of the aspects
 * of function execution, including marshalling the data parameters for the
 * function into native types and also unmarshalling the return from function
 * execution.
 */

function ForeignFunction (funcPtr, returnType, argTypes, abi) {
  debug('creating new ForeignFunction', funcPtr)

  // check args
  assert(Buffer.isBuffer(funcPtr), 'expected Buffer as first argument')
  assert(!!returnType, 'expected a return "type" object as the second argument')
  assert(Array.isArray(argTypes), 'expected Array of arg "type" objects as the third argument')

  // normalize the "types" (they could be strings,
  // so turn into real type instances)
  returnType = ref.coerceType(returnType)
  argTypes = argTypes.map(ref.coerceType)

  // create the `ffi_cif *` instance
  var cif = CIF(returnType, argTypes, abi)

  // create and return the JS proxy function
  return _ForeignFunction(cif, funcPtr, returnType, argTypes)
}
module.exports = ForeignFunction

}).call(this,require("buffer").Buffer)
},{"./_foreign_function":24,"./cif":27,"assert":46,"buffer":47,"debug":38,"ref":43}],33:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var CIF_var = require('./cif_var')
  , Type = require('./type')
  , _ForeignFunction = require('./_foreign_function')
  , assert = require('assert')
  , debug = require('debug')('ffi:VariadicForeignFunction')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , FFI_ARG_SIZE = bindings.FFI_ARG_SIZE

/**
 * For when you want to call to a C function with variable amount of arguments.
 * i.e. `printf()`.
 *
 * This function takes care of caching and reusing ForeignFunction instances that
 * contain the same ffi_type argument signature.
 */

function VariadicForeignFunction (funcPtr, returnType, fixedArgTypes, abi) {
  debug('creating new VariadicForeignFunction', funcPtr)

  // the cache of ForeignFunction instances that this
  // VariadicForeignFunction has created so far
  var cache = {}

  // check args
  assert(Buffer.isBuffer(funcPtr), 'expected Buffer as first argument')
  assert(!!returnType, 'expected a return "type" object as the second argument')
  assert(Array.isArray(fixedArgTypes), 'expected Array of arg "type" objects as the third argument')

  var numFixedArgs = fixedArgTypes.length

  // normalize the "types" (they could be strings,
  // so turn into real type instances)
  fixedArgTypes = fixedArgTypes.map(ref.coerceType)

  // get the names of the fixed arg types
  var fixedKey = fixedArgTypes.map(function (type) {
    return getId(type)
  })


  // what gets returned is another function that needs to be invoked with the rest
  // of the variadic types that are being invoked from the function.
  function variadic_function_generator () {
    debug('variadic_function_generator invoked')

    // first get the types of variadic args we are working with
    var argTypes = fixedArgTypes.slice()
    var key = fixedKey.slice()

    for (var i = 0; i < arguments.length; i++) {
      var type = ref.coerceType(arguments[i])
      argTypes.push(type)

      var ffi_type = Type(type)
      assert(ffi_type.name)
      key.push(getId(type))
    }

    // now figure out the return type
    var rtnType = ref.coerceType(variadic_function_generator.returnType)
    var rtnName = getId(rtnType)
    assert(rtnName)

    // first let's generate the key and see if we got a cache-hit
    key = rtnName + key.join('')

    var func = cache[key]
    if (func) {
      debug('cache hit for key:', key)
    } else {
      // create the `ffi_cif *` instance
      debug('creating the variadic ffi_cif instance for key:', key)
      var cif = CIF_var(returnType, argTypes, numFixedArgs, abi)
      func = cache[key] = _ForeignFunction(cif, funcPtr, rtnType, argTypes)
    }
    return func
  }

  // set the return type. we set it as a property of the function generator to
  // allow for monkey patching the return value in the very rare case where the
  // return type is variadic as well
  variadic_function_generator.returnType = returnType

  return variadic_function_generator
}

module.exports = VariadicForeignFunction

var idKey = '_ffiId'
function getId (type) {
  if (!type.hasOwnProperty(idKey)) {
    type[idKey] = (((1+Math.random())*0x10000)|0).toString(16)
  }
  return type[idKey]
}

}).call(this,require("buffer").Buffer)
},{"./_foreign_function":24,"./bindings":25,"./cif_var":28,"./type":36,"assert":46,"buffer":47,"debug":38,"ref":43}],34:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var ref = require('ref')
  , assert = require('assert')
  , bindings = require('./bindings')
  , Callback = require('./callback')
  , ForeignFunction = require('./foreign_function')
  , debug = require('debug')('ffi:FunctionType')
 
/**
 * Module exports.
 */

module.exports = Function

/**
 * Creates and returns a "type" object for a C "function pointer".
 *
 * @api public
 */

function Function (retType, argTypes, abi) {
  if (!(this instanceof Function)) {
    return new Function(retType, argTypes, abi)
  }

  debug('creating new FunctionType')

  // check args
  assert(!!retType, 'expected a return "type" object as the first argument')
  assert(Array.isArray(argTypes), 'expected Array of arg "type" objects as the second argument')

  // normalize the "types" (they could be strings, so turn into real type
  // instances)
  this.retType = ref.coerceType(retType)
  this.argTypes = argTypes.map(ref.coerceType)
  this.abi = null == abi ? bindings.FFI_DEFAULT_ABI : abi
}

/**
 * The "ffi_type" is set for node-ffi functions.
 */

Function.prototype.ffi_type = bindings.FFI_TYPES.pointer

/**
 * The "size" is always pointer-sized.
 */

Function.prototype.size = ref.sizeof.pointer

/**
 * The "alignment" is always pointer-aligned.
 */

Function.prototype.alignment = ref.alignof.pointer

/**
 * The "indirection" is always 1 to ensure that our get()/set() get called.
 */

Function.prototype.indirection = 1

/**
 * Returns a ffi.Callback pointer (Buffer) of this function type for the
 * given `fn` Function.
 */

Function.prototype.toPointer = function toPointer (fn) {
  return Callback(this.retType, this.argTypes, this.abi, fn)
}

/**
 * Returns a ffi.ForeignFunction (Function) of this function type for the
 * given `buf` Buffer.
 */

Function.prototype.toFunction = function toFunction (buf) {
  return ForeignFunction(buf, this.retType, this.argTypes, this.abi)
}

/**
 * get function; return a ForeignFunction instance.
 */

Function.prototype.get = function get (buffer, offset) {
  debug('ffi FunctionType "get" function')
  var ptr = buffer.readPointer(offset)
  return this.toFunction(ptr)
}

/**
 * set function; return a Callback buffer.
 */

Function.prototype.set = function set (buffer, offset, value) {
  debug('ffi FunctionType "set" function')
  var ptr
  if ('function' == typeof value) {
    ptr = this.toPointer(value)
  } else if (Buffer.isBuffer(value)) {
    ptr = value
  } else {
    throw new Error('don\'t know how to set callback function for: ' + value)
  }
  buffer.writePointer(ptr, offset)
}

}).call(this,require("buffer").Buffer)
},{"./bindings":25,"./callback":26,"./foreign_function":32,"assert":46,"buffer":47,"debug":38,"ref":43}],35:[function(require,module,exports){
(function (process){

/**
 * Module dependencies.
 */

var DynamicLibrary = require('./dynamic_library')
  , ForeignFunction = require('./foreign_function')
  , VariadicForeignFunction = require('./foreign_function_var')
  , debug = require('debug')('ffi:Library')
  , RTLD_NOW = DynamicLibrary.FLAGS.RTLD_NOW

/**
 * The extension to use on libraries.
 * i.e.  libm  ->  libm.so   on linux
 */

var EXT = Library.EXT = {
    'linux':  '.so'
  , 'linux2': '.so'
  , 'sunos':  '.so'
  , 'solaris':'.so'
  , 'freebsd':'.so'
  , 'openbsd':'.so'
  , 'darwin': '.dylib'
  , 'mac':    '.dylib'
  , 'win32':  '.dll'
}[process.platform]

/**
 * Provides a friendly abstraction/API on-top of DynamicLibrary and
 * ForeignFunction.
 */

function Library (libfile, funcs, lib) {
  debug('creating Library object for', libfile)

  if (libfile && libfile.indexOf(EXT) === -1) {
    debug('appending library extension to library name', EXT)
    libfile += EXT
  }

  if (!lib) {
    lib = {}
  }
  var dl = new DynamicLibrary(libfile || null, RTLD_NOW)

  Object.keys(funcs || {}).forEach(function (func) {
    debug('defining function', func)

    var fptr = dl.get(func)
      , info = funcs[func]

    if (fptr.isNull()) {
      throw new Error('Library: "' + libfile
        + '" returned NULL function pointer for "' + func + '"')
    }

    var resultType = info[0]
      , paramTypes = info[1]
      , fopts = info[2]
      , abi = fopts && fopts.abi
      , async = fopts && fopts.async
      , varargs = fopts && fopts.varargs

    if (varargs) {
      lib[func] = VariadicForeignFunction(fptr, resultType, paramTypes, abi)
    } else {
      var ff = ForeignFunction(fptr, resultType, paramTypes, abi)
      lib[func] = async ? ff.async : ff
    }
  })

  return lib
}
module.exports = Library

}).call(this,require('_process'))
},{"./dynamic_library":29,"./foreign_function":32,"./foreign_function_var":33,"_process":53,"debug":38}],36:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var ref = require('ref')
var assert = require('assert')
var debug = require('debug')('ffi:types')
var Struct = require('ref-struct')
var bindings = require('./bindings')

/**
 * Define the `ffi_type` struct (see deps/libffi/include/ffi.h) for use in JS.
 * This struct type is used internally to define custom struct rtn/arg types.
 */

var FFI_TYPE = Type.FFI_TYPE = Struct()
FFI_TYPE.defineProperty('size',      ref.types.size_t)
FFI_TYPE.defineProperty('alignment', ref.types.ushort)
FFI_TYPE.defineProperty('type',      ref.types.ushort)
// this last prop is a C Array of `ffi_type *` elements, so this is `ffi_type **`
var ffi_type_ptr_array = ref.refType(ref.refType(FFI_TYPE))
FFI_TYPE.defineProperty('elements',  ffi_type_ptr_array)
assert.equal(bindings.FFI_TYPE_SIZE, FFI_TYPE.size)

/**
 * Returns a `ffi_type *` Buffer appropriate for the given "type".
 *
 * @param {Type|String} type A "ref" type (or string) to get the `ffi_type` for
 * @return {Buffer} A buffer pointing to a `ffi_type` instance for "type"
 * @api private
 */

function Type (type) {
  type = ref.coerceType(type)
  debug('Type()', type.name || type)
  assert(type.indirection >= 1, 'invalid "type" given: ' + (type.name || type))
  var rtn

  // first we assume it's a regular "type". if the "indirection" is greater than
  // 1, then we can just use "pointer" ffi_type, otherwise we hope "ffi_type" is
  // set
  if (type.indirection === 1) {
    rtn = type.ffi_type
  } else {
    rtn = bindings.FFI_TYPES.pointer
  }

  // if "rtn" isn't set (ffi_type was not set) then we check for "ref-array" type
  if (!rtn && type.type) {
    // got a "ref-array" type
    // passing arrays to C functions are always by reference, so we use "pointer"
    rtn = bindings.FFI_TYPES.pointer
  }

  if (!rtn && type.fields) {
    // got a "ref-struct" type
    // need to create the `ffi_type` instance manually
    debug('creating an `ffi_type` for given "ref-struct" type')
    var fields = type.fields
      , fieldNames = Object.keys(fields)
      , numFields = fieldNames.length
      , numElements = 0
      , ffi_type = new FFI_TYPE
      , i = 0
      , field
      , ffi_type_ptr

    // these are the "ffi_type" values expected for a struct
    ffi_type.size = 0
    ffi_type.alignment = 0
    ffi_type.type = 13 // FFI_TYPE_STRUCT

    // first we have to figure out the number of "elements" that will go in the
    // array. this would normally just be "numFields" but we also have to account
    // for arrays, which each act as their own element
    for (i = 0; i < numFields; i++) {
      field = fields[fieldNames[i]]
      if (field.type.fixedLength > 0) {
        // a fixed-length "ref-array" type
        numElements += field.type.fixedLength
      } else {
        numElements += 1
      }
    }

    // hand-crafting a null-terminated array here.
    // XXX: use "ref-array"?
    var size = ref.sizeof.pointer * (numElements + 1) // +1 because of the NULL terminator
    var elements = ffi_type.elements = new Buffer(size)
    var index = 0
    for (i = 0; i < numFields; i++) {
      field = fields[fieldNames[i]]
      if (field.type.fixedLength > 0) {
        // a fixed-length "ref-array" type
        ffi_type_ptr = Type(field.type.type)
        for (var j = 0; j < field.type.fixedLength; j++) {
          elements.writePointer(ffi_type_ptr, (index++) * ref.sizeof.pointer)
        }
      } else {
        ffi_type_ptr = Type(field.type)
        elements.writePointer(ffi_type_ptr, (index++) * ref.sizeof.pointer)
      }
    }
    // final NULL pointer to terminate the Array
    elements.writePointer(ref.NULL, index * ref.sizeof.pointer)
    // also set the `ffi_type` property to that it's cached for next time
    rtn = type.ffi_type = ffi_type.ref()
  }

  if (!rtn && type.name) {
    // handle "ref" types other than the set that node-ffi is using (i.e.
    // a separate copy)
    if ('CString' == type.name) {
      rtn = type.ffi_type = bindings.FFI_TYPES.pointer
    } else {
      var cur = type
      while (!rtn && cur) {
        rtn = cur.ffi_type = bindings.FFI_TYPES[cur.name]
        cur = Object.getPrototypeOf(cur)
      }
    }
  }

  assert(rtn, 'Could not determine the `ffi_type` instance for type: ' + (type.name || type))
  debug('returning `ffi_type`', rtn.name)
  return rtn
}
module.exports = Type

}).call(this,require("buffer").Buffer)
},{"./bindings":25,"assert":46,"buffer":47,"debug":38,"ref":43,"ref-struct":41}],37:[function(require,module,exports){
(function (process,__filename){

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , dirname = path.dirname
  , exists = fs.existsSync || path.existsSync
  , defaults = {
        arrow: process.env.NODE_BINDINGS_ARROW || ' → '
      , compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled'
      , platform: process.platform
      , arch: process.arch
      , version: process.versions.node
      , bindings: 'bindings.node'
      , try: [
          // node-gyp's linked version in the "build" dir
          [ 'module_root', 'build', 'bindings' ]
          // node-waf and gyp_addon (a.k.a node-gyp)
        , [ 'module_root', 'build', 'Debug', 'bindings' ]
        , [ 'module_root', 'build', 'Release', 'bindings' ]
          // Debug files, for development (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Debug', 'bindings' ]
        , [ 'module_root', 'Debug', 'bindings' ]
          // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Release', 'bindings' ]
        , [ 'module_root', 'Release', 'bindings' ]
          // Legacy from node-waf, node <= 0.4.x
        , [ 'module_root', 'build', 'default', 'bindings' ]
          // Production "Release" buildtype binary (meh...)
        , [ 'module_root', 'compiled', 'version', 'platform', 'arch', 'bindings' ]
        ]
    }

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings (opts) {

  // Argument surgery
  if (typeof opts == 'string') {
    opts = { bindings: opts }
  } else if (!opts) {
    opts = {}
  }
  opts.__proto__ = defaults

  // Get the module root
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName())
  }

  // Ensure the given bindings name ends with .node
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node'
  }

  var tries = []
    , i = 0
    , l = opts.try.length
    , n
    , b
    , err

  for (; i<l; i++) {
    n = join.apply(null, opts.try[i].map(function (p) {
      return opts[p] || p
    }))
    tries.push(n)
    try {
      b = opts.path ? require.resolve(n) : require(n)
      if (!opts.path) {
        b.path = n
      }
      return b
    } catch (e) {
      if (!/not find/i.test(e.message)) {
        throw e
      }
    }
  }

  err = new Error('Could not locate the bindings file. Tried:\n'
    + tries.map(function (a) { return opts.arrow + a }).join('\n'))
  err.tries = tries
  throw err
}
module.exports = exports = bindings


/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName (calling_file) {
  var origPST = Error.prepareStackTrace
    , origSTL = Error.stackTraceLimit
    , dummy = {}
    , fileName

  Error.stackTraceLimit = 10

  Error.prepareStackTrace = function (e, st) {
    for (var i=0, l=st.length; i<l; i++) {
      fileName = st[i].getFileName()
      if (fileName !== __filename) {
        if (calling_file) {
            if (fileName !== calling_file) {
              return
            }
        } else {
          return
        }
      }
    }
  }

  // run the 'prepareStackTrace' function above
  Error.captureStackTrace(dummy)
  dummy.stack

  // cleanup
  Error.prepareStackTrace = origPST
  Error.stackTraceLimit = origSTL

  return fileName
}

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot (file) {
  var dir = dirname(file)
    , prev
  while (true) {
    if (dir === '.') {
      // Avoids an infinite loop in rare cases, like the REPL
      dir = process.cwd()
    }
    if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules'))) {
      // Found the 'package.json' file or 'node_modules' dir; we're done
      return dir
    }
    if (prev === dir) {
      // Got to the top
      throw new Error('Could not find module root given file: "' + file
                    + '". Do you have a `package.json` file? ')
    }
    // Try the parent dir next
    prev = dir
    dir = join(dir, '..')
  }
}

}).call(this,require('_process'),"/../node_modules/exec-sync/node_modules/ffi/node_modules/bindings/bindings.js")
},{"_process":53,"fs":45,"path":52}],38:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = window.localStorage;

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

},{"./debug":39}],39:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":40}],40:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],41:[function(require,module,exports){
(function (Buffer){

/**
 * An interface for modeling and instantiating C-style data structures. This is
 * not a constructor per-say, but a constructor generator. It takes an array of
 * tuples, the left side being the type, and the right side being a field name.
 * The order should be the same order it would appear in the C-style struct
 * definition. It returns a function that can be used to construct an object that
 * reads and writes to the data structure using properties specified by the
 * initial field list.
 *
 * The only verboten field names are "ref", which is used used on struct
 * instances as a function to retrieve the backing Buffer instance of the
 * struct, and "ref.buffer" which contains the backing Buffer instance.
 *
 *
 * Example:
 *
 * ``` javascript
 * var ref = require('ref')
 * var Struct = require('ref-struct')
 *
 * // create the `char *` type
 * var charPtr = ref.refType(ref.types.char)
 * var int = ref.types.int
 *
 * // create the struct "type" / constructor
 * var PasswordEntry = Struct({
 *     'username': 'string'
 *   , 'password': 'string'
 *   , 'salt':     int
 * })
 *
 * // create an instance of the struct, backed a Buffer instance
 * var pwd = new PasswordEntry()
 * pwd.username = 'ricky'
 * pwd.password = 'rbransonlovesnode.js'
 * pwd.salt = (Math.random() * 1000000) | 0
 *
 * pwd.username // → 'ricky'
 * pwd.password // → 'rbransonlovesnode.js'
 * pwd.salt     // → 820088
 * ```
 */

/**
 * Module dependencies.
 */

var ref = require('ref')
var util = require('util')
var assert = require('assert')
var debug = require('debug')('ref:struct')

/**
 * Module exports.
 */

module.exports = Struct

/**
 * The Struct "type" meta-constructor.
 */

function Struct () {
  debug('defining new struct "type"')

  /**
   * This is the "constructor" of the Struct type that gets returned.
   *
   * Invoke it with `new` to create a new Buffer instance backing the struct.
   * Pass it an existing Buffer instance to use that as the backing buffer.
   * Pass in an Object containing the struct fields to auto-populate the
   * struct with the data.
   */

  function StructType (arg, data) {
    if (!(this instanceof StructType)) {
      return new StructType(arg, data)
    }
    debug('creating new struct instance')
    var store
    if (Buffer.isBuffer(arg)) {
      debug('using passed-in Buffer instance to back the struct', arg)
      assert(arg.length >= StructType.size, 'Buffer instance must be at least ' +
          StructType.size + ' bytes to back this struct type')
      store = arg
      arg = data
    } else {
      debug('creating new Buffer instance to back the struct (size: %d)', StructType.size)
      store = new Buffer(StructType.size)
    }

    // set the backing Buffer store
    store.type = StructType
    this['ref.buffer'] = store

    if (arg) {
      for (var key in arg) {
        // hopefully hit the struct setters
        this[key] = arg[key]
      }
    }
    StructType._instanceCreated = true
  }

  // make instances inherit from the `proto`
  StructType.prototype = Object.create(proto, {
    constructor: {
        value: StructType
      , enumerable: false
      , writable: true
      , configurable: true
    }
  })

  StructType.defineProperty = defineProperty
  StructType.toString = toString
  StructType.fields = {}

  // Setup the ref "type" interface. The constructor doubles as the "type" object
  StructType.size = 0
  StructType.alignment = 0
  StructType.indirection = 1
  StructType.get = get
  StructType.set = set

  // Read the fields list and apply all the fields to the struct
  // TODO: Better arg handling... (maybe look at ES6 binary data API?)
  var arg = arguments[0]
  if (Array.isArray(arg)) {
    // legacy API
    arg.forEach(function (a) {
      var type = a[0]
      var name = a[1]
      StructType.defineProperty(name, type)
    })
  } else if (typeof arg === 'object') {
    Object.keys(arg).forEach(function (name) {
      var type = arg[name]
      StructType.defineProperty(name, type)
    })
  }

  return StructType
}

/**
 * The "get" function of the Struct "type" interface
 */

function get (buffer, offset) {
  debug('Struct "type" getter for buffer at offset', buffer, offset)
  if (offset > 0) {
    buffer = buffer.slice(offset)
  }
  return new this(buffer)
}

/**
 * The "set" function of the Struct "type" interface
 */

function set (buffer, offset, value) {
  debug('Struct "type" setter for buffer at offset', buffer, offset, value)
  var isStruct = value instanceof this
  if (isStruct) {
    // optimization: copy the buffer contents directly rather
    // than going through the ref-struct constructor
    value['ref.buffer'].copy(buffer, offset, 0, this.size);
  } else {
    if (offset > 0) {
      buffer = buffer.slice(offset)
    }
    new this(buffer, value)
  }
}

/**
 * Custom `toString()` override for struct type instances.
 */

function toString () {
  return '[StructType]'
}

/**
 * Adds a new field to the struct instance with the given name and type.
 * Note that this function will throw an Error if any instances of the struct
 * type have already been created, therefore this function must be called at the
 * beginning, before any instances are created.
 */

function defineProperty (name, type) {
  debug('defining new struct type field', name)

  // allow string types for convenience
  type = ref.coerceType(type)

  assert(!this._instanceCreated, 'an instance of this Struct type has already ' +
      'been created, cannot add new "fields" anymore')
  assert.equal('string', typeof name, 'expected a "string" field name')
  assert(type && /object|function/i.test(typeof type) && 'size' in type &&
      'indirection' in type
      , 'expected a "type" object describing the field type: "' + type + '"')
  assert(type.indirection > 1 || type.size > 0,
      '"type" object must have a size greater than 0')
  assert(!(name in this.prototype), 'the field "' + name +
      '" already exists in this Struct type')

  var field = {
    type: type
  }
  this.fields[name] = field

  // define the getter/setter property
  var desc = { enumerable: true , configurable: true }
  desc.get = function () {
    debug('getting "%s" struct field (offset: %d)', name, field.offset)
    return ref.get(this['ref.buffer'], field.offset, type)
  }
  desc.set = function (value) {
    debug('setting "%s" struct field (offset: %d)', name, field.offset, value)
    return ref.set(this['ref.buffer'], field.offset, value, type)
  }

  // calculate the new size and field offsets
  recalc(this)

  Object.defineProperty(this.prototype, name, desc);
}

function recalc (struct) {

  // reset size and alignment
  struct.size = 0
  struct.alignment = 0

  var fieldNames = Object.keys(struct.fields)

  // first loop through is to determine the `alignment` of this struct
  fieldNames.forEach(function (name) {
    var field = struct.fields[name]
    var type = field.type
    var alignment = type.alignment || ref.alignof.pointer
    if (type.indirection > 1) {
      alignment = ref.alignof.pointer
    }
    struct.alignment = Math.max(struct.alignment, alignment)
  })

  // second loop through sets the `offset` property on each "field"
  // object, and sets the `struct.size` as we go along
  fieldNames.forEach(function (name) {
    var field = struct.fields[name]
    var type = field.type

    if (null != type.fixedLength) {
      // "ref-array" types set the "fixedLength" prop. don't treat arrays like one
      // contiguous entity. instead, treat them like individual elements in the
      // struct. doing this makes the padding end up being calculated correctly.
      field.offset = addType(type.type)
      for (var i = 1; i < type.fixedLength; i++) {
        addType(type.type)
      }
    } else {
      field.offset = addType(type)
    }
  })

  function addType (type) {
    var offset = struct.size
    var align = type.indirection === 1 ? type.alignment : ref.alignof.pointer
    var padding = (align - (offset % align)) % align
    var size = type.indirection === 1 ? type.size : ref.sizeof.pointer

    offset += padding

    assert.equal(offset % align, 0, "offset should align")

    // adjust the "size" of the struct type
    struct.size = offset + size

    // return the calulated offset
    return offset
  }

  // any final padding?
  var left = struct.size % struct.alignment
  if (left > 0) {
    debug('additional padding to the end of struct:', struct.alignment - left)
    struct.size += struct.alignment - left
  }
}

/**
 * this is the custom prototype of Struct type instances.
 */

var proto = {}

/**
 * set a placeholder variable on the prototype so that defineProperty() will
 * throw an error if you try to define a struct field with the name "buffer".
 */

proto['ref.buffer'] = ref.NULL

/**
 * Flattens the Struct instance into a regular JavaScript Object. This function
 * "gets" all the defined properties.
 *
 * @api public
 */

proto.toObject = function toObject () {
  var obj = {}
  Object.keys(this.constructor.fields).forEach(function (k) {
    obj[k] = this[k]
  }, this)
  return obj
}

/**
 * Basic `JSON.stringify(struct)` support.
 */

proto.toJSON = function toJSON () {
  return this.toObject()
}

/**
 * `.inspect()` override. For the REPL.
 *
 * @api public
 */

proto.inspect = function inspect () {
  var obj = this.toObject()
  // add instance's "own properties"
  Object.keys(this).forEach(function (k) {
    obj[k] = this[k]
  }, this)
  return util.inspect(obj)
}

/**
 * returns a Buffer pointing to this struct data structure.
 */

proto.ref = function ref () {
  return this['ref.buffer']
}

}).call(this,require("buffer").Buffer)
},{"assert":46,"buffer":47,"debug":38,"ref":42,"util":55}],42:[function(require,module,exports){
(function (Buffer){

var assert = require('assert')
var debug = require('debug')('ref')

exports = module.exports = require('bindings')('binding')

/**
 * A `Buffer` that references the C NULL pointer. That is, its memory address
 * points to 0. Its `length` is 0 because accessing any data from this buffer
 * would cause a _segmentation fault_.
 *
 * ```
 * console.log(ref.NULL);
 * <SlowBuffer@0x0 >
 * ```
 *
 * @name NULL
 * @type Buffer
 */

/**
 * A string that represents the native endianness of the machine's processor.
 * The possible values are either `"LE"` or `"BE"`.
 *
 * ```
 * console.log(ref.endianness);
 * 'LE'
 * ```
 *
 * @name endianness
 * @type String
 */

/**
 * Accepts a `Buffer` instance and returns the memory address of the buffer
 * instance.
 *
 * ```
 * console.log(ref.address(new Buffer(1)));
 * 4320233616
 *
 * console.log(ref.address(ref.NULL)));
 * 0
 * ```
 *
 * @param {Buffer} buffer The buffer to get the memory address of.
 * @return {Number} The memory address the buffer instance.
 * @name address
 * @type method
 */

/**
 * Accepts a `Buffer` instance and returns _true_ if the buffer represents the
 * NULL pointer, _false_ otherwise.
 *
 * ```
 * console.log(ref.isNull(new Buffer(1)));
 * false
 *
 * console.log(ref.isNull(ref.NULL));
 * true
 * ```
 *
 * @param {Buffer} buffer The buffer to check for NULL.
 * @return {Boolean} true or false.
 * @name isNull
 * @type method
 */

/**
 * Reads a JavaScript Object that has previously been written to the given
 * _buffer_ at the given _offset_.
 *
 * ```
 * var obj = { foo: 'bar' };
 * var buf = ref.alloc('Object', obj);
 *
 * var obj2 = ref.readObject(buf, 0);
 * console.log(obj === obj2);
 * true
 * ```
 *
 * @param {Buffer} buffer The buffer to read an Object from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Object} The Object that was read from _buffer_.
 * @name readObject
 * @type method
 */

/**
 * Reads a Buffer instance from the given _buffer_ at the given _offset_.
 * The _size_ parameter specifies the `length` of the returned Buffer instance,
 * which defaults to __0__.
 *
 * ```
 * var buf = new Buffer('hello world');
 * var pointer = ref.alloc('pointer');
 *
 * var buf2 = ref.readPointer(pointer, 0, buf.length);
 * console.log(buf.toString());
 * 'hello world'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @param {Number} length (optional) The length of the returned Buffer. Defaults to 0.
 * @return {Buffer} The Buffer instance that was read from _buffer_.
 * @name readPointer
 * @type method
 */

/**
 * Returns a JavaScript String read from _buffer_ at the given _offset_. The
 * C String is read until the first NULL byte, which indicates the end of the
 * String.
 *
 * This function can read beyond the `length` of a Buffer.
 *
 * ```
 * var buf = new Buffer('hello\0world\0');
 *
 * var str = ref.readCString(buf, 0);
 * console.log(str);
 * 'hello'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {String} The String that was read from _buffer_.
 * @name readCString
 * @type method
 */

/**
 * Returns a big-endian signed 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64BE(buf, 0, '9223372036854775807');
 *
 * var val = ref.readInt64BE(buf, 0)
 * console.log(val)
 * '9223372036854775807'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readInt64BE
 * @type method
 */

/**
 * Returns a little-endian signed 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64LE(buf, 0, '9223372036854775807');
 *
 * var val = ref.readInt64LE(buf, 0)
 * console.log(val)
 * '9223372036854775807'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readInt64LE
 * @type method
 */

/**
 * Returns a big-endian unsigned 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64BE(buf, 0, '18446744073709551615');
 *
 * var val = ref.readUInt64BE(buf, 0)
 * console.log(val)
 * '18446744073709551615'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readUInt64BE
 * @type method
 */

/**
 * Returns a little-endian unsigned 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64LE(buf, 0, '18446744073709551615');
 *
 * var val = ref.readUInt64LE(buf, 0)
 * console.log(val)
 * '18446744073709551615'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readUInt64LE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a big-endian signed 64-bit int into
 * _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64BE(buf, 0, '9223372036854775807');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeInt64BE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a little-endian signed 64-bit int into
 * _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64LE(buf, 0, '9223372036854775807');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeInt64LE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a big-endian unsigned 64-bit int into
 * _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64BE(buf, 0, '18446744073709551615');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeUInt64BE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a little-endian unsigned 64-bit int
 * into _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64LE(buf, 0, '18446744073709551615');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeUInt64LE
 * @type method
 */

/**
 * Returns a new clone of the given "type" object, with its
 * `indirection` level incremented by **1**.
 *
 * Say you wanted to create a type representing a `void *`:
 *
 * ```
 * var voidPtrType = ref.refType(ref.types.void);
 * ```
 *
 * @param {Object|String} type The "type" object to create a reference type from. Strings get coerced first.
 * @return {Object} The new "type" object with its `indirection` incremented by 1.
 */

exports.refType = function refType (type) {
  var _type = exports.coerceType(type)
  var rtn = Object.create(_type)
  rtn.indirection++
  if (_type.name) {
    rtn.name = _type.name + '*'
  }
  return rtn
}

/**
 * Returns a new clone of the given "type" object, with its
 * `indirection` level decremented by 1.
 *
 * @param {Object|String} type The "type" object to create a dereference type from. Strings get coerced first.
 * @return {Object} The new "type" object with its `indirection` decremented by 1.
 */

exports.derefType = function derefType (type) {
  var _type = exports.coerceType(type)
  if (_type.indirection === 1) {
    throw new Error('Cannot create deref\'d type for type with indirection 1')
  }
  var rtn = Object.getPrototypeOf(_type)
  if (rtn.indirection !== _type.indirection - 1) {
    // slow case
    rtn = Object.create(_type)
    rtn.indirection--
  }
  return rtn
}

/**
 * Coerces a "type" object from a String or an actual "type" object. String values
 * are looked up from the `ref.types` Object. So:
 *
 *   * `"int"` gets coerced into `ref.types.int`.
 *   * `"int *"` gets translated into `ref.refType(ref.types.int)`
 *   * `ref.types.int` gets translated into `ref.types.int` (returns itself)
 *
 * Throws an Error if no valid "type" object could be determined. Most `ref`
 * functions use this function under the hood, so anywhere a "type" object is
 * expected, a String may be passed as well, including simply setting the
 * `buffer.type` property.
 *
 * ```
 * var type = ref.coerceType('int **');
 *
 * console.log(type.indirection);
 * 3
 * ```
 *
 * @param {Object|String} type The "type" Object or String to coerce.
 * @return {Object} A "type" object
 */

exports.coerceType = function coerceType (type) {
  var rtn = type
  if (typeof rtn === 'string') {
    rtn = exports.types[type]
    if (rtn) return rtn

    // strip whitespace
    rtn = type.replace(/\s+/g, '').toLowerCase()
    if (rtn === 'pointer') {
      // legacy "pointer" being used :(
      rtn = exports.refType(exports.types.void) // void *
    } else if (rtn === 'string') {
      rtn = exports.types.CString // special char * type
    } else {
      var refCount = 0
      rtn = rtn.replace(/\*/g, function () {
        refCount++
        return ''
      })
      // allow string names to be passed in
      rtn = exports.types[rtn]
      if (refCount > 0) {
        assert(rtn && 'size' in rtn && 'indirection' in rtn
            , 'could not determine a proper "type" from: ' + JSON.stringify(type))
        for (var i = 0; i < refCount; i++) {
          rtn = exports.refType(rtn)
        }
      }
    }
  }
  assert(rtn && 'size' in rtn && 'indirection' in rtn
      , 'could not determine a proper "type" from: ' + JSON.stringify(type))
  return rtn
}

/**
 * Returns the "type" property of the given Buffer.
 * Creates a default type for the buffer when none exists.
 *
 * @param {Buffer} buffer The Buffer instance to get the "type" object from.
 * @return {Object} The "type" object from the given Buffer.
 */

exports.getType = function getType (buffer) {
  if (!buffer.type) {
    debug('WARN: no "type" found on buffer, setting default "type"', buffer)
    buffer.type = {}
    buffer.type.size = buffer.length
    buffer.type.indirection = 1
    buffer.type.get = function get () {
      throw new Error('unknown "type"; cannot get()')
    }
    buffer.type.set = function set () {
      throw new Error('unknown "type"; cannot set()')
    }
  }
  return exports.coerceType(buffer.type)
}

/**
 * Calls the `get()` function of the Buffer's current "type" (or the
 * passed in _type_ if present) at the given _offset_.
 *
 * This function handles checking the "indirection" level and returning a
 * proper "dereferenced" Bufffer instance when necessary.
 *
 * @param {Buffer} buffer The Buffer instance to read from.
 * @param {Number} offset (optional) The offset on the Buffer to start reading from. Defaults to 0.
 * @param {Object|String} type (optional) The "type" object to use when reading. Defaults to calling `getType()` on the buffer.
 * @return {?} Whatever value the "type" used when reading returns.
 */

exports.get = function get (buffer, offset, type) {
  if (!offset) {
    offset = 0
  }
  if (type) {
    type = exports.coerceType(type)
  } else {
    type = exports.getType(buffer)
  }
  debug('get(): (offset: %d)', offset, buffer)
  assert(type.indirection > 0, '"indirection" level must be at least 1')
  if (type.indirection === 1) {
    // need to check "type"
    return type.get(buffer, offset)
  } else {
    // need to create a deref'd Buffer
    var size = type.indirection === 2 ? type.size : exports.sizeof.pointer
    var reference = exports.readPointer(buffer, offset, size)
    reference.type = exports.derefType(type)
    return reference
  }
}

/**
 * Calls the `set()` function of the Buffer's current "type" (or the
 * passed in _type_ if present) at the given _offset_.
 *
 * This function handles checking the "indirection" level writing a pointer rather
 * than calling the `set()` function if the indirection is greater than 1.
 *
 * @param {Buffer} buffer The Buffer instance to write to.
 * @param {Number} offset The offset on the Buffer to start writing to.
 * @param {?} value The value to write to the Buffer instance.
 * @param {Object|String} type (optional) The "type" object to use when reading. Defaults to calling `getType()` on the buffer.
 */

exports.set = function set (buffer, offset, value, type) {
  if (!offset) {
    offset = 0
  }
  if (type) {
    type = exports.coerceType(type)
  } else {
    type = exports.getType(buffer)
  }
  debug('set(): (offset: %d)', offset, buffer, value)
  assert(type.indirection >= 1, '"indirection" level must be at least 1')
  if (type.indirection === 1) {
    type.set(buffer, offset, value)
  } else {
    exports.writePointer(buffer, offset, value)
  }
}


/**
 * Returns a new Buffer instance big enough to hold `type`,
 * with the given `value` written to it.
 *
 * ``` js
 * var intBuf = ref.alloc(ref.types.int)
 * var int_with_4 = ref.alloc(ref.types.int, 4)
 * ```
 *
 * @param {Object|String} type The "type" object to allocate. Strings get coerced first.
 * @param {?} value (optional) The initial value set on the returned Buffer, using _type_'s `set()` function.
 * @return {Buffer} A new Buffer instance with it's `type` set to "type", and (optionally) "value" written to it.
 */

exports.alloc = function alloc (_type, value) {
  var type = exports.coerceType(_type)
  debug('allocating Buffer for type with "size"', type.size)
  var size
  if (type.indirection === 1) {
    size = type.size
  } else {
    size = exports.sizeof.pointer
  }
  var buffer = new Buffer(size)
  buffer.type = type
  if (arguments.length >= 2) {
    debug('setting value on allocated buffer', value)
    exports.set(buffer, 0, value, type)
  }
  return buffer
}

/**
 * Returns a new `Buffer` instance with the given String written to it with the
 * given encoding (defaults to __'utf8'__). The buffer is 1 byte longer than the
 * string itself, and is NUL terminated.
 *
 * ```
 * var buf = ref.allocCString('hello world');
 *
 * console.log(buf.toString());
 * 'hello world\u0000'
 * ```
 *
 * @param {String} string The JavaScript string to be converted to a C string.
 * @param {String} encoding (optional) The encoding to use for the C string. Defaults to __'utf8'__.
 * @return {Buffer} The new `Buffer` instance with the specified String wrtten to it, and a trailing NUL byte.
 */

exports.allocCString = function allocCString (string, encoding) {
  if (null == string || (Buffer.isBuffer(string) && exports.isNull(string))) {
    return exports.NULL
  }
  var size = Buffer.byteLength(string, encoding) + 1
  var buffer = new Buffer(size)
  exports.writeCString(buffer, 0, string, encoding)
  buffer.type = charPtrType
  return buffer
}

/**
 * Writes the given string as a C String (NULL terminated) to the given buffer
 * at the given offset. "encoding" is optional and defaults to __'utf8'__.
 *
 * Unlike `readCString()`, this function requires the buffer to actually have the
 * proper length.
 *
 * @param {Buffer} buffer The Buffer instance to write to.
 * @param {Number} offset The offset of the buffer to begin writing at.
 * @param {String} string The JavaScript String to write that will be written to the buffer.
 * @param {String} encoding (optional) The encoding to read the C string as. Defaults to __'utf8'__.
 */

exports.writeCString = function writeCString (buffer, offset, string, encoding) {
  assert(Buffer.isBuffer(buffer), 'expected a Buffer as the first argument')
  assert.equal('string', typeof string, 'expected a "string" as the third argument')
  if (!offset) {
    offset = 0
  }
  if (!encoding) {
    encoding = 'utf8'
  }
  var size = buffer.length - offset
  var len = buffer.write(string, offset, size, encoding)
  buffer.writeUInt8(0, offset + len)  // NUL terminate
}

exports['readInt64' + exports.endianness] = exports.readInt64
exports['readUInt64' + exports.endianness] = exports.readUInt64
exports['writeInt64' + exports.endianness] = exports.writeInt64
exports['writeUInt64' + exports.endianness] = exports.writeUInt64

var opposite = exports.endianness == 'LE' ? 'BE' : 'LE'
var int64temp = new Buffer(exports.sizeof.int64)
var uint64temp = new Buffer(exports.sizeof.uint64)

exports['readInt64' + opposite] = function (buffer, offset) {
  for (var i = 0; i < exports.sizeof.int64; i++) {
    int64temp[i] = buffer[offset + exports.sizeof.int64 - i - 1]
  }
  return exports.readInt64(int64temp, 0)
}
exports['readUInt64' + opposite] = function (buffer, offset) {
  for (var i = 0; i < exports.sizeof.uint64; i++) {
    uint64temp[i] = buffer[offset + exports.sizeof.uint64 - i - 1]
  }
  return exports.readUInt64(uint64temp, 0)
}
exports['writeInt64' + opposite] = function (buffer, offset, value) {
  exports.writeInt64(int64temp, 0, value)
  for (var i = 0; i < exports.sizeof.int64; i++) {
    buffer[offset + i] = int64temp[exports.sizeof.int64 - i - 1]
  }
}
exports['writeUInt64' + opposite] = function (buffer, offset, value) {
  exports.writeUInt64(uint64temp, 0, value)
  for (var i = 0; i < exports.sizeof.uint64; i++) {
    buffer[offset + i] = uint64temp[exports.sizeof.uint64 - i - 1]
  }
}

/**
 * `ref()` accepts a Buffer instance and returns a new Buffer
 * instance that is "pointer" sized and has its data pointing to the given
 * Buffer instance. Essentially the created Buffer is a "reference" to the
 * original pointer, equivalent to the following C code:
 *
 * ``` c
 * char *buf = buffer;
 * char **ref = &buf;
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to create a reference to.
 * @return {Buffer} A new Buffer instance pointing to _buffer_.
 */

exports.ref = function ref (buffer) {
  debug('creating a reference to buffer', buffer)
  var type = exports.refType(exports.getType(buffer))
  return exports.alloc(type, buffer)
}

/**
 * Accepts a Buffer instance and attempts to "dereference" it.
 * That is, first it checks the `indirection` count of _buffer_'s "type", and if
 * it's greater than __1__ then it merely returns another Buffer, but with one
 * level less `indirection`.
 *
 * When _buffer_'s indirection is at __1__, then it checks for `buffer.type`
 * which should be an Object with its own `get()` function.
 *
 * ```
 * var buf = ref.alloc('int', 6);
 *
 * var val = ref.deref(buf);
 * console.log(val);
 * 6
 * ```
 *
 *
 * @param {Buffer} buffer A Buffer instance to dereference.
 * @return {?} The returned value after dereferencing _buffer_.
 */

exports.deref = function deref (buffer) {
  debug('dereferencing buffer', buffer)
  return exports.get(buffer)
}

/**
 * Attaches _object_ to _buffer_ such that it prevents _object_ from being garbage
 * collected until _buffer_ does.
 *
 * @param {Buffer} buffer A Buffer instance to attach _object_ to.
 * @param {Object|Buffer} object An Object or Buffer to prevent from being garbage collected until _buffer_ does.
 * @api private
 */

exports._attach = function _attach (buf, obj) {
  if (!buf._refs) {
    buf._refs = []
  }
  buf._refs.push(obj)
}

/**
 * Same as `ref.writeObject()`, except that this version does not _attach_ the
 * Object to the Buffer, which is potentially unsafe if the garbage collector
 * runs.
 *
 * @param {Buffer} buffer A Buffer instance to write _object_ to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Object} object The Object to be written into _buffer_.
 * @api private
 */

exports._writeObject = exports.writeObject

/**
 * Writes a pointer to _object_ into _buffer_ at the specified _offset.
 *
 * This function "attaches" _object_ to _buffer_ to prevent it from being garbage
 * collected.
 *
 * ```
 * var buf = ref.alloc('Object');
 * ref.writeObject(buf, 0, { foo: 'bar' });
 *
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to write _object_ to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Object} object The Object to be written into _buffer_.
 */

exports.writeObject = function writeObject (buf, offset, obj, persistent) {
  debug('writing Object to buffer', buf, offset, obj, persistent)
  exports._writeObject(buf, offset, obj, persistent)
  exports._attach(buf, obj)
}

/**
 * Same as `ref.writePointer()`, except that this version does not attach
 * _pointer_ to _buffer_, which is potentially unsafe if the garbage collector
 * runs.
 *
 * @param {Buffer} buffer A Buffer instance to write _pointer to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Buffer} pointer The Buffer instance whose memory address will be written to _buffer_.
 * @api private
 */

exports._writePointer = exports.writePointer

/**
 * Writes the memory address of _pointer_ to _buffer_ at the specified _offset_.
 *
 * This function "attaches" _object_ to _buffer_ to prevent it from being garbage
 * collected.
 *
 * ```
 * var someBuffer = new Buffer('whatever');
 * var buf = ref.alloc('pointer');
 * ref.writePointer(buf, 0, someBuffer);
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to write _pointer to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Buffer} pointer The Buffer instance whose memory address will be written to _buffer_.
 */

exports.writePointer = function writePointer (buf, offset, ptr) {
  debug('writing pointer to buffer', buf, offset, ptr)
  exports._writePointer(buf, offset, ptr)
  exports._attach(buf, ptr)
}

/**
 * Same as `ref.reinterpret()`, except that this version does not attach
 * _buffer_ to the returned Buffer, which is potentially unsafe if the
 * garbage collector runs.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The `length` property of the returned Buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and the requested _size_.
 * @api private
 */

exports._reinterpret = exports.reinterpret

/**
 * Returns a new Buffer instance with the specified _size_, with the same memory
 * address as _buffer_.
 *
 * This function "attaches" _buffer_ to the returned Buffer to prevent it from
 * being garbage collected.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The `length` property of the returned Buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and the requested _size_.
 */

exports.reinterpret = function reinterpret (buffer, size, offset) {
  debug('reinterpreting buffer to "%d" bytes', size)
  var rtn = exports._reinterpret(buffer, size, offset || 0)
  exports._attach(rtn, buffer)
  return rtn
}

/**
 * Same as `ref.reinterpretUntilZeros()`, except that this version does not
 * attach _buffer_ to the returned Buffer, which is potentially unsafe if the
 * garbage collector runs.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The number of sequential, aligned `NULL` bytes that are required to terminate the buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and a variable `length` that is terminated by _size_ NUL bytes.
 * @api private
 */

exports._reinterpretUntilZeros = exports.reinterpretUntilZeros

/**
 * Accepts a `Buffer` instance and a number of `NULL` bytes to read from the
 * pointer. This function will scan past the boundary of the Buffer's `length`
 * until it finds `size` number of aligned `NULL` bytes.
 *
 * This is useful for finding the end of NUL-termintated array or C string. For
 * example, the `readCString()` function _could_ be implemented like:
 *
 * ```
 * function readCString (buf) {
 *   return ref.reinterpretUntilZeros(buf, 1).toString('utf8')
 * }
 * ```
 *
 * This function "attaches" _buffer_ to the returned Buffer to prevent it from
 * being garbage collected.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The number of sequential, aligned `NULL` bytes are required to terminate the buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and a variable `length` that is terminated by _size_ NUL bytes.
 */

exports.reinterpretUntilZeros = function reinterpretUntilZeros (buffer, size, offset) {
  debug('reinterpreting buffer to until "%d" NULL (0) bytes are found', size)
  var rtn = exports._reinterpretUntilZeros(buffer, size, offset || 0)
  exports._attach(rtn, buffer)
  return rtn
}


// the built-in "types"
var types = exports.types = {}

/**
 * The `void` type.
 *
 * @section types
 */

types.void = {
    size: 0
  , indirection: 1
  , get: function get (buf, offset) {
      debug('getting `void` type (returns `null`)')
      return null
    }
  , set: function set (buf, offset, val) {
      debug('setting `void` type (no-op)')
    }
}

/**
 * The `int8` type.
 */

types.int8 = {
    size: exports.sizeof.int8
  , indirection: 1
  , get: function get (buf, offset) {
      return buf.readInt8(offset || 0)
    }
  , set: function set (buf, offset, val) {
      if (typeof val === 'string') {
        val = val.charCodeAt(0)
      }
      return buf.writeInt8(val, offset || 0)
    }
}

/**
 * The `uint8` type.
 */

types.uint8 = {
    size: exports.sizeof.uint8
  , indirection: 1
  , get: function get (buf, offset) {
      return buf.readUInt8(offset || 0)
    }
  , set: function set (buf, offset, val) {
      if (typeof val === 'string') {
        val = val.charCodeAt(0)
      }
      return buf.writeUInt8(val, offset || 0)
    }
}

/**
 * The `int16` type.
 */

types.int16 = {
    size: exports.sizeof.int16
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt16' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt16' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `uint16` type.
 */

types.uint16 = {
    size: exports.sizeof.uint16
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readUInt16' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt16' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `int32` type.
 */

types.int32 = {
    size: exports.sizeof.int32
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt32' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt32' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `uint32` type.
 */

types.uint32 = {
    size: exports.sizeof.uint32
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readUInt32' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt32' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `int64` type.
 */

types.int64 = {
    size: exports.sizeof.int64
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt64' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt64' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `uint64` type.
 */

types.uint64 = {
    size: exports.sizeof.uint64
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readUInt64' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt64' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `float` type.
 */

types.float = {
    size: exports.sizeof.float
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readFloat' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeFloat' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `double` type.
 */

types.double = {
    size: exports.sizeof.double
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readDouble' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeDouble' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `Object` type. This can be used to read/write regular JS Objects
 * into raw memory.
 */

types.Object = {
    size: exports.sizeof.Object
  , indirection: 1
  , get: function get (buf, offset) {
      return buf.readObject(offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf.writeObject(val, offset || 0)
    }
}

/**
 * The `CString` (a.k.a `"string"`) type.
 *
 * CStrings are a kind of weird thing. We say it's `sizeof(char *)`, and
 * `indirection` level of 1, which means that we have to return a Buffer that
 * is pointer sized, and points to a some utf8 string data, so we have to create
 * a 2nd "in-between" buffer.
 */

types.CString = {
    size: exports.sizeof.pointer
  , alignment: exports.alignof.pointer
  , indirection: 1
  , get: function get (buf, offset) {
      var _buf = buf.readPointer(offset)
      if (_buf.isNull()) {
        return null
      }
      return _buf.readCString(0)
    }
  , set: function set (buf, offset, val) {
      var _buf = exports.allocCString(val)
      return buf.writePointer(_buf, offset)
    }
}

// alias Utf8String
var utfstringwarned = false
Object.defineProperty(types, 'Utf8String', {
    enumerable: false
  , configurable: true
  , get: function () {
      if (!utfstringwarned) {
        utfstringwarned = true
        console.error('"Utf8String" type is deprecated, use "CString" instead')
      }
      return types.CString
    }
})

/**
 * The `bool` type.
 *
 * Wrapper type around `types.uint8` that accepts/returns `true` or
 * `false` Boolean JavaScript values.
 *
 * @name bool
 *
 */

/**
 * The `byte` type.
 *
 * @name byte
 */

/**
 * The `char` type.
 *
 * @name char
 */

/**
 * The `uchar` type.
 *
 * @name uchar
 */

/**
 * The `short` type.
 *
 * @name short
 */

/**
 * The `ushort` type.
 *
 * @name ushort
 */

/**
 * The `int` type.
 *
 * @name int
 */

/**
 * The `uint` type.
 *
 * @name uint
 */

/**
 * The `long` type.
 *
 * @name long
 */

/**
 * The `ulong` type.
 *
 * @name ulong
 */

/**
 * The `longlong` type.
 *
 * @name longlong
 */

/**
 * The `ulonglong` type.
 *
 * @name ulonglong
 */

/**
 * The `size_t` type.
 *
 * @name size_t
 */

// "typedef"s for the variable-sized types
;[ 'bool', 'byte', 'char', 'uchar', 'short', 'ushort', 'int', 'uint', 'long'
, 'ulong', 'longlong', 'ulonglong', 'size_t' ].forEach(function (name) {
  var unsigned = name === 'bool'
              || name === 'byte'
              || name === 'size_t'
              || name[0] === 'u'
  var size = exports.sizeof[name]
  assert(size >= 1 && size <= 8)
  var typeName = 'int' + (size * 8)
  if (unsigned) {
    typeName = 'u' + typeName
  }
  var type = exports.types[typeName]
  assert(type)
  exports.types[name] = Object.create(type)
})

// set the "alignment" property on the built-in types
Object.keys(exports.alignof).forEach(function (name) {
  if (name === 'pointer') return
  exports.types[name].alignment = exports.alignof[name]
  assert(exports.types[name].alignment > 0)
})

// make the `bool` type work with JS true/false values
exports.types.bool.get = (function (_get) {
  return function get (buf, offset) {
    return _get(buf, offset) ? true : false
  }
})(exports.types.bool.get)
exports.types.bool.set = (function (_set) {
  return function set (buf, offset, val) {
    if (typeof val !== 'number') {
      val = val ? 1 : 0
    }
    return _set(buf, offset, val)
  }
})(exports.types.bool.set)

/*!
 * Set the `name` property of the types. Used for debugging...
 */

Object.keys(exports.types).forEach(function (name) {
  exports.types[name].name = name
})

/*!
 * This `char *` type is used by "allocCString()" above.
 */

var charPtrType = exports.refType(exports.types.char)

/*!
 * Set the `type` property of the `NULL` pointer Buffer object.
 */

exports.NULL.type = exports.types.void

/**
 * `NULL_POINTER` is a pointer-sized `Buffer` instance pointing to `NULL`.
 * Conceptually, it's equivalent to the following C code:
 *
 * ``` c
 * char *null_pointer;
 * null_pointer = NULL;
 * ```
 *
 * @type Buffer
 */

exports.NULL_POINTER = exports.ref(exports.NULL)

/**
 * All these '...' comment blocks below are for the documentation generator.
 *
 * @section buffer
 */

Buffer.prototype.address = function address () {
  return exports.address(this, 0)
}

/**
 * ...
 */

Buffer.prototype.hexAddress = function hexAddress () {
  return exports.hexAddress(this, 0)
}

/**
 * ...
 */

Buffer.prototype.isNull = function isNull () {
  return exports.isNull(this, 0)
}

/**
 * ...
 */

Buffer.prototype.ref = function ref () {
  return exports.ref(this)
}

/**
 * ...
 */

Buffer.prototype.deref = function deref () {
  return exports.deref(this)
}

/**
 * ...
 */

Buffer.prototype.readObject = function readObject (offset) {
  return exports.readObject(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeObject = function writeObject (obj, offset) {
  return exports.writeObject(this, offset, obj)
}

/**
 * ...
 */

Buffer.prototype.readPointer = function readPointer (offset, size) {
  return exports.readPointer(this, offset, size)
}

/**
 * ...
 */

Buffer.prototype.writePointer = function writePointer (ptr, offset) {
  return exports.writePointer(this, offset, ptr)
}

/**
 * ...
 */

Buffer.prototype.readCString = function readCString (offset) {
  return exports.readCString(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeCString = function writeCString (string, offset, encoding) {
  return exports.writeCString(this, offset, string, encoding)
}

/**
 * ...
 */

Buffer.prototype.readInt64BE = function readInt64BE (offset) {
  return exports.readInt64BE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeInt64BE = function writeInt64BE (val, offset) {
  return exports.writeInt64BE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.readUInt64BE = function readUInt64BE (offset) {
  return exports.readUInt64BE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeUInt64BE = function writeUInt64BE (val, offset) {
  return exports.writeUInt64BE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.readInt64LE = function readInt64LE (offset) {
  return exports.readInt64LE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeInt64LE = function writeInt64LE (val, offset) {
  return exports.writeInt64LE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.readUInt64LE = function readUInt64LE (offset) {
  return exports.readUInt64LE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeUInt64LE = function writeUInt64LE (val, offset) {
  return exports.writeUInt64LE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.reinterpret = function reinterpret (size, offset) {
  return exports.reinterpret(this, size, offset)
}

/**
 * ...
 */

Buffer.prototype.reinterpretUntilZeros = function reinterpretUntilZeros (size, offset) {
  return exports.reinterpretUntilZeros(this, size, offset)
}

/**
 * `ref` overwrites the default `Buffer#inspect()` function to include the
 * hex-encoded memory address of the Buffer instance when invoked.
 *
 * This is simply a nice-to-have.
 *
 * **Before**:
 *
 * ``` js
 * console.log(new Buffer('ref'));
 * <Buffer 72 65 66>
 * ```
 *
 * **After**:
 *
 * ``` js
 * console.log(new Buffer('ref'));
 * <Buffer@0x103015490 72 65 66>
 * ```
 */

Buffer.prototype.inspect = overwriteInspect(Buffer.prototype.inspect)

// does SlowBuffer inherit from Buffer? (node >= v0.7.9)
if (!(exports.NULL instanceof Buffer)) {
  debug('extending SlowBuffer\'s prototype since it doesn\'t inherit from Buffer.prototype')

  /*!
   * SlowBuffer convenience methods.
   */

  var SlowBuffer = require('buffer').SlowBuffer

  SlowBuffer.prototype.address = Buffer.prototype.address
  SlowBuffer.prototype.hexAddress = Buffer.prototype.hexAddress
  SlowBuffer.prototype.isNull = Buffer.prototype.isNull
  SlowBuffer.prototype.ref = Buffer.prototype.ref
  SlowBuffer.prototype.deref = Buffer.prototype.deref
  SlowBuffer.prototype.readObject = Buffer.prototype.readObject
  SlowBuffer.prototype.writeObject = Buffer.prototype.writeObject
  SlowBuffer.prototype.readPointer = Buffer.prototype.readPointer
  SlowBuffer.prototype.writePointer = Buffer.prototype.writePointer
  SlowBuffer.prototype.readCString = Buffer.prototype.readCString
  SlowBuffer.prototype.writeCString = Buffer.prototype.writeCString
  SlowBuffer.prototype.reinterpret = Buffer.prototype.reinterpret
  SlowBuffer.prototype.reinterpretUntilZeros = Buffer.prototype.reinterpretUntilZeros
  SlowBuffer.prototype.readInt64BE = Buffer.prototype.readInt64BE
  SlowBuffer.prototype.writeInt64BE = Buffer.prototype.writeInt64BE
  SlowBuffer.prototype.readUInt64BE = Buffer.prototype.readUInt64BE
  SlowBuffer.prototype.writeUInt64BE = Buffer.prototype.writeUInt64BE
  SlowBuffer.prototype.readInt64LE = Buffer.prototype.readInt64LE
  SlowBuffer.prototype.writeInt64LE = Buffer.prototype.writeInt64LE
  SlowBuffer.prototype.readUInt64LE = Buffer.prototype.readUInt64LE
  SlowBuffer.prototype.writeUInt64LE = Buffer.prototype.writeUInt64LE
  SlowBuffer.prototype.inspect = overwriteInspect(SlowBuffer.prototype.inspect)
}

function overwriteInspect (inspect) {
  if (inspect.name === 'refinspect') {
    return inspect
  } else {
    return function refinspect () {
      var v = inspect.apply(this, arguments)
      return v.replace('Buffer', 'Buffer@0x' + this.hexAddress())
    }
  }
}

}).call(this,require("buffer").Buffer)
},{"assert":46,"bindings":37,"buffer":47,"debug":38}],43:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"assert":46,"bindings":37,"buffer":47,"debug":38,"dup":42}],44:[function(require,module,exports){
// translationUpdate worker
"use strict";

var debug = false;

var hof = require("../lib/hof");
var io = require("../lib/io");
var fs = require("fs");
var tokenize = require('../compile/tokenize');
var Text = require('../class/text');
var Sentence = require('../class/sentence');
var Language = require('../lang/language');
var mwak = new Language();

var Eng = require("../locale/eng/eng");
var eng = new Eng(".");

// first argument is filename
var fromFilename = "eng.txt";
var fromLangCode = "en";
// english
var toFilename = "eng.txt";
var toLangCode = "en";

function noSpace(string) {
    var stringArray = string.split(),
        result;
    result = stringArray.map(function (glyph) {
        if (tokenize.isSpace(glyph)) {
            return '-';
        }
        return glyph;
    });
    return result.join("");
}

function uniqueVerify(filename) {
    // first argument is filename
    //console.log("****** " + filename);
    var fileContents = io.fileRead(filename),
        fileText = new Text(mwak, fileContents),
        definitions = fileText.select(mwak, "ha"),
        sentences = definitions.sentences,
        output =  "";
    // clean up text
    sentences = sentences.map(function (sentence) {
        sentence.phraseDelete(mwak, "kya");
        sentence.phraseDelete(mwak, "nya");
        sentence.phraseDelete(mwak, ".i");
        //sentences[i].phraseDelete(mwak, "hu");
    });
    // check if same definition is found twice
    sentences.forEach(function () {
        if (sentences[0] !== undefined) {
            var phrase = sentences[0].phraseGet(mwak, "ha"),
                sentence = sentences[0].copy(mwak),
                matches = definitions.indexOf(mwak,
                    phrase.toString());
            if (matches !== -1) {
                output += ("duplicate error: \n " +
                sentence.toLocaleString(mwak) + "\n" +
                definitions.sentences[matches].
                toLocaleString(mwak) + "\n");
            }
        }
        sentences.splice(0, 1);
    });
    return output;
}

function translateWord(fromLangCode, toLangCode,
        sentence, subject, newText, i, byService, warnings) {
    var obPhraseBody,
        command,
        translation,
        translateFail,
        warning,
        execSync = require('exec-sync'),
        definition,
        newSentence;
    obPhraseBody = sentence.phraseGet(mwak, "ha").body;
    if (obPhraseBody.type && obPhraseBody.type === "lit") {
        obPhraseBody = obPhraseBody.body;
    }
    definition = String(obPhraseBody);
    try {
        if (byService === "reversePlain") {
            command = "./reversePlainTranslate.js " +
                fromLangCode + " " + definition;
        } else {
            command = "./gtranslate.sh " + byService +
                " " + fromLangCode + " " + toLangCode +
                " " + definition;
        }
        translation = execSync(command);
    } catch (e) {
        console.log("fail for " + command);
        console.log(e.stack);
        console.log(e);
        translateFail = true;
    }
    if (translateFail === true) {
        return false;
    }
    // be replace ob space with dash ya
    //translation.replace('\s','-');
    translation = noSpace(translation);
    console.log(definition + " " + translation);
    if (translation.toLower &&
            translation.toLower() === definition) {
        warning = ("Warning: " + translation +
            " has same definition");
        warnings[warnings.length] = warning;
    }
    newSentence = new Sentence(mwak,
        (subject + " " + translation + " li ha ya"));
    warnings[warnings.length] = (
        newSentence.toLocaleString(eng) +
            "\n" + newSentence.toLocaleString(mwak)
    );
    newText.insert(mwak, i, newSentence);
    return true;
}

function translateUpdate(toFilename, toLangCode,
        fromFilename, fromLangCode, byService) {
    if (fromFilename === undefined) {
        fromFilename = "eng.txt";
    }
    if (fromLangCode === undefined) {
        fromLangCode = "en";
    }
    if (byService === undefined) {
        byService = "google";
    }
    var fileContents = io.fileRead(fromFilename),
        fileText = new Text(mwak, fileContents),
        definitions = fileText.select(mwak, "ha"),
        sentences = definitions.sentences,
        toFileContents = io.fileRead(toFilename),
        toFileText = new Text(mwak, toFileContents),
        newText = toFileText.copy(mwak),
        warnings = [],
        //childProcess = require('child_process'),
        //logFilename,
        //newLogContents,
        date,
        uniqueWarnings,
        warningString;
    console.log("translating " + toFilename);
    sentences.forEach(function (sentence, i) {
        var subject,
            find;
        try {
            subject = String(sentence.phraseGet(mwak, "hu"));
            find = toFileText.indexOf(mwak, subject);
        } catch (e) {
            console.log(e.stack);
            console.log(e);
        }
        if (find === -1) {
            console.log("translating " + sentence);
            translateWord(fromLangCode, toLangCode, sentence,
                subject, newText, i, byService, warnings);
        }
    });
    if (debug) {
        console.log(newText.toLocaleString(mwak));
    } else {
        io.fileWrite(toFilename, newText.toLocaleString(mwak));
        io.fileWrite(toFilename + ".json", JSON.stringify(newText));
    }
    uniqueWarnings = uniqueVerify(toFilename);
    warnings[warnings.length] = uniqueWarnings;
    warningString = "";
    date = new Date();
    warningString = date.toString() + "\n";
    warnings.forEach(function (warning) {
        warningString += warning + "\n";
    });
    console.log(warningString);
    //if (warnings.length > 0 && !debug) {
    //    logFilename = toFilename + ".log";
    //    newLogContents = "";
    //    if (fs.existsSync(logFilename)) {
    //        var logContents = io.fileRead(logFilename);
    //        newLogContents = logContents + warningString; 
    //    } else {
    //        newLogContents = warningString;
    //    }
    //    io.fileWrite(logFilename, newLogContents);
    //}
}

//try {
//    translateUpdate(toFilename, toLangCode);
//} catch (e) {
//    console.log(toFilename + " problem");
//    console.log(e.stack);
//    console.log(e);
//}

this.onmessage = function(event) {
// parse message into two arguments
var message = event.data,
    tuple = message.split(" "),
    toFilename = tuple[0],
    toLangCode = tuple[1];
    postMessage("status "+ message + " recieved");
    if (toFilename = "close") {
        self.close();
    }
    postMessage("status "+ toFilename + " starting");
    translateUpdate(toFilename, toLangCode);
    postMessage(toFilename + " done");
};

},{"../class/sentence":5,"../class/text":7,"../compile/tokenize":12,"../lang/language":16,"../lib/hof":18,"../lib/io":19,"../locale/eng/eng":20,"exec-sync":23,"fs":45}],45:[function(require,module,exports){

},{}],46:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":55}],47:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff
var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  if (length > 0 && length <= Buffer.poolSize)
    buf.parent = rootParent

  return buf
}

function SlowBuffer(subject, encoding, noZero) {
  if (!(this instanceof SlowBuffer))
    return new SlowBuffer(subject, encoding, noZero)

  var buf = new Buffer(subject, encoding, noZero)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length, 2)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0

  if (length < 0 || offset < 0 || offset > this.length)
    throw new RangeError('attempt to write outside buffer bounds');

  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length)
    newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100))
    val += this[offset + i] * mul

  return val
}

Buffer.prototype.readUIntBE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100))
    val += this[offset + --byteLength] * mul;

  return val
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readIntLE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100))
    val += this[offset + i] * mul
  mul *= 0x80

  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100))
    val += this[offset + --i] * mul
  mul *= 0x80

  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100))
    this[offset + i] = (value / mul) >>> 0 & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert)
    checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100))
    this[offset + i] = (value / mul) >>> 0 & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeIntLE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(this,
             value,
             offset,
             byteLength,
             Math.pow(2, 8 * byteLength - 1) - 1,
             -Math.pow(2, 8 * byteLength - 1))
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100))
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(this,
             value,
             offset,
             byteLength,
             Math.pow(2, 8 * byteLength - 1) - 1,
             -Math.pow(2, 8 * byteLength - 1))
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100))
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (target_start >= target.length) target_start = target.length
  if (!target_start) target_start = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || source.length === 0) return 0

  // Fatal error conditions
  if (target_start < 0)
    throw new RangeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes(string, units) {
  var codePoint, length = string.length
  var leadSurrogate = null
  units = units || Infinity
  var bytes = []
  var i = 0

  for (; i<length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {

      // last char was a lead
      if (leadSurrogate) {

        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        }

        // valid surrogate pair
        else {
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      }

      // no lead yet
      else {

        // unexpected trail
        if (codePoint > 0xDBFF) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // unpaired lead
        else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        else {
          leadSurrogate = codePoint
          continue
        }
      }
    }

    // valid bmp char, but last char was a lead
    else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    }
    else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    }
    else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    }
    else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    }
    else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {

    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length, unitSize) {
  if (unitSize) length -= length % unitSize;
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":48,"ieee754":49,"is-array":50}],48:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],49:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],50:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],51:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],52:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":53}],53:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],54:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],55:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":54,"_process":53,"inherits":51}]},{},[44]);
