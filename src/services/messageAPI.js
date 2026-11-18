const API = "https://bismiserver.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const request = async (url, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
};

export const messageAPI = {
  getConversations: () => request("/messages/conversations"),
  createConversation: (participantId) =>
    request("/messages/conversations", {
      method: "POST",
      body: JSON.stringify({ participantId }),
    }),
  getMessages: (conversationId, page = 1) =>
    request(`/messages/${conversationId}?page=${page}`),
  sendMessage: (conversationId, content) =>
    request(`/messages/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  markRead: (conversationId) =>
    request(`/messages/${conversationId}/read`, { method: "PATCH" }),
  getUnreadCount: () => request("/messages/unread-count"),
};