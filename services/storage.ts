// import { Bucket, GetFileOptions, GetFilesOptions, GetFilesResponse, Storage } from '@google-cloud/storage';
import { Storage } from '@google-cloud/storage';

export const charactersBucket = process.env.CHARACTERS_GCS_BUCKET!;
export const locationsBucket = process.env.LOCATIONS_GCS_BUCKET!;
export const booksBucket = process.env.BOOKS_GCS_BUCKET!;

export function getStorage() {
    const storage = new Storage();

    return {
        getReadStream: (url: string) => getReadStream(url),
        // getCharactersBucket: () => getBucket(charactersBucket),
        // getLocationsBucket: () => getBucket(process.env.LOCATIONS_GCS_BUCKET!),
        // getBooksBucket: () => getBucket(process.env.BOOKS_GCS_BUCKET!)
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

            // // Get a file from a bucket
            // getFile: (filename: string) => {
            //     return bucket.file(filename);
            // },

            // // Get all files in a bucket
            // getFiles: (options: GetFileOptions) => {
            //     return bucket.getFiles(options)
            // },

            // // Get files in a specific folder { prefix: '{folder_name}' }
            // getFilesInFolder: (query?: GetFilesOptions): Promise<GetFilesResponse> => {
            //     return bucket.getFiles(query)
            // },

            // // Check if a file exists
            // async exists(path: string) {
            //     const [exists] = await bucket.file(path).exists();
            //     return exists;
            // },

            // // Upload a file to a bucket
            // async upload(filename: string, stream: NodeJS.ReadableStream, metadata: Record<string, string | number>) {
            //     return uploadStream(bucket, filename, stream, metadata);
            // },

            // // Used to get JSON from a file
            // getContent: (filename: string) => {
            //     const remoteFile = bucket.file(filename);

            //     const contentPromise = new Promise<string>((res, rej) => {
            //         let content = '';
            //         remoteFile.createReadStream()
            //             .on('error', function (err: any) {
            //                 rej(err);
            //             })
            //             .on('data', function (data: any) {
            //                 content += data;
            //             })
            //             .on('end', function () {
            //                 res(content);
            //             });
            //     });
            //     return contentPromise;
            // }
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

// export async function uploadStream(bucket: Bucket, filename: string, stream: NodeJS.ReadableStream, metadata: Record<string, string | number>) {
//     //  Creates an object that represents the destination
//     const newFile = bucket.file(filename, {})
//     console.log('Uploading', filename);
//     return new Promise<string>((ok, rej) => {
//         //  Create a writable stream on Google Storage bucket
//         const destinationWriteStream = newFile.createWriteStream({
//             metadata: {
//                 metadata: metadata
//             }
//         });

//         // We're going to pipe our input stream to the storage bucket
//         stream
//             .pipe(destinationWriteStream)
//             .on('error', function (err) { rej(err); })
//             .on('finish', function () {
//                 ok(filename);
//             })
//     })
// }