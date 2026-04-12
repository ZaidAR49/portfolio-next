"use server";
import { RequestUser, requestUserSchema, UserSchema, User } from "@/lib/models/user";
import { getUsers, getUserById, addUser, updateUser, deleteUser, getActiveUser, activateUser, deactivateUser, updateUserPicture } from "@/lib/services/user-service";
import { uploadImage, deleteImage } from "@/lib/utils/server/could-upload";
import { revalidatePath } from "next/cache";

export async function getUsersAction() {
    try {
        return await getUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}
export async function getUserByIdAction(id: number) {
    try {
        return await getUserById(id);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}
export async function addUserAction(user: RequestUser) {
    const parsed = requestUserSchema.safeParse(user);

    if (!parsed.success) {
        console.error("Error adding user:", parsed.error);
        throw parsed.error;
    }
    revalidatePath("/");
    try {
        if (user.picture) {
            const url = await uploadImage(user.picture);
            if (!url) {
                throw new Error("Error uploading picture");
            }
            const newUser: User = {
                name: user.name,
                job_title: user.job_title,
                email: user.email,
                hero_description: user.hero_description,
                about_description: user.about_description,
                capabilities_description: user.capabilities_description,
                about_title: user.about_title,
                linkedin_url: user.linkedin_url,
                github_url: user.github_url,
                resume_url: user.resume_url,
                picture_url: url,
                portfolio_name: user.portfolio_name,
            }
            return await addUser(newUser);
        }
        else {
            throw new Error("Picture is required");
        }
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
}
export async function updateUserAction(user: RequestUser) {
    const parsed = requestUserSchema.safeParse(user);
    if (!parsed.success) {
        console.error(" Error parsing user:", parsed.error);
        throw parsed.error;
    }

    try {

        if (user.picture && user.id) {
            //delete old picture
            const oldUserResult = await getUserByIdAction(user.id);
            const oldUser = Array.isArray(oldUserResult) ? oldUserResult[0] : oldUserResult;
            if (oldUser && oldUser.picture_url) {
                await deleteImage(oldUser.picture_url);
            }
            const url = await uploadImage(user.picture);
            if (!url) {
                throw new Error("Error uploading picture");
            }
            const newUser: User = {
                id: user.id,
                name: user.name,
                job_title: user.job_title,
                email: user.email,
                hero_description: user.hero_description,
                about_description: user.about_description,
                capabilities_description: user.capabilities_description,
                about_title: user.about_title,
                linkedin_url: user.linkedin_url,
                github_url: user.github_url,
                resume_url: user.resume_url,
                picture_url: url,
                portfolio_name: user.portfolio_name,
            }
            revalidatePath("/");
            return await updateUser(newUser);
        }
        revalidatePath("/");
        const newUserWithoutPic: User = {
            id: user.id,
            name: user.name,
            job_title: user.job_title,
            email: user.email,
            hero_description: user.hero_description,
            about_description: user.about_description,
            capabilities_description: user.capabilities_description,
            about_title: user.about_title,
            linkedin_url: user.linkedin_url,
            github_url: user.github_url,
            resume_url: user.resume_url,
            portfolio_name: user.portfolio_name,
        };
        return await updateUser(newUserWithoutPic);
    } catch (error) {
        console.error("Error updating user to DB:", error);
        throw error;
    }
}
export async function deleteUserAction(id: number) {
    revalidatePath("/");
    try {
        return await deleteUser(id);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
export async function getActiveUserAction() {

    try {
        return await getActiveUser();
    } catch (error) {
        console.error("Error fetching active user:", error);
        throw error;
    }
}
export async function activateUserAction(id: number) {
    revalidatePath("/");
    try {
        await deactivateUserAction();
        return await activateUser(id);
    } catch (error) {
        console.error("Error activating user:", error);
        throw error;
    }
}
export async function deactivateUserAction() {
    revalidatePath("/");
    try {
        return await deactivateUser();
    } catch (error) {
        console.error("Error deactivating user:", error);
        throw error;
    }
}
// export async function updateUserPictureAction(id: number, picture: string) {
//     revalidatePath("/");
//     try {
//         const user = await getUserByIdAction(id);
//         if (user) {
//             if (user.picture_url) {
//                 await deleteImage(user.picture_url);
//             }
//             const url = await uploadImage(picture);
//             if (!url) {
//                 return null;
//             }
//             return await updateUserPicture(id, url);
//         }
//     } catch (error) {
//         console.error("Error updating user picture:", error);
//         throw error;
//     }
// }

