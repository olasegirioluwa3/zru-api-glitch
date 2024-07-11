import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.resolve(__dirname, '..'); // Adjusted to point to the correct parent directory

// Connect to MongoDB
const connectDb = () => {
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Dynamically import all models
const models = {};
const loadModels = async () => {
  try {
    const files = fs.readdirSync(modelsDir);
    for (const file of files) {
      if (file !== 'index.js' && file.endsWith('.js')) {
        const modelPath = path.join(modelsDir, file);
        const model = await import(modelPath);
        models[model.default.modelName] = model.default;
      }
    }
  } catch (error) {
    console.error(`Failed to load models: ${error.message}`);
    throw error;
  }
};

await loadModels();

export { connectDb };
export default models;
