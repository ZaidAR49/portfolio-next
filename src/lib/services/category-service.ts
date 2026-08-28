import sql from "../database-conection";
import { cacheLife, cacheTag } from "next/cache";

export async function getActiveCategories() {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");

    const { data, error } = await sql
        .from("project_categories")
        .select("*, users!inner(is_active)")
        .eq("users.is_active", true)
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as { id: number; user_id: number; name: string; sort_order: number }[];
}
