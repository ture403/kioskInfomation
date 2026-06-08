/***********************************************************************************
 *  Project        :
 *  File Name   :
 *  설명               : AES 암호화 / 복호화 Script
 *
 *  작성자           : JungHanYu
 *  작성일           : 2014. 5. 5. - 오후 10:05:48
 * [변경이력]
 ***********************************************************************************
 * Date                    Name                 Descriptions
 ***********************************************************************************
 * 2014. 5. 5.       JungHanYu          First Creation
 *
 ***********************************************************************************/

let AES = {};

AES.cipher = function(input, w) {
  let Nb = 4;
  let Nr = w.length/Nb - 1;

  let state = [[],[],[],[]];
  for (let i=0; i<4*Nb; i++) {
  	state[i%4][Math.floor(i/4)] = input[i];
  }

  state = AES.addRoundKey(state, w, 0, Nb);

  for (let round=1; round<Nr; round++) {
    state = AES.subBytes(state, Nb);
    state = AES.shiftRows(state, Nb);
    state = AES.mixColumns(state, Nb);
    state = AES.addRoundKey(state, w, round, Nb);
  }

  state = AES.subBytes(state, Nb);
  state = AES.shiftRows(state, Nb);
  state = AES.addRoundKey(state, w, Nr, Nb);

  let output = new Array(4*Nb);
  for (let i=0; i<4*Nb; i++) {
  	output[i] = state[i%4][Math.floor(i/4)];
  }
  return output;
}

AES.keyExpansion = function(key) {
  let Nb = 4;
  let Nk = key.length/4;
  let Nr = Nk + 6;

  let w = new Array(Nb*(Nr+1));
  let temp = new Array(4);

  for (let i=0; i<Nk; i++) {
    let r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
    w[i] = r;
  }

  for (let i=Nk; i<(Nb*(Nr+1)); i++) {
    w[i] = new Array(4);
    for (let t=0; t<4; t++) {
    	temp[t] = w[i-1][t];
    }
    if (i % Nk === 0) {
      temp = AES.subWord(AES.rotWord(temp));
      for (let t=0; t<4; t++) {
      	temp[t] ^= AES.rCon[i/Nk][t];
      }
    } else if (Nk > 6 && i%Nk === 4) {
      temp = AES.subWord(temp);
    }
    for (let t=0; t<4; t++) {
    	w[i][t] = w[i-Nk][t] ^ temp[t];
    }
  }
  return w;
}

AES.subBytes = function(s, Nb) {
  for (let r=0; r<4; r++) {
    for (let c=0; c<Nb; c++) {
    	s[r][c] = AES.sBox[s[r][c]];
    }
  }
  return s;
}

AES.shiftRows = function(s, Nb) {
  let t = new Array(4);
  for (let r=1; r<4; r++) {
    for (let c=0; c<4; c++) {
    	t[c] = s[r][(c+r)%Nb];
    }
    for (let c=0; c<4; c++) {
    	s[r][c] = t[c];
    }
  }
  return s;
}

AES.mixColumns = function(s, Nb) {
  for (let c=0; c<4; c++) {
    let a = new Array(4);
    let b = new Array(4);
    for (let i=0; i<4; i++) {
      a[i] = s[i][c];
      b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
    }

    s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
    s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
    s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
    s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
  }
  return s;
}

AES.addRoundKey = function(state, w, rnd, Nb) {
  for (let r=0; r<4; r++) {
    for (let c=0; c<Nb; c++) {
    	state[r][c] ^= w[rnd*4+c][r];
    }
  }
  return state;
}

AES.subWord = function(w) {
  for (let i=0; i<4; i++) {
  	w[i] = AES.sBox[w[i]];
  }
  return w;
}

AES.rotWord = function(w) {
  let tmp = w[0];
  for (let i=0; i<3; i++) {
  	w[i] = w[i+1];
  }
  w[3] = tmp;
  return w;
}

AES.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

AES.rCon = [ [0x00, 0x00, 0x00, 0x00],
             [0x01, 0x00, 0x00, 0x00],
             [0x02, 0x00, 0x00, 0x00],
             [0x04, 0x00, 0x00, 0x00],
             [0x08, 0x00, 0x00, 0x00],
             [0x10, 0x00, 0x00, 0x00],
             [0x20, 0x00, 0x00, 0x00],
             [0x40, 0x00, 0x00, 0x00],
             [0x80, 0x00, 0x00, 0x00],
             [0x1b, 0x00, 0x00, 0x00],
             [0x36, 0x00, 0x00, 0x00] ];

AES.Ctr = {};

