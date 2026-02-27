

# Documentação Técnica Completa: Aplicativos e Ferramentas de Skeletal Animation / Rigging para Desenhos 2D

> **Fontes principais:** Documentações oficiais de cada ferramenta (sketch.metademolab.com, docs.dragonbones.com, moho.lostmarble.com, flipaclip.com, spine-esotericsoftware.com, Live2D.com, creaturemodule.com, docs.cacani.sg, synfig.org, opentoonz.github.io, brashmonkey.com, entre outras), artigos acadêmicos da Meta Research, fóruns de game development (r/gamedev, gamedev.net), comunidades de animação (r/animation, 11secondclub), documentação de engines (Unity, Unreal, Godot), e reviews técnicos publicados.

---

## CONCEITOS FUNDAMENTAIS

Antes de documentar cada ferramenta, é necessário estabelecer os conceitos técnicos que fundamentam todas elas.

### O que é Skeletal Animation (Animação por Esqueleto)

Skeletal animation é uma técnica onde um personagem ou objeto é animado através de uma **estrutura hierárquica de "ossos" (bones)** que forma um esqueleto virtual. Cada osso controla a transformação (posição, rotação, escala) de uma porção da imagem/mesh associada a ele. Ao rotacionar um osso (por exemplo, o antebraço), toda a arte vinculada a ele se move correspondentemente, e os ossos filhos na hierarquia (mão, dedos) acompanham.

### Componentes fundamentais do sistema

**Bones (Ossos):** Segmentos de uma hierarquia em árvore. Cada osso tem um osso-pai (exceto o root bone) e pode ter múltiplos ossos-filhos. A transformação de um osso-pai se propaga automaticamente para todos os filhos. Exemplo: rotacionar o braço (shoulder bone) move automaticamente o antebraço (forearm bone), a mão (hand bone) e os dedos.

**Rigging:** O processo de criar e configurar o esqueleto sobre a arte do personagem. Inclui posicionar os ossos, definir a hierarquia pai-filho, e vincular cada osso à porção correspondente da arte.

**Skinning / Mesh Binding:** O processo de vincular os vértices de uma malha (mesh) aos ossos. Cada vértice pode ser influenciado por um ou mais ossos com pesos (weights) diferentes. Por exemplo, um vértice na região do cotovelo pode ser influenciado 50% pelo osso do braço e 50% pelo osso do antebraço — quando ambos se movem, o vértice interpola suavemente, criando uma deformação natural na dobra.

**Mesh Deformation (Deformação de Malha):** A arte do personagem é mapeada sobre uma malha de polígonos (triângulos). Quando os ossos se movem, os vértices da malha se deslocam de acordo com os pesos de skinning, e a imagem se deforma suavemente em vez de rotacionar rigidamente como peças recortadas.

**Forward Kinematics (FK — Cinemática Direta):** O animador rotaciona cada osso manualmente a partir do osso-pai em direção aos filhos. Para levantar a mão: rotaciona o ombro, depois o cotovelo, depois o pulso. Oferece controle total mas é trabalhoso para cadeias longas.

**Inverse Kinematics (IK — Cinemática Inversa):** O animador move o osso final (por exemplo, a mão/pé) e o algoritmo calcula automaticamente as rotações de todos os ossos intermediários (cotovelo, ombro) para que a cadeia chegue ao alvo. Muito mais rápido para poses, especialmente para pés (walk cycles) e mãos (alcançar objetos).

**Keyframes e Interpolação:** O animador define poses em momentos-chave (keyframes) da timeline. O software calcula automaticamente as poses intermediárias (tweens/in-betweens) por interpolação — linear (movimento constante), Bézier (aceleração/desaceleração configuráveis), ou stepped (sem interpolação, pula direto entre poses).

**Mesh Deformation vs. Rigid Binding:** Em rigid binding, cada parte da arte é uma peça separada que rotaciona como um bloco sólido ao redor do pivô do osso. Em mesh deformation, a arte é uma imagem contínua sobre uma malha deformável — isso elimina gaps nas articulações e cria deformações orgânicas. Mesh deformation é significativamente mais avançado e produz resultados superiores.

---

## 1. ANIMATED DRAWINGS (META)

### Informações Gerais

**Desenvolvedor:** Meta Research (anteriormente Facebook AI Research — FAIR)
**URL:** sketch.metademolab.com
**Plataforma:** Navegador web (desktop e mobile)
**Custo:** Gratuito
**Base tecnológica:** Artigo acadêmico "A Method for Animating Children's Drawings of the Human Figure" (publicado por pesquisadores da Meta em ACM Transactions on Graphics, 2023)

### Como Funciona — Processo Completo

**Etapa 1 — Upload do Desenho:**
O usuário faz upload de uma imagem (foto ou scan) de um desenho de personagem humanóide. O sistema aceita formatos comuns (JPEG, PNG). A imagem pode ser uma foto de um desenho em papel (tirada com celular) ou uma ilustração digital. O sistema foi projetado primariamente para **desenhos de figuras humanas**, incluindo desenhos infantis com proporções não-realistas.

**Etapa 2 — Detecção e Separação do Personagem:**
A IA de visão computacional da Meta detecta automaticamente o(s) personagem(ns) no desenho e separa-o(s) do fundo. O sistema usa modelos de **segmentação de instância** (baseados em arquiteturas como Mask R-CNN ou similares) treinados especificamente em desenhos infantis e ilustrações simples. O usuário pode ajustar manualmente a máscara de separação se a detecção automática não for perfeita.

**Etapa 3 — Detecção de Pose e Colocação do Esqueleto:**
A IA detecta automaticamente a pose do personagem e posiciona um **esqueleto de pontos de articulação** sobre ele. Os pontos incluem: cabeça, pescoço, ombros (esquerdo e direito), cotovelos, pulsos/mãos, quadril/cintura, joelhos, tornozelos/pés. Este sistema usa modelos de **pose estimation** adaptados para figuras desenhadas (em vez de fotografias de pessoas reais). O usuário pode **ajustar manualmente** a posição de cada ponto de articulação arrastando-os, caso a detecção automática erre (o que é comum em desenhos com poses incomuns ou proporções muito estilizadas).

**Etapa 4 — Seleção de Animação:**
O sistema oferece uma biblioteca de **animações predefinidas** (presets de movimento) que podem ser aplicadas ao personagem. Exemplos de animações disponíveis: andar, correr, pular, dançar (vários estilos), acenar, girar, entre outros. Cada animação é um conjunto de dados de movimento capturado (motion capture data) ou animação manual que é **retargetada** (transferida) para o esqueleto do personagem.

**Etapa 5 — Retargeting e Renderização:**
O sistema realiza **motion retargeting** — adapta os dados de movimento da animação selecionada às proporções específicas do personagem desenhado. Como desenhos (especialmente infantis) têm proporções muito variadas (braços curtos, cabeça grande, pernas finas), o algoritmo precisa adaptar o movimento para que pareça natural naquelas proporções. O sistema então deforma a imagem do personagem de acordo com o movimento, usando técnicas de **image warping** baseadas nos pontos de articulação.

**Etapa 6 — Exportação:**
A animação resultante pode ser exportada como **GIF animado** ou **vídeo**. O sistema também permite compartilhamento direto em redes sociais.

### Tecnologia de IA Subjacente

O pipeline usa múltiplas redes neurais em sequência: um modelo de detecção/segmentação para isolar o personagem, um modelo de estimação de pose adaptado para desenhos (treinado em dataset de desenhos infantis anotados com posições de articulação), e um sistema de deformação de imagem baseado em triangulação (a imagem é dividida em triângulos cujos vértices são controlados pelas articulações, e as transformações dos triângulos são calculadas a partir do movimento do esqueleto).

### Limitações

O sistema é otimizado para **figuras humanóides** (duas pernas, dois braços, cabeça). Personagens quadrúpedes, criaturas fantásticas ou objetos inanimados não são suportados de forma confiável. As animações são limitadas à biblioteca de presets — não há capacidade de criar animações personalizadas. A deformação da imagem pode produzir artefatos visuais em desenhos com linhas muito finas ou detalhes complexos. Não há controle sobre timing, easing ou detalhes da animação.

### Diferencial

A principal proposta de valor é a **acessibilidade extrema** — qualquer pessoa, incluindo crianças, pode animar um desenho em menos de 2 minutos sem nenhum conhecimento técnico. É a ferramenta de menor barreira de entrada entre todas as listadas.

---

## 2. DRAGONBONES

