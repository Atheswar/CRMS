import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

/* ═══════════════════════════════════════════
   Toast Notification System
   ═══════════════════════════════════════════ */

let toastId = 0;
let addToastFn = null;

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, duration }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    addToastFn = addToast;

    return { toasts, addToast, removeToast };
}

export function toast(message, type = 'info', duration = 4000) {
    if (addToastFn) addToastFn(message, type, duration);
}

const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const toastColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
};

const toastIconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-indigo-500',
};

export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container">
            <AnimatePresence mode="popLayout">
                {toasts.map((t) => {
                    const Icon = toastIcons[t.type] || Info;
                    return (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-lg shadow-black/5 backdrop-blur-sm min-w-[320px] max-w-[440px] ${toastColors[t.type]}`}
                        >
                            <div className={`p-1 rounded-lg ${t.type === 'success' ? 'bg-emerald-100' : t.type === 'error' ? 'bg-red-100' : t.type === 'warning' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                                <Icon size={16} className={`shrink-0 ${toastIconColors[t.type]}`} />
                            </div>
                            <span className="text-sm font-medium flex-1">{t.message}</span>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none p-1 rounded-lg hover:bg-black/5"
                            >
                                <X size={14} />
                            </button>
                            {t.duration > 0 && (
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-current opacity-15"
                                    style={{ animation: `progress ${t.duration}ms linear forwards` }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════
   Animated Button with Ripple
   ═══════════════════════════════════════════ */

export function Button({ children, onClick, variant = 'primary', size = 'md', icon: Icon, className = '', disabled = false, type = 'button', ...props }) {
    const btnRef = useRef(null);

    const handleClick = (e) => {
        // Ripple
        const btn = btnRef.current;
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
        onClick?.(e);
    };

    const baseClasses = 'btn-ripple inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3 text-base',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white shadow-md shadow-indigo-200/60 hover:shadow-lg hover:shadow-indigo-300/60 hover:-translate-y-0.5 active:translate-y-0',
        secondary: 'bg-white text-[#6366F1] border border-slate-200 shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:-translate-y-0.5',
        danger: 'bg-gradient-to-r from-red-500 to-rose-400 text-white shadow-md shadow-red-200/60 hover:shadow-lg hover:shadow-red-300/60 hover:-translate-y-0.5',
        ghost: 'bg-transparent text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]',
        success: 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-md shadow-emerald-200/60 hover:shadow-lg hover:shadow-emerald-300/60 hover:-translate-y-0.5',
    };

    return (
        <motion.button
            ref={btnRef}
            type={type}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            onClick={handleClick}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
            {children}
        </motion.button>
    );
}

/* ═══════════════════════════════════════════
   Modal with Slide-in Effect
   ═══════════════════════════════════════════ */

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl shadow-black/10 border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col`}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-[#1E293B]">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer bg-transparent border-none text-slate-400 hover:text-slate-600"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════════════════
   Animated Input
   ═══════════════════════════════════════════ */

export function Input({ label, icon: Icon, error, ...props }) {
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-sm font-medium text-[#64748B]">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6366F1] transition-colors" />
                )}
                <input
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm bg-slate-50/80 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-[#6366F1]'} rounded-xl outline-none focus:ring-2 transition-all duration-200 placeholder:text-slate-400 text-[#1E293B]`}
                    {...props}
                />
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#93C5FD] rounded-full transition-all duration-300 ${error ? 'w-full bg-gradient-to-r from-red-500 to-rose-400' : 'w-0 group-focus-within:w-[calc(100%-16px)]'}`} />
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        </div>
    );
}

/* ═══════════════════════════════════════════
   Select
   ═══════════════════════════════════════════ */

export function Select({ label, options, icon: Icon, ...props }) {
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-sm font-medium text-[#64748B]">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6366F1] transition-colors pointer-events-none" />
                )}
                <select
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1] transition-all duration-200 appearance-none cursor-pointer text-[#1E293B]`}
                    {...props}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   Badge
   ═══════════════════════════════════════════ */

export function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-slate-100 text-slate-600',
        primary: 'bg-indigo-100 text-indigo-700',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        lavender: 'bg-purple-100 text-purple-700',
        sky: 'bg-sky-100 text-sky-700',
        teal: 'bg-teal-100 text-teal-700',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

/* ═══════════════════════════════════════════
   Card
   ═══════════════════════════════════════════ */

export function Card({ children, className = '', hover = false, ...props }) {
    return (
        <motion.div
            whileHover={hover ? { y: -4, boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.12)' } : undefined}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════
   Stat Card — Animated Counters
   ═══════════════════════════════════════════ */

export function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', delay = 0 }) {
    const colorMap = {
        indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', ring: 'ring-indigo-100', gradient: 'from-indigo-500 to-indigo-400' },
        sky: { bg: 'bg-sky-50', icon: 'text-sky-500', ring: 'ring-sky-100', gradient: 'from-sky-500 to-sky-400' },
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', ring: 'ring-emerald-100', gradient: 'from-emerald-500 to-emerald-400' },
        amber: { bg: 'bg-amber-50', icon: 'text-amber-500', ring: 'ring-amber-100', gradient: 'from-amber-500 to-amber-400' },
        purple: { bg: 'bg-purple-50', icon: 'text-purple-500', ring: 'ring-purple-100', gradient: 'from-purple-500 to-purple-400' },
    };

    const c = colorMap[color] || colorMap.indigo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.12)' }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-default group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <motion.p
                        className="text-3xl font-bold text-[#1E293B] mt-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
                    >
                        {value}
                    </motion.p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3.5 rounded-xl ${c.bg} ring-1 ${c.ring} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={24} className={c.icon} />
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════
   Skeleton Loader
   ═══════════════════════════════════════════ */

export function SkeletonRow({ cols = 5 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-5 py-4">
                    <div className="skeleton skeleton-text" style={{ width: `${60 + Math.random() * 30}%` }} />
                </td>
            ))}
        </tr>
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                    <div className="skeleton skeleton-text w-24" />
                    <div className="skeleton skeleton-title w-16" />
                </div>
                <div className="skeleton w-12 h-12 rounded-xl" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   Page Transition Wrapper
   ═══════════════════════════════════════════ */

export function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════
   Empty State
   ═══════════════════════════════════════════ */

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
        >
            <div className="p-4 bg-indigo-50 rounded-2xl mb-4 ring-1 ring-indigo-100">
                <Icon size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </motion.div>
    );
}
