export default async function fileToBase64(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64Data}`;
}