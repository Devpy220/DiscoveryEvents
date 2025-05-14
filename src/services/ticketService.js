// This service will handle API calls to the backend for tickets

const API_URL = "https://5000-i1n8pxbqlzjuc26ssfc6o-6a5d30d7.manus.computer/api"; // Adjusted for public backend URL

export const purchaseTicket = async (purchaseData) => {
  // purchaseData should include { event_id, buyer_name, buyer_email }
  try {
    const response = await fetch(`${API_URL}/tickets/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to purchase ticket");
    }
    return await response.json();
  } catch (error) {
    console.error("Purchase ticket error:", error);
    throw error;
  }
};

export const getTicketByCode = async (ticketCode) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${ticketCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch ticket");
    }
    return await response.json();
  } catch (error) {
    console.error("Get ticket error:", error);
    throw error;
  }
};

