import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, ArrowLeft, Search, Paperclip } from "lucide-react";
import { messageAPI } from "../services/messageAPI";
import { getSocket } from "../services/socket";

function getCurrentUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id || payload.userId;
  } catch {
    return null;
  }
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [participants, setParticipants] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    try {
      const data = await messageAPI.getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      const data = await (await fetch("https://bismiserver.onrender.com/api/messages/participants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })).json();
      setParticipants(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    try {
      const data = await messageAPI.getMessages(conversation._id);
      setMessages(data.messages || []);
      await messageAPI.markRead(conversation._id);
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = async (participantId) => {
    try {
      const data = await messageAPI.createConversation(participantId);
      setShowNewChat(false);
      const conv = {
        _id: data.conversation._id,
        participant: data.conversation.participant,
        lastMessage: "",
        lastMessageAt: null,
        unreadCount: 0,
      };
      setConversations((prev) => [conv, ...prev]);
      openConversation(conv);
    } catch (err) {
      alert(err.message);
    }
  };

  const send = async () => {
    if (!text.trim() || !activeConversation) return;
    const content = text.trim();
    setText("");
    try {
      const data = await messageAPI.sendMessage(activeConversation._id, content);
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadConversations();
    loadParticipants();

    const socket = getSocket();
    if (!socket) return;

    socket.on("new_message", (msg) => {
      setMessages((prev) => {
        if (activeConversation && msg.conversation === activeConversation._id) {
          return [...prev, msg];
        }
        return prev;
      });
      loadConversations();
    });

    return () => {
      socket.off("new_message");
    };
  }, [activeConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = conversations.filter((c) =>
    (c.participant?.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredParticipants = participants.filter((p) =>
    (p.username || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Conversation list */}
      <div
        className={`w-full border-r border-gray-200 md:w-80 ${
          activeConversation ? "hidden md:flex md:flex-col" : "flex flex-col"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold text-[#0B1D2B]">Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-[#0B1D2B]"
          >
            New
          </button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => openConversation(conv)}
              className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left hover:bg-gray-50 ${
                activeConversation?._id === conv._id ? "bg-yellow-50" : ""
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1D2B] text-sm font-bold text-white">
                {conv.participant?.role === "admin" ? "BA" : (conv.participant?.username || "?").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold text-[#0B1D2B]">
                    {conv.participant?.role === "admin" ? "Bismi Earth Movers Admin" : conv.participant?.username || "User"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-[#0B1D2B]">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-gray-500">
                  {conv.lastMessage ||
                    (conv.participant?.role === "admin"
                      ? "Start a conversation with Admin"
                      : "No messages yet")}
                </p>
              </div>
            </button>
          ))}
          {filteredConversations.length === 0 && (
            <p className="p-4 text-sm text-gray-400">No conversations yet.</p>
          )}
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`flex flex-1 flex-col ${
          activeConversation ? "flex" : "hidden md:flex"
        }`}
      >
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 p-4">
              <button
                className="md:hidden"
                onClick={() => setActiveConversation(null)}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1D2B] text-sm font-bold text-white">
                {activeConversation.participant?.role === "admin" ? "BA" : (activeConversation.participant?.username || "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0B1D2B]">
                  {activeConversation.participant?.role === "admin" ? "Bismi Earth Movers Admin" : activeConversation.participant?.username || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {activeConversation.participant?.role || ""}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
              {messages.map((msg) => {
                const isMine = String(msg.sender?._id || msg.sender) === String(getCurrentUserId());
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        isMine
                          ? "bg-yellow-400 text-[#0B1D2B]"
                          : "bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="mt-1 text-[10px] opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-gray-200 p-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={send}
                className="rounded-xl bg-yellow-400 p-2.5 text-[#0B1D2B]"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-3" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* New chat modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-[#0B1D2B]">New Chat</h3>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {filteredParticipants.map((p) => (
                <button
                  key={p._id}
                  onClick={() => startChat(p._id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:bg-yellow-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1D2B] text-xs font-bold text-white">
                    {(p.username || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1D2B]">{p.username}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                </button>
              ))}
              {filteredParticipants.length === 0 && (
                <p className="text-sm text-gray-400">No available participants.</p>
              )}
            </div>
            <button
              onClick={() => setShowNewChat(false)}
              className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}