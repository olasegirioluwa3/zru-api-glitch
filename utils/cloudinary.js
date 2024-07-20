import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file);
        return result;
    } catch (error) {
        throw new Error('Could not upload file to Cloudinary');
    }
};

export const deleteFromCloudinary = async (fileUrl) => {
    try {
        console.log(fileUrl);
        // Extract the public ID of the file from the Cloudinary URL
        const publicId = fileUrl.split('/').pop().split('.')[0];
        console.log(publicId);
    
        // Delete the file from Cloudinary
        await cloudinary.uploader.destroy(`credentials/${publicId}`);
    
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete file from Cloudinary');
    }
};

export default { uploadToCloudinary, deleteFromCloudinary };