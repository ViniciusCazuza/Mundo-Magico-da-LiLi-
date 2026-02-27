<think>The user wants an extremely deep, technical, PhD-level documentation about all the features that Procreate lacks but competitors have. They want me to research and document everything about:

1. Vector Layers (CSP, Fresco, Krita)
2. Parametric/Positionable Rulers (CSP, Krita)
3. Multiple Brush Engines (Krita 10+)
4. Fluid Physics Simulation for Watercolor (Fresco Live Brushes)
5. Dedicated Gradient Tool (Infinite Painter)
6. Non-destructive Filter Masks (Krita)
7. 3D Model Import (CSP)


8. Macros/Auto Actions (CSP)
9. Wrap-Around Mode for Tileable Textures (Krita)
10. Audio Import for Animation (Krita)
11. 5-Point Curvilinear Perspective (Infinite Painter)

I'm diving into the technical architecture of vector implementations across these applications. CSP stores strokes as Bezier curves with individual control points, pressure-mapped width data, and opacity information that can be edited post-drawing—the intersection erase feature is particularly sophisticated, detecting where vector paths cross mathematically to cut at exact points. Fresco uses SVG-compatible paths integrated with Adobe's rendering engine for Creative Cloud compatibility, while Krita implements true SVG-based vectors but with less illustration-focused power. The fundamental difference between raster and vector comes down to resolution independence: vectors use mathematical path descriptions with cubic Bezier curves that can be scaled infinitely, whereas raster operations modify pixel values in a fixed grid.

Now I'm moving through the remaining features—parametric rulers in CSP and Krita allow dynamic positioning and angle adjustment for perspective work, multiple brush engines in Krita provide different rendering algorithms for varied artistic effects, and Fresco's fluid physics simulation models actual watercolor behavior through particle systems and pigment diffusion. Infinite Painter's dedicated gradient tool offers advanced color interpolation controls, Krita's non-destructive filter masks preserve original image data while applying effects, CSP's 3D model import enables reference integration directly in the canvas, and CSP's macro system automates repetitive drawing tasks through recorded action sequences. Krita's wrap-around mode tiles the canvas seamlessly for texture creation, audio import synchronizes animation frames to sound, and Infinite Painter's 5-point curvilinear perspective extends beyond traditional 3-point perspective for more complex spatial distortions. Krita's shape rulers cover circles, ellipses, rectangles, and polygons with configurable sides, plus symmetry rulers for mirrored patterns. For drawing assistants, Krita offers simpler tools like straight rulers, infinite rulers for parallel hatching, vanishing point assistants for perspective, concentric ellipses, and a spline assistant that uses Catmull-Rom curves instead of Bezier curves like CSP's approach.

Beyond those, there's a fisheye point assistant for curvilinear perspective and a mesh transform grid-based assistant. Multiple assistants can work together, each with adjustable snap distance, color, and visibility settings, plus a global snapping strength slider that controls how much strokes are pulled toward the assistant at different percentages.

Now I'm moving into Krita's brush engines, starting with the pixel brush engine and its parameters like shape, spacing, and auto-adjustment options.

The color smudge engine is specifically for blending and smearing colors—it samples from the canvas, blends incoming color with existing paint based on strength and color rate settings, then writes back. The shape brush engine stamps pre-defined vector shapes rather than painting freehand. The hairy brush engine simulates individual bristles with parameters for bristle count, length distribution, ink amount, and how quickly ink depletes as you paint.

Each bristle is modeled as an independent point source moving along the stroke with its own offset, and the system calculates ink depletion per bristle across the stroke distance. The spray brush engine generates particles in configurable patterns—controlling spray area diameter, particle count, distribution type (uniform, Gaussian, random, elliptical), and particle shapes like circles, squares, or loaded brushes. The soft brush engine uses a smooth, feathered edge approach, which differs from the pixel-based approach.

The sketch brush engine adds auxiliary lines at stroke intersections with configurable probability, offset, and magnetism to create that overlapping, hand-drawn quality. Texture brushes let the texture map influence the actual brush movement rather than just adding grain overlay. Quick brush is a performance-optimized version of pixel brush for lower-end hardware, while grid brush paints in mosaic patterns. Curve brush creates curved segments instead of straight strokes, and particle brush simulates physics-based effects like gravity, wind, and attraction to produce explosion or flowing effects. Deform brush remaps nearby pixels according to operations like move, grow, shrink, swirl, or lens distortion to create liquify-like effects directly as a brush.

Now moving into the clone and normal map brushes—clone brush samples from a source point like Photoshop's clone stamp, while tangent normal brush paints mathematically correct normal map data where stroke direction automatically generates the right RGB values for surface orientation, useful for game assets and 2.5D effects. All these engines are accessible through Krita's brush editor with real-time preview.

Adobe Fresco's live watercolor uses a fluid dynamics simulation that models the canvas as a 3D surface with paper fibers and water absorption, letting pigment particles flow and diffuse while simulating capillary action, backruns, and edge darkening as water evaporates. The simulation parameters include water amount, pigment concentration, flow speed, and wet paint area size to control how the watercolor behaves.

For live oil, Adobe simulates paint as a viscous 3D fluid with height, where viscosity determines how much the brushstrokes hold their ridges versus flowing smooth, and the paint load controls how much pigment is on the brush.

The key technical difference is that Fresco's impasto maintains a separate height channel that physically affects lighting calculations, whereas raster smudging like Procreate's wet mix just blends pixels in 2D space.

Now I'm looking at gradient tools, starting with Infinite Painter's approach which supports multiple gradient types with interactive color stops along the gradient axis.

The rendering involves interpolating colors between endpoints using linear algebra, and the choice of color space matters—RGB interpolation produces different results than HSL, especially for transitions like red to blue. High-quality gradients use dithering to avoid banding artifacts, which Procreate doesn't have built-in, so users resort to workarounds like airbrushing or blurring.

Krita's non-destructive approach uses Filter Layers that apply effects to everything below them without baking changes into pixels, and Filter Masks that attach to individual layers with their own pixel masks to control where the filter shows through. Gradient Map, Binarization, and Tone Correction are also available as adjustment layers in CSP, with the option to clip them to the layer below or have them affect all layers in the folder. Moving on to 3D model import capabilities—CSP offers pre-rigged poseable human figures with full skeletal control, individual finger articulation, body proportion sliders, and gender morphs, plus the ability to import external 3D objects in OBJ, FBX, or native formats and position them in a scene with adjustable camera angles and field of view before rendering to canvas as a drawing guide. CSP also includes an Auto Actions feature that works like Photoshop's macro recorder, letting me record sequences of operations and batch apply them across multiple files, though it's more limited in conditional logic compared to Photoshop. Finally, Krita's Wrap-Around Mode creates a seamless tiling canvas by rendering the image as if it wraps infinitely in both directions, so brush strokes that cross edges continue on the opposite side simultaneously—perfect for designing seamless textures and patterns.

Krita also supports audio import for animation work, displaying the waveform in the timeline for lip-sync reference and syncing playback with animation frames, then embedding the audio when exporting to video formats via FFmpeg. Infinite Painter implements 5-point curvilinear perspective through its Guides tool, showing a curved grid with vanishing points at the center and four cardinal positions to approximate true fisheye perspective, while CSP has a similar fisheye ruler and Krita offers a single fisheye point assistant—features Procreate lacks entirely. Now I'm organizing all of this into a comprehensive response structured by feature with technical depth, implementation details across apps, and explanations of why certain tools don't support specific capabilities.</think># Documentação Técnica de Nível Avançado: Funcionalidades Ausentes no Procreate e Suas Implementações nos Concorrentes

> **Metodologia:** Esta documentação compila informações das documentações oficiais do Krita (docs.krita.org), Clip Studio Paint (manual oficial + tips.clip-studio.com), Adobe Fresco (helpx.adobe.com/fresco), Infinite Painter, artigos técnicos peer-reviewed sobre simulação de fluidos em pintura digital, e análise técnica de fóruns especializados como Krita Artists, Clip Studio Ask, e Stack Exchange (gamedev/graphics).

---

## ÍNDICE

1. Camadas Vetoriais (CSP, Krita, Fresco)
2. Réguas Paramétricas Posicionáveis (CSP, Krita)
3. Múltiplos Motores de Pincel (Krita)
4. Simulação de Física de Fluidos — Aquarela e Óleo (Adobe Fresco)
5. Ferramenta de Gradiente Dedicada (Infinite Painter e outros)
6. Filtros Não-Destrutivos e Filter Masks (Krita)
7. Importação de Modelos 3D (Clip Studio Paint)
8. Macros e Auto Actions (Clip Studio Paint)
9. Wrap-Around Mode para Texturas Tileable (Krita)
10. Importação de Áudio para Animação (Krita)
11. Perspectiva Curvilínea de 5 Pontos (Infinite Painter, CSP, Krita)

---

# 1. CAMADAS VETORIAIS

## Fundamento Técnico: O Que É Um Vetor em Contexto de Pintura Digital

Antes de detalhar as implementações, é essencial entender a diferença arquitetural entre raster e vetor no nível computacional.

**Raster (como Procreate funciona inteiramente):** Uma imagem raster é uma matriz bidimensional de pixels. Cada pixel armazena valores de cor (em Procreate, 16 bits por canal em telas avançadas). Uma pincelada raster **modifica permanentemente os valores dos pixels** na grade. Escalar a imagem para cima causa perda de qualidade porque o algoritmo de reamostragem (bilinear, bicúbico, etc.) precisa "inventar" pixels intermediários.

**Vetor:** Um vetor é uma descrição matemática de formas usando equações geométricas. A primitiva fundamental é a **curva de Bézier**. Uma curva de Bézier cúbica é definida por 4 pontos de controle: P0 (início), P1 (alça de direção do início), P2 (alça de direção do fim), P3 (fim). A equação paramétrica é:

