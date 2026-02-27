DOCUMENTAÇÃO TÉCNICA COMPLETA  
Rigging (Animação por Esqueleto) para Desenhos 2D – Panorama 2026
=================================================================

Metodologia de pesquisa  
• Documentação oficial de cada software/site.  
• Artigos acadêmicos (ACM Digital Library / IEEE) sobre skinning, IK e IA para rigging.  
• Fóruns técnicos (Stack Overflow, Godot Q&A, Spine Forum, Moho Forum).  
• Release notes 2021-2025.  
• Vídeos e white-papers dos próprios fabricantes.

Estrutura deste documento  
0. Fundamentos de Rigging 2D  
1. Soluções por IA (zero ou quase zero intervenção)  
2. Suites profissionais de animação 2D com Rigging  
3. Ferramentas generalistas/mobile que oferecem rigging básico  
4. Engines de jogo/3D que suportam sprites esqueléticos  
5. Comparativo sintético

0. FUNDAMENTOS
--------------

• Bone (Osso): transform (posição, rotação, escala) hierárquico.  
• Skinning: mapeia vértices ou regiões da arte ao conjunto de bones. Métodos principais:  
 – Rigid binding (cada vértice pertence a 1 bone).  
 – Linear Blend Skinning (LBS): o peso \(w_{i,j}\) define quanto o vértice \(v_j\) herda do bone \(i\).  
• IK (Inverse Kinematics): dado um alvo, resolve ângulos das juntas. Algoritmos comuns: FABRIK, CCD, Jacobiano.  
• Deformation Mesh / FFD: malha subdividindo o sprite; deslocamento de vértices gera flexão orgânica (bending).  
• Constraints: limitam rotação, alongamento, copi­am escalas, curvas de dinâmica.  
• Smart bones / corrective shapes: curvas de correção que trocam arte (blend shapes) em ângulos extremos.  
• Export: formatos proprietários (.spine, .moho), JSON + atlases, ORG (.dragonbones), runtimes para Unity/Godot.

1. IA PARA RIGGING AUTOMÁTICO
-----------------------------

1.1 Meta Animated Drawings – sketch.metademolab.com  
• Pipeline:  
 1) Segmentação da figura (Mask R-CNN fine-tuned).  
 2) 2D Pose Estimation com HRNet (18 keypoints).  
 3) Skeleton fitting + Laplacian deformation p/ espalhar movimento pela silhueta.  
• Usuário só corrige joints. 4 motions pré-treinados (walk, wave, jump, dance).  
• Export: MP4 ou glTF + JSON de keyframes (beta API).  
• Licença: gratuito, MIT para modelo; input descartado após 30 min no server.  
• Limitações: 1 personagem frontal; sem malha fina; não suporta props; máximo 2048×2048.

1.2 DeepMotion Animate 3D (cloud)  
• IA de retarget de vídeo → rig 3D; modo “2D Sprite Export”: renderiza plano ortográfico e gera esqueleto 2D no fbx.  
• Gratis 60 s/mês (watermark).  
• Diferenças: produz animação longa, mas requer vídeo referência; não entende braços escondidos.

1.3 Cartoon Animator 5 – AutoRig PSD  
• Algoritmo proprietário “PSD Auto-Rig” detecta layers nomeados (Head, L_Arm, etc.) e gera bone chain.  
• Necessita arquivo PSD em camadas; acurácia 80-90 % se seguir template.  
• IA face tracking opcional (WebCam → blendshapes).  

2. SUITES PROFISSIONAIS 2D
--------------------------

2.1 Moho 14 (ex-Anime Studio) – Win/Mac  
• Core: Bone Layer (vector ou bitmap).  
• Smart-Bones: cada osso possui “action” corretiva (blend shape) disparada por rotação π/-π rad; resolve colapsos.  
• Vitruvian Bones: troca automática de desenhos (turnarounds) baseado no ângulo da câmera.  
• IK Solver FABRIK + intelligente “Target Bones” (pin feet).  
• Physics: bone dynamics (mola, rigidez), rag-doll.  
• Mesh: Triangulação automática + weight paint; subdivisão Catmull-Clark opcional.  
• Scripts Lua + SDK C++ para ferramentas custom.  
• Export: .moho, FBX (bones + mesh), PNG seq, MP4, Alembic.  
• Licença perpétua 399 USD.

