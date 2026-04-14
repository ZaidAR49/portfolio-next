"use server";
import { addAuthCode, verifyAndConsumeCode } from "../lib/services/auth-service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sendAuthCode } from "./contact-action";
import { createHash } from 'crypto';
import { SignJWT } from 'jose';
import z from "zod";
const OtpSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Numbers only"),
});
export async function sendAuthCodeAction() {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = createHash('sha256').update(code).digest('hex');

        await addAuthCode(hashedCode);
        const res = await sendAuthCode(code);
        if (res.success) {
            return { success: true };
        }
        return { success: false };

    }
    catch (error) {
        console.error("Error adding auth code:", error);
        return { success: false };
    }
}
export async function verifyAndConsumeCodeAction(code: string) {
    const parsed = OtpSchema.safeParse({ code });
    if (!parsed.success) {
        return { success: false, message: parsed.error.message };
    }
    try {
        const hashedCode = createHash('sha256').update(code).digest('hex');
        const res = await verifyAndConsumeCode(hashedCode);
        if (res.success) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const jwt = await new SignJWT({ code: hashedCode })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("3h")
                .sign(secret);

            const cookieStore = await cookies();
            cookieStore.set("auth_code", jwt, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 3,
            });

            return { success: true, message: "Code verified successfully" };
        }
        return { success: false, message: "Invalid or expired code" };
    }
    catch (error) {
        console.error("Error verifying and consuming code:", error);
        return { success: false, message: "Internal server error" };
    }
}

export async function signOutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_code");
    redirect("/");
}