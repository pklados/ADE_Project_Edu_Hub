const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// User operations
export const createUser = async (user: { id: string; email: string; name: string; password: string; createdAt: string }) => {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  console.log('Create user response:', data);
  if (!response.ok) throw new Error(data.error || 'Failed to create user');
  return data;
};

export const getUserByEmail = async (email: string) => {
  const response = await fetch(`${API_BASE}/api/users/email/${encodeURIComponent(email)}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const getUserById = async (id: string) => {
  const response = await fetch(`${API_BASE}/api/users/id/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

// Course operations
export const getCoursesByUserId = async (userId: string) => {
  const response = await fetch(`${API_BASE}/api/courses/user/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

export const createCourse = async (course: { id: string; title: string; description: string; userId: string; createdAt: string }) => {
  const response = await fetch(`${API_BASE}/api/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  if (!response.ok) throw new Error('Failed to create course');
  return response.json();
};

// Export database contents for viewing
export const exportDatabase = async () => {
  const response = await fetch(`${API_BASE}/api/export`);
  if (!response.ok) throw new Error('Failed to export database');
  return response.json();
};