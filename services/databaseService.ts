const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// Helper function to convert ISO date to MySQL datetime format
const formatDateForMySQL = (isoDate: string): string => {
  return new Date(isoDate).toISOString().slice(0, 19).replace('T', ' ');
};

// User operations
export const createUser = async (user: { id: string; email: string; name: string; password: string; createdAt: string }) => {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...user,
      createdAt: formatDateForMySQL(user.createdAt),
    }),
  });
  const data = await response.json();
  console.log('Create user response:', data);
  if (!response.ok) throw new Error(data.error || 'Failed to create user');
  
  // Add four default courses for the new user
  const defaultCourses = [
    { id: 'ΕΕΕ.7-3.7', title: 'VLSI Design', description: 'Very Large Scale Integration Design' },
    { id: 'ΕΕΕ.7-3.2', title: 'Control Systems II', description: 'Advanced control systems and automation' },
    { id: 'EEE.7-3.1', title: 'Microprocessors', description: 'Microprocessor architecture and design' },
    { id: 'EEE.7-3.3', title: 'Digital Signal Processing', description: 'Signal processing techniques and applications' },
  ];

  for (const course of defaultCourses) {
    await createCourse({
      id: course.id,
      title: course.title,
      description: course.description,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });
  }

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
    body: JSON.stringify({
      ...course,
      createdAt: formatDateForMySQL(course.createdAt),
    }),
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