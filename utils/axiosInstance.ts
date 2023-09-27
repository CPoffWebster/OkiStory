import axios from 'axios';

export async function axiosInstance(url: string, body: any) {
    return await axios.post(url, body, {
        headers: {
            'apiKey': process.env.NEXT_PUBLIC_API_KEY
        }
    })
}