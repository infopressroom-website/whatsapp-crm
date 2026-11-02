import { useState } from 'react';
import {
  Search, Send, Paperclip, Smile, Phone, MoreVertical,
  CheckCheck, Circle, ArrowLeft, Tag, UserCircle, Check,
  Bot, Zap, Image as ImageIcon,
} from 'lucide-react';
import { conversations as initialConvs, tagDefinitions as tagDefs, customAttributes as custAttrs, type Conversation, type ChatStatus, type Contact } from '@/data/mockData';
import { ContactProfile } from '@/components/ContactProfile';
import { useConversations, useContacts } from '@/lib/hooks';

const statusConfig: Record<ChatStatus, { color: string; bg: string; dot: string }> = {
  Open: { color: 'text-whatsapp-600', bg: 'bg-whatsapp-100', dot: 'bg-whatsapp-500' },
  Pending: { color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' },
  Resolved: { color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
};

const quickReplies = [
  'Thank you for reaching out! How can I help you?',
  'Your order is on the way and will arrive soon.',
  'Here is a 10% discount code: SAVE10',
  'Our store is open 10 AM - 9 PM, all days.',
];

export default function LiveChat() {
  const { convs, sendMessage, resolveChat: resolveChatDb, markRead } = useConversations();
  const { list: contactList } = useContacts();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ChatStatus | 'All'>('All');
  const [draft, setDraft] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [profileContact, setProfileContact] = useState<Contact | null>(null);

  const filtered = convs.filter((c) => {
    const matchSearch = c.customerName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const active = convs.find((c) => c.id === activeId) ?? null;

  const findContactForConv = (conv: Conversation | null): Contact | null => {
    if (!conv) return null;
    return contactList.find((c) => c.phone === conv.customerPhone) ?? null;
  };

  const handleSend = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft);
    setDraft('');
  };

  const handleQuickReply = (text: string) => {
    if (!active) return;
    sendMessage(active.id, text);
  };

  const openChat = (id: string) => {
    setActiveId(id);
    markRead(id);
    setShowMobileChat(true);
  };

  const resolveChat = () => {
    if (!active) return;
    resolveChatDb(active.id);
  };

  return (
    <div className="animate-fade-in-up bg-white rounded-xl border border-slate-200 overflow-hidden flex h-[calc(100vh-140px)]">
      {/* Conversation list */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-80 border-r border-slate-200 shrink-0`}>
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(['All', 'Open', 'Pending', 'Resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  filter === f ? 'bg-whatsapp-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((c) => {
            const sc = statusConfig[c.status];
            return (
              <button
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`w-full flex items-start gap-3 p-3 border-b border-slate-50 text-left transition hover:bg-slate-50 ${
                  activeId === c.id ? 'bg-whatsapp-50/60' : ''
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-sm font-semibold shrink-0 relative">
                  {c.avatar}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${sc.dot}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700 truncate">{c.customerName}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{c.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${sc.bg} ${sc.color}`}>
                      {c.status}
                    </span>
                    {c.unread > 0 && (
                      <span className="text-[9px] bg-whatsapp-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {c.unread}
                      </span>
                    )}
                    {c.assignedTo && (
                      <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                        <UserCircle className="w-3 h-3" /> {c.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className={`${showMobileChat ? 'flex' : 'hidden'} md:flex flex-col flex-1 min-w-0`}>
        {active ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setShowMobileChat(false)} className="md:hidden text-slate-400">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {active.avatar}
                </div>
                <div className="min-w-0">
                  <button onClick={() => setProfileContact(findContactForConv(active))} className="font-semibold text-slate-700 text-sm truncate hover:text-whatsapp-600 transition text-left">{active.customerName}</button>
                  <p className="text-xs text-slate-400">{active.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {active.tags.map((t) => (
                  <span key={t} className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {t}
                  </span>
                ))}
                <button onClick={resolveChat} className="ml-1 text-xs font-medium text-whatsapp-600 bg-whatsapp-50 px-3 py-1.5 rounded-lg hover:bg-whatsapp-100 transition flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Resolve
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2 bg-[#e5ddd5]" style={{ backgroundColor: '#e5ddd5' }}>
              {active.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'out' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                      msg.direction === 'out'
                        ? 'bg-whatsapp-500 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 rounded-tl-none'
                    }`}
                  >
                    {msg.direction === 'out' && msg.agent && (
                      <p className="text-[10px] font-semibold text-whatsapp-100 mb-0.5">{msg.agent}</p>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-0.5 mt-1 ${msg.direction === 'out' ? 'text-white/70' : 'text-slate-400'}`}>
                      <span className="text-[10px]">{msg.time}</span>
                      {msg.direction === 'out' && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
              {/* Automation hint */}
              {active.status === 'Open' && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic px-2 py-1">
                  <Bot className="w-3.5 h-3.5" />
                  Automation: "Welcome New Customer" flow was triggered for this chat
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                  <Zap className="w-3 h-3" /> Quick:
                </span>
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleQuickReply(qr)}
                    className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-whatsapp-50 hover:text-whatsapp-700 transition whitespace-nowrap border border-slate-200"
                  >
                    {qr.length > 30 ? qr.slice(0, 30) + '...' : qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg hidden sm:block">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                className={`p-2.5 rounded-lg transition ${
                  draft.trim() ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600' : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <Send className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-400 mt-4 text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer info panel — hidden on small screens */}
      {active && (
        <div className="hidden xl:flex flex-col w-64 border-l border-slate-200 p-4 space-y-4 shrink-0">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-xl font-semibold mx-auto">
              {active.avatar}
            </div>
            <button onClick={() => setProfileContact(findContactForConv(active))} className="font-semibold text-slate-700 text-sm mt-2 hover:text-whatsapp-600 transition">
              {active.customerName}
            </button>
            <p className="text-xs text-slate-400">{active.customerPhone}</p>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {active.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Assigned To</p>
            <p className="text-sm text-slate-600">{active.assignedTo ?? 'Unassigned'}</p>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Status</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusConfig[active.status].bg} ${statusConfig[active.status].color}`}>
              {active.status}
            </span>
          </div>
        </div>
      )}

      {/* Contact Profile Drawer */}
      <ContactProfile
        contact={profileContact}
        tagDefs={tagDefs}
        attrs={custAttrs}
        onClose={() => setProfileContact(null)}
      />
    </div>
  );
}
