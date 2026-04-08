import { getProjects, getProjectById, getActiveProjects, addProject, updateProject, deleteProject, updateProjectImages } from "@/lib/services/project-service";
import { Project, ProjectSchema } from "@/lib/models/project";
import { revalidatePath } from "next/cache";

export async function getProjectsAction() {
    try {
        return await getProjects();
    } catch (error) {
        console.error("Error getting projects:", error);
        throw error;
    }
}
export async function getActiveProjectsAction() {
    try {
        return await getActiveProjects();
    } catch (error) {
        console.error("Error getting active projects:", error);
        throw error;
    }
}
export async function getProjectByIdAction(id: number) {
    try {
        return await getProjectById(id);
    } catch (error) {
        console.error("Error getting project by id:", error);
        throw error;
    }
}
export async function addProjectAction(project: Project) {
    const validatedProject = ProjectSchema.safeParse(project);
    if (!validatedProject.success) {
        throw new Error(validatedProject.error.message);
    }
    try {
        revalidatePath("/");
        return await addProject(validatedProject.data);
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
}
export async function updateProjectAction(project: Project) {
    const validatedProject = ProjectSchema.safeParse(project);
    if (!validatedProject.success) {
        throw new Error(validatedProject.error.message);
    }
    try {
        revalidatePath("/");
        return await updateProject(validatedProject.data);
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
}
export async function deleteProjectAction(id: number) {
    try {
        revalidatePath("/");
        return await deleteProject(id);
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
}
export async function updateProjectImagesAction(id: number, images: string[]) {
    try {
        revalidatePath("/");
        return await updateProjectImages(id, images);
    } catch (error) {
        console.error("Error updating project images:", error);
        throw error;
    }
}