import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { isMongooseConnected } from '../config/db.js';

// Mongoose Schema Definition
const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Appointment title is required'],
      trim: true,
    },
    appointmentType: {
      type: String,
      default: 'General Legal Consultation',
      trim: true,
    },
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'confirmed', 'rescheduled', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseAppointment = mongoose.model('Appointment', appointmentSchema);

// --- Embedded File-Backed Persistence Engine (Fallback) ---
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'appointments.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
  }
};

const loadAppointmentsFromFile = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
};

const saveAppointmentsToFile = (appointments) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), 'utf8');
};

class EmbeddedAppointmentDoc {
  constructor(data) {
    this._id = data._id || crypto.randomBytes(12).toString('hex');
    this.client = data.client;
    this.lawyer = data.lawyer || null;
    this.title = data.title || 'Legal Consultation';
    this.appointmentType = data.appointmentType || 'General Legal Consultation';
    this.appointmentDate = data.appointmentDate;
    this.appointmentTime = data.appointmentTime;
    this.status = data.status || 'pending';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const appointments = loadAppointmentsFromFile();
    const idx = appointments.findIndex((a) => a._id === this._id);

    const plainDoc = {
      _id: this._id,
      client: this.client,
      lawyer: this.lawyer,
      title: this.title,
      appointmentType: this.appointmentType,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : new Date(this.createdAt).toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };

    if (idx >= 0) {
      appointments[idx] = plainDoc;
    } else {
      appointments.push(plainDoc);
    }
    saveAppointmentsToFile(appointments);
    return this;
  }
}

export default class Appointment {
  static find(query = {}) {
    if (isMongooseConnected) {
      return MongooseAppointment.find(query).populate('lawyer', 'fullName email profileImage role bio');
    }

    const p = (async () => {
      const appointments = loadAppointmentsFromFile();
      let filtered = appointments;

      if (query.client) {
        filtered = filtered.filter((a) => a.client.toString() === query.client.toString());
      }
      if (query.status) {
        filtered = filtered.filter((a) => a.status === query.status);
      }

      // Populate lawyer details in embedded mode
      let users = [];
      const usersFile = path.join(DATA_DIR, 'users.json');
      if (fs.existsSync(usersFile)) {
        try {
          users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
        } catch (e) {
          users = [];
        }
      }

      return filtered.map((a) => {
        const doc = new EmbeddedAppointmentDoc(a);
        if (doc.lawyer) {
          const lUser = users.find((u) => u._id === doc.lawyer.toString());
          if (lUser) {
            doc.lawyer = {
              _id: lUser._id,
              fullName: lUser.fullName,
              email: lUser.email,
              profileImage: lUser.profileImage || '',
              role: lUser.role,
              bio: lUser.bio || '',
            };
          }
        }
        return doc;
      });
    })();

    return p;
  }

  static findById(id) {
    if (isMongooseConnected) {
      return MongooseAppointment.findById(id);
    }

    const p = (async () => {
      const appointments = loadAppointmentsFromFile();
      const found = appointments.find((a) => a._id === id);
      if (!found) return null;
      return new EmbeddedAppointmentDoc(found);
    })();

    return p;
  }

  static async create(data) {
    if (isMongooseConnected) {
      return MongooseAppointment.create(data);
    }

    const doc = new EmbeddedAppointmentDoc(data);
    await doc.save();
    return doc;
  }
}
