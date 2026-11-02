import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
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

// ── Contacts ──
export function useContacts() {
  const [list, setList] = useState<Contact[]>([]);
  const [blocked, setBlocked] = useState<Contact[]>([]);
  const [deleted, setDeleted] = useState<Contact[]>([]);
  const [tagDefs, setTagDefs] = useState<TagDef[]>([]);
  const [attrs, setAttrs] = useState<CustomAttribute[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: c }, { data: t }, { data: a }] = await Promise.all([
      supabase.from('contacts').select('*'),
      supabase.from('tags').select('*'),
      supabase.from('custom_attributes').select('*'),
    ]);

    const toContact = (r: Record<string, unknown>): Contact => ({
      id: r.id as string,
      name: r.name as string,
      phone: r.phone as string,
      tags: r.tags as string[] ?? [],
      optIn: r.opt_in as boolean,
      lastSeen: r.last_seen as string,
      createdAt: r.created_at ? new Date(r.created_at as string).toISOString().split('T')[0] : '',
      attributes: r.attributes as Record<string, string> ?? {},
      status: r.status as Contact['status'],
      blockedReason: r.blocked_reason as string | undefined,
      blockedAt: r.blocked_at as string | undefined,
      deletedAt: r.deleted_at as string | undefined,
      totalOrders: r.total_orders as number | undefined,
      totalSpent: r.total_spent as number | undefined,
      lastOrderDate: r.last_order_date as string | undefined,
    });

    if (c) {
      setList(c.filter((r) => r.status === 'Active').map(toContact));
      setBlocked(c.filter((r) => r.status === 'Blocked').map(toContact));
      setDeleted(c.filter((r) => r.status === 'Deleted').map(toContact));
    }
    if (t) setTagDefs(t.map((r) => ({ id: r.id as string, name: r.name as string, color: r.color as string })));
    if (a) setAttrs(a.map((r) => ({ id: r.id as string, name: r.name as string, type: r.type as CustomAttribute['type'], options: r.options as string[] | undefined })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addContact = async (c: Partial<Contact>) => {
    const { error } = await supabase.from('contacts').insert({
      name: c.name, phone: c.phone, tags: c.tags ?? [], opt_in: c.optIn ?? true,
      attributes: c.attributes ?? {}, status: 'Active',
      total_orders: 0, total_spent: 0, last_order_date: '',
    });
    if (!error) await load();
    return error;
  };

  const updateContact = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase.from('contacts').update(updates).eq('id', id);
    if (!error) await load();
    return error;
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from('contacts').update({
      status: 'Deleted', deleted_at: new Date().toISOString().split('T')[0],
    }).eq('id', id);
    if (!error) await load();
    return error;
  };

  const blockContact = async (id: string, reason: string) => {
    const { error } = await supabase.from('contacts').update({
      status: 'Blocked', blocked_reason: reason, blocked_at: new Date().toISOString().split('T')[0],
    }).eq('id', id);
    if (!error) await load();
    return error;
  };

  const unblockContact = async (id: string) => {
    const { error } = await supabase.from('contacts').update({
      status: 'Active', blocked_reason: null, blocked_at: null,
    }).eq('id', id);
    if (!error) await load();
    return error;
  };

  const restoreContact = async (id: string) => {
    const { error } = await supabase.from('contacts').update({
      status: 'Active', deleted_at: null,
    }).eq('id', id);
    if (!error) await load();
    return error;
  };

  const permanentDelete = async (id: string) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  const createTag = async (name: string, color: string) => {
    const { error } = await supabase.from('tags').insert({ name, color });
    if (!error) await load();
    return error;
  };

  const deleteTag = async (id: string) => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  const updateTagColor = async (id: string, color: string) => {
    const { error } = await supabase.from('tags').update({ color }).eq('id', id);
    if (!error) await load();
    return error;
  };

  const createAttr = async (name: string, type: CustomAttribute['type'], options?: string[]) => {
    const { error } = await supabase.from('custom_attributes').insert({ name, type, options });
    if (!error) await load();
    return error;
  };

  const deleteAttr = async (id: string) => {
    const { error } = await supabase.from('custom_attributes').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return {
    list, blocked, deleted, tagDefs, attrs, loading,
    addContact, updateContact, deleteContact, blockContact,
    unblockContact, restoreContact, permanentDelete,
    createTag, deleteTag, updateTagColor, createAttr, deleteAttr,
    reload: load,
  };
}

// ── Campaigns ──
export function useCampaigns() {
  const [list, setList] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, template: r.template as string,
        audience: r.audience as string, recipients: r.recipients as number,
        status: r.status as Campaign['status'], sentAt: r.sent_at as string,
        delivered: r.delivered as number, read: r.read as number,
        replied: r.replied as number, failed: r.failed as number,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createCampaign = async (c: Partial<Campaign>) => {
    const { error } = await supabase.from('campaigns').insert({
      name: c.name, template: c.template, audience: c.audience,
      recipients: c.recipients ?? 0, status: c.status ?? 'Draft',
      sent_at: c.sentAt ?? '—', delivered: 0, read: 0, replied: 0, failed: 0,
    });
    if (!error) await load();
    return error;
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, createCampaign, deleteCampaign, reload: load };
}

// ── Templates ──
export function useTemplates() {
  const [list, setList] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, category: r.category as Template['category'],
        language: r.language as string, header: r.header as string,
        headerType: r.header_type as Template['headerType'], body: r.body as string,
        footer: r.footer as string | undefined, buttons: r.buttons as Template['buttons'],
        variables: r.variables as string[], status: r.status as Template['status'],
        createdAt: r.created_at ? new Date(r.created_at as string).toISOString().split('T')[0] : '',
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createTemplate = async (t: Partial<Template>) => {
    const { error } = await supabase.from('templates').insert({
      name: t.name, category: t.category ?? 'Marketing', language: t.language ?? 'English',
      header: t.header ?? '', header_type: t.headerType ?? 'text', body: t.body ?? '',
      footer: t.footer, buttons: t.buttons ?? [], variables: t.variables ?? [],
      status: t.status ?? 'Pending',
    });
    if (!error) await load();
    return error;
  };

  const deleteTemplate = async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, createTemplate, deleteTemplate, reload: load };
}

