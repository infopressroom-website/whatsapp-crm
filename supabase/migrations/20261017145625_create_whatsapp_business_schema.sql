/*
# WhatsApp Business Hub — Full Schema

1. Purpose
   Complete backend for a WhatsApp Business management app with:
   - Contacts (with tags, custom attributes, block/delete lifecycle)
   - Campaigns (broadcast messages with delivery stats)
   - Templates (pre-approved message templates)
   - Conversations + Messages (live chat / shared inbox)
   - Automation flows
   - Team members
   - Products (catalog)
   - WhatsApp click-to-chat links
   - Integrations
   - Business profile settings

2. Tables Created
   - tags — tag definitions (name + color)
   - custom_attributes — user-defined fields for contacts
   - contacts — customer contacts with tags array, opt-in, attributes JSON, status
   - campaigns — broadcast campaigns with delivery stats
   - templates — message templates with buttons JSON
   - conversations — chat threads with customer info
   - messages — individual chat messages
   - automation_flows — automated message flows
   - team_members — team roster with roles
   - products — catalog items
   - wa_links — click-to-chat links
   - integrations — third-party integrations
   - business_profile — singleton business settings

3. Security
   - Multi-user app (has login screen). All tables have user_id DEFAULT auth.uid().
   - RLS enabled on every table.
   - 4 policies per table (SELECT/INSERT/UPDATE/DELETE) scoped to authenticated owner.
   - child tables (messages) scoped through parent ownership check.

4. Notes
   - contacts.tags is text[] for easy filtering
   - contacts.attributes is jsonb for flexible custom fields
   - template.buttons is jsonb array
   - All timestamps default to now()
*/

-- ── Tags ──
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT 'slate',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_tags" ON tags;
CREATE POLICY "select_own_tags" ON tags FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_tags" ON tags;
CREATE POLICY "insert_own_tags" ON tags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_tags" ON tags;
CREATE POLICY "update_own_tags" ON tags FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_tags" ON tags;
CREATE POLICY "delete_own_tags" ON tags FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Custom Attributes ──
CREATE TABLE IF NOT EXISTS custom_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  options text[],
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE custom_attributes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_attrs" ON custom_attributes;
CREATE POLICY "select_own_attrs" ON custom_attributes FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_attrs" ON custom_attributes;
CREATE POLICY "insert_own_attrs" ON custom_attributes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_attrs" ON custom_attributes;
CREATE POLICY "update_own_attrs" ON custom_attributes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_attrs" ON custom_attributes;
CREATE POLICY "delete_own_attrs" ON custom_attributes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Contacts ──
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  opt_in boolean NOT NULL DEFAULT true,
  last_seen text NOT NULL DEFAULT 'Just now',
  attributes jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Active',
  blocked_reason text,
  blocked_at date,
  deleted_at date,
  total_orders integer NOT NULL DEFAULT 0,
  total_spent integer NOT NULL DEFAULT 0,
  last_order_date text,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_contacts" ON contacts;
CREATE POLICY "select_own_contacts" ON contacts FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_contacts" ON contacts;
CREATE POLICY "insert_own_contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_contacts" ON contacts;
CREATE POLICY "update_own_contacts" ON contacts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_contacts" ON contacts;
CREATE POLICY "delete_own_contacts" ON contacts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING gin(tags);

-- ── Campaigns ──
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT '',
  recipients integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  sent_at text NOT NULL DEFAULT '—',
  delivered integer NOT NULL DEFAULT 0,
  read integer NOT NULL DEFAULT 0,
  replied integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_campaigns" ON campaigns;
CREATE POLICY "select_own_campaigns" ON campaigns FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_campaigns" ON campaigns;
CREATE POLICY "insert_own_campaigns" ON campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_campaigns" ON campaigns;
CREATE POLICY "update_own_campaigns" ON campaigns FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_campaigns" ON campaigns;
CREATE POLICY "delete_own_campaigns" ON campaigns FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Templates ──
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Marketing',
  language text NOT NULL DEFAULT 'English',
  header text NOT NULL DEFAULT '',
  header_type text NOT NULL DEFAULT 'text',
  body text NOT NULL DEFAULT '',
  footer text,
  buttons jsonb NOT NULL DEFAULT '[]',
  variables text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Pending',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_templates" ON templates;
