import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { BookOpen, Calendar, User } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  const posts = [
    { title: "How AI is Reshaping the Technical Interview Process", category: "AI & Tech", date: "June 15, 2026", author: "Sarah Jenkins" },
    { title: "7 Resume Keywords That Trigger ATS Filters in 2026", category: "Career Advice", date: "June 10, 2026", author: "Mark Donahue" },
    { title: "Transitioning from Web2 to Web3: A Complete Guide", category: "Industry Trends", date: "June 05, 2026", author: "Alex Rivera" },
    { title: "The Rise of Soft Skills: What Algorithms Look For", category: "Insights", date: "June 18, 2026", author: "Elena Rostova" },
    { title: "Negotiating Salary in a Remote-First World", category: "Career Advice", date: "June 25, 2026", author: "David Chen" },
    { title: "Understanding Predictive Career Pathways", category: "Product", date: "July 2, 2026", author: "Sarah Jenkins" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16 flex-1">
        {/* Header */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            <BookOpen className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Insights & Articles
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 font-light leading-relaxed">
            Stay ahead of the curve with our latest research, career strategies, and platform updates.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={i} className="glass-card flex flex-col overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-colors">
              <div className="h-48 bg-slate-800/50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-500"></div>
                 <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-white/90">
                   {post.category}
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3"/> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3"/> {post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
