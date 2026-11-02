import { useState, useEffect } from 'react';
import { Send, CheckCheck, MessageSquareReply, Users, ArrowUpRight, Calendar, Clock, Inbox, Bot, UserCog, ChevronRight, Check, Rocket, Activity, MessageSquare, RefreshCw } from 'lucide-react';
import { stats, weeklyData, campaigns, onboardingSteps, liveUsers, type LiveUser } from '@/data/mockData';
import type { ViewName } from '@/components/Sidebar';

export default function Dashboard({ onNavigate }: { onNavigate: (v: ViewName) => void }) {
  const maxSent = Math.max(...weeklyData.map((d) => d.sent));
  const recent = campaigns.slice(0, 4);
  const completedSteps = onboardingSteps.filter((s) => s.done).length;
  const totalSteps = onboardingSteps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  // Live activity pulse
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 8000);
    return () => clearInterval(id);
  }, []);
  const onlineCount = liveUsers.filter((u) => u.status === 'Online').length;

  const statCards = [
    { label: 'Messages Sent', value: stats.totalSent.toLocaleString(), icon: Send, change: '+12%', color: 'whatsapp' },
    { label: 'Delivery Rate', value: `${stats.deliveryRate}%`, icon: CheckCheck, change: '+0.4%', color: 'blue' },
    { label: 'Reply Rate', value: `${stats.replyRate}%`, icon: MessageSquareReply, change: '+2.1%', color: 'amber' },
    { label: 'Total Contacts', value: stats.totalContacts.toLocaleString(), icon: Users, change: '+38', color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    whatsapp: 'bg-whatsapp-50 text-whatsapp-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative">
          <h2 className="text-xl font-bold">Welcome back, Riya! 👋</h2>
          <p className="text-whatsapp-50/90 text-sm mt-1">Your campaigns are performing well. 3 campaigns are active right now.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => onNavigate('create')}
              className="bg-white text-whatsapp-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-whatsapp-50 transition"
            >
              + New Campaign
            </button>
            <button
              onClick={() => onNavigate('inbox')}
              className="bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/25 transition backdrop-blur"
            >
              Open Live Chat
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[s.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-whatsapp-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-3">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Weekly Performance</h3>
              <p className="text-xs text-slate-400">Messages sent vs read this week</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-whatsapp-500" /> Sent
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-whatsapp-200" /> Read
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-48">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1 justify-end h-full">
                  <div
                    className="w-full max-w-[36px] bg-whatsapp-500 rounded-t-md transition-all hover:bg-whatsapp-600"
                    style={{ height: `${(d.sent / maxSent) * 100}%` }}
                    title={`${d.sent} sent`}
                  />
                  <div
                    className="w-full max-w-[36px] bg-whatsapp-200 rounded-t-md transition-all"
                    style={{ height: `${(d.read / maxSent) * 100}%` }}
                    title={`${d.read} read`}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding checklist */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-5 h-5 text-whatsapp-600" />
            <h3 className="font-semibold text-slate-800">Getting Started</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">{completedSteps} of {totalSteps} steps completed</p>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-whatsapp-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="space-y-1.5">
            {onboardingSteps.map((s) => (
              <button
                key={s.id}
                onClick={() => onNavigate(s.route as ViewName)}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition text-left"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.done ? 'bg-whatsapp-500 text-white' : 'border-2 border-slate-200'}`}>
                  {s.done && <Check className="w-3 h-3" />}
                </div>
                <span className={`text-xs ${s.done ? 'text-slate-400 line-through' : 'text-slate-600 font-medium'}`}>{s.label}</span>
                {!s.done && <ChevronRight className="w-3 h-3 text-slate-300 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming campaigns + Quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Upcoming Campaigns</h3>
          <p className="text-xs text-slate-400 mb-4">Scheduled and sending now</p>
          <div className="space-y-3">
            {campaigns.filter((c) => c.status === 'Scheduled' || c.status === 'Sending').map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-9 h-9 rounded-lg bg-whatsapp-100 text-whatsapp-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {c.sentAt}
                  </p>
                  <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    c.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
            {campaigns.filter((c) => c.status === 'Scheduled' || c.status === 'Sending').length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No scheduled campaigns</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <QuickAction icon={Inbox} label="Live Chat" desc="3 unread conversations" onClick={() => onNavigate('inbox')} />
            <QuickAction icon={Bot} label="Automation" desc="4 active flows" onClick={() => onNavigate('automation')} />
            <QuickAction icon={UserCog} label="Team & Access" desc={`${stats.teamMembers} members`} onClick={() => onNavigate('team')} />
          </div>
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Recent Campaigns</h3>
          <button onClick={() => onNavigate('campaigns')} className="text-sm text-whatsapp-600 font-medium hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-2">
          {recent.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.recipients} recipients · {c.template}</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Live Team Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-whatsapp-600" />
            <h3 className="font-semibold text-slate-800">Live Team Activity</h3>
            <div className="flex items-center gap-1.5 bg-whatsapp-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-whatsapp-500 animate-pulse" />
              <span className="text-xs font-semibold text-whatsapp-700">{onlineCount} online</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('team')}
            className="text-sm text-whatsapp-600 font-medium hover:underline flex items-center gap-1"
          >
            Manage team <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {liveUsers.map((u) => (
            <LiveUserRow key={u.id} user={u} tick={tick} />
          ))}
        </div>

        {/* Activity summary bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-slate-800">{liveUsers.reduce((a, b) => a + b.assignedChats, 0)}</p>
            <p className="text-xs text-slate-400">Open chats</p>
          </div>
          <div>
            <p className="text-lg font-bold text-whatsapp-600">{liveUsers.reduce((a, b) => a + b.resolvedToday, 0)}</p>
            <p className="text-xs text-slate-400">Resolved today</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">{liveUsers.reduce((a, b) => a + b.sentToday, 0)}</p>
            <p className="text-xs text-slate-400">Messages sent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveUserRow({ user, tick }: { user: LiveUser; tick: number }) {
  const dotColor = user.status === 'Online' ? 'bg-whatsapp-500' : user.status === 'Away' ? 'bg-amber-400' : 'bg-slate-300';
  const actions = user.status === 'Online'
    ? ['Viewing Analytics', 'Replying to customer', 'Live Chat — Rahul Sharma', 'Viewing Dashboard', 'In Contacts']
    : null;
  const liveAction = user.status === 'Online' && actions ? actions[tick % actions.length] : user.currentAction;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition">
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-sm font-bold">
          {user.avatar}
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${dotColor} ${user.status === 'Online' ? 'animate-pulse' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-slate-700">{user.name}</p>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{user.role}</span>
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
          {user.status === 'Online' && <span className="w-1.5 h-1.5 rounded-full bg-whatsapp-400 shrink-0" />}
          {liveAction}
        </p>
      </div>
      <div className="text-right shrink-0">
        {user.assignedChats > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500 justify-end">
            <MessageSquare className="w-3 h-3" />
            <span>{user.assignedChats}</span>
          </div>
        )}
        <p className="text-[10px] text-slate-300 mt-0.5">{user.lastSeen === 'now' ? 'now' : user.lastSeen}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, desc, onClick }: { icon: typeof Send; label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-md hover:border-whatsapp-200 transition text-left group"
    >
      <div className="w-11 h-11 rounded-lg bg-whatsapp-50 text-whatsapp-600 flex items-center justify-center shrink-0 group-hover:bg-whatsapp-100 transition">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-whatsapp-500 transition" />
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Sent: 'bg-whatsapp-100 text-whatsapp-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Draft: 'bg-slate-100 text-slate-500',
    Sending: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${styles[status]}`}>
      {status}
    </span>
  );
}