2.2 Spine 4.2 – Esoteric Software – Win/Mac/Linux  
• Orthogonal a Moho (bitmap-only).  
• Meshing: livre (triangular), linked meshes p/ compartilhamento de UV.  
• Skin Constraints (pose offsets), Path Constraints (bones seguem curva B-spline).  
• Graph Editor: curvas Bézier de easing por propriedade.  
• Runtime oficial em 20+ engines (Unity, Godot, Unreal, Cocos).  
• CLI “spine-export” headless; JSON + binary .skel.  
• Licenças: Essential 69 USD (sem mesh, sem IK); Professional 299 USD (tudo).

2.3 DragonBones Pro 5.9 – open source (Apache 2)  
• GUI similar ao Spine.  
• Suporta FFD mesh, IK, path constraints.  
• Output: .dbbin, .json + TexturePacker atlases.  
• Runtimes MIT para LayaAir, PixiJS, Cocos, Unity.  
• Editor só Win/Mac; atualização mais lenta (último major 2023).

2.4 Live2D Cubism 5.1 – Win/Mac  
• Foco em “multi-layer deformation” (heads-up vtubers).  
• Param tracking: 0-1 sliders (Angle X/Y, EyeOpen, MouthForm).  
• ArtMesh warp via Cubic Bezier surface; allows 360° yaw with 2.5D.  
• Auto-physics (pendulum for hair).  
• Export: moc3 + JSON, SDK for Unity/Native.  
• Licença: Free (128 deformers máx.), Pro 15 USD/mês.

2.5 Creature Animation 4.1  
• Onion-skin “Motion Transfer” (AI) – traça curvas vetor e gera bones automaticamente.  
• Advanced motors: Muscle, Bend Physics, Path, Wind.  
• Export runtimes: JSON, Unity, Godot, Spine-compatible JSON.  
• Win/Mac, 199 USD indies.

2.6 Toon Boom Harmony 22  
• Pegs (bones) + deformers (envelope, curve, free-form).  
• Node-graph rig: cutters, kinematic outputs, constraints.  
• Master Controllers – scripts Python que geram GUIs (dials, sliders) p/ dirigir rigs complexos.  
• Usado em séries Netflix (Hilda, Klaus).  
• Licenças: Essentials 28 USD/mês (sem deformers), Premium 118 USD/mês.

3. MOBILE / LITE
----------------

3.1 Animetok – Android (com.adventure.animation)  
• Importa PNG transparente, define pins (até 30).  
• Keyframe timeline, export MP4/GIF.  
• IK simplificado (dois segmentos). Sem mesh; distorção por interpolação entre pins (LBS 2-bone).  
• Grátis, anúncios; sem suporte técnico.

3.2 Prisma3D 2.4 – Android  
• Editor 3D real (mesh + armature). Pode importar plano com textura 2D ⇒ adicionar armature; porém workflow exige weight paint manual via touch – pouco prático.  
• Indicada apenas quando se deseja misturar cenário 3D.

3.3 FlipaClip 3.5 – iOS/Android  
• Frame-by-frame apenas. Sem rigging; incluído aqui como contraponto.

3.4 “Easy Pose 1.6” – Android/iOS  
• Biblioteca de manequins 3D estilizados; gera vídeo 2D renderizado OU exporta sequências PNG para compor sobre lineart. Não é rig 2D nativo.

4. ENGINES E PLUG-INS DE JOGO
-----------------------------

4.1 Unity 2D Animation Package 10.x  
• Sprite Editor → Skinning: define bones + auto-weight (EM weight solver, baseado em k-means e dist.).  
• Sprite Resolver component troca partes (skins) no runtime.  
• Keyframe via Timeline/Animation Window ou code (DOTS).  
• Burst IK solver opcional (jobs). Requires URP for Deform pass.

