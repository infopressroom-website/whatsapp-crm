export type CampaignStatus = 'Draft' | 'Scheduled' | 'Sent' | 'Sending';

export interface Campaign {
  id: string;
  name: string;
  template: string;
  audience: string;
  recipients: number;
  status: CampaignStatus;
  sentAt: string;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
}

export type ContactStatus = 'Active' | 'Blocked' | 'Deleted';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  optIn: boolean;
  lastSeen: string;
  createdAt: string;
  attributes: Record<string, string>;
  status: ContactStatus;
  blockedReason?: string;
  blockedAt?: string;
  deletedAt?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

// ─── Tags & Custom Attributes ───

export interface TagDef {
  id: string;
  name: string;
  color: string;
}

export interface CustomAttribute {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'select';
  options?: string[];
}

export const tagColors = [
  { name: 'whatsapp', bg: 'bg-whatsapp-100', text: 'text-whatsapp-700', dot: 'bg-whatsapp-500' },
  { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  { name: 'amber', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  { name: 'rose', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  { name: 'teal', bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
  { name: 'slate', bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
];

export const tagDefinitions: TagDef[] = [
  { id: 'tg1', name: 'VIP', color: 'amber' },
  { id: 'tg2', name: 'New', color: 'whatsapp' },
  { id: 'tg3', name: 'Cart Abandoner', color: 'rose' },
  { id: 'tg4', name: 'Recent Buyer', color: 'blue' },
  { id: 'tg5', name: 'Mumbai', color: 'teal' },
  { id: 'tg6', name: 'Bangalore', color: 'purple' },
  { id: 'tg7', name: 'Delhi', color: 'slate' },
  { id: 'tg8', name: 'Chennai', color: 'teal' },
];

export const customAttributes: CustomAttribute[] = [
  { id: 'ca1', name: 'City', type: 'text' },
  { id: 'ca2', name: 'Birthday', type: 'date' },
  { id: 'ca3', name: 'Total Orders', type: 'number' },
  { id: 'ca4', name: 'Last Order Date', type: 'date' },
  { id: 'ca5', name: 'Membership Tier', type: 'select', options: ['Silver', 'Gold', 'Platinum'] },
];

export type HeaderType = 'none' | 'text' | 'image' | 'video' | 'document';
export type ButtonType = 'quick_reply' | 'url' | 'phone';

export interface TemplateButton {
  type: ButtonType;
  text: string;
  url?: string;
  phone?: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'Marketing' | 'Utility' | 'Authentication';
  language: string;
  header: string;
  headerType: HeaderType;
  body: string;
  footer?: string;
  buttons: TemplateButton[];
  variables: string[];
  status: 'Approved' | 'Pending' | 'Rejected';
  createdAt: string;
}

export const templateLanguages = [
  'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi',
];

export const templateVariables = [
  { name: 'name', desc: 'Customer name' },
  { name: 'phone', desc: 'Phone number' },
  { name: 'code', desc: 'Discount code' },
  { name: 'discount', desc: 'Discount %' },
  { name: 'link', desc: 'Website link' },
  { name: 'orderId', desc: 'Order ID' },
  { name: 'amount', desc: 'Order amount' },
  { name: 'product', desc: 'Product name' },
  { name: 'festival', desc: 'Festival name' },
  { name: 'expiry', desc: 'Expiry date' },
];

export const blockedContacts: Contact[] = [
  { id: 'b1', name: 'Spam User 1', phone: '+91 90000 11111', tags: [], optIn: false, lastSeen: '5 days ago', createdAt: '2026-09-01', attributes: {}, status: 'Blocked', blockedReason: 'Spam messages', blockedAt: '2026-10-12' },
  { id: 'b2', name: 'Fake Account', phone: '+91 90000 22222', tags: [], optIn: false, lastSeen: '1 week ago', createdAt: '2026-08-20', attributes: {}, status: 'Blocked', blockedReason: 'Abusive language', blockedAt: '2026-10-10' },
  { id: 'b3', name: 'Unknown Sender', phone: '+91 90000 33333', tags: [], optIn: false, lastSeen: '3 days ago', createdAt: '2026-09-15', attributes: {}, status: 'Blocked', blockedReason: 'Repeated unsolicited messages', blockedAt: '2026-10-14' },
];

export const deletedContacts: Contact[] = [
  { id: 'd1', name: 'Old Customer 1', phone: '+91 90000 44444', tags: ['Old'], optIn: false, lastSeen: '2 months ago', createdAt: '2026-06-01', attributes: {}, status: 'Deleted', deletedAt: '2026-10-01' },
  { id: 'd2', name: 'Test Contact', phone: '+91 90000 55555', tags: [], optIn: false, lastSeen: '1 month ago', createdAt: '2026-07-15', attributes: {}, status: 'Deleted', deletedAt: '2026-09-28' },
];

// ─── Team & Access Control ───

export type Role = 'Owner' | 'Admin' | 'Agent' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: 'Active' | 'Invited' | 'Suspended';
  avatar: string;
  lastActive: string;
  assignedChats: number;
}

export const teamMembers: TeamMember[] = [
  { id: 'm1', name: 'Riya Sharma', email: 'riya@store.com', phone: '+91 98765 43210', role: 'Owner', status: 'Active', avatar: 'RS', lastActive: 'Online now', assignedChats: 3 },
  { id: 'm2', name: 'Arjun Mehta', email: 'arjun@store.com', phone: '+91 98200 99887', role: 'Admin', status: 'Active', avatar: 'AM', lastActive: '5 min ago', assignedChats: 7 },
  { id: 'm3', name: 'Priya Nair', email: 'priya@store.com', phone: '+91 90100 22334', role: 'Agent', status: 'Active', avatar: 'PN', lastActive: '12 min ago', assignedChats: 5 },
  { id: 'm4', name: 'Karan Verma', email: 'karan@store.com', phone: '+91 93200 55667', role: 'Agent', status: 'Active', avatar: 'KV', lastActive: '1 hour ago', assignedChats: 2 },
  { id: 'm5', name: 'Sneha Patel', email: 'sneha@store.com', phone: '+91 94100 77889', role: 'Viewer', status: 'Active', avatar: 'SP', lastActive: '3 hours ago', assignedChats: 0 },
  { id: 'm6', name: 'Rohit Das', email: 'rohit@store.com', phone: '+91 97600 33445', role: 'Agent', status: 'Invited', avatar: 'RD', lastActive: '—', assignedChats: 0 },
  { id: 'm7', name: 'Anita Rao', email: 'anita@store.com', phone: '+91 98800 12121', role: 'Agent', status: 'Suspended', avatar: 'AR', lastActive: '2 days ago', assignedChats: 0 },
];

export interface Permission {
  module: string;
  actions: { label: string; key: string }[];
}

export const permissionsMatrix: Record<Role, Record<string, boolean>> = {
  Owner: { view: true, create: true, edit: true, delete: true, manageTeam: true, billing: true, settings: true },
  Admin: { view: true, create: true, edit: true, delete: true, manageTeam: true, billing: false, settings: true },
  Agent: { view: true, create: true, edit: true, delete: false, manageTeam: false, billing: false, settings: false },
  Viewer: { view: true, create: false, edit: false, delete: false, manageTeam: false, billing: false, settings: false },
};

export const roleDescriptions: Record<Role, string> = {
  Owner: 'Full access including billing and deleting the account',
  Admin: 'Manage everything except billing and account deletion',
  Agent: 'Send campaigns, reply to chats, and manage contacts',
  Viewer: 'View-only access to dashboard and reports',
};

// ─── Live Chat / Shared Inbox ───

export type ChatStatus = 'Open' | 'Pending' | 'Resolved';
export type MessageDirection = 'in' | 'out';

export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  direction: MessageDirection;
  agent?: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  status: ChatStatus;
  assignedTo: string | null;
  tags: string[];
  messages: ChatMessage[];
}

export const conversations: Conversation[] = [
  {
    id: 'cv1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    avatar: 'RS',
    lastMessage: 'Yes, I want to know about the Diwali offer',
    lastMessageTime: '2 min ago',
    unread: 2,
    status: 'Open',
    assignedTo: 'Priya Nair',
    tags: ['VIP', 'Mumbai'],
    messages: [
      { id: 'msg1', text: 'Hi, do you have any festival discounts?', time: '10:28 AM', direction: 'in' },
      { id: 'msg2', text: 'Hi Rahul! Yes, we have up to 40% off for Diwali. Would you like the details?', time: '10:29 AM', direction: 'out', agent: 'Priya Nair' },
      { id: 'msg3', text: 'Yes, I want to know about the Diwali offer', time: '10:31 AM', direction: 'in' },
    ],
  },
  {
    id: 'cv2',
    customerName: 'Priya Patel',
    customerPhone: '+91 98200 11223',
    avatar: 'PP',
    lastMessage: 'Order #4821 is not delivered yet',
    lastMessageTime: '15 min ago',
    unread: 1,
    status: 'Pending',
    assignedTo: 'Arjun Mehta',
    tags: ['New'],
    messages: [
      { id: 'msg1', text: 'My order is late', time: '10:10 AM', direction: 'in' },
      { id: 'msg2', text: 'Order #4821 is not delivered yet', time: '10:15 AM', direction: 'in' },
    ],
  },
  {
    id: 'cv3',
    customerName: 'Amit Kumar',
    customerPhone: '+91 99300 44556',
    avatar: 'AK',
    lastMessage: 'Thank you! Got the code 🙏',
    lastMessageTime: '1 hour ago',
    unread: 0,
    status: 'Resolved',
    assignedTo: 'Karan Verma',
    tags: ['Cart Abandoner'],
    messages: [
      { id: 'msg1', text: 'I left items in my cart, any discount?', time: '9:00 AM', direction: 'in' },
      { id: 'msg2', text: 'Here is a 15% code: SAVE15. Valid till Sunday!', time: '9:02 AM', direction: 'out', agent: 'Karan Verma' },
      { id: 'msg3', text: 'Thank you! Got the code 🙏', time: '9:05 AM', direction: 'in' },
    ],
  },
  {
    id: 'cv4',
    customerName: 'Sneha Reddy',
    customerPhone: '+91 90100 77889',
    avatar: 'SR',
    lastMessage: 'Is the new collection available in size M?',
    lastMessageTime: '2 hours ago',
    unread: 0,
    status: 'Open',
    assignedTo: null,
    tags: ['VIP', 'Bangalore'],
    messages: [
      { id: 'msg1', text: 'Is the new collection available in size M?', time: '8:30 AM', direction: 'in' },
    ],
  },
  {
    id: 'cv5',
    customerName: 'Vikram Singh',
    customerPhone: '+91 94100 22334',
    avatar: 'VS',
    lastMessage: 'Great, will visit the store tomorrow',
    lastMessageTime: 'Yesterday',
    unread: 0,
    status: 'Resolved',
    assignedTo: 'Priya Nair',
    tags: ['Recent Buyer'],
    messages: [
      { id: 'msg1', text: 'Where is your store located?', time: 'Yesterday 4:00 PM', direction: 'in' },
      { id: 'msg2', text: 'We are at Shop 12, Linking Road, Bandra West, Mumbai. Open 10 AM - 9 PM!', time: 'Yesterday 4:02 PM', direction: 'out', agent: 'Priya Nair' },
      { id: 'msg3', text: 'Great, will visit the store tomorrow', time: 'Yesterday 4:05 PM', direction: 'in' },
    ],
  },
];

// ─── Automation / Flow Builder ───

export type FlowTrigger = 'New Customer' | 'Cart Abandoned' | 'Order Placed' | 'Keyword Reply' | 'No Reply Follow-up';
export type FlowStatus = 'Active' | 'Paused' | 'Draft';

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: FlowTrigger;
  triggerDetail: string;
  message: string;
  delay: string;
  status: FlowStatus;
  enrolled: number;
  sent: number;
  conversionRate: number;
}

export const automationFlows: AutomationFlow[] = [
  {
    id: 'f1',
    name: 'Welcome New Customer',
    trigger: 'New Customer',
    triggerDetail: 'When a new contact opts in',
    message: 'Welcome to our store, {{name}}! Enjoy 10% off your first order with code WELCOME10.',
    delay: 'Immediately',
    status: 'Active',
    enrolled: 156,
    sent: 156,
    conversionRate: 34,
  },
  {
    id: 'f2',
    name: 'Cart Recovery',
    trigger: 'Cart Abandoned',
    triggerDetail: 'When cart is abandoned for 2+ hours',
    message: 'Hi {{name}}, you left {{items}} in your cart! Complete your order now and get 15% off with code SAVE15.',
    delay: 'After 2 hours',
    status: 'Active',
    enrolled: 540,
    sent: 510,
    conversionRate: 22,
  },
  {
    id: 'f3',
    name: 'Order Confirmation',
    trigger: 'Order Placed',
    triggerDetail: 'When an order is placed',
    message: 'Thanks for your order #{{orderId}}! We will notify you when it ships. Track here: {{link}}',
    delay: 'Immediately',
    status: 'Active',
    enrolled: 890,
    sent: 890,
    conversionRate: 100,
  },
  {
    id: 'f4',
    name: 'Keyword: SALE',
    trigger: 'Keyword Reply',
    triggerDetail: 'When customer sends "SALE"',
    message: 'Here are our current offers: 1. Diwali Sale - 40% off 2. Buy 1 Get 1 Free on selected items. Shop now: {{link}}',
    delay: 'Immediately',
    status: 'Active',
    enrolled: 320,
    sent: 320,
    conversionRate: 18,
  },
  {
    id: 'f5',
    name: 'No-Reply Follow-up',
    trigger: 'No Reply Follow-up',
    triggerDetail: 'When customer does not reply in 24 hours',
    message: 'Hi {{name}}, we noticed you have not replied. Is there anything we can help you with?',
    delay: 'After 24 hours',
    status: 'Paused',
    enrolled: 210,
    sent: 180,
    conversionRate: 12,
  },
  {
    id: 'f6',
    name: 'Festival Greeting Auto-reply',
    trigger: 'Keyword Reply',
    triggerDetail: 'When customer sends "FESTIVAL"',
    message: '🪔 Wishing you a bright and prosperous festival season! Enjoy up to 40% off all month.',
    delay: 'Immediately',
    status: 'Draft',
    enrolled: 0,
    sent: 0,
    conversionRate: 0,
  },
];

export const triggerOptions: { trigger: FlowTrigger; description: string; icon: string }[] = [
  { trigger: 'New Customer', description: 'Send a welcome message when someone opts in', icon: 'UserPlus' },
  { trigger: 'Cart Abandoned', description: 'Remind customers who left items in their cart', icon: 'ShoppingCart' },
  { trigger: 'Order Placed', description: 'Confirm and thank customers after purchase', icon: 'PackageCheck' },
  { trigger: 'Keyword Reply', description: 'Auto-reply when a specific keyword is sent', icon: 'MessageSquare' },
  { trigger: 'No Reply Follow-up', description: 'Follow up if the customer has not responded', icon: 'Clock' },
];

// ─── Settings ───

export const businessProfile = {
  businessName: 'Riya Fashion Store',
  category: 'Clothing & Apparel',
  description: 'Trendy ethnic and western wear for all occasions. Based in Mumbai with nationwide shipping.',
  address: 'Shop 12, Linking Road, Bandra West, Mumbai, 400050',
  website: 'www.riyafashionstore.com',
  email: 'hello@riyafashionstore.com',
  phone: '+91 98765 43210',
};

export const whatsappNumber = {
  number: '+91 98765 43210',
  displayName: 'Riya Fashion Store',
  qualityRating: 'High',
  messagingLimit: '1,000 messages / 24 hours',
  greenTickVerified: true,
  connectedSince: 'March 2026',
};

// ─── Existing data ───

export const campaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Diwali Mega Sale',
    template: 'Festival Offer',
    audience: 'All Customers',
    recipients: 1240,
    status: 'Sent',
    sentAt: '2026-10-12 10:30 AM',
    delivered: 1198,
    read: 876,
    replied: 142,
    failed: 42,
  },
  {
    id: 'c2',
    name: 'New Arrival Alert',
    template: 'Product Launch',
    audience: 'VIP Customers',
    recipients: 320,
    status: 'Sent',
    sentAt: '2026-10-10 4:15 PM',
    delivered: 318,
    read: 290,
    replied: 67,
    failed: 2,
  },
  {
    id: 'c3',
    name: 'Weekend Flash Sale',
    template: 'Discount Code',
    audience: 'Cart Abandoners',
    recipients: 540,
    status: 'Scheduled',
    sentAt: '2026-10-18 9:00 AM',
    delivered: 0,
    read: 0,
    replied: 0,
    failed: 0,
  },
  {
    id: 'c4',
    name: 'Customer Feedback Survey',
    template: 'Survey Request',
    audience: 'Recent Buyers',
    recipients: 210,
    status: 'Sending',
    sentAt: '2026-10-17 11:00 AM',
    delivered: 134,
    read: 88,
    replied: 19,
    failed: 3,
  },
  {
    id: 'c5',
    name: 'Eid Greetings',
    template: 'Festival Greeting',
    audience: 'All Customers',
    recipients: 1240,
    status: 'Draft',
    sentAt: '—',
    delivered: 0,
    read: 0,
    replied: 0,
    failed: 0,
  },
  {
    id: 'c6',
    name: 'Monsoon Collection Launch',
    template: 'Product Launch',
    audience: 'All Customers',
    recipients: 1240,
    status: 'Sent',
    sentAt: '2026-09-28 6:00 PM',
    delivered: 1210,
    read: 940,
    replied: 210,
    failed: 30,
  },
];

