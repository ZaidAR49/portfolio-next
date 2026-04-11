import cloudinary from "../../cloud-connection";
import fileToBase64 from "../server/to-base64";
const folderName = process.env.NEXT_PUBLIC_ENV;

export const uploadImage = async (file: File) => {
    const base64 = await fileToBase64(file);
    try {
        const result = await cloudinary.uploader.upload(base64, {
            folder: folderName, // This creates the folder structure
            use_filename: true,
            unique_filename: true,
        });
        return result.secure_url; // Save this URL in your database
    } catch (error) {
        console.error("Upload failed", error);
    }
};
export const uploadMultiple = async (files: string[]) => {
    const folderName = process.env.CLOUDINARY_FOLDER;

    const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file, { folder: folderName })
    );

    try {
        const results = await Promise.all(uploadPromises);
        // Return an array of objects containing URL and Public ID
        return results.map(result => result.secure_url);
    } catch (error) {
        console.error("Multi-upload failed", error);
    }
};
export const deleteImage = async (url: string) => {
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)+\.\w+$/
    const match = url.match(regex);
    if (!match) {
        console.error("Invalid URL format");
        throw new Error("Invalid URL format");
    }
    const id = match[1];
    try {
        const result = await cloudinary.uploader.destroy(id);
        return result;
    } catch (error) {
        console.error("Delete failed", error);
    }
};

export const deleteMultiple = async (urls: string[]) => {
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)+\.\w+$/
    const publicIds = urls.map((url) => {
        const match = url.match(regex);
        if (!match) {
            console.error("Invalid URL format");
            throw new Error("Invalid URL format");
        }
        return match[1];
    });
    try {
        // This removes up to 100 resources in one API call
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error("Multi-delete failed", error);
    }
};
