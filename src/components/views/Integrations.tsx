import { useState } from 'react';
import {
  ShoppingBag, ShoppingCart, CreditCard, FileSpreadsheet, Zap,
  Users, Megaphone, Webhook, Check, X, Plus, Search, Star,
} from 'lucide-react';
import { type Integration } from '@/data/mockData';
import { useIntegrations } from '@/lib/hooks';

const iconMap: Record<string, typeof ShoppingBag> = {
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  FileSpreadsheet,
  Zap,
  Users,
  Megaphone,
  Webhook,
};

export default function Integrations() {
  const { list: items, toggleIntegration } = useIntegrations();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);

  const cats = Array.from(new Set(items.map((i) => i.category)));
  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const connectedCount = items.filter((i) => i.connected).length;

  const toggleConnect = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) toggleIntegration(id, item.connected);
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Connected" value={connectedCount.toString()} />
        <MiniStat label="Available" value={(items.length - connectedCount).toString()} />
        <MiniStat label="Categories" value={cats.length.toString()} />
        <MiniStat label="Popular" value={items.filter((i) => i.popular).length.toString()} />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCatFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
            !catFilter ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              catFilter === c ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Popular integrations highlight */}
      {!catFilter && !search && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" /> Most Popular
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.filter((i) => i.popular).map((i) => (
              <IntegrationCard key={i.id} integration={i} onToggle={toggleConnect} />
            ))}
          </div>
          <h3 className="text-sm font-semibold text-slate-500 mt-6 mb-3">All Integrations</h3>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((i) => (
          <IntegrationCard key={i.id} integration={i} onToggle={toggleConnect} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">No integrations found</p>
        </div>
      )}

      {/* API key section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-whatsapp-600" /> API Access
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Use our REST API to build custom integrations</p>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <p className="text-slate-500">// Example: Send a message via API</p>
          <p className="mt-1"><span className="text-whatsapp-400">POST</span> https://api.whatswave.com/v1/send</p>
          <p className="mt-1">Authorization: Bearer ww_live_•••••••••••••••</p>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-400 font-mono">
            ww_live_••••••••••••••••••••
          </div>
          <button className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition">
            Copy Key
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ integration, onToggle }: { integration: Integration; onToggle: (id: string) => void }) {
  const Icon = iconMap[integration.icon] ?? Zap;
  return (
    <div className={`bg-white rounded-xl border-2 p-4 transition ${integration.connected ? 'border-whatsapp-200' : 'border-slate-200'} hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        {integration.popular && (
          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5" /> Popular
          </span>
        )}
      </div>
      <p className="font-semibold text-slate-800 text-sm mt-3">{integration.name}</p>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{integration.description}</p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <span className="text-[10px] text-slate-400 font-medium">{integration.category}</span>
        {integration.connected ? (
          <button
            onClick={() => onToggle(integration.id)}
            className="text-xs font-semibold text-whatsapp-700 bg-whatsapp-50 px-3 py-1.5 rounded-lg hover:bg-whatsapp-100 transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Connected
          </button>
        ) : (
          <button
            onClick={() => onToggle(integration.id)}
            className="text-xs font-semibold text-white bg-whatsapp-500 px-3 py-1.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Connect
          </button>
        )}
      </div>
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
