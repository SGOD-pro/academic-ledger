import { v2 as cloudinary } from "cloudinary";

export const cloudinaryUTIL = async (path: any) => {
	cloudinary.config({
		cloud_name: process.env.NAME,
		api_key: process.env.KEY,
		api_secret: process.env.SECRET,
	});
	try {
		const uploadedFile = await cloudinary.uploader.upload(path, {
			resource_type: "auto",
		});
		return uploadedFile;
	} catch (error: any) {
        console.log(error);
		return null
	}
};
