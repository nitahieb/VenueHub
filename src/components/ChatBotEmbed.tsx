import React, { useEffect } from 'react';

const ChatBotEmbed: React.FC = () => {
  useEffect(() => {
    // Dynamically load the chatbot script
    const script = document.createElement('script');
    script.src = 'https://cmfsk9ysip7q123qun1z7cfkj.agent.pa.smyth.ai/static/embodiment/chatBot/chatbot-v2.js';
    script.async = true;
    script.onload = () => {
      // Initialize the chatbot once the script has loaded
      if (window.ChatBot) {
        window.ChatBot.init({
          domain: 'cmfsk9ysip7q123qun1z7cfkj.agent.pa.smyth.ai',
          isChatOnly: false,
          allowAttachments: false,
          introMessage: 'Hello, how can I assist you today?',
          // Add other configuration options as needed
        });
      }
    };
    document.body.appendChild(script);

    // Cleanup the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything itself
};

export default ChatBotEmbed;