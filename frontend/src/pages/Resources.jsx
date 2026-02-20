import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Server, Plus, Trash2, Search, Filter, Building2, FlaskConical, Theater,
    Hash, Users2, Edit3, Eye
} from 'lucide-react';
import {
    getResourcesAPI, createResourceAPI, deleteResourceAPI
} from '../api/api';
import {
    PageTransition, Button, Modal, Input, Select, Badge, EmptyState, SkeletonRow
} from '../components/ui';

const typeIcons = { CLASSROOM: Building2, LAB: FlaskConical, EVENT_HALL: Theater };
const typeColors = { CLASSROOM: 'primary', LAB: 'sky', EVENT_HALL: 'lavender' };
const typeGradients = {
    CLASSROOM: 'from-indigo-500 to-violet-500',
    LAB: 'from-sky-500 to-cyan-500',
    EVENT_HALL: 'from-purple-500 to-pink-500',
};

export default function Resources({ addToast }) {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [showFilter, setShowFilter] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'CLASSROOM', capacity: '' });
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => { fetchResources(); }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await getResourcesAPI();
            setResources(res.data);
        } catch {
            addToast?.('Failed to fetch resources', 'error');
        }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name || !form.capacity) {
            addToast?.('Please fill all fields', 'warning');
            return;
        }
        try {
            await createResourceAPI({ ...form, capacity: parseInt(form.capacity) });
            addToast?.('Resource added successfully!', 'success');
            setForm({ name: '', type: 'CLASSROOM', capacity: '' });
            setShowModal(false);
            fetchResources();
        } catch {
            addToast?.('Error adding resource', 'error');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await deleteResourceAPI(id);
            addToast?.('Resource deleted', 'success');
            fetchResources();
        } catch {
            addToast?.('Error deleting resource', 'error');
        }
    };

    const filtered = resources.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === 'ALL' || r.type === filterType;
        return matchSearch && matchType;
    });

    const filterOptions = ['ALL', 'CLASSROOM', 'LAB', 'EVENT_HALL'];

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-[#1E293B]">
                            Resources
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm text-slate-500 mt-1">
                            Manage campus classrooms, labs, and event halls
                        </motion.p>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
                        <Button icon={Plus} onClick={() => setShowModal(true)}>Add Resource</Button>
                    </motion.div>
                </div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search resources..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1] transition-all text-[#1E293B]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Button variant="secondary" icon={Filter} onClick={() => setShowFilter(!showFilter)}>
                                {filterType === 'ALL' ? 'All Types' : filterType.replace('_', ' ')}
                            </Button>
                            <AnimatePresence>
                                {showFilter && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl shadow-black/8 border border-slate-100 py-2 z-30"
                                    >
                                        {filterOptions.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => { setFilterType(t); setShowFilter(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors cursor-pointer bg-transparent border-none flex items-center gap-2.5 ${filterType === t ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-600'}`}
                                            >
                                                {t !== 'ALL' && (() => {
                                                    const TIcon = typeIcons[t];
                                                    return <TIcon size={14} />;
                                                })()}
                                                {t === 'ALL' ? '🔹 All Types' : t.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Summary badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2"
                >
                    {[
                        { label: 'Total', count: resources.length, color: 'bg-slate-100 text-slate-600' },
                        { label: 'Available', count: resources.filter(r => r.status === 'AVAILABLE').length, color: 'bg-emerald-100 text-emerald-700' },
                        { label: 'Classrooms', count: resources.filter(r => r.type === 'CLASSROOM').length, color: 'bg-indigo-100 text-indigo-700' },
                        { label: 'Labs', count: resources.filter(r => r.type === 'LAB').length, color: 'bg-sky-100 text-sky-700' },
                        { label: 'Event Halls', count: resources.filter(r => r.type === 'EVENT_HALL').length, color: 'bg-purple-100 text-purple-700' },
                    ].map(item => (
                        <span key={item.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                            {item.label}
                            <span className="bg-white/60 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{item.count}</span>
                        </span>
                    ))}
                </motion.div>

                {/* Resource Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                                <div className="skeleton skeleton-title" />
                                <div className="skeleton skeleton-text w-3/4" />
                                <div className="skeleton skeleton-text w-1/2 mt-4" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Server}
                        title="No resources found"
                        description={search || filterType !== 'ALL' ? 'Try adjusting your search or filter.' : 'Add your first campus resource to get started.'}
                        action={!search && filterType === 'ALL' && <Button icon={Plus} onClick={() => setShowModal(true)}>Add Resource</Button>}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((r, i) => {
                            const TypeIcon = typeIcons[r.type] || Building2;
                            const gradient = typeGradients[r.type] || typeGradients.CLASSROOM;
                            return (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.12)' }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all group"
                                >
                                    {/* Color top bar */}
                                    <div className={`h-1 bg-gradient-to-r ${gradient}`} />

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-2.5 bg-gradient-to-br ${gradient} rounded-xl shadow-md shadow-indigo-200/30 group-hover:scale-110 transition-transform`}>
                                                <TypeIcon size={20} className="text-white" />
                                            </div>
                                            <Badge variant={r.status === 'AVAILABLE' ? 'success' : 'error'}>
                                                {r.status || 'N/A'}
                                            </Badge>
                                        </div>
                                        <h3 className="text-base font-bold text-[#1E293B] mb-1 group-hover:text-indigo-600 transition-colors">{r.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                                            <Badge variant={typeColors[r.type] || 'default'}>{r.type?.replace('_', ' ')}</Badge>
                                            <span className="flex items-center gap-1"><Users2 size={13} />{r.capacity} seats</span>
                                        </div>
                                        <div className="flex justify-end pt-3 border-t border-slate-100 gap-1">
                                            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(r.id, r.name)}>
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Add Resource Modal */}
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Resource">
                    <form onSubmit={handleAdd} className="space-y-5">
                        <Input
                            label="Resource Name"
                            icon={Server}
                            placeholder="e.g., Conference Room A"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Select
                            label="Resource Type"
                            icon={Building2}
                            value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                            options={[
                                { value: 'CLASSROOM', label: '🏫 Classroom' },
                                { value: 'LAB', label: '🔬 Lab' },
                                { value: 'EVENT_HALL', label: '🎭 Event Hall' },
                            ]}
                        />
                        <Input
                            label="Capacity"
                            icon={Hash}
                            type="number"
                            placeholder="e.g., 30"
                            value={form.capacity}
                            onChange={e => setForm({ ...form, capacity: e.target.value })}
                            required
                        />
                        <div className="flex justify-end gap-3 pt-3">
                            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button type="submit" icon={Plus}>Add Resource</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </PageTransition>
    );
}
