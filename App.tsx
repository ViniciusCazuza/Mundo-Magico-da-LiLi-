import React, { useState, useRef, useEffect, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { Cat, AlertCircle, RefreshCw, Book, MessageSquare, Calendar, Palette, User, ShieldCheck, Lock, LogOut } from "lucide-react";
import GatinhaLogo from './core/assets/GATINHA_LOGO.svg?react';

// Core Imports
import { Conversation, UsageLog, AppSection, AppTheme, CalendarEvent, ParentReport } from "./core/types";
import { INITIAL_GREETINGS, THEMES, STORAGE_KEYS } from "./core/config";
import { safeJsonParse, getCurrentBreakpoint, getResponsiveValue } from "./core/utils";
import { mimiEvents, MIMI_EVENT_TYPES } from "./core/events";
import { IdentityManager } from "./core/ecosystem/IdentityManager";
import { ECOSYSTEM_EVENTS, AliceProfile, EcosystemSession } from "./core/ecosystem/types";
import CustomCursor from './core/components/CustomCursor';
import MobileNav from './core/components/MobileNav';

// Modules Imports
import { ChatModule } from "./modules/chat/index";
import { ParentZoneView } from "./modules/parent/index";
import { QuotaModule } from "./modules/quota/index";
import { PerfilModule } from "./modules/perfil/index";
import { StudioModule } from "./modules/studio/index";
import { LibraryModule } from "./modules/library/index";
import { AgendaModule } from "./modules/agenda/Agenda";

// Perfil Imports for AppShell
import { PerfilState } from './modules/perfil/types';
import { perfilStorage } from './modules/perfil/services/perfilStorage';

class ErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    constructor(props: { children?: ReactNode }) {
        super(props);
    }


    static getDerivedStateFromError(_: Error) { return { hasError: true }; }
    componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info); }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-[9999]">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm border-2 border-slate-100">
                        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
                        <h1 className="font-hand text-4xl mb-4">Ops! Ocorreu um soluço mágico.</h1>
                        <button onClick={() => window.location.reload()} className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black flex items-center justify-center gap-3"><RefreshCw size={22} /> Recarregar</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

interface AppShellProps {
    profile: AliceProfile;
    onLogout: () => void;
    sessionConv: Conversation | null;
    onUpdateConversation: (conv: Conversation) => void;
}

