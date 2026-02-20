import React, { RefObject, useState, useEffect, useMemo } from "react";
import { Send, Cat, User, Sparkles, Smile, Mic, Cpu, Terminal, Radio } from "lucide-react";
import { Conversation, Message, UserProfile } from "../../core/types";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../core/events";
import { getAtomicMimiResponse } from "./services/mimi.api";
import { mimiAudio } from "./audio/audio.manager";
import { executeAlertProtocol } from "./protocols/alert.protocol";
import { useTheme } from "../../core/theme/useTheme";
import { MatrixRain, HackerOverlay } from "../../core/components/MatrixRain";
import { HackerSimulator, StrategicHackGif } from "../../core/components/HackerSimulator";

// APEX v2.0 Components
import { TactileButton } from "../../core/components/ui/TactileButton";
import { MagicCard } from "../../core/components/ui/MagicCard";
import { MagicDust } from "../../core/components/effects/MagicDust";

// Componente de Descriptografia Hacker (Protocolo APEX v2.0)
const DecryptText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="font-mono tracking-tight">{displayText}</span>;
};

interface ChatModuleProps {
  conversation: Conversation;
  onUpdateConversation: (conv: Conversation) => void;
  profile: UserProfile; 
  scrollRef: RefObject<HTMLDivElement | null>;
  isProcessing: boolean;
  isReadOnly?: boolean;
}

