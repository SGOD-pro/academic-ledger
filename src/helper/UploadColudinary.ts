import { cloudinaryUTIL } from "@/configurations/Cloudinary";
import { promisify } from "util";
import fs from "fs";
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const uploadImage = async (file: any) => {
	if (file instanceof File) {
		try {
			const buffer = await file.arrayBuffer();

			const filePath = "./public/" + Date.now().toString() + file.name;

			await writeFileAsync(filePath, Buffer.from(buffer));

			const uploadedFile: any = await cloudinaryUTIL(filePath);
			if (filePath) {
				await unlinkAsync(filePath);
			}
			return uploadedFile?.url;
		} catch (error) {
			return false;
		}
	}
};
export default uploadImage;