import { useState } from 'react';
import {
  Plus, Search, MoreVertical, Shield, Crown, User, Eye, Mail,
  Check, X, UserPlus, Trash2, Pencil, Ban, ChevronDown,
} from 'lucide-react';
import {
  permissionsMatrix, roleDescriptions,
  type TeamMember, type Role,
} from '@/data/mockData';
import { useTeamMembers } from '@/lib/hooks';

const roleConfig: Record<Role, { icon: typeof Crown; color: string; bg: string }> = {
  Owner: { icon: Crown, color: 'text-amber-600', bg: 'bg-amber-100' },
  Admin: { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
  Agent: { icon: User, color: 'text-whatsapp-600', bg: 'bg-whatsapp-100' },
  Viewer: { icon: Eye, color: 'text-slate-500', bg: 'bg-slate-100' },
};

const statusConfig: Record<string, { color: string; dot: string }> = {
  Active: { color: 'text-whatsapp-600', dot: 'bg-whatsapp-500' },
  Invited: { color: 'text-amber-600', dot: 'bg-amber-500' },
  Suspended: { color: 'text-red-500', dot: 'bg-red-500' },
};

const permissionLabels: { key: string; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'manageTeam', label: 'Manage Team' },
  { key: 'billing', label: 'Billing' },
  { key: 'settings', label: 'Settings' },
];

export default function TeamAccess() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Agent');
  const [inviteName, setInviteName] = useState('');
  const [invited, setInvited] = useState(false);
  const { list: members, addMember, updateMember, deleteMember } = useTeamMembers();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || m.role === roleFilter;
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    await addMember({ name: inviteName, email: inviteEmail, role: inviteRole });
    setInvited(true);
    setTimeout(() => {
      setShowInvite(false);
      setInvited(false);
      setInviteEmail('');
      setInviteName('');
      setInviteRole('Agent');
    }, 1500);
  };

  const handleRoleChange = (id: string, newRole: Role) => {
    updateMember(id, { role: newRole });
    setOpenMenu(null);
  };

  const handleSuspend = (id: string) => {
    const m = members.find((x) => x.id === id);
    updateMember(id, { status: m?.status === 'Suspended' ? 'Active' : 'Suspended' });
    setOpenMenu(null);
  };

  const handleRemove = (id: string) => {
    deleteMember(id);
    setOpenMenu(null);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Total Members" value={members.length.toString()} />
        <MiniStat label="Active" value={members.filter((m) => m.status === 'Active').length.toString()} />
        <MiniStat label="Pending Invites" value={members.filter((m) => m.status === 'Invited').length.toString()} />
        <MiniStat label="Open Chats" value={members.reduce((s, m) => s + m.assignedChats, 0).toString()} />
      </div>

      {/* Header + invite */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Filter tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Role:</span>
          {(['All', 'Owner', 'Admin', 'Agent', 'Viewer'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                roleFilter === f ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Status:</span>
          {['All', 'Active', 'Invited', 'Suspended'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === f ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Team table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Member</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden md:table-cell">Chats</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden lg:table-cell">Last Active</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const rc = roleConfig[m.role];
                const sc = statusConfig[m.status];
                const RoleIcon = rc.icon;
                return (
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-sm font-semibold shrink-0">
                          {m.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{m.name}</p>
                          <p className="text-xs text-slate-400 truncate">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${rc.bg} ${rc.color}`}>
                        <RoleIcon className="w-3 h-3" /> {m.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${sc.color}`}>
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} /> {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600">{m.assignedChats}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-slate-400">{m.lastActive}</span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenu === m.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-40">
                            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">Change Role</div>
                            {(Object.keys(roleConfig) as Role[]).map((r) => (
                              <button
                                key={r}
                                onClick={() => handleRoleChange(m.id, r)}
                                disabled={m.role === 'Owner'}
                                className={`w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed ${
                                  m.role === r ? 'text-whatsapp-600 font-medium' : 'text-slate-600'
                                }`}
                              >
                                {r}
                                {m.role === r && <Check className="w-3.5 h-3.5" />}
                              </button>
                            ))}
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => handleSuspend(m.id)}
                              disabled={m.role === 'Owner'}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 disabled:opacity-40"
                            >
                              <Ban className="w-3.5 h-3.5" /> {m.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                            </button>
                            <button
                              onClick={() => handleRemove(m.id)}
                              disabled={m.role === 'Owner'}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-40"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions matrix */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-whatsapp-600" /> Access Control Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">What each role can do across the platform</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Permission</th>
                {(Object.keys(roleConfig) as Role[]).map((r) => {
                  const rc = roleConfig[r];
                  const Icon = rc.icon;
                  return (
                    <th key={r} className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${rc.color}`} />
                        <span className="text-xs font-semibold text-slate-600">{r}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {permissionLabels.map((p) => (
                <tr key={p.key} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-600">{p.label}</td>
                  {(Object.keys(roleConfig) as Role[]).map((r) => (
                    <td key={r} className="px-4 py-3 text-center">
                      {permissionsMatrix[r][p.key] ? (
                        <Check className="w-4 h-4 text-whatsapp-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role descriptions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(roleConfig) as Role[]).map((r) => {
          const rc = roleConfig[r];
          const Icon = rc.icon;
          return (
            <div key={r} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${rc.bg} ${rc.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="font-semibold text-slate-800 text-sm mt-3">{r}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{roleDescriptions[r]}</p>
            </div>
          );
        })}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => !invited && setShowInvite(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {invited ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-whatsapp-100 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 text-whatsapp-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mt-4">Invitation Sent!</h3>
                <p className="text-sm text-slate-500 mt-2">An email invite has been sent to {inviteEmail}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-whatsapp-600" /> Invite Team Member
                  </h3>
                  <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                    <input
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Rohit Das"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Email Address</label>
                    <input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="name@store.com"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Access Level</label>
                    <div className="relative">
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as Role)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 appearance-none bg-white"
                      >
                        {(Object.keys(roleConfig) as Role[]).filter((r) => r !== 'Owner').map((r) => (
                          <option key={r} value={r}>{r} — {roleDescriptions[r]}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">An email invitation will be sent. The member will get access once they accept.</p>
                  </div>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim() || !inviteName.trim()}
                    className={`w-full text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
                      inviteEmail.trim() && inviteName.trim()
                        ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Send Invitation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
