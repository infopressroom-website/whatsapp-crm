import { useState } from 'react';
import {
  Phone, Building2, Globe, Mail, MapPin, BadgeCheck, Check,
  MessageCircle, Bell, Shield, CreditCard, Smartphone,
} from 'lucide-react';
import { businessProfile, whatsappNumber } from '@/data/mockData';

type Tab = 'whatsapp' | 'business' | 'notifications' | 'security' | 'billing';

const tabs: { id: Tab; label: string; icon: typeof Phone }[] = [
  { id: 'whatsapp', label: 'WhatsApp Number', icon: Smartphone },
  { id: 'business', label: 'Business Profile', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function Settings() {
  const [tab, setTab] = useState<Tab>('whatsapp');
  const [saved, setSaved] = useState(false);

  // Business profile editable fields
  const [profile, setProfile] = useState(businessProfile);

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    newMessage: true,
    campaignSent: true,
    lowCredits: true,
    teamActivity: false,
    weeklyReport: true,
    customerOptOut: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings({ ...notifSettings, [key]: !notifSettings[key] });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    active ? 'bg-whatsapp-50 text-whatsapp-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${active ? 'text-whatsapp-600' : 'text-slate-400'}`} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {/* WhatsApp Number */}
          {tab === 'whatsapp' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-whatsapp-600" /> WhatsApp Business Number
                </h3>
                <p className="text-xs text-slate-400 mt-1">Your connected WhatsApp Business API number</p>
              </div>

              <div className="bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-whatsapp-50/80">Connected Number</p>
                    <p className="text-2xl font-bold mt-1">{whatsappNumber.number}</p>
                    <p className="text-sm text-whatsapp-50/90 mt-1">{whatsappNumber.displayName}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                {whatsappNumber.greenTickVerified && (
                  <div className="mt-4 bg-white/15 rounded-lg px-3 py-2 flex items-center gap-2 backdrop-blur">
                    <BadgeCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold">Green Tick Verified — Official Business Account</span>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard label="Quality Rating" value={whatsappNumber.qualityRating} icon={BadgeCheck} />
                <InfoCard label="Messaging Limit" value={whatsappNumber.messagingLimit} icon={MessageCircle} />
                <InfoCard label="Connected Since" value={whatsappNumber.connectedSince} icon={Phone} />
                <InfoCard label="Status" value="Connected" icon={Check} />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Quick Setup Guide</h4>
                <div className="space-y-2">
                  {[
                    { step: 'Connect your WhatsApp number', done: true },
                    { step: 'Verify your business on Meta', done: true },
                    { step: 'Apply for Green Tick verification', done: true },
                    { step: 'Add message templates for approval', done: true },
                    { step: 'Start sending campaigns', done: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${s.done ? 'bg-whatsapp-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {s.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-sm ${s.done ? 'text-slate-600' : 'text-slate-400'}`}>{s.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Business Profile */}
          {tab === 'business' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-whatsapp-600" /> Business Profile
                </h3>
                <p className="text-xs text-slate-400 mt-1">This information appears on your WhatsApp profile</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Business Name" icon={Building2} value={profile.businessName} onChange={(v) => setProfile({ ...profile, businessName: v })} />
                <Field label="Category" icon={BadgeCheck} value={profile.category} onChange={(v) => setProfile({ ...profile, category: v })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Website" icon={Globe} value={profile.website} onChange={(v) => setProfile({ ...profile, website: v })} />
                <Field label="Email" icon={Mail} value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
              </div>
              <Field label="Address" icon={MapPin} value={profile.address} onChange={(v) => setProfile({ ...profile, address: v })} />
              <Field label="Phone Number" icon={Phone} value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition flex items-center gap-2 ${
                    saved ? 'bg-whatsapp-600 text-white' : 'bg-whatsapp-500 text-white hover:bg-whatsapp-600'
                  }`}
                >
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
                </button>
                <button className="text-sm font-medium text-slate-500 px-4 py-2.5 hover:text-slate-700">Cancel</button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-1">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-whatsapp-600" /> Notification Preferences
                </h3>
                <p className="text-xs text-slate-400 mt-1">Choose what alerts you want to receive</p>
              </div>
              {[
                { key: 'newMessage' as const, label: 'New Customer Message', desc: 'Get notified when a customer sends a message' },
                { key: 'campaignSent' as const, label: 'Campaign Sent', desc: 'Alert when a campaign finishes sending' },
                { key: 'lowCredits' as const, label: 'Low Message Credits', desc: 'Warn when credits drop below 100' },
                { key: 'teamActivity' as const, label: 'Team Member Activity', desc: 'Notifications for joins, role changes, etc.' },
                { key: 'weeklyReport' as const, label: 'Weekly Performance Report', desc: 'Summary of your campaigns every Monday' },
                { key: 'customerOptOut' as const, label: 'Customer Opt-Out', desc: 'Alert when a customer unsubscribes' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-3.5 rounded-lg hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{n.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(n.key)}
                    className={`relative w-11 h-6 rounded-full transition shrink-0 ${notifSettings[n.key] ? 'bg-whatsapp-500' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifSettings[n.key] ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-whatsapp-600" /> Security
                </h3>
                <p className="text-xs text-slate-400 mt-1">Keep your account secure</p>
              </div>

              <div className="space-y-3">
                <SecurityRow title="Two-Factor Authentication" desc="Add an extra layer of security to your login" enabled={true} />
                <SecurityRow title="Login Alerts" desc="Get notified of new device logins" enabled={true} />
                <SecurityRow title="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" enabled={false} />
                <SecurityRow title="API Key Access" desc="Allow external apps to connect via API" enabled={true} />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Active Sessions</h4>
                <div className="space-y-2">
                  {[
                    { device: 'Chrome on Windows', location: 'Mumbai, IN', current: true, time: 'Active now' },
                    { device: 'Safari on iPhone', location: 'Mumbai, IN', current: false, time: '2 hours ago' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          {s.device}
                          {s.current && <span className="text-[10px] bg-whatsapp-100 text-whatsapp-700 px-2 py-0.5 rounded-full font-semibold">Current</span>}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button className="text-xs text-red-500 font-medium hover:underline">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Billing */}
          {tab === 'billing' && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-whatsapp-600" /> Current Plan
                </h3>
                <div className="bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 rounded-xl p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-whatsapp-50/80">You are on</p>
                      <p className="text-2xl font-bold mt-1">Growth Plan</p>
                      <p className="text-sm text-whatsapp-50/90 mt-1">Rs. 999 / month</p>
                    </div>
                    <span className="text-xs bg-white/15 px-3 py-1 rounded-full font-semibold backdrop-blur">Active</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-whatsapp-50/80">Messages used</span>
                      <span className="font-semibold">620 / 1,000</span>
                    </div>
                    <div className="h-2 bg-white/25 rounded-full overflow-hidden">
                      <div className="h-full w-[62%] bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                  <PlanCard name="Starter" price="Free" features={['100 msgs/month', '1 team member', 'Basic templates']} current={false} />
                  <PlanCard name="Growth" price="Rs. 999/mo" features={['1,000 msgs/month', '5 team members', 'All templates', 'Automation flows']} current={true} />
                  <PlanCard name="Pro" price="Rs. 2,999/mo" features={['10,000 msgs/month', 'Unlimited members', 'Priority support', 'API access']} current={false} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Payment Method</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    VISA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-400">Expires 08/2028</p>
                  </div>
                  <button className="text-xs text-whatsapp-600 font-medium hover:underline">Change</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Phone }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-1.5">{value}</p>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange }: { label: string; icon: typeof Phone; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
        />
      </div>
    </div>
  );
}

function SecurityRow({ title, desc, enabled }: { title: string; desc: string; enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between p-3.5 rounded-lg hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition shrink-0 ${on ? 'bg-whatsapp-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function PlanCard({ name, price, features, current }: { name: string; price: string; features: string[]; current: boolean }) {
  return (
    <div className={`rounded-xl border-2 p-4 ${current ? 'border-whatsapp-500 bg-whatsapp-50/50' : 'border-slate-200'}`}>
      <p className="font-bold text-slate-800">{name}</p>
      <p className="text-sm text-slate-500 mt-0.5">{price}</p>
      <ul className="mt-3 space-y-1.5">
        {features.map((f) => (
          <li key={f} className="text-xs text-slate-500 flex items-center gap-1.5">
            <Check className="w-3 h-3 text-whatsapp-600 shrink-0" /> {f}
          </li>
        ))}
      </ul>
      {current ? (
        <span className="block mt-3 text-xs text-center text-whatsapp-700 font-semibold">Current Plan</span>
      ) : (
        <button className="mt-3 w-full text-xs font-semibold border border-slate-200 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition">
          Upgrade
        </button>
      )}
    </div>
  );
}
