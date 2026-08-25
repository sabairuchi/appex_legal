import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { isMongooseConnected } from '../config/db.js';

// Mongoose Schema Definition
const notificationSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'appointment', 'document', 'security'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseNotification = mongoose.model('Notification', notificationSchema);

// --- Embedded File-Backed Persistence Engine (Fallback) ---
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'notifications.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
  }
};

const loadNotificationsFromFile = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
};

const saveNotificationsToFile = (notifications) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2), 'utf8');
};

class EmbeddedNotificationDoc {
  constructor(data) {
    this._id = data._id || crypto.randomBytes(12).toString('hex');
    this.client = data.client;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type || 'info';
    this.isRead = data.isRead !== undefined ? data.isRead : false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const notifications = loadNotificationsFromFile();
    const idx = notifications.findIndex((n) => n._id === this._id);

    const plainDoc = {
      _id: this._id,
      client: this.client,
      title: this.title,
      message: this.message,
      type: this.type,
      isRead: this.isRead,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : new Date(this.createdAt).toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };

    if (idx >= 0) {
      notifications[idx] = plainDoc;
    } else {
      notifications.push(plainDoc);
    }
    saveNotificationsToFile(notifications);
    return this;
  }
}

export default class Notification {
  static find(query = {}) {
    if (isMongooseConnected) {
      return MongooseNotification.find(query).sort({ createdAt: -1 });
    }

    const p = (async () => {
      const notifications = loadNotificationsFromFile();
      let filtered = notifications;

      if (query.client) {
        filtered = filtered.filter((n) => n.client.toString() === query.client.toString());
      }
      if (query.isRead !== undefined) {
        filtered = filtered.filter((n) => n.isRead === query.isRead);
      }

      // Sort descending by createdAt
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return filtered.map((n) => new EmbeddedNotificationDoc(n));
    })();

    return p;
  }

  static findById(id) {
    if (isMongooseConnected) {
      return MongooseNotification.findById(id);
    }

    const p = (async () => {
      const notifications = loadNotificationsFromFile();
      const found = notifications.find((n) => n._id === id);
      if (!found) return null;
      return new EmbeddedNotificationDoc(found);
    })();

    return p;
  }

  static async create(data) {
    if (isMongooseConnected) {
      return MongooseNotification.create(data);
    }

    const doc = new EmbeddedNotificationDoc(data);
    await doc.save();
    return doc;
  }

  static async markAllAsRead(clientId) {
    if (isMongooseConnected) {
      return MongooseNotification.updateMany({ client: clientId }, { isRead: true });
    }

    const notifications = loadNotificationsFromFile();
    let updatedCount = 0;
    notifications.forEach((n) => {
      if (n.client.toString() === clientId.toString() && !n.isRead) {
        n.isRead = true;
        n.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });
    saveNotificationsToFile(notifications);
    return { modifiedCount: updatedCount };
  }

  static async markAsRead(id, clientId) {
    if (isMongooseConnected) {
      return MongooseNotification.findOneAndUpdate(
        { _id: id, client: clientId },
        { isRead: true },
        { new: true }
      );
    }

    const notifications = loadNotificationsFromFile();
    const idx = notifications.findIndex(
      (n) => n._id === id && n.client.toString() === clientId.toString()
    );
    if (idx === -1) return null;

    notifications[idx].isRead = true;
    notifications[idx].updatedAt = new Date().toISOString();
    saveNotificationsToFile(notifications);
    return new EmbeddedNotificationDoc(notifications[idx]);
  }
}
