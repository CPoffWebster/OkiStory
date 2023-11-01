import { Readable } from 'stream';
import sharp from 'sharp';

/**
 * Compress an image using sharp
 * Currently using lossy compression as it makes a large difference in file size
 * @param readStream read stream of the image
 */
export async function compressImage(readStream: Readable): Promise<Readable> {
    return new Promise((resolve, reject) => {
        // const transformStream = sharp().png(); --> This is lossless compression
        const transformStream = sharp().png({ palette: true, colors: 256 }); // --> This is lossy compression
        const chunks: any[] = [];

        // Pipe the read stream through the transform stream
        readStream.pipe(transformStream)
            .on('data', (chunk) => {
                chunks.push(chunk);
            })
            .on('end', () => {
                // Combine the chunks into a single buffer
                const imageBuffer = Buffer.concat(chunks);

                // Convert the buffer to a readable stream
                const imageStream = Readable.from(imageBuffer);

                resolve(imageStream);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}