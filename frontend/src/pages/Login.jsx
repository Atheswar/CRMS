import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLogin({ email, name: email.split('@')[0] });
        }, 1200);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 20%, #818CF8 40%, #93C5FD 60%, #C4B5FD 80%, #6366F1 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient-shift 15s ease infinite',
                }}
            />

            {/* Floating Shapes */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: 60 + i * 40,
                        height: 60 + i * 40,
                        background: `radial-gradient(circle, rgba(255,255,255,${0.25 - i * 0.02}) 0%, transparent 70%)`,
                        left: `${5 + i * 12}%`,
                        top: `${10 + (i % 4) * 22}%`,
                    }}
                    animate={{
                        y: [0, -25 + i * 4, 0],
                        x: [0, 12 - i * 3, 0],
                        scale: [1, 1.06, 1],
                        rotate: [0, i % 2 === 0 ? 5 : -5, 0],
                    }}
                    transition={{
                        duration: 5 + i * 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Decorative blurred circles */}
            <div className="absolute top-16 left-16 w-80 h-80 bg-white/10 rounded-full blur-3xl" style={{ animation: 'float-slow 8s ease-in-out infinite' }} />
            <div className="absolute bottom-16 right-16 w-[28rem] h-[28rem] bg-purple-300/10 rounded-full blur-3xl" style={{ animation: 'float-slow 10s ease-in-out infinite 2s' }} />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-sky-300/15 rounded-full blur-2xl" style={{ animation: 'float-slow 7s ease-in-out infinite 1s' }} />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Login Card — Glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-[420px] mx-4"
            >
                <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/15">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex flex-col items-center mb-8"
                    >
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm border border-white/30"
                        >
                            <GraduationCap size={32} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome to CRMS</h1>
                        <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
                            Campus Resource Management
                            <Sparkles size={12} className="text-amber-300" />
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="relative group"
                        >
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors z-10" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/35 border border-white/15 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/15 transition-all duration-300 text-sm font-medium"
                                style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)' }}
                            />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-white/0 via-white/60 to-white/0 rounded-full transition-all duration-300 w-0 group-focus-within:w-[calc(100%-16px)]" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="relative group"
                        >
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors z-10" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder:text-white/35 border border-white/15 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/15 transition-all duration-300 text-sm font-medium"
                                style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-white/0 via-white/60 to-white/0 rounded-full transition-all duration-300 w-0 group-focus-within:w-[calc(100%-16px)]" />
                        </motion.div>

                        {/* Remember me + Forgot */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="flex items-center justify-between text-xs"
                        >
                            <label className="flex items-center gap-2 text-white/50 cursor-pointer hover:text-white/70 transition-colors">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-indigo-400 cursor-pointer" />
                                Remember me
                            </label>
                            <button type="button" className="text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer font-medium">
                                Forgot password?
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3.5 rounded-xl text-sm font-bold text-indigo-700 bg-white shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer border-none transition-all duration-200"
                                style={{ animation: loading ? 'none' : 'pulse-glow 3s ease-in-out infinite' }}
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full"
                                    />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-3 my-6"
                    >
                        <div className="flex-1 h-px bg-white/15" />
                        <span className="text-white/30 text-xs font-medium">OR</span>
                        <div className="flex-1 h-px bg-white/15" />
                    </motion.div>

                    {/* SSO Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.75 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full py-3 rounded-xl text-sm font-medium text-white border border-white/15 cursor-pointer bg-transparent hover:bg-white/8 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        🎓 Sign in with University SSO
                    </motion.button>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-center"
                    >
                        <p className="text-white/40 text-xs">
                            Demo: Enter any email & password to continue
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
