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
      console.log(apiResponse);

      // parse proxy top-level JSON
      let responseData: any = null;
      try {
        responseData = await apiResponse.json();
      } catch (err) {
        console.warn('Proxy returned non-JSON top-level response:', err);
        responseData = null;
      }
      console.log('proxy responseData:', responseData);

      // Handle new structured API response format
if (responseData?.Output?.venues && typeof responseData.Output.venues === 'object') {
  const venuesArray = Object.values(responseData.Output.venues);

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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        {/* Left side (bot icon + title) */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-8 w-8" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Venue Assistant</h2>
            <p className="text-blue-100 text-sm">Find your perfect event space</p>
          </div>
        </div>

        {/* Right side (Clear button) */}
        <button
          onClick={handleClearHistory}
          className="flex items-center space-x-1 text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-3xl ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div>
                <div
                  className={`rounded-xl px-4 py-2 ${
                    message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                </div>

                {/* Legacy venue recommendations */}
                {message.venueRecommendations && message.venueRecommendations.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-3 font-medium">
                      Recommended Venues ({message.venueRecommendations.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                      {message.venueRecommendations
                        .map(venue => (
                          <div key={venue.id} className="transform scale-90 origin-top-left">
                            <VenueCard venue={venue} />
                          </div>
                        ))
                        .reverse()}
                    </div>
                  </div>
                )}

                {/* New structured recommendations */}
                {message.structuredRecommendations && message.structuredRecommendations.length > 0 && (
                  <div className="mt-4 space-y-6">
                    {message.structuredRecommendations.map((recommendation, index) => (
                      <div key={`${recommendation.venue.id}-${index}`} className="space-y-3">
                        <div className="bg-blue-50 rounded-lg px-4 py-3 border-l-4 border-blue-400">
                          <div className="text-sm text-gray-800 whitespace-pre-line">
                            {recommendation.explanation}
                          </div>
                        </div>

                        <div className="transform scale-90 origin-top-left max-w-md">
                          <VenueCard venue={recommendation.venue} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your event needs..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Try asking about wedding venues, corporate spaces, outdoor locations, or your specific requirements!
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
