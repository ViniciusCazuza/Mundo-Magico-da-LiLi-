import React, { useState, useEffect } from "react";

interface DecryptTextProps {
  text: string;
  enabled?: boolean;
  className?: string;
}

/**
 * DecryptText (APEX v3.2)
 * Componente de efeito visual que simula a descriptografia de dados.
 * Usado exclusivamente para imersão em temas tecnológicos ou mágicos.
 */
export const DecryptText: React.FC<DecryptTextProps> = ({ text, enabled = true, className = "" }) => {
  const [displayText, setDisplayText] = useState(text || "");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayText(text || "");
      return;
    }

    let iteration = 0;
    const targetText = String(text);
    
    const interval = setInterval(() => {
      setDisplayText(
        targetText.split("").map((char, index) => {
          if (index < iteration) return targetText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
        setDisplayText(targetText);
      }
      iteration += 1 / 3;
    }, 50);
    
    return () => {
      clearInterval(interval);
      setDisplayText(targetText);
    };
  }, [text, enabled]);

  return <span className={className}>{displayText}</span>;
};
