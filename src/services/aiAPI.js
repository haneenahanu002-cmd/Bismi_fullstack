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

export const aiAPI = {
  chat: (message, conversationId) =>
    request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    }),
  getHistory: () => request("/ai/history"),
  clearHistory: () => request("/ai/history", { method: "DELETE" }),
};