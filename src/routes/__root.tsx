import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SpotlightCursor } from "@/components/ui/SpotlightCursor";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        {/* Global ambient cursor glow effect */}
        <SpotlightCursor />

        <Outlet />

        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#0C0718",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#F5F0FF",
              borderRadius: "12px",
              boxShadow: "0 0 30px rgba(124,58,237,0.15)",
            },
          }}
        />
        {/* {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />} */}
      </QueryProvider>
    </ThemeProvider>
  );
}
