#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for find first prime not divisible by ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya

// base 6 for      	3bit   	2	1/4	25%
// base 12 for     	4bit    4	1/4	25%
// base 60 for     	6bit    4	1/6	6%  best
// base 120 for    	7bit    8	1/6	6%
// base 360 for    	9bit	152	19/64	30%
// base 2520 for   	12bit	1576	197/512	38%
// base 5040 for   	13bit	38%
// base 55440 for  	16bit  10096 631/4096	15%                       
// base 720720 for	20bit	31%
// base 1441440		21bit	31%
// base 4324320		23bit	48%
// base 21621600	25bit	35%	divides 13 prime
// base 367567200 	29bit   31%	divides 17 prime
// base 6983776800	33bit	18%
// base 13967553600	34bit   18%
// base 321253732800    39bit   41%
// base 2248776129600   42bit   48%  divides 23 prime
// 19		65214507758400
// 20		195643523275200
// 21		6064949221531200

var base = 6064949221531200


var i = 0;
console.log("for "+base);
while (true){
i++
if (i > base) break;
var number = base/i;
console.log(number);
var fraction = number.toString().split('.')[1];
if (fraction !== undefined) break;
}
console.log("first num not divisible by is "+i);
