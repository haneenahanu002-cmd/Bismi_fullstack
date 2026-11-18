import { useEffect, useState, useRef } from "react";
import { Bot, Send, Trash2 } from "lucide-react";
import { aiAPI } from "../services/aiAPI";

const suggestedPrompts = [
  "What services do you provide?",
  "How can I book a service?",
  "How can I check my booking status?",
  "How can I contact my assigned operator?",
  "How do payments work?",
];

export default function BismiAI() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    aiAPI
      .getHistory()
      .then((data) => {
        setMessages(data.messages || []);
        setConversationId(data.conversationId);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (customText) => {
    const content = (customText || text).trim();
    if (!content || loading) return;
    setText("");
    setMessages((prev) => [...prev, { senderType: "user", content, timestamp: new Date() }]);
    setLoading(true);
    try {
      const data = await aiAPI.chat(content, conversationId);
      setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev,
        { senderType: "assistant", content: data.reply, timestamp: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          senderType: "assistant",
          content: "Sorry, Bismi AI is temporarily unavailable. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    try {
      await aiAPI.clearHistory();
      setMessages([]);
      setConversationId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-2xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-yellow-400 p-2.5 text-[#0B1D2B]">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="font-bold text-[#0B1D2B]">Bismi AI</h2>
            <p className="text-xs text-gray-500">Your Bismi Earth Movers assistant</p>
          </div>
        </div>
        <button onClick={clear} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {messages.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
            <Bot size={40} className="mx-auto mb-3 text-yellow-500" />
            <p className="font-semibold text-[#0B1D2B]">
              Hi! I'm Bismi AI 👋
            </p>
            <p className="mt-2 text-sm text-gray-500">
              I'm your Bismi Earth Movers assistant. Ask me anything about our services, bookings, machines, payments, or work updates.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 hover:border-yellow-400"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                msg.senderType === "user"
                  ? "bg-yellow-400 text-[#0B1D2B]"
                  : "bg-white text-gray-800 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
              Bismi AI is typing...
            </div>
          </div>
        )}

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
          placeholder="Ask Bismi AI..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="rounded-xl bg-yellow-400 p-2.5 text-[#0B1D2B] disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}