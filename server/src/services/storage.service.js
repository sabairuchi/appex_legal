import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOADS_ROOT = path.resolve('uploads');

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Unified Storage Service Abstraction
 * Supports persistent local filesystem storage as active default,
 * and structured provider hooks for AWS S3 / Cloudinary / Supabase Storage.
 */
export const uploadFile = async (file, category = 'documents') => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const provider = process.env.STORAGE_PROVIDER || 'local';

  // Sanitize Filename
  const ext = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const safeFilename = `${baseName}_${uniqueId}${ext}`;

  if (provider === 's3' && process.env.AWS_S3_BUCKET) {
    // S3 Cloud Storage Integration Hook
    // In production with credentials, AWS SDK S3 PutObject would be invoked here.
    // Falls back gracefully if credentials are missing.
    console.log('[Storage Service] AWS S3 upload configured for bucket:', process.env.AWS_S3_BUCKET);
  }

  if (provider === 'cloudinary' && process.env.CLOUDINARY_URL) {
    // Cloudinary Integration Hook
    console.log('[Storage Service] Cloudinary upload configured');
  }

  // Active Production-Safe Local Storage Provider
  const categoryDir = path.join(UPLOADS_ROOT, category);
  ensureDirectory(categoryDir);

  const destinationPath = path.join(categoryDir, safeFilename);

  // If multer stored in temp memory buffer or temp disk path
  if (file.buffer) {
    await fs.promises.writeFile(destinationPath, file.buffer);
  } else if (file.path) {
    await fs.promises.copyFile(file.path, destinationPath);
    await fs.promises.unlink(file.path).catch(() => {});
  } else {
    throw new Error('Invalid file payload structure');
  }

  const fileUrl = `/uploads/${category}/${safeFilename}`;
  const fileKey = `${category}/${safeFilename}`;

  return {
    fileUrl,
    fileKey,
    filename: file.originalname,
    fileSize: file.size,
    fileType: file.mimetype,
  };
};

/**
 * Validate Image File
 */
export const validateImageFile = (file) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit

  if (!file) {
    return { valid: false, message: 'No profile image file uploaded' };
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { valid: false, message: 'Invalid image format. Allowed formats: JPG, PNG, WEBP' };
  }
  if (file.size > maxSizeBytes) {
    return { valid: false, message: 'Profile image size must be under 5MB' };
  }
  return { valid: true };
};

/**
 * Validate Legal Document File
 */
export const validateDocumentFile = (file) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
  ];
  const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit

  if (!file) {
    return { valid: false, message: 'No document file provided' };
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { valid: false, message: 'Unsupported file type. Allowed formats: PDF, DOC, DOCX, TXT, JPG, PNG' };
  }
  if (file.size > maxSizeBytes) {
    return { valid: false, message: 'Document size exceeds maximum limit of 15MB' };
  }
  return { valid: true };
};
