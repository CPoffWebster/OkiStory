import { NextResponse } from 'next/server';

export function middleware() {
    const res = NextResponse.next();
    // res.headers.set('Access-Control-Allow-Origin', process.env.FRONT_END_URL || '');
    return res;
}

export const config = {
    matcher: '/api/:path*',
};
