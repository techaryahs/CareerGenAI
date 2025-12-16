import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from "react-markdown"; // ⭐ Added for better formatting
import '../styles/Chat.css';
import PremiumPopup from '../components/PremiumPlans';
import { staticColleges } from '../data/staticColleges';
import PageLoader from '../components/PageLoader'; // ✅ NEW

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I’m your AI Career Assistant. Ask me anything about careers, courses, or colleges.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); 
  const [messageCount, setMessageCount] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const messagesEndRef = useRef(null);

  const API = process.env.REACT_APP_API_URL;

  // ⭐ Detect and extract user's name
  const detectUserName = (text) => {
    const pattern = /(my name is|i am|i'm)\s+([A-Za-z ]+)/i;
    const match = text.match(pattern);
    if (match) return match[2].trim();
    return null;
  };

  // ⭐ Typewriter effect
  const typeWriter = async (text) => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          if (i === 0) {
            setMessages(prev => [...prev, { sender: "bot_typing", text: "" }]);
          }
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].text = text.substring(0, i);
            return updated;
          });
          i++;
        } else {
          clearInterval(interval);

          // Replace typing bubble
          setMessages(prev => {
            const updated = prev.filter(m => m.sender !== "bot_typing");
            return [...updated, { sender: "bot", text }];
          });

          resolve();
        }
      }, 12);
    });
  };

  // Page loader animation
  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Keep user info updated
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const savedName = localStorage.getItem("career_user_name");

    // ⭐ Greet user by name
    if (savedName) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: `Welcome back, **${savedName}** 👋` }
      ]);
    }

    if (localUser?.email) {
      fetch(`${API}/api/user/${localUser.email}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setUser(localUser);
        });
    }
  }, [API]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newCount = messageCount + 1;

    // Premium message limit
    if (!user?.isPremium && newCount > 2) {
      setShowPremiumPopup(true);
      setInput('');
      return;
    }
    setMessageCount(newCount);

    // Add user message
    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const inputLC = input.toLowerCase().trim();
    setInput('');
    setLoading(true);

    // ⭐ Greeting detection (improved)
    const greetings = ["hi", "hii", "hello", "hey", "good morning", "good evening"];
    if (greetings.some(g => inputLC.includes(g))) {
      await typeWriter("👋 Hello! How can I help you today?");
      setLoading(false);
      return;
    }

    // ⭐ Detect user name
    const extractedName = detectUserName(inputLC);
    if (extractedName) {
      localStorage.setItem("career_user_name", extractedName);

      await typeWriter(
        `Nice to meet you, **${extractedName}**! 😊  
You can ask me about **courses**, **colleges**, **cutoffs**, **fees**, **placement**, or **locations**.`
      );

      setLoading(false);
      return;
    }

    // ⭐ Static college match (your logic untouched)
    let matchedCollege = staticColleges.find(clg => {
      const nameLC = clg.name.toLowerCase();
      const aliasMatch = clg.aliases?.some(alias => inputLC.includes(alias));
      const nameMatch = inputLC.includes(nameLC) || nameLC.includes(inputLC);
      return aliasMatch || nameMatch;
    });

    if (matchedCollege) {
      let cutOffsFormatted = 'No cutoffs available';

      if (matchedCollege.cutOffs && Object.keys(matchedCollege.cutOffs).length > 0) {
        cutOffsFormatted = Object.entries(matchedCollege.cutOffs)
          .map(([branch, cutoff]) => `- **${branch}**: ${cutoff || '-'}`)
          .join('\n');
      }

      const staticReply = `
**✅ College Found: ${matchedCollege.name}**
- 📍 Location: ${matchedCollege.location}
- 🎓 Courses: ${matchedCollege.course}
- 🏫 Type: ${matchedCollege.type}
- 📘 Affiliation: ${matchedCollege.affiliation}
- 💸 Fees: ${matchedCollege.fees}
- 📈 Placement Rate: ${matchedCollege.placementRate}
- 💼 Recruiters: ${matchedCollege.topRecruiters?.join(', ') || '-'}
- 🧑‍🏫 Faculty: ${matchedCollege.faculty}
- 🏕️ Campus Life: ${matchedCollege.campusLife}
- 📝 Entrance Exam: ${matchedCollege.entranceExam}
- 📅 Admission Deadline: ${matchedCollege.admissionDeadline || '-'}
- 🌐 Website: ${matchedCollege.website}

### 📊 Branch-wise CutOffs:
${cutOffsFormatted}
      `.trim();

      await typeWriter(staticReply);
      setLoading(false);
      return;
    }

    // ⭐ Backend AI fallback
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        await typeWriter(data.reply);
      } else {
        await typeWriter(`
🤔 I didn’t understand that.

You can ask me about:
• **Courses**
• **Colleges**
• **Cutoffs**
• **Fees**
• **Placements**
• **College locations**
• **Admission process**

Or introduce yourself like:
`);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      await typeWriter('❌ Error connecting to AI service.');
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
              <div className="bot-response-card">⏳ Typing...</div>
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
          <span
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="send-btn"
          >
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