$$B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t)t^2 P_2 + t^3 P_3, \quad t \in [0,1]$$

Uma pincelada vetorial armazena a **sequência de curvas de Bézier** que formam o caminho do traço, mais os metadados de variação de espessura (envelope de largura) e opacidade ao longo do caminho. Nenhum pixel é modificado — tudo é geometria matemática. A rasterização acontece apenas no momento de exibição (renderização em tempo real) ou exportação final.

---

## 1.1 Clip Studio Paint — Camadas Vetoriais

**Fonte: CSP Reference Manual, Seção "Vector Layer"**

### Como Criar e Ativar

No painel de Camadas, o botão de nova camada tem um submenu que inclui **"New Vector Layer"** (atalho: nenhum padrão, configurável). O ícone da camada vetorial no painel de Layers exibe um pequeno símbolo de caneta/curva para diferenciá-la de camadas raster.

### Como os Traços São Armazenados

Cada pincelada em uma camada vetorial é armazenada como um **objeto vetorial independente**, contendo:

- O caminho completo como sequência de curvas de Bézier
- Um **perfil de largura** (width profile): uma curva secundária que mapeia a posição paramétrica \(t\) ao longo do traço para um valor de espessura — isso é o que permite que o traço seja fino nas pontas e grosso no meio, exatamente como uma pincelada real
- Um **perfil de opacidade** ao longo do traço
- A cor do traço
- O blend mode do traço

Isso significa que o CSP **converte a dinâmica de pressão do Apple Pencil/Stylus em metadados matemáticos**, não em pixels. A pressão que variou durante o traço é salva como dado editável.

### Node/Control Point Editing (Edição de Nós)

Ao selecionar a **Object Tool** (ferramenta de objeto) e clicar em um traço vetorial, todos os **pontos de controle (nós)** ficam visíveis. Cada nó tem:

- **Position handles:** movem o próprio ponto âncora, alterando onde o caminho passa
- **Direction handles:** as alças simétricas que controlam a tangente da curva em cada ponto — movê-las altera a curvatura sem mover o ponto âncora

Ao selecionar o **Object Tool > Sub Tool "Edit Vector"**, operações adicionais ficam disponíveis: adicionar novos nós a qualquer ponto do caminho, remover nós existentes (o caminho se ajusta suavemente), converter nó de curvo para angular (corner point) e vice-versa.

### Line Width Correction (Correção de Espessura de Linha)

Esta é uma das funcionalidades mais poderosas das camadas vetoriais no CSP. Com a **Sub Tool "Correct Line Width"** (parte do grupo de ferramentas de correção vetorial), é possível:

- **Thin**: afina todo o traço uniformemente, reduzindo o perfil de largura por um fator configurável
- **Bold**: engrossa todo o traço uniformemente
- **Narrow End**: afina especificamente as pontas (início e fim) do traço, mesmo após ele ter sido desenhado
- **Fix Width**: uniformiza a espessura ao longo de todo o traço, eliminando variações de pressão (útil para criar linhas perfeitamente uniformes)

O slider **"Strength"** controla a intensidade de qualquer dessas correções. O parâmetro **"Area"** define se a correção afeta o traço inteiro, apenas a área sob o cursor (pintando a correção), ou as pontas.

### Redraw Stroke Vector (Redesenhar Traço Vetorial)

A **Sub Tool "Redraw vector line"** permite redesenhar sobre um traço existente. O CSP detecta o traço próximo ao cursor e substitui aquela porção pelo novo traço desenhado, mantendo as conexões com o restante.

### O Recurso Exclusivo: "Erase up to Intersection" (Apagar até a Interseção)

Este é talvez o recurso mais citado por artistas de lineart como diferencial decisivo do CSP.

**Como funciona matematicamente:** O CSP mantém um **grafo topológico** de todos os traços na camada vetorial, calculando continuamente os pontos onde os caminhos de Bézier de traços diferentes se intersectam. Um ponto de interseção entre dois traços \(C_1(t)\) e \(C_2(s)\) é encontrado resolvendo o sistema paramétrico \(C_1(t) = C_2(s)\), geralmente via método numérico iterativo (bisseção ou Newton-Raphson nos parâmetros \(t\) e \(s\)).

Quando a **Vector Eraser** está no modo **"Erase up to Intersection"** (configurável no painel de opções da sub-tool), ao tocar em um segmento de traço, em vez de apagar onde o cursor está, o CSP apaga o segmento completo **desde a ponta do traço até o primeiro ponto de interseção com qualquer outro traço**. Se tocar no segmento entre duas interseções, apaga somente aquele trecho intermediário.

**Por que isso é revolucionário para lineart:** Em lineart tradicional, ao desenhar linhas que se cruzam (como a divisão de um rosto), cada linha inevitavelmente ultrapassa a outra. No raster, apagar as sobrepassagens requer precisão manual. No CSP vetorial, um único toque no segmento excedente o elimina perfeitamente, deixando as linhas conectadas no ponto exato de interseção sem nenhum pixel extra.

### Redimensionamento e Resolução Independente

Ao usar **Edit > Transform** em uma camada vetorial, a escala pode ir a 1000% sem qualquer degradação. O CSP simplesmente rasteriza os vetores na resolução final do documento no momento da exportação ou mesclagem com camadas raster.

### Exportação de Camadas Vetoriais

As camadas vetoriais do CSP são exportadas apenas como parte do formato nativo **.clip**. Ao exportar para PDF, os vetores são rasterizados. Ao exportar para PSD (Photoshop), as camadas vetoriais também são rasterizadas. Não há exportação para SVG ou AI diretamente do CSP (uma limitação comparada ao Krita e ao Fresco).

---

## 1.2 Krita — Camadas Vetoriais (SVG-based)

**Fonte: docs.krita.org, Seção "Vector Layers"**

### Fundamento Técnico: SVG no Krita

O Krita usa o formato **SVG (Scalable Vector Graphics)** como base para suas camadas vetoriais. SVG é um padrão aberto do W3C, o que significa que os vetores do Krita são compatíveis com qualquer software que leia SVG (Inkscape, Illustrator, browsers web, etc.).

### Ferramentas Vetoriais Disponíveis

Ao criar uma **Vector Layer** (Layer > Add New > Vector Layer), as ferramentas do painel esquerdo mudam para ferramentas vetoriais:

**Ferramenta de Caminho (Path Tool / Bezier):**
- Modo de clique sequencial para criar polilíneas com nós angulares
- Modo de clique e arrasto para criar nós curvos (Bézier cúbico) com alças de direção
- Fechar o caminho clicando no primeiro nó
- **Edição de nós em tempo real:** Ao ativar o modo de edição (tecla N enquanto a ferramenta está ativa), todos os nós ficam visíveis e podem ser manipulados: mover, adicionar (double-click no segmento), remover (selecionando o nó e Delete), converter entre angular e curvo (tecla V para sharp, C para smooth no nó selecionado)

**Ferramenta de Calígrafia (Freehand Path / Calligraphy):**
- Desenho livre de caminhos vetoriais, como uma caneta
- Parâmetros no painel de opções: **Width** (largura base do traço), **Mass** (inércia — alta massa = traço mais suave e lento para mudar direção), **Drag** (arrasto — alta drag = traço que diminui velocidade mais rapidamente), **Angle** (ângulo de inclinação da "pena")
- Cria SVG `<path>` com envelope de largura variável

**Ferramentas de Formas:**
- Retângulo (Rectangle Tool): cria `<rect>` SVG com parâmetros de raio de canto (para cantos arredondados)
- Elipse (Ellipse Tool): cria `<ellipse>` SVG
- Polígono (Polygon): cria `<polygon>` SVG com número de lados configurável

**Shape Properties (Propriedades de Forma):**
Ao selecionar qualquer objeto vetorial com a **Select Shapes Tool**, o painel de opções exibe:
- **Fill:** cor de preenchimento, gradiente ou padrão
- **Stroke:** cor e espessura da borda
- **Stroke style:** pontilhado, traçado, sólido; caps (flat, round, square) e joins (miter, round, bevel)
- **Opacity:** opacidade do objeto
- **Blend mode:** modo de mesclagem do objeto vetorial com a camada abaixo

### Diferença Fundamental CSP vs Krita para Vetores

O CSP trata vetores como **pinceladas inteligentes** — o modelo mental é de desenho/pintura, e os vetores existem para que você possa editar o que desenhou. O Krita trata vetores como **objetos de design** — o modelo mental é de software de ilustração vetorial como o Inkscape. O CSP é superior para lineart; o Krita é superior para formas geométricas e design.

---

## 1.3 Adobe Fresco — Pincéis Vetoriais

**Fonte: helpx.adobe.com/fresco/using/vector-brushes.html**

### Arquitetura

O Fresco usa o **Adobe Illustrator's rendering engine** para seus pincéis vetoriais, com o motor de vetores da Creative Cloud como backend. Isso é tecnicamente significativo porque os mesmos algoritmos que geram vetores no Illustrator estão presentes no Fresco.

### Camadas Vetoriais no Fresco

Uma **Vector Layer** no Fresco aceita apenas pincéis do tipo **Vector Brushes**. Cada pincelada cria um path SVG com:
- O caminho central do traço (spine)
- Um envelope de largura derivado da pressão do Apple Pencil (stored como variação de espessura ao longo do path)
- Textura do pincel renderizada ao longo do path em tempo real

**Pressão → Espessura de Forma Não-Destrutiva:** Diferente de um raster onde a pressão modifica pixels diretamente, no Fresco vetorial a pressão é armazenada como metadado. Pode-se selecionar o traço depois e usar os **Width Point Controls** (controles de ponto de largura — herdados do Illustrator) para **modificar a variação de espessura manualmente em qualquer ponto do traço**.

### Width Tool (Ferramenta de Largura) no Fresco