export const contacts: Contact[] = [
  { id: 'u1', name: 'Rahul Sharma', phone: '+91 98765 43210', tags: ['VIP', 'Mumbai'], optIn: true, lastSeen: '2 min ago', createdAt: '2026-08-15', attributes: { City: 'Mumbai', Birthday: '1992-04-12', 'Total Orders': '8', 'Last Order Date': '2026-10-01', 'Membership Tier': 'Gold' }, status: 'Active', totalOrders: 8, totalSpent: 24600, lastOrderDate: '2026-10-01' },
  { id: 'u2', name: 'Priya Patel', phone: '+91 98200 11223', tags: ['New'], optIn: true, lastSeen: '1 hour ago', createdAt: '2026-10-10', attributes: { City: 'Surat', Birthday: '1995-11-23', 'Total Orders': '1', 'Last Order Date': '2026-10-10', 'Membership Tier': 'Silver' }, status: 'Active', totalOrders: 1, totalSpent: 1299, lastOrderDate: '2026-10-10' },
  { id: 'u3', name: 'Amit Kumar', phone: '+91 99300 44556', tags: ['Cart Abandoner'], optIn: true, lastSeen: '3 hours ago', createdAt: '2026-09-22', attributes: { City: 'Pune', Birthday: '1988-07-30', 'Total Orders': '3', 'Last Order Date': '2026-09-15', 'Membership Tier': 'Silver' }, status: 'Active', totalOrders: 3, totalSpent: 5400, lastOrderDate: '2026-09-15' },
  { id: 'u4', name: 'Sneha Reddy', phone: '+91 90100 77889', tags: ['VIP', 'Bangalore'], optIn: true, lastSeen: 'Yesterday', createdAt: '2026-07-30', attributes: { City: 'Bangalore', Birthday: '1993-02-14', 'Total Orders': '12', 'Last Order Date': '2026-10-12', 'Membership Tier': 'Platinum' }, status: 'Active', totalOrders: 12, totalSpent: 48200, lastOrderDate: '2026-10-12' },
  { id: 'u5', name: 'Vikram Singh', phone: '+91 94100 22334', tags: ['Recent Buyer'], optIn: false, lastSeen: '2 days ago', createdAt: '2026-09-05', attributes: { City: 'Jaipur', Birthday: '1990-09-05', 'Total Orders': '5', 'Last Order Date': '2026-09-28', 'Membership Tier': 'Gold' }, status: 'Active', totalOrders: 5, totalSpent: 15800, lastOrderDate: '2026-09-28' },
  { id: 'u6', name: 'Anjali Gupta', phone: '+91 98180 33445', tags: ['New', 'Delhi'], optIn: true, lastSeen: '5 min ago', createdAt: '2026-10-14', attributes: { City: 'Delhi', Birthday: '1997-12-01', 'Total Orders': '1', 'Last Order Date': '2026-10-14', 'Membership Tier': 'Silver' }, status: 'Active', totalOrders: 1, totalSpent: 899, lastOrderDate: '2026-10-14' },
  { id: 'u7', name: 'Rohan Verma', phone: '+91 93200 55667', tags: ['Cart Abandoner'], optIn: true, lastSeen: '4 hours ago', createdAt: '2026-09-18', attributes: { City: 'Mumbai', Birthday: '1991-06-18', 'Total Orders': '2', 'Last Order Date': '2026-08-20', 'Membership Tier': 'Silver' }, status: 'Active', totalOrders: 2, totalSpent: 3200, lastOrderDate: '2026-08-20' },
  { id: 'u8', name: 'Kavya Iyer', phone: '+91 90000 88990', tags: ['VIP', 'Chennai'], optIn: true, lastSeen: '30 min ago', createdAt: '2026-06-12', attributes: { City: 'Chennai', Birthday: '1994-03-25', 'Total Orders': '15', 'Last Order Date': '2026-10-11', 'Membership Tier': 'Platinum' }, status: 'Active', totalOrders: 15, totalSpent: 62400, lastOrderDate: '2026-10-11' },
  { id: 'u9', name: 'Arjun Nair', phone: '+91 98800 12121', tags: ['Recent Buyer'], optIn: true, lastSeen: '1 day ago', createdAt: '2026-10-08', attributes: { City: 'Kochi', Birthday: '1996-08-10', 'Total Orders': '2', 'Last Order Date': '2026-10-05', 'Membership Tier': 'Silver' }, status: 'Active', totalOrders: 2, totalSpent: 4600, lastOrderDate: '2026-10-05' },
  { id: 'u10', name: 'Deepa Joshi', phone: '+91 97600 34343', tags: ['New'], optIn: false, lastSeen: '3 days ago', createdAt: '2026-10-16', attributes: { City: 'Nagpur', Birthday: '1998-01-15', 'Total Orders': '0', 'Last Order Date': '', 'Membership Tier': 'Silver' }, status: 'Active', totalOrders: 0, totalSpent: 0, lastOrderDate: '' },
];

