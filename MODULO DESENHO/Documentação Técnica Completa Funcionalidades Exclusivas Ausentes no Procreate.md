

# Documentação Técnica Completa: Funcionalidades Exclusivas Ausentes no Procreate

> **Fontes principais:** docs.krita.org, tips.clip-studio.com, helpx.adobe.com/fresco, manuais oficiais do Clip Studio Paint, documentação do Infinite Painter, fóruns oficiais e comunidades técnicas de cada aplicação.

---

## 1. CAMADAS VETORIAIS

### O que são e por que importam

Camadas vetoriais armazenam traços como **caminhos matemáticos** (curvas de Bézier) em vez de grids de pixels. Isso significa que cada linha desenhada é registrada como uma sequência de pontos de controle com propriedades de curvatura, espessura e cor — não como pixels fixos. A consequência prática é que traços vetoriais podem ser redimensionados infinitamente sem perda de qualidade, e cada traço individual permanece editável após ser desenhado.

---

### 1.1 CLIP STUDIO PAINT — Camadas Vetoriais

**Fonte: tips.clip-studio.com/en-us/articles/600, Manual Oficial CSP**

#### Criação e estrutura

Para criar uma camada vetorial no CSP, acessa-se o painel de camadas e seleciona-se **Layer > New Layer > Vector Layer**, ou clica-se no ícone dedicado no painel de camadas (ícone de cubo com uma linha). A camada vetorial é identificada visualmente por um ícone de cubo na miniatura da camada.

Cada traço desenhado em uma camada vetorial é armazenado como um **objeto vetorial independente** composto por: pontos de controle (nós), segmentos de curva entre os nós, e propriedades de traço (espessura, cor, opacidade, forma do pincel).

#### Edição de traços vetoriais — Ferramentas dedicadas

**Object Tool (Ferramenta Objeto):**
Seleciona traços vetoriais inteiros como objetos. Ao selecionar um traço, aparece uma caixa delimitadora (bounding box) com alças para mover, rotacionar e escalar o traço individualmente. Na paleta **Tool Property**, exibe-se: **Brush Size** (permite alterar a espessura do traço após desenhá-lo), **Brush Shape** (permite trocar o formato do pincel usado no traço — por exemplo, mudar de um pincel redondo para um pincel caligráfico sem redesenhar), **Opacity** (alterar opacidade do traço individual), **Blending Mode** do traço, **Anti-aliasing** (nível de suavização), e **Color** do traço. Pode-se também acessar **Duplicate**, **Flip**, e **Transform** do traço individual.

**Correct Line Tool (Ferramenta de Correção de Linha) — Sub-tools:**

- **Control Point (Ponto de Controle):** Permite selecionar e mover pontos de controle individuais de um traço. Ao clicar em um traço, os nós se tornam visíveis como pequenos quadrados. Cada nó pode ser arrastado para uma nova posição, alterando a curvatura do segmento. As **Tool Properties** desta sub-tool incluem: **Add Control Point** (ao clicar em um segmento entre nós, insere um novo ponto de controle), **Delete Control Point** (ao clicar em um nó existente, remove-o e os segmentos adjacentes se reconectam suavemente), **Switch Corner** (alterna um nó entre ponto suave/curvo e ponto de canto/angular — ponto suave mantém tangentes simétricas, ponto de canto permite ângulos agudos).

- **Pinch Vector Line (Comprimir Linha Vetorial):** Permite arrastar um segmento do traço sem selecionar nós individuais. O traço inteiro se deforma organicamente ao redor do ponto onde se arrasta. A intensidade do efeito é controlada pelo parâmetro **Effect Range** (raio de influência — valores maiores afetam uma porção maior do traço de forma mais suave, valores menores criam deformações mais localizadas).

- **Simplify Vector Line (Simplificar Linha Vetorial):** Reduz o número de pontos de controle de um traço mantendo sua forma geral. Útil quando um traço tem nós excessivos (comum ao desenhar rápido). O parâmetro **Simplify** controla a agressividade da simplificação — valores baixos removem poucos nós (mantém fidelidade), valores altos removem muitos (forma mais simples).

- **Connect Vector Line (Conectar Linha Vetorial):** Seleciona duas pontas soltas de traços vetoriais e as une em um único traço contínuo. Parâmetros: **Connect Range** (distância máxima entre pontas para que a conexão seja possível), **Connection Type** (conexão linear reta, curva suave, ou mantendo a tangente dos traços originais).

- **Redraw Vector Line (Redesenhar Linha Vetorial):** Permite redesenhar uma porção de um traço existente. Ao desenhar sobre parte de um traço vetorial, apenas aquela seção é substituída pelo novo traço, mantendo o restante intacto. Parâmetros: **Process Whole Line** (se ativado, substitui o traço inteiro em vez de apenas a seção) e **Start/End** (define se o redesenho começa/termina nos pontos mais próximos do traço original automaticamente).

- **Adjust Line Width (Ajustar Largura da Linha):** Permite "pintar" sobre um traço vetorial para engordar ou afinar partes específicas do traço. Modos: **Thicken** (engrossar), **Narrow** (afinar), **Fix Width** (definir largura fixa). O tamanho do pincel desta ferramenta controla o raio de influência e a intensidade define a velocidade da mudança.

#### Vector Eraser — "Erase Up to Intersection" (Apagar até a interseção)

Esta é uma das funcionalidades mais valorizadas por artistas de lineart. Dentro da borracha, ao usar em uma camada vetorial, existem sub-tools específicas:

- **Vector Eraser (Whole Line):** Apaga o traço vetorial inteiro ao tocá-lo.
- **Vector Eraser (Up to Intersection):** Ao tocar em um segmento de traço que cruza outro traço, apaga **apenas a parte entre a interseção mais próxima e a ponta do traço**, deixando o restante intacto. Na prática, permite fazer lineart com traços que se sobrepõem livremente e depois limpar todas as sobras com toques únicos. O parâmetro **Vector Erase** na Tool Property da borracha oferece as opções: **Erase touched area** (padrão raster), **Whole line** (apaga traço inteiro), **Up to intersection** (apaga até cruzamento).

#### Propriedades adicionais de camadas vetoriais no CSP

**Expressão de cor da camada vetorial:** Pode ser configurada para **Color**, **Gray** ou **Monochrome** (apenas preto e branco, sem anti-aliasing — ideal para mangá destinado a impressão). Vetores em camada monocromática renderizam com bordas 100% nítidas, sem pixels intermediários de anti-aliasing.

**Seleção vetorial por cor/espessura:** A Object Tool pode filtrar seleções por propriedades — selecionar todos os traços de determinada cor ou espessura em uma camada.

**Limitação de vetores no CSP:** Os traços vetoriais aceitam apenas pincéis de tipo "stroke" (traço). Pincéis com efeitos complexos de espalhamento (como aquarela) funcionam de forma limitada ou são convertidos em comportamento simplificado nas camadas vetoriais.

---

### 1.2 KRITA — Camadas Vetoriais

**Fonte: docs.krita.org/en/reference_manual/layers_and_masks/vector_layers.html**

No Krita, camadas vetoriais são baseadas no padrão **SVG (Scalable Vector Graphics)** e no formato **ODG (OpenDocument Graphics)**. Criadas via **Layer > New > Vector Layer**.

**Ferramentas vetoriais do Krita:**

- **Path Tool (Ferramenta de Caminho):** Cria caminhos vetoriais clicando para posicionar nós. Clique simples cria nós de canto (linhas retas entre eles). Clicar e arrastar cria nós de curva (definindo as alças de tangente Bézier). Após fechar o caminho (clicando no primeiro nó), o caminho pode receber preenchimento e contorno.

- **Calligraphy Tool (Ferramenta de Caligrafia):** Cria traços vetoriais com variação de espessura baseada na velocidade e ângulo do traço. Parâmetros: **Width** (largura base), **Thinning** (afinamento com velocidade — valores positivos afinam quando se desenha rápido, negativos engrossam), **Angle** (ângulo fixo da pena caligráfica), **Fixation** (quanto o ângulo é fixo vs. rotaciona com o traço), **Caps** (formato das extremidades: redondo ou plano), **Mass** e **Drag** (simulação de inércia e arrasto da pena).

- **Shape Tool (Ferramenta de Forma):** Cria formas vetoriais predefinidas: retângulo (com cantos arredondáveis), elipse, polígono (número de lados configurável), estrela (número de pontas e raio interno/externo).

- **Edit Path Tool (Editar Caminho):** Seleciona e manipula nós e alças de controle de caminhos existentes. Pode adicionar nós (clicando em um segmento), remover nós (selecionando e deletando), converter entre nó de canto e curva, e separar um caminho em segmentos.

**Propriedades de formas vetoriais no Krita:**

