import crypto from 'crypto';

export const md5Encode = str => crypto.createHash('md5').update(str, 'utf8').digest('hex');

export const aesEncode = (data, key = 'react.mobi') => {
  const cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

export const aesDecode = (encrypted, key = 'react.mobi') => {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};


/* eslint-disable */
export function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(`0x${p1}`);
  }));
}

export function b64DecodeUnicode(str) {
  return decodeURIComponent(new Buffer(str, 'base64').toString().split('').map((c) => {
    return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
  }).join(''));
}
