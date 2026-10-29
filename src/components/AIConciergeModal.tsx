import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Compass,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react';
import { EventPlan, Contributor } from '../types';
import { sendConciergeMessage } from '../services/geminiService';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
  activeContributor: Contributor;
  initialPrompt?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  event,
  activeContributor,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to Céleste Atelier. I am your Senior Planning Concierge for "${event.title}". How may I assist in refining your aesthetic, balancing your financial ledger, or orchestrating your day-of timeline?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const context = {
        title: event.title,
        eventType: event.eventType,
        guestCount: event.guestCount,
        budget: event.targetBudget,
        currency: event.currency,
        location: event.location,
        vibe: event.vibe,
      };

      const reply = await sendConciergeMessage(text.trim(), context, nextMessages);
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'I apologize; our atelier telegraph experienced a brief delay. In summary: true timeless elegance comes from quiet restraint, authentic materials, and seamless hospitality.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How can we trim 10% from catering without losing quality?',
    'What acoustic repertoire pairs best with vintage champagne?',
    'Suggest 3 ways to make guests feel deeply cared for upon arrival',
    'Review our timeline for potential bottlenecks during photos',
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="paper-card-elevated w-full max-w-2xl h-[620px] flex flex-col border border-[#D5CABB] bg-[#FAF8F5] shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D4] bg-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#25221F] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D1B685]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#9A8257] font-heading">
                Céleste Concierge · GenAI
              </div>
              <h2 className="font-heading text-lg text-[#1F1C18]">Atelier Planning Salon</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close concierge dialog"
            className="p-1.5 text-[#887C6E] hover:text-[#201D1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 border-b border-[#EFEAE0] bg-[#FCFAF7] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-editorial text-[#8E8375] flex-shrink-0">
            Suggested Queries:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-[11px] font-editorial px-2.5 py-1 bg-white hover:bg-[#F5EFE5] border border-[#DDD3C2] text-[#4F463A] whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Conversation history */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-editorial">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#25221F] flex-shrink-0 flex items-center justify-center text-white mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
                </div>
              )}

              <div
                className={`p-4 max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#25221F] text-[#FAF8F5]'
                    : 'bg-white border border-[#E8E1D4] text-[#292520] shadow-xs'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <img
                  src={activeContributor.avatar}
                  alt={activeContributor.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#CDBFA9] flex-shrink-0 mt-0.5"
                />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#25221F] flex-shrink-0 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
              </div>
              <div className="p-4 bg-white border border-[#E8E1D4] text-xs text-[#7A6F60] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9A8257]" />
                <span>The Concierge is penning bespoke advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-[#EAE2D4] bg-[#FFFFFF] flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask your concierge regarding budgets, vendors, or timelines..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#FAF7F2] border border-[#DDD3C2] text-xs font-sans text-[#201D1A] focus:outline-hidden focus:border-[#9A8257] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-2 bg-[#25221F] hover:bg-[#38332E] text-white text-xs font-editorial flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#D1B685]" />
            <span>Consult</span>
          </button>
        </form>
      </div>
    </div>
  );
};
