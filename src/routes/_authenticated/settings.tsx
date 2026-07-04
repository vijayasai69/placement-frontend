import { createFileRoute } from "@tanstack/react-router";
import { Settings, Shield, Bell, Key, Trash2, Loader2 } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";
import { useMutation } from "@tanstack/react-query";
import { resetUserData } from "@/features/resume/services/resume-service";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await resetUserData();
      return response.data;
    },
    onSuccess: () => {
      // Clear profile ID from storage if it exists
      localStorage.removeItem("activeProfileId");
      // Force reload to dashboard which will re-evaluate profile existence
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      console.error("Failed to reset account data", err);
      alert("Failed to reset account data. Please try again.");
    }
  });

  const handleReset = () => {
    if (confirm("Are you sure? This will permanently delete your resume, candidate profile, and all job recommendations. You will need to upload a new resume to use the system.")) {
      resetMutation.mutate();
    }
  };

  return (
    <div className="p-6 lg:p-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-300 dark:border-white/20 pb-12">
        <RevealText className="text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-4 block">
          Module // Configuration
        </RevealText>
        <RevealText as="h1" className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
          System <br /> Settings
        </RevealText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Nav Sidebar */}
        <div className="space-y-2">
          {[
            { icon: Settings, label: "General Config" },
            { icon: Shield, label: "Privacy Vectors" },
            { icon: Bell, label: "Alert Matrices" },
            { icon: Key, label: "Access Control" },
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-4 w-full p-4 border text-left transition-colors ${i === 0 ? "border-slate-300 dark:border-white/20 bg-[#111827] text-slate-900 dark:text-white" : "border-transparent text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"}`}>
              <item.icon className="h-4 w-4" />
              <span className="text-xs font-display font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-12">
          
          <section className="space-y-8 border border-slate-300 dark:border-white/20 p-8">
            <h2 className="text-lg font-display font-bold uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-300 dark:border-white/20 pb-4">
              System Appearance
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-display uppercase tracking-widest text-slate-600 dark:text-white/70">UI Theme Lock (Dark)</span>
                <input type="checkbox" checked disabled className="accent-white" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-display uppercase tracking-widest text-slate-600 dark:text-white/70">High Contrast Mode</span>
                <input type="checkbox" className="accent-white" />
              </label>
            </div>
          </section>

          <section className="space-y-8 border border-slate-300 dark:border-white/20 p-8">
            <h2 className="text-lg font-display font-bold uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-300 dark:border-white/20 pb-4">
              Notification Routing
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-display uppercase tracking-widest text-slate-600 dark:text-white/70">Email Digest (Daily)</span>
                <input type="checkbox" defaultChecked className="accent-white" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-display uppercase tracking-widest text-slate-600 dark:text-white/70">Push Alerts (Matches &gt; 80%)</span>
                <input type="checkbox" defaultChecked className="accent-white" />
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-8 border border-rose-500/30 bg-rose-500/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
            <h2 className="text-lg font-display font-bold uppercase tracking-widest text-rose-500 border-b border-rose-500/20 pb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Resume & Reset Data</h3>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1 max-w-md">
                    Permanently delete your uploaded resume, AI candidate profile, and all personalized job recommendations. This action cannot be undone.
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  disabled={resetMutation.isPending}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-display font-bold uppercase tracking-widest transition-colors flex items-center gap-2 justify-center min-w-[160px] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>
                  ) : (
                    <><Trash2 className="w-4 h-4" /> Reset Account</>
                  )}
                </button>
              </div>
            </div>
          </section>

          <button className="px-8 py-4 bg-[#111827] text-slate-900 dark:text-white text-xs font-display font-bold uppercase tracking-widest hover:bg-[#111827]/90 transition-colors">
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  );
}
