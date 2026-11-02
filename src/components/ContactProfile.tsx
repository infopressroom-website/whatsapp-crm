import {
  X, Phone, MessageSquare, Tag, Check, Calendar, ShoppingBag,
  TrendingUp, Clock, User, Mail, MapPin, Ban, Trash2, Pencil,
  Send, IndianRupee, Package, Star,
} from 'lucide-react';
import {
  type Contact, type TagDef, type CustomAttribute,
  tagColors,
} from '@/data/mockData';

interface ContactProfileProps {
  contact: Contact | null;
  tagDefs: TagDef[];
  attrs: CustomAttribute[];
  onClose: () => void;
  onBlock?: (c: Contact) => void;
  onDelete?: (id: string) => void;
  onUnblock?: (id: string) => void;
  onRestore?: (id: string) => void;
  onMessage?: (c: Contact) => void;
}

const tagColorFor = (tagName: string, tagDefs: TagDef[]) => {
  const def = tagDefs.find((d) => d.name === tagName);
  return tagColors.find((c) => c.name === (def?.color ?? 'slate')) ?? tagColors[6];
};

export function ContactProfile({
  contact, tagDefs, attrs, onClose,
  onBlock, onDelete, onUnblock, onRestore, onMessage,
}: ContactProfileProps) {
  if (!contact) return null;

  const initials = contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const isBlocked = contact.status === 'Blocked';
  const isDeleted = contact.status === 'Deleted';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-white shadow-xl overflow-y-auto scrollbar-thin animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{contact.name}</h2>
              <p className="text-sm text-white/80 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" /> {contact.phone}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${contact.optIn ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                  {contact.optIn ? 'Opted In' : 'Not Opted In'}
                </span>
                {isBlocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-400/30 text-white">
                    Blocked
                  </span>
                )}
                {isDeleted && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-400/30 text-white">
                    Deleted
                  </span>
                )}
                <span className="text-[10px] text-white/70 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {contact.lastSeen}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 border-b border-slate-100 flex gap-2 flex-wrap">
          {!isDeleted && onMessage && (
            <button
              onClick={() => onMessage(contact)}
              className="flex-1 min-w-[100px] bg-whatsapp-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Message
            </button>
          )}
          {!isBlocked && !isDeleted && (
            <>
              <button className="flex-1 min-w-[100px] bg-slate-50 text-slate-600 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 border border-slate-200">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              {onBlock && (
                <button
                  onClick={() => onBlock(contact)}
                  className="flex-1 min-w-[100px] bg-red-50 text-red-500 text-sm font-medium py-2.5 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2 border border-red-100"
                >
                  <Ban className="w-4 h-4" /> Block
                </button>
              )}
            </>
          )}
          {isBlocked && onUnblock && (
            <button
              onClick={() => onUnblock(contact.id)}
              className="flex-1 bg-whatsapp-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2"
            >
              Unblock Contact
            </button>
          )}
          {isDeleted && onRestore && (
            <button
              onClick={() => onRestore(contact.id)}
              className="flex-1 bg-whatsapp-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2"
            >
              Restore Contact
            </button>
          )}
        </div>

        {/* Stats cards */}
        <div className="px-6 py-4 grid grid-cols-3 gap-3">
          <StatCard
            icon={ShoppingBag}
            label="Orders"
            value={(contact.totalOrders ?? 0).toString()}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            icon={IndianRupee}
            label="Spent"
            value={`₹${((contact.totalSpent ?? 0) / 1000).toFixed(1)}K`}
            color="text-whatsapp-600"
            bg="bg-whatsapp-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Order"
            value={`₹${contact.totalOrders ? Math.round((contact.totalSpent ?? 0) / contact.totalOrders).toLocaleString() : 0}`}
            color="text-amber-600"
            bg="bg-amber-50"
          />
        </div>

        {/* Tags */}
        <div className="px-6 py-4 border-t border-slate-50">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Tags
          </p>
          {contact.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((t) => {
                const tc = tagColorFor(t, tagDefs);
                return (
                  <span
                    key={t}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${tc.bg} ${tc.text}`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No tags assigned</p>
          )}
        </div>

        {/* Custom Attributes */}
        {attrs.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Profile Details
            </p>
            <div className="space-y-2">
              {attrs.map((a) => {
                const value = contact.attributes[a.name];
                return (
                  <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{a.name}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {value || '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Membership Tier highlight */}
        {contact.attributes['Membership Tier'] && (
          <div className="px-6 py-4 border-t border-slate-50">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Membership Tier</p>
                <p className="text-lg font-bold text-amber-800">{contact.attributes['Membership Tier']}</p>
              </div>
            </div>
          </div>
        )}

        {/* Activity timeline */}
        <div className="px-6 py-4 border-t border-slate-50">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Activity</p>
          <div className="space-y-3">
            <ActivityItem
              icon={Calendar}
              text="Contact created"
              date={contact.createdAt}
              color="text-blue-500"
            />
            {contact.lastOrderDate && (
              <ActivityItem
                icon={Package}
                text="Last order placed"
                date={contact.lastOrderDate}
                color="text-whatsapp-500"
              />
            )}
            <ActivityItem
              icon={Clock}
              text="Last seen"
              date={contact.lastSeen}
              color="text-slate-400"
            />
            {isBlocked && contact.blockedAt && (
              <ActivityItem
                icon={Ban}
                text={`Blocked: ${contact.blockedReason ?? 'No reason'}`}
                date={contact.blockedAt}
                color="text-red-500"
              />
            )}
            {isDeleted && contact.deletedAt && (
              <ActivityItem
                icon={Trash2}
                text="Contact deleted"
                date={contact.deletedAt}
                color="text-slate-400"
              />
            )}
          </div>
        </div>

        {/* Danger zone for blocked/deleted */}
        {isDeleted && onDelete && (
          <div className="px-6 py-4 border-t border-slate-50">
            <button
              onClick={() => onDelete(contact.id)}
              className="w-full text-sm font-medium text-red-500 bg-red-50 py-2.5 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete Permanently
            </button>
          </div>
        )}

        <div className="h-6" />
      </div>
    </>
  );
}

function StatCard({
  icon: Icon, label, value, color, bg,
}: {
  icon: React.ElementType; label: string; value: string; color: string; bg: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl border border-slate-100">
      <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mx-auto mb-1.5`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm font-bold text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function ActivityItem({
  icon: Icon, text, date, color,
}: {
  icon: React.ElementType; text: string; date: string; color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full bg-slate-50 ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-600 truncate">{text}</p>
        <span className="text-xs text-slate-400 shrink-0">{date}</span>
      </div>
    </div>
  );
}
