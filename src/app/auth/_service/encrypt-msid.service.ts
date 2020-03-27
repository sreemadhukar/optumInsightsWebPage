import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptMsidService {
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  constructor() {}

  encryptMsId(param) {
    const string = param;
    let result = '';
    let i = 0;
    do {
      let a = string.charCodeAt(i++);
      let b = string.charCodeAt(i++);
      let c = string.charCodeAt(i++);
      a = a ? a : 0;
      b = b ? b : 0;
      c = c ? c : 0;

      const b1 = (a >> 2) & 0x3f;
      const b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xf);
      let b3 = ((b & 0xf) << 2) | ((c >> 6) & 0x3);
      let b4 = c & 0x3f;
      if (!b) {
        b3 = b4 = 64;
      } else if (!c) {
        b4 = 64;
      }
      result +=
        this.characters.charAt(b1) +
        this.characters.charAt(b2) +
        this.characters.charAt(b3) +
        this.characters.charAt(b4);
    } while (i < string.length);

    // added to increase complexity of encryption above base64
    const middleIndex = Math.floor(result.length / 2);
    const insertChar = result.charAt(middleIndex);
    const nextCharCode = insertChar.charCodeAt(0) + 1;
    const nextChar = String.fromCharCode(nextCharCode);
    result = result.substr(0, middleIndex) + nextChar + result.substr(middleIndex);
    return result;
  }
}
