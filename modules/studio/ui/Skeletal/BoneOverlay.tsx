
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Bone, VectorPoint, SkeletalLayer } from '../../types';
import { SkeletalEngine } from '../../engine/SkeletalEngine';

interface BoneOverlayProps {
  layer: SkeletalLayer;
  onUpdateBones: (bones: Bone[]) => void;
  width: number;
  height: number;
}

export const BoneOverlay: React.FC<BoneOverlayProps> = ({ layer, onUpdateBones, width, height }) => {
  const [draggingBoneId, setDraggingBoneId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'start' | 'end' | null>(null);
  const containerRef = useRef<SVGSVGElement>(null);

  const handlePointerDown = (e: React.PointerEvent, boneId: string, type: 'start' | 'end') => {
    e.stopPropagation();
    setDraggingBoneId(boneId);
    setDragType(type);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingBoneId || !dragType || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const target: VectorPoint = { x, y };

    const bonesMap = new Map(layer.bones.map(b => [b.id, b]));
    const bone = bonesMap.get(draggingBoneId);
    if (!bone) return;

    let updatedBonesMap: Map<string, Bone>;

    if (dragType === 'end') {
      // Resolve IK para a cadeia se o osso fizer parte de uma
      const ikChain = layer.ikChains.find(chain => chain.includes(draggingBoneId));
      if (ikChain) {
        // Encontra a sub-cadeia até o osso arrastado
        const chainIds = JSON.parse(ikChain) as string[];
        const boneIndex = chainIds.indexOf(draggingBoneId);
        const subChain = chainIds.slice(0, boneIndex + 1);
        
        updatedBonesMap = SkeletalEngine.solveFABRIK(target, subChain, bonesMap);
      } else {
        // Movimentação simples do endPoint (apenas este osso)
        const updatedBone = {
          ...bone,
          segment: {
            ...bone.segment,
            endPoint: target,
            length: Math.sqrt(Math.pow(target.x - bone.segment.startPoint.x, 2) + Math.pow(target.y - bone.segment.startPoint.y, 2))
          },
          rotation: Math.atan2(target.y - bone.segment.startPoint.y, target.x - bone.segment.startPoint.x) * (180 / Math.PI)
        };
        updatedBonesMap = new Map(bonesMap);
        updatedBonesMap.set(bone.id, updatedBone);
      }
    } else {
      // Movimenta o startPoint (Base)
      const dx = target.x - bone.segment.startPoint.x;
      const dy = target.y - bone.segment.startPoint.y;
      
      const updatedBone = {
        ...bone,
        segment: {
          ...bone.segment,
          startPoint: target,
          endPoint: { x: bone.segment.endPoint.x + dx, y: bone.segment.endPoint.y + dy }
        }
      };
      updatedBonesMap = new Map(bonesMap);
      updatedBonesMap.set(bone.id, updatedBone);
      
      // TODO: Propagar movimento para filhos se necessário
    }

    onUpdateBones(Array.from(updatedBonesMap.values()));
  }, [draggingBoneId, dragType, layer, onUpdateBones]);

  const handlePointerUp = () => {
    setDraggingBoneId(null);
    setDragType(null);
  };

  return (
    <svg
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto cursor-default select-none"
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <defs>
        <filter id="bone-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {layer.bones.map(bone => (
        <g key={bone.id} className="group">
          {/* Linha do Osso */}
          <line
            x1={bone.segment.startPoint.x}
            y1={bone.segment.startPoint.y}
            x2={bone.segment.endPoint.x}
            y2={bone.segment.endPoint.y}
            stroke="#00FF41"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-40 group-hover:opacity-100 transition-opacity"
            style={{ filter: 'url(#bone-glow)' }}
          />
          
          {/* Articulação de Base (Start) */}
          <circle
            cx={bone.segment.startPoint.x}
            cy={bone.segment.startPoint.y}
            r="6"
            fill="#FFFFFF"
            stroke="#00FF41"
            strokeWidth="2"
            className="cursor-move hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, bone.id, 'start')}
          />

          {/* Articulação de Efetor (End) */}
          <circle
            cx={bone.segment.endPoint.x}
            cy={bone.segment.endPoint.y}
            r="5"
            fill="#00FF41"
            stroke="#FFFFFF"
            strokeWidth="2"
            className="cursor-move hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, bone.id, 'end')}
          />

          {/* Nome do Osso (Apenas em Hover) */}
          <text
            x={(bone.segment.startPoint.x + bone.segment.endPoint.x) / 2}
            y={(bone.segment.startPoint.y + bone.segment.endPoint.y) / 2 - 10}
            fill="#00FF41"
            className="text-[10px] font-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            textAnchor="middle"
          >
            {bone.name}
          </text>
        </g>
      ))}
    </svg>
  );
};
