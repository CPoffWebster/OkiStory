import axios from 'axios';

export async function axiosInstance(url: string, body: any) {
    console.log("axiosInstance", url, process.env.NEXT_PUBLIC_API_KEY)
    return await axios.post(url, body, {
        headers: {
            'apiKey': process.env.NEXT_PUBLIC_API_KEY
        }
    })
}