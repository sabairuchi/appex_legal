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
      let q = MongooseAppointment.find();
      if (query.client) q = q.where('client').equals(query.client);
      if (query.lawyer) q = q.where('lawyer').equals(query.lawyer);
      if (query.status) q = q.where('status').equals(query.status);
      return q
        .populate('client', 'fullName email phone profileImage role')
        .populate('lawyer', 'fullName email profileImage role bio specialization phone availabilityStatus');
    }

    const p = (async () => {
      const appointments = loadAppointmentsFromFile();
      let filtered = appointments;

      if (query.client) {
        filtered = filtered.filter((a) => a.client && a.client.toString() === query.client.toString());
      }
      if (query.lawyer) {
        filtered = filtered.filter((a) => a.lawyer && a.lawyer.toString() === query.lawyer.toString());
      }
      if (query.status) {
        filtered = filtered.filter((a) => a.status === query.status);
      }
      if (query.startDate) {
        filtered = filtered.filter((a) => new Date(a.appointmentDate) >= new Date(query.startDate));
      }
      if (query.endDate) {
        filtered = filtered.filter((a) => new Date(a.appointmentDate) <= new Date(query.endDate));
      }

      // Populate user details in embedded mode
      let users = [];
      const usersFile = path.join(DATA_DIR, 'users.json');
      if (fs.existsSync(usersFile)) {
        try {
          users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
        } catch (e) {
          users = [];
        }
      }

      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter((a) => {
          const clientUser = users.find((u) => u._id === (a.client ? a.client.toString() : ''));
          const lawyerUser = users.find((u) => u._id === (a.lawyer ? a.lawyer.toString() : ''));
          const cName = clientUser ? clientUser.fullName.toLowerCase() : '';
          const lName = lawyerUser ? lawyerUser.fullName.toLowerCase() : '';
          const title = (a.title || '').toLowerCase();
          const type = (a.appointmentType || '').toLowerCase();
          return cName.includes(s) || lName.includes(s) || title.includes(s) || type.includes(s);
        });
      }

      return filtered.map((a) => {
        const doc = new EmbeddedAppointmentDoc(a);
        if (doc.client) {
          const cUser = users.find((u) => u._id === doc.client.toString());
          if (cUser) {
            doc.client = {
              _id: cUser._id,
              fullName: cUser.fullName,
              email: cUser.email,
              phone: cUser.phone || '',
              profileImage: cUser.profileImage || '',
              role: cUser.role,
            };
          }
        }
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
              specialization: lUser.specialization || '',
              phone: lUser.phone || '',
              availabilityStatus: lUser.availabilityStatus || 'available',
            };
          }
        }
        return doc;
      });
    })();

    return p;
  }

  static countDocuments(query = {}) {
    if (isMongooseConnected) {
      let q = MongooseAppointment;
      return q.countDocuments(query);
    }

    return (async () => {
      const appointments = loadAppointmentsFromFile();
      let filtered = appointments;
      if (query.status) {
        filtered = filtered.filter((a) => a.status === query.status);
      }
      if (query.lawyer) {
        filtered = filtered.filter((a) => a.lawyer && a.lawyer.toString() === query.lawyer.toString());
      }
      if (query.client) {
        filtered = filtered.filter((a) => a.client && a.client.toString() === query.client.toString());
      }
      return filtered.length;
    })();
  }

  static findById(id) {
    if (isMongooseConnected) {
      return MongooseAppointment.findById(id)
        .populate('client', 'fullName email phone profileImage role')
        .populate('lawyer', 'fullName email profileImage role bio specialization phone availabilityStatus');
    }

    const p = (async () => {
      const appointments = loadAppointmentsFromFile();
      const found = appointments.find((a) => a._id === id.toString());
      if (!found) return null;
      const doc = new EmbeddedAppointmentDoc(found);
      let users = [];
      const usersFile = path.join(DATA_DIR, 'users.json');
      if (fs.existsSync(usersFile)) {
        try {
          users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
        } catch (e) {}
      }
      if (doc.client) {
        const cUser = users.find((u) => u._id === doc.client.toString());
        if (cUser) {
          doc.client = {
            _id: cUser._id,
            fullName: cUser.fullName,
            email: cUser.email,
            phone: cUser.phone || '',
            profileImage: cUser.profileImage || '',
            role: cUser.role,
          };
        }
      }
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
            specialization: lUser.specialization || '',
            phone: lUser.phone || '',
            availabilityStatus: lUser.availabilityStatus || 'available',
          };
        }
      }
      return doc;
    })();

    return p;
  }

  static async checkConflict(lawyerId, dateStr, timeStr, excludeId = null) {
    if (!lawyerId || !dateStr || !timeStr) return false;

    if (isMongooseConnected) {
      const query = {
        lawyer: lawyerId,
        appointmentDate: dateStr,
        appointmentTime: timeStr,
        status: { $ne: 'cancelled' },
      };
      if (excludeId) query._id = { $ne: excludeId };
      const existing = await MongooseAppointment.findOne(query);
      return !!existing;
    }

    const appointments = loadAppointmentsFromFile();
    const conflict = appointments.find((a) => {
      if (excludeId && a._id === excludeId.toString()) return false;
      if (!a.lawyer || a.lawyer.toString() !== lawyerId.toString()) return false;
      if (a.status === 'cancelled') return false;
      return a.appointmentDate === dateStr && a.appointmentTime === timeStr;
    });

    return !!conflict;
  }

  static async create(data) {
    if (isMongooseConnected) {
      return MongooseAppointment.create(data);
    }

    const doc = new EmbeddedAppointmentDoc(data);
    await doc.save();
    return doc;
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    if (isMongooseConnected) {
      return MongooseAppointment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, ...options })
        .populate('client', 'fullName email phone profileImage role')
        .populate('lawyer', 'fullName email profileImage role bio specialization phone availabilityStatus');
    }

    const appointments = loadAppointmentsFromFile();
    const idx = appointments.findIndex((a) => a._id === id.toString());
    if (idx === -1) return null;

    const appt = appointments[idx];
    if (updateData.status !== undefined) appt.status = updateData.status;
    if (updateData.lawyer !== undefined) appt.lawyer = updateData.lawyer;
    if (updateData.appointmentDate !== undefined) appt.appointmentDate = updateData.appointmentDate;
    if (updateData.appointmentTime !== undefined) appt.appointmentTime = updateData.appointmentTime;
    if (updateData.notes !== undefined) appt.notes = updateData.notes;
    if (updateData.title !== undefined) appt.title = updateData.title;
    if (updateData.appointmentType !== undefined) appt.appointmentType = updateData.appointmentType;
    appt.updatedAt = new Date().toISOString();

    appointments[idx] = appt;
    saveAppointmentsToFile(appointments);

    return this.findById(id);
  }

  static async findByIdAndDelete(id) {
    if (isMongooseConnected) {
      return MongooseAppointment.findByIdAndDelete(id);
    }

    const appointments = loadAppointmentsFromFile();
    const idx = appointments.findIndex((a) => a._id === id.toString());
    if (idx === -1) return null;
    const removed = appointments.splice(idx, 1)[0];
    saveAppointmentsToFile(appointments);
    return new EmbeddedAppointmentDoc(removed);
  }
}
