import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, Venue } from '../types/venue';
import VenueCard from './VenueCard';

// Transform database venue to frontend Venue type
const transformVenue = (dbVenue: any): Venue => ({
  id: dbVenue.id,
  name: dbVenue.name,
  description: dbVenue.description,
  location: {
    address: dbVenue.address,
    city: dbVenue.city,
    state: dbVenue.state,
    zipCode: dbVenue.zip_code,
    latitude: dbVenue.latitude || undefined,
    longitude: dbVenue.longitude || undefined,
  },
  capacity: {
    seated: dbVenue.seated_capacity,
    standing: dbVenue.standing_capacity,
  },
  price: {
    hourly: dbVenue.hourly_price / 100, // Convert from cents to dollars
    daily: dbVenue.daily_price / 100,
  },
  amenities: dbVenue.amenities || [],
  images: dbVenue.images || [],
  category: dbVenue.category,
  rating: dbVenue.rating,
  reviews: dbVenue.reviews_count,
  availability: dbVenue.availability,
  featured: dbVenue.featured,
  status: dbVenue.status,
  owner_id: dbVenue.owner_id,
});

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('chatMessages');
      if (!saved)
        return [
          {
            id: '1',
            type: 'bot',
            content:
              "Hi! I'm your AI venue assistant. I can help you find the perfect event space. Tell me about your event - what type of event are you planning, how many guests, your budget, and preferred location?",
            timestamp: new Date(),
          },
        ];

      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    } catch (e) {
      console.error('Failed to load chat history:', e);
      return [
        {
          id: '1',
          type: 'bot',
          content: `Hi! I'm your AI venue assistant. I can help you find the perfect event space. 

To get started, please tell me:
- What type of event you're planning (wedding, party, corporate event, etc.)
- The location or city you'd like the venue in
- How many guests you expect
- Your budget (hourly or daily)
- Any special requests or amenities you need (outdoor space, AV equipment, catering, etc.)

Feel free to include as much detail as you can — the more I know, the better I can recommend venues for you!`,
          timestamp: new Date(),
        },
      ];
    }
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleClearHistory = () => {
    localStorage.removeItem('chatMessages');
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: `Hi! I'm your AI venue assistant. I can help you find the perfect event space. 

To get started, please tell me:
- What type of event you're planning (wedding, party, corporate event, etc.)
- The location or city you'd like the venue in
- How many guests you expect
- Your budget (hourly or daily)
- Any special requests or amenities you need (outdoor space, AV equipment, catering, etc.)

Feel free to include as much detail as you can — the more I know, the better I can recommend venues for you!`,
        timestamp: new Date(),
      },
    ]);
  };

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = async (userMessage: string): Promise<ChatMessage> => {
    let contentText = '';
    let structuredRecommendations: Array<{ explanation: string; venue: Venue }> = [];

    try {
      console.log('Calling Smythos API via proxy with requirements:', userMessage);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration not found');
      }
      const history = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const apiResponse = await fetch(`${supabaseUrl}/functions/v1/smythos-chat-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ requirements: userMessage, history }),
      });

      if (!apiResponse.ok) {
        throw new Error(`Proxy API error: ${apiResponse.status}`);
      }

      let responseData: any = null;
      try {
        responseData = await apiResponse.json();
      } catch (err) {
        console.warn('Proxy returned non-JSON top-level response:', err);
        responseData = null;
      }
      console.log('proxy responseData:', responseData);

      // NEW PARSING FOR Output.venues API
      if (responseData?.Output?.venues && Array.isArray(responseData.Output.venues)) {
        const venuesArray = responseData.Output.venues;

        structuredRecommendations = venuesArray
          .map((item: any) => {
            if (!item.id) return null;
            return {
              explanation: item.response,
              venue: { id: item.id } as Venue, // optional: fetch full venue details if needed
            };
          })
          .filter(Boolean);

        if (structuredRecommendations.length > 0) {
          contentText = "Here are some great venue recommendations for you:";
        } else {
          contentText =
            "I couldn't find specific venue recommendations at this time. Please try rephrasing your request.";
        }
      } else {
        contentText =
          responseData?.response || "I'm sorry, I didn't receive a proper response. Please try again.";
      }
    } catch (error) {
      console.error('Error calling Smythos API via proxy:', error);
      contentText =
        "I'm sorry, I'm having trouble connecting to our venue recommendation service right now. Please try again in a moment.";
      structuredRecommendations = [];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: contentText,
      timestamp: new Date(),
      structuredRecommendations,
    };
  };

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

    // Simulate AI thinking delay
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

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ...rest of your JSX remains unchanged */}
    </div>
  );
};

export default ChatBot;
