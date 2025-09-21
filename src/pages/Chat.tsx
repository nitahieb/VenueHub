import React from 'react';
import ChatBot from '../components/ChatBot';
import ChatBotEmbed from '../components/ChatBotEmbed';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI Venue Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let our intelligent assistant help you find the perfect venue for your event. 
            Just describe what you're looking for, and we'll provide personalized recommendations.
          </p>
        </div>
        
        <ChatBot />
        <ChatBotEmbed />
      </div>
    </div>
  );
};

export default Chat;