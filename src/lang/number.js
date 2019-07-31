#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for fixed numbers ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
//
// fixed point numbers
//
// fraction portion, Superior Highly Composite Numbers:
// 	base		bits	reserve
// base 2 for 		1bit	0%	divides 1 prime
// base 6 for      	3bit   	25%	divides 3 prime
// base 12 for     	4bit    25%	divides 3 prime
// base 60 for     	6bit    6%  	divides 5 prime
// base 120 for    	7bit    6%	divides 5 prime
// base 360 for    	9bit	30%	divides 7 prime
// base 2520 for   	12bit	38%	divides 7 prime
// base 5040 for   	13bit	38%	divides 7 prime
// base 55440 for  	16bit  	15%     divides 11 prime
// base 720720 for	20bit	31%	divides 13 prime
// base 1441440		21bit	31%	divides 13 prime
// base 4324320		23bit	48%	divides 13 prime
// base 21621600	25bit	35%	divides 13 prime
// base 367567200 	29bit   31%	divides 17 prime
// base 6983776800	33bit	18%	divides 19 prime
// base 13967553600	34bit   18% 	divides 19 prime
// base 321253732800    39bit   41%  	divides 23 prime
// base 2248776129600   42bit   48%  	divides 23 prime
// base	65214507758400  46bit   7%	divides 29 prime
// base 195643523275200  48bit  30%	divides 29 prime
// base 6064949221531200 53bit	34%	divides 31 prime

// so base 60 fractions are best, 
// 
// lets compare to IEEE floating points, 
// binary16 has 5 bits exponent, 1 sign bit, 11 bits precision
// 
// the fraction portion can either be appended on, or can be
// incorporated..  6 bits fraction, 10 bits precision.
// or 6 bits precision, 3 bits exponent and 1 bit sign..
// kinda looses the simplicity if we have an exponent
// but we can have much larger numbers than 100
// we can have the exponents be of 60
// so 2046 would be (6/60+34)*60
// 65536 would be (12/60+18)*60^2 or 65520
//
// okay now I want to write a basic program to approximate
// fractions for real numbers like pi, e and phi.
// see if even with the waste it makes sense to go with larger
// composite numbers.

"use strict";
var bases = [12,120,55440,21621600];//,367567200];
var exponents = [1,3,49,144];
var half = 1/2;
var third = 1/3;
var fifth = 1/5;
var seventh = 1/7;
var eleventh = 1/11;
var fifteenth = 1/13;
var seventeeth = 1/17;
var piFraction = 0.314159265358979323846;
var phiFraction = 0.1618033988749894848;
var eFraction = 0.71828182845904523536;
var fractionsName =["2-limit","3-limit","5-limit","7-limit","11-limit",
"13-limit","17-limit","pi","phi","e"];
var fractions  =
[half,third,fifth,seventh,eleventh,fifteenth,seventeeth,
piFraction,phiFraction,eFraction];

var j;
for (j=0;j<fractions.length;j++){
var i;
console.log(fractionsName[j]+"\n"+fractions[j]);
for (i = 0; i<bases.length; i++){
var base = bases[i];
var maxExponent = exponents[i];
var fractionPair = findClosest(fractions[j],base,maxExponent);
var bestFraction = fractionPair[0];
var bestPrecision = fractionPair[3];
var difference = fractionPair[1];
if (difference < 6E-17) difference = "perfect";
var fractionI = fractionPair[2];
console.log(bestPrecision+bestFraction
+ " " + difference
+ " " + fractionI+"/"+base);
}
}

function findClosest(fraction, base, maxExponent){
// simple algorithm:
// su best difference ob base ya
// for i from 0 til base be loop de
// su base fraction ob tha be divide ob i by base ya
// be subtract ob base fraction from input fraction
// to absolute difference ya
// if su absolute difference be less than ob best 
// difference then be set  ob it as best difference yand
// su best fraction ob base fraction ya
// be end ob loop ya
// be return ob array of best fraction and best difference ya

// su best difference ob base ya
var bestDifference = base;
var bestFraction = 0;
var bestFractionI = 0;
//var basePrecision = Math.floor(fraction);
var bestPrecision = 0;
var testFraction = fraction;
//while (testFraction < base){
//bestPrecision = Math.floor(fraction) ;
//testFraction = testFraction *base;
//exponent++;
//}
var restFraction = fraction;//-basePrecision;
var exponent = 0;
// for i from 0 til base be loop de
var i ;
for (i = 0.0; i<=base;i++){
// su base fraction ob tha be divide ob i by base ya
var baseFraction = (i/base);
// be subtract ob base fraction from input fraction
// to absolute difference ya
var absoluteDifference = Math.abs(baseFraction-restFraction);
// if su absolute difference be less than ob best 
if (absoluteDifference < bestDifference){
// difference then be set  ob it as best difference yand
bestDifference = absoluteDifference;
// su best fraction ob base fraction ya
bestFraction = baseFraction;
bestFractionI = i;
}
}// be end ob loop ya

// be return ob array of best fraction and best difference ya
return [bestFraction,bestDifference,bestFractionI,bestPrecision];
}