Cada forma vetorial possui: **Fill (Preenchimento)** — pode ser None, cor sólida, gradiente linear, gradiente radial, ou padrão (pattern); **Stroke (Contorno)** — cor, espessura, estilo de linha (sólida, tracejada, pontilhada), caps (butt, round, square), joins (miter, round, bevel); **Opacity** global; e **Transformação** (posição, escala, rotação, inclinação).

**Diferenças em relação ao CSP:** Os vetores do Krita são baseados em SVG e são mais voltados para design e formas geométricas do que para lineart de desenho. Não possui o equivalente ao "Erase up to Intersection" do CSP. A integração com pincéis raster é menos fluida — no Krita, pincéis de pintura funcionam apenas em camadas raster.

---

### 1.3 ADOBE FRESCO — Camadas Vetoriais

**Fonte: helpx.adobe.com/fresco/using/vector-brushes.html**

O Fresco integra pincéis vetoriais herdados do **Adobe Illustrator**. Ao selecionar um pincel vetorial (identificados por ícone de infinito ∞), automaticamente cria-se uma camada vetorial.

**Pincéis vetoriais disponíveis:** Incluem pincéis de Illustrator como Round, Flat, Tapered, Calligraphic, entre outros. Cada traço é armazenado como caminho vetorial com perfil de largura variável.

**Edição vetorial no Fresco:** Os traços vetoriais podem ser selecionados individualmente com a ferramenta **Touch Shortcut + toque no traço**. Uma vez selecionado, pode-se: mover, escalar, rotacionar o traço; alterar a cor; ajustar a espessura; deletar o traço. Para edição avançada de pontos de controle, o Fresco permite enviar o arquivo para o **Adobe Illustrator** via Creative Cloud, editar os vetores com as ferramentas completas do Illustrator, e as alterações sincronizam de volta ao Fresco.

**Mistura de camadas vetoriais e raster:** O Fresco é único em permitir que camadas vetoriais, camadas de pixel e camadas de Live Brushes coexistam em um mesmo documento com interação visual completa (blend modes, opacidade, etc.). A exportação para PSD preserva as camadas vetoriais como Smart Objects editáveis no Illustrator.

---

## 2. RÉGUAS PARAMÉTRICAS POSICIONÁVEIS

Réguas paramétricas são guias interativas que podem ser posicionadas livremente no canvas e que forçam ou influenciam os traços do pincel a seguirem trajetórias específicas.

---

### 2.1 CLIP STUDIO PAINT — Sistema de Réguas

**Fonte: tips.clip-studio.com/en-us/articles/844, Manual CSP seção Rulers**

O CSP possui o sistema de réguas mais completo entre os apps de arte digital. As réguas são **objetos** que ficam vinculados a camadas e podem ser movidos, rotacionados e editados a qualquer momento.

**Ativação e comportamento geral:** Quando uma régua está presente em uma camada, as ferramentas de desenho **automaticamente se alinham (snap)** à régua. O snapping pode ser ativado/desativado globalmente via o ícone de ímã na barra de comandos, ou por régua individual (ativando/desativando a visibilidade da régua). Múltiplas réguas podem coexistir em uma camada, e a mais próxima do cursor assume o controle do snapping.

#### Tipos de réguas:

**a) Linear Ruler (Régua Linear)**
Cria uma linha reta infinita no canvas. Traços feitos próximos a ela se alinham à direção da régua. Para criar: **Ruler Tool > Linear Ruler**. Posiciona-se clicando em dois pontos. Pode ser movida e rotacionada com a Object Tool. Parâmetros: ângulo (pode ser travado em incrementos específicos usando Ctrl/Cmd).

**b) Curve Ruler (Régua Curva)**
Cria uma curva de Bézier no canvas. Os traços se alinham à curva. Para criar: **Ruler Tool > Curve Ruler**. Clica-se para posicionar nós e arrasta-se para definir tangentes. Sub-tool properties: **Curve Type** — pode ser **Spline** (curva suave que passa por todos os pontos), **Quadratic Bézier** (curva com um ponto de controle entre dois nós), **Cubic Bézier** (dois pontos de controle por segmento, máximo controle de curvatura), ou **Straight Line** (conecta pontos com segmentos retos, criando polilinhas). A curva pode ser editada posteriormente com a Object Tool, movendo nós e alças.

**c) Figure Ruler (Régua de Figura)**
Cria formas geométricas como réguas de snap. Sub-tool properties: **Figure Type** — **Ellipse** (elipse posicionável com controle de largura, altura e rotação), **Polygon** (polígono regular com número de lados configurável de 3 a 32), **Rectangle** (retângulo com cantos opcionalmente arredondados com **Corner Radius** ajustável). Ao criar, os parâmetros ficam editáveis. Traços se alinham ao contorno da forma. Pode-se configurar **Aspect Type** para forçar proporções (quadrado perfeito, círculo perfeito).

**d) Ruler Pen (Caneta de Régua)**
Desenha uma forma à mão livre que se torna uma régua. O traço desenhado é convertido em curva vetorial e funciona como régua de snap. Útil para criar guias orgânicas de forma rápida.

**e) Parallel Line Ruler (Régua de Linhas Paralelas)**
Define uma direção, e todos os traços são forçados a serem **paralelos naquela direção**, independentemente de onde são desenhados no canvas. Para criar: define-se a direção com dois cliques. A direção pode ser alterada com a Object Tool. Extremamente útil para desenhar linhas de velocidade em mangá (speed lines) ou chuva.

**f) Parallel Curve Ruler**
Variação da régua curva — os traços se alinham a curvas **paralelas** à régua curva definida. A distância do traço à régua determina o deslocamento da curva paralela. Útil para desenhar contornos equidistantes ou padrões curvos regulares.

**g) Radial Line Ruler (Régua de Linhas Radiais)**
Define um ponto central e todos os traços convergem radialmente para esse ponto. Ideal para: linhas de foco em mangá (concentrating lines/focus lines), raios de luz, padrões radiais. Parâmetros: posição do centro (editável). Pode-se definir um **ângulo de intervalo** para restringir os traços a determinados ângulos radiais.

**h) Concentric Circle Ruler (Régua de Círculos Concêntricos)**
Define um centro e todos os traços se tornam **arcos circulares** centrados naquele ponto. Útil para anéis, órbitas, olhos, e padrões circulares. Parâmetros: posição do centro, e pode ser combinada com a Radial Ruler no mesmo canvas.

**i) Guide Ruler (Régua Guia)**
Similar à Linear Ruler, mas funciona como **guia de referência visual** sem snapping automático. Pode ser usada como referência para alinhamento manual. A diferença é que o snapping é opcional — pode-se configurar para snap ou apenas visual.

**j) Perspective Ruler (Régua de Perspectiva) — Detalhamento completo**

Esta é a régua mais complexa do CSP e merece detalhamento extensivo.

**Criação:** **Ruler Tool > Perspective Ruler**. Ao criar, escolhe-se o modo inicial: **1 Point Perspective** (um ponto de fuga), **2 Point Perspective** (dois pontos de fuga com linha do horizonte), ou **3 Point Perspective** (três pontos de fuga). Também pode ser criada manualmente definindo pontos de fuga com **Add Vanishing Point**.

**Componentes da régua de perspectiva:**
Cada ponto de fuga é representado por um ícone de diamante posicionável. A **linha do horizonte (Eye Level)** conecta os pontos de fuga horizontais e pode ser inclinada. Cada ponto de fuga emite **linhas-guia** infinitas que irradiam em todas as direções — são estas linhas às quais os traços se alinham.

**Comportamento de snap:** Ao desenhar perto de linhas emanando de um ponto de fuga, o traço se alinha a elas. Com múltiplos pontos de fuga, o CSP automaticamente seleciona o ponto de fuga cujas linhas-guia estão mais próximas da direção do traço. Pode-se fixar qual ponto de fuga está ativo clicando no ícone do ponto de fuga para ativar/desativar individualmente.

**Edição:** Com a Object Tool, pode-se: **mover pontos de fuga** individualmente (as linhas-guia se atualizam em tempo real), **mover a linha do horizonte** (rotacionar a cena), **enviar um ponto de fuga ao infinito** (na prática, projeta o ponto tão longe que as linhas se tornam essencialmente paralelas — simulando perspectiva com ponto de fuga muito distante), **adicionar um ponto de fuga** a uma régua existente (transformar 2 pontos em 3 pontos), **deletar um ponto de fuga** (transformar 3 pontos em 2 pontos).

**Múltiplas réguas de perspectiva:** É possível ter **mais de uma régua de perspectiva no mesmo canvas**, em camadas diferentes. Isso permite cenas com múltiplos sistemas de perspectiva (por exemplo, um edifício com uma perspectiva e um objeto em primeiro plano com outra).

**Snap to Grid:** A perspectiva pode exibir uma grade visual que mostra as linhas convergentes, facilitando a visualização do espaço em perspectiva.

**Limitação reconhecida:** O CSP não oferece perspectiva curvilínea (fisheye) nativamente como régua de perspectiva. A perspectiva é sempre retilinear (linhas retas).