export const templates: Template[] = [
  { id: 't1', name: 'Festival Offer', category: 'Marketing', language: 'English', headerType: 'text', header: '🎉 {{festival}} Special!', body: 'Hi {{name}}, celebrate {{festival}} with up to {{discount}}% off! Use code {{code}} at checkout. Shop now: {{link}}', footer: 'Reply STOP to opt out', buttons: [{ type: 'url', text: 'Shop Now', url: 'https://riyafashionstore.com' }], variables: ['festival', 'name', 'discount', 'code', 'link'], status: 'Approved', createdAt: '2026-09-20' },
  { id: 't2', name: 'Product Launch', category: 'Marketing', language: 'English', headerType: 'text', header: 'New Arrival ✨', body: 'Hey {{name}}, our new {{product}} just dropped! Be the first to own it. Check it out here: {{link}}', footer: '', buttons: [{ type: 'quick_reply', text: 'Interested' }, { type: 'quick_reply', text: 'Not Now' }], variables: ['name', 'product', 'link'], status: 'Approved', createdAt: '2026-09-25' },
  { id: 't3', name: 'Discount Code', category: 'Marketing', language: 'English', headerType: 'text', header: 'Your code inside 🎁', body: 'Hi {{name}}, here is your exclusive code {{code}} for {{discount}}% off. Valid till {{expiry}}. Don\'t miss out!', footer: 'Limited time only', buttons: [{ type: 'url', text: 'Browse Collection', url: 'https://riyafashionstore.com/collection' }], variables: ['name', 'code', 'discount', 'expiry'], status: 'Approved', createdAt: '2026-09-28' },
  { id: 't4', name: 'Survey Request', category: 'Utility', language: 'English', headerType: 'text', header: 'We value your feedback', body: 'Hi {{name}}, thank you for your purchase! Please take 1 min to rate your experience: {{link}}', footer: '', buttons: [{ type: 'quick_reply', text: 'Rate Now' }], variables: ['name', 'link'], status: 'Approved', createdAt: '2026-10-01' },
  { id: 't5', name: 'Festival Greeting', category: 'Marketing', language: 'Hindi', headerType: 'text', header: 'शुभ दीपावली 🪔', body: 'प्रिय {{name}}, आपको और आपके परिवार को {{festival}} की ढेरों शुभकामनाएँ! 🎉', footer: '', buttons: [], variables: ['name', 'festival'], status: 'Pending', createdAt: '2026-10-15' },
  { id: 't6', name: 'Order Confirmation', category: 'Utility', language: 'English', headerType: 'text', header: 'Order Confirmed ✅', body: 'Hi {{name}}, your order #{{orderId}} is confirmed! Total: ₹{{amount}}. We\'ll notify you when it ships.', footer: 'Track your order anytime', buttons: [{ type: 'url', text: 'Track Order', url: 'https://riyafashionstore.com/track' }, { type: 'phone', text: 'Call Support', phone: '+919876543210' }], variables: ['name', 'orderId', 'amount'], status: 'Approved', createdAt: '2026-10-05' },
];

