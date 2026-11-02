import { supabase } from './supabase';
import {
  tagDefinitions, customAttributes, contacts as mockContacts,
  blockedContacts, deletedContacts, campaigns as mockCampaigns,
  templates as mockTemplates, conversations as mockConvs,
  automationFlows, teamMembers, products, waLinks, integrations,
  businessProfile, whatsappNumber,
} from '@/data/mockData';

const uid = () => crypto.randomUUID();

export async function seedUserData(userId: string) {
  // Tags
  const tagRows = tagDefinitions.map((t) => ({
    id: uid(), name: t.name, color: t.color, user_id: userId,
  }));
  const { error: tagErr } = await supabase.from('tags').insert(tagRows);
  if (tagErr) console.warn('seed tags:', tagErr.message);

  // Build a map from original tag id to new id for reference
  const tagIdMap = new Map<string, string>();
  tagDefinitions.forEach((t, i) => tagIdMap.set(t.id, tagRows[i].id));

  // Custom Attributes
  const { error: attrErr } = await supabase.from('custom_attributes').insert(
    customAttributes.map((a) => ({
      id: uid(), name: a.name, type: a.type, options: a.options, user_id: userId,
    }))
  );
  if (attrErr) console.warn('seed attrs:', attrErr.message);

  // Contacts (active + blocked + deleted)
  const allContacts = [
    ...mockContacts.map((c) => ({
      id: uid(), name: c.name, phone: c.phone, tags: c.tags, opt_in: c.optIn,
      last_seen: c.lastSeen, attributes: c.attributes, status: c.status,
      total_orders: c.totalOrders ?? 0, total_spent: c.totalSpent ?? 0,
      last_order_date: c.lastOrderDate ?? '', user_id: userId,
      created_at: c.createdAt,
    })),
    ...blockedContacts.map((c) => ({
      id: uid(), name: c.name, phone: c.phone, tags: c.tags, opt_in: c.optIn,
      last_seen: c.lastSeen, attributes: c.attributes, status: c.status,
      blocked_reason: c.blockedReason, blocked_at: c.blockedAt,
      total_orders: 0, total_spent: 0, last_order_date: '', user_id: userId,
      created_at: c.createdAt,
    })),
    ...deletedContacts.map((c) => ({
      id: uid(), name: c.name, phone: c.phone, tags: c.tags, opt_in: c.optIn,
      last_seen: c.lastSeen, attributes: c.attributes, status: c.status,
      deleted_at: c.deletedAt, total_orders: 0, total_spent: 0,
      last_order_date: '', user_id: userId, created_at: c.createdAt,
    })),
  ];
  const { error: contactErr } = await supabase.from('contacts').insert(allContacts);
  if (contactErr) console.warn('seed contacts:', contactErr.message);

  // Campaigns
  const { error: campErr } = await supabase.from('campaigns').insert(
    mockCampaigns.map((c) => ({
      id: uid(), name: c.name, template: c.template, audience: c.audience,
      recipients: c.recipients, status: c.status, sent_at: c.sentAt,
      delivered: c.delivered, read: c.read, replied: c.replied, failed: c.failed,
      user_id: userId,
    }))
  );
  if (campErr) console.warn('seed campaigns:', campErr.message);

  // Templates
  const { error: tplErr } = await supabase.from('templates').insert(
    mockTemplates.map((t) => ({
      id: uid(), name: t.name, category: t.category, language: t.language,
      header: t.header, header_type: t.headerType, body: t.body, footer: t.footer,
      buttons: t.buttons, variables: t.variables, status: t.status, user_id: userId,
      created_at: t.createdAt,
    }))
  );
  if (tplErr) console.warn('seed templates:', tplErr.message);

  // Conversations + Messages
  for (const conv of mockConvs) {
    const convId = uid();
    const { error: convErr } = await supabase.from('conversations').insert({
      id: convId, customer_name: conv.customerName, customer_phone: conv.customerPhone,
      avatar: conv.avatar, last_message: conv.lastMessage, last_message_time: conv.lastMessageTime,
      unread: conv.unread, status: conv.status, assigned_to: conv.assignedTo,
      tags: conv.tags, user_id: userId,
    });
    if (convErr) { console.warn('seed conv:', convErr.message); continue; }

    const msgs = conv.messages.map((m) => ({
      conversation_id: convId, text: m.text, time: m.time,
      direction: m.direction, agent: m.agent, user_id: userId,
    }));
    if (msgs.length > 0) {
      const { error: msgErr } = await supabase.from('messages').insert(msgs);
      if (msgErr) console.warn('seed msgs:', msgErr.message);
    }
  }

  // Automation Flows
  const { error: flowErr } = await supabase.from('automation_flows').insert(
    automationFlows.map((f) => ({
      id: uid(), name: f.name, trigger: f.trigger, trigger_detail: f.triggerDetail,
      message: f.message, delay: f.delay, status: f.status, enrolled: f.enrolled,
      sent: f.sent, conversion_rate: f.conversionRate, user_id: userId,
    }))
  );
  if (flowErr) console.warn('seed flows:', flowErr.message);

  // Team Members
  const { error: teamErr } = await supabase.from('team_members').insert(
    teamMembers.map((m) => ({
      id: uid(), name: m.name, email: m.email, phone: m.phone, role: m.role,
      status: m.status, avatar: m.avatar, last_active: m.lastActive,
      assigned_chats: m.assignedChats, user_id: userId,
    }))
  );
  if (teamErr) console.warn('seed team:', teamErr.message);

  // Products
  const { error: prodErr } = await supabase.from('products').insert(
    products.map((p) => ({
      id: uid(), name: p.name, price: p.price, original_price: p.originalPrice,
      category: p.category, image: p.image, in_stock: p.inStock,
      shares: p.shares, orders: p.orders, user_id: userId,
    }))
  );
  if (prodErr) console.warn('seed products:', prodErr.message);

  // WA Links
  const { error: linkErr } = await supabase.from('wa_links').insert(
    waLinks.map((l) => ({
      id: uid(), name: l.name, url: l.url, clicks: l.clicks, chats: l.chats,
      source: l.source, user_id: userId, created_at: l.createdAt,
    }))
  );
  if (linkErr) console.warn('seed walinks:', linkErr.message);

  // Integrations
  const { error: intErr } = await supabase.from('integrations').insert(
    integrations.map((i) => ({
      id: uid(), name: i.name, description: i.description, category: i.category,
      icon: i.icon, connected: i.connected, popular: i.popular, user_id: userId,
    }))
  );
  if (intErr) console.warn('seed integrations:', intErr.message);

  // Business Profile
  const { error: bpErr } = await supabase.from('business_profile').insert({
    business_name: businessProfile.businessName, category: businessProfile.category,
    description: businessProfile.description, address: businessProfile.address,
    website: businessProfile.website, email: businessProfile.email,
    phone: businessProfile.phone, whatsapp_number: whatsappNumber.number,
    display_name: whatsappNumber.displayName, quality_rating: whatsappNumber.qualityRating,
    messaging_limit: whatsappNumber.messagingLimit,
    green_tick_verified: whatsappNumber.greenTickVerified,
    connected_since: whatsappNumber.connectedSince, user_id: userId,
  });
  if (bpErr) console.warn('seed profile:', bpErr.message);
}
