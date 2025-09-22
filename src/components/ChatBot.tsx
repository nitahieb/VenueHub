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
    hourly: (dbVenue.hourly_price ?? 0) / 100, // Convert from cents to dollars, default to 0 if null
    daily: (dbVenue.daily_price ?? 0) / 100,
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
    if (!saved) return [
      {
        id: '1',
        type: 'bot',
        content: "Hi! I'm your AI venue assistant. I can help you find the perfect event space. Tell me about your event - what type of event are you planning, how many guests, your budget, and preferred location?",
        timestamp: new Date(),
      },
    ];

    const parsed = JSON.parse(saved);
    // Convert timestamp strings back into Date objects
    return parsed.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch (e) {
    console.error("Failed to load chat history:", e);
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
  setMessages([{
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
  }]);
};

  // ✅ Persist to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollableRef.current) {
    scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
  }
  };

useEffect(() => {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) return;

  if (lastMessage.type === 'user') {
    scrollToBottom();
  }
}, [messages]);

const generateBotResponse = async (userMessage: string): Promise<ChatMessage> => {
  let contentText = '';
  let venueRecommendations: Venue[] = [];

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
    structuredRecommendations: m.structuredRecommendations
    }));

    const apiResponse = await fetch(`${supabaseUrl}/functions/v1/smythos-chat-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ requirements: userMessage,
                           history}),
    });

    if (!apiResponse.ok) {
      throw new Error(`Proxy API error: ${apiResponse.status}`);
    }
    console.log(apiResponse)

    // parse proxy top-level JSON
    let responseData: any = null;
    try {
      responseData = await apiResponse.json();
    } catch (err) {
      console.warn('Proxy returned non-JSON top-level response:', err);
      responseData = null;
    }
    console.log('proxy responseData:', responseData);

    if(responseData?.response?.question?.question){
      return {
    id: Date.now().toString(),
    type: 'bot',
    content: responseData.response.question.question,
    timestamp: new Date(),
  };
    }
    // Handle the new API format with structured venue responses
    if (responseData?.success && responseData?.response?.venues) {
      console.log('Processing new API format with structured venues');
      
      const structuredVenues = responseData.response.venues;
      console.log("structured venues", structuredVenues)
      const venueIds = structuredVenues.map((v: any) => v.id);
      
      console.log('Extracted venue IDs:', venueIds);
      
      // Fetch venue details from database
      if (venueIds.length > 0) {
        const quoted = venueIds.map((id: string) => `"${String(id).replace(/"/g, '')}"`).join(',');
        const venuesUrl = `${supabaseUrl}/rest/v1/venues?id=in.(${quoted})&select=*`;
        console.log('Fetching venues from Supabase REST:', venuesUrl);

        try {
          const venuesResponse = await fetch(venuesUrl, {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          if (venuesResponse.ok) {
            const venuesData = await venuesResponse.json();
            console.log('venuesData from Supabase:', venuesData);
            
            if (Array.isArray(venuesData) && venuesData.length > 0) {
              // Create structured recommendations with explanations
              const structuredRecommendations = structuredVenues.map((structuredVenue: any) => {
                const venueData = venuesData.find((v: any) => v.id === structuredVenue.id);
                if (venueData) {
                  return {
                    explanation: structuredVenue.response,
                    venue: transformVenue(venueData)
                  };
                }
                return null;
              }).filter(Boolean);

              const seenVenueIds = structuredRecommendations.map(rec => rec!.venue.id);
              
              // Set content text and recommendations
              contentText = "Here are some perfect venues for your event:";
              
              return {
                id: Date.now().toString(),
                type: 'bot',
                content: contentText,
                timestamp: new Date(),
                structuredRecommendations,
              };
            }
          }
        } catch (err) {
          console.error('Failed to fetch venue details:', err);
        }
      } else{
        
        
      }
    }
    
    // Fallback to simple text response
    contentText = "I'm here to help you find the perfect venue! Could you tell me more about your event requirements?";
  } catch (error) {
    console.error('Error calling Smythos API via proxy:', error);
    contentText = "I'm sorry, I'm having trouble connecting to our venue recommendation service right now. Please try again in a moment.";
  }

  return {
    id: Date.now().toString(),
    type: 'bot',
    content: contentText,
    timestamp: new Date(),
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
  const scrollableRef = useRef<HTMLDivElement>(null);

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
      

      <div ref={scrollableRef} className="flex-1 overflow-y-auto p-4 space-y-4">
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

{/* Structured Recommendations with Explanations */}
{message.structuredRecommendations && message.structuredRecommendations.length > 0 && (
  <div className="mt-4 space-y-4">
    {message.structuredRecommendations.map((rec: any, index: number) => (
      <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Explanation */}
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <p className="text-sm text-gray-700">{rec.explanation}</p>
        </div>
        {/* Venue Card */}
        <div className="p-2">
          <div className="transform scale-95 origin-top-left">
            <VenueCard venue={rec.venue} />
          </div>
        </div>
      </div>
    ))}
  </div>
)}

{/* Legacy Venue Recommendations */}
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
      )).reverse()}
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