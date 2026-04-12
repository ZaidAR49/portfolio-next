"use server";
import { getProjects, getProjectById, getActiveProjects, addProject, updateProject, deleteProject, updateProjectImages } from "@/lib/services/project-service";
import { Project, ProjectSchema, RequestProject, RequestProjectSchema } from "@/lib/models/project";
import { uploadImage, deleteImage } from "@/lib/utils/server/could-upload";
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

export async function addProjectWithFilesAction(projectData: RequestProject) {
    const parsed = RequestProjectSchema.safeParse(projectData);
    if (!parsed.success) {
        console.error("Validation error:", parsed.error);
        throw parsed.error;
    }
    
    try {
        const uploadedImages: string[] = [];
        if (parsed.data.new_images) {
            for (const file of parsed.data.new_images) {
                const url = await uploadImage(file);
                if (url) uploadedImages.push(url);
            }
        }
        
        const newProject: Project = {
            ...parsed.data,
            technologies: parsed.data.technologies.split(',').map(s => s.trim()).filter(s => s.length > 0),
            images: [...(parsed.data.images || []), ...uploadedImages],
        };
        
        return await addProjectAction(newProject);
    } catch (e) {
        console.error("Error adding project with files:", e);
        throw e;
    }
}

export async function updateProjectWithFilesAction(projectData: RequestProject, imagesToDelete: string[] = []) {
    const parsed = RequestProjectSchema.safeParse(projectData);
    if (!parsed.success) {
        console.error("Validation error:", parsed.error);
        throw parsed.error;
    }
    
    try {
        // Handle deletions of old images
        for (const imgUrl of imagesToDelete) {
            await deleteImage(imgUrl);
        }
        
        const uploadedImages: string[] = [];
        if (parsed.data.new_images) {
            for (const file of parsed.data.new_images) {
                const url = await uploadImage(file);
                if (url) uploadedImages.push(url);
            }
        }
        
        const remainingImages = (parsed.data.images || []).filter(img => !imagesToDelete.includes(img));
        
        const updatedProject: Project = {
            ...parsed.data,
            id: projectData.id,
            technologies: parsed.data.technologies.split(',').map(s => s.trim()).filter(s => s.length > 0),
            images: [...remainingImages, ...uploadedImages],
        };
        
        return await updateProjectAction(updatedProject);
    } catch (e) {
        console.error("Error updating project with files:", e);
        throw e;
    }
}