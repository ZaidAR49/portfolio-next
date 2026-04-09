
import sql from "../database-conection";
import { User } from "../models/user";

export async function getUsers() {
    const { data, error } = await sql.from("users").select("*");
    if (error) {
        throw error;
    }
    return data;
}
export async function getUserById(id: number) {
    const { data, error } = await sql.from("users").select("*").eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}

export async function addUser(user: User) {
    const { data, error } = await sql.from("users").insert(user);
    if (error) {
        throw error;
    }
    return data;
}

export async function updateUser(user: User) {
    const { data, error } = await sql.from("users").update(user).eq("id", user.id);
    if (error) {
        throw error;
    }
    return data;
}

export async function deleteUser(id: number) {
    const { data, error } = await sql.from("users").delete().eq("id", id);
    if (error) {
        throw error;
    }
    return data;
} ``

export async function getActiveUser() {
    const { data, error } = await sql.from("users").select("*").eq("is_active", true).single();
    if (error) {
        throw error;
    }
    return data;
}
export async function activateUser(id: number) {
    const { data, error } = await sql.from("users").update({ is_active: true }).eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}
export async function deactivateUser() {
    const { data, error } = await sql.from("users").update({ is_active: false }).eq("is_active", true);
    if (error) {
        throw error;
    }
    return data;
}
export async function updateUserPicture(id: number, picture_url: string) {
    const { data, error } = await sql.from("users").update({ picture_url }).eq("id", id);
    if (error) {
        throw error;
    }
    return data;
}

export async function getUsersCount() {
    const { count, error } = await sql.from("users").select(`*`, { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count;
}
