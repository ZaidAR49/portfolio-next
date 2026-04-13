import sql from "../database-conection";
import { Project } from "../models/project";
import { revalidateTag, cacheLife, cacheTag } from "next/cache";

export async function getProjects() {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { data, error } = await sql.from("projects").select("*");
    if (error) {
        throw error;
    }
    return data;
}
export async function getProjectById(id: number) {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { data, error } = await sql.from("projects").select("*").eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}

export async function addProject(project: Project) {
    const { data, error } = await sql.from("projects").insert(project);
    if (error) {
        throw error;
    }
    revalidateTag("projects", "default");
    return data;
}

export async function updateProject(project: Project) {
    const { data, error } = await sql.from("projects").update(project).eq("id", project.id);
    if (error) {
        throw error;
    }
    revalidateTag("projects", "default");
    return data;
}

export async function deleteProject(id: number) {
    const { data, error } = await sql.from("projects").delete().eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("projects", "default");
    return data;
}
export async function updateProjectImages(id: number, images: string[]) {
    const { data, error } = await sql.from("projects").update({ images }).eq("id", id);
    if (error) {
        throw error;
    }
    revalidateTag("projects", "default");
    return data;
}
export async function getActiveProjects() {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { data, error } = await sql.from("projects").select("*,users!inner(is_active)").eq("users.is_active", true)
    if (error) {
        throw error;
    }
    return data;
}
export async function getProjectsCount() {
    "use cache";
    cacheTag("projects");
    cacheLife("hours");
    const { count, error } = await sql.from("projects").select(`*`, { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count;
}
export async function reorderProjects(user_id: number) {
    const { data, error } = await sql.rpc('reorder_projects_for_user', { target_user_id: user_id });
    if (error) {
        throw error;
    }
    revalidateTag("projects", "default");
    return data;
}