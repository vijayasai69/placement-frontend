import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Loader2, User, RotateCcw, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/services/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { icon: "📝", text: "Write a cover letter for me" },
  { icon: "🎯", text: "Give me a mock interview question" },
  { icon: "🔥", text: "Roast my resume brutally" },
  { icon: "💸", text: "How do I negotiate my salary?" },
  { icon: "🚀", text: "What project should I build?" }
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: `Hey there! 👋 I'm your **AI Career Coach**, powered by real-time insights from your resume and job matches.

Here are some things I can help with:

- 📄 **Resume tips** — improve your ATS score & readability
- 🎯 **Skill gap analysis** — identify what to learn next
- 💼 **Job match advice** — understand why roles were recommended
- 🗺️ **Career roadmap** — plan your next steps
- 🎤 **Interview prep** — practice common questions

Just type a message to get started!`,
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Send full conversation history (excluding the welcome message) to backend
      const conversationHistory = updatedMessages
        .filter((_, i) => i > 0) // skip welcome message
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.post("/api/chat/message", {
        messages: conversationHistory,
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.data?.data?.content || "I'm sorry, I couldn't generate a response. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error("Chat API error:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "⚠️ Something went wrong while reaching the AI coach. Please check your connection and try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  };

  const handleQuickPrompt = async (text: string) => {
    if (isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const conversationHistory = updatedMessages
        .filter((_, i) => i > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.post("/api/chat/message", {
        messages: conversationHistory,
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.data?.data?.content || "I'm sorry, I couldn't generate a response. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error("Chat API error:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "⚠️ Something went wrong while reaching the AI coach. Please check your connection and try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent-magenta text-white shadow-[0_4px_24px_rgba(124,58,237,0.4)] flex items-center justify-center hover:shadow-[0_4px_32px_rgba(124,58,237,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 group float-y"
            aria-label="Open AI Career Coach"
          >
            <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            {/* Notification pulse */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#030712] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[600px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass panel */}
            <div className="flex flex-col h-full bg-white/95 dark:bg-[#06030D]/95 backdrop-blur-xl border-l border-surface-border shadow-[-8px_0_40px_rgba(0,0,0,0.6)]">
              
              {/* Header */}
              <div className="shrink-0 px-5 py-4 border-b border-surface-border bg-surface/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-lg border border-primary/30">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-text-primary tracking-tight">AI Career Coach</h2>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleReset}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-all"
                      title="Reset conversation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-all"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => (
                  <motion.div
                    key={`msg-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0.1 : 0 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
                        msg.role === "assistant"
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-surface border border-surface-border"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-text-muted" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-md"
                          : "glass-card text-text-primary rounded-tl-md"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="group relative pr-6">
                          <div className="chat-markdown prose prose-slate dark:prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            className="absolute top-0 -right-2 p-1.5 bg-surface/80 backdrop-blur-sm border border-surface-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20 hover:border-primary/30"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === i ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-xs text-text-muted">Thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="shrink-0 border-t border-surface-border bg-white dark:bg-background flex flex-col">
                
                {/* Quick Prompts */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-3 custom-scrollbar hide-scrollbar whitespace-nowrap">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-surface-border hover:bg-primary/10 hover:border-primary/30 rounded-full text-xs text-text-primary transition-all shadow-sm"
                    >
                      <span>{prompt.icon}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>

                <div className="px-4 pb-3 pt-2">
                  <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your career, resume, skills..."
                    disabled={isLoading}
                    className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:bg-surface/80 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="shrink-0 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:shadow-[0_0_16px_rgba(124,58,237,0.4)] disabled:opacity-30 disabled:hover:shadow-none active:scale-95 transition-all"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-text-faint text-center mt-2">
                  AI Career Coach • Personalized to your profile
                </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
