export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen overflow-auto">{children}</div>
  );
}