---

### 2.2 KRITA — Painting Assistants

**Fonte: docs.krita.org/en/reference_manual/tools/assistant.html**

O Krita implementa réguas como "Assistants" (Assistentes). A filosofia é diferente do CSP — em vez de um sistema de réguas com snap rígido, o Krita oferece assistentes com **snap suave ajustável**.

**Ferramenta de Assistente:** Acessada via **Tool Options > Assistant Tool** na toolbox. Ao selecionar, a parte superior da barra de opções permite escolher o tipo de assistente.

**Controle global de snapping:** O **Brush Tool** possui um slider chamado **Assistant Snapping** (nas Tool Options do pincel) que controla a força do snap de 0% (sem snap — assistentes são apenas visuais) a 100% (snap total — traços se alinham completamente). Valores intermediários (como 60-80%) criam um efeito de "atração magnética" onde o traço tende a seguir o assistente mas permite desvio.

#### Tipos de Assistentes:

**a) Vanishing Point (Ponto de Fuga)**
Coloca um ponto no canvas. Traços próximos são atraídos para convergir naquele ponto. Pode-se colocar múltiplos Vanishing Points no mesmo canvas. Cada um tem um **handle** (alça) central para reposicionamento e **área de influência** visual que mostra onde o snapping atua. Ao colocar dois Vanishing Points, o Krita automaticamente gera uma perspectiva de dois pontos. Ao colocar três, gera perspectiva de três pontos.

**b) Parallel Ruler (Régua Paralela)**
Definida por dois pontos que estabelecem uma direção. Todos os traços dentro da área de influência se alinham a essa direção como linhas paralelas. O assistente pode ser reposicionado e rotacionado.

**c) Concentric Ellipse (Elipse Concêntrica)**
Define uma elipse no canvas (centro + dois raios). Traços se alinham a elipses concêntricas ao redor do centro definido. Parâmetros visuais: três handles — centro, ponto do eixo maior, ponto do eixo menor. A elipse pode ter qualquer proporção e rotação.

**d) Ellipse (Elipse Simples)**
Similar ao Concentric Ellipse, mas os traços se alinham a uma **única elipse** em vez de concêntricas.

**e) Perspective (Perspectiva)**
Definida por **quatro pontos** que formam um quadrilátero. O Krita calcula a grade de perspectiva implícita nesse quadrilátero (como se fosse um plano retangular visto em perspectiva) e os traços se alinham às linhas dessa grade. É diferente do sistema de pontos de fuga do CSP — aqui, define-se visualmente os quatro cantos de uma superfície e o Krita extrapola a perspectiva.

**f) Ruler (Régua Reta)**
Definida por dois pontos. Traços se alinham à linha reta entre os pontos. Funciona como a Linear Ruler do CSP, mas com snap suave.

**g) Spline (Curva Spline)**
Definida por **quatro handles** que formam uma curva cúbica de Bézier. Traços se alinham a essa curva. Os quatro handles são: ponto inicial, ponto final, e dois pontos de controle que definem a curvatura. A spline pode ser editada arrastando qualquer um dos quatro handles.

**h) Fisheye (Olho de Peixe)**
Este é um assistente único do Krita. Define uma **elipse que representa a curvatura do campo de visão fisheye**. Traços dentro da elipse se curvam de acordo com a distorção de lente fisheye. É composto por três handles (equivalentes à elipse). Quando combinado com um **Vanishing Point assistant**, simula perspectiva curvilínea — as linhas que normalmente seriam retas em perspectiva retilinear se curvam de acordo com o efeito fisheye.

**i) Infinite Ruler (Régua Infinita)**
Similar à Ruler, mas a linha se estende infinitamente além dos dois pontos definidos. Traços se alinham à linha em qualquer posição do canvas.

**Funcionalidades adicionais dos assistentes:**

Cada assistente tem uma **área de influência** configurável. Se dois assistentes estão próximos, o snapping é determinado pela proximidade do cursor a cada um. Os assistentes podem ser **movidos**, **editados** (arrastando handles) e **deletados** individualmente. Assistentes podem ser **salvados** e **carregados** como presets. A visibilidade dos assistentes pode ser ocultada sem desativar o snapping.

---

## 3. MÚLTIPLOS MOTORES DE PINCEL (BRUSH ENGINES)

### KRITA — Brush Engines

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines.html**

O Krita é o único app de pintura digital mainstream que possui uma arquitetura de **múltiplos motores de pincel independentes**. Cada engine implementa um algoritmo completamente diferente para gerar marcas no canvas. Enquanto o Procreate, CSP e Fresco utilizam essencialmente uma variação do mesmo sistema (stamp + espaçamento + dinâmicas), o Krita permite que fundamentalmente diferentes abordagens de renderização coexistam.

#### Engine 1: Pixel Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/pixel_brush_engine.html**

O motor padrão, mais similar ao que outros apps oferecem. Funciona com base em **stamp + spacing**: uma imagem (brush tip) é repetida ao longo do traço com um espaçamento definido.

**Parâmetros exclusivos do Pixel Brush:**

- **Brush Tip (Ponta do Pincel):** Pode ser **Auto Brush** (gerado proceduralmente com parâmetros de tamanho, proporção, suavidade, ângulo e picos/spikes), **Predefined Brush** (imagem importada como stamp, formatos .gbr, .gih, .png), ou **Custom Brush** (desenhado pelo usuário). O Auto Brush tem controles para **Diameter** (diâmetro), **Ratio** (proporção largura/altura — 1.0 = circular, <1.0 = achatado), **Fade** (suavidade da borda — 0 = borda dura, 1 = completamente difusa), **Angle** (ângulo de rotação), **Spikes** (número de pontas para criar formas estelares), **Density** (para brushes rasterizados, reduz a quantidade de pixels renderizados criando efeito de dispersão), **Randomness** (aleatoriedade na forma).

- **Brush Tip Image Hose (.gih):** Formato especial que contém **múltiplas variações** de uma ponta de pincel. O Krita cicla entre variações com base em critérios como: posição no traço (incremental), aleatoriedade (random), pressão, velocidade, inclinação. Isso permite que cada stamp no traço seja diferente, criando variação natural.

- **Spacing:** Distância entre stamps como porcentagem do diâmetro. Também possui **Auto Spacing** que ajusta automaticamente com base no tamanho do pincel para manter consistência. **Isotropic Spacing** garante espaçamento uniforme mesmo com pontas achatadas.

- **Mirror:** Espelha a ponta horizontalmente e/ou verticalmente a cada stamp, adicionando variação.

- **Rotation:** A ponta pode rotacionar com base em: ângulo fixo, direção do traço (drawing angle), aleatoriedade, pressão, inclinação do stylus (tilt), rotação do barrel do stylus.

- **Scatter:** Dispersa os stamps perpendicularmente ao traço. Parâmetros: quantidade de scatter e se aplica a ambos os lados.

- **Sensors/Dynamics:** O Krita usa um sistema de **sensores** genérico que se aplica a quase todos os parâmetros do pincel. Cada parâmetro pode ser controlado por: **Pressure** (pressão), **X-Tilt / Y-Tilt** (inclinação), **Speed** (velocidade), **Drawing Angle** (ângulo de desenho), **Distance** (distância desde o início do traço), **Time** (tempo desde o início do traço), **Fade** (decaimento gradual), **Perspective** (distância do centro do assistente de perspectiva), **Tangential Pressure** (pressão tangencial, para stylus com barrel rotation), **Fuzzy Dab / Fuzzy Stroke** (aleatoriedade por dab ou por traço). Cada sensor tem uma **curva editável** que mapeia o valor do sensor ao efeito — por exemplo, pode-se criar uma curva de pressão onde leve pressão dá tamanho mínimo, pressão média aumenta gradualmente, e pressão máxima atinge o tamanho máximo. A curva é totalmente customizável com pontos de controle.

- **Color Source:** De onde o pincel obtém sua cor — **Plain Color** (cor ativa), **Gradient** (usa o gradiente ativo, mapeado por distância, pressão, etc.), **Uniform Random** (cor aleatória do gradiente a cada dab), **Total Random** (cor completamente aleatória), **Pattern** (usa o padrão ativo como textura de cor), **Locked Pattern** (padrão fixo no canvas).

- **Texture (Painting Mode):** Aplica uma textura (pattern) sobre o traço. Diferente de grain no Procreate, a textura é um padrão completo com opções de blend mode próprias (**Multiply**, **Subtract**, etc.), **Strength** (intensidade), **Cutoff** (valores de brilho da textura que são considerados transparentes) e **Scale**.

- **Blending Mode do Pincel:** O pincel individual pode ter seu próprio blend mode, independente da camada.

- **Airbrush mode:** Quando ativado, o pincel continua depositando cor enquanto o cursor permanece parado com o botão pressionado, simulando um aerógrafo real.

