import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAuth } from '@/lib/auth';

export async function proxy(request: NextRequest) {

    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
    if (isDashboardPage) {
        const token = request.cookies.get('auth_code')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        const auth = await checkAuth(token);
        if (!auth) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/dashboard/:path*'],
};