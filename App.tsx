import React, { useState, useRef, useEffect, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { Cat, AlertCircle, RefreshCw, Book, MessageSquare, Calendar, Palette, User, ShieldCheck, Lock, LogOut, Menu } from "lucide-react";
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
import { QuotaModule } from "./modules/quota/index";
import { PerfilModule } from "./modules/perfil/index";
import { StudioModule } from "./modules/studio/index";
import { LibraryModule } from "./modules/library/index";
import { AgendaModule } from "./modules/agenda/Agenda";
import { LoginScreen } from "./modules/login/index";
import { MatrixRain, HackerOverlay } from "./core/components/MatrixRain";
import { ParentProfileModule } from "./modules/parent-profile/index";
import { ThemeRegistry } from "./core/theme/ThemeRegistry";

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
    const [perfilState, setPerfilState] = useState<PerfilState>(() => perfilStorage.getInitialState()); 
    const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>('lg'); 
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); 
    const scrollRef = useRef<HTMLDivElement>(null);

    const isAdmin = currentProfile.role === "parent_admin";

    // Determine logo fill color based on primary contrast
    const logoFillColorClass = 'fill-[var(--text-on-primary)]';

    useEffect(() => {
        const unsubUpdate = mimiEvents.on(ECOSYSTEM_EVENTS.PROFILE_UPDATED, (updated) => {
            if (updated.id === currentProfile.id) setCurrentProfile(updated);
        });
        const unsubLegacy = mimiEvents.on("PROFILE_UPDATED", (newState) => {
            if (newState.app?.theme && !isAdmin) setTheme(newState.app.theme);
            setPerfilState(newState); 
        });
        const unsubReports = mimiEvents.on(MIMI_EVENT_TYPES.REPORT_CREATED, (updated) => setReports(updated));

        return () => { unsubUpdate(); unsubLegacy(); unsubReports(); };
    }, [currentProfile.id, isAdmin]);

    useEffect(() => {
        const role = currentProfile.role || 'child';
        const themeResult = ThemeRegistry.resolveTheme(theme.id, role);
        if (themeResult.success) {
            ThemeRegistry.applyTokens(themeResult.data);
        } else {
            const defaultTheme = ThemeRegistry.getAvailableThemes('child')[0];
            ThemeRegistry.applyTokens(defaultTheme);
        }
    }, [theme, currentProfile.role]);

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

            {theme.id === 'binary-night' && (
                <>
                    <MatrixRain />
                    <HackerOverlay />
                </>
            )}

            <nav className={`h-24 shrink-0 border-b-[var(--ui-border-width)] border-[var(--border-color)] px-10 flex items-center justify-between z-50 shadow-sm backdrop-blur-3xl transition-all bg-[var(--surface)]/95`}>
                <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setSection("chat")}>
                    <div className={`w-14 h-14 flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 animate-breathing bg-[var(--primary)]`}
                         style={{ borderRadius: 'var(--ui-component-radius)', boxShadow: '0 0 20px var(--primary)' }}>
                        <GatinhaLogo className={`w-full h-full p-1 ${logoFillColorClass}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-hand text-5xl font-black leading-none -mb-1 text-[var(--primary)]`}>Mimi</span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)]`}>
                            {isAdmin ? 'Reino dos Pais' : `Mundo da ${currentProfile.nickname}`}
                        </span>
                    </div>
                </div>

                <button onClick={() => setIsMobileNavOpen(true)} className="lg:hidden p-3 text-[var(--text-primary)] hover:text-[var(--primary)]">
                    <Menu size={28} />
                </button>

                <div className="hidden lg:flex gap-3 p-2 bg-[var(--surface-elevated)] border-[var(--ui-border-width)] border-[var(--border-color)]"
                     style={{ borderRadius: 'var(--ui-radius)' }}>
                    <NavButton icon={MessageSquare} label="Conversar" active={section === 'chat'} onClick={() => setSection('chat')} isAdmin={isAdmin} />
                    <NavButton icon={Palette} label="Ateliê" active={section === 'studio'} onClick={() => setSection('studio')} isAdmin={isAdmin} />
                    <NavButton icon={Book} label="Baú de Artes" active={section === 'library'} onClick={() => setSection('library')} isAdmin={isAdmin} />
                    <NavButton icon={Calendar} label="Agenda" active={section === 'calendar'} onClick={() => setSection('calendar')} isAdmin={isAdmin} />
                    <NavButton icon={User} label="Eu" active={section === 'profile'} onClick={() => setSection('profile')} isAdmin={isAdmin} />
                </div>

                <div className="flex items-center gap-5">
                    <div onClick={() => setSection('profile')} className="flex items-center gap-3 px-4 py-2 transition-all cursor-pointer group">
                        <div className={`w-10 h-10 flex items-center justify-center font-black text-[var(--primary)] text-lg shadow-inner overflow-hidden relative border-2 border-[var(--border-color)] group-hover:scale-105 transition-all
                             ${isAdmin ? 'bg-white' : 'bg-[var(--surface-elevated)] shadow-lg'}`}
                             style={{ borderRadius: 'var(--ui-component-radius)', boxShadow: 'var(--ui-shadow)' }}>
                            {currentProfile.profileImage?.data ? <img key={currentProfile.profileImage.updatedAt} src={currentProfile.profileImage.data} className="w-full h-full object-cover" /> : <span>{currentProfile.nickname[0]}</span>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block opacity-60">Meu Perfil</span>
                    </div>
                    <button onClick={onLogout} className="p-3 btn-dynamic bg-red-500 text-white border-red-600 shadow-lg active:scale-90" style={{ borderRadius: 'var(--ui-component-radius)' }} title="Sair">
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
                    {section === 'profile' && (
                        isAdmin ? <ParentProfileModule /> : <PerfilModule onOpenParentZone={() => setSection('chat')} />
                    )}
                    {section === 'calendar' && <AgendaModule events={calendarEvents} onUpdateEvents={setCalendarEvents} reports={reports} profile={currentProfile} />}
                    {section === 'studio' && <StudioModule />}
                    {section === 'library' && <LibraryModule />}
                </div>
            </main>

            <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} onNavigate={(s) => { setSection(s); setIsMobileNavOpen(false); }} isAdmin={isAdmin} activeSection={section} />
        </div>
    );
};

const NavButton = ({ icon: Icon, label, active, onClick, isAdmin }: { icon: any, label: string, active: boolean, onClick: () => void, isAdmin: boolean }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-3 px-6 py-3 transition-all duration-300 group
            ${active 
                ? 'btn-dynamic text-[var(--text-on-primary)] scale-105 shadow-xl' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
            }`}
        style={{ borderRadius: 'var(--ui-component-radius)' }}
    >
        <Icon size={18} className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:rotate-12'}`} />
        <span className="hidden xl:inline tracking-tight font-black uppercase text-[10px]">{label}</span>
    </button>
);

