import {
  LayoutDashboard, Send, Users, FileText, BarChart3, MessageCircle, X,
  Inbox, Bot, UserCog, Settings as SettingsIcon, MessageSquare,
  ShoppingBag, Plug, Link2,
} from 'lucide-react';

export type ViewName =
  | 'dashboard' | 'campaigns' | 'create' | 'contacts'
  | 'templates' | 'analytics' | 'inbox' | 'automation'
  | 'team' | 'settings' | 'catalog' | 'integrations' | 'walink';

interface SidebarProps {
  current: ViewName;
  onNavigate: (view: ViewName) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  label: string;
  items: { id: ViewName; label: string; icon: typeof LayoutDashboard; badge?: number }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'inbox', label: 'Live Chat', icon: Inbox, badge: 3 },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Campaigns',
    items: [
      { id: 'campaigns', label: 'All Campaigns', icon: Send },
      { id: 'create', label: 'New Campaign', icon: MessageSquare },
      { id: 'templates', label: 'Templates', icon: FileText },
      { id: 'contacts', label: 'Contacts', icon: Users },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag },
      { id: 'walink', label: 'WhatsApp Links', icon: Link2 },
    ],
  },
  {
    label: 'Automation',
    items: [
      { id: 'automation', label: 'Flow Builder', icon: Bot },
      { id: 'integrations', label: 'Integrations', icon: Plug },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'team', label: 'Team & Access', icon: UserCog },
      { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
];

export default function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-whatsapp-500 flex items-center justify-center shadow-sm">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-none">WhatsWave</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Campaign Manager</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = current === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-whatsapp-50 text-whatsapp-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-whatsapp-600' : 'text-slate-400'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-whatsapp-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 p-4 text-white">
            <p className="text-sm font-semibold">Growth Plan</p>
            <p className="text-xs text-whatsapp-50/90 mt-1">620 of 1,000 msgs used</p>
            <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-[62%] bg-white rounded-full" />
            </div>
            <button className="mt-3 w-full bg-white text-whatsapp-700 text-xs font-semibold py-1.5 rounded-lg hover:bg-whatsapp-50 transition">
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
