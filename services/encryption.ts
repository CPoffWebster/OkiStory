import CryptoJS from "crypto-js";

const secret = 'F3zWX59EdzVTm3zgASKqBjKjnQEuKLaC';

/**
 * Encryption service
 * @param value 
 * @returns 
 */
export function encrypt(value: string) {
    const encrypted = CryptoJS.AES.encrypt(value, secret).toString();
    const base64 = Buffer.from(encrypted).toString('base64');
    return encodeURIComponent(base64);
}


/**
 * Decryption service
 * @param value 
 * @returns 
 */
export function decrypt(value: string) {
    const base64 = decodeURIComponent(value);
    const encrypted = Buffer.from(base64, 'base64').toString('ascii');
    const bytes = CryptoJS.AES.decrypt(encrypted, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}