### Informações Gerais

**Desenvolvedor:** Egret Technology (empresa chinesa de tecnologia de jogos)
**URL:** dragonbones.com
**Plataforma:** Windows, macOS
**Custo:** Gratuito e open source
**Licença:** MIT License
**Formato nativo:** .dbproj (projeto), exporta para .json + atlas de texturas

### Arquitetura do Software

O DragonBones é um **editor de animação skeletal 2D** com runtime libraries para múltiplas plataformas. O fluxo de trabalho é: criar a animação no editor desktop, exportar os dados de animação, e reproduzi-los em tempo real dentro de game engines ou aplicações usando as runtime libraries.

### Ferramentas e Funcionalidades — Detalhamento Completo

#### 2.1 Armature Mode (Modo de Armadura/Esqueleto)

**Bone Creation (Criação de Ossos):**
Ferramenta para criar ossos clicando e arrastando no canvas. Cada osso é um segmento com: **posição de pivô** (ponto de rotação), **comprimento**, **rotação**, e um **osso-pai** definido pela hierarquia. Ao criar um osso a partir da ponta de outro, automaticamente estabelece-se relação pai-filho. A hierarquia é visualizada em um painel de árvore (similar ao painel de camadas, mas com hierarquia de ossos).

**Bone Properties (Propriedades do Osso):**
Cada osso tem: **Name** (nome para identificação), **Position** (X, Y), **Rotation** (ângulo em graus), **Scale** (escala X, Y), **Length** (comprimento visual do osso), **Color** (cor para visualização no editor — não afeta o resultado final), **Inherit Rotation** (se herda a rotação do pai — pode ser desativado para ossos que devem manter orientação independente), **Inherit Scale** (se herda a escala do pai).

**Slot System (Sistema de Slots):**
O DragonBones usa um sistema de "slots" para organizar a arte. Cada slot contém uma **imagem (display)** e está vinculado a um osso. O slot define a ordem de renderização (z-order/profundidade) e pode conter múltiplas imagens alternativas (para swap de expressões faciais, por exemplo). As propriedades do slot incluem: **Z-order** (ordem de desenho — qual parte aparece na frente), **Display** (qual imagem está ativa), **Color Transform** (alteração de cor/opacidade da imagem no slot), **Blend Mode**.

#### 2.2 Mesh Deformation

**Mesh Editor:**
Ao selecionar uma imagem, pode-se ativar o modo Mesh. O editor gera automaticamente uma **malha de triângulos** sobre a imagem, ou permite criar manualmente adicionando vértices e conectando-os em triângulos. A densidade da malha pode ser controlada — mais triângulos permitem deformações mais suaves mas aumentam o custo de processamento.

**Vertex Weighting (Pesos de Vértices):**
Cada vértice da malha pode ser influenciado por **múltiplos ossos com pesos diferentes**. O DragonBones fornece ferramentas para: **Auto Weight** (cálculo automático de pesos baseado na proximidade de cada vértice aos ossos — algoritmo heat map/envelope), **Manual Weight Painting** (pintura manual de pesos arrastando sobre vértices), **Weight Editor** (tabela numérica para ajuste preciso do peso de cada osso em cada vértice). A soma dos pesos de todos os ossos influenciando um vértice deve ser 1.0 (100%).

**Free-Form Deformation (FFD):**
Além da deformação por ossos, o DragonBones permite **deformação direta de vértices da malha** como keyframes de animação. Isso permite deformações orgânicas que não seguem uma estrutura óssea — útil para expressões faciais, efeitos de squash/stretch, movimentos de tentáculos ou tecido mole.

#### 2.3 Inverse Kinematics (IK)

**IK Constraints (Restrições IK):**
O DragonBones suporta restrições de cinemática inversa. Para configurar: seleciona-se a **cadeia de ossos** (por exemplo, coxa → canela) e define-se o **osso alvo (target bone)** — um osso especial que serve como ponto para onde a cadeia deve apontar. Ao mover o osso alvo, os ossos da cadeia rotacionam automaticamente para alcançá-lo.

**Parâmetros de IK:** **Bend Direction** (direção de dobra — positivo para frente, negativo para trás, controla para que lado o "cotovelo" ou "joelho" aponta), **Chain Length** (quantos ossos na cadeia são afetados pela IK — por exemplo, 2 para coxa+canela), **Weight** (intensidade do IK — 0 = sem efeito IK, 1 = IK total, valores intermediários permitem mistura entre FK e IK).

#### 2.4 Animation Mode (Modo de Animação)

**Timeline:**
Uma timeline horizontal com trilhas por osso/slot. Cada trilha pode conter keyframes para: **rotação**, **posição**, **escala**, **cor/opacidade** (para slots), **display swap** (trocar imagem no slot), **z-order change** (mudar ordem de profundidade), e **FFD** (deformação de malha).

**Keyframe Types e Interpolation:**
Os keyframes suportam múltiplos tipos de interpolação: **Linear** (velocidade constante entre keyframes), **Bézier** (curva personalizada com handles de controle — permite ease-in, ease-out e curvas complexas), **Step** (sem interpolação — salta diretamente para o próximo valor, útil para trocas abruptas como expressões faciais).

**Curve Editor (Editor de Curvas):**
Painel dedicado para ajustar curvas de interpolação de cada propriedade animada. Exibe graficamente o valor da propriedade ao longo do tempo e permite adicionar e manipular handles de Bézier para controlar aceleração e desaceleração.

**Multiple Animations:**
Um único armature (esqueleto) pode ter **múltiplas animações** definidas — idle, walk, run, jump, attack, etc. Cada animação é independente e pode ser chamada separadamente em runtime.

**Animation Blending (na runtime):**
As runtime libraries suportam **blending entre animações** — transição suave de uma animação para outra (ex: de idle para walk) com controle de duração da transição.

#### 2.5 Runtime Libraries e Integração com Game Engines

O DragonBones exporta dados em formato JSON + sprite atlas (imagem compactada com todas as partes do personagem). As runtime libraries disponíveis incluem:

- **Egret Engine** (runtime nativa)
- **Unity** (plugin DragonBones para Unity)
- **Cocos2d-x** (plugin para C++)
- **Phaser** (JavaScript para jogos web)
- **PixiJS** (JavaScript para renderização 2D)
- **CreateJS** (JavaScript)
- **Godot** (via plugins da comunidade)

Cada runtime library reconstroi o esqueleto a partir dos dados JSON, aplica as animações e renderiza o resultado em tempo real. Isso permite que animações sejam **interativas** — respondendo a input do jogador, misturando animações, e alterando propriedades em tempo real.

#### 2.6 Texture Atlas

O DragonBones empacota todas as imagens das partes do personagem em um **texture atlas** (uma única imagem grande contendo todas as partes dispostas eficientemente). Isso otimiza a performance em jogos, pois renderizar uma textura grande é mais eficiente que carregar múltiplas imagens pequenas. O atlas é gerado automaticamente na exportação com opções de: **tamanho máximo do atlas** (512, 1024, 2048, 4096 pixels), **padding** (espaço entre peças para evitar bleeding), **power of two** (forçar dimensões em potência de 2 para compatibilidade com GPUs).

### Diferencial

Gratuito, open source, e com foco em integração com game engines. É uma alternativa viável ao Spine (que é pago) para desenvolvedores indie e pequenos estúdios.

### Limitações

Desenvolvimento atualmente com menor frequência de atualizações comparado ao Spine. Documentação menos extensa que concorrentes comerciais. A interface pode ser considerada menos polida.

---

## 3. ANIMETOK

### Informações Gerais

**Plataforma:** Android (Google Play Store)
**Custo:** Gratuito com compras internas (In-App Purchases para funcionalidades premium)
**Público-alvo:** Animadores iniciantes e criadores de conteúdo mobile

### Funcionalidades

**Rigging simplificado:** O app permite importar uma imagem de personagem e colocar **pontos de articulação** (joints) sobre ela. Os pontos funcionam como um esqueleto simplificado. Ao mover e rotacionar os pontos, as partes do personagem se movem correspondentemente.

**Sistema de Segmentação:** O app requer ou permite que o personagem seja dividido em **partes separadas** (cabeça, tronco, braço superior, antebraço, mão, coxa, canela, pé). Cada parte é vinculada a um ponto de articulação. O movimento é **rigid binding** (cada parte rotaciona como bloco sólido, sem deformação de malha).

**Timeline Básica:** Uma timeline simples para criar animações frame-a-frame ou por keyframes. Controles básicos de playback e FPS.