export const audienceOptions = [
  { name: 'All Customers', count: 1240, description: 'Every opted-in contact' },
  { name: 'VIP Customers', count: 320, description: 'Top 10% spenders' },
  { name: 'Cart Abandoners', count: 540, description: 'Left items in cart 7+ days' },
  { name: 'Recent Buyers', count: 210, description: 'Purchased in last 30 days' },
  { name: 'New Subscribers', count: 156, description: 'Joined in last 14 days' },
];

export const stats = {
  totalSent: 4820,
  deliveryRate: 97.8,
  readRate: 73.2,
  replyRate: 18.4,
  totalContacts: 1240,
  activeCampaigns: 3,
  scheduledCampaigns: 1,
  activeFlows: 4,
  openChats: 8,
  teamMembers: 7,
};

export const weeklyData = [
  { day: 'Mon', sent: 420, delivered: 410, read: 310, replied: 52, failed: 10 },
  { day: 'Tue', sent: 680, delivered: 665, read: 510, replied: 88, failed: 15 },
  { day: 'Wed', sent: 540, delivered: 528, read: 400, replied: 64, failed: 12 },
  { day: 'Thu', sent: 890, delivered: 872, read: 670, replied: 112, failed: 18 },
  { day: 'Fri', sent: 1120, delivered: 1098, read: 860, replied: 148, failed: 22 },
  { day: 'Sat', sent: 760, delivered: 744, read: 580, replied: 96, failed: 16 },
  { day: 'Sun', sent: 410, delivered: 400, read: 300, replied: 48, failed: 10 },
];

