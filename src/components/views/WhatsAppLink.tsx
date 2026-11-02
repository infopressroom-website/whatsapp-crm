import { useState } from 'react';
import {
  Link2, QrCode, Copy, Check, Plus, ExternalLink, MousePointer,
  MessageSquare, TrendingUp, Trash2, X,
} from 'lucide-react';
import { type WaLink } from '@/data/mockData';
import { useWaLinks } from '@/lib/hooks';

export default function WhatsAppLink() {
  const { list: links, addLink, deleteLink } = useWaLinks();
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [prefilledMsg, setPrefilledMsg] = useState('');
  const [source, setSource] = useState('Website');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  const phoneNumber = '919876543210';
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const totalChats = links.reduce((s, l) => s + l.chats, 0);
  const conversionRate = totalClicks ? Math.round((totalChats / totalClicks) * 100) : 0;

  const generateUrl = (msg: string) => {
    if (!msg.trim()) return `https://wa.me/${phoneNumber}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleCreate = async () => {
    if (!linkName.trim()) return;
    await addLink({ name: linkName, url: generateUrl(prefilledMsg), source });
    setCreated(true);
    setTimeout(() => {
      setShowCreate(false);
      setCreated(false);
      setLinkName('');
      setPrefilledMsg('');
      setSource('Website');
    }, 1500);
  };

  const handleCopy = (url: string) => {
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = (id: string) => {
    deleteLink(id);
  };

  const currentUrl = generateUrl(prefilledMsg);

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Total Links" value={links.length.toString()} />
        <MiniStat label="Total Clicks" value={totalClicks.toLocaleString()} />
        <MiniStat label="Chats Started" value={totalChats.toLocaleString()} />
        <MiniStat label="Conversion Rate" value={`${conversionRate}%`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Link generator */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
              <Link2 className="w-5 h-5 text-whatsapp-600" /> Create Click-to-WhatsApp Link
            </h3>
            <p className="text-xs text-slate-400 mb-4">Generate a link that opens a WhatsApp chat with your business. Add it to ads, social media, or your website.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Link Name (for your reference)</label>
                <input
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g. Instagram Bio Link"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Source / Placement</label>
                <div className="flex flex-wrap gap-2">
                  {['Website', 'Instagram', 'Facebook Ads', 'Print / Store', 'Email', 'Other'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSource(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        source === s ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Pre-filled Message (optional)</label>
                <textarea
                  value={prefilledMsg}
                  onChange={(e) => setPrefilledMsg(e.target.value)}
                  placeholder="Hi, I am interested in your Diwali sale!"
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Customers will see this message pre-typed when they open the chat</p>
              </div>

              {/* Live preview */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Your Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 truncate">
                    {currentUrl}
                  </code>
                  <button
                    onClick={() => handleCopy(currentUrl)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      copiedUrl === currentUrl ? 'bg-whatsapp-600 text-white' : 'bg-whatsapp-500 text-white hover:bg-whatsapp-600'
                    }`}
                  >
                    {copiedUrl === currentUrl ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={!linkName.trim()}
                className={`w-full text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
                  linkName.trim() ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" /> Save Link
              </button>
            </div>
          </div>

          {/* Saved links */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-1">Saved Links</h3>
            <p className="text-xs text-slate-400 mb-3">Track clicks and chats from each link</p>
            {/* Source filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Source:</span>
              {['All', ...Array.from(new Set(links.map((l) => l.source)))].map((f) => (
                <button
                  key={f}
                  onClick={() => setSourceFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    sourceFilter === f ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {links.filter((l) => sourceFilter === 'All' || l.source === sourceFilter).map((l) => (
                <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition">
                  <div className="w-10 h-10 rounded-lg bg-whatsapp-50 text-whatsapp-600 flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700 truncate">{l.name}</p>
                    <p className="text-xs text-slate-400 truncate">{l.url}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <MousePointer className="w-3 h-3" /> {l.clicks} clicks
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <MessageSquare className="w-3 h-3" /> {l.chats} chats
                      </span>
                      <span className="text-[10px] text-slate-400">{l.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(l.url)}
                      className={`p-2 rounded-lg transition ${copiedUrl === l.url ? 'text-whatsapp-600 bg-whatsapp-50' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                      {copiedUrl === l.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a href={l.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleDelete(l.id)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code preview */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <h3 className="font-semibold text-slate-800 flex items-center justify-center gap-2 mb-1">
              <QrCode className="w-5 h-5 text-whatsapp-600" /> QR Code
            </h3>
            <p className="text-xs text-slate-400 mb-4">Scan to start a WhatsApp chat</p>
            {/* SVG QR Code placeholder */}
            <div className="inline-block p-4 bg-white border-2 border-slate-200 rounded-xl">
              <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
                {/* QR pattern mock */}
                <rect width="160" height="160" fill="white" />
                {/* Corner squares */}
                <rect x="8" y="8" width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="4" />
                <rect x="20" y="20" width="12" height="12" fill="#16a34a" />
                <rect x="116" y="8" width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="4" />
                <rect x="128" y="20" width="12" height="12" fill="#16a34a" />
                <rect x="8" y="116" width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="4" />
                <rect x="20" y="128" width="12" height="12" fill="#16a34a" />
                {/* Random dots */}
                {[
                  [56, 12], [64, 12], [76, 12], [88, 12], [100, 12],
                  [52, 20], [68, 20], [80, 20], [92, 20], [104, 20],
                  [56, 28], [72, 28], [84, 28], [96, 28], [108, 28],
                  [60, 36], [76, 36], [88, 36], [100, 36],
                  [12, 56], [28, 56], [44, 56], [60, 56], [76, 56], [92, 56], [108, 56], [124, 56], [140, 56],
                  [20, 64], [36, 64], [52, 64], [68, 64], [84, 64], [100, 64], [116, 64], [132, 64],
                  [12, 72], [28, 72], [44, 72], [60, 72], [76, 72], [92, 72], [108, 72], [124, 72], [140, 72],
                  [20, 80], [36, 80], [52, 80], [68, 80], [84, 80], [100, 80], [116, 80], [132, 80],
                  [12, 88], [28, 88], [44, 88], [60, 88], [76, 88], [92, 88], [108, 88], [124, 88], [140, 88],
                  [20, 96], [36, 96], [52, 96], [68, 96], [84, 96], [100, 96], [116, 96], [132, 96],
                  [12, 104], [28, 104], [44, 104], [60, 104], [76, 104], [92, 104], [108, 104], [124, 104], [140, 104],
                  [56, 116], [72, 116], [88, 116], [104, 116], [120, 116], [136, 116],
                  [52, 124], [68, 124], [84, 124], [100, 124], [116, 124], [132, 124],
                  [60, 132], [76, 132], [92, 132], [108, 132], [124, 132], [140, 132],
                  [52, 140], [68, 140], [84, 140], [100, 140], [116, 140], [132, 140],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="8" height="8" fill={i % 3 === 0 ? '#16a34a' : '#e2e8f0'} />
                ))}
                {/* Center logo */}
                <rect x="68" y="68" width="24" height="24" fill="white" />
                <circle cx="80" cy="80" r="10" fill="#16a34a" />
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 mt-3">QR Code for: {linkName || 'Untitled Link'}</p>
            <button className="mt-3 w-full bg-whatsapp-50 text-whatsapp-700 text-xs font-semibold py-2 rounded-lg hover:bg-whatsapp-100 transition">
              Download QR Code
            </button>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 rounded-xl p-5 text-white">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Pro Tips
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-whatsapp-50/90">
              <li className="flex items-start gap-2"><span className="text-whatsapp-200">•</span> Add pre-filled messages to increase chat conversions by 2x</li>
              <li className="flex items-start gap-2"><span className="text-whatsapp-200">•</span> Use different links for each ad to track what works best</li>
              <li className="flex items-start gap-2"><span className="text-whatsapp-200">•</span> Print QR codes for in-store displays and packaging</li>
              <li className="flex items-start gap-2"><span className="text-whatsapp-200">•</span> Add links to your Instagram bio and Facebook page</li>
            </ul>
          </div>
        </div>
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
