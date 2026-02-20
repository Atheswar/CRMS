import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Server, CalendarCheck, Clock,
    TrendingUp, BookOpen, Building2, Activity,
    ArrowUpRight, BarChart3, Zap
} from 'lucide-react';
import { getUsersAPI, getResourcesAPI, getBookingsAPI } from '../api/api';
import { StatCard, Card, PageTransition, SkeletonCard } from '../components/ui';

export default function Dashboard() {
    const [stats, setStats] = useState({ users: 0, resources: 0, bookings: 0, pending: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [usersRes, resourcesRes, bookingsRes] = await Promise.all([
                getUsersAPI().catch(() => ({ data: [] })),
                getResourcesAPI().catch(() => ({ data: [] })),
                getBookingsAPI().catch(() => ({ data: [] })),
            ]);
            setStats({
                users: usersRes.data.length,
                resources: resourcesRes.data.length,
                bookings: bookingsRes.data.length,
                pending: bookingsRes.data.filter(b => b.status === 'PENDING').length,
            });
            setRecentBookings(bookingsRes.data.slice(-5).reverse());
        } catch (e) {
            console.error('Dashboard load error', e);
        }
        setLoading(false);
    };

    const statusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const chartHeights = [65, 80, 45, 90, 70, 35, 55];

    return (
        <PageTransition>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-[#1E293B]"
                        >
                            Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-slate-500 mt-1"
                        >
                            Overview of your campus resource management
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
                    >
                        <Zap size={14} className="text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-600">Live Data</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </motion.div>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard title="Total Users" value={stats.users} subtitle="Active accounts" icon={Users} color="indigo" delay={0} />
                        <StatCard title="Resources" value={stats.resources} subtitle="Campus facilities" icon={Server} color="sky" delay={0.1} />
                        <StatCard title="Active Bookings" value={stats.bookings} subtitle="All time" icon={CalendarCheck} color="emerald" delay={0.2} />
                        <StatCard title="Pending Requests" value={stats.pending} subtitle="Awaiting approval" icon={Clock} color="amber" delay={0.3} />
                    </div>
                )}

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                                        <BarChart3 size={16} className="text-indigo-400" />
                                        Booking Overview
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Weekly booking activity</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                    <TrendingUp size={14} />
                                    <span className="font-medium">This Week</span>
                                </div>
                            </div>

                            {/* Y-axis labels + Bars */}
                            <div className="flex gap-3">
                                <div className="flex flex-col justify-between h-44 text-[10px] text-slate-400 font-medium">
                                    <span>10</span>
                                    <span>8</span>
                                    <span>5</span>
                                    <span>3</span>
                                    <span>0</span>
                                </div>
                                <div className="flex-1 flex items-end gap-3 h-44 px-2 border-l border-b border-slate-100">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                        <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: `${chartHeights[i]}%`, opacity: 1 }}
                                                transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                className="w-full rounded-t-xl relative group cursor-pointer"
                                                style={{
                                                    background: i === 3
                                                        ? 'linear-gradient(to top, #6366F1, #818CF8)'
                                                        : `linear-gradient(to top, #6366F1${i % 2 === 0 ? 'CC' : 'AA'}, #93C5FD${i % 2 === 0 ? 'BB' : '99'})`,
                                                }}
                                                whileHover={{ scaleY: 1.05, filter: 'brightness(1.1)' }}
                                            >
                                                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                                    {Math.round(chartHeights[i] / 10)} bookings
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E293B] rotate-45" />
                                                </div>
                                            </motion.div>
                                            <span className="text-[10px] font-medium text-slate-400">{day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="p-6 h-full">
                            <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-purple-400" />
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { icon: BookOpen, label: 'Classrooms', value: 'Available', stat: '12/15', color: 'text-indigo-500', bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
                                    { icon: Building2, label: 'Labs', value: 'Active', stat: '8/10', color: 'text-sky-500', bg: 'bg-sky-50', ring: 'ring-sky-100' },
                                    { icon: Activity, label: 'Event Halls', value: 'Booked', stat: '3/5', color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-100' },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-all group cursor-default border border-transparent hover:border-slate-100"
                                    >
                                        <div className={`p-2 rounded-lg ${item.bg} ring-1 ${item.ring} group-hover:scale-110 transition-transform`}>
                                            <item.icon size={16} className={item.color} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.value}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-bold text-slate-700">{item.stat}</span>
                                            <ArrowUpRight size={12} className="text-emerald-500" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Mini activity feed */}
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity</h4>
                                <div className="space-y-2.5">
                                    {[
                                        { text: 'Lab A-201 booked', time: '2m ago', color: 'bg-indigo-400' },
                                        { text: 'New user registered', time: '8m ago', color: 'bg-emerald-400' },
                                        { text: 'Booking approved', time: '15m ago', color: 'bg-amber-400' },
                                    ].map((act, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 + i * 0.1 }}
                                            className="flex items-center gap-2.5"
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${act.color}`} />
                                            <span className="text-xs text-slate-600 flex-1">{act.text}</span>
                                            <span className="text-[10px] text-slate-400">{act.time}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-[#1E293B]">Recent Bookings</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Latest booking activity</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                {recentBookings.length} recent
                            </span>
                        </div>
                        {recentBookings.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <CalendarCheck size={20} className="text-indigo-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">No bookings yet</p>
                                <p className="text-xs text-slate-400 mt-1">Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Resource</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((b, i) => (
                                            <motion.tr
                                                key={b.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 + i * 0.05 }}
                                                className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                            {(b.user?.name || 'U')[0].toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700">{b.user?.name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-slate-600">{b.resource?.name || 'N/A'}</td>
                                                <td className="px-6 py-3.5 text-sm text-slate-600">{b.bookingDate}</td>
                                                <td className="px-6 py-3.5 text-sm text-slate-600">{b.timeSlot}</td>
                                                <td className="px-6 py-3.5">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </PageTransition>
    );
}
