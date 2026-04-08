import { Skill } from "../models/skill";
import sql from "../database-conection";

export async function getSkills() {
    const { data, error } = await sql.from("skills").select("*");
    if (error) {
        throw error;
    }
    return data;
}
export async function getSkillById(id: number) {
    const { data, error } = await sql.from("skills").select("*").eq("id", id).single();
    if (error) {
        throw error;
    }
    return data;
}
export async function addSkill(skill: Skill) {
    const { data, error } = await sql.from("skills").insert(skill);
    if (error) {
        throw error;
    }
    return data;
}
export async function updateSkill(skill: Skill) {
    const { data, error } = await sql.from("skills").update(skill).eq("id", skill.id);
    if (error) {
        throw error;
    }
    return data;
}
export async function deleteSkill(id: number) {
    const { data, error } = await sql.from("skills").delete().eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}