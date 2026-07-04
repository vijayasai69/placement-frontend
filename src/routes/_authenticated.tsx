import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuthStore } from "@/features/authentication/store/auth-store";
import { getSession } from "@/features/authentication/services/auth-service";
import { getResumeHistory } from "@/features/resume/services/resume-service";
import { useActiveProfile } from "@/store/useActiveProfile";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();

  // Only show loading if there's no persisted user yet
  const [loading, setLoading] = useState(!isAuthenticated);

  useEffect(() => {
    // Always verify with backend to ensure session is still valid
    getSession()
      .then((res) => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
          
          // If the user has no active profile in local storage, fetch their history and set the latest one automatically
          if (!useActiveProfile.getState().activeProfileId) {
            getResumeHistory()
              .then(histRes => {
                if (histRes.data && histRes.data.data && histRes.data.data.length > 0) {
                  useActiveProfile.getState().setActiveProfileId(histRes.data.data[0].id);
                }
              })
              .catch(err => console.error("Failed to fetch resume history on login", err));
          }
        } else {
          clearUser();
          void navigate({ to: "/auth", replace: true });
        }
      })
      .catch(() => {
        clearUser();
        void navigate({ to: "/auth", replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: "var(--accent-blue)" }} />
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>
            Syncing Session Matrix...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
