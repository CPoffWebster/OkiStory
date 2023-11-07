/**
 * Set Session storage
 * @param key 
 * @param value 
 */
export function setSessionStorage(key: string, value: string) {
    sessionStorage.setItem(key, value);
}

/**
 * Get Session storage
 * @param key
 * @returns 
 */
export function getSessionStorage(key: string): string {
    // const value = sessionStorage.getItem(key);
    // sessionStorage.removeItem(key);
    return sessionStorage.getItem(key) || '';
}