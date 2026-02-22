import React, { useState, useEffect } from 'react';
import { cn } from '../utils';

const LOG_LINES = [
  "DECRYPTING: AES-256-GCM...",
  "ACCESSING: SECURITY_OVERRIDE_V4",
  "INJECTING: SHELLCODE_X64",
  "BYPASSING: FIREWALL_PROXY_LAYER_7",
  "UPLOADING: ROOTKIT_PERSISTENCE",
  "DUMPING: PASSWD_SHADOW_ROOT",
  "TRACE: 127.0.0.1 -> 192.168.1.1",
  "PROTOCOL: SSH_LOGIN_RETRY_3",
  "ALERT: INTRUSION_DETECTION_SYSTEM_OFFLINE",
  "STATUS: PAYLOAD_EXECUTED_SUCCESSFULLY",
  "CONNECTION: ENCRYPTED_TUNNEL_ESTABLISHED",
  "OVERRIDE: MANUAL_CONTROL_GRANTED"
];

export const HackerSimulator: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)]];
        if (next.length > 15) return next.slice(1);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden font-mono text-[10px] p-4 flex flex-col gap-1 select-none">
      {logs.map((log, i) => (
        <div key={i} className="animate-fade-in text-green-500">
          {`[${new Date().toLocaleTimeString()}] ${log}`}
        </div>
      ))}
    </div>
  );
};

export const StrategicHackGif: React.FC<{ 
  url: string; 
  position?: 'left' | 'right';
  className?: string;
  opacity?: string;
  style?: React.CSSProperties;
}> = ({ url, position = 'right', className = "", opacity = "opacity-40", style }) => {
  const posClass = position === 'left' ? 'left-4' : 'right-4';
  return (
    <div 
      className={cn(
        "absolute bottom-24 pointer-events-none rounded-2xl border-2 border-green-500/40 overflow-hidden z-[50] shadow-[0_0_30px_rgba(0,255,65,0.3)]",
        posClass,
        opacity,
        className
      )}
      style={style}
    >
      <img 
        src={url} 
        className="w-full h-full object-cover brightness-150 contrast-125 transition-all" 
        alt="Strategic Hack" 
        onError={(e) => console.error("Erro ao carregar GIF:", url)}
      />
      <div className="absolute inset-0 bg-green-500/10 mix-blend-color" />
    </div>
  );
};