// ── Conversations (LiveChat) ──
export function useConversations() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: convData } = await supabase.from('conversations').select('*').order('created_at', { ascending: false });
    if (!convData) { setLoading(false); return; }

    const convIds = convData.map((c) => c.id);
    const { data: msgData } = await supabase.from('messages').select('*').in('conversation_id', convIds).order('created_at', { ascending: true });

    const msgMap = new Map<string, ChatMessage[]>();
    if (msgData) {
      for (const m of msgData) {
        const arr = msgMap.get(m.conversation_id) ?? [];
        arr.push({
          id: m.id as string, text: m.text as string, time: m.time as string,
          direction: m.direction as ChatMessage['direction'], agent: m.agent as string | undefined,
        });
        msgMap.set(m.conversation_id, arr);
      }
    }

    setConvs(convData.map((r) => ({
      id: r.id as string, customerName: r.customer_name as string,
      customerPhone: r.customer_phone as string, avatar: r.avatar as string,
      lastMessage: r.last_message as string, lastMessageTime: r.last_message_time as string,
      unread: r.unread as number, status: r.status as Conversation['status'],
      assignedTo: r.assigned_to as string | null, tags: r.tags as string[],
      messages: msgMap.get(r.id as string) ?? [],
    })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sendMessage = async (convId: string, text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { error } = await supabase.from('messages').insert({
      conversation_id: convId, text, time, direction: 'out', agent: 'You',
    });
    if (!error) {
      await supabase.from('conversations').update({
        last_message: text, last_message_time: 'Just now', unread: 0,
      }).eq('id', convId);
      await load();
    }
    return error;
  };

  const resolveChat = async (convId: string) => {
    const { error } = await supabase.from('conversations').update({ status: 'Resolved' }).eq('id', convId);
    if (!error) await load();
    return error;
  };

  const markRead = async (convId: string) => {
    const { error } = await supabase.from('conversations').update({ unread: 0 }).eq('id', convId);
    if (!error) await load();
    return error;
  };

  return { convs, loading, sendMessage, resolveChat, markRead, reload: load };
}

// ── Automation Flows ──
export function useAutomationFlows() {
  const [list, setList] = useState<AutomationFlow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('automation_flows').select('*').order('created_at', { ascending: false });
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, trigger: r.trigger as AutomationFlow['trigger'],
        triggerDetail: r.trigger_detail as string, message: r.message as string,
        delay: r.delay as string, status: r.status as AutomationFlow['status'],
        enrolled: r.enrolled as number, sent: r.sent as number,
        conversionRate: r.conversion_rate as number,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleFlow = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    const { error } = await supabase.from('automation_flows').update({ status: newStatus }).eq('id', id);
    if (!error) await load();
    return error;
  };

  const deleteFlow = async (id: string) => {
    const { error } = await supabase.from('automation_flows').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, toggleFlow, deleteFlow, reload: load };
}

