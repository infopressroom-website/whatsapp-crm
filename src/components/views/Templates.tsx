import { useState } from 'react';
import {
  Plus, FileText, CheckCircle, Clock, XCircle, Search, Eye,
  Type, ImageIcon, Video, File, Hash, Link as LinkIcon, Phone,
  Trash2, ChevronRight, ChevronLeft, X, Check, AlertCircle,
  MessageSquare, Send, Sparkles,
} from 'lucide-react';
import {
  templateLanguages, templateVariables,
  type Template, type HeaderType, type TemplateButton, type ButtonType,
} from '@/data/mockData';
import { useTemplates } from '@/lib/hooks';

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  Approved: { icon: CheckCircle, color: 'text-whatsapp-600', bg: 'bg-whatsapp-100' },
  Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  Rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' },
};

const headerTypeIcons: Record<HeaderType, typeof Type> = {
  none: Hash, text: Type, image: ImageIcon, video: Video, document: File,
};

const buttonTypeIcons: Record<ButtonType, typeof Type> = {
  quick_reply: MessageSquare, url: LinkIcon, phone: Phone,
};

const buttonTypeLabels: Record<ButtonType, string> = {
  quick_reply: 'Quick Reply', url: 'Visit Website', phone: 'Call Phone',
};

export default function Templates() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [preview, setPreview] = useState<Template | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { list, createTemplate, deleteTemplate } = useTemplates();

  const cats = Array.from(new Set(list.map((t) => t.category)));
  const filtered = list.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchCat = catFilter === 'All' || t.category === catFilter;
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      {/* Filter tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Status:</span>
          {['All', 'Approved', 'Pending', 'Rejected'].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${statusFilter === f ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Category:</span>
          <button onClick={() => setCatFilter('All')} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${catFilter === 'All' ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>All</button>
          {cats.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${catFilter === c ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const sc = statusConfig[t.status];
          const StatusIcon = sc.icon;
          const HeaderIcon = headerTypeIcons[t.headerType] ?? Hash;
          return (
            <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition flex flex-col">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-whatsapp-50 text-whatsapp-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold ${sc.bg} ${sc.color}`}>
                  <StatusIcon className="w-3 h-3" /> {t.status}
                </span>
              </div>
              <p className="font-semibold text-slate-800 mt-3">{t.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t.category}</span>
                <span className="text-[10px] text-slate-400">{t.language}</span>
                {t.headerType !== 'none' && (
                  <span className="text-[10px] flex items-center gap-1 text-slate-400"><HeaderIcon className="w-3 h-3" /> {t.headerType}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-3 line-clamp-3 flex-1">{t.body}</p>
              {/* Variables + Buttons badges */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {t.variables.length > 0 && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{t.variables.length} variables</span>
                )}
                {t.buttons.length > 0 && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{t.buttons.length} buttons</span>
                )}
                {t.footer && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">footer</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                <span className="text-[11px] text-slate-400">Created {t.createdAt}</span>
                <button onClick={() => setPreview(t)} className="text-xs text-whatsapp-600 font-medium hover:underline flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto"><FileText className="w-7 h-7 text-slate-300" /></div>
          <p className="text-slate-400 mt-4">No templates found</p>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{preview.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{preview.category}</span>
                  <span className="text-[10px] text-slate-400">{preview.language}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig[preview.status].bg} ${statusConfig[preview.status].color}`}>{preview.status}</span>
                </div>
              </div>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            {/* WhatsApp-style preview */}
            <div className="rounded-xl p-4 min-h-[200px]" style={{ backgroundColor: '#e5ddd5' }}>
              <div className="bg-whatsapp-500 rounded-lg p-3 max-w-[85%] ml-auto shadow-sm">
                {preview.headerType !== 'none' && preview.header && (
                  <div className="mb-2">
                    {preview.headerType === 'image' && <div className="w-full h-24 bg-whatsapp-300 rounded mb-2 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-white/60" /></div>}
                    {preview.headerType === 'video' && <div className="w-full h-24 bg-whatsapp-300 rounded mb-2 flex items-center justify-center"><Video className="w-6 h-6 text-white/60" /></div>}
                    {preview.headerType === 'document' && <div className="w-full h-16 bg-whatsapp-300 rounded mb-2 flex items-center justify-center gap-2 text-white/80 text-xs"><File className="w-4 h-4" /> Document.pdf</div>}
                    {preview.headerType === 'text' && <p className="text-white font-semibold text-sm">{preview.header}</p>}
                  </div>
                )}
                <p className="text-white/95 text-sm leading-relaxed">{preview.body}</p>
                {preview.footer && <p className="text-[11px] text-white/50 mt-2">{preview.footer}</p>}
                <p className="text-[10px] text-white/60 text-right mt-2">12:30 PM ✓✓</p>
              </div>
              {/* Buttons */}
              {preview.buttons.length > 0 && (
                <div className="max-w-[85%] ml-auto mt-1 bg-white rounded-lg overflow-hidden shadow-sm">
                  {preview.buttons.map((b, i) => {
                    const BIcon = buttonTypeIcons[b.type];
                    return (
                      <div key={i} className={`flex items-center justify-center gap-2 py-2.5 text-whatsapp-600 text-sm font-medium ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                        <BIcon className="w-4 h-4" /> {b.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Variables list */}
            {preview.variables.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-600 mb-2">Variables ({preview.variables.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {preview.variables.map((v) => (
                    <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono">{varFmt(v)}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => setPreview(null)} className="flex-1 text-sm font-medium text-slate-600 border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50">Close</button>
              <button className="flex-1 text-sm font-semibold text-white bg-whatsapp-500 py-2.5 rounded-lg hover:bg-whatsapp-600 flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Use Template</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreate && (
        <CreateTemplateModal
          onClose={() => setShowCreate(false)}
          onCreate={async (t) => {
            await createTemplate(t);
            setShowCreate(false);
          }}
          existingCount={list.length}
        />
      )}
    </div>
  );
}