AES.Ctr.encrypt = function(plaintext, password, nBits) {
  let blockSize = 16;
  if (!(nBits==128 || nBits==192 || nBits==256)) {
  	return '';
  }
  plaintext = Utf8.encode(plaintext);
  password = Utf8.encode(password);

  let nBytes = nBits/8;
  let pwBytes = new Array(nBytes);
  for (let i=0; i<nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  let key = AES.cipher(pwBytes, AES.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes-16));

  let counterBlock = new Array(blockSize);
  let nonce = (new Date()).getTime();
  let nonceSec = Math.floor(nonce/1000);
  let nonceMs = nonce%1000;

  for (let i=0; i<4; i++) {
  	counterBlock[i] = (nonceSec >>> i*8) & 0xff;
  }
  for (let i=0; i<4; i++) {
  	counterBlock[i+4] = nonceMs & 0xff;
  }

  let ctrTxt = '';
  for (let i=0; i<8; i++) {
  	ctrTxt += String.fromCharCode(counterBlock[i]);
  }

  let keySchedule = AES.keyExpansion(key);

  let blockCount = Math.ceil(plaintext.length/blockSize);
  let ciphertxt = new Array(blockCount);

  for (let b=0; b<blockCount; b++) {
    for (let c=0; c<4; c++) {
    	counterBlock[15-c] = (b >>> c*8) & 0xff;
    }
    for (let c=0; c<4; c++) {
    	counterBlock[15-c-4] = (b/0x100000000 >>> c*8);
    }

    let cipherCntr = AES.cipher(counterBlock, keySchedule);

    let blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
    let cipherChar = new Array(blockLength);

    for (let i=0; i<blockLength; i++) {
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join('');
  }

  let ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = Base64.encode(ciphertext);

  return ciphertext;
}

AES.Ctr.decrypt = function(ciphertext, password, nBits) {
  let blockSize = 16;
  if (!(nBits==128 || nBits==192 || nBits==256)) {
  	return '';
  }
  ciphertext = Base64.decode(ciphertext);
  password = Utf8.encode(password);

  let nBytes = nBits/8;
  let pwBytes = new Array(nBytes);
  for (let i=0; i<nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  let key = AES.cipher(pwBytes, AES.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes-16));

  let counterBlock = new Array(8);
  let ctrTxt = ciphertext.slice(0, 8);
  for (let i=0; i<8; i++) {
  	counterBlock[i] = ctrTxt.charCodeAt(i);
  }

  let keySchedule = AES.keyExpansion(key);

  let nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
  let ct = new Array(nBlocks);
  for (let b=0; b<nBlocks; b++) {
  	ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
  }
  ciphertext = ct;

  let plaintxt = new Array(ciphertext.length);

  for (let b=0; b<nBlocks; b++) {
    for (let c=0; c<4; c++) {
    	counterBlock[15-c] = ((b) >>> c*8) & 0xff;
    }
    for (let c=0; c<4; c++) {
    	counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;
    }

    let cipherCntr = AES.cipher(counterBlock, keySchedule);

    let plaintxtByte = new Array(ciphertext[b].length);
    for (let i=0; i<ciphertext[b].length; i++) {
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  let plaintext = plaintxt.join('');
  plaintext = Utf8.decode(plaintext);

  return plaintext;
}

let Base64 = {};

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

Base64.encode = function(str, utf8encode) {
  utf8encode =  (typeof utf8encode === 'undefined') ? false : utf8encode;
  let o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  let b64 = Base64.code;

  plain = utf8encode ? str.encodeUTF8() : str;

  c = plain.length % 3;
  if (c > 0) {
  	while (c++ < 3) {
  		pad += '=';
  		plain += '\0';
  	}
  }


  for (c=0; c<plain.length; c+=3) {
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);

    bits = o1<<16 | o2<<8 | o3;

    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');

  coded = coded.slice(0, coded.length-pad.length) + pad;

  return coded;
}

Base64.btoaAlt = function (input) {
    let str = String(input);
    let output = '';
    for (
      // initialize result and counter
      let block, charCode, idx = 0, map = Base64.code, output = '';
      // if the next str index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      str.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) {
        console.error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
}

Base64.encodeByArray = function (arr) {
    return this.btoaAlt(String.fromCharCode.apply(null, arr));
}

Base64.decode = function(str, utf8decode) {
  utf8decode =  (typeof utf8decode === 'undefined') ? false : utf8decode;
  let o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
  let b64 = Base64.code;

  coded = utf8decode ? str.decodeUTF8() : str;


  for (let c=0; c<coded.length; c+=4) {
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));

    bits = h1<<18 | h2<<12 | h3<<6 | h4;

    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;

    d[c/4] = String.fromCharCode(o1, o2, o3);

    if (h4 === 0x40) {
    	d[c/4] = String.fromCharCode(o1, o2);
    }
    if (h3 === 0x40) {
    	d[c/4] = String.fromCharCode(o1);
    }
  }
  plain = d.join('');

  return utf8decode ? plain.decodeUTF8() : plain;
}


let Utf8 = {};

Utf8.encode = function(strUni) {

  let strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,
      function(c) {
        let cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,
      function(c) {
        let cc = c.charCodeAt(0);
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}


Utf8.decode = function(strUtf) {
  let strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
      function(c) {
        let cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,
      function(c) {
        let cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}


function WarmhiltEncrypt(str, key){
	return AES.Ctr.encrypt(str, key, 256);
}

function WarmhiltDecrypt(str, key){
	return AES.Ctr.decrypt(str, key, 256);
}

/* LarryPark 한글 디코딩 되는버전 추가 2016-01-28 */
let Base64Object = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  encode: function(input) {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    input = Base64Object._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
  },


  decode: function(input) {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = Base64Object._utf8_decode(output);

    return output;

  },

  _utf8_encode: function(string) {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";

    for (let n = 0; n < string.length; n++) {

      let c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  _utf8_decode: function(utftext) {
    let string = "";
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;

    while (i < utftext.length) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

}




export {
    AES,
    Base64,
    Utf8,
    Base64Object,
    WarmhiltEncrypt,
    WarmhiltDecrypt
};
