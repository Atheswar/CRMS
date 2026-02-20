import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarCheck, Plus, Trash2, Check, X, Clock, ChevronLeft, ChevronRight,
    User, Server, CheckCircle, AlertCircle, CalendarDays, Sparkles
} from 'lucide-react';
import {
    getBookingsAPI, createBookingAPI, updateBookingStatusAPI, deleteBookingAPI,
    getUsersAPI, getResourcesAPI, checkAvailabilityAPI
} from '../api/api';
import {
    PageTransition, Button, Modal, Badge, Card, EmptyState, SkeletonRow
} from '../components/ui';

const TIME_SLOTS = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00',
];

export default function Bookings({ addToast }) {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedResource, setSelectedResource] = useState('');
    const [conflict, setConflict] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [bRes, uRes, rRes] = await Promise.all([
                getBookingsAPI().catch(() => ({ data: [] })),
                getUsersAPI().catch(() => ({ data: [] })),
                getResourcesAPI().catch(() => ({ data: [] })),
            ]);
            setBookings(bRes.data);
            setUsers(uRes.data);
            setResources(rRes.data);
        } catch { }
        setLoading(false);
    };

    const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleDateSelect = (day) => {
        const m = String(calMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        setSelectedDate(`${calYear}-${m}-${d}`);
        setConflict(false);
    };

    const handleSlotSelect = async (slot) => {
        setSelectedSlot(slot);
        setConflict(false);
        if (selectedResource && selectedDate) {
            try {
                const res = await checkAvailabilityAPI(selectedResource, selectedDate, slot);
                if (!res.data) {
                    setConflict(true);
                }
            } catch { }
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedUser || !selectedResource || !selectedDate || !selectedSlot) {
            addToast?.('Please fill all booking fields', 'warning');
            return;
        }
        if (conflict) {
            addToast?.('Time slot unavailable — conflict detected', 'error');
            return;
        }
        try {
            await createBookingAPI(selectedUser, selectedResource, { bookingDate: selectedDate, timeSlot: selectedSlot });
            setBookingSuccess(true);
            addToast?.('Booking created successfully!', 'success');
            setTimeout(() => {
                setBookingSuccess(false);
                setShowModal(false);
                setSelectedDate('');
                setSelectedSlot('');
                setSelectedUser('');
                setSelectedResource('');
                loadAll();
            }, 1800);
        } catch {
            addToast?.('Error creating booking', 'error');
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await updateBookingStatusAPI(id, status);
            addToast?.(`Booking ${status.toLowerCase()}`, 'success');
            loadAll();
        } catch {
            addToast?.('Error updating booking', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this booking?')) return;
        try {
            await deleteBookingAPI(id);
            addToast?.('Booking deleted', 'success');
            loadAll();
        } catch {
            addToast?.('Error deleting booking', 'error');
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return <Badge variant="success">Approved</Badge>;
            case 'REJECTED': return <Badge variant="error">Rejected</Badge>;
            default: return <Badge variant="warning">Pending</Badge>;
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (statusFilter === 'ALL') return true;
        return b.status === statusFilter;
    });

    const renderCalendar = () => {
        const days = daysInMonth(calMonth, calYear);
        const firstDay = firstDayOfMonth(calMonth, calYear);
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
        const today = new Date();
        for (let d = 1; d <= days; d++) {
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
            const isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hasBooking = bookings.some(b => b.bookingDate === dateStr);
            cells.push(
                <motion.button
                    key={d}
                    type="button"
                    whileHover={!isPast ? { scale: 1.12 } : undefined}
                    whileTap={!isPast ? { scale: 0.95 } : undefined}
                    disabled={isPast}
                    onClick={() => handleDateSelect(d)}
                    className={`aspect-square rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-none relative
                        ${isSelected ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white shadow-md shadow-indigo-200' : ''}
                        ${isToday && !isSelected ? 'ring-2 ring-indigo-300 text-indigo-600 bg-indigo-50' : ''}
                        ${!isSelected && !isToday && !isPast ? 'text-slate-600 hover:bg-indigo-50 bg-transparent' : ''}
                        ${isPast ? 'text-slate-300 cursor-not-allowed bg-transparent' : ''}
                    `}
                >
                    {d}
                    {hasBooking && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                    )}
                </motion.button>
            );
        }
        return cells;
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-[#1E293B]">
                            Bookings
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm text-slate-500 mt-1">
                            Schedule and manage campus resource bookings
                        </motion.p>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <Button icon={Plus} onClick={() => setShowModal(true)}>New Booking</Button>
                    </motion.div>
                </div>

                {/* Status filter tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex gap-2 flex-wrap"
                >
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${statusFilter === status
                                    ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white border-transparent shadow-md shadow-indigo-200/60'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50'
                                }`}
                        >
                            {status === 'ALL' ? `All (${bookings.length})` :
                                `${status.charAt(0) + status.slice(1).toLowerCase()} (${bookings.filter(b => b.status === status).length})`}
                        </button>
                    ))}
                </motion.div>

                {/* Bookings Table */}
                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                                <CalendarDays size={16} className="text-indigo-400" />
                                All Bookings
                            </h3>
                            <p className="text-xs text-slate-500">{filteredBookings.length} bookings shown</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    {[...Array(5)].map((_, i) => <SkeletonRow key={i} cols={7} />)}
                                </tbody>
                            </table>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <EmptyState
                            icon={CalendarCheck}
                            title="No bookings found"
                            description={statusFilter !== 'ALL' ? 'No bookings match this filter.' : 'Create your first booking to get started.'}
                            action={statusFilter === 'ALL' && <Button icon={Plus} onClick={() => setShowModal(true)}>New Booking</Button>}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Resource</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Slot</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((b, i) => (
                                        <motion.tr
                                            key={b.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors"
                                        >
                                            <td className="px-6 py-3.5 text-sm text-slate-400 font-mono">#{b.id}</td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                        {(b.user?.name || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">{b.user?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-slate-600">{b.resource?.name || 'N/A'}</td>
                                            <td className="px-6 py-3.5">
                                                <span className="text-sm text-slate-600 flex items-center gap-1.5">
                                                    <CalendarDays size={13} className="text-slate-400" />
                                                    {b.bookingDate}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="text-sm text-slate-600 flex items-center gap-1.5">
                                                    <Clock size={13} className="text-slate-400" />
                                                    {b.timeSlot}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">{statusBadge(b.status)}</td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    {b.status === 'PENDING' && (
                                                        <>
                                                            <Button variant="success" size="sm" icon={Check} onClick={() => handleStatus(b.id, 'APPROVED')} />
                                                            <Button variant="danger" size="sm" icon={X} onClick={() => handleStatus(b.id, 'REJECTED')} />
                                                        </>
                                                    )}
                                                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(b.id)} />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* New Booking Modal */}
                <Modal isOpen={showModal} onClose={() => { setShowModal(false); setBookingSuccess(false); }} title="Create New Booking" size="lg">
                    <AnimatePresence mode="wait">
                        {bookingSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center py-10"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-emerald-50"
                                >
                                    <CheckCircle size={40} className="text-emerald-500" />
                                </motion.div>
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl font-bold text-[#1E293B] flex items-center gap-2"
                                >
                                    Booking Confirmed!
                                    <Sparkles size={18} className="text-amber-400" />
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm text-slate-500 mt-1"
                                >
                                    Your resource has been booked successfully.
                                </motion.p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleBooking}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-500">User</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <select
                                                value={selectedUser}
                                                onChange={e => setSelectedUser(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1] transition-all appearance-none cursor-pointer text-[#1E293B]"
                                            >
                                                <option value="">Select user</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-500">Resource</label>
                                        <div className="relative">
                                            <Server size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <select
                                                value={selectedResource}
                                                onChange={e => setSelectedResource(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1] transition-all appearance-none cursor-pointer text-[#1E293B]"
                                            >
                                                <option value="">Select resource</option>
                                                {resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Calendar */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Select Date</label>
                                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <button type="button" onClick={() => {
                                                if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                                                else setCalMonth(m => m - 1);
                                            }} className="p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer bg-transparent border-none hover:shadow-sm">
                                                <ChevronLeft size={16} className="text-slate-500" />
                                            </button>
                                            <span className="text-sm font-semibold text-slate-700">{monthNames[calMonth]} {calYear}</span>
                                            <button type="button" onClick={() => {
                                                if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                                                else setCalMonth(m => m + 1);
                                            }} className="p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer bg-transparent border-none hover:shadow-sm">
                                                <ChevronRight size={16} className="text-slate-500" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 mb-1">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {renderCalendar()}
                                        </div>
                                    </div>
                                    {selectedDate && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-indigo-500 mt-2 font-medium flex items-center gap-1"
                                        >
                                            <CalendarDays size={12} /> Selected: {selectedDate}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Time Slots */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Select Time Slot</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {TIME_SLOTS.map((slot) => (
                                            <motion.button
                                                key={slot}
                                                type="button"
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => handleSlotSelect(slot)}
                                                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border
                                                    ${selectedSlot === slot
                                                        ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white border-transparent shadow-md shadow-indigo-200/60'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50'}`}
                                            >
                                                <Clock size={11} className="inline mr-1" />
                                                {slot}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conflict Alert */}
                                <AnimatePresence>
                                    {conflict && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            style={{ animation: 'shake 0.5s ease-in-out' }}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                                        >
                                            <div className="p-1.5 bg-red-100 rounded-lg">
                                                <AlertCircle size={16} className="shrink-0" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Schedule Conflict</p>
                                                <p className="text-xs text-red-600 mt-0.5">This time slot is already booked for the selected resource.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button type="submit" icon={CalendarCheck} disabled={conflict}>Create Booking</Button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </Modal>
            </div>
        </PageTransition>
    );
}
