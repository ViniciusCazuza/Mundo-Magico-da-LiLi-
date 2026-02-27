/**
 * SkeletalEngine.ts - Motor de Animação Esquelética APEX
 * 
 * Responsável por:
 * 1. Resolver Cadeias IK (Inverse Kinematics) usando o algoritmo FABRIK.
 * 2. Gerenciar a hierarquia de ossos (Bone System).
 * 3. Aplicar transformações em tempo real.
 * 
 * Axioma: Estados de ossos sem hierarquia ou com ciclos são irrepresentáveis.
 */

import { VectorPoint, Bone, BoneSegment } from '../types';

export class SkeletalEngine {
  /**
   * Valida a integridade da estrutura esquelética.
   * Garante ausência de ciclos e que todos os IDs de pais existam.
   */
  static validateSkeleton(bones: Bone[]): { isValid: boolean; error?: string } {
    const ids = new Set(bones.map(b => b.id));
    
    for (const bone of bones) {
      if (bone.parentId) {
        if (!ids.has(bone.parentId)) {
          return { isValid: false, error: `Osso órfão detectado: ${bone.name} refere-se a um pai inexistente.` };
        }
        
        // Detecção de Ciclo Simples (Pai = Filho)
        if (bone.parentId === bone.id) {
          return { isValid: false, error: `Ciclo detectado: ${bone.name} não pode ser seu próprio pai.` };
        }

        // Detecção de Ciclo Profundo
        let currentParentId = bone.parentId;
        const visited = new Set<string>([bone.id]);
        while (currentParentId) {
          if (visited.has(currentParentId)) {
            return { isValid: false, error: `Ciclo profundo detectado na cadeia de ${bone.name}.` };
          }
          visited.add(currentParentId);
          const parent = bones.find(b => b.id === currentParentId);
          currentParentId = parent?.parentId || '';
        }
      }
    }

    return { isValid: true };
  }

  /**
   * Aplica física de pêndulo aos ossos para movimentos secundários.
   * Simula inércia, gravidade e rigidez.
   */
  static applyPhysics(
    bones: Bone[], 
    dt: number, 
    gravity: VectorPoint = { x: 0, y: 0.5 }
  ): Bone[] {
    return bones.map(bone => {
      if (!bone.constraints.includes('physics')) return bone;

      const stiffness = bone.stiffness ?? 0.1;
      const damping = bone.damping ?? 0.95;
      const velocity = bone.angularVelocity ?? 0;

      // Força de restauração (tenta voltar ao ângulo 0 ou ângulo de repouso)
      const restoration = -stiffness * bone.rotation;
      
      // Efeito de gravidade simples baseado no ângulo
      const gravityEffect = gravity.y * Math.sin(bone.rotation * Math.PI / 180);

      const newVelocity = (velocity + restoration + gravityEffect) * damping;
      const newRotation = bone.rotation + newVelocity * dt;

      return {
        ...bone,
        rotation: newRotation,
        angularVelocity: newVelocity
      };
    });
  }

  /**
   * Resolve ações de Smart Bones.
   * Interpola valores de propriedades baseados na rotação de ossos específicos.
   */
  static solveSmartBones(layer: SkeletalLayer): Partial<SkeletalLayer> {
    if (!layer.smartActions || layer.smartActions.length === 0) return {};

    const updates: any = {};
    const bonesMap = new Map(layer.bones.map(b => [b.id, b]));

    for (const action of layer.smartActions) {
      const bone = bonesMap.get(action.boneId);
      if (!bone) continue;

      // Interpolação linear simples entre keyframes de ângulo
      const angle = bone.rotation;
      const sortedKeys = [...action.keyframes].sort((a, b) => a.angle - b.angle);
      
      let value = sortedKeys[0].value;
      for (let i = 0; i < sortedKeys.length - 1; i++) {
        if (angle >= sortedKeys[i].angle && angle <= sortedKeys[i+1].angle) {
          const t = (angle - sortedKeys[i].angle) / (sortedKeys[i+1].angle - sortedKeys[i].angle);
          // TODO: Suportar interpolação de cores/números
          value = t > 0.5 ? sortedKeys[i+1].value : sortedKeys[i].value;
          break;
        }
      }
      
      updates[action.targetProperty] = value;
    }

    return updates;
  }