// ─── Deep Analytics Data ───

export interface DailyMetric {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  newContacts: number;
  revenue: number;
}

export interface HourlyMetric {
  hour: string;
  sent: number;
  read: number;
  replied: number;
}

export interface AudienceMetric {
  name: string;
  count: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  readRate: number;
  replyRate: number;
  color: string;
}

export interface TemplateMetric {
  name: string;
  category: string;
  timesUsed: number;
  totalSent: number;
  readRate: number;
  replyRate: number;
  trend: 'up' | 'down' | 'flat';
}

export interface LiveUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'Online' | 'Away' | 'Offline';
  currentAction: string;
  lastSeen: string;
  assignedChats: number;
  resolvedToday: number;
  sentToday: number;
}

export const dailyMetrics: DailyMetric[] = [
  { date: '2026-10-01', sent: 380, delivered: 372, read: 278, replied: 44, failed: 8, newContacts: 12, revenue: 28400 },
  { date: '2026-10-02', sent: 420, delivered: 411, read: 310, replied: 52, failed: 9, newContacts: 8, revenue: 31200 },
  { date: '2026-10-03', sent: 290, delivered: 282, read: 198, replied: 31, failed: 8, newContacts: 5, revenue: 18900 },
  { date: '2026-10-04', sent: 560, delivered: 548, read: 410, replied: 67, failed: 12, newContacts: 19, revenue: 42100 },
  { date: '2026-10-05', sent: 710, delivered: 695, read: 530, replied: 84, failed: 15, newContacts: 24, revenue: 53800 },
  { date: '2026-10-06', sent: 830, delivered: 812, read: 620, replied: 98, failed: 18, newContacts: 31, revenue: 62400 },
  { date: '2026-10-07', sent: 480, delivered: 469, read: 342, replied: 55, failed: 11, newContacts: 14, revenue: 34700 },
  { date: '2026-10-08', sent: 920, delivered: 899, read: 688, replied: 112, failed: 21, newContacts: 38, revenue: 71200 },
  { date: '2026-10-09', sent: 650, delivered: 636, read: 474, replied: 76, failed: 14, newContacts: 22, revenue: 48600 },
  { date: '2026-10-10', sent: 1100, delivered: 1078, read: 820, replied: 134, failed: 22, newContacts: 45, revenue: 88400 },
  { date: '2026-10-11', sent: 740, delivered: 724, read: 548, replied: 88, failed: 16, newContacts: 27, revenue: 57300 },
  { date: '2026-10-12', sent: 1340, delivered: 1298, read: 976, replied: 162, failed: 42, newContacts: 56, revenue: 104800 },
  { date: '2026-10-13', sent: 880, delivered: 861, read: 646, replied: 104, failed: 19, newContacts: 33, revenue: 67400 },
  { date: '2026-10-14', sent: 560, delivered: 548, read: 402, replied: 64, failed: 12, newContacts: 18, revenue: 41200 },
  { date: '2026-10-15', sent: 430, delivered: 420, read: 308, replied: 49, failed: 10, newContacts: 11, revenue: 29800 },
  { date: '2026-10-16', sent: 780, delivered: 763, read: 574, replied: 92, failed: 17, newContacts: 29, revenue: 59600 },
  { date: '2026-10-17', sent: 320, delivered: 313, read: 234, replied: 38, failed: 7, newContacts: 10, revenue: 24400 },
];

