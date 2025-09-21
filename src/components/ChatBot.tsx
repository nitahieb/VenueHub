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

  // Persist messages
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  // Initialize Smyth AI and subscribe messages
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
          // Optional colors:
          // colors: { primary: "#3b82f6", secondary: "#60a5fa" }
        });

        // Listen for new bot messages
        window.ChatBot.onMessage((msg: any) => {
          // Smyth AI messages may have text and venue recommendations
          const botMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: msg.text || msg.message || '',
            timestamp: new Date(),
            venueRecommendations: msg.venues?.map((v: any) => ({
              id: v.id,
              name: v.name,
              description: v.description,
              location: {
                address: v.address,
                city: v.city,
                state: v.state,
                zipCode: v.zip_code,
                latitude: v.latitude,
                longitude: v.longitude,
              },
              capacity: { seated: v.seated_capacity, standing: v.standing_capacity },
              price: { hourly: v.hourly_price / 100, daily: v.daily_price / 100 },
              amenities: v.amenities || [],
              images: v.images || [],
              category: v.category,
              rating: v.rating,
              reviews: v.reviews_count,
              availability: v.availability,
              featured: v.featured,
              status: v.status,
              owner_id: v.owner_id,
            })),
          };

          setMessages(prev => [...prev, botMessage]);
        });
      }
    };

    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // ---------------------------
  // Handle user sending messages
  // ---------------------------
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Send to Smyth AI
    if (window.ChatBot) {
      window.ChatBot.sendMessage(inputMessage);
    }

    setInputMessage('');
    setIsTyping(true);

    // Stop typing after a short delay (Smyth AI may trigger onMessage later)
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ---------------------------
  // JSX (your existing layout)
  // ---------------------------
  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header, messages, input UI stays the same */}
      {/* ... keep your JSX code exactly as before ... */}
    </div>
  );
};

export default ChatBot;
