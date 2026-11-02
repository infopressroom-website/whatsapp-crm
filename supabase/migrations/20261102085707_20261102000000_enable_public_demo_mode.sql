/*
# Enable public demo mode

1. Purpose
- Remove the sign-in dependency from the shared demo application.
- The dashboard intentionally uses one pre-seeded demo workspace, so visitors can open it immediately.

2. Modified tables
- `tags`, `custom_attributes`, `contacts`, `campaigns`, `templates`, `conversations`, `messages`, `automation_flows`, `team_members`, `products`, `wa_links`, `integrations`, and `business_profile` now default `user_id` to the shared demo user.
- Existing authenticated owner policies remain available for future account-based use.

3. Security
- Grants allow the anon and authenticated application roles to use the demo tables.
- Separate anon CRUD policies intentionally expose only the shared demo workspace data used by this public preview.

4. Important notes
- This is demo mode, not private multi-user storage.
- No existing rows are deleted or modified.
*/

ALTER TABLE tags ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE custom_attributes ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE contacts ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE campaigns ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE templates ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE conversations ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE messages ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE automation_flows ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE team_members ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE products ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE wa_links ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE integrations ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
ALTER TABLE business_profile ALTER COLUMN user_id SET DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;

GRANT SELECT, INSERT, UPDATE, DELETE ON tags, custom_attributes, contacts, campaigns, templates, conversations, messages, automation_flows, team_members, products, wa_links, integrations, business_profile TO anon, authenticated;

DROP POLICY IF EXISTS "public_demo_tags" ON tags;
CREATE POLICY "public_demo_tags" ON tags FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_custom_attributes" ON custom_attributes;
CREATE POLICY "public_demo_custom_attributes" ON custom_attributes FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_contacts" ON contacts;
CREATE POLICY "public_demo_contacts" ON contacts FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_campaigns" ON campaigns;
CREATE POLICY "public_demo_campaigns" ON campaigns FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_templates" ON templates;
CREATE POLICY "public_demo_templates" ON templates FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_conversations" ON conversations;
CREATE POLICY "public_demo_conversations" ON conversations FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_messages" ON messages;
CREATE POLICY "public_demo_messages" ON messages FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_automation_flows" ON automation_flows;
CREATE POLICY "public_demo_automation_flows" ON automation_flows FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_team_members" ON team_members;
CREATE POLICY "public_demo_team_members" ON team_members FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_products" ON products;
CREATE POLICY "public_demo_products" ON products FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_wa_links" ON wa_links;
CREATE POLICY "public_demo_wa_links" ON wa_links FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_integrations" ON integrations;
CREATE POLICY "public_demo_integrations" ON integrations FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
DROP POLICY IF EXISTS "public_demo_business_profile" ON business_profile;
CREATE POLICY "public_demo_business_profile" ON business_profile FOR ALL TO anon USING (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid) WITH CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
