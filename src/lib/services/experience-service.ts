import { Experience, ExperienceSchema } from "../models/experience";
import sql from "@/lib/database-conection";

export const getActiveExperiences = async () => {
    try {
        const { data, error } = await sql.from("experiences").select("*,users!inner(is_active)").eq("users.is_active", true);
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching active experiences:", error);
        return [];
    }
}

export const getExperiences = async () => {
    try {
        const { data, error } = await sql.from("experiences").select("*");
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }
}
// add experience
export const addExperience = async (experience: Experience) => {
    try {
        const { data, error } = await sql.from("experiences").insert(experience);
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error adding experience:", error);
        return [];
    }
}
//update experience
export const updateExperience = async (experience: Experience) => {
    try {
        const { data, error } = await sql.from("experiences").update(experience).eq("id", experience.id);
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error updating experience:", error);
        return [];
    }
}
//delete experience
export const deleteExperience = async (id: number) => {
    try {
        const { data, error } = await sql.from("experiences").delete().eq("id", id);
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error deleting experience:", error);
        return [];
    }
}
//get experience by id
export const getExperienceById = async (id: number) => {
    try {
        const { data, error } = await sql.from("experiences").select("*").eq("id", id);
        if (error) {
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching experience by id:", error);
        return [];
    }
}