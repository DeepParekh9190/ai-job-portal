import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Talentora AI. How can I assist you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startInterview = () => {
    setIsInterviewMode(true);
    const welcome = {
      id: Date.now(),
      text: "Alright! Let's start. I'll act as a Senior Technical Recruiter. What role are we interviewing for today?",
      sender: 'bot'
    };
    setMessages(prev => [...prev, welcome]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: inputText, 
      sender: 'user' 
    };
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call Real AI Backend
      const response = await api.post('/ai/chat', { 
        message: inputText,
        history: messages.slice(-5), // Send last 5 messages for context
        context: isInterviewMode ? 'mock_interview' : 'general_support'
      });

      if (response.success) {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: response.response, 
          sender: 'bot' 
        }]);
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I encountered an error while processing your request. Please try again or check your internet connection.", 
        sender: 'bot' 
      }]);
      toast.error('AI service temporarily unavailable');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="relative mb-4">
          {/* Colorful Edge Lights (Aura-Clipper Layer) */}
          {isTyping && (
            <div className="absolute -inset-[2px] overflow-hidden rounded-none -z-20">
              <div className="absolute inset-[-150%] bg-thinking-gradient animate-border-rotate blur-[2px]">
              </div>
            </div>
          )}
          
          <div className={`w-80 md:w-96 bg-midnight-800 border border-white/10 rounded-none shadow-2xl relative flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-500 transition-all ${
            isTyping ? 'shadow-[0_0_50px_rgba(139,92,246,0.1)]' : ''
          }`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-electric-purple to-indigo-600 p-4 flex items-center justify-between shrink-0 relative overflow-hidden">
            {isTyping && (
              <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none"></div>
            )}
            <div className="flex items-center gap-3 relative z-10">
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
            <div className="flex items-center gap-1 relative z-10">
              <button 
                onClick={() => setIsInterviewMode(!isInterviewMode)} 
                className={`p-1 rounded-md transition-colors ${isInterviewMode ? 'bg-white/20 text-white' : 'hover:bg-white/20 text-white/70'}`}
                title={isInterviewMode ? "End Interview Mode" : "Start Mock Interview"}
              >
                <Bot className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors text-white">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-midnight-900/95 p-4 overflow-y-auto custom-scrollbar scroll-smooth">
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
                  {msg.sender === 'bot' ? (
                    <div className="prose prose-invert prose-sm max-w-none text-gray-200">
                      <ReactMarkdown 
                        children={String(msg.text || "")}
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="bold text-electric-purple">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                        }}
                      />
                    </div>
                  ) : (
                    msg.text
                  )}
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
          <form onSubmit={handleSend} className="p-3 bg-midnight-800 border-t border-white/10 shrink-0">
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
      </div>
      )}

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
