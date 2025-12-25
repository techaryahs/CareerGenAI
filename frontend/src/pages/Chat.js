import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from "react-markdown";
import '../styles/Chat.css';
import PremiumPopup from '../components/PremiumPlans';
import PageLoader from '../components/PageLoader';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
  const savedMessages = localStorage.getItem("career_chat_messages");

  return savedMessages
    ? JSON.parse(savedMessages)
    : [
        {
          sender: 'bot',
          text: '👋 Hi! I’m your AI Career Assistant. Ask me anything.',
        },
      ];
});

useEffect(() => {
  localStorage.setItem(
    "career_chat_messages",
    JSON.stringify(messages)
  );
}, [messages]);


  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ SINGLE SOURCE OF API TRUTH
  const API = process.env.REACT_APP_API_URL;

  // ======================
  // TYPEWRITER EFFECT
  // ======================
  const typeWriter = async (text) => {
    return new Promise((resolve) => {
      let i = 0;

      setMessages(prev => [...prev, { sender: "bot_typing", text: "" }]);

      const interval = setInterval(() => {
        i++;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = text.substring(0, i);
          return updated;
        });

        if (i >= text.length) {
          clearInterval(interval);
          setMessages(prev => {
            const clean = prev.filter(m => m.sender !== "bot_typing");
            return [...clean, { sender: "bot", text }];
          });
          resolve();
        }
      }, 12);
    });
  };

  // ======================
  // PAGE LOADER
  // ======================
  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // ======================
  // SCROLL TO BOTTOM
  // ======================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ======================
  // SEND MESSAGE (API ONLY)
  // ======================
  const handleSend = async () => {
  if (!input.trim()) return;

  const newCount = messageCount + 1;

  // 🔒 Premium limit
  if (!user?.isPremium && newCount > 2) {
    setShowPremiumPopup(true);
    return;
  }

  setMessageCount(newCount);

  // 👤 Add user message
  const userMessage = { sender: 'user', text: input };
  setMessages(prev => [...prev, userMessage]);

  setInput('');
  setLoading(true);

  try {
    // ✅ SEND WHAT YOUR API EXPECTS
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage.text
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    /**
     * 🔥 IMPORTANT PART
     * API returns:
     * {
     *   reply: "{ \"model\": \"phi3:mini\", \"response\": \"ACTUAL ANSWER\" }"
     * }
     */

    let finalReply = "⚠️ No response from AI.";

    try {
      const parsed =
        typeof data.reply === "string"
          ? JSON.parse(data.reply)
          : data.reply;

      finalReply =
        parsed.response ||
        parsed.answer ||
        finalReply;

    } catch (parseErr) {
      // fallback if parsing fails
      finalReply = data.reply;
    }

    await typeWriter(finalReply);

  } catch (err) {
    console.error("Chat API Error:", err);
    await typeWriter("❌ Unable to connect to AI service.");
  }

  setLoading(false);
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  if (pageLoading) return <PageLoader />;

  return (
    <div className="chat-container">
      <div className="chat-box-wrapper">
        <div className="chat-header">🎓 CareerGenAI Assistant</div>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              {msg.sender === 'bot' || msg.sender === 'bot_typing' ? (
                <div className="bot-response-card markdown-output">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <div className="user-message">{msg.text}</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble bot">
              <div className="bot-response-card">⏳ Thinking...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <span onClick={handleSend} className="send-btn">
            {loading ? '...' : <FiSend size={20} />}
          </span>
        </div>
      </div>

      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
            setMessageCount(0);
            setShowPremiumPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
