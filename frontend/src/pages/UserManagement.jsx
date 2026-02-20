import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users2, Plus, Trash2, Mail, User, Phone, Shield, Search, Filter
} from 'lucide-react';
import {
    getUsersAPI, createUserAPI, deleteUserAPI
} from '../api/api';
import {
    PageTransition, Button, Modal, Input, Select, Badge, Card, EmptyState, SkeletonRow
} from '../components/ui';

const roleBadge = (role) => {
    switch (role) {
        case 'ADMIN': return <Badge variant="lavender">Admin</Badge>;
        case 'STAFF': return <Badge variant="sky">Staff</Badge>;
        case 'STUDENT': return <Badge variant="teal">Student</Badge>;
        default: return <Badge>{role}</Badge>;
    }
};

const roleGradients = {
    ADMIN: 'from-purple-400 to-violet-500',
    STAFF: 'from-sky-400 to-blue-500',
    STUDENT: 'from-teal-400 to-emerald-500',
};

export default function UserManagement({ addToast }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'STAFF' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsersAPI();
            setUsers(res.data);
        } catch {
            addToast?.('Failed to fetch users', 'error');
        }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            addToast?.('Name and email are required', 'warning');
            return;
        }
        try {
            await createUserAPI(form);
            addToast?.('User created successfully!', 'success');
            setForm({ name: '', email: '', phone: '', password: '', role: 'STAFF' });
            setShowModal(false);
            fetchUsers();
        } catch {
            addToast?.('Error creating user', 'error');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"?`)) return;
        try {
            await deleteUserAPI(id);
            addToast?.('User deleted', 'success');
            fetchUsers();
        } catch {
            addToast?.('Error deleting user', 'error');
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-[#1E293B]">
                            Users
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm text-slate-500 mt-1">
                            Manage campus users and their roles
                        </motion.p>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <Button icon={Plus} onClick={() => setShowModal(true)}>Add User</Button>
                    </motion.div>
                </div>

                {/* Search & Role Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1] transition-all text-[#1E293B]"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['ALL', 'ADMIN', 'STAFF', 'STUDENT'].map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${roleFilter === role
                                    ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white border-transparent shadow-md shadow-indigo-200/60'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50'
                                    }`}
                            >
                                {role === 'ALL' ? `All Roles` : `${role === 'ADMIN' ? '👑' : role === 'STAFF' ? '💼' : '🎓'} ${role.charAt(0) + role.slice(1).toLowerCase()}`}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                    {[
                        { label: 'Total Users', value: users.length, color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50' },
                        { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50' },
                        { label: 'Staff', value: users.filter(u => u.role === 'STAFF').length, color: 'from-sky-500 to-blue-500', bg: 'bg-sky-50' },
                        { label: 'Students', value: users.filter(u => u.role === 'STUDENT').length, color: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            className={`${item.bg} rounded-xl p-3 border border-white/50`}
                        >
                            <p className="text-xs font-medium text-slate-500">{item.label}</p>
                            <p className="text-lg font-bold text-[#1E293B] mt-0.5">{item.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Users Table */}
                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                                <Users2 size={16} className="text-indigo-400" />
                                All Users
                            </h3>
                            <p className="text-xs text-slate-500">{filtered.length} users found</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    {[...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)}
                                </tbody>
                            </table>
                        </div>
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            icon={Users2}
                            title="No users found"
                            description={search || roleFilter !== 'ALL' ? 'Try a different search term or role filter.' : 'Add your first user to get started.'}
                            action={!search && roleFilter === 'ALL' && <Button icon={Plus} onClick={() => setShowModal(true)}>Add User</Button>}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((u, i) => {
                                        const gradient = roleGradients[u.role] || roleGradients.STUDENT;
                                        return (
                                            <motion.tr
                                                key={u.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors group"
                                            >
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br ${gradient} shadow-sm ring-2 ring-white`}>
                                                            {(u.name || 'U')[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold text-slate-700 block">{u.name}</span>
                                                            <span className="text-[10px] text-slate-400 sm:hidden">{u.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <span className="text-sm text-slate-600 flex items-center gap-1.5">
                                                        <Mail size={13} className="text-slate-400" />
                                                        {u.email}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <span className="text-sm text-slate-600 flex items-center gap-1.5">
                                                        {u.phone ? (
                                                            <>
                                                                <Phone size={13} className="text-slate-400" />
                                                                {u.phone}
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400">—</span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5">{roleBadge(u.role)}</td>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'default'}>
                                                            {u.status || 'Active'}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(u.id, u.name)} />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Add User Modal */}
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User">
                    <form onSubmit={handleAdd} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                icon={User}
                                placeholder="Enter full name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Phone"
                                icon={Phone}
                                placeholder="Enter phone number"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                            <Input
                                label="Password"
                                icon={Shield}
                                type="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <Select
                            label="Role"
                            icon={Shield}
                            value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                            options={[
                                { value: 'ADMIN', label: '👑 Admin' },
                                { value: 'STAFF', label: '💼 Staff' },
                                { value: 'STUDENT', label: '🎓 Student' },
                            ]}
                        />

                        {/* Role Preview */}
                        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role Preview</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleGradients[form.role] || roleGradients.STAFF} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                                    {form.name ? form.name[0].toUpperCase() : '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{form.name || 'User Name'}</p>
                                    <div className="mt-0.5">{roleBadge(form.role)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button type="submit" icon={Plus}>Create User</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </PageTransition>
    );
}