**Templates de Personagem:** O app inclui templates de personagens pré-riggados para uso rápido.

**Exportação:** GIF animado, vídeo MP4.

### Limitações

Sem mesh deformation (apenas rigid binding — pode haver gaps entre as partes). Sem IK (cinemática inversa). Funcionalidades limitadas na versão gratuita. Interface simplificada com menos controle sobre timing e interpolação comparado a ferramentas desktop. Sem integração com game engines.

### Diferencial

Acessibilidade extrema no Android — permite animar personagens diretamente no celular, sem necessidade de desktop. Barreira de entrada muito baixa.

---

## 4. PRISMA3D

### Informações Gerais

**Plataforma:** Android (Google Play Store)
**Custo:** Gratuito com compras internas (versão Pro)
**Foco:** Modelagem 3D, rigging e animação em dispositivos móveis

### Funcionalidades Relevantes para Animação com Esqueleto

**Modelagem 3D:**
O Prisma3D é primariamente uma ferramenta de modelagem e animação 3D, diferente de todas as outras listadas (que são 2D). Permite criar modelos 3D poligonais diretamente no dispositivo mobile com ferramentas de: extrusão, subdivisão, escultura básica, primitivas geométricas (cubo, esfera, cilindro, cone, torus).

**Bone System (Sistema de Ossos):**
Permite criar **esqueletos 3D** com ossos hierárquicos para rigging de modelos 3D. O processo envolve: posicionar ossos dentro do modelo 3D, definir hierarquia pai-filho, vincular a malha 3D aos ossos (skinning), e ajustar pesos.

**Animation Timeline:**
Timeline para criar animações por keyframes. Cada keyframe armazena a pose do esqueleto (rotação/posição de cada osso). Interpolação automática entre keyframes.

**Materiais e Texturas:**
Suporta aplicação de materiais e texturas aos modelos, incluindo imagens importadas.

**Exportação:**
Exporta modelos e animações em formatos 3D padrão para uso em game engines ou outros softwares 3D.

### Diferencial

É uma das **poucas ferramentas de animação 3D com rigging disponíveis em dispositivos móveis**. Para artistas que querem experimentar com rigging 3D sem acesso a um desktop com Blender ou Maya, o Prisma3D é uma opção acessível.

### Limitações

O foco em 3D o torna menos relevante para artistas que querem animar **desenhos 2D** especificamente. As capacidades de rigging e skinning são simplificadas comparadas a ferramentas desktop como Blender. A interface mobile limita a precisão do trabalho.

---

## 5. MOHO (anteriormente ANIME STUDIO)

### Informações Gerais

**Desenvolvedor:** Lost Marble, distribuído por Smith Micro Software
**URL:** moho.lostmarble.com
**Plataforma:** Windows, macOS
**Versões:** **Moho Debut** (versão básica, ~\$60) e **Moho Pro** (versão profissional completa, ~\$400)
**Uso profissional:** Utilizado em produções como "Song of the Sea" (indicado ao Oscar), "The Breadwinner" (indicado ao Oscar), e séries de TV animadas.

### Sistema de Ossos — Detalhamento Completo

#### 5.1 Bone Tool (Ferramenta de Osso)

Cria ossos clicando para o pivô e arrastando para definir comprimento e direção. Cada novo osso pode ser criado como filho do osso selecionado, construindo a hierarquia automaticamente.

**Bone Properties:**

- **Name:** Identificação do osso.
- **Parent:** Osso-pai na hierarquia (pode ser reatribuído).
- **Position (X, Y):** Posição do pivô.
- **Angle:** Rotação do osso.
- **Scale:** Escala do osso.
- **Length:** Comprimento.
- **Bone Strength:** Intensidade da influência do osso sobre a arte vinculada. Afeta o raio de influência para bind automático.
- **Bone Dynamics:** Simulação física no osso — permite que o osso balance sob influência de gravidade e inércia, criando movimentos secundários automáticos (como cabelo balançando, caudas oscilando, tecido ondulando). Parâmetros de dynamics: **Damping** (amortecimento — quanto o movimento decai), **Gravity** (influência gravitacional), **Force** (força externa).
- **Flexi-Binding:** Quando ativado, o osso cria uma área de influência suave ao redor dele, e os pontos vetoriais próximos são deformados de acordo com a distância. Isso permite deformação sem mesh explícita.

#### 5.2 Bind Points (Vinculação de Pontos)

No Moho, a arte é tipicamente **vetorial** (curvas Bézier com preenchimento e contorno), diferente de ferramentas como Spine e DragonBones que trabalham com imagens raster recortadas. Os pontos de controle das curvas vetoriais podem ser **vinculados a ossos** individualmente.

**Modos de binding:**

- **Auto Bind:** O Moho automaticamente calcula quais pontos vetoriais são influenciados por cada osso com base na proximidade. Cada ponto é vinculado ao osso mais próximo com um peso proporcional à distância.
- **Flexi-Bind:** Modo avançado onde cada ponto pode ser influenciado por múltiplos ossos com pesos suaves. Ativado na propriedade do osso, faz com que a influência decaia gradualmente com a distância, criando deformações suaves nas articulações. É o modo mais usado para animação profissional.
- **Region Binding:** Permite definir regiões específicas e vincular todos os pontos dentro de uma região a um osso específico.
- **Manual Binding:** O animador seleciona pontos vetoriais individualmente e os vincula a ossos específicos com pesos definidos manualmente.

#### 5.3 Smart Bones

**O que são:** Smart Bones é uma funcionalidade **exclusiva do Moho** que automatiza deformações complexas associadas à rotação de um osso específico.

**Como funciona:** O animador define um osso como "Smart Bone". Depois, cria poses específicas para diferentes ângulos desse osso. Por exemplo, para um cotovelo: o animador posiciona o osso do antebraço em 0° (braço esticado), ajusta manualmente todos os pontos ao redor do cotovelo para que pareçam naturais, depois posiciona em -90° (braço dobrado) e ajusta os pontos novamente para eliminar artefatos de deformação na dobra. O Moho armazena essas poses e **interpola automaticamente** entre elas conforme o osso rotaciona. Resultado: deformações complexas que seriam impossíveis apenas com binding automático são resolvidas com poses predefinidas.

**Aplicações dos Smart Bones:** Articulações de cotovelo e joelho (evita o "efeito de dobradiça"), rotações de cabeça (head turns — different views), expressões faciais (vinculadas a um dial/slider controlado por um Smart Bone), movimentos de boca para lip-sync, squash/stretch de corpo, rotação de mão mostrando palma vs. costas.

**Smart Bone Actions:** Smart Bones podem ter **Actions** (ações) associadas — sequências de poses vinculadas ao ângulo do osso. Ao rotacionar o Smart Bone, a Action correspondente é executada automaticamente. Isso cria um sistema de "dials" ou "sliders" para controlar poses complexas com um único controle.

#### 5.4 Inverse Kinematics

**IK Chains:** O Moho suporta cadeia IK com: definição de osso alvo (target), número de ossos na cadeia, ângulo de dobra preferencial (para resolver ambiguidade em cadeias de 2+ ossos). O IK pode ser ativado/desativado por osso e por keyframe, permitindo alternar entre FK e IK durante a animação.

**Pin Bones:** Ossos especiais que fixam uma extremidade no espaço enquanto o restante do corpo se move. Útil para pés que devem permanecer fixos no chão enquanto o corpo se move (foot planting em walk cycles).

#### 5.5 Arte Vetorial Nativa

Diferente de Spine e DragonBones (que trabalham com imagens raster recortadas), o Moho possui **ferramentas vetoriais completas integradas**: Pen tool (caneta Bézier), forma (retângulo, elipse), preenchimento, contorno, gradientes, texturas. A arte é criada diretamente no Moho como vetores, o que significa que pode ser **redimensionada sem perda de qualidade** e que cada ponto vetorial pode ser animado individualmente.

**Vantagem:** Permite animação extremamente fluida de formas orgânicas. Cada ponto de controle da curva pode ter keyframes independentes, possibilitando morphing de formas, expressões faciais detalhadas e deformações que seriam impossíveis com recortes de imagem.

**Desvantagem:** Exige que a arte seja criada (ou recriada) como vetores dentro do Moho ou importada em formatos vetoriais (SVG). Não é ideal para artistas que querem animar pinturas raster detalhadas.

#### 5.6 Image-Based Animation (também suportada)

