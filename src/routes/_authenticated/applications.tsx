import { createFileRoute } from "@tanstack/react-router";
import { RevealText } from "@/components/ui/RevealText";

export const Route = createFileRoute("/_authenticated/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const stages = ["Applied", "Screening", "Interview", "Offer"];

  return (
    <div className="p-6 lg:p-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-300 dark:border-white/20/10 pb-12">
        <RevealText className="text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-4 block">
          Module // Application Tracker
        </RevealText>
        <RevealText as="h1" className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
          Active <br /> Pipelines
        </RevealText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div key={stage} className="border border-slate-300 dark:border-white/20/10 p-6 min-h-[500px]">
            <h2 className="text-sm font-display font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6 border-b border-slate-300 dark:border-white/20/10 pb-4">
              {stage}
            </h2>
            {/* Placeholder for Kanban Cards */}
            <div className="border border-dashed border-slate-200 dark:border-white/10 p-4 text-center">
              <span className="text-[10px] font-display uppercase tracking-widest text-slate-400 dark:text-white/30">Drop Zone</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
