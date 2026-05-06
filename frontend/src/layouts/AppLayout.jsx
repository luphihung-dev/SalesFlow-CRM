import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,111,74,0.20),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(110,139,61,0.18),transparent_32%)]" />
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar />
        <div className="min-w-0 flex-1 overflow-y-auto">
          <Topbar />
          <main className="px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
