
import React, { RefObject, useState, useEffect } from "react";
import { Send, Cat, User, Sparkles, Smile, Mic } from "lucide-react";
import { Conversation, Message, UserProfile } from "../../core/types";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../core/events";
import { getAtomicMimiResponse } from "./services/mimi.api";
import { mimiAudio } from "./audio/audio.manager";
import { executeAlertProtocol } from "./protocols/alert.protocol";

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
    <div className="flex-1 flex flex-col min-h-0 relative bg-transparent overflow-hidden">
      {/* Decoração Flutuante */}
      <div className="absolute top-10 right-10 opacity-20 animate-mimi-float pointer-events-none">
        <Sparkles size={60} className="md:size-80 text-[var(--accent)]" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-10 no-scrollbar pb-40">
        {conversation.messages.map((m, i) => (
          <div key={`${m.timestamp}-${i}`} className={`flex items-end gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden transition-transform hover:scale-110 ${m.role === 'user' ? 'bg-[var(--primary)] text-[var(--text-on-primary)]' : 'bg-[var(--surface)] text-[var(--primary)] border-[var(--primary)]/20 animate-float-slow'}`}>
              {m.role === 'user' ? (
                profile.profileImage?.data ? <img src={profile.profileImage.data} className="w-full h-full object-cover" alt="Perfil" /> : <User size={22} />
              ) : <Cat size={22} />}
            </div>
            <div 
              className={`
                max-w-[85%] md:max-w-[70%] px-8 py-6 text-xl md:text-2xl leading-relaxed font-medium transition-all shadow-md
                ${m.role === 'user' 
                  ? 'bg-[var(--primary)] text-[var(--text-on-primary)] rounded-[2.5rem] rounded-br-[0.5rem] shadow-[0_10px_20px_var(--primary)]/20' 
                  : 'bg-[var(--surface)]/90 backdrop-blur-md text-[var(--text-primary)] border-[var(--border-color)] rounded-[2.5rem] rounded-bl-[0.5rem] shadow-[var(--shadow-base)]/50'
                }
              `}
              style={{ fontFamily: m.role === 'model' ? 'var(--font-family)' : 'Fredoka' }}
            >
              {m.text}
              <div className={`text-[9px] font-black uppercase tracking-widest mt-3 opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {internalProcessing && (
          <div className="flex justify-start items-center gap-4 animate-fade-in">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-md animate-mimi-float">
                <Cat size={22} />
             </div>
             <div className="flex flex-col gap-2">
                <div className="flex gap-2 p-5 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm">
                  <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]/60 ml-3 animate-pulse">
                  Mimi está pensando...
                </span>
             </div>
          </div>
        )}
      </div>

      {!isReadOnly && (
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[var(--bg-app)] via-[var(--bg-app)]/80 to-transparent shrink-0">
                      <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white/90 backdrop-blur-2xl p-3 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white focus-within:border-[var(--primary)] focus-within:shadow-[0_0_30px_var(--primary)]/30 transition-all">            <button 
              className="p-4 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              onClick={() => console.log('Emoji button clicked! (Functionality to be implemented)')}
            >
              <Smile size={28} />
            </button>
            <input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if(e.key === 'Enter') handleMimiFlow(inputValue);
              }} 
                            placeholder={`Diga algo para a Mimi, ${profile.nickname}...`}
                            className="flex-1 bg-transparent px-4 py-4 outline-none font-hand text-2xl md:text-3xl placeholder:opacity-70 text-[var(--text-primary)]"
                            disabled={internalProcessing}
                          />            <div className="flex gap-2">
              <button 
                className="w-14 h-14 md:w-16 md:h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors active:scale-95"
                disabled={internalProcessing}
              >
                <Mic size={28} />
              </button>
              <button 
                className="w-14 h-14 md:w-16 md:h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--text-on-primary)] shadow-[var(--shadow-elevated)] hover:scale-110 active:scale-90 transition-all group"
                onClick={() => handleMimiFlow(inputValue)}
                disabled={internalProcessing || !inputValue.trim()}
              >
                <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
