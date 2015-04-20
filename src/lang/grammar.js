
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
this.quotes.number=translate.word(dict, 
		mwakGrammar.quotes.number);
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
this.wordOrder.phraseOrder= 
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
be: "Grammar",
junctions:["ki","wa","mwa"],
typeWords: ["li","sa","nyu","na","pa","yi","ni","tyi","nya"],
phraseWords: ["hi","ta","ha","hu","kya","su","ni","ka",
"fa","sla","la","tla","psu","pya","tsa","pli","su"],
pronouns: ["mi","ti","si","tu","yu","tsi","pa"],
topicWord: "fa",
agentWord: "hu",
subjectWord: "hu",
objectWord: "ha",
verbWord: "hi",
subPhraseWords: ["pi"],
topClauseWords: ["ku","twa","swi","pwa","kla","syu","kyu"],
topClauseTerminator: ["twa"],
clauseWords: ["kwa"],
clauseTerminator: ["klu"],
sentenceWords: ["ya","ci"],
number: {
all: ["lu","twu"],
plural: "lu",
dual: "twu",
singular: "sya"
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
number: "na",
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
subjectProminent: false,
postpositional: true,
clauseInitial: true,
genitiveInitial: true,
littleEndian: false,
phraseOrder: ["ha","hi"],
intransitiveWord: "hu"
},
conjugation:{
reversible:[],
irreversible:[],
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


function byteAlign(word){
var result = new String();
if (word.length % 2 === 1) result = word+"h";
else result = word;
return result;
}

function stressByteAlign(word,index,array){
var result = new String();
var arLength = array.length;
var primaryStress = "\u02C8";
var secondaryStress = "\u02CC";
if (word.length % 2 === 1) result = word+"h";
else result = word;
if ((/*arLength-*/index) % 2 === 0) return primaryStress+result;
else return secondaryStress+result;
}

function compoundWord(language,wordO,format,conjLevel){
var head = new String();
var body = new String();
if (Array.isArray(wordO.head))
head = wordO.head.map(byteAlign).join("");
else if (wordO.head) head = byteAlign(wordO.head);
if (Array.isArray(wordO.body))
body = wordO.body.map(byteAlign).join("");
else if (wordO.body) body = byteAlign(wordO.body);
var result = body+head;
if (format.ipa) return mwakToIPA(result) ;
else return result;
}

function trochaicCompound(language,wordO,format,conjLevel){
if (format && format.rhythm !== true)
return wordO.toLocaleString(language,format,undefined,conjLevel);
var head = new String();
var body = new String();
var primaryStress = "\u02C8";
var secondaryStress = "\u02CC";
if (Array.isArray(wordO.head))
head = wordO.head.map(byteAlign).join("");
else if (wordO.head) head = byteAlign(wordO.head);
if (Array.isArray(wordO.body))
body = wordO.body.map(stressByteAlign).join("");
else if (wordO.body) body = stressByteAlign(wordO.body);
var result = new String();
if (body.length>0)
result = body;
if (body.length%2===0) result +=  primaryStress+head;
else result +=  secondaryStress+head;
if (format.ipa) return mwakToIPA(result) ;
else return result;
}


function phraseHead(language,wordO,format,conjLevel){
if (format && format.rhythm !== true)
return wordO.toLocaleString(language,format,undefined,conjLevel);
var head = new String();
var body = new String();
var primaryStress = "\u02C8";
var secondaryStress = "\u02CC";
if (Array.isArray(wordO.head))
head = wordO.head.map(byteAlign);
else if (wordO.head) head = byteAlign(wordO.head);
if (Array.isArray(wordO.body))
body = wordO.body.map(byteAlign);
else if (wordO.body) body = byteAlign(wordO.body);
var result = body+secondaryStress+head;
if (format.ipa) return mwakToIPA(result) ;
else return result;
}


function typeCompound(language,typeO,format,conjLevel){
if (format && format.rhythm !== true)
return typeO.toLocaleString(language,format,undefined,conjLevel);
var head = new String();
var body = new String();
var primaryStress = "\u02C8";
var secondaryStress = "\u02CC";
if ((typeO.head))
head =
typeO.head.toLocaleString(language,format,"th",conjLevel);
if ((typeO.body))
body = typeO.body.toLocaleString(language,format,"n",conjLevel);
var result = new String();
if (body.length >0 && head.length >0) 
result = body+secondaryStress+head;
else if (body.length >0) result = body;
else if (head.length  >0) result = primaryStress+head;
//if (format.ipa) return mwakToIPA(result) ;
//else return result;
return result;
}