---

#### Engine 2: Color Smudge Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/color_smudge_engine.html**

Motor especializado em **mistura de cores** com propriedades de tinta úmida. É o motor que produz os resultados mais "pictóricos" do Krita.

**Parâmetros exclusivos:**

- **Smudge Length (Comprimento do Esfumaço):** Porcentagem de 0 a 1 que controla quanto da cor existente no canvas é carregada pelo pincel. 0 = nenhuma mistura (deposita apenas cor pura), 0.5 = mistura equilibrada, 1.0 = apenas esfumaço sem depositar cor nova.

- **Smudge Radius:** Define de onde o pincel amostra a cor existente. Valores diferentes de 1.0 fazem o pincel amostrar de uma área maior ou menor que sua própria ponta, criando efeitos de distorção.

- **Color Rate (Taxa de Cor):** Quanto de cor nova (foreground color) é adicionada a cada dab. Interage com Smudge Length — se ambos são altos, a cor depositada é uma mistura da cor do pincel e da cor do canvas.

- **Smear vs. Dulling:** Dois modos de mistura fundamentalmente diferentes. **Smear** ("lambuzar") pega a cor de um ponto e a arrasta para o próximo, criando rastros como dedo em tinta molhada. **Dulling** ("amortecer") calcula uma média das cores na área do pincel a cada dab, criando mistura gradual sem arrastamento direcional. Smear é direcional; Dulling é omnidirecional.

- **Overlay mode:** Modo especial onde a cor é aplicada como uma camada translúcida sobre o traço anterior, permitindo glazing.

- **Gradient:** O Color Smudge pode usar um gradiente como fonte de cor, mapeando-o por pressão, distância ou tempo. Combinado com smudge, permite transições de cor orgânicas.

O Color Smudge Engine aceita todos os mesmos controles de Brush Tip, Spacing, Sensors/Dynamics, Texture e outros parâmetros do Pixel Brush Engine.

---

#### Engine 3: Hairy Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/hairy_brush_engine.html**

Simula um pincel com **cerdas individuais**. Cada cerda é rastreada independentemente e reage à pressão, velocidade e ângulo de forma individual.

**Parâmetros exclusivos:**

- **Bristle Options:** **Scale** (tamanho geral do tufo de cerdas), **Random Offset** (variação aleatória na posição de cada cerda), **Density** (número de cerdas — valores altos criam pincéis densos, valores baixos criam pincéis esparsos com cerdas visíveis individualmente), **Shear** (deformação angular do tufo), **Use mouse pressure** (as cerdas se abrem com pressão, como um pincel real pressionado contra a superfície).

- **Ink Depletion (Depleção de Tinta):** Simula a tinta acabando à medida que se pinta. **Ink Amount** (quantidade inicial de tinta), **Soak up ink** (capacidade de absorver tinta do canvas), **Opacity** (como a opacidade diminui conforme a tinta acaba). Quando a tinta acaba, o pincel passa a apenas esfumar as cores existentes, como um pincel seco real.

- **Bristle behavior:** Cada cerda individual pode ter espessura variável, opacidade variável e cor ligeiramente diferente (baseada em jitter de cor), criando traços com variação interna visível — como marcas reais de cerda.

---

#### Engine 4: Sketch Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/sketch_brush_engine.html**

Produz traços que consistem em **múltiplas linhas auxiliares** que se conectam entre pontos do traço e com traços anteriores próximos. O resultado visual se assemelha a um esboço a lápis com linhas sobrepostas e hachuramento orgânico.

**Parâmetros exclusivos:**

- **Line Width:** Espessura das linhas individuais geradas.
- **Offset Scale:** Quão longe as linhas auxiliares se projetam a partir do traço central.
- **Density:** Número de linhas geradas por dab.
- **Simple Mode:** Se ativado, as linhas se conectam apenas entre pontos do traço atual. Se desativado, as linhas se conectam com traços próximos de dabs anteriores, criando uma rede de linhas que se torna mais densa com mais traços — simulando o acúmulo gradual de linhas de esboço.
- **Magnetify:** Ajusta a curvatura das linhas auxiliares.
- **Line Distance / Connection Line:** Controla a distância máxima para que linhas de conexão sejam geradas entre o traço atual e elementos existentes.

---

#### Engine 5: Particle Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/particle_brush_engine.html**

Gera **partículas com simulação de gravidade** que se movem a partir do ponto do cursor. Cada partícula é um ponto que traça seu próprio caminho sob influência de forças físicas simuladas.

**Parâmetros exclusivos:**

- **Particles:** Número de partículas emitidas por dab.
- **Gravity (Gravidade):** Força e direção da gravidade que afeta a trajetória das partículas.
- **Weight (Peso):** Peso das partículas, afetando a resposta à gravidade.
- **Drag (Arrasto):** Resistência ao movimento, faz as partículas desacelerarem.
- **Iterations (Iterações):** Quantos passos de simulação cada partícula executa — mais iterações = trajetórias mais longas.
- **Scale (Escala):** Tamanho das marcas das partículas.

O resultado são traços que se decompõem em trilhas de partículas como fios, cabelo, fumaça, ou efeitos de dispersão orgânica. Não é destinado a desenho realista, mas a efeitos experimentais e texturas generativas.

---

#### Engine 6: Spray Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/spray_brush_engine.html**

Projeta **múltiplas formas** dentro de uma área circular ao redor do cursor, como um spray.

**Parâmetros exclusivos:**

- **Spray Area:** **Diameter** (diâmetro da área de spray), **Aspect Ratio** (achatamento da área), **Rotation** (ângulo da área), **Scale** (escalamento dinâmico da área), **Jitter Movement** (aleatoriedade no posicionamento do centro da área).

- **Spray Shape:** Define o que é projetado. Pode ser: **Ellipse** (pontos elípticos de tamanho configurável), **Rectangle**, **Anti-aliased pixel** (pontos únicos suavizados), **Pixel** (pontos únicos sem anti-aliasing), **Image** (imagem importada como partícula). Cada forma projetada tem parâmetros de **Width**, **Height**, **Rotation** e **Proportional** (escala proporcionalmente ao spray area).

- **Particles (partículas por dab):** Número de formas projetadas em cada stamp do spray. Combinado com espaçamento, controla a densidade do spray.

- **Color Options:** **Random HSV** (variação aleatória em Hue, Saturation, Value de cada partícula), **Mix with background** (mistura cada partícula com a cor do fundo), **Use random opacity** (cada partícula tem opacidade aleatória).

---

#### Engine 7: Shape Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/shape_brush_engine.html**

Desenha **formas vetoriais** em camadas vetoriais. Cada traço cria uma forma com contorno (stroke) e preenchimento (fill) configuráveis.

**Parâmetros exclusivos:**

- **Shape:** Tipo de forma desenhada — **Ellipse**, **Rectangle**, **Line**, **Arrow**, **Polygon**, **Custom (SVG path)**.
- **Outline:** Habilitar/desabilitar contorno. Se habilitado: espessura, cor, estilo (sólido, tracejado), cap style (round, flat, square).
- **Fill:** Habilitar/desabilitar preenchimento. Se habilitado: cor sólida ou gradiente.

---

#### Engine 8: Quick Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/quick_brush_engine.html**

Motor otimizado para **performance máxima**, sacrificando recursos avançados. Útil para trabalho em canvas muito grandes ou em hardware limitado.

**Parâmetros:** Limitados a: tamanho, opacidade, espaçamento, e um único controle de pressão para tamanho. Sem textura, sem dinâmicas complexas, sem mistura. O algoritmo de renderização é simplificado para minimizar o tempo de processamento por dab.

---

#### Engine 9: Tangent Normal Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/tangent_normal_brush_engine.html**

Motor altamente especializado para criação de **normal maps** para uso em renderização 3D e game development.

**Como funciona:** Normal maps são texturas que armazenam informações de direção de superfície (normais) em canais RGB. Este motor codifica a **inclinação do stylus (tilt)** diretamente como informação de normal no mapa. Quando se inclina o stylus para a esquerda, o pincel deposita cor que representa uma normal apontando para a esquerda. Inclinando para cima, deposita normal apontando para cima. E assim por diante.

**Parâmetros exclusivos:**

- **Tangent Encoding:** Como a informação de tilt é codificada em RGB. Opções: **Pure XYZ** (X→R, Y→G, Z→B mapeados diretamente), **Screen Space** (relativo à tela), **Tilted screen space**. A escolha depende do pipeline 3D de destino.
- **Red/Green/Blue channels mapping:** Mapeamento individual de cada canal para eixos de tilt específicos.

Quando usado com o canvas em modo de visualização de normal map do Krita, permite "esculpir" luz e profundidade diretamente para uso em game engines como Unity ou Unreal.

---

#### Engine 10: Deform Brush Engine

**Fonte: docs.krita.org/en/reference_manual/brushes/brush_engines/deform_brush_engine.html**

