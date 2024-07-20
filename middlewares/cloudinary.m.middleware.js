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
        format: async (req, file) => 'png' || 'jpeg' || 'jpg',
        public_id: (req, file) => {
            let filename = file.originalname;
            return `${Date.now()}-${filename.split('.')[0]}`;
        },
    },
});

// File filter function to reject files larger than 1MB
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, and JPG files are allowed.'), false);
    }
};

// Initialize multer instance with Cloudinary storage, file filter, and size limit
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
    },
}).array('files', 10); // Adjust 'files' if the field name is different and 10 to the number of files you want to accept

export default upload;
