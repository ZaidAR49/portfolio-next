"use server";
import { User, UserSchema } from "@/lib/models/user";
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
export async function addUserAction(user: User) {
    const { error } = UserSchema.safeParse(user);
    if (error) {
        console.error("Error adding user:", error);
        throw error;
    }
    revalidatePath("/");
    try {
        return await addUser(user);
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
}
export async function updateUserAction(user: User) {
    const { error } = UserSchema.safeParse(user);
    if (error) {
        console.error("Error updating user:", error);
        throw error;
    }
    revalidatePath("/");
    try {
        return await updateUser(user);
    } catch (error) {
        console.error("Error updating user:", error);
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
        return await activateUser(id);
    } catch (error) {
        console.error("Error activating user:", error);
        throw error;
    }
}
export async function deactivateUserAction(id: number) {
    revalidatePath("/");
    try {
        return await deactivateUser(id);
    } catch (error) {
        console.error("Error deactivating user:", error);
        throw error;
    }
}
export async function updateUserPictureAction(id: number, picture: string) {
    revalidatePath("/");
    try {
        const user = await getUserByIdAction(id);
        if (user) {
            if (user.picture_url) {
                await deleteImage(user.picture_url);
            }
            const url = await uploadImage(picture);
            if (!url) {
                return null;
            }
            return await updateUserPicture(id, url);
        }
    } catch (error) {
        console.error("Error updating user picture:", error);
        throw error;
    }
}