const ProfileGate = () => {
    const [session, setSession] = useState<EcosystemSession>(() => IdentityManager.getSession());
    const [profiles, setProfiles] = useState<AliceProfile[]>(() => IdentityManager.getProfiles());
    const [targetProfileId, setTargetProfileId] = useState<string | null>(null);
    const [pinInput, setPinInput] = useState("");
    const [isBooting, setIsBooting] = useState(true);
    const [isRestoringSession, setIsRestoringSession] = useState(true);
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
        setIsRestoringSession(false);
        const timer = setTimeout(() => setIsBooting(false), 2500);
        const unsubSwitch = mimiEvents.on(ECOSYSTEM_EVENTS.PROFILE_SWITCHED, () => setSession(IdentityManager.getSession()));
        const unsubLogout = mimiEvents.on(ECOSYSTEM_EVENTS.SESSION_ENDED, () => {
            setSession(IdentityManager.getSession());
            setTargetProfileId(null);
            setPinInput("");
            setGlobalSessionConv(null);
        });
        return () => { clearTimeout(timer); unsubSwitch(); unsubLogout(); };
    }, []);

    useEffect(() => {
        if (session.isAuthenticated && session.activeProfileId && !globalSessionConv) {
            const activeP = IdentityManager.getActiveProfile();
            if (activeP) startNewSession(activeP.nickname);
        }
    }, [session.isAuthenticated, session.activeProfileId, globalSessionConv, startNewSession]);

    const handleProfileSelect = (p: AliceProfile) => {
        if (p.role === 'child') IdentityManager.login(p.id);
        else { setTargetProfileId(p.id); setPinInput(""); }
    };

    const handlePinSubmit = (pin: string) => {
        if (targetProfileId && IdentityManager.login(targetProfileId, pin).success) {
            setTargetProfileId(null);
            setPinError(false);
        } else {
            setPinInput("");
            setPinError(true);
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

    if (isRestoringSession) return null;

    if (session.isAuthenticated && session.activeProfileId) {
        const profile = IdentityManager.getActiveProfile();
        if (profile) return (
            <AppShell
                profile={profile}
                onLogout={() => {
                    IdentityManager.logout();
                    window.location.reload();
                }}
                sessionConv={globalSessionConv}
                onUpdateConversation={setGlobalSessionConv}
            />
        );
    }

    return (
        <div id="magic-portal-root" key="login-portal">
            <LoginScreen />
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
