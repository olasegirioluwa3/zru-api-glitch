import Credential from '../models/credential.js';
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary config is set up here as well
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find();
        res.status(200).json(credentials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUserCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find({ userId: req.user._id });
        res.status(200).json(credentials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCredentialById = async (req, res) => {
    try {
        const credential = await Credential.findOne({ _id: req.params.id, userId: req.user._id });
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        res.status(200).json(credential);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCredential = async (req, res) => {
    try {
        const { userId, credentialName, credentialDetails } = req.body;
        const credentialFiles = req.file.path; // Assuming multer or similar middleware is used
        
        const newCredential = new Credential({
            userId,
            credentialName,
            credentialDetails,
            credentialFiles,
            credentialStatus: 'uploaded',
        });

        await newCredential.save();

        res.status(201).json(newCredential);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add file to an existing credential
const addFileToCredential = async (req, res) => {
    try {
        const { id } = req.params;
        
        const credential = await Credential.findById(id);

        if (!credential) return res.status(404).json({ message: 'Credential not found' });
        
        if (credential.credentialStatus === "approved") {
            return res.status(400).json({ message: 'New File cannot be added to an Approved Credential' });
        }

        let files = credential.credentialFiles;
        if (req.file) {
            files = files + `,${req.file.path}`;
            credential.credentialFiles = files;
            credential.credentialStatus = "uploaded";
            await credential.save();
        }

        res.status(200).json(credential);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCredential = async (req, res) => {
    try {
        const { id } = req.params;
        const { credentialName, credentialDetails } = req.body;
        const credentialStatus = "uploaded";
        console.log(req.body);

        const credential = await Credential.findById(id);

        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        if (credential.credentialStatus === "approved") {
            return res.status(400).json({ message: 'Approved Credential cannot be updated' });
        }

        // Update credential document
        const updatedCredential = await Credential.findByIdAndUpdate(
            id,
            { credentialName, credentialDetails, credentialStatus },
            { new: true }
        );

        if (!updatedCredential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        
        res.status(200).json(updatedCredential);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const reviseCredential = async (req, res) => {
    try {
        const { id } = req.params;
        const { credentialComment } = req.body;
        const credentialStatus = "uploaded";

        const credential = await Credential.findById(id);

        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        if (credential.credentialStatus === "approved") {
            return res.status(400).json({ message: 'Approved Credential cannot be updated' });
        }

        // Update credential document
        const updatedCredential = await Credential.findByIdAndUpdate(
            id,
            { credentialComment, credentialStatus },
            { new: true }
        );

        if (!updatedCredential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        
        res.status(200).json(updatedCredential);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const approveCredential = async (req, res) => {
    try {
        const { id } = req.params;
        const credentialStatus = "approved";
        const credentialComment = "";

        const credential = await Credential.findById(id);

        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        if (credential.credentialStatus === "approved") {
            return res.status(400).json({ message: 'Approved Credential does not need to be reapproved' });
        }

        // Update credential document
        const updatedCredential = await Credential.findByIdAndUpdate(
            id,
            { credentialStatus, credentialComment },
            { new: true }
        );

        if (!updatedCredential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        
        res.status(200).json(updatedCredential);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const rejectCredential = async (req, res) => {
    try {
        const { id } = req.params;
        const { credentialComment } = req.body;
        const credentialStatus = "rejected";

        const credential = await Credential.findById(id);

        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        if (credential.credentialStatus === "approved") {
            return res.status(400).json({ message: 'Approved Credential cannot be rejected' });
        }

        // Update credential document
        const updatedCredential = await Credential.findByIdAndUpdate(
            id,
            { credentialStatus, credentialComment },
            { new: true }
        );

        if (!updatedCredential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        
        res.status(200).json(updatedCredential);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCredential = async (req, res) => {
    try {
        const { id } = req.params;
        const credential = await Credential.findById(id);
    
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        if (credential.credentialStatus === "approved") {
            return res.status(400).json({ message: 'Approved Credential cannot be removed' });
        }
    
        // Extract the public IDs of the files from the Cloudinary URLs
        const fileUrls = credential.credentialFiles.split(',');
        const publicIds = fileUrls.map(url => `credentials/${url.split('/').pop().split('.')[0]}`);
        
        // Delete the files from Cloudinary
        const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
        await Promise.all(deletePromises);
        
        // Delete the credential from the database
        const delCredential = await Credential.findByIdAndDelete(id);
        if (!delCredential) {
            return res.status(404).send({ message: 'Credential not deleted' });
        }
        
        res.status(200).json({ message: 'Credential and associated files deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove a specific file from a credential
const removeFileFromCredential = async (req, res) => {
    try {
        const credential = await Credential.findById(req.params.id);
        if (!credential) return res.status(404).json({ message: 'Credential not found' });

        const fileUrl = req.params.fileURL;
        const fileIndex = credential.credentialFiles.indexOf(fileUrl);
        if (fileIndex > -1) {
            credential.credentialFiles.splice(fileIndex, 1);
            const publicId = fileUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(`credentials/${publicId}`);
        }

        await credential.save();
        res.status(200).json(credential);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const credentialController = {
    getAllCredentials,
    getAllUserCredentials,
    getCredentialById,
    createCredential,
    addFileToCredential,
    updateCredential,
    reviseCredential,
    approveCredential,
    rejectCredential,
    deleteCredential,
    removeFileFromCredential,
}

export default credentialController;