Além de arte vetorial, o Moho permite importar **imagens raster** e animá-las com ossos, similar ao Spine/DragonBones. As imagens podem ser vinculadas a ossos para rigid binding ou usadas com mesh deformation.

#### 5.7 Layer Types (Tipos de Camada)

O Moho organiza o projeto em camadas com tipos distintos:

- **Vector Layer:** Contém arte vetorial desenhada no Moho.
- **Image Layer:** Contém imagem raster importada.
- **Bone Layer:** Contém o esqueleto de ossos. Bone Layers podem ser pais de Vector/Image Layers, estabelecendo que aquela arte é controlada por aquele esqueleto.
- **Group Layer:** Agrupa múltiplas camadas. Pode ter seu próprio esqueleto de ossos que afeta todas as camadas filhas.
- **Switch Layer:** Contém múltiplas sub-camadas onde apenas uma é visível por vez. Usada para frame switching (troca de expressões faciais, posições de mão predefinidas, etc.). Pode ser controlada por Smart Bones para troca automática baseada em ângulo.
- **Particle Layer:** Emite partículas (estrelas, bolhas, neve, fumaça) com controles de física.
- **Audio Layer:** Importa áudio para sincronia de animação.
- **Note Layer:** Anotações para organização.

#### 5.8 Timeline e Dopesheet

**Timeline:** Visualização padrão com trilhas por propriedade (posição, rotação, escala de cada osso, opacidade, etc.). Keyframes podem ser movidos, copiados, e sua interpolação editada.

**Dopesheet:** Visualização alternativa que mostra todos os keyframes como blocos em uma grade temporal, facilitando ver a distribuição temporal das poses.

**Graph Editor:** Editor de curvas de animação. Cada propriedade animada pode ter sua curva de interpolação visualizada e editada com handles Bézier. Permite: ease-in (desaceleração ao chegar ao keyframe), ease-out (aceleração ao sair do keyframe), overshoot (ultrapassar o valor alvo e voltar — para bounce), e curvas customizadas.

**Cycles:** Uma seção da timeline pode ser marcada como **ciclo** (cycle), fazendo-a repetir automaticamente. Essencial para walk cycles e idle animations.

#### 5.9 Lip-Sync Automático

O Moho Pro inclui sistema de **lip-sync automático** utilizando a tecnologia **Papagayo** (integrada). O processo: importa-se um arquivo de áudio com diálogo, o Moho analisa automaticamente os fonemas (ou o usuário atribui fonemas manualmente), e o software alterna automaticamente entre as poses de boca (visemas) predefinidas para sincronizar com a fala. Os visemas são tipicamente definidos em uma Switch Layer com poses para cada fonema (A, E, I, O, U, consoantes labiais, etc.).

#### 5.10 Exportação

- **Vídeo:** MP4, AVI, MOV com codecs configuráveis (H.264, etc.).
- **Sequência de imagens:** PNG, BMP, TIFF com transparência.
- **GIF animado.**
- **SWF** (Flash — legado).
- **SVG** (exportação vetorial).

### Diferencial

O Moho é a ferramenta desktop **mais completa especificamente para animação 2D por esqueleto** destinada a produção de conteúdo (séries, filmes, curtas). Os Smart Bones são uma exclusividade que resolve elegantemente o problema de deformação em articulações. A integração de arte vetorial nativa com sistema de ossos é única nesta categoria. O lip-sync automático integrado é um diferencial significativo para animação com diálogo.

---

## 6. FLIPACLIP

### Informações Gerais

**Desenvolvedor:** Visual Blasters LLC
**Plataforma:** Android, iOS
**Custo:** Gratuito com compras internas (FlipaClip Premium remove anúncios e desbloqueia funcionalidades)
**Foco:** Animação **frame-by-frame** (quadro a quadro), não skeletal animation

### Funcionalidades Relevantes

**Importante:** O FlipaClip **não é uma ferramenta de skeletal animation/rigging**. É uma ferramenta de animação **tradicional quadro a quadro**, onde cada frame é desenhado individualmente. Porém, é incluído nesta documentação porque é uma alternativa popular para animação em mobile e merece contextualização.

**Ferramentas de Desenho:** Pincéis básicos (caneta, lápis, marcador, borracha), formas geométricas, ferramenta de texto, balde de preenchimento. Suporte a pressão do stylus em dispositivos compatíveis.

**Camadas:** Múltiplas camadas por frame, com controles de opacidade e blend modes básicos.

**Onion Skinning:** Exibe frames anteriores e posteriores em transparência para referência de continuidade. Configuração de: número de frames fantasma, opacidade, cor diferenciada.

**Timeline:** Timeline simples com miniaturas de cada frame. Controles de FPS, loop, e playback.

**Importação de Áudio:** Permite importar áudio (MP3, WAV) na timeline para sincronizar animação com som ou música. O áudio aparece como waveform na timeline.

**Importação de Imagens/Vídeos:** Pode importar imagens como fundo ou referência, e vídeos como base para rotoscopia (desenhar sobre vídeo frame a frame).

**Exportação:** MP4, GIF, sequência de imagens PNG.

### Diferencial

Mais acessível e intuitivo para **animação tradicional** em dispositivos mobile. Grande comunidade de animadores. Interface simples e amigável. Ideal para aprender princípios de animação (timing, spacing, squash/stretch) sem complexidade de rigging.

### Limitação no contexto deste documento

Sem qualquer funcionalidade de rigging, bones, IK ou mesh deformation. Toda animação é manual, frame-by-frame. Para personagens com muitos frames de animação, o workload é significativamente maior que skeletal animation.

---

## 7. SPINE (Esoteric Software)

### Informações Gerais

**Desenvolvedor:** Esoteric Software
**URL:** esotericsoftware.com
**Plataforma:** Windows, macOS, Linux
**Custo:** **Spine Essential** (~\$70, licença perpétua) e **Spine Professional** (~\$340, licença perpétua, ou \$90/ano)
**Formato nativo:** .spine (projeto), exporta para .json/.skel + atlas
**Uso profissional:** Amplamente usado na indústria de games — presente em títulos como Hollow Knight, Darkest Dungeon, Dead Cells, Pyre, Hades, entre centenas de outros.

Spine é **a ferramenta de referência da indústria** para animação skeletal 2D em jogos.

### Ferramentas e Funcionalidades — Detalhamento Completo

#### 7.1 Setup Mode (Modo de Configuração)

Modo para construir o esqueleto e vincular a arte.

**Bone Tool:** Cria ossos hierárquicos. Cada osso tem: nome, posição, rotação, escala, comprimento, e parent. A hierarquia é visualizada em uma árvore colapsável. O root bone é sempre o primeiro da hierarquia. **Transform constraints** podem ser aplicados — forçando um osso a copiar parcial ou totalmente a transformação de outro osso.

**Slot System:** Cada imagem (attachment) é colocada em um slot. Slots definem a ordem de desenho (draw order) e podem conter múltiplos attachments dos quais apenas um é visível por vez (para troca de arte).

**Attachment Types (Tipos de Attachment):**

- **Region Attachment:** Imagem retangular simples, posicionada e vinculada a um osso. Rigid binding — a imagem se move como um bloco sólido com o osso.
- **Mesh Attachment:** Imagem mapeada sobre uma malha de polígonos deformável. Cada vértice da malha pode ser pesado (weighted) para múltiplos ossos. Permite deformação suave em articulações. A malha é criada no **Mesh Editor** do Spine, onde se adicionam vértices manualmente ou com ferramentas de geração automática.
- **Bounding Box:** Polígono invisível vinculado a um osso, usado para detecção de colisão em jogos (hitboxes).
- **Point Attachment:** Ponto singular vinculado a um osso, usado como posição de referência em runtime (por exemplo, ponto de onde projéteis são disparados).
- **Path Attachment:** Curva Bézier vinculada a osso, usada como caminho para path constraints.
- **Clipping Attachment:** Polígono que funciona como máscara de recorte — tudo desenhado depois dele é clippado (recortado) dentro de sua forma.

#### 7.2 Constraints (Restrições)

**IK Constraint:**
Define uma cadeia IK. Parâmetros: **Target bone** (osso alvo), **Chain length** (1 ou 2 ossos na cadeia), **Bend direction** (positivo/negativo — para que lado a articulação dobra), **Mix** (0 a 1 — blend entre FK puro e IK puro, permitindo transição suave), **Softness** (suavização do comportamento IK perto do limite de extensão — evita snap abrupto quando a cadeia está quase esticada).