  /**
   * Resolve uma cadeia de ossos usando FABRIK (Forward And Backward Reaching Inverse Kinematics).
   * @param target Ponto de destino para o efetor final (End Effector).
   * @param boneIds IDs dos ossos na cadeia (do ombro até a mão, por exemplo).
   * @param bones Mapa de todos os ossos disponíveis.
   */
  static solveFABRIK(
    target: VectorPoint,
    boneIds: string[],
    bones: Map<string, Bone>,
    tolerance: number = 0.1,
    maxIterations: number = 10
  ): Map<string, Bone> {
    if (boneIds.length === 0) return bones;

    const chain = boneIds.map(id => bones.get(id)).filter(Boolean) as Bone[];
    if (chain.length === 0) return bones;

    // 1. Extrair posições atuais
    const positions: VectorPoint[] = [];
    positions.push({ ...chain[0].segment.startPoint });
    for (const bone of chain) {
      positions.push({ ...bone.segment.endPoint });
    }

    // 2. Comprimentos dos segmentos (Fixos)
    const lengths = chain.map(b => b.segment.length);
    const origin = { ...positions[0] };
    const totalLength = lengths.reduce((a, b) => a + b, 0);

    // 3. Verificar se o alvo está fora de alcance
    const distToTarget = this.distance(origin, target);
    if (distToTarget > totalLength) {
      // Alinhamento direto em direção ao alvo
      for (let i = 0; i < lengths.length; i++) {
        const r = this.distance(positions[i], target);
        const l = lengths[i] / r;
        positions[i + 1] = {
          x: (1 - l) * positions[i].x + l * target.x,
          y: (1 - l) * positions[i].y + l * target.y
        };
      }
    } else {
      // 4. Algoritmo Iterativo FABRIK
      for (let iter = 0; iter < maxIterations; iter++) {
        // BACKWARD Pass (Do efetor para a base)
        positions[positions.length - 1] = { ...target };
        for (let i = positions.length - 2; i >= 0; i--) {
          const r = this.distance(positions[i + 1], positions[i]);
          const l = lengths[i] / r;
          positions[i] = {
            x: (1 - l) * positions[i + 1].x + l * positions[i].x,
            y: (1 - l) * positions[i + 1].y + l * positions[i].y
          };
        }

        // FORWARD Pass (Da base para o efetor)
        positions[0] = { ...origin };
        for (let i = 0; i < positions.length - 1; i++) {
          const r = this.distance(positions[i + 1], positions[i]);
          const l = lengths[i] / r;
          positions[i + 1] = {
            x: (1 - l) * positions[i].x + l * positions[i + 1].x,
            y: (1 - l) * positions[i].y + l * positions[i + 1].y
          };
        }

        // Critério de parada
        if (this.distance(positions[positions.length - 1], target) < tolerance) break;
      }
    }

    // 5. Aplicar novas posições aos ossos (Preservando imutabilidade)
    const updatedBones = new Map(bones);
    for (let i = 0; i < chain.length; i++) {
      const bone = chain[i];
      const updatedBone = {
        ...bone,
        segment: {
          ...bone.segment,
          startPoint: { ...positions[i] },
          endPoint: { ...positions[i + 1] }
        },
        // Calcula a nova rotação baseada no vetor do osso
        rotation: Math.atan2(positions[i+1].y - positions[i].y, positions[i+1].x - positions[i].x) * (180 / Math.PI)
      };
      updatedBones.set(bone.id, updatedBone);
    }

    return updatedBones;
  }

  private static distance(p1: VectorPoint, p2: VectorPoint): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
}
