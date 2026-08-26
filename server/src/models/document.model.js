import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { isMongooseConnected } from '../config/db.js';

// Mongoose Schema Definition
const documentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    filename: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String,
      enum: ['client', 'lawyer', 'admin'],
      default: 'client',
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'pending_review'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseDocument = mongoose.model('Document', documentSchema);

import { safeLoadFromFile, safeSaveToFile } from '../utils/fileStore.js';

// --- Embedded File-Backed Persistence Engine (Fallback) ---
const loadDocumentsFromFile = () => {
  return safeLoadFromFile('documents.json', []);
};

const saveDocumentsToFile = (documents) => {
  safeSaveToFile('documents.json', documents);
};

class EmbeddedDocumentDoc {
  constructor(data) {
    this._id = data._id || crypto.randomBytes(12).toString('hex');
    this.client = data.client;
    this.title = data.title;
    this.filename = data.filename;
    this.fileUrl = data.fileUrl;
    this.fileKey = data.fileKey || '';
    this.fileType = data.fileType || 'application/pdf';
    this.fileSize = data.fileSize || 0;
    this.uploadedBy = data.uploadedBy || 'client';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const documents = loadDocumentsFromFile();
    const idx = documents.findIndex((d) => d._id === this._id);

    const plainDoc = {
      _id: this._id,
      client: this.client,
      title: this.title,
      filename: this.filename,
      fileUrl: this.fileUrl,
      fileKey: this.fileKey,
      fileType: this.fileType,
      fileSize: this.fileSize,
      uploadedBy: this.uploadedBy,
      status: this.status,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : new Date(this.createdAt).toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };

    if (idx >= 0) {
      documents[idx] = plainDoc;
    } else {
      documents.push(plainDoc);
    }
    saveDocumentsToFile(documents);
    return this;
  }
}

export default class Document {
  static find(query = {}) {
    if (isMongooseConnected) {
      return MongooseDocument.find(query).sort({ createdAt: -1 });
    }

    const p = (async () => {
      const documents = loadDocumentsFromFile();
      let filtered = documents;

      if (query.client) {
        filtered = filtered.filter((d) => d.client.toString() === query.client.toString());
      }
      if (query.status) {
        filtered = filtered.filter((d) => d.status === query.status);
      }

      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return filtered.map((d) => new EmbeddedDocumentDoc(d));
    })();

    return p;
  }

  static findById(id) {
    if (isMongooseConnected) {
      return MongooseDocument.findById(id);
    }

    const p = (async () => {
      const documents = loadDocumentsFromFile();
      const found = documents.find((d) => d._id === id);
      if (!found) return null;
      return new EmbeddedDocumentDoc(found);
    })();

    return p;
  }

  static async create(data) {
    if (isMongooseConnected) {
      return MongooseDocument.create(data);
    }

    const doc = new EmbeddedDocumentDoc(data);
    await doc.save();
    return doc;
  }
}
