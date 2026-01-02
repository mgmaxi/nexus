'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Shield, ArrowUpFromLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. CARD CON EFECTO SPOTLIGHT ---
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-[32px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(15, 23, 42, 0.03), transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- 2. INPUT PREMIUM ---
const PremiumInput = memo(({ 
  id, label, type, value, onChange, icon: Icon, 
  showPasswordToggle = false, showPassword = false, onTogglePassword,
  onKeyDown
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;
  
  return (
    <div className="relative mb-5 group">
      <div className="relative transition-all duration-300">
        
        {/* Icono */}
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none z-10 ${isFocused ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-500'}`}>
          <Icon size={20} strokeWidth={isFocused ? 2 : 1.5} />
        </div>

        {/* INPUT */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          className={`
            peer block w-full rounded-2xl border bg-transparent px-14 pt-7 pb-3 text-[15px] font-medium text-slate-900 placeholder-transparent focus:outline-none transition-all duration-300
            ${isFocused 
              ? 'border-slate-900/10 shadow-[0_0_0_4px_rgba(15,23,42,0.03)] bg-slate-50/50' 
              : 'border-slate-200/60 bg-white hover:border-slate-300 hover:bg-slate-50/30'
            }
          `}
          placeholder={label}
        />

        {/* LABEL FLOTANTE */}
        <label
          htmlFor={id}
          className={`
            absolute left-14 pointer-events-none origin-left transition-all duration-200 ease-out select-none font-medium z-10
            ${isActive
              ? 'top-2.5 scale-[0.80] text-slate-500 tracking-wide' 
              : 'top-1/2 -translate-y-1/2 scale-100 text-slate-400 group-hover:text-slate-500'
            }
          `}
        >
          {label}
        </label>

        {/* Toggle Password Mejorado (Hover circular) */}
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-all z-20 active:scale-90"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
});
PremiumInput.displayName = 'PremiumInput';

// --- 3. PÁGINA PRINCIPAL ---
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('nexus_user_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState("CapsLock")) setCapsLock(true);
    else setCapsLock(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (rememberMe) localStorage.setItem('nexus_user_email', email);
    else localStorage.removeItem('nexus_user_email');

    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Credenciales inválidas');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans overflow-hidden bg-[#F8F9FA] selection:bg-slate-900 selection:text-white">
      
      {/* LADO IZQUIERDO */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[45%] relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-[420px]"
        >
          {/* Header */}
          <div className="mb-10 pl-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 mb-8 ring-1 ring-black/5">
              <Shield size={24} fill="currentColor" />
            </div>
            <h1 className="text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
              Bienvenido a Nexus
            </h1>
            <p className="mt-3 text-slate-500 text-lg font-normal">Plataforma de Operaciones Inteligente.</p>
          </div>

          <SpotlightCard className="p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSubmit}>
              
              {/* Notificaciones */}
              <div className="min-h-[20px] mb-6">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div 
                      key="err"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-sm text-red-600 bg-red-50/80 backdrop-blur-sm p-3 rounded-xl border border-red-100/50"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      {error}
                    </motion.div>
                  ) : capsLock ? (
                    <motion.div 
                      key="caps"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50/80 p-3 rounded-xl border border-amber-100/50"
                    >
                      <ArrowUpFromLine size={16} /> Bloq Mayús activado
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <PremiumInput 
                id="email" 
                label="Email corporativo" 
                type="email" 
                value={email} 
                onChange={setEmail} 
                icon={Mail} 
              />
              
              <PremiumInput 
                id="password" 
                label="Contraseña" 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={setPassword} 
                icon={Lock}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onKeyDown={handleKeyDown}
              />

              {/* Checkbox Mejorado para Hover */}
              <div className="flex items-center mt-6 mb-8 pl-1">
                <label className="flex items-center gap-3 cursor-pointer group select-none p-1 -ml-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`
                    w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-200
                    ${rememberMe 
                      ? 'bg-slate-900 border-slate-900 shadow-sm scale-100' 
                      : 'bg-white border-slate-300 group-hover:border-slate-400 group-hover:scale-105 shadow-inner' // Efecto hover aquí
                    }
                  `}>
                    {rememberMe && <ArrowRight size={12} className="text-white rotate-45" strokeWidth={3} />}
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                    />
                  </div>
                  <span className="text-[14px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                    Recordar mi usuario
                  </span>
                </label>
              </div>

              {/* BOTÓN INICIAR SESIÓN */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group relative w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[15px] 
                  shadow-[0_4px_10px_-2px_rgba(15,23,42,0.1)] 
                  hover:bg-slate-800 hover:shadow-[0_10px_20px_-5px_rgba(15,23,42,0.2)] hover:-translate-y-0.5
                  active:scale-[0.98] active:translate-y-0 active:shadow-sm
                  transition-all duration-200 ease-out
                  focus:outline-none focus:ring-4 focus:ring-slate-900/10
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                "
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Iniciar sesión'}
                </div>
              </button>
            </form>
          </SpotlightCard>

          <p className="mt-12 text-center text-xs text-slate-400 font-medium opacity-60">
            Nexus Operation Suite v1.2 • Secure Access
          </p>
        </motion.div>
      </div>

      {/* LADO DERECHO (Sin cambios, ya está perfecto) */}
      <div className="hidden lg:flex w-[55%] relative bg-[#0B0E14] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-lg text-center">
           <div className="inline-flex items-center justify-center h-24 w-24 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl mb-10">
              <Shield size={48} className="text-white drop-shadow-lg" />
           </div>
           <h2 className="text-6xl font-bold text-white mb-8 tracking-tight">
             Visibilidad<br/>Total.
           </h2>
           <p className="text-xl text-slate-400 leading-relaxed font-light max-w-md mx-auto">
             Gestiona proyectos, compara mercados y coordina equipos en una sola plataforma.
           </p>
           <div className="mt-14 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Sistemas Operativos</span>
           </div>
        </div>
      </div>
    </div>
  );
}