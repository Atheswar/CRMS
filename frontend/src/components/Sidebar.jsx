import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    CalendarCheck,
    Users,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Sparkles,
} from 'lucide-react';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-indigo-400 to-violet-400' },
    { to: '/resources', label: 'Resources', icon: Server, color: 'from-sky-400 to-cyan-400' },
    { to: '/bookings', label: 'Bookings', icon: CalendarCheck, color: 'from-emerald-400 to-teal-400' },
    { to: '/users', label: 'Users', icon: Users, color: 'from-purple-400 to-pink-400' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#1E1B4B] text-white overflow-hidden"
        >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-purple-900/30 pointer-events-none" />

            {/* Logo */}
            <div className="relative flex items-center gap-3 px-5 py-5 border-b border-white/10 min-h-[72px]">
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="shrink-0 w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
                >
                    <GraduationCap size={20} className="text-white" />
                </motion.div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <h1 className="text-base font-bold tracking-tight flex items-center gap-1.5">
                                CRMS
                                <Sparkles size={12} className="text-indigo-300" />
                            </h1>
                            <p className="text-[10px] text-indigo-300 -mt-0.5">Campus Resources</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-3 py-4 space-y-1">
                {navItems.map((item, index) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline ${isActive
                                ? 'bg-white/15 text-white shadow-md shadow-black/10'
                                : 'text-indigo-200 hover:bg-white/8 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`shrink-0 p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/10' : 'group-hover:bg-white/5'}`}
                                >
                                    <item.icon size={18} />
                                </motion.div>
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {isActive && !collapsed && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeBar"
                                        className="absolute left-0 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Decorative element */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative mx-4 mb-3 p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10"
                    >
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-300 to-orange-400 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 text-xs font-bold text-white">
                            ✨
                        </div>
                        <p className="text-xs font-semibold text-white/90">Pro Tip</p>
                        <p className="text-[10px] text-indigo-200 mt-0.5 leading-relaxed">
                            Use bookings to manage resource scheduling effortlessly.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse Toggle */}
            <div className="relative px-3 py-3 border-t border-white/10">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-indigo-300 hover:bg-white/8 hover:text-white transition-all duration-200 text-sm cursor-pointer bg-transparent border-none"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="whitespace-nowrap font-medium"
                            >
                                Collapse
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
}
