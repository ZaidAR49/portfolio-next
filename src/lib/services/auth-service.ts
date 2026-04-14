import sql from "../database-conection";


export async function getActiveAuthCodes() {
    const { data, error } = await sql
        .from("auth_codes")
        .select("*")
        .gt("expires_at", new Date().toISOString());

    if (error) throw error;
    return data;
}


export async function addAuthCode(hashedCode: string) {
    await sql.from("auth_codes").delete().lt("expires_at", new Date().toISOString());

    const { data, error } = await sql
        .from("auth_codes")
        .insert({ code_hash: hashedCode })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function verifyAndConsumeCode(userInputHash: string) {
    const { data, error } = await sql
        .from("auth_codes")
        .select("*")
        .eq("code_hash", userInputHash)
        .gt("expires_at", new Date().toISOString())
        .single();

    if (error || !data) {
        return { success: false, message: "Invalid or expired code" };
    }
    await sql.from("auth_codes").delete().eq("id", data.id);

    return { success: true, data };
}