Deforma pixels existentes ao "pintar" sobre eles, similar ao Liquify do Procreate, mas em forma de ferramenta de pincel contínuo.

**Modos de deformação:**

- **Grow:** Expande pixels para fora do centro do pincel.
- **Shrink:** Contrai pixels em direção ao centro.
- **Swirl CW / Swirl CCW:** Torce pixels no sentido horário ou anti-horário.
- **Move:** Empurra pixels na direção do traço (equivalente ao Push do Liquify).
- **Lens Zoom In / Lens Zoom Out:** Aplica uma distorção de lente (como uma lupa) que amplia ou reduz a área sob o pincel.
- **Color Deformation:** Em vez de mover pixels, altera suas cores — pode aumentar/diminuir canais individuais ou aplicar ruído de cor.

**Parâmetros:** **Deform Amount** (intensidade), **Bilinear interpolation** (suaviza a deformação com interpolação, evitando artefatos pixelizados), **Use counter** (limita o número de vezes que o mesmo pixel pode ser deformado, evitando acúmulo excessivo), **Use old data** (se o pincel usa a imagem original ou a imagem já deformada como base — afeta se deformações se acumulam).

---

#### Outros Engines menores:

**Grid Brush Engine:** Cria padrões de grade ao pintar. Cada dab é uma mini-grade com controle de número de divisões, cor das linhas e cor de preenchimento de cada célula.

**Chalk Brush Engine:** Motor simplificado que simula giz e pastel com grão de textura.

**Clone Brush Engine:** Motor dedicado para clonagem, com opções de fonte (ponto fixo, camada de referência, cursor com offset), escala e espelhamento da fonte.

**Curve Brush Engine:** Gera curvas aleatórias a partir do traço, criando efeitos de cabelo, grama ou fibras.

---

## 4. SIMULAÇÃO DE FÍSICA DE FLUIDOS PARA AQUARELA — ADOBE FRESCO LIVE BRUSHES

**Fonte: helpx.adobe.com/fresco/using/live-brushes.html, helpx.adobe.com/fresco/using/watercolor-brushes.html, helpx.adobe.com/fresco/using/oil-paint-brushes.html**

### Tecnologia subjacente

Os Live Brushes do Adobe Fresco utilizam a tecnologia **Adobe Sensei** (framework de IA e machine learning da Adobe) combinada com simulação de dinâmica de fluidos em tempo real. O motor renderiza a interação entre pigmento, água e superfície do papel usando equações de difusão de fluidos simplificadas que rodam na GPU do dispositivo.

---

### 4.1 Live Watercolor Brushes (Pincéis de Aquarela ao Vivo)

**Princípio:** Quando se faz um traço com um Live Watercolor Brush, o pigmento não é simplesmente depositado como pixels fixos. Em vez disso, o pigmento é **simulado como partículas em suspensão em água**. A água **se espalha** pelo canvas digital de acordo com a umidade e a textura do papel. O pigmento **segue a água**, acumulando-se nas bordas onde a água seca (fenômeno chamado **edge darkening** ou **cauliflower effect**, característico da aquarela real).

**Configurações dos Live Watercolor Brushes:**

**a) Water Flow (Fluxo de Água)**
Controla a quantidade de água que o pincel deposita no canvas. Valores altos criam poças que se espalham significativamente. Valores baixos depositam pouca água, resultando em traços mais controlados e secos. Faixa: slider contínuo. O Water Flow interage diretamente com a pressão do Apple Pencil — menos pressão = menos água.

**b) Flow (Fluxo de pigmento)**
Controla a concentração de pigmento na água. Flow alto = cores intensas e saturadas. Flow baixo = lavagens (washes) diluídas e transparentes. Diferente de opacidade — o pigmento baixo flow se concentra nas bordas do wash enquanto o centro fica mais claro.

**c) Size**
Tamanho do pincel. Pincéis maiores depositam mais água e pigmento.

**Comportamento simulado em tempo real:**

- **Bleeding (Sangramento):** Quando dois traços úmidos se tocam, as cores **se misturam nas bordas** como aquarela real. O pigmento de um traço migra para o outro. A velocidade e intensidade dependem de quanto água cada traço contém.

- **Edge Darkening (Escurecimento de bordas):** Ao secar, o pigmento se acumula naturalmente nas bordas externas do wash, criando bordas mais escuras e centros mais claros — exatamente como na aquarela real. Isso acontece automaticamente sem intervenção do artista.

- **Granulation (Granulação):** O pigmento se deposita de forma irregular na textura do papel virtual, acumulando-se nos vales da textura e deixando os picos mais claros. Diferentes pincéis de aquarela têm diferentes níveis de granulação.

- **Layering (Camadas de lavagem):** Washes sobrepostos acumulam pigmento de forma transparente, como glazes de aquarela real. A interação entre camadas de lavagem é fisicamente simulada — a segunda lavagem reativa parcialmente a primeira se ambas estão úmidas.

- **Drying (Secagem):** Os washes secam gradualmente. Enquanto úmidos, são reativas (misturam com novos traços). Após secar, tornam-se fixos. A velocidade de secagem depende da quantidade de água. Na prática, o efeito de espalhamento continua por alguns segundos após levantar o stylus.

- **Paper Texture Interaction:** A simulação leva em conta a textura do papel virtual. Papéis mais texturizados (rough) criam mais granulação e espalhamento irregular. Papéis lisos (smooth) permitem espalhamento mais uniforme.

**Pincéis específicos de aquarela disponíveis (exemplos):**
Round Watercolor (traço redondo clássico), Flat Wash (lavagem plana), Wet Soft (muito úmido e difuso), Dry Bristle (cerdas secas com pouca água), Splatter (respingos), Soft Bleed (sangramento suave).

---

### 4.2 Live Oil Brushes (Pincéis de Óleo ao Vivo)

**Princípio:** Simulam tinta a óleo com **volume/espessura física (impasto)**, viscosidade e mistura na superfície.

**Configurações dos Live Oil Brushes:**

**a) Paint Load (Carga de Tinta)**
Quantidade de tinta no pincel. Carga alta = traços grossos e volumosos com marcas de cerda visíveis. Carga baixa = traços finos e transparentes que mal cobrem o canvas. À medida que se pinta, a tinta gradualmente se esgota (simulando a descarga real de um pincel carregado de tinta).

**b) Viscosity (Viscosidade)**
Controla a espessura/resistência da tinta. Alta viscosidade = tinta pesada, difícil de espalhar, mantém forma e marcas de cerda. Baixa viscosidade = tinta fluida, espalha facilmente, mistura mais.

**c) Wetness (Umidade)**
Controla quanto a tinta no canvas permanece "molhada" e reativa. Alta wetness = tinta no canvas se mistura facilmente com novos traços. Baixa wetness = traços anteriores secam rápido e não se misturam.

**d) Mix (Mistura)**
Controla quanto o pincel mistura a cor existente no canvas com a cor do pincel. Mix alto = o pincel "pega" a cor do canvas e a arrasta. Mix baixo = deposita cor pura sobre a existente.

**e) Flow**
Taxa de deposição de tinta por dab.

**Comportamento simulado:**

- **Impasto visual:** Traços com alta carga e viscosidade exibem **volume visual** — iluminação simulada que faz os traços parecerem ter espessura física no canvas, com reflexos de luz nas cristas e sombras nos vales das marcas de cerda.

- **Color pickup (Captura de cor):** O pincel captura cor do canvas ao ser arrastado sobre áreas já pintadas, especialmente com Mix alto. Isso cria transições de cor orgânicas e naturais.

- **Brush bristle marks (Marcas de cerda):** As cerdas individuais do pincel deixam rastros visíveis na tinta, e esses rastros persistem como textura. A direção das cerdas segue a direção do traço.

- **Blending on canvas:** Cores adjacentes se misturam quando pintadas sobre enquanto ainda "úmidas" (Wetness alta), criando transições graduais sem necessidade de ferramenta de esfumaço separada.

**Pincéis específicos de óleo disponíveis (exemplos):**
Round Oil (redondo clássico), Flat Oil (chato), Fan Brush (leque — ideal para texturas e mistura), Palette Knife (espátula — empurra tinta sem depositar nova cor), Thick Oil (óleo grosso — máximo impasto), Dry Oil (óleo seco — pouca tinta, cerdas secas para texturas e efeitos de pincel seco).

---

## 5. FERRAMENTA DE GRADIENTE DEDICADA

### INFINITE PAINTER

**Fonte: Documentação e interface do Infinite Painter**

O Infinite Painter inclui uma ferramenta dedicada de gradiente que o Procreate não possui.

**Funcionamento:** Seleciona-se a ferramenta de gradiente na barra de ferramentas. Define-se as cores (pelo menos duas). Arrasta-se no canvas do ponto de início ao ponto de fim. O gradiente é renderizado entre os dois pontos.

