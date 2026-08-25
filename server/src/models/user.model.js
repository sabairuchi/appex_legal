import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { isMongooseConnected } from '../config/db.js';

// Mongoose Schema Definition
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['client', 'lawyer', 'admin'],
      default: 'client',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

const MongooseUser = mongoose.model('User', userSchema);

// --- Embedded File-Backed Persistence Engine (Fallback) ---
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
  }
};

const loadUsersFromFile = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
};

const saveUsersToFile = (users) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
};

class EmbeddedUserDoc {
  constructor(data) {
    this._id = data._id || crypto.randomBytes(12).toString('hex');
    this.fullName = data.fullName;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.role = data.role || 'client';
    this.profileImage = data.profileImage || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.resetPasswordToken = data.resetPasswordToken || undefined;
    this.resetPasswordExpires = data.resetPasswordExpires
      ? new Date(data.resetPasswordExpires)
      : undefined;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
  }

  async save() {
    this.updatedAt = new Date();
    const users = loadUsersFromFile();
    const idx = users.findIndex((u) => u._id === this._id);
    
    let formattedExpires = undefined;
    if (this.resetPasswordExpires) {
      formattedExpires = this.resetPasswordExpires instanceof Date
        ? this.resetPasswordExpires.toISOString()
        : new Date(this.resetPasswordExpires).toISOString();
    }

    const plainDoc = {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.role,
      profileImage: this.profileImage,
      isActive: this.isActive,
      resetPasswordToken: this.resetPasswordToken,
      resetPasswordExpires: formattedExpires,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : new Date(this.createdAt).toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };

    if (idx >= 0) {
      users[idx] = plainDoc;
    } else {
      users.push(plainDoc);
    }
    saveUsersToFile(users);
    return this;
  }
}

// Query Wrapper supporting Mongoose-like method chaining (.select(), etc.)
class QueryChain {
  constructor(promise) {
    this.promise = promise;
  }

  select(fields) {
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

// Unified User API Export
export default class User {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  static findOne(query) {
    if (isMongooseConnected) {
      return MongooseUser.findOne(query);
    }

    const p = (async () => {
      const users = loadUsersFromFile();
      let found = null;

      if (query.email) {
        found = users.find((u) => u.email === query.email);
      } else if (query.resetPasswordToken) {
        found = users.find((u) => {
          if (u.resetPasswordToken !== query.resetPasswordToken) return false;
          if (!u.resetPasswordExpires) return false;
          const expires = new Date(u.resetPasswordExpires).getTime();
          return expires > Date.now();
        });
      }

      if (!found) return null;
      return new EmbeddedUserDoc(found);
    })();

    return new QueryChain(p);
  }

  static findById(id) {
    if (isMongooseConnected) {
      return MongooseUser.findById(id).select('-passwordHash');
    }

    const p = (async () => {
      const users = loadUsersFromFile();
      const found = users.find((u) => u._id === id);
      if (!found) return null;
      return new EmbeddedUserDoc(found);
    })();

    return new QueryChain(p);
  }

  static async create(data) {
    if (isMongooseConnected) {
      return MongooseUser.create(data);
    }

    const doc = new EmbeddedUserDoc(data);
    await doc.save();
    return doc;
  }
}