Ao ativar a Width Tool em um traço vetorial, aparecem **pontos de largura** ao longo do caminho. Cada ponto tem dois handles que representam a largura do traço naquele ponto (acima e abaixo do eixo central). Arrastar esses handles aumenta ou diminui a espessura naquele ponto específico, criando variações de espessura customizadas em qualquer posição do traço.

### Compatibilidade com Creative Cloud

Pincéis vetoriais criados no Fresco podem ser **abertos no Adobe Illustrator** através do Creative Cloud, mantendo editabilidade total. Isso torna o Fresco a única ferramenta de pintura que oferece um pipeline vetorial integrado com o ecossistema de design profissional da Adobe.

---

# 2. RÉGUAS PARAMÉTRICAS POSICIONÁVEIS

## Fundamento Conceitual

Réguas paramétricas são **guias de desenho posicionáveis no canvas** que constraingem (forçam) os traços a seguir geometrias específicas. O termo "paramétrica" indica que a geometria das réguas é definida por parâmetros numéricos ou por posicionamento interativo.

---

## 2.1 Clip Studio Paint — Sistema de Réguas (Rulers)

**Fonte: CSP Reference Manual, Seção "Ruler"**

As réguas no CSP existem em **Ruler Layers** — camadas especiais invisíveis que guardam os objetos de régua. Uma régua pode ser configurada para afetar apenas a camada pai ou **todas as camadas**, tornando-a uma régua global do documento.

### Régua Reta (Straight Ruler)

Cria uma linha infinita em qualquer ângulo. Configuração: desenhar a linha arrastando ou inserir o ângulo numericamente. Com a régua ativa e **"Snap to Ruler"** habilitado, qualquer pincelada nas proximidades se alinha à linha. A snap distance (distância de atração) é configurável em preferências.

### Régua de Curva (Curve Ruler)

Define uma curva Bézier posicionável. Após colocar os pontos de controle, qualquer traço próximo se alinha à curva. Diferente da régua reta (que é infinita), a régua de curva tem começo e fim, mas pode ser estendida. Sub-tipos: **Quadratic Bezier** (3 pontos: início, ponto de controle único, fim) e **Cubic Bezier** (4 pontos).

### Régua de Linha Paralela (Parallel Ruler)

Define um ângulo e todos os traços ficam paralelos a esse ângulo, independente da direção em que se move a mão. É como ter um esquadro invisível que rotaciona para qualquer ângulo. Configuração: Arrasta-se para definir o ângulo, ou insere-se numericamente em graus. **Casos de uso:** Hatching (hachura) uniforme, superfícies planares em perspectiva, linhas de velocidade paralelas no mangá.

### Régua de Linha Concentrada (Concentrated Line Ruler / Radial Line Ruler)

Todos os traços convergem para um único ponto focal. O ponto pode ser **colocado fora do canvas** — por exemplo, 5000 pixels à esquerda — o que permite linhas de velocidade que convergem para um ponto muito distante, criando uma sensação de profundidade e velocidade extrema. Muito usada em mangá para efeitos dinâmicos (speed lines, impact lines).

### Régua de Perspectiva (Perspective Ruler)

Este é o sistema mais completo de perspectiva paramétrica disponível em qualquer app de pintura:

**Configuração de 1 ponto de fuga:** Um único VP na linha do horizonte. Todas as linhas horizontais na direção de profundidade convergem para ele. As linhas verticais permanecem verticais.

**Configuração de 2 pontos de fuga:** Dois VPs na linha do horizonte. Todas as arestas horizontais de objetos convergem para um dos dois VPs. Linhas verticais permanecem verticais.

**Configuração de 3 pontos de fuga:** Dois VPs horizontais mais um VP vertical (acima ou abaixo do horizonte). Linhas verticais convergem para o terceiro VP.

**"Vanishing Point at Infinity":** Cada VP individual pode ser configurado para estar **no infinito matemático**, o que transforma aquela família de linhas em paralelas (sem convergência). Isso permite criar perspectiva isométrica verdadeira usando a Perspective Ruler: 2 VPs horizontais no infinito criam linhas horizontais paralelas, mais um VP vertical no infinito cria verticais paralelas.

**Fixar a posição do VP:** Os VPs podem ser bloqueados numericamente (impedindo movimento acidental), configurar snap de 5° em 5° durante o posicionamento.

**Régua de Perspectiva Olho-de-Peixe (Fisheye Perspective):** Cria uma grade curvilínea. Os parâmetros incluem: posição do centro da projeção (zenith), raio da projeção (controla o FOV efetivo), visibilidade de linhas horizontais vs. verticais da grade.

### Régua de Figura (Figure Ruler)

Cria formas geométricas como réguas: Elipse, Círculo, Retângulo, Polígono regular (com número de lados configurável). Os traços feitos próximos à forma se alinham a ela. Uma elipse definida como régua age como um gabarito de elipse, permitindo desenhar linhas que seguem perfeitamente a curvatura elíptica.

### Régua de Simetria (Symmetry Ruler)

Funciona como a Symmetry Guide do Procreate, mas com mais opções: Simetria vertical, horizontal, diagonal, radial (com número de segmentos configurável).

### Controles Globais das Réguas no CSP

- **Show Ruler** (ícone de régua no painel de camadas): mostra ou oculta todas as réguas visualmente
- **Snap to Ruler** (no menu View ou barra de ferramentas): ativa/desativa o snapping global
- **Snap intensity:** configurável em preferências — "Soft Snap" (o traço é atraído mas pode desviar) vs. "Hard Snap" (o traço segue a régua rigidamente)
- **Layer Range:** cada régua pode ser configurada para afetar "Only this layer", "All layers" ou "All layers of same color"

---

## 2.2 Krita — Drawing Assistants (Assistentes de Desenho)

**Fonte: docs.krita.org/en/reference_manual/tools/assistant.html**

No Krita, as réguas são chamadas de **Drawing Assistants** e são gerenciadas pela **Assistant Tool** (ícone de régua na caixa de ferramentas, ou tecla 'E' por padrão dependendo do mapeamento).

### Arquitetura dos Assistentes

Cada assistente é uma **entidade geométrica independente** posicionável no canvas. Diferente do CSP onde réguas ficam em Ruler Layers, os assistentes do Krita existem em um nível de documento separado das camadas — eles afetam todas as camadas quando o snapping está ativo.

**Adição:** Clicar com o Assistant Tool no canvas cria um assistente do tipo selecionado. A maioria requer clicar em 2-4 posições para definir a geometria.

**Edição:** Handles (alças) visíveis em cada assistente permitem reposicionar. Um handle especial (geralmente um quadrado no centro ou em posição específica) deleta o assistente ao ser clicado.

**Visibilidade:** Cada assistente pode ser oculto individualmente; há também um controle global.

### Snapping Global e Strength

O parâmetro mais importante e que diferencia o Krita do CSP: o slider **"Snap to Assistant"** nas Tool Options da Assistant Tool controla a força de atração de **0% a 100%**. Em 100%, o traço segue perfeitamente o assistente. Em 50%, o traço é puxado para o assistente mas ainda responde parcialmente ao movimento real da mão. Isso permite fazer traços que se aproximam da geometria sem serem rigidamente constrangidos — útil para linhas orgânicas que seguem uma perspectiva mas mantêm alguma expressividade.

### Ruler (Régua Simples)

Um segmento de linha com dois pontos que se estende infinitamente. Qualquer traço nas proximidades se torna uma linha reta ao longo daquela direção.

### Infinite Ruler

Similar ao Ruler, mas a snap é para linhas paralelas ao segmento definido, não necessariamente coincidentes com ele. Funciona como uma régua paralela.

### Parallel Ruler

Equivalente ao CSP's Parallel Ruler: todos os traços ficam paralelos ao ângulo definido.

### Vanishing Point

Define um único VP. Todos os traços convergem para ele. O VP pode ser posicionado fora do canvas (valores negativos ou além das dimensões do documento nos handles são válidos).

### Two Point Ruler

Define dois VPs (esquerdo e direito) na mesma linha do horizonte. Alterna automaticamente entre eles dependendo de qual lado do canvas o traço começa.

### Ellipse

Define uma elipse como assistente. O traço se alinha à curvatura da elipse.

### Concentric Ellipse

Dois handles definem o centro e um ponto na borda de uma família de elipses concêntricas. O traço se alinha à elipse mais próxima dentro da família.

### Spline (Curva Spline)

Este é um assistente exclusivo do Krita sem equivalente direto no CSP. São necessários **4 pontos de controle** que definem uma curva Catmull-Rom ou Bézier cúbica. O traço se alinha ao longo dessa curva. A diferença para uma régua de curva simples (que constrainge o traço a ficar NA curva) é que a Spline é mais intuitiva para definir: os 4 pontos são colocados livremente e a curva passa pelos pontos extremos passando perto dos intermediários.

### Fisheye Point

Define um assistente de perspectiva olho-de-peixe. Requer 3 pontos: centro, e dois pontos na "borda" que definem o tamanho da projeção. Cria uma grade de linhas curvas. Múltiplos Fisheye Point assistants podem ser combinados para criar perspectivas de 4 e 5 pontos.

### Mesh Transform Assistant

Cria uma grade deformável que atua como assistente. O traço se alinha ao grid deformado, permitindo desenhar sobre superfícies curvadas de forma consistente. Útil para texto ou padrões sobre superfícies não-planas.

---

