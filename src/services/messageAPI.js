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
  getParticipants: () => request("/messages/participants"),

  getGroups: () => request("/messages/groups"),
  createGroup: (formData) =>
    fetch("https://bismiserver.onrender.com/api/messages/groups", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed");
      return d;
    }),
  getGroupMessages: (groupId, page = 1) =>
    request(`/messages/groups/${groupId}/messages?page=${page}`),
  sendGroupMessage: (groupId, formData) =>
    fetch(`https://bismiserver.onrender.com/api/messages/groups/${groupId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed");
      return d;
    }),
  deleteGroup: (groupId) =>
    request(`/messages/groups/${groupId}`, { method: "DELETE" }),
  addGroupMembers: (groupId, memberIds) =>
    request(`/messages/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ memberIds }),
    }),
  removeGroupMember: (groupId, userId) =>
    request(`/messages/groups/${groupId}/members/${userId}`, { method: "DELETE" }),
  markGroupRead: (groupId) =>
    request(`/messages/groups/${groupId}/read`, { method: "PATCH" }),
};