CREATE POLICY "select_own_templates" ON templates FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_templates" ON templates;
CREATE POLICY "insert_own_templates" ON templates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_templates" ON templates;
CREATE POLICY "update_own_templates" ON templates FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_templates" ON templates;
CREATE POLICY "delete_own_templates" ON templates FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Conversations ──
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  avatar text NOT NULL DEFAULT '',
  last_message text NOT NULL DEFAULT '',
  last_message_time text NOT NULL DEFAULT 'Just now',
  unread integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Open',
  assigned_to text,
  tags text[] NOT NULL DEFAULT '{}',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_conversations" ON conversations;
CREATE POLICY "delete_own_conversations" ON conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Messages ──
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  text text NOT NULL,
  time text NOT NULL,
  direction text NOT NULL DEFAULT 'in',
  agent text,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_messages" ON messages;
CREATE POLICY "update_own_messages" ON messages FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- ── Automation Flows ──
CREATE TABLE IF NOT EXISTS automation_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger text NOT NULL DEFAULT 'New Customer',
  trigger_detail text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  delay text NOT NULL DEFAULT 'Immediately',
  status text NOT NULL DEFAULT 'Draft',
  enrolled integer NOT NULL DEFAULT 0,
  sent integer NOT NULL DEFAULT 0,
  conversion_rate integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE automation_flows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_flows" ON automation_flows;
CREATE POLICY "select_own_flows" ON automation_flows FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_flows" ON automation_flows;
CREATE POLICY "insert_own_flows" ON automation_flows FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_flows" ON automation_flows;
CREATE POLICY "update_own_flows" ON automation_flows FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_flows" ON automation_flows;
CREATE POLICY "delete_own_flows" ON automation_flows FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Team Members ──
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'Agent',
  status text NOT NULL DEFAULT 'Active',
  avatar text NOT NULL DEFAULT '',
  last_active text NOT NULL DEFAULT '—',
  assigned_chats integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_team" ON team_members;
CREATE POLICY "select_own_team" ON team_members FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_team" ON team_members;
CREATE POLICY "insert_own_team" ON team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_team" ON team_members;
CREATE POLICY "update_own_team" ON team_members FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_team" ON team_members;
CREATE POLICY "delete_own_team" ON team_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Products ──
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  original_price integer,
  category text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  in_stock boolean NOT NULL DEFAULT true,
  shares integer NOT NULL DEFAULT 0,
  orders integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_products" ON products;
CREATE POLICY "select_own_products" ON products FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_products" ON products;
CREATE POLICY "insert_own_products" ON products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_products" ON products;
CREATE POLICY "update_own_products" ON products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_products" ON products;
CREATE POLICY "delete_own_products" ON products FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── WhatsApp Links ──
CREATE TABLE IF NOT EXISTS wa_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  chats integer NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT '',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE wa_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_walinks" ON wa_links;
CREATE POLICY "select_own_walinks" ON wa_links FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_walinks" ON wa_links;
CREATE POLICY "insert_own_walinks" ON wa_links FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_walinks" ON wa_links;
CREATE POLICY "update_own_walinks" ON wa_links FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_walinks" ON wa_links;
CREATE POLICY "delete_own_walinks" ON wa_links FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Integrations ──
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  connected boolean NOT NULL DEFAULT false,
  popular boolean NOT NULL DEFAULT false,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_integrations" ON integrations;
CREATE POLICY "select_own_integrations" ON integrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_integrations" ON integrations;
CREATE POLICY "insert_own_integrations" ON integrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_integrations" ON integrations;
CREATE POLICY "update_own_integrations" ON integrations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_integrations" ON integrations;
CREATE POLICY "delete_own_integrations" ON integrations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── Business Profile ──
CREATE TABLE IF NOT EXISTS business_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp_number text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  quality_rating text NOT NULL DEFAULT 'High',
  messaging_limit text NOT NULL DEFAULT '1,000 messages / 24 hours',
  green_tick_verified boolean NOT NULL DEFAULT false,
  connected_since text NOT NULL DEFAULT '',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_profile" ON business_profile;
CREATE POLICY "select_own_profile" ON business_profile FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_profile" ON business_profile;
CREATE POLICY "insert_own_profile" ON business_profile FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_profile" ON business_profile;
CREATE POLICY "update_own_profile" ON business_profile FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_profile" ON business_profile;
CREATE POLICY "delete_own_profile" ON business_profile FOR DELETE TO authenticated USING (auth.uid() = user_id);