**Transform Constraint:**
Força um osso a copiar parcialmente a transformação (posição, rotação, escala, cisalhamento) de outro osso. O **Mix** controla a porcentagem de influência (0 = sem efeito, 1 = cópia total). Útil para: olhos que seguem um alvo, partes mecânicas com engrenagens, elementos secundários que acompanham parcialmente o movimento principal.

**Path Constraint:**
Força um osso (ou cadeia de ossos) a seguir um **caminho Bézier** definido por um Path Attachment. Parâmetros: **Position** (posição ao longo do caminho, 0 a 1), **Spacing** (espaçamento entre ossos na cadeia ao longo do caminho), **Rotate Mix** (quanto os ossos rotacionam para seguir a tangente do caminho), **Translate Mix** (quanto a posição segue o caminho). Usos: tentáculos seguindo uma curva, cobras, cordas, correntes, trilhas de partículas.

**Physics Constraint (Spine 4.2+):**
Introduzido nas versões mais recentes, permite adicionar simulação de **física** a ossos individuais. O osso reage a movimentos do personagem com inércia, gravidade e bounce. Parâmetros: **Inertia** (quanto o osso resiste a mudanças de movimento), **Strength** (rigidez da mola/retorno ao repouso), **Damping** (amortecimento da oscilação), **Gravity** (força gravitacional), **Wind** (vento). Usos: cabelo balançando, caudas com inércia, roupas respondendo ao movimento. É similar ao Bone Dynamics do Moho, mas implementado como constraint.

#### 7.3 Mesh Editor Avançado

**Criação de Malha:**
No modo Setup, ao criar um mesh attachment, o Mesh Editor permite: colocar vértices manualmente clicando, gerar malha automaticamente (**Generate** com controle de densidade), conectar vértices com **edges** (arestas) que definem os triângulos, e **Modify** (mover vértices para posições ideais). A malha deve cobrir toda a área da imagem que sofrerá deformação.

**Weight Painting:**
O Spine oferece **weight painting visual** — ao selecionar um osso e entrar no modo Weight, a malha é colorida por um gradient que mostra a influência daquele osso em cada vértice (azul = sem influência, vermelho = influência máxima). O artista pode "pintar" pesos com pincéis de diferentes tamanhos e intensidades, adicionando ou removendo peso. **Auto weight** calcula pesos automaticamente baseado na posição dos ossos em relação aos vértices.

**Hull Vertices:** Vértices nas bordas da malha que definem o contorno da região visível. Vértices internos apenas adicionam densidade de deformação sem alterar o contorno.

#### 7.4 Animation Mode (Modo de Animação)

**Dopesheet:**
Exibe keyframes como blocos em uma grade temporal, organizados por osso/slot/constraint. Permite selecionar múltiplos keyframes e movê-los, escalá-los (esticar/comprimir timing) e copiá-los.

**Graph Editor:**
Visualização e edição das curvas de interpolação de cada propriedade. Tipos de interpolação: **Linear**, **Stepped** (sem interpolação), **Bézier** (curvas customizáveis com handles). Cada segmento entre keyframes pode ter interpolação independente. O Graph Editor é essencial para criar: ease-in/ease-out, anticipation, overshoot, bounce, e outros princípios de animação.

**Draw Order Timeline:**
Trilha específica para animar a **ordem de desenho** dos slots ao longo do tempo. Permite que partes do personagem passem da frente para trás (e vice-versa) durante a animação — por exemplo, um braço que passa atrás do corpo durante uma rotação.

**Events:**
Pontos marcadores na timeline que disparam **eventos** em runtime. Eventos podem carregar dados (nome, inteiro, float, string). Usos: disparar efeitos sonoros (passo ao tocar o chão), spawnar partículas (poeira ao saltar), ativar hitboxes (durante animação de ataque), sincronizar gameplay com animação.

**Audio Timeline (apenas Spine Pro):**
Permite associar arquivos de áudio a posições na timeline para sincronização de som com animação diretamente no editor.

#### 7.5 Skins

Sistema para **variantes de personagem** usando o mesmo esqueleto. Uma skin define um conjunto alternativo de attachments para os mesmos slots. Exemplo: um personagem com skin "guerreiro" (armadura, capacete, espada) e skin "mago" (robe, chapéu, cajado) — ambos compartilham o mesmo esqueleto e as mesmas animações, mas com arte diferente.

**Skin Placeholders:** Slots com attachments definidos por skin. O attachment visível muda automaticamente quando a skin é trocada.

**Skin Composing (Spine 4.0+):** Permite combinar múltiplas skins em uma — por exemplo, combinar skin "cabelo ruivo" + skin "armadura de ferro" + skin "botas de couro" para criar customização modular de personagem.

#### 7.6 Runtime Libraries e Integração

O Spine tem runtimes oficiais mantidos pela Esoteric Software para:

