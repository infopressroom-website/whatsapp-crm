import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Send, CheckCheck, Eye, MessageSquare,
  Users, Clock, BarChart2, Target, Zap, ChevronDown, ArrowUpRight,
  AlertCircle, Calendar, Filter,
} from 'lucide-react';
import {
  stats, campaigns, dailyMetrics, hourlyMetrics,
  audienceMetrics, templateMetrics, weeklyData,
} from '@/data/mockData';

type Period = '7d' | '14d' | '30d';
type ChartMetric = 'sent' | 'delivered' | 'read' | 'replied' | 'failed';

const CHART_COLORS: Record<ChartMetric, string> = {
  sent: '#94a3b8',
  delivered: '#3b82f6',
  read: '#25D366',
  replied: '#f59e0b',
  failed: '#ef4444',
};

const METRIC_LABELS: Record<ChartMetric, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  replied: 'Replied',
  failed: 'Failed',
};

export default function Analytics() {
  const [period, setPeriod] = useState<Period>('7d');
  const [chartMetrics, setChartMetrics] = useState<ChartMetric[]>(['sent', 'read', 'replied']);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const periodDays = period === '7d' ? 7 : period === '14d' ? 14 : 30;
  const slicedDaily = useMemo(() => dailyMetrics.slice(-periodDays), [period]);

  // Compute KPIs for the selected period
  const kpi = useMemo(() => {
    const cur = slicedDaily;
    const prev = dailyMetrics.slice(-periodDays * 2, -periodDays);
    const sum = (arr: typeof dailyMetrics, key: keyof typeof dailyMetrics[0]) =>
      arr.reduce((a, b) => a + (b[key] as number), 0);
    const sent = sum(cur, 'sent');
    const delivered = sum(cur, 'delivered');
    const read = sum(cur, 'read');
    const replied = sum(cur, 'replied');
    const failed = sum(cur, 'failed');
    const newContacts = sum(cur, 'newContacts');
    const revenue = sum(cur, 'revenue');
    const pSent = sum(prev, 'sent') || 1;
    const pRead = sum(prev, 'read') || 1;
    const pReplied = sum(prev, 'replied') || 1;
    const pRevenue = sum(prev, 'revenue') || 1;
    return {
      sent, delivered, read, replied, failed, newContacts, revenue,
      deliveryRate: sent ? ((delivered / sent) * 100).toFixed(1) : '0',
      readRate: sent ? ((read / sent) * 100).toFixed(1) : '0',
      replyRate: sent ? ((replied / sent) * 100).toFixed(1) : '0',
      failRate: sent ? ((failed / sent) * 100).toFixed(1) : '0',
      sentChange: (((sent - pSent) / pSent) * 100).toFixed(1),
      readChange: (((read - pRead) / pRead) * 100).toFixed(1),
      repliedChange: (((replied - pReplied) / pReplied) * 100).toFixed(1),
      revenueChange: (((revenue - pRevenue) / pRevenue) * 100).toFixed(1),
    };
  }, [slicedDaily]);

  // Chart max
  const chartMax = useMemo(() => {
    const vals = slicedDaily.flatMap((d) => chartMetrics.map((m) => d[m as keyof typeof d] as number));
    return Math.max(...vals, 1);
  }, [slicedDaily, chartMetrics]);

  const toggleMetric = (m: ChartMetric) => {
    setChartMetrics((prev) =>
      prev.includes(m) ? (prev.length > 1 ? prev.filter((x) => x !== m) : prev) : [...prev, m]
    );
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'timing', label: 'Best Time', icon: Clock },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'templates', label: 'Templates', icon: Zap },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
  ];

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Analytics</h2>
          <p className="text-sm text-slate-400 mt-0.5">Deep insights into your messaging performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(['7d', '14d', '30d'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs font-semibold transition ${
                  period === p ? 'bg-whatsapp-500 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p === '7d' ? 'Last 7 days' : p === '14d' ? 'Last 14 days' : 'Last 30 days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section nav */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeSection === s.id
                  ? 'bg-whatsapp-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {s.label}
            </button>
          );
        })}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === 'overview' && (
        <div className="space-y-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label="Messages Sent"
              value={kpi.sent.toLocaleString()}
              sub={`${kpi.sentChange}% vs prev period`}
              trend={parseFloat(kpi.sentChange) >= 0 ? 'up' : 'down'}
              icon={Send}
              color="blue"
            />
            <KpiCard
              label="Delivery Rate"
              value={`${kpi.deliveryRate}%`}
              sub={`${kpi.delivered.toLocaleString()} delivered`}
              trend="up"
              icon={CheckCheck}
              color="whatsapp"
            />
            <KpiCard
              label="Read Rate"
              value={`${kpi.readRate}%`}
              sub={`${kpi.readChange}% vs prev period`}
              trend={parseFloat(kpi.readChange) >= 0 ? 'up' : 'down'}
              icon={Eye}
              color="amber"
            />
            <KpiCard
              label="Reply Rate"
              value={`${kpi.replyRate}%`}
              sub={`${kpi.replied.toLocaleString()} replies`}
              trend={parseFloat(kpi.repliedChange) >= 0 ? 'up' : 'down'}
              icon={MessageSquare}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="New Contacts" value={kpi.newContacts.toLocaleString()} sub="added this period" trend="up" icon={Users} color="teal" />
            <KpiCard label="Failed" value={kpi.failed.toLocaleString()} sub={`${kpi.failRate}% failure rate`} trend="down" icon={AlertCircle} color="rose" />
            <KpiCard label="Revenue Driven" value={`₹${(kpi.revenue / 1000).toFixed(0)}K`} sub={`${kpi.revenueChange}% vs prev period`} trend={parseFloat(kpi.revenueChange) >= 0 ? 'up' : 'down'} icon={TrendingUp} color="whatsapp" />
            <KpiCard label="Campaigns Run" value={campaigns.filter((c) => c.status === 'Sent').length.toString()} sub="total sent campaigns" trend="up" icon={Target} color="blue" />
          </div>

          {/* Engagement Funnel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Engagement Funnel</h3>
            <div className="space-y-3">
              {[
                { label: 'Sent', value: kpi.sent, pct: 100, color: 'bg-slate-400' },
                { label: 'Delivered', value: kpi.delivered, pct: kpi.sent ? (kpi.delivered / kpi.sent) * 100 : 0, color: 'bg-blue-500' },
                { label: 'Read', value: kpi.read, pct: kpi.sent ? (kpi.read / kpi.sent) * 100 : 0, color: 'bg-whatsapp-500' },
                { label: 'Replied', value: kpi.replied, pct: kpi.sent ? (kpi.replied / kpi.sent) * 100 : 0, color: 'bg-amber-500' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-20 shrink-0">{row.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-5 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${row.color}`}
                      style={{ width: `${row.pct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow">
                      {row.pct.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-14 text-right">{row.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRENDS ── */}
      {activeSection === 'trends' && (
        <div className="space-y-5">
          {/* Metric toggles */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <h3 className="font-semibold text-slate-800">Daily Performance Trends</h3>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CHART_COLORS) as ChartMetric[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleMetric(m)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                      chartMetrics.includes(m)
                        ? 'text-white border-transparent'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                    style={chartMetrics.includes(m) ? { backgroundColor: CHART_COLORS[m], borderColor: CHART_COLORS[m] } : {}}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[m] }} />
                    {METRIC_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-1 h-52 overflow-x-auto">
              {slicedDaily.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-[28px]">
                  <div className="flex items-end gap-0.5 h-40 w-full">
                    {chartMetrics.map((m) => (
                      <div
                        key={m}
                        className="flex-1 rounded-t transition-all duration-500"
                        style={{
                          height: `${((d[m as keyof typeof d] as number) / chartMax) * 100}%`,
                          backgroundColor: CHART_COLORS[m],
                          opacity: 0.85,
                        }}
                        title={`${METRIC_LABELS[m]}: ${d[m as keyof typeof d]}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 text-center leading-tight">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100">
              {chartMetrics.map((m) => (
                <div key={m} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[m] }} />
                  <span className="text-xs text-slate-500">{METRIC_LABELS[m]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Daily Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Date', 'Sent', 'Delivered', 'Read', 'Replied', 'Failed', 'Read Rate', 'New Contacts'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...slicedDaily].reverse().map((d) => (
                    <tr key={d.date} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="px-4 py-2.5 text-sm font-medium text-slate-700">{d.date}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">{d.sent.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-sm text-blue-600">{d.delivered.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-sm text-whatsapp-600">{d.read.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-sm text-amber-600">{d.replied.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-sm text-red-500">{d.failed}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-whatsapp-400 rounded-full" style={{ width: `${d.sent ? (d.read / d.sent) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{d.sent ? ((d.read / d.sent) * 100).toFixed(0) : 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-medium text-whatsapp-600 bg-whatsapp-50 px-2 py-0.5 rounded-full">+{d.newContacts}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TIMING ── */}
      {activeSection === 'timing' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-1">Best Time to Send</h3>
            <p className="text-xs text-slate-400 mb-5">Hourly read and reply rates — averaged across all campaigns</p>
            <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
              {hourlyMetrics.map((h) => {
                const readRate = h.sent ? (h.read / h.sent) * 100 : 0;
                const replyRate = h.sent ? (h.replied / h.sent) * 100 : 0;
                const maxSent = Math.max(...hourlyMetrics.map((x) => x.sent));
                const isTopHour = h.read === Math.max(...hourlyMetrics.map((x) => x.read));
                return (
                  <div key={h.hour} className="flex flex-col items-center gap-1 flex-1 min-w-[36px] group">
                    {isTopHour && (
                      <span className="text-[9px] font-bold text-whatsapp-600 bg-whatsapp-50 px-1 rounded whitespace-nowrap">Best</span>
                    )}
                    <div className="flex items-end gap-0.5 h-32 w-full">
                      <div
                        className="flex-1 bg-whatsapp-400 rounded-t opacity-80 group-hover:opacity-100 transition"
                        style={{ height: `${(h.sent / maxSent) * 100}%` }}
                        title={`Sent: ${h.sent}`}
                      />
                      <div
                        className="flex-1 bg-amber-400 rounded-t opacity-80 group-hover:opacity-100 transition"
                        style={{ height: `${(h.replied / maxSent) * 100 * 5}%` }}
                        title={`Replied: ${h.replied}`}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 leading-tight text-center">{h.hour}</span>
                    <span className="text-[9px] text-slate-500 font-medium">{readRate.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-whatsapp-400" /><span className="text-xs text-slate-500">Messages sent</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400" /><span className="text-xs text-slate-500">Replies</span></div>
            </div>
          </div>

          {/* Top 3 windows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { time: '4 PM – 7 PM', read: '78%', desc: 'Peak engagement window — customers active after work', icon: '🌆' },
              { time: '9 AM – 11 AM', read: '72%', desc: 'Strong morning window — high open rates before midday', icon: '🌅' },
              { time: '7 PM – 9 PM', read: '68%', desc: 'Evening scroll time — good for promotions and offers', icon: '🌙' },
            ].map((w) => (
              <div key={w.time} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-2xl mb-2">{w.icon}</div>
                <p className="font-semibold text-slate-800 text-sm">{w.time}</p>
                <p className="text-whatsapp-600 text-lg font-bold">{w.read} read rate</p>
                <p className="text-xs text-slate-400 mt-1">{w.desc}</p>
              </div>
            ))}
          </div>

          {/* Day of week heatmap */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Day-of-Week Performance</h3>
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((d) => {
                const readRate = d.sent ? (d.read / d.sent) * 100 : 0;
                const intensity = Math.floor((readRate / 100) * 9);
                const greens = ['bg-slate-100', 'bg-whatsapp-50', 'bg-whatsapp-100', 'bg-whatsapp-200', 'bg-whatsapp-300', 'bg-whatsapp-400', 'bg-whatsapp-500', 'bg-whatsapp-600', 'bg-whatsapp-700', 'bg-whatsapp-800'];
                const textColors = ['text-slate-400', 'text-slate-500', 'text-slate-600', 'text-slate-700', 'text-white', 'text-white', 'text-white', 'text-white', 'text-white', 'text-white'];
                return (
                  <div key={d.day} className={`${greens[intensity]} rounded-lg p-3 text-center`}>
                    <p className={`text-[10px] font-bold ${textColors[intensity]}`}>{d.day}</p>
                    <p className={`text-sm font-bold mt-1 ${textColors[intensity]}`}>{readRate.toFixed(0)}%</p>
                    <p className={`text-[10px] ${textColors[intensity]} opacity-80`}>{d.sent}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-3">Read rate % · Messages sent below</p>
          </div>
        </div>
      )}

      {/* ── AUDIENCE ── */}
      {activeSection === 'audience' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Audience comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Segment Performance</h3>
              <div className="space-y-4">
                {audienceMetrics.map((a) => (
                  <div key={a.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="text-sm font-medium text-slate-700">{a.name}</span>
                        <span className="text-xs text-slate-400">{a.count.toLocaleString()} contacts</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{a.readRate}% read</span>
                    </div>
                    <div className="flex gap-1 h-3">
                      <div className="rounded-l-full h-full" style={{ width: `${a.readRate}%`, backgroundColor: a.color, opacity: 0.7 }} />
                      <div className="rounded-r-full h-full bg-slate-100 flex-1" />
                    </div>
                    <div className="flex gap-4 text-[11px] text-slate-400">
                      <span>Sent: {a.sent.toLocaleString()}</span>
                      <span>Read: {a.read.toLocaleString()}</span>
                      <span>Replied: {a.replied.toLocaleString()} ({a.replyRate}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience donut-style breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Audience Size Distribution</h3>
              <div className="space-y-3">
                {audienceMetrics.map((a) => {
                  const pct = ((a.count / 1240) * 100);
                  return (
                    <div key={a.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700">{a.name}</span>
                          <span className="text-xs text-slate-400">{a.count.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: a.color }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">1,240</p>
                  <p className="text-xs text-slate-400">Total Contacts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-whatsapp-600">{stats.totalContacts - 210}</p>
                  <p className="text-xs text-slate-400">Opted In</p>
                </div>
              </div>
            </div>
          </div>

          {/* Best segments table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Segment Comparison Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {['Segment', 'Contacts', 'Sent', 'Delivery', 'Read Rate', 'Reply Rate', 'Best Metric'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {audienceMetrics.map((a) => {
                    const delivRate = a.sent ? ((a.delivered / a.sent) * 100).toFixed(1) : '—';
                    const best = a.replyRate > 22 ? 'Highest Reply' : a.readRate > 80 ? 'High Read' : a.count > 500 ? 'Largest' : 'Growing';
                    return (
                      <tr key={a.name} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                            <span className="text-sm font-medium text-slate-700">{a.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{a.count.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{a.sent.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-blue-600">{delivRate}%</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-whatsapp-400 rounded-full" style={{ width: `${a.readRate}%` }} />
                            </div>
                            <span className="text-sm text-whatsapp-600 font-semibold">{a.readRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-amber-600 font-semibold">{a.replyRate}%</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-whatsapp-50 text-whatsapp-700 font-medium">{best}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TEMPLATES ── */}
      {activeSection === 'templates' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{templateMetrics.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total Templates</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-whatsapp-600">{Math.max(...templateMetrics.map((t) => t.readRate)).toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-0.5">Highest Read Rate</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{Math.max(...templateMetrics.map((t) => t.replyRate)).toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-0.5">Highest Reply Rate</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Template Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {['Template', 'Category', 'Times Used', 'Total Sent', 'Read Rate', 'Reply Rate', 'Trend'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {templateMetrics.map((t) => (
                    <tr key={t.name} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{t.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          t.category === 'Marketing' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>{t.category}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{t.timesUsed}x</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{t.totalSent.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {t.readRate > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-whatsapp-400 rounded-full" style={{ width: `${t.readRate}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-whatsapp-600">{t.readRate}%</span>
                          </div>
                        ) : <span className="text-xs text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-amber-600">
                        {t.replyRate > 0 ? `${t.replyRate}%` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {t.trend === 'up' && <div className="flex items-center gap-1 text-whatsapp-600"><TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Up</span></div>}
                        {t.trend === 'down' && <div className="flex items-center gap-1 text-red-500"><TrendingDown className="w-4 h-4" /><span className="text-xs font-medium">Down</span></div>}
                        {t.trend === 'flat' && <div className="flex items-center gap-1 text-slate-400"><span className="text-sm">—</span><span className="text-xs font-medium">Flat</span></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Read rate visual bars */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Read Rate by Template</h3>
            <div className="space-y-3">
              {templateMetrics.filter((t) => t.totalSent > 0).sort((a, b) => b.readRate - a.readRate).map((t, i) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-4 text-right">{i + 1}</span>
                  <span className="text-sm text-slate-700 w-36 truncate">{t.name}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-whatsapp-400 to-whatsapp-600 rounded-full transition-all duration-700"
                      style={{ width: `${t.readRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-whatsapp-600 w-10 text-right">{t.readRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CAMPAIGNS ── */}
      {activeSection === 'campaigns' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Campaign Performance</h3>
              <span className="text-xs text-slate-400">{campaigns.filter((c) => c.status === 'Sent' || c.status === 'Sending').length} campaigns</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {['Campaign', 'Status', 'Recipients', 'Delivered', 'Read', 'Replied', 'Failed', 'Read Rate'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.filter((c) => c.status === 'Sent' || c.status === 'Sending').map((c) => {
                    const delivPct = c.recipients ? ((c.delivered / c.recipients) * 100) : 0;
                    const readPct = c.recipients ? ((c.read / c.recipients) * 100) : 0;
                    const replyPct = c.delivered ? ((c.replied / c.delivered) * 100) : 0;
                    return (
                      <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-slate-700">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.sentAt}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                            c.status === 'Sent' ? 'bg-whatsapp-50 text-whatsapp-700' : 'bg-blue-50 text-blue-700'
                          }`}>{c.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{c.recipients.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-blue-600">{c.delivered.toLocaleString()} <span className="text-slate-400 text-xs">({delivPct.toFixed(0)}%)</span></td>
                        <td className="px-4 py-3 text-sm text-whatsapp-600">{c.read.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-amber-600">{c.replied} <span className="text-slate-400 text-xs">({replyPct.toFixed(0)}%)</span></td>
                        <td className="px-4 py-3 text-sm text-red-500">{c.failed}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-whatsapp-400 rounded-full" style={{ width: `${readPct}%` }} />
                            </div>
                            <span className="text-sm font-bold text-whatsapp-600">{readPct.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top campaign spotlight */}
          {(() => {
            const top = [...campaigns.filter((c) => c.recipients > 0)].sort((a, b) =>
              (b.read / b.recipients) - (a.read / a.recipients)
            )[0];
            if (!top) return null;
            return (
              <div className="bg-gradient-to-br from-whatsapp-500 to-whatsapp-700 rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold opacity-90">Top Performing Campaign</span>
                </div>
                <h3 className="text-xl font-bold">{top.name}</h3>
                <p className="text-sm opacity-75 mt-0.5">{top.audience} · {top.sentAt}</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { label: 'Read Rate', val: `${top.recipients ? ((top.read / top.recipients) * 100).toFixed(1) : 0}%` },
                    { label: 'Replied', val: top.replied.toLocaleString() },
                    { label: 'Delivered', val: `${top.recipients ? ((top.delivered / top.recipients) * 100).toFixed(1) : 0}%` },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-xl font-bold">{s.val}</p>
                      <p className="text-xs opacity-70">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───

interface KpiCardProps {
  label: string; value: string; sub: string; trend: 'up' | 'down';
  icon: React.ElementType; color: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  whatsapp: 'bg-whatsapp-50 text-whatsapp-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  teal: 'bg-teal-50 text-teal-600',
  rose: 'bg-rose-50 text-rose-600',
};

function KpiCard({ label, value, sub, trend, icon: Icon, color }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_MAP[color] ?? 'bg-slate-100 text-slate-600'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${trend === 'up' ? 'text-whatsapp-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        </div>
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      <p className="text-[10px] text-slate-300 mt-1">{sub}</p>
    </div>
  );
}