export const hourlyMetrics: HourlyMetric[] = [
  { hour: '6 AM', sent: 80, read: 44, replied: 8 },
  { hour: '7 AM', sent: 120, read: 78, replied: 14 },
  { hour: '8 AM', sent: 210, read: 152, replied: 26 },
  { hour: '9 AM', sent: 380, read: 290, replied: 48 },
  { hour: '10 AM', sent: 520, read: 410, replied: 68 },
  { hour: '11 AM', sent: 480, read: 374, replied: 62 },
  { hour: '12 PM', sent: 310, read: 228, replied: 36 },
  { hour: '1 PM', sent: 240, read: 172, replied: 28 },
  { hour: '2 PM', sent: 290, read: 214, replied: 34 },
  { hour: '3 PM', sent: 420, read: 320, replied: 52 },
  { hour: '4 PM', sent: 560, read: 436, replied: 74 },
  { hour: '5 PM', sent: 640, read: 504, replied: 84 },
  { hour: '6 PM', sent: 720, read: 574, replied: 96 },
  { hour: '7 PM', sent: 680, read: 538, replied: 90 },
  { hour: '8 PM', sent: 440, read: 340, replied: 56 },
  { hour: '9 PM', sent: 210, read: 156, replied: 24 },
];

export const audienceMetrics: AudienceMetric[] = [
  { name: 'All Customers', count: 1240, sent: 4820, delivered: 4714, read: 3528, replied: 572, readRate: 74.8, replyRate: 16.2, color: '#25D366' },
  { name: 'VIP Customers', count: 320, sent: 960, delivered: 952, read: 810, replied: 182, readRate: 85.1, replyRate: 21.4, color: '#F59E0B' },
  { name: 'Cart Abandoners', count: 540, sent: 1080, delivered: 1058, read: 726, replied: 238, readRate: 68.6, replyRate: 25.1, color: '#EF4444' },
  { name: 'Recent Buyers', count: 210, sent: 420, delivered: 414, read: 334, replied: 88, readRate: 80.7, replyRate: 22.8, color: '#3B82F6' },
  { name: 'New Subscribers', count: 156, sent: 156, delivered: 154, read: 108, replied: 28, readRate: 70.1, replyRate: 18.2, color: '#8B5CF6' },
];

