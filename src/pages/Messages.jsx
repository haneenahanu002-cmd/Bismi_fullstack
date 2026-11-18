import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, ArrowLeft, Search, Paperclip, MapPin, Users, Plus, Trash2, Image as ImageIcon, FileText, Radio, X } from "lucide-react";
import { messageAPI } from "../services/messageAPI";
import { getSocket } from "../services/socket";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

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
  const [tab, setTab] = useState("direct");
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [text, setText] = useState("");
  const [participants, setParticipants] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationMode, setLocationMode] = useState(null); // current | live | pick
  const [liveDuration, setLiveDuration] = useState(15 * 60 * 1000);
  const [liveMessageId, setLiveMessageId] = useState(null);
  const [liveExpiresAt, setLiveExpiresAt] = useState(null);
  const [pickedCoords, setPickedCoords] = useState(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const watchIdRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadConversations = async () => {
    try {
      const data = await messageAPI.getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadGroups = async () => {
    try {
      const data = await messageAPI.getGroups();
      setGroups(data.groups || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadParticipants = async () => {
    try {
      const data = await messageAPI.getParticipants();
      setParticipants(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadConversations(), loadGroups(), loadParticipants()]);
      setLoading(false);
    })();

    const socket = getSocket();
    if (!socket) return;

    socket.on("new_message", (msg) => {
      setMessages((prev) => {
        if (activeConversation && (msg.conversation === activeConversation._id || msg.conversation?._id === activeConversation._id)) {
          return [...prev, msg];
        }
        return prev;
      });
      loadConversations();
    });

    socket.on("new_group_message", (msg) => {
      setGroupMessages((prev) => {
        if (activeGroup && (msg.group === activeGroup._id || msg.group?._id === activeGroup._id)) {
          return [...prev, msg];
        }
        return prev;
      });
      loadGroups();
    });

    socket.on("location_updated", (data) => {
      setMessages((prev) => prev.map((m) => (m._id === data.messageId ? { ...m, location: { ...m.location, latitude: data.latitude, longitude: data.longitude, url: data.url } } : m)));
    });

    socket.on("group_location_updated", (data) => {
      setGroupMessages((prev) => prev.map((m) => (m._id === data.messageId ? { ...m, location: { ...m.location, latitude: data.latitude, longitude: data.longitude, url: data.url } } : m)));
    });

    return () => {
      socket.off("new_message");
      socket.off("new_group_message");
    };
  }, [activeConversation, activeGroup]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);

  const openConversation = async (conversation) => {
    setActiveGroup(null);
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

  const openGroup = async (group) => {
    setActiveConversation(null);
    setActiveGroup(group);
    const socket = getSocket();
    socket?.emit("join_group", group._id);
    try {
      const data = await messageAPI.getGroupMessages(group._id);
      setGroupMessages(data.messages || []);
      await messageAPI.markGroupRead(group._id);
      loadGroups();
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

  const createGroup = async () => {
    if (!groupName.trim()) return alert("Group name required");
    try {
      const formData = new FormData();
      formData.append("name", groupName);
      formData.append("description", groupDesc);
      formData.append("memberIds", JSON.stringify(groupMembers));
      const data = await messageAPI.createGroup(formData);
      setShowNewGroup(false);
      setGroupName("");
      setGroupDesc("");
      setGroupMembers([]);
      setGroups((prev) => [data.group, ...prev]);
      openGroup(data.group);
    } catch (err) {
      alert(err.message);
    }
  };

  const send = async () => {
    if (!text.trim() && !selectedFile && !location) return;

    if (activeConversation) {
      try {
        if (selectedFile || location) {
          const formData = new FormData();
          formData.append("content", text.trim());
          if (selectedFile) formData.append("file", selectedFile);
          if (location) {
            formData.append("locationLatitude", location.lat);
            formData.append("locationLongitude", location.lng);
            formData.append("locationUrl", location.url);
            formData.append("locationType", location.type || "current");
            if (location.type === "live") {
              formData.append("isLive", "true");
              formData.append("expiresAt", location.expiresAt?.toISOString?.() || "");
            }
          }
          const res = await fetch(`https://bismiserver.onrender.com/api/messages/${activeConversation._id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setMessages((prev) => [...prev, data.message]);
        } else {
          const data = await messageAPI.sendMessage(activeConversation._id, text.trim());
          setMessages((prev) => [...prev, data.message]);
        }
        setText("");
        setSelectedFile(null);
        setLocation(null);
      } catch (err) {
        alert(err.message);
      }
    } else if (activeGroup) {
      try {
        const formData = new FormData();
        formData.append("content", text.trim());
        if (selectedFile) formData.append("file", selectedFile);
        if (location) {
          formData.append("locationLatitude", location.lat);
          formData.append("locationLongitude", location.lng);
          formData.append("locationUrl", location.url);
          formData.append("locationType", location.type || "current");
          if (location.type === "live") {
            formData.append("isLive", "true");
            formData.append("expiresAt", location.expiresAt?.toISOString?.() || "");
          }
        }
        const data = await messageAPI.sendGroupMessage(activeGroup._id, formData);
        setGroupMessages((prev) => [...prev, data.message]);
        setText("");
        setSelectedFile(null);
        setLocation(null);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const shareLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng, url: `https://www.google.com/maps?q=${lat},${lng}`, type: "current" });
        setLocationMode("current");
        setShowLocationMenu(false);
      },
      () => alert("Unable to get location")
    );
  };

  const startLiveLocation = (duration) => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLiveDuration(duration);
    const expiresAt = new Date(Date.now() + duration);
    setLiveExpiresAt(expiresAt);
    setShowLocationMenu(false);
    setLocationMode("live");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;

      // send initial live location message
      const formData = new FormData();
      formData.append("content", "Live location");
      formData.append("locationLatitude", lat);
      formData.append("locationLongitude", lng);
      formData.append("locationUrl", url);
      formData.append("locationType", "live");
      formData.append("isLive", "true");
      formData.append("expiresAt", expiresAt.toISOString());
      formData.append("messageType", "location");

      let endpoint = activeConversation
        ? `https://bismiserver.onrender.com/api/messages/${activeConversation._id}`
        : `https://bismiserver.onrender.com/api/messages/groups/${activeGroup._id}/messages`;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const msg = data.message;
        msg.location = { latitude: lat, longitude: lng, url, type: "live", isLive: true, expiresAt };
        if (activeConversation) setMessages((prev) => [...prev, msg]);
        else setGroupMessages((prev) => [...prev, msg]);
        setLiveMessageId(msg._id);

        const socket = getSocket();
        const watchId = navigator.geolocation.watchPosition((p) => {
          if (Date.now() > expiresAt.getTime()) {
            stopLiveLocation();
            return;
          }
          const newLat = p.coords.latitude;
          const newLng = p.coords.longitude;
          const newUrl = `https://www.google.com/maps?q=${newLat},${newLng}`;
          if (activeConversation) {
            socket?.emit("location_update", { conversationId: activeConversation._id, messageId: msg._id, latitude: newLat, longitude: newLng });
          } else if (activeGroup) {
            socket?.emit("group_location_update", { groupId: activeGroup._id, messageId: msg._id, latitude: newLat, longitude: newLng });
          }
        });
        watchIdRef.current = watchId;

        setTimeout(() => stopLiveLocation(), duration);
      } catch (err) {
        alert(err.message);
        setLocationMode(null);
      }
    }, () => alert("Unable to get location"));
  };

  const stopLiveLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (liveMessageId) {
      // mark as no longer live by updating local state
      setMessages((prev) => prev.map((m) => (m._id === liveMessageId ? { ...m, location: { ...m.location, isLive: false } } : m)));
      setGroupMessages((prev) => prev.map((m) => (m._id === liveMessageId ? { ...m, location: { ...m.location, isLive: false } } : m)));
    }
    setLiveMessageId(null);
    setLiveExpiresAt(null);
    setLocationMode(null);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const currentUserId = getCurrentUserId();

  const filteredConversations = conversations.filter((c) =>
    (c.participant?.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups.filter((g) =>
    (g.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading messages...</div>;

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Sidebar */}
      <div className={`w-full border-r border-gray-200 md:w-80 ${activeConversation || activeGroup ? "hidden md:flex md:flex-col" : "flex flex-col"}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold text-[#0B1D2B]">Messages</h2>
          <div className="flex gap-2">
            <button onClick={() => setShowNewChat(true)} className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-[#0B1D2B]">New</button>
            {localStorage.getItem("token") && JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role === "admin" && (
              <button onClick={() => setShowNewGroup(true)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#0B1D2B]">Group</button>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button onClick={() => setTab("direct")} className={`flex-1 py-2 text-sm font-semibold ${tab === "direct" ? "border-b-2 border-yellow-400 text-[#0B1D2B]" : "text-gray-500"}`}>Chats</button>
          <button onClick={() => setTab("groups")} className={`flex-1 py-2 text-sm font-semibold ${tab === "groups" ? "border-b-2 border-yellow-400 text-[#0B1D2B]" : "text-gray-500"}`}>Groups</button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "direct" && filteredConversations.map((conv) => (
            <button key={conv._id} onClick={() => openConversation(conv)} className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left hover:bg-gray-50 ${activeConversation?._id === conv._id ? "bg-yellow-50" : ""}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1D2B] text-sm font-bold text-white">
                {conv.participant?.role === "admin" ? "BA" : (conv.participant?.username || "?").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold text-[#0B1D2B]">
                    {conv.participant?.role === "admin" ? "Bismi Earth Movers Admin" : conv.participant?.username || "User"}
                  </p>
                  {conv.unreadCount > 0 && <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-[#0B1D2B]">{conv.unreadCount}</span>}
                </div>
                <p className="truncate text-xs text-gray-500">
                  {conv.lastMessage || (conv.participant?.role === "admin" ? "Start a conversation with Admin" : "No messages yet")}
                </p>
              </div>
            </button>
          ))}

          {tab === "groups" && filteredGroups.map((group) => (
            <button key={group._id} onClick={() => openGroup(group)} className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left hover:bg-gray-50 ${activeGroup?._id === group._id ? "bg-yellow-50" : ""}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-[#0B1D2B]">
                {(group.name || "G").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#0B1D2B]">{group.name}</p>
                <p className="truncate text-xs text-gray-500">{group.description || "Group chat"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex flex-1 flex-col ${activeConversation || activeGroup ? "flex" : "hidden md:flex"}`}>
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 p-4">
              <button className="md:hidden" onClick={() => setActiveConversation(null)}><ArrowLeft size={20} /></button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1D2B] text-sm font-bold text-white">
                {activeConversation.participant?.role === "admin" ? "BA" : (activeConversation.participant?.username || "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0B1D2B]">
                  {activeConversation.participant?.role === "admin" ? "Bismi Earth Movers Admin" : activeConversation.participant?.username || "User"}
                </p>
                <p className="text-xs text-gray-500">{activeConversation.participant?.role || ""}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
              {messages.map((msg) => {
                const isMine = String(msg.sender?._id || msg.sender) === String(currentUserId);
                return (
                  <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMine ? "bg-yellow-400 text-[#0B1D2B]" : "bg-white text-gray-800 shadow-sm"}`}>
                      {msg.messageType === "location" && msg.location?.url && (
                        <div className="mb-2">
                          {msg.location.isLive && (
                            <p className="mb-1 text-xs font-bold text-red-600">LIVE</p>
                          )}
                          <div className="h-40 w-full overflow-hidden rounded-lg">
                            <MapContainer center={[msg.location.latitude, msg.location.longitude]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <Marker position={[msg.location.latitude, msg.location.longitude]} />
                            </MapContainer>
                          </div>
                          <a href={msg.location.url} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-blue-600 underline">Open in Google Maps</a>
                          {msg.location.isLive && msg._id === liveMessageId && (
                            <button onClick={stopLiveLocation} className="mt-2 rounded-lg bg-red-500 px-3 py-1 text-xs text-white">Stop Sharing</button>
                          )}
                        </div>
                      )}
                      {msg.attachments?.map((a, i) => (
                        <div key={i} className="mb-2">
                          {a.mimetype?.startsWith("image/") ? (
                            <img src={`https://bismiserver.onrender.com${a.url}`} alt={a.name} className="max-h-48 rounded-lg" />
                          ) : (
                            <a href={`https://bismiserver.onrender.com${a.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 underline">
                              <FileText size={16} /> {a.name} ({Math.round((a.size || 0) / 1024)} KB)
                            </a>
                          )}
                        </div>
                      ))}
                      <p>{msg.content}</p>
                      <p className="mt-1 text-[10px] opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </>
        ) : activeGroup ? (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 p-4">
              <button className="md:hidden" onClick={() => setActiveGroup(null)}><ArrowLeft size={20} /></button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-[#0B1D2B]">
                {(activeGroup.name || "G").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0B1D2B]">{activeGroup.name}</p>
                <p className="text-xs text-gray-500">{activeGroup.members?.length || 0} members</p>
              </div>
              {JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role === "admin" && (
                <button onClick={async () => {
                  if (!confirm(`Delete group ${activeGroup.name}?`)) return;
                  try {
                    await messageAPI.deleteGroup(activeGroup._id);
                    setActiveGroup(null);
                    setGroupMessages([]);
                    loadGroups();
                  } catch (err) { alert(err.message); }
                }} className="ml-auto rounded-lg border border-red-200 p-2 text-red-600">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
              {groupMessages.map((msg) => (
                <div key={msg._id} className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl bg-white px-4 py-2 text-sm text-gray-800 shadow-sm">
                    <p className="text-xs font-semibold text-[#0B1D2B]">{msg.sender?.username || "User"}</p>
                    {msg.messageType === "location" && msg.location?.url && (
                      <div className="mb-2">
                        {msg.location.isLive && <p className="mb-1 text-xs font-bold text-red-600">LIVE</p>}
                        <div className="h-40 w-full overflow-hidden rounded-lg">
                          <MapContainer center={[msg.location.latitude, msg.location.longitude]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[msg.location.latitude, msg.location.longitude]} />
                          </MapContainer>
                        </div>
                        <a href={msg.location.url} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-blue-600 underline">Open in Google Maps</a>
                      </div>
                    )}
                    {msg.attachments?.map((a, i) => (
                      <div key={i} className="mb-2">
                        {a.mimetype?.startsWith("image/") ? (
                          <img src={`https://bismiserver.onrender.com${a.url}`} alt={a.name} className="max-h-48 rounded-lg" />
                        ) : (
                          <a href={`https://bismiserver.onrender.com${a.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 underline">
                            <FileText size={16} /> {a.name}
                          </a>
                        )}
                      </div>
                    ))}
                    <p>{msg.content}</p>
                    <p className="mt-1 text-[10px] opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-3" />
              <p>Select a conversation or group</p>
            </div>
          </div>
        )}

        {(activeConversation || activeGroup) && (
          <div className="border-t border-gray-200 p-3">
            {selectedFile && <p className="mb-2 text-xs text-gray-500">Selected: {selectedFile.name}</p>}
            {location && <p className="mb-2 text-xs text-gray-500">Location ready: {location.url}</p>}
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
              <div className="relative">
                <button onClick={() => setShowAttachMenu((v) => !v)} className="rounded-xl border border-gray-200 p-2.5 text-gray-600">
                  <Paperclip size={18} />
                </button>
                {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 z-20 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    <button onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                      <ImageIcon size={16} /> Gallery / Document
                    </button>
                    <button onClick={() => { shareLocation(); setShowAttachMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                      <MapPin size={16} /> Current Location
                    </button>
                    <button onClick={() => { setShowLocationMenu(true); setShowAttachMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                      <Radio size={16} /> Live Location
                    </button>
                    <button onClick={() => { setShowMapPicker(true); setShowAttachMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                      <MapPin size={16} /> Choose on Map
                    </button>
                  </div>
                )}
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Type a message..." rows={1} className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none" />
              <button onClick={send} className="rounded-xl bg-yellow-400 p-2.5 text-[#0B1D2B]">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Location menu */}
      {showLocationMenu && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-[#0B1D2B]">Share Live Location</h3>
            <div className="space-y-2">
              <button onClick={() => startLiveLocation(15 * 60 * 1000)} className="w-full rounded-xl border border-gray-200 py-2 text-sm">15 minutes</button>
              <button onClick={() => startLiveLocation(60 * 60 * 1000)} className="w-full rounded-xl border border-gray-200 py-2 text-sm">1 hour</button>
              <button onClick={() => startLiveLocation(8 * 60 * 60 * 1000)} className="w-full rounded-xl border border-gray-200 py-2 text-sm">8 hours</button>
            </div>
            <button onClick={() => setShowLocationMenu(false)} className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Map picker */}
      {showMapPicker && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0B1D2B]">Choose Location</h3>
              <button onClick={() => setShowMapPicker(false)}><X size={20} /></button>
            </div>
            <div className="h-72 w-full overflow-hidden rounded-xl">
              <MapContainer center={pickedCoords || [10.8505, 76.2711]} zoom={10} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onSelect={setPickedCoords} />
                {pickedCoords && <Marker position={pickedCoords} />}
              </MapContainer>
            </div>
            <button
              onClick={() => {
                if (!pickedCoords) return alert("Select a location");
                const [lat, lng] = pickedCoords;
                setLocation({ lat, lng, url: `https://www.google.com/maps?q=${lat},${lng}`, type: "picked" });
                setShowMapPicker(false);
              }}
              className="mt-4 w-full rounded-xl bg-yellow-400 py-2 text-sm font-semibold text-[#0B1D2B]"
            >
              Send Location
            </button>
          </div>
        </div>
      )}

      {/* New chat modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-[#0B1D2B]">New Chat</h3>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {participants.map((p) => (
                <button key={p._id} onClick={() => startChat(p._id)} className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:bg-yellow-50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1D2B] text-xs font-bold text-white">
                    {(p.username || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1D2B]">{p.username}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowNewChat(false)} className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700">Close</button>
          </div>
        </div>
      )}

      {/* New group modal */}
      {showNewGroup && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-[#0B1D2B]">Create Group</h3>
            <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Group name" className="mb-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            <textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} placeholder="Description" className="mb-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" rows={2} />
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {participants.map((p) => (
                <label key={p._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={groupMembers.includes(p._id)} onChange={(e) => {
                    if (e.target.checked) setGroupMembers((prev) => [...prev, p._id]);
                    else setGroupMembers((prev) => prev.filter((id) => id !== p._id));
                  }} />
                  {p.username} ({p.role})
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowNewGroup(false)} className="flex-1 rounded-xl border border-gray-200 py-2 text-sm">Cancel</button>
              <button onClick={createGroup} className="flex-1 rounded-xl bg-yellow-400 py-2 text-sm font-semibold text-[#0B1D2B]">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}