**Tipos de gradiente:**
**Linear** (gradiente em linha reta entre dois pontos), **Radial** (gradiente circular a partir de um centro), **Angular** (gradiente que gira ao redor de um ponto central, como um cone).

**Configurações:** Cada ponto de cor pode ser reposicionado. Cores intermediárias podem ser adicionadas arrastando no slider de gradiente. A opacidade de cada ponto de cor pode ser configurada independentemente (permitindo gradientes que vão de cor sólida a transparente). O gradiente pode ser aplicado na camada ativa ou em uma nova camada.

### KRITA — Gradient Tool

**Fonte: docs.krita.org/en/reference_manual/tools/gradient.html**

O Krita possui uma ferramenta de gradiente completa acessível na toolbox.

**Tipos de forma do gradiente:** **Linear** (reta entre dois pontos), **Bilinear** (espelhado em ambas as direções), **Radial** (circular), **Square** (quadrado), **Conical** (cônico), **Conical Symmetric** (cônico simétrico), **Shaped** (segue o contorno da seleção ativa — o gradiente se adapta à forma da seleção).

**Configurações:** **Repeat** — como o gradiente se repete além dos pontos definidos: **None** (para nos pontos), **Forward** (repete), **Alternating** (repete alternando direção, criando zig-zag). **Anti-alias threshold:** suaviza artefatos de banding. **Dithering:** adiciona ruído sutil para eliminar banding em gradientes suaves. **Reverse:** inverte a direção do gradiente. **Gradient Editor:** editor completo de gradientes com pontos de parada (stops) para posicionar cores e opacidades. Pode-se usar gradientes predefinidos ou criar personalizados. Gradientes podem usar **Foreground/Background colors** (as cores ativas) ou **cores fixas**.

### CLIP STUDIO PAINT — Gradient Tool

**Fonte: Manual CSP, seção Gradient**

O CSP também possui ferramenta de gradiente completa.

**Tipos de forma:** **Linear** (linha reta), **Radial** (circular do centro para fora), **Ellipse** (elíptico), **Conical** (cônico). **Drawing type:** **Foreground to Transparent** (da cor ativa para transparente), **Foreground to Background** (entre as duas cores ativas), **Custom** (gradiente personalizado com múltiplas paradas de cor).

**Gradient Editor:** Permite criar gradientes com número ilimitado de paradas de cor. Cada parada tem: posição (porcentagem ao longo do gradiente), cor (selecionável), opacidade. O espaço entre paradas pode ser ajustado com um **midpoint** que controla onde a transição de 50% ocorre entre duas cores adjacentes. O editor mostra um preview em tempo real.

**Opções adicionais:** **Edge process** — como as bordas do gradiente são tratadas: **Do not process** (termina abruptamente), **Loop** (repete), **Reverse** (vai e volta). A ferramenta pode respeitar seleções e máscaras.

---

## 6. FILTROS NÃO-DESTRUTIVOS (FILTER LAYERS E FILTER MASKS)

### KRITA — Sistema Não-Destrutivo

**Fonte: docs.krita.org/en/reference_manual/layers_and_masks/filter_layers.html, docs.krita.org/en/reference_manual/layers_and_masks/filter_masks.html**

#### O que é edição não-destrutiva

Edição não-destrutiva significa que alterações (filtros, transformações, ajustes) são aplicadas como **camadas ou máscaras separadas** que podem ser editadas, desativadas ou removidas a qualquer momento, sem que a imagem original seja modificada. No Procreate, quando se aplica um Gaussian Blur, os pixels são permanentemente alterados — a única forma de reverter é usar Undo (que é limitado e sequencial). No Krita, o blur é aplicado como uma camada independente que "flutua" sobre a imagem original.

#### Filter Layer (Camada de Filtro)

**Criação:** **Layer > New > Filter Layer**. Ao criar, abre-se uma caixa de diálogo para selecionar o filtro desejado e configurar seus parâmetros.

**Comportamento:** A Filter Layer aplica um filtro a **todas as camadas abaixo dela** na pilha de camadas (ou dentro do grupo de camadas, se estiver agrupada). A imagem original permanece intacta — o filtro é calculado em tempo real para visualização. A Filter Layer pode ser desativada (ocultando sua visibilidade) para comparar com/sem o efeito. Pode ser editada a qualquer momento (duplo-clique abre os parâmetros do filtro para ajuste). Pode ser deletada sem consequências para as camadas abaixo.

**Filtros disponíveis para Filter Layers (lista parcial dos principais):**

Todos os filtros do menu **Filter** do Krita podem ser usados: **Blur** (Gaussian Blur, Motion Blur, Lens Blur), **Colors** (Brightness/Contrast, Curves, Levels, HSV Adjustment, Color Balance, Desaturate, Invert, Auto Contrast), **Edge Detection** (Sobel, Prewitt), **Enhance** (Sharpen, Unsharp Mask), **Map** (Bump Map, Gradient Map, Normal Map, Small Tiles, Phong Bumpmap), **Other** (Random Generator, Wave distortion, Pixelize, Raindrops, Oil Paint simulation), e todos os filtros G'MIC integrados (500+).

**Parâmetros editáveis:** Cada filtro tem seus próprios parâmetros, e todos permanecem editáveis enquanto a Filter Layer existe. Por exemplo, um Gaussian Blur aplicado como Filter Layer mantém o slider de **raio do blur** ajustável indefinidamente.

#### Filter Mask (Máscara de Filtro)

**Criação:** Clique direito em uma camada > **Add > Filter Mask**. Seleciona-se o filtro e seus parâmetros.

**Diferença de Filter Layer:** A Filter Mask é **vinculada a uma camada específica** e afeta apenas aquela camada (não afeta as camadas abaixo). Além disso, a Filter Mask possui um canal de máscara em escala de cinza — pode-se pintar na máscara com preto e branco para definir onde o filtro se aplica. Branco = efeito 100%, preto = sem efeito, tons de cinza = efeito parcial.

**Workflow prático:** Aplica-se um blur como Filter Mask em uma camada. Inicialmente a máscara é toda branca (blur em tudo). Pinta-se com preto nas áreas que devem permanecer nítidas. Resultado: blur seletivo não-destrutivo que pode ser ajustado a qualquer momento — tanto a intensidade do blur quanto a área de aplicação.

#### Transform Mask (Máscara de Transformação)

**Fonte: docs.krita.org/en/reference_manual/layers_and_masks/transformation_masks.html**

**Criação:** Clique direito em uma camada > **Add > Transform Mask**.

**Funcionamento:** Aplica uma transformação (mover, escalar, rotacionar, cisalhar, deformar em perspectiva, deformar em cage/warp, deformar liquify) de forma não-destrutiva. A camada original permanece intocada — a transformação é calculada em tempo real. Pode-se editar a transformação (clicar na Transform Mask e ajustar), desativar para ver o original, ou deletar para reverter completamente.

**Uso prático:** Permite testar posicionamentos, escalas e rotações de elementos sem commitment. Pode-se animar uma Transform Mask (no contexto de animação) para criar movimentos.

#### Transparency Mask (Máscara de Transparência)

**Fonte: docs.krita.org/en/reference_manual/layers_and_masks/transparency_masks.html**

Equivalente à máscara de camada (Layer Mask) do Photoshop e do Procreate. Uma camada em escala de cinza que define a transparência da camada pai. A diferença é que no Krita, múltiplas Transparency Masks podem ser aplicadas à mesma camada, e podem ser combinadas com Filter Masks e Transform Masks simultaneamente.

---

## 7. IMPORTAÇÃO DE MODELOS 3D

### CLIP STUDIO PAINT — Materiais 3D

**Fonte: tips.clip-studio.com/en-us/articles/1400, Manual CSP seção 3D**

#### Tipos de objetos 3D suportados

O CSP suporta importação de modelos 3D nos formatos: **.fbx**, **.6kt**, **.6kh**, **.lwo**, **.lws**, **.obj**. Além de formatos próprios **.cs3c** (character), **.cs3o** (object), **.cs3s** (scene/background).

**Categorias de materiais 3D:**

**a) 3D Object (Objeto 3D):**
Objetos estáticos como móveis, veículos, armas, objetos do cotidiano. Ao arrastar para o canvas (do painel Material), o objeto aparece em uma vista 3D. Pode-se: **rotacionar** (arrastando ao redor), **mover** (arrastando com ícone de movimento), **escalar** (com controles de escala), **alterar a posição da câmera** (ângulo de visualização). O objeto pode ser renderizado com: contorno (outline), sombreamento simples, ou sem renderização (apenas wireframe de referência).

**b) 3D Drawing Figure / 3D Body Type (Figuras de Desenho 3D):**

Estas são modelos humanos articuláveis completos com esqueleto rigging.

