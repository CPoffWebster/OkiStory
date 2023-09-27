import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const apiKey = request.headers.get('apiKey');
    console.log("middleware", apiKey, process.env.API_KEY)

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return new Response('Unauthorized', { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/users/:path*',
};
