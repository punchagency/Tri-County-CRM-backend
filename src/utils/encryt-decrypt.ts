import * as cryptojs from 'crypto-js';

export class EncrytDecrypt {
 static decryptData(data: string) {
  if (!data) {
   return null;
  }
  const secret = `${process.env.ENCRYTION_DECRYTION_KEY}`;
  const decipher = cryptojs.AES.decrypt(data, secret);
  return decipher.toString(cryptojs.enc.Utf8);
 }

 static encryptData(data: string) {
  if (!data) {
   return null;
  }
  const secret = `${process.env.ENCRYTION_DECRYTION_KEY}`;
  const cipher = cryptojs.AES.encrypt(data, secret);
  return cipher.toString();
 }

 static customVerifyToken(secret: string, token: string) {
  if (!secret || !token) {
   return null;
  }
  const decryptedToken = EncrytDecrypt.decryptData(secret);
  return decryptedToken === token;
 }

}