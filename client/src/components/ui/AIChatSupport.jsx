import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const AIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Talentora AI. How can I assist you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: inputText, 
      sender: 'user' 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const botResponse = generateResponse(inputText);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: botResponse, 
        sender: 'bot' 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple rule-based mock AI for demo purposes
  const generateResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('job') || lowerText.includes('work')) 
      return "You can browse thousands of active listings on our Jobs page. Use filters to narrow down by salary, location, and tech stack.";
    
    if (lowerText.includes('resume') || lowerText.includes('cv'))
      return "Our AI Resume Analyzer can scan your CV and verify your skills instantly. Check it out in your user dashboard!";

    if (lowerText.includes('pricing') || lowerText.includes('cost'))
      return "For candidates, Talentora is 100% free. Employers pay only upon successful hires.";

    if (lowerText.includes('hello') || lowerText.includes('hi'))
      return `Hello ${user ? user.name : 'there'}! Ready to find your dream role?`;

    return "I'm not sure about that specific detail yet, but our support team is available 24/7 if you need human assistance!";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-midnight-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-electric-purple to-indigo-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Talentora Support</h3>
                <span className="flex items-center gap-1 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors text-white">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-midnight-900/95 p-4 h-80 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-electric-purple/20 flex items-center justify-center mr-2 shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-electric-purple" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-electric-purple text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center ml-2 shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                 <div className="w-6 h-6 rounded-full bg-electric-purple/20 flex items-center justify-center mr-2 shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-electric-purple" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-midnight-800 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-midnight-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-electric-purple/50 focus:ring-1 focus:ring-electric-purple/50 placeholder-gray-500 transition-all"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-electric-purple hover:bg-electric-purple-light text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-500">Powered by Talentora AI</span>
            </div>
          </form>

        </div>
      )}

      {/* Floating Trigger Button */}
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-all duration-300 w-14 h-14 bg-gradient-to-r from-electric-purple to-indigo-600 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] flex items-center justify-center text-white z-50 group hover:-translate-y-1`}
      >
        {isOpen ? (
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
        
        {/* Notification Badge - Only show when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-midnight-900 animate-pulse"></span>
        )}
      </button>

    </div>
  );
};

export default AIChatSupport;
