"use server";
import { RequestUser, requestUserSchema, UserSchema } from "@/lib/models/user";
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
                ...user,
                picture_url: url,
                is_active: user.is_active ?? false,
                id: user.id
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
        console.error("Error updating user:", parsed.error);
        throw parsed.error;
    }

    try {
        if (user.picture && user.id) {
            //delete old picture
            const oldUser = await getUserByIdAction(user.id);
            if (oldUser) {
                await deleteImage(oldUser.picture_url);
            }
            const url = await uploadImage(user.picture);
            if (!url) {
                throw new Error("Error uploading picture");
            }
            const newUser: User = {
                ...user,
                picture_url: url,
                is_active: user.is_active ?? false,
                id: user.id
            }
            revalidatePath("/");
            return await updateUser(newUser);
        }
        revalidatePath("/");
        const newUserWithoutPic: User = { 
            ...user, 
            picture_url: null,
            is_active: user.is_active ?? false,
            id: user.id
        };
        return await updateUser(newUserWithoutPic);
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

