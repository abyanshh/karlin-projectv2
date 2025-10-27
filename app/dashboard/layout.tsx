import { ThemeProvider } from "@/components/theme-providers";
import DashboardShell from "@/layout/dashboard-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  );
}
