"use server";

import crypto from "crypto";
import supabase from "@/config/database-conection";
import transporter from "@/config/email";
import { securityCodeEmailTemplate } from "@/templates/security-code-email-template";

export const sendSecurityCode = async () => {
    try {
        const securityCode = crypto.randomBytes(16).toString("hex");

        // Clear existing codes to have only one active code
        await supabase.from("security").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Just a hack to match any UUID

        // Note: Assuming there is a 'security' table with a 'code' column.
        const { error } = await supabase
            .from("security")
            .insert({ code: securityCode });

        if (error) throw error;

        console.log("securityCode stored in database:");

        const emailToOwner = {
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Sending to owner
            subject: "Your Portfolio Admin Access Code",
            html: securityCodeEmailTemplate(securityCode, process.env.LIVE_URL || ""),
        };

        if (transporter && process.env.EMAIL) {
            await transporter.sendMail(emailToOwner);
            console.log("Security code sent");
        } else {
            console.warn("Email transporter not configured. Use the backend logs to see the code: ", securityCode);
        }
        
        return { success: true, message: "Security code generated/sent successfully!" };
    } catch (error: any) {
        console.error("Error sending security code:", error);
        return { success: false, error: error.message || "Failed to send code." };
    }
};

export const verifySecurityCode = async (code: string) => {
    try {
        const { data, error } = await supabase
            .from("security")
            .select("code")
            .eq("code", code)
            .single();

        if (error || !data) {
            return { success: false, error: "Invalid security code" };
        }

        return { success: true, message: "Security code verified." };
    } catch (error: any) {
        console.error("Error verifying security code:", error);
        return { success: false, error: "Failed to verify code." };
    }
};