export const templateMetrics: TemplateMetric[] = [
  { name: 'Festival Offer', category: 'Marketing', timesUsed: 4, totalSent: 4960, readRate: 73.2, replyRate: 11.4, trend: 'up' },
  { name: 'Product Launch', category: 'Marketing', timesUsed: 2, totalSent: 1560, readRate: 80.1, replyRate: 18.6, trend: 'up' },
  { name: 'Discount Code', category: 'Marketing', timesUsed: 3, totalSent: 1620, readRate: 68.4, replyRate: 22.1, trend: 'flat' },
  { name: 'Survey Request', category: 'Utility', timesUsed: 1, totalSent: 210, readRate: 83.3, replyRate: 31.4, trend: 'up' },
  { name: 'Order Confirmation', category: 'Utility', timesUsed: 5, totalSent: 4450, readRate: 91.2, replyRate: 4.8, trend: 'flat' },
  { name: 'Festival Greeting', category: 'Marketing', timesUsed: 1, totalSent: 0, readRate: 0, replyRate: 0, trend: 'flat' },
];

export const liveUsers: LiveUser[] = [
  { id: 'lu1', name: 'Riya Sharma', avatar: 'RS', role: 'Owner', status: 'Online', currentAction: 'Viewing Analytics', lastSeen: 'now', assignedChats: 3, resolvedToday: 8, sentToday: 420 },
  { id: 'lu2', name: 'Arjun Mehta', avatar: 'AM', role: 'Admin', status: 'Online', currentAction: 'Replying to Priya Patel', lastSeen: 'now', assignedChats: 7, resolvedToday: 12, sentToday: 0 },
  { id: 'lu3', name: 'Priya Nair', avatar: 'PN', role: 'Agent', status: 'Online', currentAction: 'Live Chat — Rahul Sharma', lastSeen: 'now', assignedChats: 5, resolvedToday: 9, sentToday: 0 },
  { id: 'lu4', name: 'Karan Verma', avatar: 'KV', role: 'Agent', status: 'Away', currentAction: 'Last seen in Contacts', lastSeen: '8 min ago', assignedChats: 2, resolvedToday: 4, sentToday: 0 },
  { id: 'lu5', name: 'Sneha Patel', avatar: 'SP', role: 'Viewer', status: 'Online', currentAction: 'Viewing Dashboard', lastSeen: 'now', assignedChats: 0, resolvedToday: 0, sentToday: 0 },
  { id: 'lu6', name: 'Rohit Das', avatar: 'RD', role: 'Agent', status: 'Offline', currentAction: 'Not logged in', lastSeen: '3 hours ago', assignedChats: 0, resolvedToday: 0, sentToday: 0 },
  { id: 'lu7', name: 'Anita Rao', avatar: 'AR', role: 'Agent', status: 'Offline', currentAction: 'Suspended', lastSeen: '2 days ago', assignedChats: 0, resolvedToday: 0, sentToday: 0 },
];

// ─── Product Catalog ───

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  inStock: boolean;
  shares: number;
  orders: number;
}

