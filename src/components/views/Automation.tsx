import { useState } from 'react';
import {
  Plus, Zap, Bot, Clock, ShoppingCart, PackageCheck, MessageSquare,
  UserPlus, MoreVertical, Play, Pause, Trash2, Pencil, X, Check,
  ArrowRight, ChevronDown, Sparkles,
} from 'lucide-react';
import {
  triggerOptions,
  type AutomationFlow, type FlowStatus, type FlowTrigger,
} from '@/data/mockData';
import { useAutomationFlows } from '@/lib/hooks';

const triggerIcons: Record<string, typeof Zap> = {
  UserPlus: UserPlus,
  ShoppingCart: ShoppingCart,
  PackageCheck: PackageCheck,
  MessageSquare: MessageSquare,
  Clock: Clock,
};

const statusConfig: Record<FlowStatus, { color: string; bg: string; label: string }> = {
  Active: { color: 'text-whatsapp-600', bg: 'bg-whatsapp-100', label: 'Active' },
  Paused: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Paused' },
  Draft: { color: 'text-slate-500', bg: 'bg-slate-100', label: 'Draft' },
};

export default function Automation() {
  const { list: flows, toggleFlow, deleteFlow, createFlow } = useAutomationFlows();
  const [statusFilter, setStatusFilter] = useState<FlowStatus | 'All'>('All');
  const [triggerFilter, setTriggerFilter] = useState<FlowTrigger | 'All'>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Create form state
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<FlowTrigger>('New Customer');
  const [message, setMessage] = useState('');
  const [delay, setDelay] = useState('Immediately');
  const [created, setCreated] = useState(false);

  const activeCount = flows.filter((f) => f.status === 'Active').length;
  const totalEnrolled = flows.reduce((s, f) => s + f.enrolled, 0);
  const avgConversion = flows.filter((f) => f.conversionRate > 0).length
    ? Math.round(flows.filter((f) => f.conversionRate > 0).reduce((s, f) => s + f.conversionRate, 0) / flows.filter((f) => f.conversionRate > 0).length)
    : 0;

  const toggleStatus = (id: string) => {
    toggleFlow(id, flows.find((f) => f.id === id)?.status ?? 'Active');
    setOpenMenu(null);
  };

  const handleDelete = (id: string) => {
    deleteFlow(id);
    setOpenMenu(null);
  };

  const handleCreate = async () => {
    if (!name.trim() || !message.trim()) return;
    const detail = triggerOptions.find((t) => t.trigger === trigger)?.description ?? '';
    await createFlow({ name, trigger, triggerDetail: detail, message, delay, status: 'Active' });
    setCreated(true);
    setTimeout(() => {
      setShowCreate(false);
      setCreated(false);
      setName('');
      setTrigger('New Customer');
      setMessage('');
      setDelay('Immediately');
    }, 1500);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Total Flows" value={flows.length.toString()} />
        <MiniStat label="Active" value={activeCount.toString()} />
        <MiniStat label="Total Enrolled" value={totalEnrolled.toLocaleString()} />
        <MiniStat label="Avg Conversion" value={`${avgConversion}%`} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-whatsapp-600" /> Automation Flows
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Set up automatic messages based on customer actions</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Flow
        </button>
      </div>

      {/* Filter tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Status:</span>
          {(['All', 'Active', 'Paused', 'Draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === f ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Trigger:</span>
          <button
            onClick={() => setTriggerFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              triggerFilter === 'All' ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          {triggerOptions.map((t) => (
            <button
              key={t.trigger}
              onClick={() => setTriggerFilter(t.trigger)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                triggerFilter === t.trigger ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.trigger}
            </button>
          ))}
        </div>
      </div>

      {/* Flow cards */}
      <div className="space-y-3">
        {flows.filter((f) => {
          const matchStatus = statusFilter === 'All' || f.status === statusFilter;
          const matchTrigger = triggerFilter === 'All' || f.trigger === triggerFilter;
          return matchStatus && matchTrigger;
        }).map((f) => {
          const sc = statusConfig[f.status];
          const trigOpt = triggerOptions.find((t) => t.trigger === f.trigger);
          const TrigIcon = trigOpt ? triggerIcons[trigOpt.icon] : Zap;
          return (
            <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${sc.bg} ${sc.color}`}>
                    <TrigIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800 text-sm">{f.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${sc.bg} ${sc.color}`}>
                        {f.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{f.triggerDetail}</p>
                  </div>
                </div>
                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenMenu(openMenu === f.id ? null : f.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenu === f.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                        <button
                          onClick={() => toggleStatus(f.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          {f.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {f.status === 'Active' ? 'Pause' : 'Activate'}
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Flow visual */}
              <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
                <span className="bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                  <TrigIcon className="w-3.5 h-3.5" /> {f.trigger}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="bg-slate-50 text-slate-500 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {f.delay}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="bg-whatsapp-50 text-whatsapp-600 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Send Message
                </span>
              </div>

              {/* Message preview */}
              <div className="mt-3 bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 leading-relaxed">{f.message}</p>
              </div>

              {/* Stats */}
              {f.status !== 'Draft' && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <FlowStat label="Enrolled" value={f.enrolled.toLocaleString()} />
                  <FlowStat label="Sent" value={f.sent.toLocaleString()} />
                  <FlowStat label="Conversion" value={`${f.conversionRate}%`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create flow modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => !created && setShowCreate(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            {created ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-whatsapp-100 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 text-whatsapp-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mt-4">Flow Created!</h3>
                <p className="text-sm text-slate-500 mt-2">Your automation flow is now active.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-whatsapp-600" /> Create Automation Flow
                  </h3>
                  <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Flow Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Welcome New Customer"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Trigger</label>
                    <div className="grid grid-cols-1 gap-2">
                      {triggerOptions.map((t) => {
                        const Icon = triggerIcons[t.icon];
                        const selected = trigger === t.trigger;
                        return (
                          <button
                            key={t.trigger}
                            onClick={() => setTrigger(t.trigger)}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition ${
                              selected ? 'border-whatsapp-500 bg-whatsapp-50' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-whatsapp-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-700">{t.trigger}</p>
                              <p className="text-xs text-slate-400">{t.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Send Delay</label>
                    <div className="relative">
                      <select
                        value={delay}
                        onChange={(e) => setDelay(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 appearance-none bg-white"
                      >
                        <option>Immediately</option>
                        <option>After 1 hour</option>
                        <option>After 2 hours</option>
                        <option>After 24 hours</option>
                        <option>After 3 days</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi {{name}}, welcome to our store! Here is 10% off..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 resize-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Use {'{{name}}'}, {'{{items}}'}, {'{{code}}'} for personalization
                    </p>
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={!name.trim() || !message.trim()}
                    className={`w-full text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
                      name.trim() && message.trim()
                        ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-4 h-4" /> Create & Activate Flow
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function FlowStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-2.5 text-center">
      <p className="text-sm font-bold text-slate-700">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
