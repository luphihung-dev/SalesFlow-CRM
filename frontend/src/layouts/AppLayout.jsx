import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AppLayout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF9EA_0%,#F7F1DF_100%)] text-ink">
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar open={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
        <div className="min-w-0 flex-1 overflow-y-auto">
          <Topbar onMenuClick={() => setIsMobileNavOpen(true)} />
          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
