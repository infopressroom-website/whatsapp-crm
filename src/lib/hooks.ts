import { useState, useCallback, useEffect } from 'react';
import {
  tagDefinitions as mockTagDefs, customAttributes as mockAttrs,
  contacts as mockContacts, blockedContacts as mockBlocked,
  deletedContacts as mockDeleted, campaigns as mockCampaigns,
  templates as mockTemplates, conversations as mockConvs,
  automationFlows as mockFlows, teamMembers as mockTeam,
  products as mockProducts, waLinks as mockWaLinks,
  integrations as mockIntegrations,
  type Contact, type TagDef, type CustomAttribute,
  type Campaign, type Template, type Conversation, type ChatMessage,
  type AutomationFlow, type TeamMember, type Product, type WaLink,
  type Integration,
} from '@/data/mockData';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const today = () => new Date().toISOString().split('T')[0];
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ── Contacts ──
export function useContacts() {
  const [list, setList] = useState<Contact[]>(mockContacts);
  const [blocked, setBlocked] = useState<Contact[]>(mockBlocked);
  const [deleted, setDeleted] = useState<Contact[]>(mockDeleted);
  const [tagDefs, setTagDefs] = useState<TagDef[]>(mockTagDefs);
  const [attrs, setAttrs] = useState<CustomAttribute[]>(mockAttrs);
  const [loading] = useState(false);

  const addContact = async (c: Partial<Contact>) => {
    setList((prev) => [
      {
        id: uid(), name: c.name ?? '', phone: c.phone ?? '', tags: c.tags ?? [],
        optIn: c.optIn ?? true, lastSeen: 'Just now', createdAt: today(),
        attributes: c.attributes ?? {}, status: 'Active',
        totalOrders: 0, totalSpent: 0, lastOrderDate: '',
      },
      ...prev,
    ]);
    return null;
  };

  const updateContact = async (id: string, updates: Record<string, unknown>) => {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } as Contact : c)));
    return null;
  };

  const deleteContact = async (id: string) => {
    const contact = list.find((c) => c.id === id);
    setList((prev) => prev.filter((c) => c.id !== id));
    if (contact) setDeleted((prev) => [{ ...contact, status: 'Deleted', deletedAt: today() }, ...prev]);
    return null;
  };

  const blockContact = async (id: string, reason: string) => {
    const contact = list.find((c) => c.id === id);
    setList((prev) => prev.filter((c) => c.id !== id));
    if (contact) setBlocked((prev) => [{ ...contact, status: 'Blocked', blockedReason: reason, blockedAt: today() }, ...prev]);
    return null;
  };

  const unblockContact = async (id: string) => {
    const contact = blocked.find((c) => c.id === id);
    setBlocked((prev) => prev.filter((c) => c.id !== id));
    if (contact) setList((prev) => [{ ...contact, status: 'Active', blockedReason: undefined, blockedAt: undefined }, ...prev]);
    return null;
  };

  const restoreContact = async (id: string) => {
    const contact = deleted.find((c) => c.id === id);
    setDeleted((prev) => prev.filter((c) => c.id !== id));
    if (contact) setList((prev) => [{ ...contact, status: 'Active', deletedAt: undefined }, ...prev]);
    return null;
  };

  const permanentDelete = async (id: string) => {
    setDeleted((prev) => prev.filter((c) => c.id !== id));
    return null;
  };

  const createTag = async (name: string, color: string) => {
    setTagDefs((prev) => [...prev, { id: uid(), name, color }]);
    return null;
  };

  const deleteTag = async (id: string) => {
    setTagDefs((prev) => prev.filter((t) => t.id !== id));
    return null;
  };

  const updateTagColor = async (id: string, color: string) => {
    setTagDefs((prev) => prev.map((t) => (t.id === id ? { ...t, color } : t)));
    return null;
  };

  const createAttr = async (name: string, type: CustomAttribute['type'], options?: string[]) => {
    setAttrs((prev) => [...prev, { id: uid(), name, type, options }]);
    return null;
  };

  const deleteAttr = async (id: string) => {
    setAttrs((prev) => prev.filter((a) => a.id !== id));
    return null;
  };

  return {
    list, blocked, deleted, tagDefs, attrs, loading,
    addContact, updateContact, deleteContact, blockContact,
    unblockContact, restoreContact, permanentDelete,
    createTag, deleteTag, updateTagColor, createAttr, deleteAttr,
    reload: async () => {},
  };
}

// ── Campaigns ──
export function useCampaigns() {
  const [list, setList] = useState<Campaign[]>(mockCampaigns);
  const [loading] = useState(false);

  const createCampaign = async (c: Partial<Campaign>) => {
    setList((prev) => [
      {
        id: uid(), name: c.name ?? '', template: c.template ?? '',
        audience: c.audience ?? '', recipients: c.recipients ?? 0,
        status: c.status ?? 'Draft', sentAt: c.sentAt ?? '—',
        delivered: 0, read: 0, replied: 0, failed: 0,
      },
      ...prev,
    ]);
    return null;
  };

  const deleteCampaign = async (id: string) => {
    setList((prev) => prev.filter((c) => c.id !== id));
    return null;
  };

  return { list, loading, createCampaign, deleteCampaign, reload: async () => {} };
}

