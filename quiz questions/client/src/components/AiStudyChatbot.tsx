import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import {
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const FREQUENT_QUESTIONS = [
  { label: '⏱️ Mock Test Timing', query: 'How does the mock test timing work for Level 1 questions?' },
  { label: '📐 Matrix Determinant', query: 'How do I calculate the determinant of a 2x2 matrix?' },
  { label: '⚡ Ohm\'s Law & Force', query: 'Explain Ohm\'s Law and Newton\'s Second Law of Motion' },
  { label: '🧪 Molar Mass & pH', query: 'How do I calculate molar mass and pH in Chemistry?' },
  { label: '💡 Level 1 Quiz Tips', query: 'Give me tips to score high on Level 1 (Easy) quiz questions' },
  { label: '💻 HTML & CSS Basics', query: 'What are the most common HTML tags and CSS properties?' },
];

export const AiStudyChatbot: React.FC = () => {
  const { user } = useAuth();

  // Only show the AI Tutor / chatbot after the user has logged in
  if (!user) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '👋 **Hello! I am your QuizLab AI Study Assistant.**\n\nAsk me any doubt about your subjects, mathematical matrices, physics or chemistry problems, or how the **Mock Test Timer** works (Level 1 = 1 minute per question)!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post<{ reply: string }>('/ai/chat', {
        message: query,
      });

      const botMsg: Message = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: res.data.reply || 'Here is the explanation for your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: 'bot_err_' + Date.now(),
        sender: 'assistant',
        text: '⚠️ I encountered an issue connecting. Please try again or ask another study question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: '👋 Chat history reset! Ask me any subject question, formula doubt, or test advice.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Clean any raw LaTeX math formatting or dollar symbols into clean human-readable text
  const cleanMathAndLatex = (text: string): string => {
    return text
      .replace(/\\(?:mathbf|text|mathrm|mathit)\{([^}]+)\}/g, '$1')
      .replace(/\\(?:cdot|times)/g, '×')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
      .replace(/\\pm/g, '±')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\implies/g, '→')
      .replace(/\\Omega/g, 'Ω')
      .replace(/\$\$/g, '')
      .replace(/\$/g, '');
  };

  // Helper to format basic markdown-style text safely (bold, code, bullets, line breaks)
  const renderFormattedText = (raw: string) => {
    const cleaned = cleanMathAndLatex(raw);
    const lines = cleaned.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      if (isBullet) {
        trimmed = trimmed.substring(2);
      }

      // First split by code backticks `code`
      const codeParts = trimmed.split(/(`[^`]+`)/g);

      const renderedLine = codeParts.map((subPart, sIdx) => {
        if (subPart.startsWith('`') && subPart.endsWith('`')) {
          return (
            <code
              key={sIdx}
              className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700/80 text-emerald-400 font-mono text-[11px] sm:text-xs mx-0.5"
            >
              {subPart.slice(1, -1)}
            </code>
          );
        }

        // Split by bold **text**
        const boldParts = subPart.split(/(\*\*.*?\*\*)/g);
        return boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith('**') && bPart.endsWith('**')) {
            return (
              <strong key={bIdx} className="font-bold text-white">
                {bPart.slice(2, -2)}
              </strong>
            );
          }
          return bPart;
        });
      });

      return (
        <div
          key={idx}
          className={`${line.trim() === '' ? 'h-2' : 'min-h-[1.25rem]'} ${
            isBullet ? 'flex items-start gap-1.5 pl-2 my-0.5' : ''
          }`}
        >
          {isBullet && <span className="text-emerald-400 font-bold shrink-0">•</span>}
          <span>{renderedLine}</span>
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          title="Open AI Study Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-500 rounded-full animate-ping"></span>
          </div>
          <span className="text-sm font-extrabold tracking-wide">AI Tutor</span>
          <Sparkles className="w-4 h-4 text-slate-950 opacity-80 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">QuizLab AI Tutor</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-slate-400">Ask doubts, formulas & test rules</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider shrink-0 pl-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> FAQs:
            </span>
            {FREQUENT_QUESTIONS.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(faq.query)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30 border border-slate-700/60 text-slate-300 font-medium transition cursor-pointer shrink-0 disabled:opacity-40"
              >
                {faq.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-sm shadow-md shadow-emerald-950/50'
                        : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {renderFormattedText(m.text)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any doubt or formula..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-slate-950 flex items-center justify-center transition shadow-md shadow-emerald-500/20 cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
