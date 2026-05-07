import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF9EA_0%,#F7F1DF_100%)] text-ink">
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
