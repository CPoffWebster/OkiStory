import CryptoJS from "crypto-js";

const secrets = [
    'F3zWX59EdzVTm3zgASKqBjKjnQEuKLaC',
    'NvVUf8ssTsBNcCswNNd7GAWdYrkBVkzg',
]

/**
 * Encryption service
 * @param value 
 * @returns 
 */
export function encrypt(key: string, value: string, secret: number) {
    const encrypted = CryptoJS.AES.encrypt(value, secrets[secret]).toString();
    const base64 = Buffer.from(encrypted).toString('base64');
    return encodeURIComponent(base64);
}

/**
 * Decryption service
 * @param value 
 * @returns 
 */
export function decrypt(value: string, secret: number) {
    const base64 = decodeURIComponent(value);
    const encrypted = Buffer.from(base64, 'base64').toString('ascii');
    const bytes = CryptoJS.AES.decrypt(encrypted, secrets[secret]);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function doubleEncryptSession(key: string, value: string) {
    const key1 = `${key}1`;
    const key2 = `${key}2`;
    const value1 = encrypt(key1, value.toString(), 0);
    const value2 = encrypt(key2, value.toString(), 1);
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