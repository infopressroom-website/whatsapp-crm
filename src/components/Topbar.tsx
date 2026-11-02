import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle: string;
  onOpenMobile: () => void;
  user?: { email: string; name: string } | null;
  onLogout?: () => void;
}

export default function Topbar({ title, subtitle, onOpenMobile, user, onLogout }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? 'RS';
  const displayName = user?.name ?? 'Riya Store';

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobile} className="lg:hidden text-slate-500 hover:text-slate-700">
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">{title}</h1>
            <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-56">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg pl-2 pr-1 py-1 transition"
            >
              <div className="w-8 h-8 rounded-full bg-whatsapp-500 flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-none">{displayName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{user?.email ?? 'Owner'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-52">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-700">{displayName}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onLogout?.(); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
