import { Skill } from "../models/skill";
import sql from "../database-conection";
import { updateTag, cacheLife, cacheTag } from "next/cache";

export async function getSkills() {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql.from("skills").select("*").order("id", { ascending: true });
    if (error) {
        throw error;
    }
    return data as Skill[];
}

export async function getActiveSkills() {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql
        .from("skills")
        .select("*, users!inner(is_active)")
        .eq("users.is_active", true)
        .order("id", { ascending: true });
    if (error) {
        throw error;
    }
    return data as Skill[];
}

export async function getSkillsByUserId(userId: number) {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql
        .from("skills")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: true });
    if (error) {
        throw error;
    }
    return data as Skill[];
}

export async function getSkillById(id: number) {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { data, error } = await sql.from("skills").select("*").eq("id", id).single();
    if (error) {
        throw error;
    }
    return data as Skill;
}

export async function addSkill(skill: Skill) {
    const payload: Partial<Skill> = {
        name: skill.name.trim(),
        user_id: skill.user_id,
        category_id: skill.category_id ?? null,
    };
    if (skill.type) payload.type = skill.type;

    const { data, error } = await sql.from("skills").insert(payload).select().single();
    if (error) {
        throw error;
    }
    updateTag("skills");
    return data as Skill;
}

export async function updateSkill(skill: Skill) {
    const payload: Partial<Skill> = {
        name: skill.name.trim(),
        user_id: skill.user_id,
        category_id: skill.category_id ?? null,
    };
    if (skill.type) payload.type = skill.type;

    const { data, error } = await sql.from("skills").update(payload).eq("id", skill.id!).select().single();
    if (error) {
        throw error;
    }
    updateTag("skills");
    return data as Skill;
}

export async function deleteSkill(id: number) {
    const { data, error } = await sql.from("skills").delete().eq("id", id);
    if (error) {
        throw error;
    }
    updateTag("skills");
    return data;
}

export async function getSkillsCount() {
    "use cache";
    cacheTag("skills");
    cacheLife("hours");
    const { count, error } = await sql.from("skills").select(`*`, { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count;
}