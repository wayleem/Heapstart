import cloudinary from '../config/cloudinary';
import { unlink } from 'fs/promises';

export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    await unlink(file.path); // Delete the file from local storage after upload
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};
