import { getActiveAuthCodesAction, addAuthCodeAction, verifyAndConsumeCodeAction } from "../lib/services/auth-service";
import { cookies } from "next/headers";
export async function getActiveAuthCodes() {
    try {
        return await getActiveAuthCodesAction();
    }
    catch (error) {
        console.error("Error fetching active auth codes:", error);
        return [];
    }
}
export async function addAuthCode(code: string) {
    try {
        return await addAuthCodeAction(code);
    }
    catch (error) {
        console.error("Error adding auth code:", error);
        return [];
    }
}
export async function verifyAndConsumeCode(code: string) {
    try {
        return await verifyAndConsumeCodeAction(code);
    }
    catch (error) {
        console.error("Error verifying and consuming code:", error);
        return [];
    }
}