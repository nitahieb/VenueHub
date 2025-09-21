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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI venue assistant. I can help you find the perfect event space. Tell me about your event - what type of event are you planning, how many guests, your budget, and preferred location?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = async (userMessage: string): Promise<ChatMessage> => {
    let response = '';
    let venueRecommendations: Venue[] = [];
    
    try {
      console.log('Calling Smythos API via proxy with requirements:', userMessage);
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration not found');
      }
      
      const apiResponse = await fetch(`${supabaseUrl}/functions/v1/smythos-chat-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          requirements: userMessage
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`Proxy API error: ${apiResponse.status}`);
      }

      const responseData = await apiResponse.json();
      console.log('Raw response from proxy:', responseData);
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Unknown error from proxy');
      }

      // Extract the response text and handle potential JSON parsing
      let responseText = responseData.response || "I found some great venues for you!";
      
      // Check if the response is a JSON string that needs parsing
      if (typeof responseText === 'string' && responseText.startsWith('{')) {
        try {
          const parsedResponse = JSON.parse(responseText);
          response = parsedResponse.result || responseText;
          
          // If venue_ids are in the parsed response, use them
          if (parsedResponse.venue_ids && Array.isArray(parsedResponse.venue_ids)) {
            console.log('Found venue_ids in parsed response:', parsedResponse.venue_ids);
            // The proxy should have already fetched venues, but let's check responseData.venues too
          }
        } catch (parseError) {
          console.log('Response is not JSON, using as plain text');
          response = responseText;
        }
      } else {
        response = responseText;
      }
      
      // Transform venue data if provided
      if (responseData.venues && Array.isArray(responseData.venues)) {
        venueRecommendations = responseData.venues.map(transformVenue);
        console.log(`Received ${venueRecommendations.length} venue recommendations`);
      }
      
    } catch (error) {
      console.error('Error calling Smythos API via proxy:', error);
      response = "I'm sorry, I'm having trouble connecting to our venue recommendation service right now. Please try again in a moment.";
      venueRecommendations = [];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      venueRecommendations: venueRecommendations,
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center space-x-3">
        <div className="relative">
          <Bot className="h-8 w-8" />
          <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-amber-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Venue Assistant</h2>
          <p className="text-blue-100 text-sm">Find your perfect event space</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div>
                <div className={`rounded-xl px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {/* Venue Recommendations */}
                {message.venueRecommendations && message.venueRecommendations.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-3 font-medium">
                      Recommended Venues ({message.venueRecommendations.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                      {message.venueRecommendations.map((venue) => (
                        <div key={venue.id} className="transform scale-90 origin-top-left">
                          <VenueCard venue={venue} />
                        </div>
                      ))}
                    </div>
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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
            onChange={(e) => setInputMessage(e.target.value)}
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