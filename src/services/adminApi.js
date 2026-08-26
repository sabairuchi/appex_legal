const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/admin`
  : '/api/admin';

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to load admin dashboard statistics');
  }
  return data.stats;
};

export const fetchUsers = async ({ search = '', role = '', status = '' } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (status) params.append('status', status);

  const res = await fetch(`${API_BASE}/users?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch users');
  }
  return data.users;
};

export const fetchUserById = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch user details');
  }
  return data;
};

export const updateUserStatus = async (id, isActive) => {
  const res = await fetch(`${API_BASE}/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update user status');
  }
  return data;
};

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${API_BASE}/users/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update user role');
  }
  return data;
};

export const fetchLawyers = async () => {
  const res = await fetch(`${API_BASE}/lawyers`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch lawyers');
  }
  return data.lawyers;
};

export const createLawyer = async (lawyerData) => {
  const res = await fetch(`${API_BASE}/lawyers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lawyerData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create lawyer');
  }
  return data;
};

export const updateLawyer = async (id, lawyerData) => {
  const res = await fetch(`${API_BASE}/lawyers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lawyerData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update lawyer');
  }
  return data;
};

export const deactivateLawyer = async (id) => {
  const res = await fetch(`${API_BASE}/lawyers/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to deactivate lawyer');
  }
  return data;
};

export const fetchAppointments = async ({ search = '', status = '', lawyerId = '', startDate = '', endDate = '' } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (lawyerId) params.append('lawyerId', lawyerId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await fetch(`${API_BASE}/appointments?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }
  return data.appointments;
};

export const fetchAppointmentById = async (id) => {
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch appointment details');
  }
  return data.appointment;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update appointment status');
  }
  return data;
};

export const assignLawyerToAppointment = async (id, lawyerId) => {
  const res = await fetch(`${API_BASE}/appointments/${id}/assign-lawyer`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lawyerId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to assign lawyer');
  }
  return data;
};

export const rescheduleAppointment = async (id, appointmentDate, appointmentTime) => {
  const res = await fetch(`${API_BASE}/appointments/${id}/reschedule`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentDate, appointmentTime }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to reschedule appointment');
  }
  return data;
};

export const fetchAnalytics = async ({ period = '30d', startDate = '', endDate = '' } = {}) => {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await fetch(`${API_BASE}/analytics?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch analytics');
  }
  return data.analytics;
};
