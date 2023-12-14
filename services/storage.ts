import { Bucket, Storage } from '@google-cloud/storage';

export const okiStoryGCSBucket = process.env.OKI_STORY_GCS_BUCKET!;

export function getStorage() {
    const storage = new Storage();

    return {
        getBucket: (bucketName: string) => getBucket(bucketName),
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

            async upload(filename: string, stream: NodeJS.ReadableStream) {
                return uploadStream(bucket, filename, stream);
            }
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

export async function uploadStream(bucket: Bucket, filename: string, stream: NodeJS.ReadableStream) {
    //  Creates an object that represents the destination
    const newFile = bucket.file(filename, {})
    console.info('Uploading', filename);
    return new Promise<string>((ok, rej) => {
        //  Create a writable stream on Google Storage bucket
        const destinationWriteStream = newFile.createWriteStream();

        // We're going to pipe our input stream to the storage bucket
        stream
            .pipe(destinationWriteStream)
            .on('error', function (err) { rej(err); })
            .on('finish', function () {
                ok(filename);
            })
    })

}