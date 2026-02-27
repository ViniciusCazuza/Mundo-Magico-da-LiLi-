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
  "OVERRIDE: MANUAL_CONTROL_GRANTED",
  "MIMI_OS: KERNEL_PANIC_RECOVERED",
  "REPLICATING: NEURAL_MAPPING_V9",
  "BYPASSING: PARENTAL_GATE_ALPHA",
  "INTERCEPTING: MIMI_HEARTBEAT_SIGNAL"
];

const SECTION_LOGS: Record<string, string[]> = {
  chat: [
    "INTERCEPTING: PACKET_STREAM_AES_GCM",
    "DECRYPTING: MIMI_CORE_PROTOCOLS",
    "SECURE_TUNNEL: ALICE_MIMI_CHANNEL_V1",
    "MONITORING: EMOTIONAL_SIGNAL_INTERCEPT",
    "DUMPING: CONVERSATION_HISTORY_ENCRYPTED"
  ],
  studio: [
    "BUFFER_OVERFLOW: RASTER_MIXING_ENGINE",
    "UPLOADING: VECTOR_SHAPES_PERSISTENCE",
    "DUMPING: IMAGE_METADATA_EXTRACTOR",
    "OVERRIDE: ATELIER_CANVAS_RENDERER_V2",
    "INJECTING: ARTIFICIAL_IMAGINATION_V15"
  ],
  agenda: [
    "BYPASSING: CALENDAR_ACL_V3",
    "DUMPING: SCHEDULE_DB_SQLITE",
    "STATUS: MISSION_SCHEDULE_SYNCED",
    "ALERT: EVENT_COLLISION_DETECTED",
    "OVERRIDE: TEMPORAL_SEQUENCE_V4"
  ],
  profile: [
    "READING: IDENTITY_SCHEMA_V7",
    "ALTERING: BIOMETRIC_DATA_STUB",
    "STATUS: DREAM_POWER_OVERCLOCK",
    "DUMPING: FAVORITE_COLOR_BYTE_STREAM"
  ]
};

interface HackerSimulatorProps {
  section?: string;
}

export const HackerSimulator: React.FC<HackerSimulatorProps> = ({ section }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const currentSectionLogs = section && SECTION_LOGS[section] ? SECTION_LOGS[section] : [];
        const combinedPool = [...LOG_LINES, ...currentSectionLogs];
        const next = [...prev, combinedPool[Math.floor(Math.random() * combinedPool.length)]];
        if (next.length > 20) return next.slice(1);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [section]);

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