const AppShell = ({ profile, onLogout, sessionConv, onUpdateConversation }: AppShellProps) => {
    const [section, setSection] = useState<AppSection>("chat");
    const [theme, setTheme] = useState<AppTheme>(() => safeJsonParse(STORAGE_KEYS.THEME, THEMES[0]));
    const [currentProfile, setCurrentProfile] = useState<AliceProfile>(profile);
    const [usageLogs, setUsageLogs] = useState<UsageLog[]>(() => safeJsonParse(STORAGE_KEYS.USAGE, []));
    const [reports, setReports] = useState<ParentReport[]>(() => safeJsonParse(STORAGE_KEYS.REPORTS, []));
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => safeJsonParse(STORAGE_KEYS.CALENDAR, []));
    const [perfilState, setPerfilState] = useState<PerfilState>(() => perfilStorage.getInitialState()); // Load PerfilState
    const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>(getCurrentBreakpoint()); // Track current breakpoint
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // State for mobile nav
    const scrollRef = useRef<HTMLDivElement>(null);

    const isAdmin = currentProfile.role === "parent_admin";

    // Determine activeTheme outside the return statement
    const activeTheme = isAdmin ? {
        ...THEMES[3],
        tokens: {
            ...THEMES[3].tokens,
            colors: {
                ...THEMES[3].tokens.colors,
                primary: '#0F172A',
                background: '#F8FAFC',
                surface: '#FFFFFF'
            }
        }
    } as AppTheme : theme;

    const logoFillColorClass = activeTheme.id === 'siamese' ? 'fill-black' : 'fill-white';

    useEffect(() => {
        const handleResize = () => {
            setCurrentBreakpoint(getCurrentBreakpoint());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const unsubUpdate = mimiEvents.on(ECOSYSTEM_EVENTS.PROFILE_UPDATED, (updated) => {
            if (updated.id === currentProfile.id) setCurrentProfile(updated);
        });
        const unsubLegacy = mimiEvents.on("PROFILE_UPDATED", (newState) => {
            if (newState.app?.theme && !isAdmin) setTheme(newState.app.theme);
            setPerfilState(newState); // Update perfilState from the event
        });
        const unsubReports = mimiEvents.on(MIMI_EVENT_TYPES.REPORT_CREATED, (updated) => setReports(updated));

        return () => {
            unsubUpdate();
            unsubLegacy();
            unsubReports();
        };
    }, [currentProfile.id, isAdmin]);

    useEffect(() => {
        const root = document.documentElement;
        const activeTheme = isAdmin ? {
            ...THEMES[3],
            tokens: {
                ...THEMES[3].tokens,
                colors: {
                    ...THEMES[3].tokens.colors,
                    primary: '#0F172A',
                    background: '#F8FAFC',
                    surface: '#FFFFFF'
                }
            }
        } as AppTheme : theme;

        const { tokens } = activeTheme;

        const responsiveBaseSize = getResponsiveValue(tokens.typography.baseSize, currentBreakpoint);
        const responsiveLineHeight = getResponsiveValue(tokens.typography.lineHeight, currentBreakpoint);
        const responsiveSpacingScale = getResponsiveValue(tokens.layout.spacingScale, currentBreakpoint);

        let finalBackground = tokens.colors.background;
        if (perfilState.app.customBackgroundByThemeId?.[activeTheme.id]) {
            finalBackground = `url("${perfilState.app.customBackgroundByThemeId[activeTheme.id]}")`;
        }
        root.setAttribute('data-theme', isAdmin ? 'admin-sober' : activeTheme.id);
        root.style.setProperty('--primary', tokens.colors.primary);
        root.style.setProperty('--secondary', tokens.colors.secondary);
        root.style.setProperty('--accent', tokens.colors.accent);
        root.style.setProperty('--bg-app', finalBackground);
        root.style.setProperty('--surface', tokens.colors.surface);
        root.style.setProperty('--surface-elevated', tokens.colors.surfaceElevated);
        root.style.setProperty('--text-primary', tokens.colors.text);
        root.style.setProperty('--text-secondary', tokens.colors.textSecondary);
        root.style.setProperty('--text-muted', tokens.colors.textMuted);
        root.style.setProperty('--text-on-primary', tokens.colors.textOnPrimary);
        root.style.setProperty('--text-on-accent', tokens.colors.textOnAccent);
        root.style.setProperty('--border-color', tokens.colors.border);
        root.style.setProperty('--radius-base', tokens.layout.borderRadius);
        root.style.setProperty('--border-width', tokens.layout.borderWidth);
        root.style.setProperty('--blur-base', tokens.layout.blurIntensity);
        root.style.setProperty('--shadow-base', tokens.colors.shadow);
        root.style.setProperty('--shadow-elevated', tokens.colors.shadowElevated);
        root.style.setProperty('--spacing-unit', { compact: '1rem', comfortable: '1.5rem', spacious: '2.5rem' }[responsiveSpacingScale || 'comfortable']);
        root.style.setProperty('--font-family', tokens.typography.fontFamily);
        root.style.setProperty('--font-size-base', responsiveBaseSize || '16px');
        root.style.setProperty('--line-height-base', responsiveLineHeight || '1.6');
        root.style.setProperty('--letter-spacing-heading', tokens.typography.letterSpacingHeading);
        root.style.setProperty('--font-weight-bold', { playful: '800', elegant: '300', bold: '700', clean: '600' }[tokens.typography.headingStyle]);
        root.style.setProperty('--transition-speed', tokens.motion.transitionSpeed);
        root.style.setProperty('--hover-scale', tokens.motion.hoverScale);
        root.style.setProperty('--ease-base', tokens.motion.ease);
        root.style.setProperty('--pattern-bg', isAdmin ? 'none' : tokens.decorative.backgroundPattern);
    }, [theme, isAdmin, perfilState, currentBreakpoint]);

    return (
        <div
            className="fixed inset-0 flex flex-col overflow-hidden text-[var(--text-primary)] transition-all animate-fade-in font-sans"
            style={{
                backgroundImage: 'var(--bg-app)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {!isAdmin && (
                <div className="fixed inset-0 pointer-events-none opacity-40 z-0 animate-aurora" style={{ backgroundImage: 'var(--pattern-bg)', backgroundSize: '400% 400%' }}></div>
            )}

            <nav className={`h-24 shrink-0 border-b border-[var(--border-color)] px-10 flex items-center justify-between z-50 shadow-sm backdrop-blur-3xl transition-all ${isAdmin ? 'bg-slate-900 border-slate-700' : 'bg-[var(--surface)]/90'}`}>
                <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setSection("chat")}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 animate-breathing ${isAdmin ? 'bg-slate-700' : 'bg-[var(--primary)] shadow-[0_0_20px_var(--primary)]'}`}>
                        <GatinhaLogo className={`w-full h-full p-1 ${logoFillColorClass}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-hand text-5xl font-black leading-none -mb-1 ${isAdmin ? 'text-slate-100' : 'text-[var(--primary)]'}`}>Mimi</span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isAdmin ? 'text-slate-400' : 'text-[var(--text-muted)]'}`}>
                            {isAdmin ? 'Reino dos Pais' : `Mundo da ${currentProfile.nickname}`}
                        </span>
                    </div>
                </div>

                {/* Hamburger menu for mobile */}
                <button onClick={() => setIsMobileNavOpen(true)} className="lg:hidden p-3 text-[var(--text-primary)] hover:text-[var(--primary)]">
                    <Menu size={28} />
                </button>

                <div className="hidden lg:flex gap-3 p-2 rounded-[2.5rem] bg-black/5 backdrop-blur-sm border border-white/10">
                    <NavButton icon={MessageSquare} label="Conversar" active={section === 'chat'} onClick={() => setSection('chat')} isAdmin={isAdmin} />
                    <NavButton icon={Palette} label="Ateliê" active={section === 'studio'} onClick={() => setSection('studio')} isAdmin={isAdmin} />
                    <NavButton icon={Book} label="Baú de Artes" active={section === 'library'} onClick={() => setSection('library')} isAdmin={isAdmin} />
                    <NavButton icon={Calendar} label="Agenda" active={section === 'calendar'} onClick={() => setSection('calendar')} isAdmin={isAdmin} />
                    {isAdmin && <NavButton icon={ShieldCheck} label="Monitor" active={section === 'parent-zone'} onClick={() => setSection('parent-zone')} isAdmin={isAdmin} />}
                    <NavButton icon={User} label="Eu" active={section === 'profile'} onClick={() => setSection('profile')} isAdmin={isAdmin} />
                </div>

                <div className="flex items-center gap-5">
                    <div onClick={() => setSection('profile')} className="flex items-center gap-3 px-4 py-2 rounded-2xl border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] flex items-center justify-center font-black text-[var(--primary)] text-lg shadow-inner overflow-hidden relative border border-white/30 group-hover:scale-105 transition-transform">
                            {currentProfile.profileImage?.data ? <img key={currentProfile.profileImage.updatedAt} src={currentProfile.profileImage.data} className="w-full h-full object-cover" /> : <span>{currentProfile.nickname[0]}</span>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block opacity-60">Meu Perfil</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className={`
              p-3 rounded-2xl transition-all
              ${isAdmin
                                ? 'bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white border border-slate-700'
                                : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 active:scale-90'
                            }
            `}
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden z-10 p-6 md:p-8 transition-all">
                <div className="flex-1 mimi-card overflow-hidden flex flex-col border-opacity-30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative">
                    {!isAdmin && <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] opacity-50"></div>}

                    {section === 'chat' && sessionConv && (
                        <ChatModule
                            conversation={sessionConv}
                            onUpdateConversation={onUpdateConversation}
                            profile={currentProfile}
                            scrollRef={scrollRef}
                            isProcessing={false}
                            isReadOnly={isAdmin}
                        />
                    )}
                    {isAdmin && section === 'parent-zone' && <ParentZoneView reports={reports}><QuotaModule usageLogs={usageLogs} /></ParentZoneView>}
                    {section === 'profile' && <PerfilModule onOpenParentZone={() => setSection('parent-zone')} />}
                    {section === 'calendar' && <AgendaModule events={calendarEvents} onUpdateEvents={setCalendarEvents} reports={reports} profile={currentProfile} />}
                    {section === 'studio' && <StudioModule />}
                    {section === 'library' && <LibraryModule />}
                </div>
            </main>

            {/* Mobile Navigation */}
            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
                onNavigate={(s) => { setSection(s); setIsMobileNavOpen(false); }}
                isAdmin={isAdmin}
                activeSection={section}
            />
        </div>
    );
};

const NavButton = ({ icon: Icon, label, active, onClick, isAdmin }: { icon: any, label: string, active: boolean, onClick: () => void, isAdmin: boolean }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-6 py-3 rounded-[1.75rem] text-sm font-bold transition-all duration-500 group ${active ? (isAdmin ? 'bg-slate-700 text-white shadow-lg' : 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-[0_10px_20px_-5px_var(--primary)] scale-105') : (isAdmin ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10 hover:scale-105')}`}>
        <Icon size={18} className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:rotate-12'}`} />
        <span className="hidden xl:inline tracking-tight">{label}</span>
    </button>
);

