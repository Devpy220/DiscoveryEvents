// This service will handle API calls to the backend for authentication

const API_URL = "https://5000-i1n8pxbqlzjuc26ssfc6o-6a5d30d7.manus.computer/api/auth"; // Adjusted for public backend URL and auth prefix

export const registerOrganizer = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register");
    }
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginOrganizer = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

