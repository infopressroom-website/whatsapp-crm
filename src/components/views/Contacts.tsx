import { useState } from 'react';
import {
  Search, Plus, Tag, Phone, MoreVertical, Upload, Check, X,
  ArrowUpDown, Calendar, Trash2, Pencil, MessageSquare, UserPlus,
  Settings2, Palette, Layers, Ban, RotateCcw, Eye, ShoppingBag,
  ArrowLeft, AlertCircle, TrendingUp, Clock, ChevronRight,
} from 'lucide-react';
import {
  tagColors,
  type Contact, type TagDef, type CustomAttribute,
} from '@/data/mockData';
import { ContactProfile } from '@/components/ContactProfile';
import { useContacts } from '@/lib/hooks';

type OptInFilter = 'All' | 'Opted In' | 'Not Opted In';
type SortKey = 'newest' | 'oldest' | 'name';
type ManagerTab = 'tags' | 'attributes';
type MainTab = 'active' | 'blocked' | 'deleted';

export default function Contacts() {
  const [mainTab, setMainTab] = useState<MainTab>('active');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [optInFilter, setOptInFilter] = useState<OptInFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [showAdd, setShowAdd] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [blockTarget, setBlockTarget] = useState<Contact | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [managerTab, setManagerTab] = useState<ManagerTab>('tags');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drillDownTag, setDrillDownTag] = useState<string | null>(null);
  const {
    list, blocked: blockedList, deleted: deletedList, tagDefs, attrs,
    addContact, deleteContact, blockContact, unblockContact,
    restoreContact, permanentDelete, createTag, deleteTag,
    updateTagColor, createAttr, deleteAttr,
  } = useContacts();

  // Add contact form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [optIn, setOptIn] = useState(true);
  const [attrValues, setAttrValues] = useState<Record<string, string>>({});
  const [created, setCreated] = useState(false);

  // Tag manager form
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('whatsapp');

  // Attribute manager form
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrType, setNewAttrType] = useState<CustomAttribute['type']>('text');
  const [newAttrOptions, setNewAttrOptions] = useState('');
  const [profileContact, setProfileContact] = useState<Contact | null>(null);

  const activeList = list.filter((c) => c.status === 'Active');
  const allTags = Array.from(new Set(activeList.flatMap((c) => c.tags)));
  const tagColorMap = (tagName: string) => {
    const def = tagDefs.find((d) => d.name === tagName);
    return tagColors.find((c) => c.name === (def?.color ?? 'slate')) ?? tagColors[6];
  };

  // ── Filtering for active tab ──
  let filtered = activeList.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchTag = !tagFilter || c.tags.includes(tagFilter);
    const matchOptIn = optInFilter === 'All' || (optInFilter === 'Opted In' && c.optIn) || (optInFilter === 'Not Opted In' && !c.optIn);
    return matchSearch && matchTag && matchOptIn;
  });
  filtered = [...filtered].sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name);
    if (sortKey === 'newest') return b.createdAt.localeCompare(a.createdAt);
    return a.createdAt.localeCompare(b.createdAt);
  });

  const optedIn = activeList.filter((c) => c.optIn).length;
  const notOptedIn = activeList.length - optedIn;

  // ── Drill-down: contacts for a specific tag ──
  const drillDownContacts = drillDownTag ? activeList.filter((c) => c.tags.includes(drillDownTag)) : [];

  // ── Handlers ──
  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) return;
    await addContact({ name, phone, tags: selectedTags, optIn, attributes: { ...attrValues } });
    setCreated(true);
    setTimeout(() => { setShowAdd(false); setCreated(false); setName(''); setPhone(''); setSelectedTags([]); setOptIn(true); setAttrValues({}); }, 1500);
  };

  const handleDelete = (id: string) => { deleteContact(id); setOpenMenu(null); };

  const handleBlock = async () => {
    if (!blockTarget) return;
    await blockContact(blockTarget.id, blockReason || 'No reason provided');
    setShowBlock(false); setBlockTarget(null); setBlockReason(''); setOpenMenu(null);
  };

  const handleUnblock = (id: string) => { unblockContact(id); };
  const handleRestore = (id: string) => { restoreContact(id); };
  const handlePermanentDelete = (id: string) => { permanentDelete(id); };

  const toggleSelectedTag = (t: string) => {
    setSelectedTags(selectedTags.includes(t) ? selectedTags.filter((x) => x !== t) : [...selectedTags, t]);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    if (tagDefs.find((d) => d.name.toLowerCase() === newTagName.trim().toLowerCase())) return;
    createTag(newTagName.trim(), newTagColor);
    setNewTagName(''); setNewTagColor('whatsapp');
  };
  const handleDeleteTag = (id: string) => { deleteTag(id); };
  const handleUpdateTagColor = (id: string, color: string) => { updateTagColor(id, color); };
  const handleCreateAttr = () => {
    if (!newAttrName.trim()) return;
    const options = newAttrType === 'select' ? newAttrOptions.split(',').map((o) => o.trim()).filter(Boolean) : undefined;
    if (newAttrType === 'select' && (!options || options.length === 0)) return;
    createAttr(newAttrName.trim(), newAttrType, options);
    setNewAttrName(''); setNewAttrType('text'); setNewAttrOptions('');
  };
  const handleDeleteAttr = (id: string) => { deleteAttr(id); };

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Main tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {([
          { id: 'active', label: 'Active', count: activeList.length },
          { id: 'blocked', label: 'Blocked', count: blockedList.length },
          { id: 'deleted', label: 'Deleted', count: deletedList.length },
        ] as { id: MainTab; label: string; count: number }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => { setMainTab(t.id); setDrillDownTag(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition ${
              mainTab === t.id ? 'bg-whatsapp-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${mainTab === t.id ? 'bg-white/20' : 'bg-slate-100'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ════ ACTIVE TAB ════ */}
      {mainTab === 'active' && !drillDownTag && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniStat label="Total Contacts" value={activeList.length.toString()} />
            <MiniStat label="Opted In" value={optedIn.toString()} />
            <MiniStat label="Not Opted In" value={notOptedIn.toString()} />
            <MiniStat label="Tags" value={tagDefs.length.toString()} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <SearchBox search={search} setSearch={setSearch} />
            <div className="flex gap-2">
              <button onClick={() => setShowManager(true)} className="bg-white border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Tags & Attributes
              </button>
              <button className="bg-white border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
                <Upload className="w-4 h-4" /> Import
              </button>
              <button onClick={() => setShowAdd(true)} className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Contact
              </button>
            </div>
          </div>

          {/* Tag-wise summary cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-whatsapp-600" /> Tag-wise Summary
              </h3>
              <span className="text-xs text-slate-400">Click a tag to view all its contacts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {tagDefs.map((td) => {
                const tc = tagColorMap(td.name);
                const tagContacts = activeList.filter((c) => c.tags.includes(td.name));
                const tagSpent = tagContacts.reduce((a, b) => a + (b.totalSpent ?? 0), 0);
                const tagOrders = tagContacts.reduce((a, b) => a + (b.totalOrders ?? 0), 0);
                const tagOptedIn = tagContacts.filter((c) => c.optIn).length;
                return (
                  <button
                    key={td.id}
                    onClick={() => setDrillDownTag(td.name)}
                    className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-whatsapp-200 transition group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-3 h-3 rounded-full ${tc.dot}`} />
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-whatsapp-600 transition">{td.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-lg font-bold text-slate-800">{tagContacts.length}</p>
                        <p className="text-[10px] text-slate-400">Contacts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800">{tagOptedIn}</p>
                        <p className="text-[10px] text-slate-400">Opted In</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800">{tagOrders}</p>
                        <p className="text-[10px] text-slate-400">Orders</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800">₹{(tagSpent / 1000).toFixed(1)}K</p>
                        <p className="text-[10px] text-slate-400">Spent</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">View list</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-whatsapp-500 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                );
              })}
              {tagDefs.length === 0 && (
                <div className="col-span-full text-center py-8 bg-white rounded-xl border border-slate-200">
                  <Tag className="w-8 h-8 text-slate-200 mx-auto" />
                  <p className="text-sm text-slate-400 mt-2">No tags yet. Create tags from "Tags & Attributes" manager.</p>
                </div>
              )}
            </div>
          </div>

          {/* Filter bar: Opt-in + Tag filter + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Opt-in:</span>
              {(['All', 'Opted In', 'Not Opted In'] as OptInFilter[]).map((f) => (
                <button key={f} onClick={() => setOptInFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${optInFilter === f ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{f}</button>
              ))}
              <span className="text-[10px] font-semibold text-slate-400 uppercase ml-2">Filter tag:</span>
              <select value={tagFilter ?? ''} onChange={(e) => setTagFilter(e.target.value || null)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 outline-none hover:bg-slate-50 cursor-pointer">
                <option value="">All tags</option>
                {tagDefs.map((td) => <option key={td.id} value={td.name}>{td.name}</option>)}
              </select>
            </div>
            <SortDropdown sortKey={sortKey} setSortKey={setSortKey} />
          </div>

          <ContactTable
            contacts={filtered} attrs={attrs} tagColorMap={tagColorMap}
            openMenu={openMenu} setOpenMenu={setOpenMenu}
            onDelete={handleDelete}
            onBlock={(c) => { setBlockTarget(c); setShowBlock(true); setOpenMenu(null); }}
            onTagClick={(t) => setDrillDownTag(t)}
            onRowClick={(c) => setProfileContact(c)}
          />
        </>
      )}

      {/* ════ TAG DRILL-DOWN ════ */}
      {mainTab === 'active' && drillDownTag && (
        <TagDrillDown
          tag={drillDownTag} contacts={drillDownContacts} tagDefs={tagDefs}
          tagColorMap={tagColorMap} attrs={attrs}
          onBack={() => setDrillDownTag(null)}
          openMenu={openMenu} setOpenMenu={setOpenMenu}
          onDelete={handleDelete}
          onBlock={(c) => { setBlockTarget(c); setShowBlock(true); setOpenMenu(null); }}
          onRowClick={(c) => setProfileContact(c)}
        />
      )}

      {/* ════ BLOCKED TAB ════ */}
      {mainTab === 'blocked' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStat label="Blocked Contacts" value={blockedList.length.toString()} />
            <MiniStat label="This Month" value={blockedList.filter((c) => c.blockedAt?.startsWith('2026-10')).length.toString()} />
            <MiniStat label="Total Active" value={activeList.length.toString()} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-slate-800">Blocked Contacts</h3>
            </div>
            {blockedList.length === 0 ? (
              <EmptyState icon={Ban} text="No blocked contacts" />
            ) : (
              <div className="divide-y divide-slate-50">
                {blockedList.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-slate-50/50 transition">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                      <Ban className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{c.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-medium text-slate-600">{c.blockedReason}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Blocked: {c.blockedAt}</p>
                    </div>
                    <button onClick={() => setProfileContact(c)} className="bg-slate-50 text-slate-500 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5 shrink-0">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button onClick={() => handleUnblock(c.id)} className="bg-whatsapp-50 text-whatsapp-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-whatsapp-100 transition flex items-center gap-1.5 shrink-0">
                      <RotateCcw className="w-3.5 h-3.5" /> Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ DELETED TAB ════ */}
      {mainTab === 'deleted' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStat label="Deleted Contacts" value={deletedList.length.toString()} />
            <MiniStat label="This Month" value={deletedList.filter((c) => c.deletedAt?.startsWith('2026-10')).length.toString()} />
            <MiniStat label="Total Active" value={activeList.length.toString()} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Deleted Contacts</h3>
              <span className="text-xs text-slate-400 ml-auto">Restore or permanently delete</span>
            </div>
            {deletedList.length === 0 ? (
              <EmptyState icon={Trash2} text="No deleted contacts" />
            ) : (
              <div className="divide-y divide-slate-50">
                {deletedList.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-slate-50/50 transition">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm font-bold shrink-0 opacity-60">
                      {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-500 line-through">{c.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] text-slate-400">Deleted: {c.deletedAt}</p>
                    </div>
                    <button onClick={() => handleRestore(c.id)} className="bg-whatsapp-50 text-whatsapp-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-whatsapp-100 transition flex items-center gap-1.5 shrink-0">
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button onClick={() => setProfileContact(c)} className="bg-slate-50 text-slate-500 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5 shrink-0">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button onClick={() => handlePermanentDelete(c.id)} className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-1.5 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ MODALS ════ */}
      {/* Add contact modal */}
      {showAdd && (
        <Modal onClose={() => !created && setShowAdd(false)}>
          {created ? (
            <SuccessCheck title="Contact Added!" desc={`${name} has been added to your contacts.`} />
          ) : (
            <>
              <ModalHeader icon={UserPlus} title="Add New Contact" onClose={() => setShowAdd(false)} />
              <div className="space-y-4">
                <FormField label="Full Name" value={name} onChange={setName} placeholder="e.g. Rahul Sharma" />
                <FormField label="Phone Number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagDefs.map((td) => {
                      const tc = tagColors.find((c) => c.name === td.color) ?? tagColors[6];
                      const selected = selectedTags.includes(td.name);
                      return (
                        <button key={td.id} onClick={() => toggleSelectedTag(td.name)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${selected ? `${tc.bg} ${tc.text} ring-2 ring-offset-1 ring-whatsapp-300` : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>
                          <span className={`w-2 h-2 rounded-full ${tc.dot}`} /> {td.name}
                          {selected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                    {tagDefs.length === 0 && <p className="text-xs text-slate-400">No tags yet. Create tags from Tags & Attributes manager.</p>}
                  </div>
                </div>
                <OptInToggle optIn={optIn} setOptIn={setOptIn} />
                {attrs.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Custom Attributes</label>
                    <div className="space-y-2">
                      {attrs.map((a) => (
                        <div key={a.id} className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-28 shrink-0">{a.name}</span>
                          {a.type === 'select' ? (
                            <select value={attrValues[a.name] ?? ''} onChange={(e) => setAttrValues({ ...attrValues, [a.name]: e.target.value })} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-whatsapp-500">
                              <option value="">Select...</option>
                              {a.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input type={a.type === 'date' ? 'date' : a.type === 'number' ? 'number' : 'text'} value={attrValues[a.name] ?? ''} onChange={(e) => setAttrValues({ ...attrValues, [a.name]: e.target.value })} placeholder={`Enter ${a.name}`} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-whatsapp-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={handleAdd} disabled={!name.trim() || !phone.trim()} className={`w-full text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${name.trim() && phone.trim() ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                  <Plus className="w-4 h-4" /> Add Contact
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* Block contact modal */}
      {showBlock && blockTarget && (
        <Modal onClose={() => setShowBlock(false)}>
          <ModalHeader icon={Ban} title="Block Contact" onClose={() => setShowBlock(false)} color="red" />
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-sm font-bold">
                {blockTarget.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{blockTarget.name}</p>
                <p className="text-xs text-slate-400">{blockTarget.phone}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Reason for blocking (optional)</label>
              <select value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500">
                <option value="">Select a reason...</option>
                <option value="Spam messages">Spam messages</option>
                <option value="Abusive language">Abusive language</option>
                <option value="Repeated unsolicited messages">Repeated unsolicited messages</option>
                <option value="Fake account">Fake account</option>
                <option value="Opted out">Opted out</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Blocked contacts cannot receive campaigns or send messages. You can unblock them anytime from the Blocked tab.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowBlock(false)} className="flex-1 text-sm font-medium text-slate-600 border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleBlock} className="flex-1 text-sm font-semibold text-white bg-red-500 py-2.5 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" /> Block Contact
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Tags & Attributes Manager */}
      {showManager && (
        <Modal onClose={() => setShowManager(false)} wide>
          <ModalHeader icon={Settings2} title="Tags & Attributes" onClose={() => setShowManager(false)} />
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-5">
            <button onClick={() => setManagerTab('tags')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${managerTab === 'tags' ? 'bg-white text-whatsapp-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Tag className="w-4 h-4" /> Tags ({tagDefs.length})
            </button>
            <button onClick={() => setManagerTab('attributes')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${managerTab === 'attributes' ? 'bg-white text-whatsapp-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Layers className="w-4 h-4" /> Attributes ({attrs.length})
            </button>
          </div>

          {managerTab === 'tags' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {tagDefs.map((td) => {
                  const tc = tagColors.find((c) => c.name === td.color) ?? tagColors[6];
                  const contactCount = activeList.filter((c) => c.tags.includes(td.name)).length;
                  return (
                    <div key={td.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                      <button onClick={() => { setDrillDownTag(td.name); setShowManager(false); }} className="flex items-center gap-2 flex-1 min-w-0 hover:text-whatsapp-600 transition">
                        <span className={`w-3 h-3 rounded-full ${tc.dot} shrink-0`} />
                        <span className="text-sm font-medium text-slate-700 truncate">{td.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{contactCount} contacts</span>
                        <Eye className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                      </button>
                      <div className="flex items-center gap-1">
                        {tagColors.map((c) => (
                          <button key={c.name} onClick={() => handleUpdateTagColor(td.id, c.name)} className={`w-4 h-4 rounded-full ${c.dot} transition ${td.color === c.name ? 'ring-2 ring-offset-1 ring-slate-400' : 'hover:scale-110'}`} title={c.name} />
                        ))}
                      </div>
                      <button onClick={() => handleDeleteTag(td.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
                {tagDefs.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No tags yet. Create one below.</p>}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><Plus className="w-4 h-4 text-whatsapp-600" /> Create New Tag</h4>
                <div className="space-y-3">
                  <input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="Tag name (e.g. Wholesale, Influencer)" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()} />
                  <div>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Palette className="w-3.5 h-3.5" /> Choose a color</p>
                    <div className="flex items-center gap-2">
                      {tagColors.map((c) => (
                        <button key={c.name} onClick={() => setNewTagColor(c.name)} className={`w-7 h-7 rounded-lg ${c.dot} transition ${newTagColor === c.name ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`} />
                      ))}
                    </div>
                  </div>
                  <button onClick={handleCreateTag} disabled={!newTagName.trim()} className={`w-full text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${newTagName.trim() ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    <Plus className="w-4 h-4" /> Create Tag
                  </button>
                </div>
              </div>
            </div>
          )}

          {managerTab === 'attributes' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {attrs.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium text-slate-700">{a.name}</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">{a.type}</span></div>
                      {a.options && a.options.length > 0 && <p className="text-[11px] text-slate-400 mt-0.5">Options: {a.options.join(', ')}</p>}
                    </div>
                    <button onClick={() => handleDeleteAttr(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                {attrs.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No attributes yet. Create one below.</p>}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><Plus className="w-4 h-4 text-whatsapp-600" /> Create New Attribute</h4>
                <div className="space-y-3">
                  <input value={newAttrName} onChange={(e) => setNewAttrName(e.target.value)} placeholder="Attribute name (e.g. Loyalty Points, Anniversary)" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" />
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Field Type</p>
                    <div className="grid grid-cols-4 gap-2">
                      {(['text', 'date', 'number', 'select'] as const).map((t) => (
                        <button key={t} onClick={() => setNewAttrType(t)} className={`px-2 py-2 rounded-lg text-xs font-medium capitalize transition ${newAttrType === t ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  {newAttrType === 'select' && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1.5">Options (comma separated)</p>
                      <input value={newAttrOptions} onChange={(e) => setNewAttrOptions(e.target.value)} placeholder="e.g. Silver, Gold, Platinum" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" />
                    </div>
                  )}
                  <button onClick={handleCreateAttr} disabled={!newAttrName.trim() || (newAttrType === 'select' && !newAttrOptions.trim())} className={`w-full text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${newAttrName.trim() && (newAttrType !== 'select' || newAttrOptions.trim()) ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    <Plus className="w-4 h-4" /> Create Attribute
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Contact Profile Drawer */}
      <ContactProfile
        contact={profileContact}
        tagDefs={tagDefs}
        attrs={attrs}
        onClose={() => setProfileContact(null)}
        onBlock={(c) => { setBlockTarget(c); setShowBlock(true); setProfileContact(null); }}
        onDelete={handlePermanentDelete}
        onUnblock={handleUnblock}
        onRestore={handleRestore}
      />
    </div>
  );
}

// ─── Tag Drill-Down Component ───
function TagDrillDown({
  tag, contacts, tagDefs, tagColorMap, attrs, onBack, openMenu, setOpenMenu, onDelete, onBlock, onRowClick,
}: {
  tag: string; contacts: Contact[]; tagDefs: TagDef[]; tagColorMap: (t: string) => typeof tagColors[0];
  attrs: CustomAttribute[]; onBack: () => void; openMenu: string | null; setOpenMenu: (v: string | null) => void;
  onDelete: (id: string) => void; onBlock: (c: Contact) => void; onRowClick: (c: Contact) => void;
}) {
  const tc = tagColorMap(tag);
  const totalSpent = contacts.reduce((a, b) => a + (b.totalSpent ?? 0), 0);
  const totalOrders = contacts.reduce((a, b) => a + (b.totalOrders ?? 0), 0);
  const optedIn = contacts.filter((c) => c.optIn).length;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft className="w-4 h-4" /> Back to all contacts
      </button>

      <div className={`${tc.bg} rounded-xl p-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${tc.dot} flex items-center justify-center`}>
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${tc.text}`}>{tag}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{contacts.length} contacts tagged</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Contacts" value={contacts.length.toString()} />
        <MiniStat label="Opted In" value={optedIn.toString()} />
        <MiniStat label="Total Orders" value={totalOrders.toString()} />
        <MiniStat label="Total Spent" value={`₹${(totalSpent / 1000).toFixed(1)}K`} />
      </div>

      <ContactTable
        contacts={contacts} attrs={attrs} tagColorMap={tagColorMap}
        openMenu={openMenu} setOpenMenu={setOpenMenu}
        onDelete={onDelete} onBlock={onBlock}
        onTagClick={() => {}}
        onRowClick={onRowClick}
      />
    </div>
  );
}

// ─── Contact Table Component ───
function ContactTable({
  contacts, attrs, tagColorMap, openMenu, setOpenMenu, onDelete, onBlock, onTagClick, onRowClick,
}: {
  contacts: Contact[]; attrs: CustomAttribute[]; tagColorMap: (t: string) => typeof tagColors[0];
  openMenu: string | null; setOpenMenu: (v: string | null) => void;
  onDelete: (id: string) => void; onBlock: (c: Contact) => void;
  onTagClick: (t: string) => void; onRowClick: (c: Contact) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden sm:table-cell">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden md:table-cell">Tags</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Opt-in</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden lg:table-cell">Spent</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden lg:table-cell">Added</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-whatsapp-50/30 transition cursor-pointer" onClick={() => onRowClick(c)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400 sm:hidden flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => {
                      const tc = tagColorMap(t);
                      return (
                        <button key={t} onClick={() => onTagClick(t)} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tc.bg} ${tc.text} hover:opacity-80 transition`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {c.optIn ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-whatsapp-600"><Check className="w-3.5 h-3.5" /> Yes</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400"><X className="w-3.5 h-3.5" /> No</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm font-semibold text-slate-700">₹{(c.totalSpent ?? 0).toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400">{c.totalOrders ?? 0} orders</p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.createdAt}</span>
                </td>
                <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></button>
                  {openMenu === c.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-44">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); onRowClick(c); }}><Eye className="w-3.5 h-3.5" /> View Profile</button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={(e) => e.stopPropagation()}><MessageSquare className="w-3.5 h-3.5" /> Message</button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={(e) => e.stopPropagation()}><Pencil className="w-3.5 h-3.5" /> Edit</button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={(e) => { e.stopPropagation(); onBlock(c); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"><Ban className="w-3.5 h-3.5" /> Block</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contacts.length === 0 && <EmptyState icon={Search} text="No contacts found" />}
    </div>
  );
}

// ─── Shared sub-components ───
function Modal({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={onClose}>
      <div className={`bg-white rounded-2xl ${wide ? 'max-w-lg' : 'max-w-md'} w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-thin`} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
function ModalHeader({ icon: Icon, title, onClose, color }: { icon: React.ElementType; title: string; onClose: () => void; color?: string }) {
  const c = color === 'red' ? 'text-red-500' : 'text-whatsapp-600';
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className={`font-bold text-slate-800 text-lg flex items-center gap-2`}><Icon className={`w-5 h-5 ${c}`} /> {title}</h3>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
    </div>
  );
}
function SearchBox({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
      <Search className="w-4 h-4 text-slate-400" />
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
    </div>
  );
}
function SortDropdown({ sortKey, setSortKey }: { sortKey: SortKey; setSortKey: (v: SortKey) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-slate-400 uppercase">Sort:</span>
      <div className="relative">
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 outline-none hover:bg-slate-50 cursor-pointer">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name (A-Z)</option>
        </select>
        <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50" />
    </div>
  );
}
function OptInToggle({ optIn, setOptIn }: { optIn: boolean; setOptIn: (v: boolean) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">WhatsApp Opt-in</label>
      <div className="flex gap-2">
        <button onClick={() => setOptIn(true)} className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition ${optIn ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
          <Check className="w-4 h-4 inline mr-1" /> Opted In
        </button>
        <button onClick={() => setOptIn(false)} className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition ${!optIn ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
          <X className="w-4 h-4 inline mr-1" /> Not Opted In
        </button>
      </div>
    </div>
  );
}
function SuccessCheck({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="text-center py-6">
      <div className="w-14 h-14 rounded-full bg-whatsapp-100 flex items-center justify-center mx-auto"><Check className="w-7 h-7 text-whatsapp-600" /></div>
      <h3 className="font-bold text-slate-800 text-lg mt-4">{title}</h3>
      <p className="text-sm text-slate-500 mt-2">{desc}</p>
    </div>
  );
}
function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto"><Icon className="w-6 h-6 text-slate-300" /></div>
      <p className="text-slate-400 text-sm mt-3">{text}</p>
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
