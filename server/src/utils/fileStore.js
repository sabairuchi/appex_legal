import fs from 'fs';
import path from 'path';
import os from 'os';

const inMemoryStores = {};

const getWritableDataDir = () => {
  const dirsToTry = [
    path.resolve('server/data'),
    path.resolve('data'),
    path.join(os.tmpdir(), 'apex_legal_data'),
  ];

  for (const dir of dirsToTry) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const testFile = path.join(dir, `.write_test_${Date.now()}`);
      fs.writeFileSync(testFile, 'test', 'utf8');
      fs.unlinkSync(testFile);
      return dir;
    } catch (err) {
      // Continue trying fallback directories
    }
  }
  return null;
};

export const safeLoadFromFile = (filename, defaultData = []) => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Database error: Real MongoDB connection required for ${filename} in production environment.`);
  }

  if (inMemoryStores[filename] !== undefined && inMemoryStores[filename] !== null) {
    return inMemoryStores[filename];
  }

  const dir = getWritableDataDir();
  if (dir) {
    const file = path.join(dir, filename);
    try {
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf8');
        const parsed = JSON.parse(raw || '[]');
        inMemoryStores[filename] = Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultData;
        return inMemoryStores[filename];
      }
    } catch (err) {
      // Ignore read error and fallback
    }
  }

  inMemoryStores[filename] = defaultData;
  return inMemoryStores[filename];
};

export const safeSaveToFile = (filename, data) => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Database error: Real MongoDB connection required for ${filename} in production environment.`);
  }

  inMemoryStores[filename] = data;
  const dir = getWritableDataDir();
  if (dir) {
    const file = path.join(dir, filename);
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn(`[DB File Warning]: Read-only file system. Preserved ${filename} in memory.`);
    }
  }
};
