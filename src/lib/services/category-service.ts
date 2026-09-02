import sql from "../database-conection";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { Category, CategoryType } from "../models/category";

export async function getActiveCategories(type?: CategoryType) {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");

    let query = sql
        .from("categories")
        .select("*, users!inner(is_active)")
        .eq("users.is_active", true)
        .order("sort_order", { ascending: true });

    if (type) {
        query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Category[];
}

export async function getCategoriesByUserId(userId: number, type?: CategoryType) {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");

    let query = sql
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true });

    if (type) {
        query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Category[];
}

export async function getCategoryById(id: number) {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");

    const { data, error } = await sql
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as Category;
}

export async function addCategory(
    name: string,
    userId: number,
    type: CategoryType = "project",
    sortOrder: number = 0
) {
    const { data, error } = await sql
        .from("categories")
        .insert({ name: name.trim(), user_id: userId, type, sort_order: sortOrder })
        .select()
        .single();

    if (error) throw error;
    updateTag("categories");
    if (type === "project") updateTag("projects");
    if (type === "skill") updateTag("skills");
    return data as Category;
}

export async function deleteCategory(id: number) {
    const { error } = await sql
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) throw error;
    updateTag("categories");
    updateTag("projects");
    updateTag("skills");
}

export async function getCategoriesCount(type?: CategoryType) {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");
    let query = sql
        .from("categories")
        .select("*", { count: "exact", head: true });
    if (type) {
        query = query.eq("type", type);
    }
    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
}

export async function updateCategory(id: number, name: string) {
    const { data, error } = await sql
        .from("categories")
        .update({ name: name.trim() })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    updateTag("categories");
    updateTag("projects");
    updateTag("skills");
    return data as Category;
}

export async function bulkUpdateCategoryOrders(updates: { id: number; sort_order: number }[]) {
    const promises = updates.map(({ id, sort_order }) =>
        sql
            .from("categories")
            .update({ sort_order })
            .eq("id", id)
    );

    const results = await Promise.all(promises);
    for (const res of results) {
        if (res.error) throw res.error;
    }

    updateTag("categories");
    updateTag("projects");
    updateTag("skills");
    return true;
}


