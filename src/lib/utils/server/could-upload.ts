import cloudinary from "../../cloud-connection";
import fileToBase64 from "../server/to-base64";

const folderName = process.env.NEXT_PUBLIC_FOLDER_NAME || process.env.CLOUDINARY_FOLDER || "portfolio";

export const uploadImage = async (file: File) => {
    const base64 = await fileToBase64(file);
    try {
        const result = await cloudinary.uploader.upload(base64, {
            folder: folderName,
            use_filename: true,
            unique_filename: true,
        });
        return result.secure_url;
    } catch (error) {
        console.error("Upload failed", error);
        throw error;
    }
};

export const uploadMultiple = async (files: string[]) => {
    const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file, { folder: folderName })
    );
    try {
        const results = await Promise.all(uploadPromises);
        return results.map(result => result.secure_url);
    } catch (error) {
        console.error("Multi-upload failed", error);
        throw error;
    }
};

/**
 * Robustly extracts the Cloudinary public_id (including folder path) from a URL.
 * Handles:
 * - Version prefixes (v123456789)
 * - Transformations (c_scale,w_500, f_auto, q_auto, etc.)
 * - File extensions (.jpg, .png, .webp, .svg, etc.)
 * - URLs with multiple dots in filename
 * - Query params & hash fragments
 * Returns null if the URL is not a valid Cloudinary resource URL.
 */
export const extractPublicId = (url: string): string | null => {
    if (!url || typeof url !== "string") return null;

    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) {
        return null;
    }

    // Get everything after '/upload/'
    let path = url.substring(uploadIndex + "/upload/".length);

    // Remove query params or hash if present
    const queryIndex = path.search(/[?#]/);
    if (queryIndex !== -1) {
        path = path.substring(0, queryIndex);
    }

    // Split path into segments
    const segments = path.split("/");

    // Skip transformation segments and version segment
    let startIndex = 0;
    while (startIndex < segments.length) {
        const seg = segments[startIndex];
        // Version segment (e.g. v1724912345 or v1)
        if (/^v\d+$/.test(seg)) {
            startIndex++;
            break;
        }
        // Transformation segment (e.g. c_scale,w_500 or f_auto)
        if (seg.includes(",") || /^[a-z]{1,2}_[a-zA-Z0-9_:-]+/.test(seg)) {
            startIndex++;
            continue;
        }
        // This is the start of folder / filename
        break;
    }

    const publicPathSegments = segments.slice(startIndex);
    if (publicPathSegments.length === 0) return null;

    const fullPublicPath = publicPathSegments.join("/");

    // Strip file extension from the end
    const lastDotIndex = fullPublicPath.lastIndexOf(".");
    if (lastDotIndex !== -1) {
        return fullPublicPath.substring(0, lastDotIndex);
    }

    return fullPublicPath;
};

/**
 * Deletes a single image from Cloudinary safely.
 * Will not throw errors for non-Cloudinary or invalid URLs.
 */
export const deleteImage = async (url: string) => {
    if (!url) return null;
    const publicId = extractPublicId(url);
    if (!publicId) {
        // Not a Cloudinary image — safely skip
        return null;
    }
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error(`[deleteImage] Failed to delete Cloudinary image: ${publicId}`, error);
        return null;
    }
};

/**
 * Deletes multiple images from Cloudinary in parallel safely.
 */
export const deleteMultiple = async (urls: string[]) => {
    if (!Array.isArray(urls) || urls.length === 0) return [];
    
    const validUrls = urls.filter(u => typeof u === "string" && u.trim().length > 0);
    const deletePromises = validUrls.map((url) => deleteImage(url));
    const results = await Promise.allSettled(deletePromises);
    return results;
};

