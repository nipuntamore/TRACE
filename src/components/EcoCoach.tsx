import React, { useState, useRef, useEffect } from 'react';
import { EcoCoachMessage, QuizProfile, Challenge, CarbonLog } from '../types';
import { Send, Sparkles, User, BrainCircuit, HeartHandshake, RefreshCw, Loader2 } from 'lucide-react';

interface EcoCoachProps {
  profile: QuizProfile;
  challenges: Challenge[];
  logs: CarbonLog[];
  onCoachInteraction?: () => void;
}

export default function EcoCoach({ profile, challenges, logs, onCoachInteraction }: EcoCoachProps) {
  const [messages, setMessages] = useState<EcoCoachMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "👋 Hello! I'm your TRACE Eco-Coach, powered by Gemini. I've analyzed your lifestyle parameters! Ask me to recommend personalized offsets, clarify some carbon equivalency scales, or suggest realistic action cards to try this week.",
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle message submission
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Trigger callback to parent for achievements / interactive logging metrics
    onCoachInteraction?.();

    const userMsg: EcoCoachMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // API call to custom Express route
      const response = await fetch('/api/gemini-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: [...messages, userMsg],
          profile,
          challenges,
          logs
        })
      });

      const data = await response.json();
      
      const coachMsg: EcoCoachMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'model',
        content: data.reply || "I am analyzing your lifestyle metrics to devise optimized offsets. Try asking about a specific habit swap!",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: EcoCoachMessage = {
        id: 'err',
        role: 'model',
        content: "Oops! My regional green energy connection is a bit overloaded. Don't worry, your local progress is perfectly saved! Try asking again in a brief second.",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage(input);
  };

  const PRESET_CHIPS = [
    { label: "📊 Analyze my current footprint", value: "Analyze my current footprint and state if my commute driving distance (km) is standard." },
    { label: "🌲 Suggest specialized action cards", value: "Based on my dietary preferences and transit profile, suggest 3 targeted action goals." },
    { label: "⚡ How to save domestic standby load?", value: "Give me some quick actionable items to eliminate home residual phantom standby power." },
  ];

  return (
    <div className="bg-white border border-[#E1EAD8] rounded-[2rem] p-6 shadow-sm flex flex-col h-[580px] justify-between relative overflow-hidden text-[#1B4332]" id="eco-coach-panel">
      
      {/* Advisor Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#E1EAD8] z-10 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-2xl animate-float">
            <BrainCircuit className="w-6 h-6 text-[#2D6A4F]" />
          </div>
          <div>
            <h3 className="text-base font-black font-display text-[#1B4332] flex items-center gap-1.5 leading-tight">
              Gemini Eco-Coach 
              <span className="text-xs bg-[#D8F3DC] text-[#1B4332] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase font-mono">
                ACTIVE AI
              </span>
            </h3>
            <p className="text-xs text-[#40916C] leading-none font-semibold">Personalized, real-time climate tracking consigliere</p>
          </div>
        </div>
        
        {/* Reset history capability button */}
        <button
          id="btn-coach-reset"
          onClick={() => setMessages(prev => [prev[0]])}
          className="p-2 text-[#40916C] hover:text-[#1B4332] hover:bg-[#F2F5F0] rounded-lg border border-[#E1EAD8] transition-colors cursor-pointer"
          title="Clear advisor conversation history"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Message logs area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin" id="messages-stream-container">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 leading-relaxed text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Coach face node */}
              {!isUser && (
                <div className="w-7 h-7 bg-[#D8F3DC] border border-[#B7E4C7] rounded-full flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4 text-[#2D6A4F]" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl px-4 py-3 border font-sans ${
                isUser 
                  ? 'bg-[#1B4332] border-[#1B4332] text-white rounded-tr-none' 
                  : 'bg-[#F2F5F0] border-[#E1EAD8] text-[#1B4332] rounded-tl-none font-medium'
              }`}>
                {/* Format paragraphs or bold text using soft splits */}
                <div className="space-y-1 text-xs whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
                <span className={`block text-[10px] font-mono mt-1.5 text-right ${isUser ? 'text-zinc-300' : 'text-[#40916C]'}`}>
                  {m.timestamp}
                </span>
              </div>

              {/* User face icon */}
              {isUser && (
                <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading status */}
        {loading && (
          <div className="flex items-center gap-2.5 justify-start text-xs text-[#2D6A4F] pl-1.5 animate-pulse font-mono font-bold">
            <Loader2 className="w-4 h-4 text-[#2D6A4F] animate-spin" />
            TRACE Advisor is synthesizing your carbon reduction guidelines...
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Preset suggestions chips block */}
      <div className="border-t border-[#E1EAD8] pt-4 pb-2 z-10 bg-white">
        <span className="text-xs font-bold font-mono text-[#40916C] block mb-2 uppercase tracking-wide">
          Quick Question Prompts
        </span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {PRESET_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              id={`chip-preset-${idx}`}
              onClick={() => handleSendMessage(chip.value)}
              className="px-3.5 py-1.5 bg-white hover:bg-[#D8F3DC] hover:text-[#1B4332] hover:border-[#B7E4C7] text-xs font-extrabold text-[#1B4332] rounded-full border border-[#E1EAD8] transition-all cursor-pointer shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar section */}
      <div className="flex items-center gap-2 pt-2 bg-white border-t border-[#E1EAD8]">
        <input
          type="text"
          id="input-coach-prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask TRACE Eco-Coach about custom offsets..."
          className="flex-1 bg-[#F2F5F0] border border-[#E1EAD8] py-3 px-4 rounded-xl text-xs text-[#1B4332] placeholder-zinc-400 focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition-all font-sans font-extrabold"
        />
        <button
          id="btn-coach-send"
          onClick={() => handleSendMessage(input)}
          disabled={loading || !input.trim()}
          className="p-3 bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-40 text-white rounded-xl shadow-sm hover:shadow transition-all focus:outline-none shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
