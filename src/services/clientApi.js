const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/client`
  : '/api/client';

export const fetchDashboard = async () => {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to load client dashboard');
  }
  return data.data;
};

export const fetchProfile = async () => {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to load profile');
  }
  return data.user;
};

export const updateProfile = async (profileData) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update profile');
  }
  return data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);

  const res = await fetch(`${API_BASE}/profile-image`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload profile image');
  }
  return data;
};

export const fetchAppointments = async () => {
  const res = await fetch(`${API_BASE}/appointments`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }
  return data.appointments;
};

export const createAppointment = async (appointmentData) => {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create appointment');
  }
  return data;
};

export const fetchNotifications = async () => {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch notifications');
  }
  return data.notifications;
};

export const markNotificationRead = async (id) => {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to mark notification as read');
  }
  return data;
};

export const markAllNotificationsRead = async () => {
  const res = await fetch(`${API_BASE}/notifications/read-all`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to mark all notifications as read');
  }
  return data;
};

export const fetchDocuments = async () => {
  const res = await fetch(`${API_BASE}/documents`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch documents');
  }
  return data.documents;
};

export const uploadDocument = async (title, file) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload document');
  }
  return data;
};

export const getDownloadUrl = (id) => {
  return `${API_BASE}/documents/${id}/download`;
};
