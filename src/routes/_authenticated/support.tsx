import { createFileRoute } from "@tanstack/react-router";
import { RevealText } from "@/components/ui/RevealText";

export const Route = createFileRoute("/_authenticated/support")({
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="p-6 lg:p-12 space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-300 dark:border-white/20/10 pb-12">
        <RevealText className="text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-4 block">
          Module // Support
        </RevealText>
        <RevealText as="h1" className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
          Help <br /> Center
        </RevealText>
      </div>

      <div className="space-y-6">
        <div className="border border-slate-300 dark:border-white/20/10 p-8">
          <h2 className="text-lg font-display font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-8">
            Submit Support Ticket
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">Issue Type</label>
              <select className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-300 dark:border-white/20 rounded-none">
                <option className="bg-[#F8F9FA]">Account Access</option>
                <option className="bg-[#F8F9FA]">Resume Parsing Error</option>
                <option className="bg-[#F8F9FA]">Feature Request</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">Description Log</label>
              <textarea 
                className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-3 text-slate-900 dark:text-white placeholder:text-slate-300 dark:text-white/20 focus:outline-none focus:border-slate-300 dark:border-white/20 rounded-none min-h-[100px]"
                placeholder="DESCRIBE THE ANOMALY..."
              />
            </div>
            <button type="submit" className="w-full py-4 bg-[#111827] text-slate-900 dark:text-white text-xs font-display font-bold uppercase tracking-widest hover:bg-[#111827]/90 transition-colors">
              Transmit Query
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