# 3. MÚLTIPLOS MOTORES DE PINCEL (KRITA)

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/**

## Arquitetura do Brush Editor do Krita

O **Brush Editor** (F5) é o centro de configuração de pincéis. No topo há um seletor de **Brush Engine** — a escolha do engine muda completamente quais parâmetros são exibidos. Cada engine é literalmente um sistema diferente de renderização de pincel com lógica interna própria.

---

## 3.1 Pixel Brush Engine

O engine padrão, análogo ao sistema de pincéis do Procreate. Usa um **brush tip** (ponta do pincel — pode ser circular, predefinida ou importada como bitmap), espaçado ao longo do traço.

**Parâmetros principais (disponíveis em abas no editor):**

**Brush Tip (Ponta):**
- **Auto:** gera a ponta matematicamente com parâmetros de suavidade, forma circular/elíptica, ângulo, espalhamento de bristles (simulação básica de cerdas na ponta)
- **Predefined:** usa bitmaps pré-carregados como stamp
- **Custom:** permite desenhar a ponta no editor embutido com gradiente de escala de cinza (branco = opaco, preto = transparente)
- **Text:** usa texto renderizado como ponta de pincel

**Opacity, Size, Spacing, Softness, Rotation, Mirror:** todos com sensores (veja seção de sensores abaixo)

**Sistema de Sensores (Sensors) — O que diferencia o Krita:**
Cada parâmetro numérico no Krita pode ter uma **curva de sensor** que mapeia qualquer **input** ao parâmetro. Inputs disponíveis: **Pressure** (pressão), **X Tilt** (inclinação X), **Y Tilt** (inclinação Y), **Speed** (velocidade), **Drawing Angle** (ângulo do traço), **Rotation** (rotação do lápis), **Distance** (distância percorrida), **Time** (tempo), **Fuzzy Dab** (aleatório por stamp), **Fuzzy Stroke** (aleatório por traço).

Isso significa que, por exemplo, a **opacidade** pode ser controlada simultaneamente por pressão E por inclinação do lápis, com curvas independentes para cada, combinadas. O Procreate permite controle de pressão e inclinação, mas não essa **combinação de múltiplos inputs** com curvas customizadas para cada parâmetro.

---

## 3.2 Color Smudge Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/color_smudge_engine.html**

Este engine não apenas mistura cores — ele tem um modelo físico de como tinta se comporta na superfície.

**Modo Smearing (Esfumar):**
O engine **amostra pixels da região do canvas** sob o brush tip e os arrasta na direção do traço. A cor do pincel entra na mistura com base no parâmetro **Color Rate** (taxa de cor nova vs. cor do canvas). Matematicamente: \(C_{output} = lerp(C_{canvas}, C_{brush}, \text{colorRate})\) onde o lerp é aplicado pixel a pixel dentro do stamp.

**Modo Dulling (Entorpecimento):**
Diferente do smearing, o dulling coleta a cor média da área sob o brush tip e mistura com a cor do pincel. Simula a situação de um pincel carregado que "suja" a cor da tela na mistura. Parâmetro **Smudge Radius** define o tamanho da área amostrada para o cálculo da média.

**Paint Thickness (Hue, Saturation, Value para espessura):** O engine pode usar o canal de altura (conceitual) para simular impasto básico.

**Overlay Mode:**
- **Overlay**: o brush tip transparente deixa a cor do canvas aparecer através
- **No Overlay**: o brush tip é opaco

---

## 3.3 Hairy Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/hairy_brush_engine.html**

Este engine simula um pincel com **cerdas individuais fisicamente independentes**.

**Parâmetros técnicos:**

- **Bristles Count**: número de cerdas simuladas (afeta performance linearmente — 200 cerdas = 2x mais cálculos que 100)
- **Bristle Ink Amount**: quantidade inicial de "tinta" em cada cerda (0-100)
- **Ink Depletion**: quão rapidamente a tinta de cada cerda se esgota ao longo do traço. Implementado como decaimento: \(ink(d) = ink_0 \cdot e^{-\lambda d}\) onde \(d\) é a distância percorrida e \(\lambda\) é o coeficiente de depleção
- **Use Saturation for Depletion**: à medida que a tinta depleta, a saturação diminui (a cor "desvanece"), simulando tinta que fica aquosa
- **Use Opacity for Depletion**: a opacidade diminui com a depleção
- **Bristle Length**: distribuição de comprimento das cerdas (uniform, Gaussian)
- **Bristle Sharpness**: variação no comportamento individual das cerdas (cerdas muito diferentes umas das outras)
- **Scale Mouse Pressure** / **Random Offset**: variação adicional com pressão
- **Threshold**: opacidade mínima abaixo da qual uma cerda se torna invisível (evita cerdas fantasmas de baixa opacidade)

**Como as cerdas são renderizadas:** Cada cerda é tratada como um ponto independente com posição, cor e quantidade de tinta. Ao mover o pincel, cada ponto é deslocado na direção do traço mais um offset perpendicular baseado na posição da cerda no brush tip. O resultado é que pincéis com baixas bristle counts produzem traços esparsos e texturizados, enquanto counts altos produzem traços densos e suaves.

---

## 3.4 Sketch Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/sketch_brush_engine.html**

Gera linhas auxiliares automáticas que simulam o comportamento de um artista que faz hachuras e conexões enquanto esboça.

**Parâmetros:**

- **Line Count**: número máximo de linhas auxiliares que podem emanar de um único stamp
- **Offset**: raio máximo a partir do traço principal onde as linhas auxiliares podem terminar
- **Probability**: chance (0-100%) de que cada linha auxiliar seja desenhada em cada stamp
- **Magnetism**: força com que as linhas auxiliares são atraídas para intersecções com traços existentes. Em magnetismo alto, as linhas auxiliares tendem a terminar exatamente nas intersecções com linhas anteriores, criando um efeito de crosshatching conectado.
- **Connect Lines**: quando ativo, tenta conectar o final das linhas auxiliares a traços próximos existentes

**Comportamento técnico:** Para cada stamp da pincelada, o engine detecta traços pré-existentes dentro do raio de Offset e tenta traçar linhas do stamp até esses traços (com base na probabilidade). Isso cria automaticamente hachuras cruzadas e conexões orgânicas entre linhas.

---

## 3.5 Spray Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/spray_brush_engine.html**

Gera múltiplas partículas por stamp, criando efeitos de spray, dispersão de poeira, neve, confetti, etc.

**Parâmetros técnicos:**

- **Spray Diameter**: diâmetro da área de spray
- **Object Count**: número de partículas por stamp
- **Object Size (Min/Max)**: tamanho mínimo e máximo de cada partícula, com distribuição configurável
- **Shape**: cada partícula pode ser um Pixel (ponto), Ellipse, Rectangle, Spray Brush Tip (ponta do pincel customizada)
- **Distribution**: como as partículas se distribuem na área de spray — **Uniform** (distribuição uniforme aleatória), **Curvilinear** (distribuição gaussiana centrada no centro), **Line** (distribuição ao longo de uma linha), **Random**
- **Angular Distribution**: como a distância do centro afeta a concentração (permite spray mais denso no centro ou nas bordas)
- **Jitter of Color/Hue/Saturation/Value**: variação de cor entre partículas. Parâmetro **HSV Jitter** permite partículas com diferentes hues, saturações e valores dentro de um intervalo ao redor da cor selecionada.
- **Particle Count Jitter**: variação aleatória no número de partículas por stamp

---

## 3.6 Particle Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/particle_brush_engine.html**

Simula partículas com **física de movimento** — gravidade, vento, atração. É o único engine que tem simulação física verdadeira.

**Parâmetros de física:**

- **Particles**: número de partículas lançadas por stamp
- **Particle Length**: comprimento da trilha de cada partícula (rastro visual)
- **Gravity**: aceleração na direção Y (positivo = desce, negativo = sobe). Com gravidade alta, as partículas "caem" após serem lançadas.
- **Iterations**: quantas vezes a física é calculada por stamp (mais iterações = partículas percorrem mais distância = rastros mais longos)
- **Initial Speed/Velocity**: velocidade inicial das partículas ao serem lançadas
- **Direction**: ângulo de lançamento. "Tangent" = lançado na direção do traço. "Fixed" = sempre no mesmo ângulo. "Random" = aleatório.

**Modelo físico:** Cada partícula segue: \(\vec{v}(t+dt) = \vec{v}(t) + \vec{g} \cdot dt\), \(\vec{x}(t+dt) = \vec{x}(t) + \vec{v}(t) \cdot dt\) onde \(\vec{g}\) é o vetor de gravidade. A trilha é renderizada como uma linha entre posições consecutivas.

---

## 3.7 Deform Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/deform_brush_engine.html**

Deforma pixels existentes durante a pintura, análogo ao Liquify do Procreate mas como um pincel persistente.

**Modos de deformação:**

- **Move**: desloca pixels na direção do traço. Funcionamento: cada pixel dentro do brush tip é deslocado por um vetor \(\vec{d}\) proporcional à velocidade do traço e ao envelope do brush tip (centro = deslocamento máximo, bordas = deslocamento decrescente por função de falloff)
- **Grow**: expande pixels para fora do centro do pincel. Cada pixel é movido radialmente para fora do centro do brush tip: \(\vec{d} = k \cdot (\vec{p} - \vec{c}) / |\vec{p} - \vec{c}|\) onde \(\vec{c}\) é o centro e \(k\) é a intensidade
- **Shrink**: contrai pixels em direção ao centro (inverso do Grow)
- **Rotate**: rotaciona pixels ao redor do centro do pincel no sentido horário ou anti-horário
- **Swirl (CW/CCW)**: vórtice — pixels em torno do centro giram progressivamente mais quanto mais próximos do centro, criando um efeito de redemoinhos
- **Color**: não deforma posição — aplica a cor atual como pincel normal (modo de transição para outros efeitos)

---

## 3.8 Tangent Normal Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/tangent_normal_map_brush_engine.html**

Projetado especificamente para **pintura de Normal Maps** — texturas usadas em renderização 3D que codificam a orientação da superfície.

**Fundamento técnico:** Um normal map armazena vetores normais de superfície como valores RGB. Por convenção: X (direita) = R, Y (cima) = G, Z (frente/fora) = B. Um pixel com valor (128, 128, 255) representa uma normal apontando diretamente para frente (sem inclinação). Uma normal apontando para a direita seria (255, 128, 128).

O Tangent Normal engine garante que os valores RGB pintados são **matematicamente corretos** para a orientação do traço. Se você pinta na direção direita, ele pinta valores de normal que representam uma superfície inclinada para a direita. Se pinta na direção diagonal, a normal é diagonal. Isso permite criar ilusão de relevo em superfícies planas sem modelagem 3D.

**Parâmetros:**
- **Strength**: intensidade do efeito
- **Offset X/Y**: desvio manual dos valores de normal
- **Use Surface Tilt**: usa a inclinação do lápis para influenciar a direção da normal

---

## 3.9 Chalk Brush Engine (Soft Brush com variantes)

Usa fórmulas matemáticas para gerar a ponta do pincel em vez de bitmaps — a ponta é computada matematicamente como uma função de suavidade radial, permitindo bordas extremamente suaves e controladas.

---

## 3.10 Grid Brush Engine e Clone Brush Engine

**Grid Brush:** Pinta em padrão de grade — cada stamp é colocado em posições de grade regulares, com configuração de espaçamento horizontal e vertical. Produz efeitos de mosaico, pixels art, padrões xadrez.

**Clone Brush (Clones Engine):** Amostra de um **source point** (ponto de origem) e pinta esse conteúdo na posição atual. Similar ao Clone Stamp do Photoshop. Parâmetros: **Sample merged** (amostra de todas as camadas ou apenas a ativa), **Healing mode** (suaviza a transição nas bordas do clone, como Healing Brush).

---

# 4. SIMULAÇÃO DE FÍSICA DE FLUIDOS — ADOBE FRESCO LIVE BRUSHES

**Fonte: helpx.adobe.com/fresco/using/live-brushes.html, Adobe Research publications on fluid simulation in painting**

## Fundamento Científico: A Física de Aquarela Real

Para entender por que a simulação do Fresco é tecnicamente avançada, é necessário entender o que está sendo simulado:

A aquarela funciona através de **interações físico-químicas** entre pigmento, água, e papel. Os fenômenos relevantes incluem capilaridade (absorção de água pelas fibras de celulose), difusão de pigmento na solução aquosa, fluxo convectivo de fluido (movimento de água por gradiente de pressão), deposição de pigmento nas fibras quando a água evapora, efeito de backflow (quando água nova encontra uma área semi-seca, o pigmento da área seca "reflui" — cria o efeito "cauliflower" ou "bloom"), e deposição de pigmento nas bordas quando o fluido seca (a "linha de maré").

A equação completa para simulação fiel seria as **Equações de Navier-Stokes** para fluido viscoso incompressível, combinadas com equações de difusão-reação para o transporte de pigmento. Isso é computacionalmente inviável em tempo real para uma tela de alta resolução.

---

## 4.1 A Abordagem da Adobe no Fresco

Adobe não publicou os detalhes exatos do algoritmo (propriedade intelectual), mas com base nas descrições de Adobe Research e no comportamento observado, a implementação usa um modelo simplificado de física de fluidos, provavelmente baseado em **simulação de autômato celular** (cellular automaton) ou em **Lattice Boltzmann Method (LBM)**, que são aproximações eficientes das equações de Navier-Stokes para fluidos em grades discretas.

**Grid de Simulação:** O canvas é dividido em uma grade de células. Cada célula armazena: quantidade de água (water level), concentração de pigmento, grau de saturação das fibras de papel (quanto papel já absorveu), estado seco/molhado.

**A cada frame de pintura, o sistema calcula:**

1. **Fluxo de água:** A água flui das células com maior nível para células adjacentes com menor nível (gradiente de pressão hidrostática). A taxa de fluxo é proporcional à diferença de nível e inversamente proporcional à viscosidade do fluido.

2. **Transporte de pigmento:** O pigmento é transportado com a água que flui. A concentração de pigmento em cada célula muda proporcionalmente ao fluxo de água entrando e saindo.

3. **Absorção:** As fibras de papel absorvem água a uma taxa proporcional ao nível de água presente e ao quanto já estão saturadas. Uma vez saturadas, a absorção cessa.

4. **Deposição de pigmento:** Quando a água é absorvida pelas fibras, o pigmento junto com ela é depositado. O pigmento depositado permanece mesmo após a água "evaporar" (a evaporação é simulada como redução gradual do nível de água ao longo do tempo).

5. **Edge darkening:** Células nas bordas da área molhada têm mais fluxo de saída do que de entrada, concentrando o pigmento. Isso cria naturalmente a linha escura característica de bordas de aquarela.

---

## 4.2 Parâmetros do Live Watercolor e Seus Efeitos Físicos

**Water (Água) — slider 0-100%:**
Controla a quantidade de água adicionada ao canvas com cada pincelada. Água alta: pigmento se espalha mais, bordas mais difusas, mais interação com áreas adjacentes molhadas. Água baixa: pigmento fica mais concentrado onde foi aplicado, bordas mais definidas.

**Paint (Tinta/Pigmento) — slider 0-100%:**
Concentração de pigmento no pincel. Alta pigmentação com água baixa = traço denso e escuro. Baixa pigmentação com água alta = lavagem sutil.

**Flow (Fluxo):**
Taxa com que a água do pincel flui para o canvas. Flow alto = a água se espalha imediatamente em um raio maior. Flow baixo = a água permanece concentrada na área de contato do pincel.

**Wet Paint Area:**
Define o raio ao redor do traço atual considerado "molhado" para fins de interação. Área maior = mais área do canvas pode interagir com a nova pincelada (mais blooms e misturas). Área menor = a nova pincelada interage somente com o que está imediatamente abaixo.

**Mix:**
Controla o quanto o pincel **levanta** pigmento já depositado ao passar por cima. Mix alto = o pincel rearraneja a tinta como um pincel molhado em tinta fresca. Mix zero = o pincel só deposita, não levanta.

**Dry (Secar):**
Um botão (não slider). Ao pressionar, toda a área molhada no canvas é imediatamente "seca" — o estado atual de pigmento é fixado e o canvas retorna ao estado completamente seco. Isso permite pintar sobre camadas de aquarela sem que a nova tinta interaja com a antiga.

---

## 4.3 Parâmetros do Live Oil e Seus Efeitos Físicos

**Load (Carga de Tinta):**
Quantidade de tinta carregada no pincel. Carga alta = traços iniciais mais opacos e espessos. À medida que pinta, a carga vai sendo depositada no canvas e o pincel fica mais "seco".

**Viscosity (Viscosidade):**
Controla a resistência da tinta ao fluxo. Alta viscosidade: a tinta mantém as marcas do pincel (brush strokes visíveis, impasto preservado). Baixa viscosidade: a tinta se espalha e nivelar, como óleo muito diluído.

**Mix:**
Quanto a cor do canvas é incorporada à cor do pincel enquanto pinta. Mix 100% = o pincel constantemente mistura com o que está embaixo, como pintar em tinta fresca. Mix 0% = o pincel deposita sua cor sem pegar cor do canvas.

**Cleanup:**
Taxa com que o pincel "limpa" ao longo do traço — afeta quanto a cor do pincel muda quando passa por áreas de cor diferente. Cleanup alto = a cor do pincel muda rapidamente ao encontrar outras cores (comportamento de pincel físico que mistura). Cleanup baixo = a cor do pincel permanece constante mesmo ao passar por cores diferentes.

**O Canal de Altura (Impasto):**
O Live Oil mantém internamente um **mapa de altura** do canvas — além dos canais RGB de cor, existe um canal Z que representa a espessura da tinta. Este canal é usado para renderização em tempo real: aplica-se um cálculo de normal map aproximado ao mapa de altura, e a iluminação é calculada com base nessas normais. O resultado visual são as marcas de textura de pincel visíveis como relevo iluminado.

---

# 5. FERRAMENTA DE GRADIENTE DEDICADA

## 5.1 Infinite Painter — Gradient Tool

**Fonte: Documentação Infinite Painter, Community Wiki**

### Tipos de Gradiente

**Linear:** Define dois pontos (início e fim). A cor interpola linearmente ao longo do eixo entre os dois pontos. Todos os pixels perpendiculares ao eixo têm a mesma cor.

**Radial:** Define um ponto central e um ponto de borda. A cor interpola radialmente a partir do centro. Todos os pixels a uma mesma distância do centro têm a mesma cor.

**Angular (Cônico):** A cor interpola ao longo do ângulo ao redor de um ponto central. Cria um efeito de cone de cor.

**Diamond:** Semelhante ao radial, mas com equidistância calculada pela norma L1 (distância Manhattan) em vez de L2 (Euclidiana), criando formas de losango.

### Color Stops (Pontos de Cor)

O editor de gradiente permite adicionar múltiplos **color stops** — cada um define a cor em uma posição específica (0% = início, 100% = fim). Entre os stops, a interpolação pode ser **Linear** (transição suave) ou com **Midpoint** ajustável (um handle que controla onde o "meio" da interpolação entre dois stops está — movê-lo para um lado acelera a transição naquela direção).

Cada color stop tem: **Position** (0-100%), **Color** (com seletor completo de cor), **Opacity** (opacidade independente por stop).

### Handles On-Canvas

O diferencial da Gradient Tool é que os pontos de controle são visíveis e arrastáveis diretamente no canvas em tempo real. Pode-se reposicionar o início, fim e ângulo do gradiente enquanto vê o resultado instantaneamente.

### Apply Mode

O gradiente pode ser aplicado em qualquer **Blend Mode** disponível no app, não apenas em Normal. Isso permite, por exemplo, aplicar um gradiente radial em modo Multiply para escurecer apenas uma área circular.

---

## 5.2 Krita — Gradient Tool

**Fonte: docs.krita.org/en/reference_manual/tools/gradient.html**

Krita também tem uma Gradient Tool dedicada com tipos **Linear, Bilinear, Radial, Square, Conical, Spiral, Reverse Spiral, Shaped**.

O tipo **Shaped** é único: segue o formato das bordas da seleção ativa, criando gradientes que "encaixam" dentro de formas complexas — análogo ao Gradient Tool do Photoshop com "Contour" mas mais automático.

O **Gradient Editor** (acessível ao clicar no gradiente nas opções) permite criar e salvar gradientes com stops de cor e opacidade independentes, tipo de interpolação por segmento (Linear, Curved, Constant), e modo de repetição (None, Forward, Reverse, Alternating) para gradientes que se repetem além dos pontos de controle.

---

## 5.3 Por Que o Procreate Não Tem

A ausência de uma Gradient Tool no Procreate é frequentemente discutida na comunidade. O workaround comum envolve: criar uma faixa de cor com a Airbrush Soft, ou usar o ColorDrop com Gaussian Blur, ou criar duas camadas de cor sólida e usar uma máscara com gradiente desenhado manualmente. Nenhum desses métodos oferece os handles interativos nem o controle de color stops de uma ferramenta dedicada.

---

# 6. FILTROS NÃO-DESTRUTIVOS E FILTER MASKS (KRITA)

**Fonte: docs.krita.org/en/reference_manual/layers_and_masks/**

## Fundamento: Destrutivo vs. Não-Destrutivo

**Processamento destrutivo** (modelo do Procreate): Um ajuste modifica os valores de pixel diretamente e permanentemente. Após aplicar Gaussian Blur no Procreate e salvar, os pixels borrados substituem os originais. Para "desfazer", só é possível via histórico de undo (que é limitado e se perde ao fechar o arquivo).

**Processamento não-destrutivo** (modelo do Krita, Photoshop): O ajuste é armazenado como **metadado/instrução** separado dos pixels originais. Os pixels originais existem em uma camada; uma camada de ajuste acima contém apenas a instrução do que fazer com eles. A imagem exibida é o resultado calculado em tempo real. Os pixels originais nunca são modificados.

---

## 6.1 Filter Layers (Camadas de Filtro)

Uma **Filter Layer** no Krita é criada via: Layer > Add New Layer > Filter Layer.

Ao criar, um dialog abre com todos os filtros disponíveis (organizados em categorias: Blur, Adjust, Artistic, Edge Detection, Emboss, Enhance, Map, etc.). Seleciona-se o filtro e configura-se seus parâmetros. A filter layer aparece na pilha de camadas como qualquer outra, mas com um ícone de filtro.

**Efeito:** A filter layer afeta **todas as camadas abaixo dela** que estão no mesmo grupo (ou no nível global se não estiver em grupo). Isso é análogo a um Adjustment Layer do Photoshop.

**Re-edição:** Double-click na filter layer reabre o dialog de configuração do filtro com os parâmetros anteriores. Pode-se alterar o filtro ou seus parâmetros a qualquer momento, even depois de semanas ou versões do arquivo.

**Masking de Filter Layers:** Qualquer filter layer pode ter uma máscara de transparência (Paint Layer Mask). A máscara é uma imagem em escala de cinza onde **branco = filtro aplicado, preto = filtro não aplicado**. Isso permite que o filtro afete apenas uma parte da imagem — por exemplo, um Gaussian Blur afetando apenas o fundo mas não o personagem em frente.

---

## 6.2 Filter Masks (Máscaras de Filtro)

Diferente das Filter Layers (que afetam camadas abaixo), uma **Filter Mask** é um efeito **vinculado a uma camada específica** e afeta apenas ela.

**Criação:** Right-click na camada alvo > Add > Filter Mask.

Uma filter mask aparece como um sub-item abaixo da camada pai no painel de camadas. Tem seu próprio thumbnail de máscara (começa todo branco = filtro aplicado em toda a camada).

**Configuração:** Double-click no ícone da filter mask abre o dialog de seleção/configuração de filtro.

**Máscara de Aplicação:** A filter mask tem um canal de opacidade que funciona identicamente ao de uma máscara de camada. Selecionar a filter mask na pilha e pintar com preto protege aquelas áreas do efeito; pintar com branco expõe ao efeito; tons de cinza criam aplicações parciais.

**Exemplo prático:** Aplicar Gaussian Blur em uma filter mask em uma camada de personagem, depois pintar preto sobre o rosto do personagem na máscara = somente o fundo/corpo do personagem fica borrado, o rosto permanece nítido. E isso pode ser ajustado a qualquer momento.

---

## 6.3 Clone Layers e Transform Masks

**Clone Layer:** Uma camada que é uma cópia não-destrutiva de outra. Qualquer mudança na camada original é automaticamente refletida na clone layer. As clone layers podem ter suas próprias filter masks, permitindo aplicar filtros diferentes à mesma fonte de pixels.

**Transform Mask:** Aplica uma transformação (escalar, rotacionar, mover, Warp) **de forma não-destrutiva**. A transformação pode ser ajustada a qualquer momento sem perda de qualidade. Exemplo: escalar uma camada em 500% e depois reduzir de volta sem degradação intermediária.

---

## 6.4 Adjustment Layers no CSP (Bônus)

O CSP também tem camadas de ajuste não-destrutivas, chamadas **Correction Layers**:

**Tipos disponíveis:** Brightness/Contrast, Hue/Saturation/Luminosity, Color Balance, Levels, Tone Correction (curvas), Gradient Map, Binarization (binarização em preto e branco com threshold ajustável), Reverse Gradient (inverte os valores da imagem via mapa de gradiente).

**Clipping:** Correction layers no CSP funcionam principalmente como camadas em uma pasta de camadas — afetam as camadas dentro da pasta. Com **Clipping Mask** ativo, afetam apenas a camada diretamente abaixo.

---

# 7. IMPORTAÇÃO DE MODELOS 3D — CLIP STUDIO PAINT

**Fonte: CSP Reference Manual, Seção "3D", tips.clip-studio.com**

## 7.1 3D Drawing Figures (Figuras Articuladas)

### Estrutura do Esqueleto (Rig)

A figura humana no CSP tem um rig completo com as seguintes articulações (joints), todas rotacionáveis:

Cabeça: pescoço (flexão/extensão, rotação, inclinação lateral), cabeça. Tronco: coluna cervical, torácica e lombar (flexão/extensão, rotação lateral, inclinação). Membros superiores: ombros (flexão, abdução, rotação), cotovelos (flexão, pronação/supinação), pulsos (flexão/extensão, desvio radial/ulnar), dedos — cada dedo com 3 falanges individualmente rotacionáveis (metacarpofalângica, interfalângica proximal, interfalângica distal). Membros inferiores: quadris (flexão/extensão, abdução/adução, rotação), joelhos (flexão), tornozelos (dorsiflexão/flexão plantar, inversão/eversão). Os pés têm articulação dos dedos em grupos.

### Controles de Proporção Corporal

Sliders disponíveis para ajuste de proporção: **Head Height** (altura total da figura em número de "cabeças"), **Head Width/Depth**, **Shoulder Width**, **Chest Width/Depth**, **Hip Width/Depth**, **Leg Length** (comprimento proporcional das pernas), **Arm Length** (comprimento proporcional dos braços), **Body Size Scale** (escala geral), **Body Type** (transição de morfologia masculina para feminina com um único slider), **Muscle Detail** (nível de detalhe muscular visível), **Breast Size** (para figuras femininas).

Existem também presets de **Body Type** para diferentes estilos artísticos: realista, mangá, chibi (proporções exageradas de cabeça grande).

### Presets de Pose

O painel **Pose Presets** contém poses pré-definidas categorizadas: Standing (em pé — neutro, relaxado, postura de luta, postura de caminhada), Sitting (sentado — cadeira, chão, seiza), Lying (deitado — costas, barriga, lateral), Action (ação — corrida, salto, soco, chute, postura de magia), e muitas outras. Cada preset pode ser aplicado instantaneamente e depois modificado joint por joint.

### 3D Camera Setup

A câmera 3D tem configuração completa: **Position X/Y/Z** (translação 3D), **Rotation** (pitch, yaw, roll), **Field of View** (em graus — de 10° = telefoto muito comprimida até 120° = grande angular extrema), **Roll** (horizonte inclinado), **Orthographic Mode** (sem perspectiva, linhas paralelas permanecem paralelas).

**Perspectiva via câmera:** ao ajustar o FOV para valores maiores (60°, 90°, 120°), a distorção de perspectiva aumenta dramaticamente, útil para poses dramáticas em primeiro plano. FOV pequeno (20°, 30°) comprime a profundidade, útil para poses de fundo.

### Sub-Tools de 3D Objects

**Rotate Body**: Rotaciona o corpo inteiro como uma unidade (sem alterar pose relativa dos membros)

**Rotate Individual Parts**: Seleciona e rotaciona partes individuais do corpo

**Move Body**: Translada o corpo no espaço 3D

**Scale**: Escala a figura

**3D Object Pan/Zoom**: Movimenta a câmera ao redor da figura

**Rotate Camera**: Orbita a câmera ao redor do objeto

**Focal Point**: Define o ponto de foco da câmera (afeta qual ponto permanece fixo durante o orbit)

### Rendering e Shadow

A figura pode ser exibida em: **Texture rendering** (com textura de pele básica), **Sketch rendering** (exibida como wireframe ou silhueta), **Toon rendering** (sombreamento toon com borda de linha). A iluminação tem um luz direcional ajustável (ângulo e intensidade) que afeta o sombreamento na exibição.

### Importação de Arquivos 3D Externos

**Formatos suportados para importação pelo usuário:** OBJ (Wavefront, com arquivo MTL de materiais), FBX (Filmbox, inclui skeleton para figuras rigged), LWO (LightWave Object), CSP nativo (.cs3o para objetos, .cs3s para cenas completas com câmera, .cs3c para personagens rigged).

**Processo de importação (OBJ/FBX):** File > Import > 3D File. O objeto é posicionado no canvas como uma camada 3D. Pode-se mover, rotacionar e escalar usando as ferramentas de objeto 3D. Materiais são importados do arquivo MTL (para OBJ) ou embarcados (para FBX).

**Clip Studio Assets:** A plataforma oficial de assets do CSP tem uma vasta biblioteca (milhares de assets gratuitos e pagos) de objetos 3D, cenas, móveis, veículos, poses, roupas, etc., todos no formato nativo CSP para importação com um clique.

### Workflow Completo de Uso Prático

1. Abrir painel 3D > arrastar figura humana para o canvas
2. Ajustar proporções corporais com os sliders
3. Aplicar preset de pose + ajustes manuais de joints
4. Posicionar câmera no ângulo desejado, ajustar FOV
5. No painel de camadas, a camada 3D fica separada das camadas de desenho
6. Criar nova camada raster ACIMA da camada 3D
7. Usar a figura 3D como referência para desenhar
8. Após concluir o desenho, ocultar ou deletar a camada 3D

---

# 8. MACROS E AUTO ACTIONS — CLIP STUDIO PAINT

**Fonte: CSP Reference Manual, Seção "Auto Action"**

## 8.1 O Painel de Auto Actions

Acessível via Window > Auto Action. O painel exibe conjuntos de ações (**Action Sets**) que podem ser expandidos para mostrar ações individuais. Ações podem ser organizadas em pastas.

---

## 8.2 Gravação de Ações

**Processo de gravação:**

1. No painel Auto Action, clicar no ícone de novo conjunto (criar um Action Set)
2. Dentro do conjunto, clicar no ícone de nova ação (cria a ação com nome editável)
3. Clicar no botão **"Start Recording"** (círculo vermelho)
4. Executar qualquer sequência de operações no CSP
5. Clicar em **"Stop Recording"** para finalizar

**O que pode ser gravado (lista técnica completa):**

- **Layer operations:** New Layer, Delete Layer, Duplicate Layer, Merge Layer, Flatten, Change Layer Blending Mode, Change Layer Opacity, Lock/Unlock Layer, Alpha Lock
- **Color correction layers:** adicionar qualquer tipo de Correction Layer (Hue/Sat, Levels, Curves, etc.)
- **Filter applications:** todos os filtros do menu Filter (Gaussian Blur, Motion Blur, Sharpen, etc.)
- **Selection operations:** Select All, Deselect, Invert Selection, Select by Color, Expand/Contract selection
- **Transform operations:** Flip Horizontal, Flip Vertical, Rotate 90°, Scale (com valores específicos)
- **Fill operations:** Fill with foreground color, Fill with background color
- **Canvas operations:** Change Canvas Size, Change Resolution
- **Expression Color:** converter camada para tons de cinza, binarizar
- **Export:** gravar uma exportação como parte da ação (útil para batch processing)

---

## 8.3 Execução e Edição

**Execução manual:** Selecionar a ação no painel e clicar em **"Play"** (botão triângulo). A ação executa instantaneamente.

**Execução com dialog:** Clicar no ícone de pausa ao lado de uma sub-ação individual dentro da lista gravada faz com que, durante a execução, o programa pause naquele passo e abra o dialog de configuração daquele ajuste — permitindo que o usuário ajuste os parâmetros naquela etapa específica antes de continuar.

**Edição das sub-ações:** As operações gravadas são listadas como sub-itens abaixo da ação. Cada sub-ação pode ser: reordenada (arrastar), deletada (selecionar + delete), ativada/desativada individualmente (checkbox), e ter seu "pause para configuração" habilitado/desabilitado.

**Não é possível na versão atual:** editar os parâmetros de uma sub-ação sem re-gravá-la; inserir condicionais ou loops (diferente do Photoshop Actions que tem recursos de fluxo mais avançados).

---

## 8.4 Batch Processing com Auto Actions

**File > Batch Process** abre um dialog que permite:

- **Source:** selecionar uma pasta de arquivos de origem (todos os arquivos são processados) ou uma lista de arquivos específicos
- **Destination:** pasta de saída para os arquivos processados
- **Auto Action:** qual ação aplicar a cada arquivo
- **File Format:** formato de saída (PNG, JPEG, TIFF, PSD, etc.) com suas configurações
- **File Name:** regras de nomenclatura dos arquivos de saída

Isso permite, por exemplo, aplicar a mesma paleta de cores, bordas, ou ajustes de resolução a 300 páginas de um mangá de uma só vez.

---

## 8.5 Exportação e Importação de Action Sets

Auto Action Sets são exportados como arquivos **.csac** (CSP Auto Action). A Clip Studio Assets tem uma comunidade ativa que compartilha action sets, com exemplos populares incluindo: ação para criar efeitos de toning (meios-tons de mangá), ação para configurar um documento novo com estrutura de camadas pré-definida, ação para aplicar bordas e marcas de corte para impressão.

---

# 9. WRAP-AROUND MODE PARA TEXTURAS TILEABLE — KRITA

**Fonte: docs.krita.org/en/reference_manual/views.html#wrap-around-mode**

## 9.1 O Que São Texturas Tileable (Seamless Textures)

Uma textura tileable é uma imagem que pode ser repetida lado a lado (tiled) sem que as emendas (seams) sejam visíveis. É fundamental para: texturas de superfície em jogos 3D (materiais de parede, chão, tecido), backgrounds de animação que rolam horizontalmente, padrões de tecido e papel de parede, e assets de arte generativa.

**O problema de criar texturas seamless manualmente:** Ao pintar uma textura em um canvas normal e depois tentar repeti-la, as bordas revelam uma emenda visível — o lado direito da textura não "combina" com o lado esquerdo, e o topo não combina com o fundo.

**A solução tradicional sem Wrap-Around Mode:** Duplicar o canvas, deslocá-lo para testar o seamless, fazer correções manualmente. Isso é tedioso e propenso a erros.

---

## 9.2 Implementação Técnica do Wrap-Around no Krita

**Ativação:** View > Wrap Around Mode (ou Shift+W).

**O que acontece tecnicamente:** O engine de renderização do Krita exibe o canvas em modo de repetição toroidal. Matematicamente, o canvas é tratado como uma superfície de toro: a borda direita está conectada topologicamente à borda esquerda, e a borda superior à borda inferior.

Quando o usuário pinta próximo à borda do canvas, o cálculo da pincel verifica se algum pixel está além da borda e "enrola" esses pixels para o lado oposto do canvas. Formalmente: se o canvas tem dimensões \(W \times H\), e um pixel seria pintado em \((x, y)\), se \(x > W\), o pixel é pintado em \((x \mod W, y)\); se \(y > H\), em \((x, y \mod H)\).

Isso significa que uma pincelada que começa no canvas e atravessa a borda direita continua automaticamente aparecendo na borda esquerda, mantendo o gradiente, textura e direção do traço idênticos — zero emenda.

**Visualização do tile:** Com o Wrap-Around ativo, ao fazer zoom out suficiente, o usuário pode ver as repetições do tile ao redor da área de trabalho principal, verificando como o padrão fica ao ser repetido.

**Pan no modo Wrap-Around:** Ao fazer pan (arrastar a visualização) no canvas com Wrap-Around ativo, o canvas "rola" como um papel de parede infinito, permitindo ver qualquer parte da repetição sem limite.

---

## 9.3 Limitações do Wrap-Around

- Transformações (Scale, Rotate via Transform Tool) **não respeitam automaticamente** o Wrap-Around — uma transformação pode criar descontinuidades nas bordas
- O Liquify/Deform não tem modo Wrap-Around consciente
- Layers com conteúdo que cruzam bordas precisam de atenção ao ser manipulados

---

## 9.4 Workflow Completo para Criação de Textura Seamless no Krita

1. Criar novo documento com dimensões de potência de 2 (ex: 512×512, 1024×1024, 2048×2048) — padrão da indústria de jogos para GPUs
2. Ativar Wrap-Around Mode (Shift+W)
3. Pintar livremente usando qualquer pincel e ferramenta — as bordas são automaticamente seamless
4. Para testar: fazer zoom out para ver as repetições
5. Exportar como PNG transparente ou com fundo
6. A textura pode ser importada diretamente em engines como Unity, Unreal, Blender, sem nenhuma pós-processing de costura

---

# 10. IMPORTAÇÃO DE ÁUDIO PARA ANIMAÇÃO — KRITA

**Fonte: docs.krita.org/en/reference_manual/animation.html**

## 10.1 Por Que Áudio é Essencial para Animação

**Lip-sync (sincronização labial):** Para animar personagens falando, o animador precisa ver a forma de onda de áudio frame a frame para identificar exatamente em qual frame cada fonema ocorre. Sem referência visual de áudio, o processo é estimar contando frames — impreciso e lento.

**Sincronização com música:** Em animação musical ou com trilha, os movimentos precisam coincidir com beats, acentos e frases musicais. A forma de onda de áudio torna esses momentos visíveis na timeline.

**Sound effects timing:** Efeitos sonoros como passos, impactos, e sons de ambiente definem o timing de ações físicas.

---

## 10.2 Implementação no Krita

**Importação de áudio:** No painel de Animation, ir em **Audio > Open Audio** (ou no menu da timeline). O arquivo de áudio é selecionado. Krita suporta os formatos de áudio compatíveis com o **backend de áudio do sistema** (usando libsndfile e a API de áudio do OS): **WAV** (PCM não-comprimido, melhor qualidade), **MP3** (comprimido), **OGG Vorbis** (comprimido open source), **FLAC** (comprimido lossless).

**Exibição da forma de onda:** Uma vez importado, a forma de onda de amplitude do áudio aparece no fundo da **Timeline Docker**. A forma de onda é renderizada como uma representação visual da amplitude ao longo do tempo, sincronizada com a posição dos frames na timeline. A altura vertical dos picos corresponde ao volume do áudio naquele momento.

**Controles de áudio na timeline:**

- **Volume:** slider de volume de reprodução (não afeta o arquivo de áudio exportado)
- **Mute:** silencia a reprodução durante a edição sem remover o arquivo de áudio
- **Audio Offset:** permite ajustar o delay em frames entre o áudio e a animação (para correção de sync)
- **Remove Audio:** desvincula o arquivo de áudio do documento

**Reprodução sincronizada:** Ao pressionar Play na timeline, o áudio é reproduzido em sincronismo com a animação. O cursor de playhead se move pela timeline enquanto o áudio toca, permitindo verificar o sync visualmente e auditivamente ao mesmo tempo.

---

## 10.3 Exportação com Áudio

**Export Video:** Krita usa **FFmpeg** para exportação de vídeo. Ao exportar via File > Export > Export Animation, o dialog inclui opção de incluir o áudio importado na exportação. O FFmpeg embarca a trilha de áudio no arquivo de vídeo final.

**Formatos de vídeo suportados para exportação:** MP4 (H.264), MKV (múltiplos codecs), WebM, GIF (sem áudio), PNG sequence (sem áudio), JPEG sequence (sem áudio).

**Configurações de FFmpeg:** Usuários avançados podem passar parâmetros customizados ao FFmpeg diretamente nas configurações de exportação — por exemplo, bitrate específico, codec de áudio (AAC, Opus, Vorbis), qualidade de compressão de vídeo (CRF).

---

## 10.4 CSP e Áudio

O Clip Studio Paint (versão desktop e EX) também suporta importação de áudio para animação:

**Importação:** Animation > Sound Settings. Suporta WAV e MP3. A forma de onda é exibida na timeline de animação. Funciona de forma similar ao Krita para fins de sincronização.

**Diferença:** O CSP tem uma timeline mais robusta para animação profissional (com suporte a múltiplas trilhas de cel, interpolação básica de poses 3D), tornando o trabalho com áudio mais integrado ao workflow de animação.

---

# 11. PERSPECTIVA CURVILÍNEA DE 5 PONTOS

**Fontes: docs.krita.org, CSP Manual, Infinite Painter Community, "Curvilinear Perspective" por André Barre e Albert Flocon (livro técnico sobre a teoria matemática)**

## 11.1 Fundamento Matemático: Limitações da Perspectiva Linear

A perspectiva linear (1, 2, 3 pontos) é baseada em **projeção central** — um modelo onde a cena 3D é projetada sobre um plano de imagem plano através de um ponto (a câmera/olho). Este modelo é matematicamente correto para campos de visão estreitos (abaixo de ~60°), mas falha para campos de visão mais amplos.

**Por quê:** O olho humano e câmeras com lentes esféricas não projetam sobre um plano — eles projetam sobre uma **superfície curva** (retina ou sensor com distorção de lente). Em perspectiva linear com campo de visão amplo, as bordas da imagem ficam extremamente distorcidas (esticadas), produzindo o efeito de "extremidade de grande angular" que parece irreal.

**A perspectiva curvilínea resolve isso** usando um modelo de projeção diferente: **projeção esférica** ou **projeção cilíndrica**, onde linhas retas no espaço 3D se tornam **arcos de curva** na imagem 2D. Esta é uma representação mais fiel de como o olho humano realmente percebe espaços amplos.

---

## 11.2 Sistemas de Perspectiva Curvilínea

**Perspectiva de 4 Pontos (Cilíndrica):**
As linhas horizontais que convergem para longe no eixo Z do observador se tornam arcos curvos que convergem para dois VPs horizontais. As linhas verticais permanecem retas. O resultado é uma projeção cilíndrica — adequada para panoramas horizontais.

**Perspectiva de 5 Pontos (Esférica / Olho-de-Peixe):**
Todos os grupos de linhas curvilham. Os 5 VPs são: Centro (adiante), Esquerda (lateral esquerda), Direita (lateral direita), Cima (acima), Baixo (abaixo). Cada família de linhas paralelas no espaço 3D se torna uma família de arcos de círculo máximo (great circles) passando pelo VP correspondente. O resultado cobre um campo de visão de ~180° — como uma lente olho-de-peixe.

**Geometria matemática:** Em 5-point curvilinear perspective, um ponto 3D \((X, Y, Z)\) é mapeado para 2D via projeção esférica. Para uma câmera com eixo ao longo de Z:

$$\theta = \arctan\left(\frac{Y}{Z}\right), \quad \phi = \arctan\left(\frac{X}{\sqrt{Y^2 + Z^2}}\right)$$

O ponto 2D é então \((r \sin\phi, r \sin\theta)\) onde \(r\) é o raio da projeção esférica no plano da imagem. Linhas retas em 3D mapeiam para arcos de círculos no plano 2D.

---

## 11.3 Infinite Painter — Perspectiva Curvilínea

**Ativação:** Guides Tool > 5-Point Fisheye Perspective.

A grade de perspectiva exibida mostra: um ponto central (zenith), 4 VPs nos extremos (esquerda, direita, cima, baixo), e linhas curvas que conectam os VPs passando pelo campo da imagem. As linhas se curvam gradativamente à medida que se afastam do centro.

**Snap:** Com o guia ativo e snap habilitado, as pinceladas se alinham aos arcos curvos da grade, permitindo que o artista trace "linhas retas no espaço 3D" que aparecem naturalmente curvadas na perspectiva esférica.

**Configuração:** Tamanho/zoom da grade, opacidade, posicionamento do centro da projeção, capacidade de mostrar/ocultar VPs individuais.

---

## 11.4 Clip Studio Paint — Régua Olho-de-Peixe

**Acesso:** Ruler Tool > Fisheye (tipo de régua no painel de opções).

**Parâmetros do Fisheye Ruler:**
- **Center Point:** posição do centro da projeção na tela (pode ser colocado fora do canvas)
- **Radius:** determina o campo de visão efetivo — raio maior = vista mais ampla = mais curvatura
- **Fisheye Lines:** controla quantas linhas de guia são exibidas (densidade da grade)
- **Visible Horizontal/Vertical Lines:** pode-se mostrar apenas as curvas horizontais, apenas verticais, ou ambas

**Comportamento técnico:** A Fisheye Ruler do CSP cria arcos de círculo que convergem para os VPs. Ao desenhar próximo a qualquer linha da grade com snap ativo, o traço se alinha ao arco de círculo mais próximo.

**Múltiplas Réguas Simultâneas no CSP:**
Uma das vantagens do sistema de réguas do CSP sobre o Infinite Painter é a capacidade de ter múltiplas réguas de tipos diferentes ativas simultaneamente. Por exemplo: uma Fisheye Ruler definindo a perspectiva geral + uma Symmetry Ruler para desenho simétrico + uma Parallel Ruler para hatching — todas ativas ao mesmo tempo.

---

## 11.5 Krita — Fisheye Point Assistant

**Adição:** Assistant Tool > Fisheye Point.

O Fisheye Point do Krita requer **3 pontos de definição**: o ponto central de perspectiva, e dois pontos adicionais que definem a escala/raio da projeção. O resultado é uma grade circular com linhas curvas.

**Perspectiva de 4 pontos com dois Fisheye Assistants:**
Ao combinar dois Fisheye Point assistants com orientações diferentes, cria-se uma perspectiva curvilínea de 4 pontos (panorâmica). O snap funciona para ambos os assistentes simultaneamente — ao começar um traço, o Krita usa o assistente mais próximo para guiar a stroke.

**Perspectiva de 5 pontos com Fisheye + Vanishing Point:**
Combinando dois Fisheye Point assistants (um horizontal, um vertical) + dois Vanishing Point assistants, aproxima-se de uma perspectiva de 5 pontos.

**Limitação do Krita:** A implementação do Krita não tem um único assistente nativo de "5-point perspective" — requer a combinação manual de múltiplos assistentes, o que é menos intuitivo do que a implementação direta do Infinite Painter ou do CSP.

---

## 11.6 Por Que o Procreate Não Tem

O Procreate tem, até minha data de conhecimento, apenas suporte a 1, 2 e 3 pontos de fuga em perspectiva linear. Não há suporte a perspectiva curvilínea nem fisheye. A comunidade do Procreate (procreate.com/discuss) tem threads com pedidos de perspectiva curvilínea desde pelo menos 2019, mas a Savage Interactive não implementou este recurso nas versões documentadas até janeiro de 2025.

---

# SÍNTESE TÉCNICA COMPARATIVA

Para concluir, esta tabela sintetiza a profundidade de implementação de cada funcionalidade:

**Camadas Vetoriais:** CSP tem a implementação mais matura para ilustração (Vector Eraser com intersection erase, line width correction, edição de nós pós-desenho). Krita tem vetores SVG mais compatíveis para intercâmbio. Fresco tem vetores com pipeline Adobe para design profissional.

**Réguas Paramétricas:** CSP tem o sistema mais completo (Parallel, Concentrated, Perspective com VP no infinito, Fisheye, Figure). Krita é competitivo com o assistente Spline exclusivo e o slider de snap strength. Nenhum app de pintura supera CSP neste quesito.

**Motores de Pincel:** Krita é incomparável nesta categoria — nenhum outro app de pintura oferece 13+ engines completamente diferentes. O Particle Brush e o Hairy Brush são únicos no mercado de apps de pintura.

**Física de Fluidos:** Adobe Fresco tem a única simulação de física de fluidos real (mesmo que simplificada) em um app de pintura touch. Nenhum concorrente chega perto na categoria de simulação de aquarela/óleo físico.

**Gradiente Dedicado:** Krita tem a implementação mais completa (8 tipos incluindo Shaped). Infinite Painter tem a mais prática para pintura touch. CSP tem gradiente básico. Procreate não tem.

**Filtros Não-Destrutivos:** Krita lidera com Filter Layers + Filter Masks + Transform Masks + Clone Layers — o pipeline não-destrutivo mais completo entre apps de pintura. CSP tem Correction Layers competitivas.

**Modelos 3D:** CSP é absoluto nesta categoria para apps de pintura — nenhum outro oferece figuras art