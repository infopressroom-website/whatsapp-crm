import { useState } from 'react';
import { Search, Send, Plus, MoreVertical, CheckCheck, Eye, MessageSquareReply, Trash2, Copy, Calendar, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Campaign, type CampaignStatus } from '@/data/mockData';
import { useCampaigns } from '@/lib/hooks';

interface CampaignsProps {
  onNew: () => void;
}

const statusStyles: Record<CampaignStatus, string> = {
  Sent: 'bg-whatsapp-100 text-whatsapp-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Draft: 'bg-slate-100 text-slate-500',
  Sending: 'bg-amber-100 text-amber-700',
};

const filters: (CampaignStatus | 'All')[] = ['All', 'Sent', 'Scheduled', 'Sending', 'Draft'];

export default function Campaigns({ onNew }: CampaignsProps) {
  const { list: campaigns, deleteCampaign } = useCampaigns();
  const [filter, setFilter] = useState<CampaignStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [calMonth, setCalMonth] = useState(new Date(2026, 9)); // October 2026

  const filtered = campaigns.filter((c) => {
    const matchFilter = filter === 'All' || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {viewMode === 'grid' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
              />
            </div>
          )}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-whatsapp-50 text-whatsapp-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition ${viewMode === 'calendar' ? 'bg-whatsapp-50 text-whatsapp-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={onNew}
          className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === f
                ? 'bg-whatsapp-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const deliveryPct = c.recipients ? Math.round((c.delivered / c.recipients) * 100) : 0;
          const readPct = c.delivered ? Math.round((c.read / c.delivered) * 100) : 0;
          const replyPct = c.delivered ? Math.round((c.replied / c.delivered) * 100) : 0;
          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-whatsapp-50 text-whatsapp-600 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.template}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenu === c.id && (
                    <div className="absolute right-0 top-8 z-10 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </button>
                      <button onClick={() => { deleteCampaign(c.id); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${statusStyles[c.status]}`}>
                  {c.status}
                </span>
                <span className="text-xs text-slate-400">{c.audience} · {c.recipients} recipients</span>
              </div>

              {c.status === 'Sent' || c.status === 'Sending' ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Stat icon={CheckCheck} label="Delivered" value={`${deliveryPct}%`} color="text-whatsapp-600" />
                    <Stat icon={Eye} label="Read" value={`${readPct}%`} color="text-blue-500" />
                    <Stat icon={MessageSquareReply} label="Replied" value={`${replyPct}%`} color="text-amber-500" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">Sent: {c.sentAt}</p>
                </>
              ) : (
                <p className="text-[11px] text-slate-400 mt-4">
                  {c.status === 'Scheduled' ? `Scheduled: ${c.sentAt}` : 'Not sent yet'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && viewMode === 'grid' && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Send className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-400 mt-4">No campaigns found</p>
        </div>
      )}
    </div>
  );
}

function CampaignCalendar({ month, onPrev, onNext, campaigns }: { month: Date; onPrev: () => void; onNext: () => void; campaigns: Campaign[] }) {
  const year = month.getFullYear();
  const monthName = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate();
  const today = new Date(2026, 9, 17); // mock today

  // Map campaigns to dates
  const campaignDates: Record<number, typeof campaigns> = {};
  campaigns.forEach((c) => {
    if (c.status === 'Scheduled' || c.status === 'Sent' || c.status === 'Sending') {
      const dayMatch = c.sentAt.match(/(\d+),/);
      if (dayMatch) {
        const day = parseInt(dayMatch[1]);
        if (!campaignDates[day]) campaignDates[day] = [];
        campaignDates[day].push(c);
      }
    }
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">{monthName}</h3>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={onNext} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((w) => (
          <div key={w} className="text-center text-[10px] font-semibold text-slate-400 uppercase py-2">{w}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="aspect-square" />;
          const dayCampaigns = campaignDates[day] || [];
          const isToday = day === today.getDate() && month.getMonth() === today.getMonth();
          return (
            <div
              key={i}
              className={`aspect-square border rounded-lg p-1.5 overflow-hidden transition ${
                isToday ? 'border-whatsapp-500 bg-whatsapp-50/30' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-whatsapp-600' : 'text-slate-500'}`}>{day}</span>
              <div className="mt-1 space-y-0.5">
                {dayCampaigns.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium ${
                      c.status === 'Sent' ? 'bg-whatsapp-100 text-whatsapp-700' :
                      c.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {c.name}
                  </div>
                ))}
                {dayCampaigns.length > 2 && (
                  <p className="text-[9px] text-slate-400 px-1.5">+{dayCampaigns.length - 2} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-50">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400"><span className="w-2.5 h-2.5 rounded bg-whatsapp-200" /> Sent</span>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400"><span className="w-2.5 h-2.5 rounded bg-blue-200" /> Scheduled</span>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400"><span className="w-2.5 h-2.5 rounded bg-amber-200" /> Sending</span>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof Send; label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-2.5 text-center">
      <Icon className={`w-4 h-4 mx-auto ${color}`} />
      <p className="text-sm font-bold text-slate-700 mt-1">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
