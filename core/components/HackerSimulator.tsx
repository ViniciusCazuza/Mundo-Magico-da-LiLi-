
import React, { useState, useEffect } from 'react';

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

export const StrategicHackGif: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="absolute bottom-4 right-4 w-32 h-32 opacity-20 pointer-events-none rounded-lg border border-green-500/30 overflow-hidden">
      <img src={url} className="w-full h-full object-cover grayscale brightness-150 contrast-150" alt="Strategic Hack" />
      <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay" />
    </div>
  );
};
