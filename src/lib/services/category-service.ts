import sql from "../database-conection";
import { cacheLife, cacheTag, updateTag } from "next/cache";

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

export async function getCategoriesByUserId(userId: number) {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");

    const { data, error } = await sql
        .from("project_categories")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as { id: number; user_id: number; name: string; sort_order: number }[];
}

export async function addCategory(name: string, userId: number) {
    const { data, error } = await sql
        .from("project_categories")
        .insert({ name: name.trim(), user_id: userId })
        .select()
        .single();

    if (error) throw error;
    updateTag("categories");
    return data as { id: number; user_id: number; name: string; sort_order: number };
}

export async function deleteCategory(id: number) {
    // ON DELETE SET NULL on projects.category_id — projects are not deleted
    const { error } = await sql
        .from("project_categories")
        .delete()
        .eq("id", id);

    if (error) throw error;
    updateTag("categories");
    updateTag("projects");
}

export async function getCategoriesCount() {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");
    const { count, error } = await sql
        .from("project_categories")
        .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
}


export async function updateCategory(id: number, name: string) {
    const { data, error } = await sql
        .from("project_categories")
        .update({ name: name.trim() })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    updateTag("categories");
    return data as { id: number; user_id: number; name: string; sort_order: number };
}
