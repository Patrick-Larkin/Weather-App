//         var toEncode = 'pk.eyJ1IjoiY3J1emFuaW8iLCJhIjoiY2tlY3gzc2o3MDE2eTJycXhyZHZlODdmaSJ9.uIuadFMaTfzBLAYq81Olrg'
//         var toEncode1 = 'd95aaa6f0384784632b7ff3a34ec9071'
//
//         // String.fromCharCode(“a”.charCodeAt(0))
//         const RING_SHIFT = 3;
//
//         const encoderRing = function (str) {
//             // returns encoded string
//             var output = [];
//             var letters = str.split("");
//             letters.forEach(function(letter) {
//                 output.push(String.fromCharCode(letter.charCodeAt(0) + RING_SHIFT));
//             });
//             console.log(output.join(""))
//         }
//
//         encoderRing(toEncode)
//         sn1h|M4Lmrl\6M4hpIxdZ;lOFMkLmrl\5wo\6j}f5r6PGH5hWM|f[k|]K]oRGgpdVM<1xLxdgIPdWi}EOD\t;4Rouj
//         encoderRing(toEncode1)
//         g<8ddd9i36;7:;7965e:ii6d67hf<3:4
//
//
//         const decoderRing = function (str) {
//             // returns decoded string
//             var output = [];
//             var letters = str.split("");
//             letters.forEach(function(letter) {
//                 output.push(String.fromCharCode(letter.charCodeAt(0) - RING_SHIFT));
//             });
//             console.log(output.join(""))
//         }
//         console.log(APIKEY_ENCODED);
// //how to use this in code:
//         console.log((decoderRing(APIKEY_ENCODED)));