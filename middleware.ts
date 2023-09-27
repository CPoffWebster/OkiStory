import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const apiKey = request.headers.get('x-api-key');
    console.log("LOOK HERE IN API", request);

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return new Response('Unauthorized', { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
