import { getActiveExperiences, getExperiences, addExperience, updateExperience, deleteExperience, getExperienceById } from "@/lib/services/experience-service";
import { Experience, ExperienceSchema } from "@/lib/models/experience";
import { revalidatePath } from "next/cache";

export const getActiveExperiencesAction = async () => {
    try {
        return await getActiveExperiences();
    } catch (error) {
        console.error("Error fetching active experiences:", error);
        return [];
    }
}
export const getExperiencesAction = async () => {
    try {
        return await getExperiences();
    } catch (error) {
        console.error("Error fetching experiences:", error);
        throw error;
    }
}
export const addExperienceAction = async (experience: Experience) => {
    try {
        return await addExperience(experience);
    } catch (error) {
        console.error("Error adding experience:", error);
        throw error;
    }
}
export const updateExperienceAction = async (experience: Experience) => {
    try {
        revalidatePath("/");
        return await updateExperience(experience);
    } catch (error) {
        console.error("Error updating experience:", error);
        throw error;
    }
}
export const deleteExperienceAction = async (id: number) => {
    try {
        revalidatePath("/");
        return await deleteExperience(id);
    } catch (error) {
        console.error("Error deleting experience:", error);
        throw error;
    }
}
export const getExperienceByIdAction = async (id: number) => {
    try {
        return await getExperienceById(id);
    } catch (error) {
        console.error("Error fetching experience by id:", error);
        throw error;
    }
}
