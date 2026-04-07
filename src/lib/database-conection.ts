import { createClient } from "@supabase/supabase-js";

// Give sql an explicit 'any' type to avoid the 'implicitly has type any' TS error
let sql: any;
try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase URL or Key");
    }
    sql = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Database connected successfully");
}
catch (error) {
    console.log("❌ Database connection failed");
    console.log(error);
}
export default sql;