export const ChatModule = ({ 
  conversation, 
  onUpdateConversation,
  profile,
  scrollRef,
  isReadOnly = false
}: ChatModuleProps) => {
  const [internalProcessing, setInternalProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showMagicDust, setShowMagicDust] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  
  useEffect(() => {
    const warmup = () => {
      mimiAudio.warmup();
      window.removeEventListener('click', warmup);
    };
    window.addEventListener('click', warmup);
  }, []);

  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages.length, scrollRef, internalProcessing]);

  const handleMimiFlow = async (text: string) => {
    if (!text.trim() || internalProcessing || isReadOnly) return;

    mimiAudio.stopAll();
    setInternalProcessing(true);
    
    const userMsg: Message = { role: 'user', text, timestamp: Date.now() };
    const messagesWithUser = [...conversation.messages, userMsg];
    
    mimiEvents.dispatch(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, {
      module: 'chat',
      type: 'interaction',
      action: 'user_message',
      payload: { text },
      timestamp: Date.now()
    } as ObservabilityEvent);

    onUpdateConversation({ ...conversation, messages: messagesWithUser });
    setInputValue("");

    try {
      const history = messagesWithUser.slice(-10).map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const atomicResult = await getAtomicMimiResponse(history, profile);
      
      if (atomicResult.monitoring) {
        executeAlertProtocol(atomicResult.monitoring, conversation.id);
      }

      const modelMsg: Message = { role: 'model', text: atomicResult.text, timestamp: Date.now() };
      
      mimiEvents.dispatch(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, {
        module: 'chat',
        type: 'interaction',
        action: 'mimi_reply',
        payload: { text: atomicResult.text, monitoring: atomicResult.monitoring },
        timestamp: Date.now()
      } as ObservabilityEvent);

      onUpdateConversation({ ...conversation, messages: [...messagesWithUser, modelMsg] });
      
      // Simulação de Sucesso Mágico (LingoEngine feedback)
      if (atomicResult.text.length > 50) { 
        setShowMagicDust(true); 
        setTimeout(() => setShowMagicDust(false), 2000);
      }
      
      if (atomicResult.speechEnabled && atomicResult.audioBase64) {
        await mimiAudio.playSync(atomicResult.audioBase64);
      }
    } catch (e) {
      console.error("[Mimi Chat] Erro no fluxo multimodal:", e);
    } finally {
      setInternalProcessing(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 relative bg-transparent overflow-hidden isolate ${isHackerMode ? 'font-mono text-green-500' : ''}`}>
      {/* Background Effects (Local scope for module specific effects) */}
      {isHackerMode && (
        <>
          <HackerSimulator />
          <StrategicHackGif url="./Gifs_Loading_Cat/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
          <div className="absolute top-4 right-4 z-[100] animate-pulse text-green-500/30 flex items-center gap-2 pointer-events-none">
            <div className="bg-black border border-green-500/30 p-2 font-mono text-[9px] text-green-500">
                [PACKET_INTERCEPT: ON] [SECURE_TUNNEL: ACTIVE]
            </div>
            <Radio size={20} />
          </div>
        </>
      )}

      {/* Magic Dust Effect (Particle System) */}
      <MagicDust active={showMagicDust} />

      {/* Decoração Flutuante (Kids Mode) */}
      {!isHackerMode && (
        <div className="absolute top-10 right-10 opacity-20 animate-mimi-float pointer-events-none">
          <Sparkles size={60} className="md:size-80 text-[var(--accent)]" />
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-10 no-scrollbar pb-40 relative z-10">
        {conversation.messages.map((m, i) => (
          <div key={`${m.timestamp}-${i}`} className={`flex items-end gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
            {/* Avatar Tactile */}
            <div className={`
              w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden transition-all
              ${isHackerMode 
                ? 'border-2 border-green-500/50 bg-black shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                : 'tactile-base bg-[var(--surface-elevated)] shadow-md' 
              }
            `}>
              {m.role === 'user' ? (
                profile.profileImage?.data ? <img src={profile.profileImage.data} className="w-full h-full object-cover" alt="Perfil" /> : <User size={22} className="text-white" />
              ) : (
                <Cat 
                  size={22} 
                  strokeWidth={3} 
                  className={`
                    transition-all duration-300
                    ${isHackerMode 
                      ? 'text-black drop-shadow-[0_0_3px_#00FF41]' 
                      : 'text-[var(--text-primary)] drop-shadow-[0_0_3px_rgba(255,255,255,1)]'
                    }
                  `} 
                />
              )}
            </div>

            {/* Message Bubble (MagicCard or Tactile) */}
            <div className={`max-w-[85%] md:max-w-[70%]`}>
              {isHackerMode ? (
                <div className="border-green-500/30 bg-black/80 text-green-400 p-4 border-l-4 border-l-green-500 font-mono text-xl md:text-2xl shadow-lg">
                  {m.role === 'model' ? <DecryptText text={m.text} /> : m.text}
                </div>
              ) : (
                <MagicCard 
                  glass={m.role === 'model'} 
                  isAiMessage={m.role === 'model'}
                  className={`
                    px-8 py-6 text-xl md:text-2xl leading-relaxed font-medium
                    ${m.role === 'user' 
                      ? 'bg-[var(--primary)] text-white rounded-[var(--ui-radius)] rounded-br-[0.5rem] shadow-[var(--ui-shadow)]' 
                      : 'rounded-[var(--ui-radius)] rounded-bl-[0.5rem] text-[var(--text-primary)]'
                    }
                  `}
                >
                  <span style={{ fontFamily: m.role === 'model' ? 'var(--font-main)' : 'var(--font-main)' }}>
                    {m.text}
                  </span>
                </MagicCard>
              )}
              
              <div className={`text-[9px] font-black uppercase tracking-widest mt-3 opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {isHackerMode ? `[TIMESTAMP: ${m.timestamp}]` : new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Thinking State */}
        {internalProcessing && (
          <div className="flex justify-start items-center gap-4 animate-fade-in">
             <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center animate-mimi-float ${isHackerMode ? 'bg-black border border-green-500/50 shadow-[0_0_10px_rgba(0,255,65,0.2)]' : 'tactile-base bg-[var(--surface)] ai-thinking shadow-md'}`}>
                <Cat 
                  size={22} 
                  strokeWidth={3}
                  className={`
                    ${isHackerMode 
                      ? 'text-black drop-shadow-[0_0_3px_#00FF41]' 
                      : 'text-[var(--primary)] drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]'
                    }
                  `}
                />
             </div>
             <div className="flex flex-col gap-2">
                <MagicCard glass className="px-6 py-4 rounded-[2.5rem]">
                   <div className="flex gap-2">
                      <div className={`w-3 h-3 rounded-full animate-bounce ${isHackerMode ? 'bg-green-500' : 'bg-[var(--primary)]'}`} style={{ animationDelay: '0s' }}></div>
                      <div className={`w-3 h-3 rounded-full animate-bounce ${isHackerMode ? 'bg-green-500' : 'bg-[var(--primary)]'}`} style={{ animationDelay: '0.2s' }}></div>
                      <div className={`w-3 h-3 rounded-full animate-bounce ${isHackerMode ? 'bg-green-500' : 'bg-[var(--primary)]'}`} style={{ animationDelay: '0.4s' }}></div>
                   </div>
                </MagicCard>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ml-3 animate-pulse ${isHackerMode ? 'text-green-500' : 'text-[var(--primary)]/60'}`}>
                  {isHackerMode ? "ANALISANDO DADOS..." : "Mimi está pensando..."}
                </span>
             </div>
          </div>
        )}
      </div>

      {!isReadOnly && (
        <div className={`absolute bottom-0 left-0 right-0 p-8 shrink-0 z-[100] ${isHackerMode ? 'bg-black/90' : 'bg-transparent'}`}>
          <div className={`
            max-w-4xl mx-auto flex items-center gap-4 p-3 transition-all
            ${isHackerMode 
              ? 'bg-black border-2 border-green-500/50 rounded-none shadow-[0_0_20px_rgba(0,255,65,0.2)]' 
              : 'mimi-card bg-[var(--surface)]/90 backdrop-blur-2xl border-[var(--ui-border-width)] border-[var(--primary)]/20 shadow-[var(--ui-shadow-elevated)] focus-within:border-[var(--primary)]'
            }
          `}
          style={{ borderRadius: isHackerMode ? '0' : 'var(--ui-radius)' }}
          >
            {/* Input Actions with Tactile Buttons */}
                        <TactileButton
                          variant={isHackerMode ? "ghost" : "secondary"}
                          size="icon"
                          className={isHackerMode ? 'text-green-500' : ''}
                          onClick={() => setShowEmojis(!showEmojis)}
                        >
                          {isHackerMode ? <Terminal size={28} /> : <Smile size={28} className="text-[var(--text-on-accent)]" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' }} />}
                        </TactileButton>
            <input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if(e.key === 'Enter') handleMimiFlow(inputValue);
              }} 
              placeholder={isHackerMode ? "> ENTER_COMMAND_OR_QUERY..." : `Diga algo para a Mimi, ${profile.nickname}...`}
              className={`flex-1 bg-transparent px-4 py-4 outline-none placeholder:opacity-50 ${isHackerMode ? 'font-mono text-green-400' : 'font-main text-2xl md:text-3xl text-[var(--text-primary)]'}`}
              disabled={internalProcessing}
            />
            
                        <div className="flex gap-2">
                          <TactileButton
                            variant="secondary"
                            size="icon"
                            disabled={internalProcessing}
                          >
                            <Mic size={24} className="text-[var(--text-on-accent)]" style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.1))' }} />
                          </TactileButton>
                            <TactileButton
                              variant={isHackerMode ? 'secondary' : 'primary'}
                              size="icon"
                              onClick={() => handleMimiFlow(inputValue)}
                              disabled={internalProcessing || !inputValue.trim()}
                              isThinking={internalProcessing}
                              className={isHackerMode ? 'bg-green-600 text-black border border-green-400' : 'shadow-lg'}
                            >
                              <Send size={24} className={isHackerMode ? 'text-black' : 'text-[var(--text-on-primary)]'} />
                            </TactileButton>            </div>
          </div>
        </div>
      )}
    </div>
  );
};
