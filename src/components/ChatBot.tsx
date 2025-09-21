import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, Venue } from '../types/venue';
import VenueCard from './VenueCard';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    if (!saved) return [{
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI venue assistant. I can help you find the perfect event space. Tell me about your event — type, guests, budget, location?",
      timestamp: new Date(),
    }];
    const parsed = JSON.parse(saved);
    return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---------------------------
  // Load Smyth AI ChatBot Script
  // ---------------------------
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cmfsk9ysip7q123qun1z7cfkj.agent.pa.smyth.ai/static/embodiment/chatBot/chatbot-v2.js";
    script.async = true;

    script.onload = () => {
      if (window.ChatBot) {
        window.ChatBot.init({
          domain: 'cmfsk9ysip7q123qun1z7cfkj.agent.pa.smyth.ai',
          isChatOnly: false,
          allowAttachments: false,
          introMessage: 'Hello, how can I assist you today?',
          // Optional: add colors or other settings here
          // colors: { primary: "#3b82f6", secondary: "#60a5fa" }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ---------------------------
  // Persist messages to localStorage
  // ---------------------------
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleClearHistory = () => {
    localStorage.removeItem('chatMessages');
    setMessages([{
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI venue assistant. Let's start fresh — what event are you planning?",
      timestamp: new Date(),
    }]);
  };

  // ---------------------------
  // Your existing handleSendMessage + generateBotResponse
  // ---------------------------
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Use your existing generateBotResponse function here
    setTimeout(() => {
      generateBotResponse(inputMessage).then(botResponse => {
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      });
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ---------------------------
  // JSX (your current layout)
  // ---------------------------
  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ... your header, messages, input code stays unchanged ... */}
    </div>
  );
};

export default ChatBot;
