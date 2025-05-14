// This service will handle API calls to the backend for events

const API_URL = "https://5000-i1n8pxbqlzjuc26ssfc6o-6a5d30d7.manus.computer/api"; // Adjusted for public backend URL

// Function to get the auth token (implement as needed, e.g., from localStorage)
const getAuthToken = () => {
  // return localStorage.getItem("authToken"); 
  return null; // Placeholder
};

export const createEvent = async (eventData, organizerId) => {
  try {
    // const token = getAuthToken();
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // Include if JWT is implemented
      },
      body: JSON.stringify({ ...eventData, organizer_id: organizerId }), // Pass organizer_id for now
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event");
    }
    return await response.json();
  } catch (error) {
    console.error("Create event error:", error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch events");
    }
    return await response.json();
  } catch (error) {
    console.error("Get events error:", error);
    throw error;
  }
};

export const getOrganizerEvents = async (organizerId) => {
  try {
    // const token = getAuthToken();
    const response = await fetch(`${API_URL}/organizers/${organizerId}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // Include if JWT is implemented
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch organizer events");
    }
    return await response.json();
  } catch (error) {
    console.error("Get organizer events error:", error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    // const token = getAuthToken();
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // Include if JWT is implemented
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update event");
    }
    return await response.json();
  } catch (error) {
    console.error("Update event error:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    // const token = getAuthToken();
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        // "Authorization": `Bearer ${token}` // Include if JWT is implemented
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      // For DELETE, response might not have JSON body on error, or be empty on success (204)
      if (response.status === 204) return { message: "Event deleted successfully" }; 
      throw new Error(errorData.message || "Failed to delete event");
    }
    if (response.status === 204) return { message: "Event deleted successfully" }; // Handle 204 No Content
    return await response.json(); 
  } catch (error) {
    console.error("Delete event error:", error);
    throw error;
  }
};

