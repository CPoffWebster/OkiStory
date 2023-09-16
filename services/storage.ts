import { Storage } from '@google-cloud/storage';

export const charactersBucket = process.env.CHARACTERS_GCS_BUCKET!;
export const locationsBucket = process.env.LOCATIONS_GCS_BUCKET!;
export const booksBucket = process.env.BOOKS_GCS_BUCKET!;

export function getStorage() {
    const storage = new Storage();

    return {
        getReadStream: (url: string) => getReadStream(url),
    };

    /**
     * Fetches the binary contents given a gs storage URL
     *
     * @param urlString A valid Google Storage URL
     */
    async function getReadStream(urlString: string) {

        const result = parseGsUrl(urlString);
        if (!result) { return null; }
        const { host, pathToFind } = result;

        const bucket = getBucket(host);
        return bucket.getReadStream(pathToFind);
    }

    function getBucket(bucketName: string) {
        const bucket = storage.bucket(bucketName);

        return {

            getReadStream: (filename: string) => {
                const remoteFile = bucket.file(filename);
                return remoteFile.createReadStream();
            },
        }
    }
}

export function parseGsUrl(urlString: string) {
    const pattern = /^gs\:\/\/([\w_-]+)\/(.+)$/
    const match = pattern.exec(urlString)
    if (match === null) { return null; }
    const [, host, pathToFind] = match;
    return { host, pathToFind };
}