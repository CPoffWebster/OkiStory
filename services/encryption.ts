import CryptoJS from "crypto-js";

/**
 * Encryption service
 * @param value 
 * @returns 
 */
export function encrypt(value: string, secretIndex: number) {
    const secret = process.env[`CRYPT_SECRET${secretIndex}`];
    if (!secret) {
        throw new Error(`Secret for index ${secretIndex} is not set.`);
    }
    const encrypted = CryptoJS.AES.encrypt(value, secret).toString();
    const base64 = Buffer.from(encrypted).toString('base64');
    return encodeURIComponent(base64);
}

/**
 * Decryption service
 * @param value 
 * @returns 
 */
export function decrypt(value: string, secretIndex: number) {
    const secret = process.env[`CRYPT_SECRET${secretIndex}`];
    if (!secret) {
        throw new Error(`Secret for index ${secretIndex} is not set.`);
    }
    const base64 = decodeURIComponent(value);
    const encrypted = Buffer.from(base64, 'base64').toString('ascii');
    const bytes = CryptoJS.AES.decrypt(encrypted, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function doubleEncryptSession(key: string, value: string) {
    const key1 = `${key}1`;
    const key2 = `${key}2`;
    const value1 = encrypt(value.toString(), 0);
    const value2 = encrypt(value.toString(), 1);
    localStorage.setItem(key1, value1);
    localStorage.setItem(key2, value2);
}

/**
 * Double encryption service
 * @param value1 
 * @param value2 
 * @returns 
 */
export function doubleDecryptSession(key: string): string {
    const key1 = `${key}1`;
    const key2 = `${key}2`;
    const value1 = localStorage.getItem(key1);
    const value2 = localStorage.getItem(key2);
    localStorage.removeItem(key1);
    localStorage.removeItem(key2);
    if (!value1 || !value2) return '';

    const value1Decrypt = decrypt(value1, 0);
    const value2Decrypt = decrypt(value2, 1);
    if (value1Decrypt === value2Decrypt) {
        return value1Decrypt;
    }

    return '';
}