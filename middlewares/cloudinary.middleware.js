import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: 'credentials',
        format: async (req, file) => 'png'||'jpeg'||'jpg', //
        public_id: (req, file) => {
            let filename = file.originalname;
            return `${Date.now()}-${filename.split('.')[0]}`
        },
    },
});

// Initialize multer instance with Cloudinary storage
export const upload = multer({ storage });

export default upload;