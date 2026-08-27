import mongoose from 'mongoose';

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

notificationSchema.statics.markAllAsRead = async function (clientId) {
  return await this.updateMany({ client: clientId }, { isRead: true });
};

notificationSchema.statics.markAsRead = async function (id, clientId) {
  return await this.findOneAndUpdate(
    { _id: id, client: clientId },
    { isRead: true },
    { new: true }
  );
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
