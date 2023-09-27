import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const host = request.headers.get('host');

    console.log("LOOK HERE", host, process.env.HOST_NAME)
    if (!host || host !== process.env.HOST_NAME) {
        return new Response('Unauthorized', { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/users/:path*',
};