// ── Team Members ──
export function useTeamMembers() {
  const [list, setList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, email: r.email as string,
        phone: r.phone as string, role: r.role as TeamMember['role'],
        status: r.status as TeamMember['status'], avatar: r.avatar as string,
        lastActive: r.last_active as string, assignedChats: r.assigned_chats as number,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addMember = async (m: Partial<TeamMember>) => {
    const { error } = await supabase.from('team_members').insert({
      name: m.name, email: m.email, phone: m.phone ?? '', role: m.role ?? 'Agent',
      status: 'Invited', avatar: m.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? '',
      last_active: '—', assigned_chats: 0,
    });
    if (!error) await load();
    return error;
  };

  const updateMember = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase.from('team_members').update(updates).eq('id', id);
    if (!error) await load();
    return error;
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, addMember, updateMember, deleteMember, reload: load };
}

// ── Products ──
export function useProducts() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, price: r.price as number,
        originalPrice: r.original_price as number | undefined,
        category: r.category as string, image: r.image as string,
        inStock: r.in_stock as boolean, shares: r.shares as number, orders: r.orders as number,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addProduct = async (p: Partial<Product>) => {
    const { error } = await supabase.from('products').insert({
      name: p.name, price: p.price ?? 0, original_price: p.originalPrice,
      category: p.category ?? '', image: p.image ?? '', in_stock: p.inStock ?? true,
      shares: 0, orders: 0,
    });
    if (!error) await load();
    return error;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, addProduct, deleteProduct, reload: load };
}

// ── WA Links ──
export function useWaLinks() {
  const [list, setList] = useState<WaLink[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('wa_links').select('*').order('created_at', { ascending: false });
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, url: r.url as string,
        clicks: r.clicks as number, chats: r.chats as number,
        source: r.source as string,
        createdAt: r.created_at ? new Date(r.created_at as string).toISOString().split('T')[0] : '',
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addLink = async (l: Partial<WaLink>) => {
    const { error } = await supabase.from('wa_links').insert({
      name: l.name, url: l.url, source: l.source ?? 'Manual',
    });
    if (!error) await load();
    return error;
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from('wa_links').delete().eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, addLink, deleteLink, reload: load };
}

// ── Integrations ──
export function useIntegrations() {
  const [list, setList] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('integrations').select('*');
    if (data) {
      setList(data.map((r) => ({
        id: r.id as string, name: r.name as string, description: r.description as string,
        category: r.category as string, icon: r.icon as string,
        connected: r.connected as boolean, popular: r.popular as boolean | undefined,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleIntegration = async (id: string, connected: boolean) => {
    const { error } = await supabase.from('integrations').update({ connected: !connected }).eq('id', id);
    if (!error) await load();
    return error;
  };

  return { list, loading, toggleIntegration, reload: load };
}
