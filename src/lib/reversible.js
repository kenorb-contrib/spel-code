/* reversible computing functions */
"use strict"
exports.cnot = 
function (pair){
return [pair[0],pair[0]&&(~pair[1]);
}
exports.toffoli = 
function (triple){
}