**Controles de pose:**
Cada articulação pode ser rotacionada individualmente. As articulações incluem: pescoço, cabeça, ombros, cotovelos, pulsos, dedos individuais (cada dedo com 3 falanges), coluna (múltiplos segmentos vertebrais), quadril, joelhos, tornozelos, dedos dos pés. Para posicionar, seleciona-se a articulação (que aparece como um nó na figura) e arrasta-se. O CSP aplica **Inverse Kinematics (IK)** — ao mover uma mão, o cotovelo e ombro se ajustam automaticamente para uma pose natural. A IK pode ser desativada para controle direto.

**Body Type (Tipo de Corpo):**
Os modelos têm parâmetros ajustáveis de proporção corporal: **Height (Altura)**, **Head-to-body ratio (Proporção cabeça-corpo)** — de 2 cabeças (super deformed/chibi) a 10 cabeças (heroico/idealizado), **Body shape** — ajusta largura de ombros, cintura, quadril, comprimento de membros, tamanho da cabeça, espessura dos membros. Cada parâmetro tem um slider individual. Existe um modelo masculino e um feminino como base, e cada um pode ser ajustado.

**Modelos de mão 3D:**
Modelos dedicados de mãos com todas as articulações dos dedos. Extremamente valorizados pela comunidade porque mãos são notoriamente difíceis de desenhar.

**Poses predefinidas:**
O CSP vem com uma biblioteca de poses predefinidas (parado, sentado, correndo, lutando, etc.) e pode-se importar poses adicionais dos Clip Studio Assets. Poses podem ser salvas e compartilhadas.

**c) 3D Background/Scene (Cenas de Fundo 3D):**
Cenas completas com múltiplos objetos posicionados — como interiores de quartos, salas de aula, ruas da cidade, estações de trem. Ao importar, pode-se navegar livremente pela cena 3D para encontrar o ângulo desejado. A câmera tem controles de: **posição** (X, Y, Z), **rotação** (pan, tilt, roll), **campo de visão/distância focal** (de grande angular a teleobjetiva — afeta a perspectiva da cena).

#### Configurações de renderização 3D no CSP

**Light Source (Fonte de Luz):** Pode-se ajustar a direção da iluminação sobre os modelos 3D. A iluminação afeta as sombras e highlights no modelo, servindo como referência para o artista. Controles: rotação horizontal e vertical da fonte de luz, intensidade.

**LT Conversion (Conversão para Linha e Tom):**
Funcionalidade que converte a cena 3D automaticamente em: **Outline Layer** (camada de lineart extraído do contorno do modelo), **Tone Layer** (camada de meios-tons/screentone extraída das sombras do modelo). Os parâmetros incluem: **Line extraction precision** (precisão do contorno), **Line width** (espessura da linha), **Tone settings** (densidade e tipo de screentone). Isso permite usar modelos 3D como base direta para mangá — o CSP gera automaticamente lineart e sombreamento em estilo mangá a partir da cena 3D.

**Wireframe/Outline rendering:** O modelo pode ser exibido como wireframe transparente para servir como guia de desenho por baixo das camadas de arte.

---

## 8. MACROS / AÇÕES AUTOMÁTICAS

### CLIP STUDIO PAINT — Auto Actions

**Fonte: tips.clip-studio.com/en-us/articles/1644, Manual CSP**

#### O que são Auto Actions

Auto Actions são **sequências gravadas de operações** que podem ser reproduzidas com um único clique ou atalho de teclado. Funcionam como macros — gravam passos e os reproduzem fielmente. Equivalente ao sistema de "Actions" do Adobe Photoshop.

#### Painel Auto Action

Acessado via **Window > Auto Action**. O painel exibe uma lista de conjuntos de ações (Action Sets) e, dentro de cada conjunto, as ações individuais.

#### Criação de Auto Actions

**Passo a passo:**
1. No painel Auto Action, clica-se em **Create New Auto Action Set** (cria um conjunto/pasta para organização).
2. Dentro do conjunto, clica-se em **Create New Auto Action** (cria uma ação vazia e nomeia-a).
3. Clica-se no botão **Start Recording** (ícone de círculo vermelho). A partir deste momento, todas as operações realizadas no CSP são gravadas em sequência.
4. Realizam-se as operações desejadas (criar camada, aplicar filtro, mudar blend mode, preencher com cor, transformar, etc.).
5. Clica-se em **Stop Recording** (ícone de quadrado).
6. A ação está salva e pode ser reproduzida clicando **Play** (ícone de triângulo/play).

#### O que pode ser gravado

Praticamente todas as operações do CSP podem ser gravadas, incluindo: criação/duplicação/deleção/renomeação de camadas, mudança de blend mode e opacidade de camadas, aplicação de filtros com parâmetros específicos, preenchimento de cor, transformações (escala, rotação), seleções, mudança de resolução, operações de edição (cortar, copiar, colar), mudança de cor de desenho, operações de régua, conversão de camadas (rasterizar, vetorizar), LT conversion de 3D, e mais.

#### Edição de Auto Actions

Cada passo gravado aparece como uma linha no painel Auto Action, descrevendo a operação (por exemplo: "New Layer", "Filter > Blur > Gaussian Blur (Radius: 5)", "Fill [Foreground color]"). Pode-se: **reordenar** passos arrastando, **deletar** passos individuais, **inserir** novos passos (reativando a gravação em um ponto específico), **desativar** passos individuais (sem deletar) marcando/desmarcando um checkbox, e **abrir um diálogo de configuração** para que o passo pause e peça input do usuário (por exemplo, que o blur pause para o artista escolher o raio em vez de usar o valor gravado).

#### Atribuição de atalhos

Auto Actions podem ser atribuídas a atalhos de teclado via **File > Shortcut Settings > Auto Action**. Também podem ser adicionadas à **Quick Access Palette** (paleta de acesso rápido) e à **Command Bar** (barra de comandos).

#### Compartilhamento

Auto Actions podem ser exportadas e importadas como arquivos, e compartilhadas na comunidade Clip Studio Assets.

---

## 9. WRAP-AROUND MODE (MODO ENVOLVENTE PARA TEXTURAS TILEABLE)

### KRITA — Wrap Around Mode

**Fonte: docs.krita.org/en/reference_manual/dockers/overview.html (Canvas settings), docs.krita.org**

#### O que é e para que serve

Wrap Around Mode é um modo de exibição do canvas onde as bordas se conectam — o que sai pelo lado direito reentra pelo lado esquerdo, o que sai por cima reentra por baixo. Isso cria um canvas **infinitamente repetido** em todas as direções (ou em apenas uma, dependendo da configuração).

**Propósito principal:** Criação de **seamless tiles** (texturas sem emendas) para uso em game development (texturas de chão, parede, terreno), web design (backgrounds repetíveis), design de estampas (tecido, papel de parede) e qualquer situação onde uma imagem precisa repetir sem costura visível.

#### Ativação

Acessado via **View > Wrap Around Mode** (atalho padrão: **W**). É um toggle simples que pode ser ativado e desativado a qualquer momento.

Modos disponíveis: **Both axes** (repete horizontal e verticalmente), **Horizontal axis only** (repete apenas horizontalmente), **Vertical axis only** (repete apenas verticalmente).

#### Comportamento

Quando ativado, o canvas principal é mostrado no centro e **cópias fantasma** do canvas aparecem ao redor em todas as direções. Tudo que se desenha próximo a uma borda aparece **simultaneamente** na borda oposta. Por exemplo, se se desenha uma linha que sai pelo lado direito do canvas, ela aparece entrando pelo lado esquerdo na posição correspondente. As cópias fantasma são atualizadas em tempo real.

**Todas as ferramentas funcionam em wrap around:** Pintura, borracha, esfumaço, preenchimento, filtros — tudo respeita o modo envolvente. Aplicar um Gaussian Blur em wrap around mode garante que o blur nas bordas considere os pixels da borda oposta, eliminando descontinuidades.

**Visualização:** O artista pode fazer zoom out para ver múltiplas repetições e verificar se o padrão é realmente seamless (sem emendas visíveis). Qualquer descontinuidade visual é imediatamente aparente.

#### Workflow prático

1. Cria-se um canvas com as dimensões desejadas para o tile (por exemplo, 512×512 pixels).
2. Ativa-se Wrap Around Mode.
3. Pinta-se normalmente, sem se preocupar com bordas — o que cruza uma borda automaticamente aparece do lado oposto.
4. Faz-se zoom out para verificar a repetição.
5. Exporta-se a imagem. O arquivo resultante é automaticamente um seamless tile que pode ser repetido infinitamente.

**Sem este modo (como no Procreate):** Para criar texturas tileable, o artista precisa manualmente usar offset/deslocamento da imagem, pintar nas emendas, verificar manualmente, e repetir — um processo significativamente mais trabalhoso e propenso a erros.

---

## 10. IMPORTAÇÃO DE ÁUDIO PARA ANIMAÇÃO

### KRITA — Audio Import na Timeline de Animação