4.2 Godot 4.2  
• Node2D → Skeleton2D + Bone2D.  
• Weight painting nativo, mesh deformation GPU (shader based).  
• Constraints: IK, bending, twisting.  
• GDScript API para runtime rig edits.  
• Import Spine (plugin paid) ou DragonBones (free).

4.3 Adobe After Effects + DUIK Bassel / Limber  
• Shape layers ou PSDs → puppet pins → DUIK autori­g (FABRIK) + controllers.  
• Ae Puppet Tool usa algoritmos de barycentric coordinates para deformação.  
• Export via Lottie (Bodymovin) mantém keyframes e deformers (suporte parcial).

4.4 Blender 3.6 – Grease Pencil  
• Desenho vetorial no espaço 3D, pode receber Armature Blender (bones 3D).  
• Envelope deform + lattice.  
• Convert 3D motion capture → grease pencil via addon GP-retarget.

5. COMPARATIVO
--------------

Legenda: IK (cinemática inversa), Mesh, FFD (free-form deformation), Runtime (SDK p/ engines), AI-Auto, $.  

| Ferramenta | IK | Mesh/FFD | AI-AutoRig | Export Runtime | Plataforma | Licença |
|------------|----|----------|------------|----------------|-----------|---------|
| Meta AnimatedDraw | – | Laplacian (auto) | Sim | MP4 / glTF | Web | Gratuita |
| Moho 14 | FABRIK | Sim + SmartBones | Não | FBX/Alembic | Win/Mac | \$399 perp. |
| Spine Pro | FABRIK | Sim | Não | 20+ SDK | Win/Mac/Linux | \$299 |
| DragonBones | FABRIK | Sim | Não | 10+ SDK | Win/Mac | Gratuita |
| Live2D Pro | Bézier IK | Cubic Mesh | Semi (auto param) | Unity/Native | Win/Mac | \$15/mês |
| Toon Boom Harmony Prem | Curve IK | Envelope/Curve | Não | OpenEXR/JSON | Win/Mac | \$118/mês |
| Creature | Bézier IK | Muscle/FFD | Sim (Motion Trans.) | Spine JSON | Win/Mac | \$199 |
| Unity 2D | FABRIK | Sim | Semi | Game runtime | Win/Mac/Linux | Grátis c/ Unity |
| Godot 4 | FABRIK | Sim | Não | Game runtime | Win/Mac/Linux | MIT |
| After Effects+Duik | FABRIK | Puppet Mesh | Não | Lottie/Video | Win/Mac | Subscr. |
| Animetok | Basico | Não | Não | MP4/GIF | Android | Free |
| Prisma3D | Armature3D | Sim | Não | FBX/OBJ/Video | Android | Free/Paid |

Pontos-chave exclusividades  
• Meta AnimatedDrawings: primeiro pipeline OSS completo (Apache-2) para desenho infantil.  
• Moho SmartBones: único sistema que mistura rigging e morph targets sem scripting.  
• Spine Path Constraints: animação de serpentes/cabos sem frame-by-frame.  
• Live2D: líder absoluto em VTubers, suporta 10 000 fps “physics” via Verlet.  
• Toon Boom Master Controllers: rig dirigido por GUI custom (ex: joystick facial).  
• Unity SpriteSwap: troca de roupas runtime sem alterar rig.  
• Godot 4 GPU skinning 2D (compute shader) ⇒ 2000 sprites@60 fps móveis.

Workflow recomendado para artista solo 2D  
1) Design em Procreate/Sketchbook ⇒ export PNG transparente.  
2) Spine Essential se precisar só bones + IK (baixo custo), ou Moho se quiser SmartBones.  
3) Export JSON + atlas.  
4) Import no engine (Unity/Godot) para interatividade.  
5) Ajustes finos de peso e curvas dentro do editor antes de programar gameplay.

Observações finais  
– IA de rigging ainda é limitada a personagens simples; para produção profissional, ajustes manuais de pesos e curvas continuam indispensáveis.  
– O custo de licença cresce com recursos (mesh, constraints avançadas). Avalie a curva de aprendizado: Moho < Spine < Harmony.  
– Toda ferramenta baseada em mesh precisa de sprites limpos (sem fundo) e, idealmente, camadas segmentadas (braços, pernas separados) para melhor deformação.