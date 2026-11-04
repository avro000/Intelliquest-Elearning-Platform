import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9092/auth/admin', // change if needed
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API calls
export const getLoggedInUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token means user not logged in
      return null;
    }

    const response = await axios.get("http://localhost:9092/auth/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Could be 401 or other error, treat as not logged in
    console.error("Error fetching logged-in user:", error);
    return null;  // <== Important: return null, do not throw
  }
};


// Get all users
export const getAllUsers = async () => {
  try {
    const response = await instance.get('/users');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: number) => {
  try {
    const response = await instance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (id: number, enabled: boolean) => {
  try {
    const response = await instance.put(`/users/${id}/status`, null, { params: { enabled } });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (id: number, role: string) => {
  try {
    const response = await instance.put(`/users/${id}/role`, null, { params: { role } });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: number) => {
  try {
    const response = await instance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Assign instructor role
export const assignInstructorRole = async (id: number) => {
  try {
    const response = await instance.put(`/users/${id}/assign-instructor`);
    return response.data;
  } catch (error) {
    console.error("Error assigning instructor role:", error);
    throw error;
  }
};

// Revoke instructor role
export const revokeInstructorRole = async (id: number) => {
  try {
    const response = await instance.put(`/users/${id}/revoke-instructor`);
    return response.data;
  } catch (error) {
    console.error("Error revoking instructor role:", error);
    throw error;
  }
};
// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await instance.get('/courses');
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
// Function to delete a course by its ID
export const deleteCourse = async (courseId: number) => {
  try {
    const response = await instance.delete(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Failed to delete course");
  }
};



