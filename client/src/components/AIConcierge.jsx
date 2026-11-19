import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../api';

const QUICK_PROMPTS = [
  'Recommend a suite for me',
  '3-day Lagos VI luxury itinerary',
  'What dining options are available?',
  'Tell me about the Thermal Spa pass'
];

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'concierge',
      text: 'Good day. I am Aurelia, your private AI Concierge. How may I elevate your stay or assist your travel itinerary in Victoria Island today?',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.askConcierge({
        message: messageText,
        guest: 'Chidi Okafor',
        vip_tier: 'black'
      });

      const replyText = res?.data?.reply || res?.reply || "It is our absolute pleasure to assist. Our head butler is also available on speed dial 1.";

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'concierge',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Concierge error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'concierge',
          text: "I am momentarily coordinating with our front desk. Please allow me a moment or speak with our Duty Manager.",
          time: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gold hover:bg-gold-hover text-white font-bold shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer ring-2 ring-gold/40"
          title="Open Aurelia AI Concierge"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald ring-2 ring-gold" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold">AI Concierge</span>
        </button>
      </div>

      {/* Slide-Up / Floating Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[550px] theme-bg-elevated rounded-3xl border border-gold/40 shadow-2xl flex flex-col overflow-hidden theme-text-primary animate-slideUp">

          {/* Header */}
          <div className="px-5 py-4 [background-color:var(--bg-secondary)] border-b theme-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald ring-2 ring-[var(--bg-secondary)]" />
              </div>
              <div>
                <h3 className="text-sm font-serif-display font-semibold theme-text-primary flex items-center gap-1.5">
                  Aurelia Concierge <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">AI</span>
                </h3>
                <p className="text-[11px] theme-text-secondary">
                  Gemini-Powered Hospitality Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl theme-text-secondary hover:theme-text-primary hover:theme-bg-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 [background:linear-gradient(to_bottom,var(--bg-elevated),var(--bg-secondary))] text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'concierge';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm leading-relaxed whitespace-pre-line ${
                      isAi
                        ? 'theme-bg-primary border theme-border theme-text-primary rounded-tl-sm'
                        : 'bg-gold text-white font-medium rounded-tr-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        isAi ? 'theme-text-secondary' : 'text-white/70'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-full theme-bg-elevated border theme-border theme-text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 theme-text-secondary text-xs italic pl-9">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                <span>Aurelia is curating your recommendation...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2.5 [background-color:var(--bg-secondary)] border-t border-[var(--border-color)]/60 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full theme-bg-elevated border theme-border theme-text-secondary hover:text-gold hover:border-gold/40 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 [background-color:var(--bg-secondary)] border-t theme-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about dining, suites, transfers..."
                className="flex-1 theme-bg-primary border theme-border rounded-xl px-3.5 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 rounded-xl bg-gold hover:bg-gold-hover text-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
