"use server";

import { addUser, deactivateUser } from "@/lib/services/user-service";
import { addProject } from "@/lib/services/project-service";
import { addSkill } from "@/lib/services/skills-service";
import { addExperience } from "@/lib/services/experience-service";
import { revalidatePath } from "next/cache";

export async function importDataAction(data: any) {
    try {
        if (!data.user || !data.projects || !data.skills || !data.experiences) {
            throw new Error("Invalid import data format.");
        }
        const newUserToInsert = {
            name: data.user.name,
            job_title: data.user.job_title,
            email: data.user.email,
            hero_description: data.user.hero_description,
            about_description: data.user.about_description,
            capabilities_description: data.user.capabilities_description,
            about_title: data.user.about_title,
            linkedin_url: data.user.linkedin_url,
            github_url: data.user.github_url,
            resume_url: data.user.resume_url,
            picture_url: data.user.picture_url,
            portfolio_name: data.user.portfolio_name,
            is_active: false
        };
        let newUserId: number;
        try {
            const newUser = await addUser(newUserToInsert);
            newUserId = newUser.id;
        } catch (error) {
            console.error("Error adding user:", error);
            throw new Error("Failed to add user.");
        }

        // 3. Prepare and add projects
        if (Array.isArray(data.projects)) {
            for (const proj of data.projects) {
                const newProj = {
                    user_id: newUserId,
                    title: proj.title,
                    client: proj.client,
                    role: proj.role,
                    year: proj.year,
                    status: proj.status,
                    sort_order: proj.sort_order,
                    description: proj.description,
                    github_url: proj.github_url,
                    technologies: proj.technologies,
                    images: proj.images,
                };
                try {
                    await addProject(newProj);
                } catch (error) {
                    console.error("Error adding project:", error);
                    throw new Error("Failed to add project.");
                }
            }
        }

        // 4. Prepare and add skills
        if (Array.isArray(data.skills)) {
            for (const skill of data.skills) {
                const newSkill = {
                    user_id: newUserId,
                    name: skill.name,
                    type: skill.type,
                };
                try {
                    await addSkill(newSkill);
                } catch (error) {
                    console.error("Error adding skill:", error);
                    throw new Error("Failed to add skill.");
                }
            }
        }

        // 5. Prepare and add experiences
        if (Array.isArray(data.experiences)) {
            for (const exp of data.experiences) {
                const newExp = {
                    user_id: newUserId,
                    role: exp.role,
                    period: exp.period,
                    description: exp.description,
                    company: exp.company,
                };
                try {
                    await addExperience(newExp);
                } catch (error) {
                    console.error("Error adding experience:", error);
                    throw new Error("Failed to add experience.");
                }
            }
        }

        revalidatePath("/");

        return { success: true, message: "Data imported successfully!" };
    } catch (error) {
        console.error("Error importing data:", error);
        throw new Error("Failed to import user data.");
    }
}
