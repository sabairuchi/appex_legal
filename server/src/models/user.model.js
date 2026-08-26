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
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    assignedLawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    specialization: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'on_leave'],
      default: 'available',
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

import { safeLoadFromFile, safeSaveToFile } from '../utils/fileStore.js';

// --- Embedded File-Backed Persistence Engine (Fallback) ---
const defaultUsers = [
  {
    _id: '0ef25c4331fdee17a12447de',
    fullName: 'Apex Admin',
    email: 'admin@apexlegal.com',
    passwordHash: '$2b$12$T/LUlojwwZYsdaLbotDD7uFZaA2JSoDlfhIaY8t7XsJBuTs.zPn3u',
    role: 'admin',
    profileImage: '',
    isActive: true,
    createdAt: '2026-08-25T10:22:13.645Z',
    updatedAt: '2026-08-25T10:22:13.645Z',
  },
];

const loadUsersFromFile = () => {
  return safeLoadFromFile('users.json', defaultUsers);
};

const saveUsersToFile = (users) => {
  safeSaveToFile('users.json', users);
};

class EmbeddedUserDoc {
  constructor(data) {
    this._id = data._id || crypto.randomBytes(12).toString('hex');
    this.fullName = data.fullName;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.role = data.role || 'client';
    this.profileImage = data.profileImage || '';
    this.phone = data.phone || '';
    this.bio = data.bio || '';
    this.assignedLawyerId = data.assignedLawyerId || null;
    this.specialization = data.specialization || '';
    this.experienceYears = data.experienceYears !== undefined ? Number(data.experienceYears) : 0;
    this.availabilityStatus = data.availabilityStatus || 'available';
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
      phone: this.phone,
      bio: this.bio,
      assignedLawyerId: this.assignedLawyerId,
      specialization: this.specialization,
      experienceYears: this.experienceYears,
      availabilityStatus: this.availabilityStatus,
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

  static find(query = {}) {
    if (isMongooseConnected) {
      let q = MongooseUser.find();
      if (query.role) q = q.where('role').equals(query.role);
      if (query.isActive !== undefined) q = q.where('isActive').equals(query.isActive);
      return q.select('-passwordHash');
    }

    const p = (async () => {
      const users = loadUsersFromFile();
      let filtered = users;

      if (query.role) {
        filtered = filtered.filter((u) => u.role === query.role);
      }
      if (query.isActive !== undefined) {
        filtered = filtered.filter((u) => u.isActive === query.isActive);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter((u) => u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }

      return filtered.map((u) => {
        const doc = new EmbeddedUserDoc(u);
        delete doc.passwordHash;
        delete doc.resetPasswordToken;
        delete doc.resetPasswordExpires;
        return doc;
      });
    })();

    return p;
  }

  static countDocuments(query = {}) {
    if (isMongooseConnected) {
      return MongooseUser.countDocuments(query);
    }

    return (async () => {
      const users = loadUsersFromFile();
      let filtered = users;
      if (query.role) {
        filtered = filtered.filter((u) => u.role === query.role);
      }
      if (query.isActive !== undefined) {
        filtered = filtered.filter((u) => u.isActive === query.isActive);
      }
      return filtered.length;
    })();
  }

  static findOne(query) {
    if (isMongooseConnected) {
      return MongooseUser.findOne(query);
    }

    const p = (async () => {
      const users = loadUsersFromFile();
      let found = null;

      if (query.email) {
        found = users.find((u) => u.email === query.email.toLowerCase());
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
    if (!id) return new QueryChain(Promise.resolve(null));
    if (isMongooseConnected) {
      return MongooseUser.findById(id).select('-passwordHash');
    }

    const p = (async () => {
      const users = loadUsersFromFile();
      const found = users.find((u) => u._id === id.toString());
      if (!found) return null;
      const doc = new EmbeddedUserDoc(found);
      delete doc.passwordHash;
      return doc;
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

  static async findByIdAndUpdate(id, updateData, options = {}) {
    if (isMongooseConnected) {
      return MongooseUser.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, ...options }).select('-passwordHash');
    }

    const users = loadUsersFromFile();
    const idx = users.findIndex((u) => u._id === id.toString());
    if (idx === -1) return null;

    const user = users[idx];
    if (updateData.fullName !== undefined) user.fullName = updateData.fullName;
    if (updateData.email !== undefined) user.email = updateData.email.toLowerCase();
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.bio !== undefined) user.bio = updateData.bio;
    if (updateData.profileImage !== undefined) user.profileImage = updateData.profileImage;
    if (updateData.role !== undefined) user.role = updateData.role;
    if (updateData.isActive !== undefined) user.isActive = updateData.isActive;
    if (updateData.assignedLawyerId !== undefined) user.assignedLawyerId = updateData.assignedLawyerId;
    if (updateData.specialization !== undefined) user.specialization = updateData.specialization;
    if (updateData.experienceYears !== undefined) user.experienceYears = Number(updateData.experienceYears);
    if (updateData.availabilityStatus !== undefined) user.availabilityStatus = updateData.availabilityStatus;
    user.updatedAt = new Date().toISOString();

    users[idx] = user;
    saveUsersToFile(users);
    const doc = new EmbeddedUserDoc(user);
    delete doc.passwordHash;
    return doc;
  }

  static async findByIdAndDelete(id) {
    if (isMongooseConnected) {
      return MongooseUser.findByIdAndDelete(id);
    }

    const users = loadUsersFromFile();
    const idx = users.findIndex((u) => u._id === id.toString());
    if (idx === -1) return null;
    const removed = users.splice(idx, 1)[0];
    saveUsersToFile(users);
    return new EmbeddedUserDoc(removed);
  }
}
