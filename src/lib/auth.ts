import { jwtVerify } from 'jose';
export async function checkAuth(token: string) {
    try {
        if (!token) {
            return false;
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch (err) {
        console.error("Middleware Auth Error:", err);
        return false;
    }

}