- **Unity** (C#, integração profunda com o editor Unity)
- **Unreal Engine** (C++)
- **Godot** (GDScript/C#)
- **Cocos2d-x** (C++)
- **MonoGame/XNA/FNA** (C#)
- **LÖVE** (Lua)
- **libGDX** (Java)
- **SDL** (C)
- **SFML** (C++)
- **Haxe**
- **JavaScript/TypeScript** (para web — Canvas e WebGL)
- **Flutter** (Dart)
- **Kotlin** (Android nativo)
- **Swift** (iOS nativo)

Cada runtime suporta: reprodução de animações, blending entre animações, mix de múltiplas animações simultâneas (por exemplo, animação de pernas separada da animação do torso), controle de IK em tempo real, eventos, troca de skins, e manipulação direta de ossos via código.

### Diferencial

Spine é o **padrão da indústria** para animação skeletal 2D em jogos. Tem a maior quantidade de runtimes oficiais, a comunidade mais ativa em gamedev, e as ferramentas de animação mais refinadas. O sistema de constraints (especialmente Path e Physics) e o Skin system são incomparáveis. A qualidade e performance dos runtimes são consistentemente superiores.

---

## 8. LIVE2D CUBISM

### Informações Gerais

**Desenvolvedor:** Live2D Inc. (Japão)
**URL:** live2d.com
**Plataforma:** Windows, macOS
**Custo:** **FREE version** (funcionalidades limitadas), **PRO version** (~\$42/mês ou \$2,200 licença perpétua para uso comercial)
**Uso:** Extremamente popular para **VTubers**, visual novels, e conteúdo de estilo anime.

### Conceito Fundamental — Diferente de Skeletal Animation Tradicional

O Live2D utiliza uma abordagem **fundamentalmente diferente** de todas as outras ferramentas listadas. Em vez de recortar o personagem em partes e usar ossos para movê-las, o Live2D deforma uma **ilustração inteira** usando uma malha de polígonos controlada por **parâmetros** (parameters/deformers). O resultado preserva completamente a qualidade e os detalhes da ilustração original enquanto a anima com movimento pseudo-3D.

### Ferramentas e Funcionalidades

#### 8.1 Modeling (Modelagem — no Live2D, "modelar" significa configurar a deformação)

**Art Mesh:**
A ilustração é importada como camadas PSD. Cada camada (olho esquerdo, olho direito, sobrancelha, pupila, boca, cabelo frontal, cabelo lateral, corpo, braço, etc.) recebe automaticamente uma malha de polígonos. A malha pode ser refinada manualmente adicionando vértices e edges para áreas que precisam de deformação mais detalhada.

**Deformers (Deformadores):**
O sistema central do Live2D. Existem dois tipos:

- **Warp Deformer (Deformador de Distorção):** Uma grade retangular (2×2, 3×3, 4×4, etc.) que deforma tudo dentro dela ao mover os pontos de controle da grade. Cada célula da grade pode ser distorcida independentemente. Usado para movimentos amplos como inclinação do corpo, rotação da cabeça, balanço do cabelo.

- **Rotation Deformer (Deformador de Rotação):** Um pivô que rotaciona tudo dentro de seu escopo. Mais similar a um osso tradicional. Usado para: rotação de braços, inclinação de cabeça, rotação de acessórios.

Deformers podem ser **hierarquizados** — um Warp Deformer pode estar dentro de outro Warp Deformer, e ambos podem estar dentro de um Rotation Deformer. A hierarquia permite composição de movimentos (a cabeça rotaciona E inclina E deforma).

#### 8.2 Parameter System (Sistema de Parâmetros)

Esta é a **inovação central** do Live2D e o que o diferencia de todo o resto.

**O que é um Parâmetro:** Um valor numérico (tipicamente de -1 a 1, ou 0 a 1) que controla uma deformação ou propriedade visual. Cada parâmetro é como um "dial" que pode ser girado para produzir um efeito visual.

**Keyforms (Formas-Chave):** Para cada parâmetro, o artista define **keyforms** — estados visuais específicos associados a valores específicos do parâmetro. O Live2D interpola automaticamente entre keyforms para valores intermediários.

**Exemplos de parâmetros padrão:**

- **ParamAngleX (Ângulo X da face):** Valor -30 = face virada para a esquerda, 0 = face frontal, +30 = face virada para a direita. O artista cria keyforms mostrando como cada parte da face (olhos, nariz, boca, contorno) se desloca quando a cabeça vira, e o Live2D interpola suavemente entre elas.
- **ParamAngleY (Ângulo Y da face):** Controla a inclinação vertical (face olhando para cima/baixo).
- **ParamAngleZ (Ângulo Z da face):** Controla a rotação/inclinação lateral da cabeça.
- **ParamEyeLOpen / ParamEyeROpen:** Abertura do olho esquerdo/direito (0 = fechado, 1 = aberto). Keyforms: olho aberto, meio-aberto, fechado.
- **ParamEyeBallX / ParamEyeBallY:** Posição da pupila (olhar para esquerda/direita, cima/baixo).
- **ParamBrowLY / ParamBrowRY:** Posição vertical das sobrancelhas.
- **ParamMouthOpenY:** Abertura da boca.
- **ParamMouthForm:** Forma da boca (-1 = sorriso, 1 = tristeza).
- **ParamBodyAngleX/Y/Z:** Rotação do corpo.
- **ParamHairFront:** Movimento do cabelo frontal.
- **Parâmetros customizados:** O artista pode criar quantos parâmetros desejar para controlar qualquer aspecto.

**Keyform Editing:** Para cada combinação de parâmetro + valor, o artista manipula os vértices da malha, a posição/rotação/escala dos deformers, a opacidade das partes, e a draw order. Quando dois parâmetros interagem (ex: AngleX e AngleY), o Live2D permite definir keyforms em uma **grade 2D de parâmetros** — combinações de valores de ambos os parâmetros, assegurando que qualquer combinação intermediária interpola corretamente.

#### 8.3 Physics Simulation

O Live2D inclui um sistema de **simulação de física** configurável para movimentos secundários automáticos.

**Physics Groups:** Define-se grupos de física para diferentes partes (cabelo frontal, cabelo lateral, peitos, acessórios pendentes, etc.). Cada grupo tem:
- **Input:** De qual parâmetro o movimento é derivado (tipicamente ParamAngleX/Y/Z ou ParamBodyAngle).
- **Output:** Qual parâmetro é afetado pela simulação.
- **Physics Settings:** **Pendulum type** (tipo de pêndulo — simples ou múltiplo), **Length** (comprimento do pêndulo — afeta a frequência de oscilação), **Gravity** (direção e intensidade gravitacional), **Air Resistance** (resistência do ar — amortecimento), **Speed** (velocidade de resposta).

A física permite que cabelo, roupas e acessórios **reajam automaticamente** ao movimento da cabeça/corpo sem animação manual — o cabelo balança com inércia quando a cabeça vira.

#### 8.4 Animation Timeline

O Live2D Cubism Editor inclui uma timeline de animação que permite animar os parâmetros ao longo do tempo com keyframes.

**Funcionalidades da timeline:**
- Keyframes por parâmetro com interpolação (linear, Bézier, stepped).
- Graph Editor para curvas de animação detalhadas.
- **Scene system:** Múltiplas cenas (animações) por modelo.
- **Audio import** para sincronização.
- **Fade in/out** entre animações.
- **Loop settings** por animação.

#### 8.5 Runtime e Integração

**Cubism SDK:** SDK oficial para integração em aplicações, disponível para:
- **Unity** (SDK nativo)
- **Unreal Engine**
- **Web** (JavaScript/TypeScript — Cubism Web Framework)
- **Nativo** (C++, Java, Kotlin, Swift, Objective-C)

**Protocolo VTuber:** O Live2D é o padrão dominante para VTubing. Apps de tracking como **VTube Studio**, **Animaze**, **FaceRig** (legacy), e **VSeeFace** usam o Cubism SDK para renderizar modelos Live2D controlados por face tracking em tempo real via webcam ou iPhone (ARKit). O tracking facial mapeia movimentos reais do rosto do usuário para os parâmetros do modelo Live2D em tempo real.

### Diferencial

O Live2D é **completamente único** em sua abordagem. Nenhuma outra ferramenta permite animar uma ilustração 2D detalhada com movimento pseudo-3D preservando completamente a qualidade artística original. O sistema de parâmetros é extremamente poderoso para faces expressivas. O domínio no mercado de VTubers é absoluto. A qualidade visual é frequentemente superior a skeletal animation tradicional para personagens de estilo anime.

### Limitações

A curva de aprendizado é íngreme — configurar um modelo de qualidade pode levar dias ou semanas. Limitado a movimentos dentro de um ângulo relativamente estreito (tipicamente ±30° de rotação de cabeça — não faz rotação completa de 360°). Não é adequado para animação de corpo inteiro com movimentos amplos (caminhada, corrida, combate). O custo da versão Pro é significativo.

---

## 9. CREATURE (Kestrelmoon)

### Informações Gerais

**Desenvolvedor:** Kestrelmoon
**URL:** creature.kestrelmoon.com
**Plataforma:** Windows, macOS
**Custo:** Versão gratuita (limitada) e Pro (licença paga)

### Conceito — Animação Procedural por IA/ML

O Creature é uma ferramenta de animação 2D que se diferencia por usar **simulação de física automatizada** e **motores de animação procedural** que geram movimentos automaticamente com mínima intervenção manual.

### Funcionalidades

**Automated Animation Engines:**

- **Flesh Mesh Engine:** Simula **tecido muscular** sob a pele de personagens, criando deformações realistas de volume — quando um braço flexiona, o bíceps cresce e o tríceps comprime. O motor calcula automaticamente a deformação baseado na pose do esqueleto.

- **Bone Physics Motor:** Simulação de física de corpo rígido e mole nos ossos. Permite que partes do personagem (cabelo, cauda, tecido) respondam com física simulada sem animação manual.

- **2D Cloth/Skin Motor:** Simulação de tecido 2D — capas, mantos, banners que respondem a gravidade e vento com drapeamento realista.

- **Fluid Body Motor:** Simulação de fluidos para criaturas aquáticas — tentáculos, águas-vivas, criaturas gelatinosas com movimento fluido.

- **Motion Blending:** Mistura automática de múltiplas animações com transitions configuráveis.

**Bend Physics:** Sistema para articulações que automaticamente ajusta a deformação da mesh em áreas de dobra (cotovelos, joelhos) com simulação de volume — impede o colapso visual que ocorre com weight painting básico.

**Directable Procedural Animation:** O animador define parâmetros de alto nível (velocidade, direção, intensidade) e o motor procedural gera os detalhes do movimento. Por exemplo, para uma criatura marinha, o animador define a direção de natação e o motor calcula automaticamente como os tentáculos se movem.

**Runtime Libraries:** Unity, Unreal Engine, Cocos2d-x, Web (WebGL), libGDX.

### Diferencial

Único em simulação de tecidos moles, músculos e fluidos em 2D. Permite resultados de altíssima qualidade com menos trabalho manual que skeletal animation tradicional. Excelente para criaturas não-humanóides com movimentos orgânicos complexos.

### Limitações

Menos conhecido que Spine, DragonBones ou Moho. Comunidade menor. A abordagem procedural pode ser menos previsível que keyframing manual para quem quer controle total.

---

## 10. CACANI (Computer Assisted Cell Animation)

### Informações Gerais

**Desenvolvedor:** Cacani Pte Ltd (Singapura)
**URL:** cacani.sg
**Plataforma:** Windows
**Custo:** Licenças comerciais e educacionais

### Conceito

O CACANi combina **animação frame-by-frame com geração automática de in-betweens por IA**. Diferente de skeletal animation pura, o artista desenha quadros-chave (keyframes) manualmente como arte vetorial, e o software **calcula automaticamente os frames intermediários** (in-betweens/tweens), deformando e morphando as formas vetoriais.

### Funcionalidades

**Stroke Correspondence:** O artista desenha o frame A e o frame B. O CACANi analisa as formas vetoriais e estabelece **correspondência** entre traços — qual traço no frame A corresponde a qual traço no frame B. Isso pode ser automático ou ajustado manualmente.

**Auto In-Betweening:** Com a correspondência estabelecida, o software gera automaticamente quantos frames intermediários forem solicitados. As formas se transformam suavemente de A para B (morphing vetorial). O resultado é animação fluida sem que o artista precise desenhar cada frame intermediário — economizando enormemente o tempo de produção.

**Timing Control:** O animador controla o timing (espaçamento) dos in-betweens com curvas de easing — mais frames agrupados no início para slow-out, mais no final para slow-in, etc.

**Vector Drawing Tools:** Ferramentas de desenho vetorial completas para criar os keyframes diretamente no CACANi.

### Diferencial

Híbrido único entre animação tradicional (frame-by-frame) e assistência computacional. Produz resultados com a qualidade da animação desenhada à mão mas com fração do trabalho. Ideal para estúdios de animação tradicional que querem manter o estilo hand-drawn mas acelerar a produção.

---

## 11. SYNFIG STUDIO

### Informações Gerais

**Desenvolvedor:** Synfig Project (open source)
**URL:** synfig.org
**Plataforma:** Windows, macOS, Linux
**Custo:** Gratuito e open source (licença GPL)

### Funcionalidades

**Vector-Based Tweening:** O Synfig é fundamentalmente baseado em vetores com interpolação automática. O artista define keyframes e o Synfig interpola posições, formas, cores e transformações automaticamente.

**Skeleton Layer:** O Synfig inclui um sistema de bones (camada de esqueleto) que permite criar ossos hierárquicos e vincular arte (vetorial ou raster) a eles. Os ossos controlam a deformação de camadas vinculadas.

**Bone Influence Regions:** Cada osso define uma região de influência baseada em seu comprimento e em parâmetros de raio. Pontos dentro da região de influência de múltiplos ossos são interpolados por pesos calculados automaticamente.

**Tipos de Camada Relevantes:**

- **Skeleton Layer:** Contém o esqueleto de ossos.
- **Region/Outline Layers:** Formas vetoriais com preenchimento e contorno, deformáveis por ossos.
- **Import/Image Layers:** Imagens raster que podem ser vinculadas a ossos para rigid ou deformed binding.
- **Transformation Layers:** Aplicam transformações (rotação, escala, translate) a grupos de camadas.
- **Blur, Color, Distortion Layers:** Efeitos visuais animáveis ao longo do tempo.

**Waypoint System:** O Synfig usa "waypoints" (pontos de caminho) em vez de keyframes tradicionais. Cada waypoint armazena o estado de uma propriedade em um momento no tempo. A interpolação entre waypoints pode ser: **TCB** (Tension, Continuity, Bias — interpolação spline com controles de tensão e continuidade), **Ease In/Ease Out**, **Linear**, **Constant** (sem interpolação).

**Sound Layer:** Permite importar áudio para sincronização de animação.

### Diferencial

**Totalmente gratuito e open source** com capacidades que rivalizam com ferramentas pagas. Excelente para tweening vetorial (tipo Flash/Animate). Cross-platform (Windows, Mac, Linux). Boa opção para artistas sem orçamento.

### Limitações

Interface considerada menos intuitiva que concorrentes comerciais. Performance pode ser lenta em projetos complexos. Mesh deformation e weight painting são menos sofisticados que Spine ou Moho. Comunidade menor que ferramentas mainstream.

---

## 12. OPENTOONZ

### Informações Gerais

**Desenvolvedor:** Dwango (baseado no Toonz de Digital Video/Studio Ghibli)
**URL:** opentoonz.github.io
**Plataforma:** Windows, macOS, Linux
**Custo:** Gratuito e open source (licença BSD modificada)
**História:** O Toonz foi a ferramenta usada pelo **Studio Ghibli** para produzir filmes como "A Viagem de Chihiro" e "Princesa Mononoke". A Dwango liberou o código-fonte como OpenToonz em 2016.

### Funcionalidades Relevantes para Skeletal/Rigging

**Skeleton Tool:** O OpenToonz inclui uma ferramenta de esqueleto para animação por ossos. Permite criar hierarquias de ossos, vincular a arte (tanto vetorial quanto raster) aos ossos, e animar por rotação/posição dos ossos.

**Plastic Tool:** Sistema de **mesh deformation** avançado. Permite criar uma malha de triângulos sobre uma imagem e deformá-la usando ossos ou manipulação direta de vértices. O Plastic Tool inclui: geração automática de malha, edição de vértices, e vinculação a ossos com weights.

**Stacking columns e Pegbar system:** Sistema de organização herdado da animação tradicional com mesa de animação. "Columns" são equivalentes a camadas com propriedades de transformação animáveis. "Pegbars" são controles de posição/rotação/escala que podem ser hierarquizados.

**Xsheet (Exposure Sheet):** Timeline avançada no formato de exposure sheet — tabela onde cada linha é um frame e cada coluna é uma camada/nível. Padrão da indústria de animação tradicional. Permite controle granular de timing e exposição.

**Particle System:** Gerador de partículas com controles de física para efeitos como fumaça, fogo, neve, chuva.

**Effects/FX Pipeline:** Pipeline de efeitos visuais node-based (baseado em nós) para composição complexa de efeitos — blur, glow, color correction, distortion, key (chroma key), etc. Cada efeito é um nó que pode ser conectado a outros.

### Diferencial

Ferramenta com herança direta do **Studio Ghibli** — pedigree artístico incomparável. Completamente gratuita. Combina animação tradicional (frame-by-frame de altíssima qualidade) com capacidades de skeletal animation. O FX Pipeline baseado em nós é profissional. Ideal para quem quer combinar técnicas tradicionais e digitais.

### Limitações

O sistema de skeleton/bones é menos sofisticado que o do Spine ou Moho. Curva de aprendizado muito íngreme — interface complexa com terminologia da animação tradicional. Performance pode ser problemática. Documentação desigual.

---

## 13. SPRITER/SPRITER 2 (BrashMonkey)

### Informações Gerais

**Desenvolvedor:** BrashMonkey
**URL:** brashmonkey.com
**Plataforma:** Windows, macOS, Linux
**Custo:** Spriter original gratuito (versão Pro ~\$60). Spriter 2 em desenvolvimento (Early Access pago).

### Funcionalidades

**Modular Character System:** O Spriter se destaca pela facilidade de criar **personagens modulares** — personagens compostos por partes intercambiáveis (diferentes cabeças, corpos, braços, armaduras, chapéus) que podem ser trocadas mantendo as mesmas animações. O sistema é projetado para jogos com customização de personagem.

**Bone System:** Sistema de ossos hierárquicos similar a DragonBones/Spine, com suporte a IK.

**Character Maps:** Equivalente ao sistema de Skins do Spine — permite definir mapas de partes alternativas que podem ser trocados em runtime.

**Animation Blending:** Mistura automática entre animações diferentes.

**Entity System:** Um "entity" é um personagem completo com seu esqueleto, arte e animações. O projeto pode conter múltiplos entities que compartilham recursos.

**Runtime Support:** Plugins/libraries para Unity, Unreal, Construct 2/3, GameMaker, MonoGame, entre outros.

### Diferencial

Foco em **modularidade** e facilidade de uso para game developers. A interface é uma das mais acessíveis para iniciantes em skeletal animation. Character Maps permitem customização de personagem em jogos de forma muito eficiente.

### Limitações

Mesh deformation é limitada ou ausente nas versões originais (Spriter 1). Spriter 2 promete mesh deformation mas está em desenvolvimento prolongado. Menos refinado que Spine para animação complexa. Comunidade e adoção menores que Spine.

---

## 14. RIVE (anteriormente FLARE)

### Informações Gerais

**Desenvolvedor:** Rive (empresa)
**URL:** rive.app
**Plataforma:** **Web-based** (editor no navegador) + runtimes para plataformas
**Custo:** Gratuito para uso pessoal, planos pagos para equipes e uso comercial
**Foco:** Animação interativa para **UI/UX, web, apps e jogos**

### Funcionalidades

**Bones e Constraints:** Sistema completo de ossos hierárquicos com IK constraints, transform constraints e distance constraints.

**Mesh Deformation com Weight Painting:** Malhas deformáveis com weight painting visual integrado no editor web.

**State Machine (Máquina de Estados):** O diferencial principal do Rive. Permite criar uma **máquina de estados** visual onde cada estado é uma animação, e as transições entre estados são controladas por inputs (clique, hover, scroll, valores de dados). Isso permite criar animações interativas que respondem a input do usuário — botões animados, personagens que reagem ao cursor, loaders animados, onboarding illustrations.

**Blend States:** Estados que misturam múltiplas animações baseado em valores de input. Por exemplo, um personagem que olha para onde o mouse está — o blend state mistura a animação "olhar esquerda" e "olhar direita" baseado na posição X do mouse.

**Runtime Libraries:**
- **Flutter** (Dart — integração nativa)
- **Web** (JavaScript/TypeScript — Canvas e WebGL)
- **React/React Native**
- **iOS** (Swift)
- **Android** (Kotlin)
- **C++** (game engines e aplicações nativas)
- **Unity**
- **Unreal Engine**
- **Defold** (game engine)

### Diferencial

O Rive é único em combinar **animação skeletal profissional com interatividade integrada** (state machines) em um **editor web** sem instalação. É a ferramenta preferida para animações interativas em interfaces de usuário (botões, ícones, ilustrações) de apps e websites modernos. O foco em UI/UX o diferencia de Spine (focado em games) e Moho (focado em produção audiovisual).

---

## 15. ADOBE ANIMATE (anteriormente FLASH)

### Informações Gerais

**Desenvolvedor:** Adobe
**URL:** adobe.com/products/animate
**Plataforma:** Windows, macOS
**Custo:** Assinatura Creative Cloud (~\$22/mês)

### Funcionalidades Relevantes para Skeletal/Rigging

**Asset Warp Tool (introduzido em versões recentes):**
Permite colocar **pins** (pontos de articulação) em uma imagem ou símbolo e deformá-la arrastando os pins. Usa mesh deformation automática. Pins podem ser animados na timeline para criar movimentos articulados sem sistema de ossos explícito.

**Classic Bone Tool (legacy):**
Ferramenta de bones que permite criar esqueletos em formas vetoriais. Cada osso é um segmento que rotaciona a porção da forma vinculada. Suporta IK.

**Symbol-Based Animation:**
A abordagem clássica do Flash/Animate para animação de personagem: cada parte do corpo é um **símbolo** (movie clip) separado, organizado hierarquicamente. Rotacionar o símbolo "braço" rotaciona todo o braço como unidade. Não é mesh deformation — é rigid binding com símbolos aninhados.

**Motion Tween:** Interpolação automática de posição, rotação, escala, cor e filtros entre keyframes para símbolos.

**Frame-by-Frame:** Também suporta animação tradicional quadro a quadro para quando skeletal não é adequado.

**ActionScript/JavaScript:** Permite scripting para interatividade e controle de animação.

**Exportação:** HTML5 Canvas, WebGL, video (MP4), GIF, SWF (legacy), sprite sheet para jogos.

### Diferencial

Versatilidade — combina skeletal (Asset Warp, Bone Tool), tweening de símbolos, frame-by-frame, e interatividade com scripting. Longa história na indústria. Exportação nativa para HTML5/web.

### Limitações

O sistema de bones é menos sofisticado que Spine, Moho ou DragonBones. Não é focado especificamente em skeletal animation — é uma ferramenta genérica de animação. Custo de assinatura Adobe. Performance pode ser inferior a runtimes especializadas (Spine, DragonBones) para jogos.

---

## 16. TOON BOOM HARMONY

### Informações Gerais

**Desenvolvedor:** Toon Boom Animation
**URL:** toonboom.com
**Plataforma:** Windows, macOS
**Custo:** **Essentials** (~\$26/mês), **Advanced** (~\$65/mês), **Premium** (~\$117/mês)
**Uso profissional:** Padrão da indústria para produção de séries animadas de TV (Rick and Morty, The Simpsons, Castlevania, Futurama, Bob's Burgers, Archer, entre inúmeras outras).

### Funcionalidades de Rigging

**Deformation System (Premium):**
Sistema de deformação por ossos com: **Bone Deformation** (ossos hierárquicos que deformam a arte), **Curve Deformation** (cadeias de ossos que seguem curvas suaves — excelente para tentáculos, braços, cabelo), **Envelope Deformation** (define uma "pele" ao redor do personagem com contornos superior e inferior que controlam a deformação — variando a espessura da pele produz squash/stretch). Suporta mesh deformation com weight painting.

**Peg System:** Pegs são objetos de transformação (posição, rotação, escala) que podem ser hierarquizados e vinculados a desenhos. O sistema de pegs é o equivalente funcional a ossos, mas com terminologia da animação tradicional.

**Master Controller:** Permite criar controles personalizados (sliders, dials) que comandam múltiplos parâmetros simultaneamente — similar aos Smart Bones do Moho mas com implementação diferente.

**Node-Based Compositing:** Pipeline de composição baseada em nós para efeitos visuais complexos — blur, glow, tone, highlight, shadow, color override, cutter, blend, transform.

**IK e FK:** Suporte completo a cinemática inversa e direta com alternância e blending.

### Diferencial

**Padrão absoluto da indústria** para produção de séries animadas de TV. Combina skeletal animation com frame-by-frame em um pipeline unificado. Node-based compositing profissional. Ferramentas de cut-out animation (rigging de recortes) incomparáveis em flexibilidade. Colaboração em equipe (versão Premium).

### Limitações

Custo elevado (especialmente Premium). Curva de aprendizado significativa. Não é focado em integração com game engines — é para produção audiovisual. Overkill para projetos pequenos ou individuais.

---

## TABELA COMPARATIVA DE FUNCIONALIDADES

Para cada ferramenta, as funcionalidades presentes:

**Sistema de Ossos Hierárquicos:** Presente em DragonBones, Moho, Spine, Live2D (via Rotation Deformers), Creature, Synfig, OpenToonz, Spriter, Rive, Adobe Animate, Toon Boom. Ausente em Animated Drawings (esqueleto implícito, não editável como bones), FlipaClip (sem bones), CACANi (morphing vetorial, não bones).

**Mesh Deformation com Weight Painting:** Presente em DragonBones, Spine, Moho (via Flexi-Bind), Live2D (Art Mesh), Creature, OpenToonz (Plastic Tool), Rive. Parcial em Synfig. Ausente em Animated Drawings, Animetok, Prisma3D (3D mesh, não 2D), FlipaClip, Spriter 1, Adobe Animate (Asset Warp é simplificado).

**Inverse Kinematics:** Presente em DragonBones, Moho, Spine, Synfig, Spriter, Rive, Adobe Animate, Toon Boom. Ausente ou não aplicável em Animated Drawings, Animetok, FlipaClip, Live2D (usa sistema de parâmetros em vez de IK), CACANi.

**Simulação de Física Automática:** Presente em Moho (Bone Dynamics), Spine (Physics Constraints), Live2D (Physics System), Creature (múltiplos motores de física). Ausente na maioria dos outros.

**Integração com Game Engines:** Forte em Spine (15+ runtimes), DragonBones (7+ runtimes), Live2D (Cubism SDK), Creature (5+ runtimes), Rive (10+ runtimes), Spriter (plugins para engines). Limitada ou ausente em Moho, FlipaClip, CACANi, Adobe Animate (web-focused), Toon Boom (produção audiovisual).

**Auto In-Betweening por IA/Algoritmo:** CACANi (especializado nisso), Animated Drawings (IA), Toon Boom (parcial). Ausente na maioria — skeletal animation por natureza gera in-betweens via interpolação de ossos, mas morphing de formas desenhadas é diferente.

**Lip-Sync Automático:** Moho (Papagayo integrado), Toon Boom (análise de áudio). Parcial em Live2D (via apps de tracking). Ausente nos demais como funcionalidade integrada.

**Gratuito:** Animated Drawings, DragonBones, FlipaClip (base), Synfig, OpenToonz, Krita (referência — tem skeleton basic). Parcialmente gratuito: Spriter 1, Rive (uso pessoal), Live2D (versão FREE), Creature (versão limitada). Pagos: Spine, Moho, Adobe Animate, Toon Boom.

**Plataforma Mobile:** Animated Drawings (web/mobile browser), Animetok (Android), Prisma3D (Android), FlipaClip (Android/iOS). Todos os demais são desktop-only (exceto Rive que é web-based e funciona em qualquer dispositivo com navegador).

---

> Esta documentação reflete funcionalidades verificáveis com base em documentações oficiais e informações disponíveis até janeiro de 2025. Versões, preços e funcionalidades podem ter sido atualizados após esta data.