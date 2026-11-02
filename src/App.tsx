import { useState, useEffect } from 'react';
import Sidebar, { type ViewName } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dashboard from '@/components/views/Dashboard';
import Campaigns from '@/components/views/Campaigns';
import CreateCampaign from '@/components/views/CreateCampaign';
import Contacts from '@/components/views/Contacts';
import Templates from '@/components/views/Templates';
import Analytics from '@/components/views/Analytics';
import LiveChat from '@/components/views/LiveChat';
import Automation from '@/components/views/Automation';
import TeamAccess from '@/components/views/TeamAccess';
import Settings from '@/components/views/Settings';
import Catalog from '@/components/views/Catalog';
import Integrations from '@/components/views/Integrations';
import WhatsAppLink from '@/components/views/WhatsAppLink';
import AuthPage, { type DemoUser } from '@/components/views/AuthPage';

const SESSION_KEY = 'wa-demo-session';

const demoUserFallback: DemoUser = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  email: 'demo@whatsappbusiness.app',
  name: 'Riya Sharma',
};

const viewMeta: Record<ViewName, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your campaign overview at a glance' },
  inbox: { title: 'Live Chat', subtitle: 'Reply to customers in real-time with your team' },
  analytics: { title: 'Analytics', subtitle: 'Deep dive into your campaign performance' },
  campaigns: { title: 'Campaigns', subtitle: 'Manage and track all your WhatsApp campaigns' },
  create: { title: 'New Campaign', subtitle: 'Create a new campaign in 4 easy steps' },
  templates: { title: 'Templates', subtitle: 'Pre-approved message templates' },
  contacts: { title: 'Contacts', subtitle: 'Your customer contact list and tags' },
  automation: { title: 'Automation Flows', subtitle: 'Set up automatic messages based on triggers' },
  team: { title: 'Team & Access', subtitle: 'Manage team members and their permissions' },
  settings: { title: 'Settings', subtitle: 'Configure your WhatsApp number and business profile' },
  catalog: { title: 'Product Catalog', subtitle: 'Showcase products inside WhatsApp chats' },
  integrations: { title: 'Integrations', subtitle: 'Connect your favorite tools and platforms' },
  walink: { title: 'WhatsApp Links', subtitle: 'Create click-to-chat links and QR codes' },
};

function loadSession(): DemoUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoUser;
    if (parsed?.id && parsed?.email && parsed?.name) return parsed;
  } catch { /* ignore */ }
  return null;
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

export default function App() {
  const [user, setUser] = useState<DemoUser | null>(loadSession);
  const [view, setView] = useState<ViewName>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Reset to the dashboard whenever a fresh login happens.
  useEffect(() => {
    if (user) setView('dashboard');
  }, [user?.id]);

  const navigate = (nextView: ViewName) => {
    setView(nextView);
    setMobileNavOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  const meta = viewMeta[view];
  const isFullHeight = view === 'inbox';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar current={view} onNavigate={navigate} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} onOpenMobile={() => setMobileNavOpen(true)} user={user} onLogout={handleLogout} />
        <main className={`flex-1 overflow-y-auto scrollbar-thin ${isFullHeight ? 'p-2 sm:p-4' : 'p-4 sm:p-6'}`}>
          {view === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {view === 'inbox' && <LiveChat />}
          {view === 'analytics' && <Analytics />}
          {view === 'campaigns' && <Campaigns onNew={() => navigate('create')} />}
          {view === 'create' && <CreateCampaign onCancel={() => navigate('dashboard')} />}
          {view === 'templates' && <Templates />}
          {view === 'contacts' && <Contacts />}
          {view === 'automation' && <Automation />}
          {view === 'team' && <TeamAccess />}
          {view === 'settings' && <Settings />}
          {view === 'catalog' && <Catalog />}
          {view === 'integrations' && <Integrations />}
          {view === 'walink' && <WhatsAppLink />}
        </main>
      </div>
    </div>
  );
}