// ── Templates ──
export function useTemplates() {
  const [list, setList] = useState<Template[]>(mockTemplates);
  const [loading] = useState(false);

  const createTemplate = async (t: Partial<Template>) => {
    setList((prev) => [
      {
        id: uid(), name: t.name ?? '', category: t.category ?? 'Marketing',
        language: t.language ?? 'English', header: t.header ?? '',
        headerType: t.headerType ?? 'text', body: t.body ?? '',
        footer: t.footer, buttons: t.buttons ?? [], variables: t.variables ?? [],
        status: t.status ?? 'Pending', createdAt: today(),
      },
      ...prev,
    ]);
    return null;
  };

  const deleteTemplate = async (id: string) => {
    setList((prev) => prev.filter((t) => t.id !== id));
    return null;
  };

  return { list, loading, createTemplate, deleteTemplate, reload: async () => {} };
}

// ── Conversations (LiveChat) ──
export function useConversations() {
  const [convs, setConvs] = useState<Conversation[]>(mockConvs);
  const [loading] = useState(false);

  const sendMessage = async (convId: string, text: string) => {
    const msg: ChatMessage = { id: uid(), text, time: nowTime(), direction: 'out', agent: 'You' };
    setConvs((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, msg], lastMessage: text, lastMessageTime: 'Just now', unread: 0 }
          : c,
      ),
    );
    return null;
  };

  const resolveChat = async (convId: string) => {
    setConvs((prev) => prev.map((c) => (c.id === convId ? { ...c, status: 'Resolved' } : c)));
    return null;
  };

  const markRead = async (convId: string) => {
    setConvs((prev) => prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)));
    return null;
  };

  return { convs, loading, sendMessage, resolveChat, markRead, reload: async () => {} };
}

// ── Automation Flows ──
export function useAutomationFlows() {
  const [list, setList] = useState<AutomationFlow[]>(mockFlows);
  const [loading] = useState(false);

  const toggleFlow = async (id: string, currentStatus: string) => {
    const newStatus: AutomationFlow['status'] = currentStatus === 'Active' ? 'Paused' : 'Active';
    setList((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)));
    return null;
  };

  const deleteFlow = async (id: string) => {
    setList((prev) => prev.filter((f) => f.id !== id));
    return null;
  };

  const createFlow = async (f: Partial<AutomationFlow>) => {
    setList((prev) => [
      {
        id: uid(), name: f.name ?? '', trigger: f.trigger ?? 'New Customer',
        triggerDetail: f.triggerDetail ?? '', message: f.message ?? '',
        delay: f.delay ?? 'Immediately', status: f.status ?? 'Active',
        enrolled: 0, sent: 0, conversionRate: 0,
      },
      ...prev,
    ]);
    return null;
  };

  return { list, loading, toggleFlow, deleteFlow, createFlow, reload: async () => {} };
}

// ── Team Members ──
export function useTeamMembers() {
  const [list, setList] = useState<TeamMember[]>(mockTeam);
  const [loading] = useState(false);

  const addMember = async (m: Partial<TeamMember>) => {
    setList((prev) => [
      {
        id: uid(), name: m.name ?? '', email: m.email ?? '', phone: m.phone ?? '',
        role: m.role ?? 'Agent', status: 'Invited',
        avatar: m.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? '',
        lastActive: '—', assignedChats: 0,
      },
      ...prev,
    ]);
    return null;
  };

  const updateMember = async (id: string, updates: Record<string, unknown>) => {
    setList((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } as TeamMember : m)));
    return null;
  };

  const deleteMember = async (id: string) => {
    setList((prev) => prev.filter((m) => m.id !== id));
    return null;
  };

  return { list, loading, addMember, updateMember, deleteMember, reload: async () => {} };
}

// ── Products ──
export function useProducts() {
  const [list, setList] = useState<Product[]>(mockProducts);
  const [loading] = useState(false);

  const addProduct = async (p: Partial<Product>) => {
    setList((prev) => [
      {
        id: uid(), name: p.name ?? '', price: p.price ?? 0, originalPrice: p.originalPrice,
        category: p.category ?? '', image: p.image ?? '', inStock: p.inStock ?? true,
        shares: 0, orders: 0,
      },
      ...prev,
    ]);
    return null;
  };

  const deleteProduct = async (id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id));
    return null;
  };

  return { list, loading, addProduct, deleteProduct, reload: async () => {} };
}

// ── WA Links ──
export function useWaLinks() {
  const [list, setList] = useState<WaLink[]>(mockWaLinks);
  const [loading] = useState(false);

  const addLink = async (l: Partial<WaLink>) => {
    setList((prev) => [
      {
        id: uid(), name: l.name ?? '', url: l.url ?? '', clicks: 0, chats: 0,
        source: l.source ?? 'Manual', createdAt: today(),
      },
      ...prev,
    ]);
    return null;
  };

  const deleteLink = async (id: string) => {
    setList((prev) => prev.filter((l) => l.id !== id));
    return null;
  };

  return { list, loading, addLink, deleteLink, reload: async () => {} };
}

// ── Integrations ──
export function useIntegrations() {
  const [list, setList] = useState<Integration[]>(mockIntegrations);
  const [loading] = useState(false);

  const toggleIntegration = async (id: string, connected: boolean) => {
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, connected: !connected } : i)));
    return null;
  };

  return { list, loading, toggleIntegration, reload: async () => {} };
}