// ─── Multi-step Create Template Modal ───
function CreateTemplateModal({
  onClose, onCreate, existingCount,
}: {
  onClose: () => void; onCreate: (t: Template) => void; existingCount: number;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Template['category']>('Marketing');
  const [language, setLanguage] = useState('English');
  const [headerType, setHeaderType] = useState<HeaderType>('none');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [buttons, setButtons] = useState<TemplateButton[]>([]);
  const [showVarPicker, setShowVarPicker] = useState(false);
  const [varPickerTarget, setVarPickerTarget] = useState<'header' | 'body' | null>(null);

  const extractedVars = (() => {
    const allText = `${header} ${body}`;
    const matches = allText.match(/\{\{(\w+)\}\}/g);
    return matches ? Array.from(new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))) : [];
  })();

  const insertVariable = (varName: string) => {
    const snippet = `{{${varName}}}`;
    if (varPickerTarget === 'header') {
      setHeader(header + snippet);
    } else if (varPickerTarget === 'body') {
      setBody(body + snippet);
    }
    setShowVarPicker(false);
    setVarPickerTarget(null);
  };

  const addButton = (type: ButtonType) => {
    if (buttons.length >= 3) return;
    const newBtn: TemplateButton = { type, text: '', url: type === 'url' ? 'https://' : undefined, phone: type === 'phone' ? '+91 ' : undefined };
    setButtons([...buttons, newBtn]);
  };

  const updateButton = (i: number, field: keyof TemplateButton, value: string) => {
    setButtons(buttons.map((b, idx) => (idx === i ? { ...b, [field]: value } : b)));
  };

  const removeButton = (i: number) => {
    setButtons(buttons.filter((_, idx) => idx !== i));
  };

  const canNext = step === 1 ? name.trim().length > 0 : step === 2 ? body.trim().length > 0 : true;
  const canSubmit = name.trim() && body.trim();

  const handleSubmit = () => {
    const newTemplate: Template = {
      id: `t${existingCount + 1}`,
      name: name.trim(),
      category,
      language,
      headerType,
      header: headerType === 'text' ? header : '',
      body: body.trim(),
      footer: footer.trim() || undefined,
      buttons,
      variables: extractedVars,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onCreate(newTemplate);
  };

  const steps = [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Content' },
    { num: 3, label: 'Buttons' },
    { num: 4, label: 'Review' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-whatsapp-600" /> Create Message Template
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${step === s.num ? 'bg-whatsapp-500 text-white' : step > s.num ? 'bg-whatsapp-50 text-whatsapp-700' : 'bg-slate-100 text-slate-400'}`}>
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px]">{s.num}</span>}
                {s.label}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${step > s.num ? 'bg-whatsapp-300' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Template Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Diwali Special Offer" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" />
              <p className="text-[11px] text-slate-400 mt-1">Only lowercase letters, numbers, and underscores. Max 512 characters.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Marketing', 'Utility', 'Authentication'] as const).map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${category === c ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500">
                {templateLanguages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Header type */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Header (optional)</label>
              <div className="grid grid-cols-5 gap-2">
                {([
                  { type: 'none', icon: Hash, label: 'None' },
                  { type: 'text', icon: Type, label: 'Text' },
                  { type: 'image', icon: ImageIcon, label: 'Image' },
                  { type: 'video', icon: Video, label: 'Video' },
                  { type: 'document', icon: File, label: 'Doc' },
                ] as { type: HeaderType; icon: typeof Type; label: string }[]).map((h) => {
                  const Icon = h.icon;
                  return (
                    <button key={h.type} onClick={() => setHeaderType(h.type)} className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition ${headerType === h.type ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                      <Icon className="w-4 h-4" /> {h.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {headerType === 'text' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-600">Header Text</label>
                  <button onClick={() => { setVarPickerTarget('header'); setShowVarPicker(true); }} className="text-xs text-whatsapp-600 font-medium flex items-center gap-1 hover:underline">
                    <Plus className="w-3 h-3" /> Add Variable
                  </button>
                </div>
                <input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Header text (max 60 chars)" maxLength={60} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" />
              </div>
            )}
            {(headerType === 'image' || headerType === 'video' || headerType === 'document') && (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-2">
                  {headerType === 'image' && <ImageIcon className="w-5 h-5 text-slate-400" />}
                  {headerType === 'video' && <Video className="w-5 h-5 text-slate-400" />}
                  {headerType === 'document' && <File className="w-5 h-5 text-slate-400" />}
                </div>
                <p className="text-sm text-slate-500">Upload {headerType} will be added when sending</p>
              </div>
            )}
            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-600">Body Text <span className="text-red-400">*</span></label>
                <button onClick={() => { setVarPickerTarget('body'); setShowVarPicker(true); }} className="text-xs text-whatsapp-600 font-medium flex items-center gap-1 hover:underline">
                  <Plus className="w-3 h-3" /> Add Variable
                </button>
              </div>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message here... Use {{variables}} for personalization" rows={5} maxLength={1024} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 resize-none" />
              <p className="text-[11px] text-slate-400 mt-1">{body.length}/1024 characters</p>
            </div>
            {/* Footer */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Footer (optional)</label>
              <input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Footer text (max 60 chars)" maxLength={60} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" />
            </div>

            {/* Variable picker popup */}
            {showVarPicker && (
              <div className="fixed inset-0 z-10" onClick={() => setShowVarPicker(false)}>
                <div className="absolute right-0 top-0 bg-white border border-slate-200 rounded-lg shadow-lg p-3 w-56 z-20" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Insert Variable</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {templateVariables.map((v) => (
                      <button key={v.name} onClick={() => insertVariable(v.name)} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 transition text-left">
                        <span className="text-xs font-mono text-whatsapp-600">{varFmt(v.name)}</span>
                        <span className="text-[10px] text-slate-400">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Buttons */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Add Buttons (optional, max 3)</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { type: 'quick_reply', icon: MessageSquare, label: 'Quick Reply' },
                  { type: 'url', icon: LinkIcon, label: 'Website URL' },
                  { type: 'phone', icon: Phone, label: 'Phone Number' },
                ] as { type: ButtonType; icon: typeof Type; label: string }[]).map((b) => {
                  const Icon = b.icon;
                  return (
                    <button key={b.type} onClick={() => addButton(b.type)} disabled={buttons.length >= 3} className={`flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-medium transition ${buttons.length >= 3 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                      <Icon className="w-4 h-4" /> {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {buttons.length > 0 && (
              <div className="space-y-3">
                {buttons.map((b, i) => {
                  const BIcon = buttonTypeIcons[b.type];
                  return (
                    <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"><BIcon className="w-3.5 h-3.5 text-whatsapp-600" /> {buttonTypeLabels[b.type]} {i + 1}</span>
                        <button onClick={() => removeButton(i)} className="p-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">Button Text</label>
                        <input value={b.text} onChange={(e) => updateButton(i, 'text', e.target.value)} placeholder="e.g. Shop Now" maxLength={25} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-whatsapp-500 mt-0.5" />
                      </div>
                      {b.type === 'url' && (
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase">URL</label>
                          <input value={b.url ?? ''} onChange={(e) => updateButton(i, 'url', e.target.value)} placeholder="https://..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-whatsapp-500 mt-0.5" />
                        </div>
                      )}
                      {b.type === 'phone' && (
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase">Phone Number</label>
                          <input value={b.phone ?? ''} onChange={(e) => updateButton(i, 'phone', e.target.value)} placeholder="+91 98765 43210" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-whatsapp-500 mt-0.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {buttons.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No buttons added. You can skip this step.</p>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ReviewField label="Name" value={name} />
              <ReviewField label="Category" value={category} />
              <ReviewField label="Language" value={language} />
              <ReviewField label="Header Type" value={headerType} />
            </div>
            {header && <ReviewField label="Header" value={header} />}
            <ReviewField label="Body" value={body} />
            {footer && <ReviewField label="Footer" value={footer} />}
            {buttons.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Buttons</p>
                <div className="space-y-1">
                  {buttons.map((b, i) => (
                    <div key={i} className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="font-medium">{buttonTypeLabels[b.type]}:</span> {b.text}
                      {b.url && <span className="text-slate-400 ml-2">{b.url}</span>}
                      {b.phone && <span className="text-slate-400 ml-2">{b.phone}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {extractedVars.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Variables detected ({extractedVars.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {extractedVars.map((v) => (
                    <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono">{varFmt(v)}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">This template will be submitted for WhatsApp approval. You'll be notified once it's approved or rejected.</p>
            </div>

            {/* Live WhatsApp preview */}
            <div className="rounded-xl p-4" style={{ backgroundColor: '#e5ddd5' }}>
              <div className="bg-whatsapp-500 rounded-lg p-3 max-w-[85%] ml-auto shadow-sm">
                {headerType === 'text' && header && <p className="text-white font-semibold text-sm mb-1">{header}</p>}
                <p className="text-white/95 text-sm leading-relaxed">{body || 'Your message preview will appear here...'}</p>
                {footer && <p className="text-[11px] text-white/50 mt-2">{footer}</p>}
                <p className="text-[10px] text-white/60 text-right mt-2">12:30 PM ✓✓</p>
              </div>
              {buttons.length > 0 && (
                <div className="max-w-[85%] ml-auto mt-1 bg-white rounded-lg overflow-hidden shadow-sm">
                  {buttons.map((b, i) => {
                    const BIcon = buttonTypeIcons[b.type];
                    return (
                      <div key={i} className={`flex items-center justify-center gap-2 py-2.5 text-whatsapp-600 text-sm font-medium ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                        <BIcon className="w-4 h-4" /> {b.text || 'Button'}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="text-sm font-medium text-slate-500 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition flex items-center gap-1">
            {step > 1 ? <><ChevronLeft className="w-4 h-4" /> Back</> : 'Cancel'}
          </button>
          {step < 4 ? (
            <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className={`text-sm font-semibold px-6 py-2.5 rounded-lg transition flex items-center gap-1 ${canNext ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canSubmit} className={`text-sm font-semibold px-6 py-2.5 rounded-lg transition flex items-center gap-2 ${canSubmit ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              <Send className="w-4 h-4" /> Submit for Approval
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function varFmt(name: string) {
  return `{{${name}}}`;
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2">
      <p className="text-[10px] text-slate-400 uppercase font-semibold">{label}</p>
      <p className="text-sm text-slate-700 mt-0.5 break-words">{value || '—'}</p>
    </div>
  );
}