export const products: Product[] = [
  { id: 'p1', name: 'Anarkali Kurti - Blue', price: 1299, originalPrice: 1999, category: 'Ethnic Wear', image: 'https://images.pexels.com/photos/13178920/pexels-photo-13178920.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: true, shares: 84, orders: 32 },
  { id: 'p2', name: 'Cotton Saree - Red', price: 2499, originalPrice: 3499, category: 'Ethnic Wear', image: 'https://images.pexels.com/photos/14928074/pexels-photo-14928074.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: true, shares: 120, orders: 45 },
  { id: 'p3', name: 'Denim Jacket - Unisex', price: 1799, category: 'Western Wear', image: 'https://images.pexels.com/photos/12083001/pexels-photo-12083001.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: true, shares: 56, orders: 18 },
  { id: 'p4', name: 'Embroidered Lehenga', price: 4999, originalPrice: 7999, category: 'Festival Special', image: 'https://images.pexels.com/photos/37396069/pexels-photo-37396069.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: false, shares: 210, orders: 67 },
  { id: 'p5', name: 'Silk Kurti - Pistachio', price: 1599, category: 'Ethnic Wear', image: 'https://images.pexels.com/photos/28512787/pexels-photo-28512787.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: true, shares: 38, orders: 12 },
  { id: 'p6', name: 'Casual T-Shirt - White', price: 399, originalPrice: 699, category: 'Western Wear', image: 'https://images.pexels.com/photos/4115035/pexels-photo-4115035.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: true, shares: 92, orders: 28 },
];

// ─── Integrations ───

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  connected: boolean;
  popular?: boolean;
}

export const integrations: Integration[] = [
  { id: 'i1', name: 'Shopify', description: 'Sync orders, products, and customer data automatically', category: 'E-commerce', icon: 'ShoppingBag', connected: true, popular: true },
  { id: 'i2', name: 'WooCommerce', description: 'Connect your WordPress store for order sync', category: 'E-commerce', icon: 'ShoppingCart', connected: false, popular: true },
  { id: 'i3', name: 'Razorpay', description: 'Collect payments via UPI, cards, and wallets inside WhatsApp', category: 'Payments', icon: 'CreditCard', connected: true, popular: true },
  { id: 'i4', name: 'PayU', description: 'Accept payments with PayU payment gateway', category: 'Payments', icon: 'CreditCard', connected: false },
  { id: 'i5', name: 'Google Sheets', description: 'Export contacts and campaign data to Google Sheets', category: 'Productivity', icon: 'FileSpreadsheet', connected: false },
  { id: 'i6', name: 'Zapier', description: 'Connect with 5,000+ apps through Zapier automation', category: 'Automation', icon: 'Zap', connected: false, popular: true },
  { id: 'i7', name: 'HubSpot CRM', description: 'Sync contacts and log conversations to HubSpot', category: 'CRM', icon: 'Users', connected: false },
  { id: 'i8', name: 'Zoho CRM', description: 'Two-way sync with Zoho CRM contacts and deals', category: 'CRM', icon: 'Users', connected: false },
  { id: 'i9', name: 'Meta Ads', description: 'Run Click-to-WhatsApp ads from Facebook & Instagram', category: 'Marketing', icon: 'Megaphone', connected: true, popular: true },
  { id: 'i10', name: 'Webhooks', description: 'Send real-time event data to any URL', category: 'Developer', icon: 'Webhook', connected: false },
];

// ─── WhatsApp Click-to-Chat Links ───

export interface WaLink {
  id: string;
  name: string;
  url: string;
  clicks: number;
  chats: number;
  createdAt: string;
  source: string;
}

export const waLinks: WaLink[] = [
  { id: 'l1', name: 'Instagram Bio Link', url: 'https://wa.me/919876543210?text=Hi%20I%20saw%20your%20Instagram', clicks: 420, chats: 180, createdAt: '2026-09-15', source: 'Instagram' },
  { id: 'l2', name: 'Facebook Ad Link', url: 'https://wa.me/919876543210?text=I%20am%20interested%20in%20the%20Diwali%20offer', clicks: 890, chats: 340, createdAt: '2026-10-01', source: 'Facebook Ads' },
  { id: 'l3', name: 'Website Floating Button', url: 'https://wa.me/919876543210', clicks: 210, chats: 95, createdAt: '2026-08-20', source: 'Website' },
  { id: 'l4', name: 'Festival QR Code', url: 'https://wa.me/919876543210?text=Diwali%20Sale', clicks: 560, chats: 230, createdAt: '2026-10-10', source: 'Print / Store' },
];

// ─── Conversation Routing Rules ───

export interface RoutingRule {
  id: string;
  condition: string;
  conditionType: 'Tag' | 'Keyword' | 'Customer Type';
  assignTo: string;
  priority: number;
  active: boolean;
}

export const routingRules: RoutingRule[] = [
  { id: 'r1', condition: 'VIP', conditionType: 'Tag', assignTo: 'Priya Nair', priority: 1, active: true },
  { id: 'r2', condition: 'order', conditionType: 'Keyword', assignTo: 'Arjun Mehta', priority: 2, active: true },
  { id: 'r3', condition: 'refund', conditionType: 'Keyword', assignTo: 'Arjun Mehta', priority: 3, active: true },
  { id: 'r4', condition: 'New Customer', conditionType: 'Customer Type', assignTo: 'Karan Verma', priority: 4, active: true },
  { id: 'r5', condition: 'Bangalore', conditionType: 'Tag', assignTo: 'Round Robin', priority: 5, active: false },
];

// ─── Onboarding Checklist ───

export interface OnboardingStep {
  id: string;
  label: string;
  done: boolean;
  route: string;
}

export const onboardingSteps: OnboardingStep[] = [
  { id: 'o1', label: 'Connect your WhatsApp number', done: true, route: 'settings' },
  { id: 'o2', label: 'Set up your business profile', done: true, route: 'settings' },
  { id: 'o3', label: 'Create your first message template', done: true, route: 'templates' },
  { id: 'o4', label: 'Import or add contacts', done: true, route: 'contacts' },
  { id: 'o5', label: 'Invite team members', done: false, route: 'team' },
  { id: 'o6', label: 'Set up an automation flow', done: false, route: 'automation' },
  { id: 'o7', label: 'Send your first campaign', done: false, route: 'create' },
];