const ProfileGate = () => {
    const [session, setSession] = useState<EcosystemSession>(() => IdentityManager.getSession());
    const [profiles, setProfiles] = useState<AliceProfile[]>(() => IdentityManager.getProfiles());
    const [targetProfileId, setTargetProfileId] = useState<string | null>(null);
    const [pinInput, setPinInput] = useState("");
    const [isBooting, setIsBooting] = useState(true);
    const [globalSessionConv, setGlobalSessionConv] = useState<Conversation | null>(null);
    const [pinError, setPinError] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const pinInputRef = useRef<HTMLInputElement>(null);

    const startNewSession = useCallback((profileNickname: string) => {
        const id = `session_${Date.now()}`;
        const greet = INITIAL_GREETINGS[Math.floor(Math.random() * INITIAL_GREETINGS.length)].replace('{name}', profileNickname);
        const conv: Conversation = {
            id,
            title: `Sessão Mágica`,
            messages: [{ role: 'model', text: greet, timestamp: Date.now() }],
            timestamp: Date.now()
        };
        setGlobalSessionConv(conv);
    }, []);

    useEffect(() => {
        IdentityManager.init();
        setProfiles(IdentityManager.getProfiles());
        setSession(IdentityManager.getSession());
        const timer = setTimeout(() => setIsBooting(false), 2500);
        const unsubSwitch = mimiEvents.on(ECOSYSTEM_EVENTS.PROFILE_SWITCHED, () => setSession(IdentityManager.getSession()));
        const unsubLogout = mimiEvents.on(ECOSYSTEM_EVENTS.SESSION_ENDED, () => {
            setSession(IdentityManager.getSession());
            setTargetProfileId(null);
            setPinInput("");
        });
        return () => { clearTimeout(timer); unsubSwitch(); unsubLogout(); };
    }, []);

    useEffect(() => {
        if (session.isAuthenticated && session.activeProfileId && !globalSessionConv) {
            const activeP = IdentityManager.getActiveProfile();
            if (activeP) startNewSession(activeP.nickname);
        }
    }, [session.isAuthenticated, session.activeProfileId, globalSessionConv, startNewSession]);

    // Focus PIN input when modal opens
    useEffect(() => {
        if (targetProfileId && pinInputRef.current) {
            pinInputRef.current.focus();
        }
    }, [targetProfileId]);

    const handleProfileSelect = (p: AliceProfile) => {
        if (p.role === 'child') IdentityManager.login(p.id);
        else { setTargetProfileId(p.id); setPinInput(""); }
    };

    const handlePinSubmit = (pin: string) => {
        if (targetProfileId && IdentityManager.login(targetProfileId, pin)) {
            setTargetProfileId(null);
            setPinError(false);
        } else {
            setPinInput("");
            setPinError(true);
            setTimeout(() => pinInputRef.current?.focus(), 100);
        }
    };

    if (isBooting) {
        return (
            <div className="fixed inset-0 bg-[#F8F9FF] flex flex-col items-center justify-center z-[10000] overflow-hidden">
                <div className="absolute inset-0 opacity-20 animate-aurora pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #818CF8, #F472B6, #FB923C)', backgroundSize: '400% 400%' }}></div>
                <div className="relative z-10 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(129,140,248,0.4)] mb-8 animate-breathing">
                        <GatinhaLogo className="w-full h-full p-2 fill-white" />
                    </div>
                    <h1 className="font-hand text-5xl text-indigo-900 mb-2">Preparando a mágica...</h1>
                    <p className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">Sussurrando segredos para a Mimi</p>
                </div>
            </div>
        );
    }

    if (session.isAuthenticated && session.activeProfileId) {
        const profile = IdentityManager.getActiveProfile();
        if (profile) return (
            <AppShell
                profile={profile}
                onLogout={() => IdentityManager.logout()}
                sessionConv={globalSessionConv}
                onUpdateConversation={setGlobalSessionConv}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-6 z-[5000] overflow-hidden">
            <div className="absolute inset-0 animate-aurora pointer-events-none" style={{ backgroundImage: 'linear-gradient(to top right, #EEF2FF, #FFF5F7)', backgroundSize: '400% 400%' }}></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-5xl w-full text-center space-y-16 py-12 animate-fade-in relative z-10">
                <header className="space-y-4">
                    <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mx-auto mb-8 animate-mimi-float">
                        <GatinhaLogo className="w-full h-full p-1 fill-white" />
                    </div>
                    <h1 className="font-hand text-7xl text-indigo-950 tracking-tight">Quem vai <span className="text-indigo-500">brincar</span> hoje?</h1>
                    <p className="text-slate-500 font-medium text-lg">Escolha seu perfil para entrar no mundo da Alice</p>
                </header>

                <div className="flex flex-wrap justify-center gap-10 px-4">
                    {profiles.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => handleProfileSelect(p)}
                            className="mimi-bubble group relative w-64 h-64 bg-white/60 hover:bg-white hover:scale-110 transition-all flex flex-col items-center justify-center p-6"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        >
                            <div className="w-32 h-32 bg-slate-100 rounded-full mb-4 overflow-hidden flex items-center justify-center relative border-4 border-white shadow-inner">
                                {p.profileImage?.data ? <img src={p.profileImage.data} className="w-full h-full object-cover" /> : <span className="text-5xl font-black text-indigo-400">{p.nickname[0]}</span>}
                                {p.role === 'parent_admin' && <div className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-lg"><Lock size={12} /></div>}
                            </div>
                            <h3 className="text-xl font-hand text-slate-800 tracking-wide">{p.nickname}</h3>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{p.role === 'child' ? 'Princesa' : 'Guardião'}</p>
                        </button>
                    ))}
                </div>
            </div>

            {targetProfileId && (
                <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md animate-fade-in" onClick={() => pinInputRef.current?.focus()}>
                    <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-12 shadow-2xl space-y-10 text-center border-4 border-white">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-800">Acesso Secreto</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Digite o PIN do Guardião</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            {[0, 1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full transition-all
                    ${pinInput.length > i
                                            ? 'bg-indigo-500 scale-125'
                                            : pinError
                                                ? 'bg-red-400 animate-pulse'
                                                : 'bg-slate-200'}
                    ${isInputFocused && pinInput.length === i ? 'animate-pulse bg-indigo-500' : ''}
                  `}
                                ></div>
                            ))}
                        </div>
                        <input
                            ref={pinInputRef}
                            type="password"
                            maxLength={4}
                            autoFocus
                            value={pinInput}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setPinInput(val);
                                setPinError(false);
                                if (val.length === 4) {
                                    handlePinSubmit(val);
                                }
                            }}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            className="absolute w-0 h-0 opacity-0"
                        />
                        <div className="flex flex-col gap-3">
                            {pinError && <p className="text-[10px] text-red-500 font-bold animate-pulse">PIN incorreto! Tente novamente.</p>}
                            <p className="text-[10px] text-slate-400 italic">Padrão: 0000</p>
                            <button onClick={() => { setTargetProfileId(null); setPinError(false); }} className="py-4 text-[10px] font-black uppercase text-slate-300 hover:text-indigo-500 transition-colors">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const App = () => {
    return (
        <ErrorBoundary>
            <ProfileGate />
            <CustomCursor />
        </ErrorBoundary>
    );
};