**Fonte: docs.krita.org/en/reference_manual/dockers/animation_timeline.html, docs.krita.org/en/reference_manual/dockers/animation_curves.html**

#### Sistema de animação do Krita

O Krita possui uma timeline de animação acessível via **Window > Timeline** e **Window > Animation Curves**. Cada camada pode ter **keyframes** (quadros-chave) em diferentes posições da timeline. A animação funciona no sistema de camadas existente — cada keyframe de uma camada armazena um conteúdo diferente naquele frame.

#### Importação de áudio

**Ativação:** No docker de Timeline, clica-se no ícone de **Speaker/Audio** (alto-falante) na barra de ferramentas da timeline.

**Formatos suportados:** O Krita suporta importação de arquivos de áudio em formatos comuns: **.wav**, **.mp3**, **.ogg**, **.flac** (dependendo dos codecs disponíveis no sistema — o Krita usa a biblioteca Qt Multimedia para decodificação de áudio).

**Importação:** Seleciona-se o arquivo de áudio e ele é carregado na timeline. O áudio é exibido como uma **forma de onda (waveform)** visual na parte inferior da timeline.

**Funcionalidades de áudio na timeline:**

- **Waveform visualization (Visualização de forma de onda):** O áudio aparece como uma representação visual de amplitude ao longo do tempo, alinhada aos frames da animação. Isso permite que o animador veja onde estão os picos de som (falas, batidas musicais, efeitos sonoros) e alinhe os keyframes visuais a eles.

- **Playback com áudio:** Ao reproduzir a animação (botão Play ou atalho), o áudio toca sincronizado com os frames visuais. Isso permite verificar o sync de lip-sync (sincronização labial), timing de ações com efeitos sonoros e ritmo geral da animação.

- **Scrubbing:** Ao arrastar o indicador de frame atual (playhead) ao longo da timeline, o áudio acompanha (audio scrubbing). Isso permite localizar momentos específicos no áudio para posicionar keyframes com precisão.

- **Volume control:** Controle de volume do áudio para ajustar a intensidade durante a edição.

- **Offset:** O início do áudio pode ser deslocado em relação ao frame 0 da animação, permitindo alinhar o áudio a uma seção específica.

- **Mute:** O áudio pode ser mutado sem remover o arquivo.

#### Por que é importante

Na animação, o timing é fundamental, especialmente para: **lip-sync** (a boca do personagem precisa sincronizar com as sílabas do diálogo), **animação musical** (movimentos sincronizados com batidas), **efeitos sonoros** (impactos visuais alinhados com sons), **animação de dança ou ação** (coreografia alinhada com música). Sem áudio na timeline, o animador precisa cronometrar externamente, anotar frames manualmente e testar a sincronia em outro software — um processo trabalhoso e impreciso.

#### Comparação com Procreate

O Animation Assist do Procreate oferece onion skinning e controle de FPS, mas não suporta importação de áudio. Animadores que usam Procreate para lip-sync precisam exportar a animação, importar em um editor de vídeo, adicionar o áudio e verificar a sincronia — e se estiver errada, voltar ao Procreate, ajustar frames e repetir o processo.

---

## 11. PERSPECTIVA CURVILÍNEA DE 5 PONTOS

### INFINITE PAINTER — Perspective Grid com 5 Pontos

**Fonte: Documentação do Infinite Painter, comunidade de artistas**

#### O que é perspectiva curvilínea

Na perspectiva linear tradicional (1, 2 ou 3 pontos), as linhas que convergem para os pontos de fuga são sempre **retas**. Isso é geometricamente correto para campos de visão moderados (até cerca de 60-90°). Porém, quando o campo de visão se aproxima de 180° (como uma lente fisheye ou olho humano em visão periférica), **linhas retas se curvam** na percepção visual. A perspectiva curvilínea (também chamada de **perspectiva de 5 pontos** ou **fisheye perspective**) corrige essa limitação adicionando curvatura.

#### Os 5 pontos de fuga

Na perspectiva curvilínea de 5 pontos: quatro pontos de fuga estão posicionados nas extremidades do campo de visão (esquerda, direita, cima, baixo), e o quinto ponto está no **centro** (o ponto de visão frontal). As linhas que conectam pontos de fuga opostos são **curvas** (arcos), não retas. Linhas que passam pelo centro parecem retas (porque o centro do campo de visão tem mínima distorção), mas curvam progressivamente em direção às bordas.

#### Implementação no Infinite Painter

O Infinite Painter permite criar grades de perspectiva com **5 pontos de fuga**:

**Ativação:** Na interface de grades de perspectiva, seleciona-se o modo de 5 pontos (fisheye/curvilinear). O app posiciona automaticamente os 5 pontos de fuga em uma configuração padrão que representa um campo de visão de ~180°.

**Personalização:** Cada ponto de fuga pode ser **reposicionado** individualmente, ajustando a curvatura e o campo de visão. A distância entre pontos de fuga opostos determina a intensidade da curvatura — pontos mais próximos = curvatura mais acentuada (campo de visão mais amplo), pontos mais distantes = menos curvatura (mais próximo de perspectiva linear). A linha do horizonte pode ser ajustada.

**Snapping:** Com Drawing Assist ativado, os traços se curvam automaticamente seguindo as linhas de perspectiva curvilínea. O artista desenha naturalmente e o app curva o traço para manter a consistência da perspectiva fisheye.

**Visualização:** A grade exibe as linhas curvas de perspectiva, mostrando como as linhas se curvam progressivamente do centro para as bordas.

#### Aplicações

A perspectiva curvilínea de 5 pontos é usada para: **cenários panorâmicos** (como interiores amplos vistos do centro), **efeitos de lente** (simulação de grande angular ou fisheye em ilustração), **composições dinâmicas** (manga e quadrinhos usam perspectiva exagerada para criar impacto visual — cenas de ação frequentemente usam curvatura para enfatizar velocidade e poder), **ilustração arquitetônica de interiores** (onde o campo de visão precisa ser mais amplo que o permitido por 3 pontos).

#### Comparação com alternativas em outros apps

O Krita oferece o **Fisheye Assistant** que pode simular curvatura em combinação com Vanishing Point Assistants, mas não possui um sistema integrado de 5 pontos de fuga com grade completa como o Infinite Painter. O CSP não possui perspectiva curvilínea nativa. O Procreate não possui nenhuma forma de perspectiva curvilínea.

---

## RESUMO COMPARATIVO FINAL

Para cada funcionalidade ausente no Procreate, abaixo está o nível de implementação em cada app concorrente:

**Camadas Vetoriais:** CSP tem a implementação mais completa com edição de nós, borracha vetorial e correção de linhas. Fresco tem vetores básicos com integração ao Illustrator. Krita tem vetores baseados em SVG, mais voltados para formas geométricas que para lineart.

**Réguas Paramétricas:** CSP tem o sistema mais extenso com 10+ tipos de réguas, incluindo perspectiva avançada. Krita tem Assistants com snap suave ajustável e tipos únicos como Fisheye e Spline.

**Múltiplos Brush Engines:** Exclusivo do Krita com 10+ engines fundamentalmente diferentes (Pixel, Color Smudge, Hairy, Sketch, Particle, Spray, Shape, Quick, Tangent Normal, Deform, entre outros).

**Simulação de fluidos/aquarela:** Exclusivo do Adobe Fresco com Live Brushes. Nenhum outro app de pintura digital se aproxima da fidelidade da simulação de aquarela e óleo do Fresco.

**Ferramenta de Gradiente:** Disponível no Krita, CSP e Infinite Painter. Todos oferecem múltiplos tipos (linear, radial, cônico) com editores de múltiplas paradas de cor.

**Filtros Não-Destrutivos:** Exclusivo do Krita entre apps de pintura digital dedicados, com Filter Layers, Filter Masks, Transform Masks e Transparency Masks empilháveis.

**Modelos 3D:** Exclusivo do CSP entre apps de pintura digital, com suporte a figuras articuláveis com IK, objetos 3D e cenas de fundo, além de conversão automática para lineart/screentone.

**Auto Actions/Macros:** Exclusivo do CSP entre apps de pintura digital com sistema completo de gravação, edição e reprodução de sequências de operações.

**Wrap-Around Mode:** Exclusivo do Krita com suporte a ambos os eixos ou eixo individual, com todas as ferramentas funcionando nativamente no modo envolvente.

**Áudio na Timeline:** Exclusivo do Krita entre apps de pintura digital com waveform visualization, playback sincronizado e scrubbing.

**Perspectiva Curvilínea 5 Pontos:** O Infinite Painter oferece a implementação mais integrada como grade de perspectiva. O Krita oferece uma aproximação via combinação de Fisheye Assistant com Vanishing Points.

---

> Esta documentação reflete as funcionalidades conforme documentação oficial e comunidades até janeiro de 2025. Atualizações subsequentes podem ter adicionado funcionalidades não cobertas aqui.