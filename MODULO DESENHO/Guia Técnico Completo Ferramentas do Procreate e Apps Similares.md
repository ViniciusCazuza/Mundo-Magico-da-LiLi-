

# Guia Técnico Completo: Ferramentas do Procreate e Apps Similares

> **Fontes principais:** Documentação oficial do Procreate (procreate.com/handbook), Procreate Community Forums, documentação da Clip Studio Paint, documentação do Krita, documentação do Adobe Fresco, além de artigos técnicos e comunidades de artistas digitais.

---

## PARTE 1: PROCREATE (iPadOS)

O Procreate organiza suas ferramentas em áreas principais acessíveis pela interface superior e lateral. Vou detalhar cada uma.

---

## 1. FERRAMENTAS DE PINTURA E DESENHO

### 1.1 Brush Tool (Pincel) — Ícone de pincel no canto superior direito

A ferramenta principal de criação. O Procreate vem com mais de **200 pincéis padrão** organizados em categorias.

**Categorias padrão de pincéis:**

- **Sketching** (Esboço): 6B Pencil, HB Pencil, Narinder Pencil, Procreate Pencil, Technical Pen, Peppermint, entre outros. Simulam grafites e lápis com texturas de grão de papel.
- **Inking**: Studio Pen, Technical Pen, Syrup, Dry Ink, Gel Pen. Projetados para lineart com bordas nítidas ou texturizadas.
- **Drawing**: Derwent, Tinderbox, Blackburn, Oberon. Combinação entre esboço e pintura.
- **Painting**: Round Brush, Flat Brush, Old Brush, Stucco, Salamanca, Nikko Rull, Spectra, Gouache, Acrylic. Simulam pincéis tradicionais de pintura.
- **Artistic**: Quoll, Fresco, Nikko Rull, Aurora, Watercolor, Oil Paint. Simulações artísticas de mídias tradicionais.
- **Calligraphy**: Monoline, Chalk, Script, Brush Pen. Projetados para lettering e caligrafia com variação de pressão.
- **Airbrushing**: Soft Brush, Medium Brush, Hard Brush, Soft Airbrush. Aplicam cor de forma gradual e difusa sem textura de grão.
- **Textures**: Concrete Block, Sandstone, Grid, Recycled Paper. Para adicionar texturas de fundo ou sobreposições.
- **Abstract**: Flicks, Nebula, Wildgrain, Stardust. Pincéis experimentais com comportamentos não-convencionais.
- **Charcoals**: Willow, Vine, Compressed, Carbon. Simulam carvão com textura e espalhamento.
- **Elements**: Snow, Rain, Fire, Cloud, Splatters. Pincéis temáticos para efeitos de partículas.
- **Spray Paints**: Graffiti, Fat Nozzle, Flared. Simulam tinta spray com dispersão.
- **Touch Ups**: Grain, Noise, Blotch. Refinamento e ajustes finais.
- **Vintage**: Distressed, Halftone, Retro. Efeitos visuais que remetem a impressão antiga.
- **Luminance**: Light Pen, Glimmer, Bokeh, Nebula. Para efeitos de luz e brilho.
- **Industrial**: Concrete, Rust, Ashes. Texturas de superfícies industriais.
- **Organic**: Leaves, Bark, Stardust. Texturas naturais e orgânicas.
- **Water**: Wet Acrylic, Wash, Wet Glaze, Water Bleed. Simulações de aquarela e técnicas úmidas.

---

### 1.2 Brush Studio (Editor de Pincéis) — Configuração completa

Ao tocar duas vezes em qualquer pincel, abre-se o **Brush Studio**, que é o editor completo com os seguintes painéis de configuração:

**a) Stroke Path (Caminho do Traço)**
Controla o comportamento geral do traço. As configurações incluem: **Spacing** (espaçamento entre "stamps" do pincel, de 0% a máximo — valores baixos criam traços contínuos, valores altos criam traços pontilhados), **StreamLine** (suavização do traço, de 0% a máximo — valores altos fazem o traço seguir um caminho mais suave, eliminando tremores da mão), **Jitter** (aleatoriedade na posição de cada stamp do pincel, cria um efeito de dispersão), **Fall Off** (determina como o traço desaparece ao longo do tempo quando se reduz a velocidade).

**b) Taper (Afinamento)**
Controla como o início e o fim do traço afinam. Configurações: **Pressure Taper** (afinamento baseado na pressão do Apple Pencil, com controles separados para tamanho e opacidade no início e no fim do traço), **Touch Taper** (afinamento quando se desenha com o dedo, independente de pressão). Cada extremidade (início e fim) tem controles individuais para **tamanho do taper**, **opacidade do taper** e **curvatura do tip**.

**c) Shape (Forma)**
Define a forma base do "stamp" do pincel. Configurações: **Shape Source** (a imagem que define o formato do pincel — pode ser importada ou editada), **Scatter** (dispersão aleatória da forma), **Rotation** (como a forma rotaciona ao longo do traço), **Roundness** (achatamento da forma), **Azimuth** (resposta à inclinação lateral do Apple Pencil, afeta a rotação da forma).

**d) Grain (Textura/Grão)**
Define a textura aplicada dentro do traço do pincel. Configurações: **Grain Source** (imagem de textura que preenche o traço), **Moving vs. Texturized** (Moving: o grão se move com o traço, como um carimbo contínuo; Texturized: o grão permanece fixo no canvas como uma textura estática), **Scale** (tamanho do grão), **Zoom** (se o grão escala com o zoom do canvas), **Rotation** (rotação do grão), **Depth** (profundidade/intensidade do grão, de sutil a pronunciado), **Offset Jitter** (variação aleatória no posicionamento do grão), **Blend Mode** para o grão.

**e) Dynamics (Dinâmicas)**
Controla mudanças ao longo do traço. Configurações: **Speed** (como a velocidade de desenho afeta o tamanho e a opacidade — traços rápidos podem ser mais finos/transparentes ou o contrário), **Jitter de tamanho e opacidade** ao longo do traço.

**f) Apple Pencil**
Configurações específicas para a resposta ao Apple Pencil: **Pressure** (curva de pressão que controla como a força aplicada afeta tamanho e opacidade), **Tilt** (como o ângulo de inclinação afeta o tamanho, opacidade e grão — por exemplo, inclinar o Apple Pencil como um lápis real para sombrear), **Bleed** (sangramento de cor em resposta à pressão).

**g) General (Propriedades Gerais)**
Configurações diversas: **Size Limits** (tamanho mínimo e máximo do pincel), **Opacity Limits** (opacidade mínima e máxima), **Orientation** (orientação do pincel em relação ao traço), **Preview** (configuração da miniatura de visualização do pincel), **Use Stamp Preview** (altera a visualização na biblioteca).

**h) Color Dynamics (Dinâmicas de Cor)**
Controla variação automática de cor ao longo do traço: **Stamp Color Jitter** (variação de matiz/saturação/brilho entre cada stamp), **Stroke Color Jitter** (variação entre traços), **Color Pressure** (a pressão do Apple Pencil altera a cor), **Hue/Saturation/Brightness** (intervalos individuais de variação para cada componente de cor).

**i) Wet Mix (Mistura Úmida)**
Simula o comportamento de tinta molhada: **Dilution** (diluição — quanta cor é depositada por stamp), **Charge** (carga de tinta — quanta tinta o pincel carrega antes de precisar "recarregar"), **Attack** (velocidade com que o pincel pega cor do canvas), **Pull** (quantidade de tinta que o pincel arrasta ao se mover), **Grade** (granulação da mistura), **Wetness** (umidade geral — combina diluição e mistura). Este painel permite simular técnicas de aquarela e óleo molhado.

**j) Rendering (Renderização)**
Modo de renderização do pincel: **Light Glaze** (camadas semitransparentes que se acumulam, ideal para aquarela e glazing), **Heavy Glaze** (acúmulo mais opaco), **Intense Blending** (forte mistura de cores), **Uniform Blending** (mistura uniforme), **Flat Opacity** (opacidade uniforme sem acúmulo em um único traço). Também inclui controle de **Blend Mode** do pincel.

---

### 1.3 Smudge Tool (Ferramenta de Esfumar) — Ícone de dedo

Usa qualquer pincel da biblioteca, mas em vez de depositar cor, **mistura e arrasta** as cores já existentes no canvas. Comporta-se como se passasse o dedo sobre tinta úmida.

**Configurações:** Usa exatamente o mesmo Brush Studio do pincel selecionado, com todos os mesmos controles. A diferença é funcional — em vez de adicionar tinta, ela espalha a tinta existente. O slider de **Size** (barra lateral esquerda superior) controla o tamanho da área de esfumaço. O slider de **Opacity** (barra lateral esquerda inferior) controla a intensidade do esfumaço — valores baixos produzem mistura sutil, valores altos arrastam a cor de forma agressiva.

---

### 1.4 Eraser Tool (Borracha) — Ícone de borracha

Remove pixels da camada atual. Assim como o Smudge, utiliza qualquer pincel da biblioteca, o que significa que a borracha pode ter textura.

**Configurações:** Mesmo Brush Studio do pincel selecionado. Size e Opacity controlam extensão e intensidade do apagamento. Apagar com um pincel texturizado (como carvão) produz apagamento irregular e texturizado, o que é útil para efeitos artísticos.

---

## 2. FERRAMENTAS DE SELEÇÃO E TRANSFORMAÇÃO

### 2.1 Selection Tool (Ferramenta de Seleção) — Ícone "S"

Cria áreas de seleção que restringem onde as ferramentas de pintura atuam.

**Modos de seleção:**

- **Automatic (Automática):** Toca-se em uma área e o Procreate seleciona pixels contíguos de cor similar. O slider de **Selection Threshold** (aparece na parte superior ao arrastar) controla a tolerância — valores baixos selecionam cores muito semelhantes, valores altos expandem o alcance para cores menos semelhantes.
- **Freehand (Mão Livre):** Desenha-se o contorno da seleção manualmente. O último ponto conecta automaticamente ao primeiro para fechar a seleção.
- **Rectangle (Retângulo):** Arrasta-se para criar uma seleção retangular.
- **Ellipse (Elipse):** Arrasta-se para criar uma seleção elíptica.

**Opções adicionais (na barra inferior durante seleção):** **Add** (adicionar à seleção existente), **Remove** (remover da seleção existente), **Invert** (inverter a seleção — o que estava selecionado fica deselecionado e vice-versa), **Copy & Paste** (copia a área selecionada para uma nova camada), **Feather** (suaviza as bordas da seleção com um gradiente — o slider controla o raio de suavização), **Save & Load** (salvar seleções para reutilizar).

---

### 2.2 Transform Tool (Ferramenta de Transformação) — Ícone de seta/cursor

Permite mover, redimensionar, rotacionar e distorcer o conteúdo da camada atual (ou da seleção ativa).

**Modos de transformação (barra inferior):**

- **Freeform (Livre):** Permite redimensionar em qualquer direção arrastando as alças (handles) nos cantos e lados. Pode distorcer a proporção. Segurar com dois dedos mantém a proporção (Uniform).
- **Uniform (Uniforme):** Redimensiona mantendo proporções originais ao arrastar as alças de canto.
- **Distort (Distorcer):** Cada alça de canto pode ser movida independentemente, criando distorção em perspectiva. Permite transformações de 4 pontos.
- **Warp (Deformar):** Exibe uma grade de controle (ajustável em Advanced Mesh) e permite empurrar e puxar áreas para deformação orgânica. **Advanced Mesh Settings** permite escolher a densidade da malha de deformação (4×4, 8×8, etc. pontos de controle).

**Opções adicionais durante a transformação:** **Magnetics** (ativa o snapping — alinhamento automático com bordas do canvas, centro e outros elementos), **Snapping** (guias visuais que auxiliam no posicionamento preciso, incluindo alinhamento ao centro horizontal/vertical e às bordas), **Interpolation** (método de reamostragem ao redimensionar: **Nearest Neighbor** mantém bordas nítidas/pixelizadas, ideal para pixel art; **Bilinear** suaviza a interpolação; **Bicubic** oferece a suavização de maior qualidade), **Flip Horizontal** e **Flip Vertical** (espelha o conteúdo), **Rotate 45°** (rotação em incrementos de 45°), **Fit to Canvas** e **Fit to Screen**.

---

## 3. FERRAMENTAS DE AJUSTE (Adjustments) — Ícone de varinha mágica

Ao tocar no ícone de varinha mágica, abre-se um menu com todos os ajustes disponíveis.

### 3.1 Ajustes de Imagem

**a) Opacity (Opacidade)**
Ajuste rápido da opacidade da camada. Desliza-se o dedo horizontalmente sobre o canvas para ajustar de 0% a 100%.

**b) Gaussian Blur (Desfoque Gaussiano)**
Aplica desfoque suave. Modos: **Layer** (aplica à camada inteira), **Pencil** (permite "pintar" o desfoque apenas onde se deseja, como um pincel de desfoque). O slider (arrastando o dedo na tela) controla a **intensidade do desfoque em porcentagem**.

**c) Motion Blur (Desfoque de Movimento)**
Cria um desfoque direcional que simula movimento. Ao arrastar o dedo, controla-se a **intensidade** e a **direção** do desfoque. Também possui modo **Layer** e **Pencil**.

**d) Perspective Blur (Desfoque de Perspectiva)**
Cria um efeito de desfoque radial com ponto focal. O ponto central permanece nítido e o desfoque aumenta em direção às bordas. O slider controla a intensidade. Pode-se reposicionar o ponto focal tocando na tela.

**e) Sharpen (Nitidez)**
Aumenta a nitidez dos detalhes na imagem. O slider controla a intensidade da nitidez. Modos Layer e Pencil disponíveis.

**f) Noise (Ruído)**
Adiciona ruído/granulação à imagem. O slider controla a quantidade de ruído. Útil para simular textura de filme fotográfico ou adicionar textura sutil a áreas lisas.

### 3.2 Ajustes de Cor

**g) Hue, Saturation, Brightness (Matiz, Saturação, Brilho)**
Três sliders independentes que aparecem na parte superior da tela: **Hue** (desloca a matiz de todas as cores em um espectro circular de 0° a 360°), **Saturation** (intensidade das cores, de dessaturado/cinza a supersaturado), **Brightness** (luminosidade geral). Modo Layer ou Pencil.

**h) Color Balance (Balanço de Cor)**
Ajusta o equilíbrio entre pares de cores complementares. Oferece sliders para **Cyan/Red**, **Magenta/Green**, **Yellow/Blue**, com ajustes separados para **Shadows** (sombras), **Midtones** (tons médios) e **Highlights** (luzes).

**i) Curves (Curvas)**
Editor de curvas profissional com canais: **Gamma** (luminosidade geral), **Red**, **Green**, **Blue** (canais individuais de cor). Toca-se na curva para adicionar pontos de controle e arrastar para cima (clarear) ou para baixo (escurecer) aquela faixa tonal. Permite controle preciso de contraste, exposição e color grading.

**j) Gradient Map (Mapa de Gradiente)**
Mapeia os valores tonais da imagem (de sombras a luzes) para um gradiente de cores personalizado. Permite criar efeitos de colorização dramáticos. O editor de gradiente permite adicionar múltiplos pontos de cor e ajustar suas posições.

### 3.3 Efeitos Visuais

**k) Bloom (Brilho/Florescência)**
Adiciona um efeito de brilho difuso ao redor de áreas claras da imagem, simulando a florescência de luz. O slider controla a **intensidade** e o **raio** do efeito. Possui opções de **Burn** (queima) e **Transition** (transição) para ajustar o comportamento.

**l) Glitch (Falha)**
Aplica efeitos de distorção digital, simulando falhas tecnológicas. Oferece vários sub-efeitos: **Artifact** (artefatos de compressão), **Signal** (deslocamento de canais de cor), **Diverge** (separação cromática), **Shift** (deslocamento horizontal), **Wave** (distorção em onda). Cada sub-efeito tem um slider de intensidade.

**m) Halftone (Meio-Tom)**
Simula a técnica de impressão em meio-tom (retícula). Opções incluem halftone em padrão de pontos e de linhas, com controle sobre o **tamanho dos pontos** e a **intensidade do efeito**.

**n) Chromatic Aberration (Aberração Cromática)**
Simula a separação de canais RGB que ocorre em lentes ópticas reais. O slider controla a **intensidade** do deslocamento. Pode-se reposicionar o ponto focal. Modos: **Expand** (expande a partir do centro) e **Displace** (deslocamento direcional).

**o) Liquify (Liquefazer)**
Ferramenta poderosa de deformação interativa. Ao entrar no Liquify, a barra inferior exibe os modos: **Push** (empurra pixels na direção do traço), **Twirl CW/CCW** (torce pixels no sentido horário ou anti-horário), **Pinch** (contrai pixels em direção ao centro do pincel), **Expand** (expande pixels para fora do centro do pincel), **Crystals** (fragmenta pixels em padrões cristalinos), **Edge** (deforma apenas as bordas detectadas), **Reconstruct** (restaura gradualmente a imagem à forma original). Configurações: **Size** (tamanho da área de efeito), **Distortion** (intensidade), **Pressure** (resposta à pressão do Apple Pencil), **Momentum** (inércia do efeito, continuando após levantar o lápis).

**p) Clone (Clonar)**
Copia pixels de uma área fonte para outra. Toca-se para definir o ponto de origem (aparece um círculo de referência) e então pinta-se em outra área. O pincel clona os pixels da área fonte em tempo real, mantendo a distância relativa. Útil para remover imperfeições ou duplicar texturas.

---

## 4. SISTEMA DE CAMADAS (Layers)

### 4.1 Painel de Camadas — Ícone de dois quadrados sobrepostos (canto superior direito)

**Operações por camada:**

- **Adicionar camada:** Botão "+" cria nova camada vazia.
- **Visibilidade:** Checkbox ao lado de cada camada para mostrar/ocultar.
- **Opacidade da camada:** Toca-se na camada com dois dedos, ou toca-se no "N" (nome do blend mode) para revelar o slider de opacidade.
- **Reordenar:** Arrasta-se a camada para cima ou para baixo na pilha.
- **Agrupar:** Desliza-se uma camada sobre outra para criar um grupo. Grupos podem ser colapsados e tratados como uma unidade.

**Modos de Mesclagem (Blend Modes) — acessíveis ao tocar no "N" da camada:**
O Procreate oferece 27 modos de mesclagem organizados em categorias: **Normal**, **Darken** (Darken, Multiply, Color Burn, Linear Burn, Darker Color), **Lighten** (Lighten, Screen, Color Dodge, Add, Lighter Color), **Contrast** (Overlay, Soft Light, Hard Light, Vivid Light, Linear Light, Pin Light, Hard Mix), **Difference** (Difference, Exclusion, Subtract), **Color** (Hue, Saturation, Color, Luminosity).

**Opções ao deslizar camada para a esquerda:** **Lock** (bloqueia a transparência — só pinta onde já existem pixels), **Duplicate** (duplica a camada), **Delete** (exclui a camada).

**Menu da camada (toque na miniatura):** **Rename** (renomear), **Select** (seleciona o conteúdo da camada como seleção), **Copy** (copia), **Fill Layer** (preenche toda a camada com a cor ativa), **Clear** (limpa todo o conteúdo), **Alpha Lock** (bloqueia transparência — identifica-se pelo padrão quadriculado na miniatura; permite pintar apenas sobre pixels existentes sem alterar áreas transparentes), **Mask** (cria uma máscara de camada — uma camada auxiliar em escala de cinza onde branco revela e preto oculta o conteúdo da camada principal), **Clipping Mask** (ativa a máscara de recorte — a camada atual só é visível dentro dos pixels da camada abaixo dela), **Invert** (inverte as cores), **Reference** (define a camada como referência para preenchimento de cor em outras camadas), **Merge Down** (mescla com a camada abaixo), **Combine Down** (agrupa com a camada abaixo), **Flatten** (achata todas as camadas em uma).

---

## 5. FERRAMENTAS DE COR

### 5.1 Color Picker (Seletor de Cor) — Círculo colorido no canto superior direito

**Interfaces de seleção de cor (tabs na parte inferior do seletor):**

- **Disc (Disco):** Roda de cores circular (matiz) com um quadrado interno (saturação horizontal, brilho vertical). É o modo padrão.
- **Classic (Clássico):** Quadrado de saturação/brilho com slider de matiz abaixo.
- **Harmony (Harmonia):** Roda de cores com modos de harmonia cromática — **Complementary** (cor oposta na roda), **Split Complementary**, **Analogous** (cores adjacentes), **Triadic** (3 cores equidistantes), **Tetradic** (4 cores). Guias visuais mostram as relações cromáticas.
- **Value (Valor):** Sliders numéricos para **Hue**, **Saturation**, **Brightness** e campo hexadecimal para entrada manual de código de cor.
- **Palettes (Paletas):** Coleção de amostras de cor. Pode-se criar paletas personalizadas, importar paletas (formatos .swatches), gerar paletas a partir de fotos (**New from Camera**, **New from File**, **New from Photos**). Tipos de paletas: **Compact** (grid simples), **Cards** (amostras maiores com mais detalhes).

**Funcionalidades adicionais de cor:**

- **Eyedropper (Conta-gotas):** Ativado segurando o dedo/lápis sobre o canvas, ou tocando no quadrado de cor e arrastando. Exibe uma lupa mostrando a cor do pixel sob o cursor, com comparação entre a cor atual e a nova.
- **Color History:** O seletor de cor mostra as últimas cores usadas na parte inferior para acesso rápido.
- **Cor Anterior e Atual:** O círculo de cor exibe a cor ativa (metade exterior) e a cor anterior (metade interior).

---

## 6. FERRAMENTAS DE DESENHO ASSISTIDO E GUIAS

### 6.1 Drawing Guide (Guia de Desenho) — Acessível via Actions > Canvas > Drawing Guide

**Tipos de guias:**

- **2D Grid (Grade 2D):** Exibe uma grade regular. Configurações: **Grid Size** (espaçamento entre linhas), **Thickness** (espessura das linhas), **Opacity** (opacidade da grade), **Color** (cor das linhas de guia). Com **Drawing Assist** ativado, os traços se alinham (snap) às linhas da grade.
- **Isometric (Isométrica):** Grade com linhas em ângulos isométricos (30°). Mesmas configurações da 2D Grid. Ideal para ilustração isométrica e pixel art.
- **Perspective (Perspectiva):** Permite definir **1, 2 ou 3 pontos de fuga**. Toca-se no canvas para colocar cada ponto de fuga. Com Drawing Assist ativo, os traços convergem automaticamente para o ponto de fuga mais próximo. Configurações incluem ajuste fino da posição dos pontos de fuga e da linha do horizonte.
- **Symmetry (Simetria):** Espelha o desenho em tempo real. Modos: **Vertical** (espelha no eixo vertical), **Horizontal** (espelha no eixo horizontal), **Quadrant** (espelha em 4 quadrantes), **Radial** (espelha radialmente com múltiplas repetições). A opção **Rotational Symmetry** alterna entre espelhamento (refletido) e rotação (o desenho é rotacionado em vez de espelhado). **Assisted Drawing** pode ser ativado/desativado por camada individual.

---

### 6.2 QuickShape (Forma Rápida)

Não é uma ferramenta separada — é um recurso integrado ao desenho. Ao desenhar uma forma (linha, círculo, retângulo, triângulo, arco) e **segurar o lápis/dedo no final do traço** sem levantar, o Procreate detecta a forma e a corrige automaticamente. Tocar com outro dedo na tela enquanto segura converte para uma forma **perfeita** (círculo perfeito, linha reta, retângulo com ângulos de 90°, etc.). A forma pode então ser ajustada arrastando os nós de controle que aparecem. Ao tocar em **Edit Shape** (que aparece no topo), é possível ajustar dimensões e posição numericamente.

---

### 6.3 StreamLine (já detalhado no Brush Studio)

Acessível dentro das configurações de cada pincel. Valores altos (máximo 100%) criam linhas extremamente suaves, ideais para lineart. Valores baixos mantêm o traço fiel ao movimento da mão.

---

## 7. FERRAMENTAS DE TEXTO E VETORES

### 7.1 Text Tool — Acessível via Actions (ícone de chave inglesa) > Add > Add Text

Cria caixas de texto editáveis. Funcionalidades: seleção de **fonte** (todas as fontes do sistema iOS mais importação de fontes .ttf e .otf), **tamanho**, **kerning** (espaçamento entre letras), **tracking** (espaçamento geral), **leading** (espaçamento entre linhas), **baseline** (posição vertical), **alinhamento** (esquerda, centro, direita, justificado), **cor do texto**, **opacidade**. Também permite converter texto em curvas (**Rasterize** no menu de camada), tornando-o editável como pixels.

### 7.2 Ferramenta de Seleção de Cor de Preenchimento (ColorDrop)

Arrasta-se o círculo de cor do canto superior direito diretamente para o canvas para preencher uma área fechada com cor. Ao manter o dedo após o drop, um slider de **ColorDrop Threshold** aparece no topo — deslizando para a direita aumenta a tolerância (preenche áreas com cores mais variadas), deslizando para a esquerda diminui (preenchimento mais restrito). A opção **Continue filling with Recolor** (ao tocar no topo após o drop) permite tocar repetidamente em diferentes áreas para preenchê-las rapidamente.

---

## 8. MENU DE AÇÕES (Actions) — Ícone de chave inglesa

### 8.1 Add (Adicionar)
**Insert a photo**, **Insert a file**, **Take a photo** (insere foto diretamente da câmera), **Add Text**, **Cut**, **Copy**, **Copy Canvas** (copia canvas inteiro), **Paste**.

### 8.2 Canvas
**Crop and Resize** (cortar e redimensionar o canvas com campos numéricos e resampling), **Flip Canvas Horizontal/Vertical**, **Canvas Information** (dimensões, DPI, camadas, etc.), **Drawing Guide** (configuração detalhada acima), **Edit Drawing Guide**, **Reference** (abre uma janela flutuante que pode exibir o canvas, uma imagem importada ou a visualização da câmera — útil para ter referência visual enquanto desenha), **Animation Assist** (ativa o modo de animação frame-a-frame).

### 8.3 Share (Compartilhar)
Exportação em múltiplos formatos: **Procreate (.procreate)**, **PSD (Photoshop)**, **PDF**, **JPEG**, **PNG**, **TIFF**, **GIF animado**, **PNG animado**, **MP4** (timelapse). No caso de animação, exporta como GIF animado ou MP4.

### 8.4 Video (Timelapse)
O Procreate grava automaticamente um timelapse de todo o processo de criação. Configurações: **Time-lapse Recording** (ativar/desativar), **Export Time-lapse Video** (exporta em 30 segundos ou duração total).

### 8.5 Preferences (Preferências)
**Light Interface/Dark Interface** (tema claro ou escuro), **Right-hand/Left-hand Interface** (posiciona a barra lateral à esquerda ou direita), **Brush Cursor** (exibe ou oculta o cursor circular ao desenhar), **Connect Stylus** (Bluetooth), **Pressure and Smoothing** (curva de pressão global do Apple Pencil: **Pressure Curve** com editor gráfico que permite mapear a pressão física à resposta do app), **Gesture Controls** (permite personalizar o que cada gesto faz — toque com 1/2/3/4 dedos, Apple Pencil squeeze, etc., para ações como undo, redo, eyedropper, QuickMenu, layer select, etc.), **Rapid Undo Delay** (tempo para undo contínuo ao segurar dois dedos).

---

## 9. ANIMATION ASSIST (Assistente de Animação)

Ativado via Actions > Canvas > Animation Assist. Exibe uma **timeline** na parte inferior da tela.

**Funcionalidades:** Cada camada (ou grupo de camadas) se torna um **frame**. Controles da timeline: **Add Frame**, **Duplicate Frame**, **Delete Frame**, **Hold Duration** (quantos frames essa imagem permanece visível). **Settings (Configurações):** **Loop** (animação em loop), **Ping-Pong** (ida e volta), **One Shot** (toca uma vez), **Frames per Second** (FPS, de 1 a 60), **Onion Skin Frames** (número de frames fantasma visíveis antes e depois do frame atual), **Onion Skin Opacity** (opacidade dos frames fantasma), **Onion Skin Color** (cores para diferenciar frames anteriores e posteriores — tipicamente vermelho e verde).

---

## 10. GESTOS E ATALHOS

Embora não sejam "ferramentas" no sentido visual, os gestos são parte fundamental da operação:

- **Dois dedos tocam:** Undo (desfazer).
- **Três dedos tocam:** Redo (refazer).
- **Pinça com dois dedos:** Zoom in/out e rotação do canvas.
- **Três dedos deslizando para baixo:** Abre o menu de **Cut/Copy/Paste**.
- **Quatro dedos tocam:** Oculta/mostra a interface (fullscreen).
- **Segurar com dedo/lápis:** Ativa o **Eyedropper**.
- **Tocar e segurar com pincel selecionado:** Ativa o **Smudge** temporário (configurável via Gesture Controls).
- **QuickMenu:** Gesto configurável (por padrão, toque com um dedo) que abre um menu circular de 6 atalhos personalizáveis.

---

## PARTE 2: FERRAMENTAS DIFERENCIADAS DE APPS SIMILARES

A seguir, ferramentas **relevantes e diferentes** encontradas em apps concorrentes que complementam ou superam o que o Procreate oferece.

---

## CLIP STUDIO PAINT (iOS, Windows, macOS, Android)
**Fonte: Documentação oficial Clip Studio Paint — tips.clip-studio.com e manual**

### Vector Layers (Camadas Vetoriais)
Diferente do Procreate (100% raster), o CSP permite criar camadas vetoriais onde cada traço é armazenado como um caminho vetorial editável. Pode-se ajustar pontos de controle de cada linha após desenhá-la, mover segmentos individuais e modificar a espessura do traço ponto a ponto.

### Vector Eraser com "Erase up to Intersection"
Uma borracha vetorial que, ao ser usada em camadas vetoriais, pode **apagar linhas até o ponto de interseção** com outra linha. Elimina a necessidade de apagar manualmente sobras de linhas que se cruzam — extremamente útil para lineart limpa.

### Perspective Ruler (Régua de Perspectiva)
Régua especializada que permite configurar 1, 2 ou 3 pontos de fuga com controles mais avançados que o Procreate: pontos de fuga podem ser enviados ao infinito, a linha do horizonte é ajustável independentemente, e múltiplas réguas de perspectiva podem coexistir no mesmo canvas. Existem também **réguas de perspectiva fisheye** (olho-de-peixe) para distorção curvilínea.

### Réguas Especiais (Special Rulers)
Além da perspectiva, o CSP oferece: **Parallel Ruler** (força todos os traços a serem paralelos em uma direção definida), **Concentric Circle Ruler** (traços seguem círculos concêntricos), **Radial Line Ruler** (traços convergem para um ponto), **Curve Ruler** (define uma curva e os traços seguem paralelos a ela), **Figure Ruler** (elipses, polígonos regulares), **Guide Ruler** (linhas-guia infinitas em ângulos específicos).

### Sub Tool Detail Palette (Painel de Detalhes do Sub-Tool)
Equivalente ao Brush Studio, mas com parâmetros adicionais: **Correction** (estabilização de traço com algoritmos mais avançados), **Starting and Ending** (controles granulares de início/fim do traço com curvas de velocidade), **Anti-overflow** (impede que o pincel pinte fora de áreas pré-definidas por referência), **Border of watercolor** (bordas de aquarela com acúmulo de pigmento nas bordas como aquarela real).

### 3D Models e 3D Drawing Figures
O CSP permite importar e posicionar modelos 3D (incluindo figuras humanas articuláveis) diretamente no canvas como referência. Pode-se ajustar a pose, o ângulo da câmera, a iluminação e usar o modelo como base para desenho. **3D Drawing Figures** têm esqueleto completo com controles de articulação, proporção corporal ajustável (altura, largura dos ombros, comprimento dos membros) e podem ser posicionados para qualquer referência de anatomia.

### Auto Actions (Ações Automáticas)
Sistema de macros que grava sequências de ações (ajustes, filtros, transformações) e permite reproduzi-las com um clique. Equivalente às "Actions" do Photoshop.

### Tilings e Padrões Repetidos
Ferramenta para criar padrões repetidos (seamless patterns). Ao ativar, o canvas mostra as repetições em tempo real ao redor da área de trabalho, e o que se desenha nas bordas aparece automaticamente do lado oposto.

### Frame-by-Frame Animation com Timeline Avançada
Timeline com suporte a **múltiplas trilhas** (layers na timeline), **cels** (atribuição de camadas a frames), **interpolation** básica e exportação em diversos formatos de vídeo. Mais robusto que o Animation Assist do Procreate.

---

## KRITA (Windows, macOS, Linux — gratuito e open source)
**Fonte: docs.krita.org (Manual oficial)**

### Brush Engines (Motores de Pincel)
O Krita não tem um único sistema de pincel — possui **múltiplos engines** independentes: **Pixel Brush** (raster padrão), **Color Smudge** (mistura cromática com propriedades de tinta úmida avançadas), **Shape Brush** (desenha formas vetoriais), **Particle Brush** (gera partículas com física simulada), **Sketch Brush** (traços orgânicos com linhas auxiliares automáticas), **Hairy Brush** (simula cerdas individuais de um pincel real com comportamento físico independente), **Spray Brush** (spray configurável com padrões de partículas), **Quick Brush** (motor otimizado para performance), **Tangent Normal Brush** (pinta normal maps para uso em 3D), **Deform Brush** (deforma pixels ao pintar, como Liquify em forma de pincel). Cada engine tem parâmetros completamente diferentes.

### Wrap-Around Mode (Modo Envolvente)
Ao ativar, o canvas se repete infinitamente em todas as direções em tempo real. Tudo que se desenha na borda aparece do lado oposto. Ferramenta essencial para criar texturas tileable (repetíveis sem emendas) para jogos e 3D.

### Pop-up Palette (Paleta Pop-up)
Ao clicar com o botão direito (ou gesto equivalente), surge uma roda de cores e seletor de pincéis favoritos sobre o cursor. Permite trocar cor e pincel sem mover a mão da área de trabalho. Totalmente customizável.

### Assistants (Assistentes de Desenho)
Similar às réguas do CSP, mas com adições: **Vanishing Point**, **Parallel Ruler**, **Concentric Ellipse**, **Fisheye**, **Spline** (curva livre definida por pontos de controle — os traços se alinham à curva). Múltiplos assistentes podem estar ativos simultaneamente, e a intensidade do snapping é ajustável com um slider global.

### G'MIC Integration
Integração com a biblioteca de filtros G'MIC, que oferece **mais de 500 filtros** adicionais para processamento de imagem, muito além do que qualquer app de pintura inclui nativamente.

### Transform Mask (Máscara de Transformação)
Permite aplicar transformações (mover, rotacionar, escalar) de forma **não-destrutiva** como uma máscara. A transformação pode ser ajustada ou removida a qualquer momento sem perda de dados.

### Filter Layers e Filter Masks
Aplica filtros (desfoque, ajustes de cor, etc.) como camadas ou máscaras **não-destrutivas**. O filtro pode ser editado ou removido a qualquer momento. No Procreate, todos os ajustes são destrutivos (permanentes após aplicação).

### Animation com Onion Skinning e Audio
Timeline dedicada com **import de áudio** para sincronização de animação com som. Suporte a **onion skinning configurável**, **labels de cor por frame**, **duplicação de ranges de frames** e **export para spritesheet** (folha de sprites para jogos).

### Gerenciamento de Recursos (Resource Manager)
Sistema robusto para importar, exportar e gerenciar pincéis, padrões, gradientes, workspaces e bundles de recursos em formatos padronizados.

---

## ADOBE FRESCO (iPadOS, Windows)
**Fonte: helpx.adobe.com/fresco**

### Live Brushes — Aquarela (Watercolor)
O diferencial principal do Fresco. Utiliza o motor **Adobe Sensei AI** para simular aquarela com física de fluidos. Os pigmentos se **espalham**, **sangram** e **misturam** no canvas digital como fariam em papel molhado real. Configurações: **Water Flow** (quantidade de água — mais água = mais espalhamento), **Color Density** (densidade do pigmento), **Paper Wetness** (umidade do papel virtual — papel mais molhado causa mais bleeding).

### Live Brushes — Óleo (Oil)
Simulação de tinta a óleo com espessura/impasto visível. A tinta tem volume e pode ser misturada no canvas. A textura muda com a direção e pressão do traço. Configurações: **Paint Load** (quantidade de tinta carregada), **Viscosity** (viscosidade — mais viscosa = menos mistura), **Mix** (quanto a cor nova se mistura com a cor existente), **Cleanup** (quanto o pincel "limpa" ao tocar tinta existente).

### Pixel Brushes + Vector Brushes
O Fresco combina pincéis raster (pixel) e pincéis vetoriais no mesmo documento. Pincéis vetoriais criam traços redimensionáveis infinitamente sem perda de qualidade. Pode-se misturar camadas raster e vetoriais.

### Integração com Creative Cloud Libraries
Acesso direto a assets compartilhados do ecossistema Adobe: paletas de cor, pincéis, gráficos vetoriais do Illustrator, imagens do Lightroom. Sincronização em tempo real entre dispositivos.

### Motion e Retouch
Ferramentas herdadas do Photoshop, incluindo Content-Aware Fill simplificado para remoção de objetos.

---

## INFINITE PAINTER (Android, iOS)
**Fonte: Documentação e comunidade do Infinite Painter**

### Perspective Grids com Curvilinear
Suporta perspectivas com **5 pontos de fuga** (perspectiva curvilínea/fisheye), além dos tradicionais 1, 2 e 3 pontos. Configuração visual intuitiva.

### Symmetry com Repetição Circular Avançada
Espelhamento radial com número ilimitado de segmentos (2 a 120+), permitindo criação de mandalas complexas. Cada segmento pode ser configurado como espelhado ou rotacionado independentemente.

### Gradient Tool (Ferramenta de Gradiente)
Cria gradientes diretamente no canvas com controles de cor por ponto. O Procreate não possui uma ferramenta de gradiente dedicada (requer uso do Gaussian Blur como workaround ou criação manual com airbrush).

### Guias de Composição
Exibe sobreposições de composição como **Rule of Thirds** (regra dos terços), **Golden Ratio** (proporção áurea), **Golden Spiral** (espiral áurea) e **Dynamic Symmetry** diretamente sobre o canvas. Não editáveis como guias de desenho, mas úteis como referência de composição.

---

## SKETCHBOOK (Autodesk — gratuito, multiplataforma)
**Fonte: sketchbook.com/support**

### Predictive Stroke
Correção de traço preditiva que suaviza linhas em tempo real com algoritmo proprietário. Diferente do StreamLine do Procreate, usa predição baseada na velocidade e direção do traço, oferecendo uma sensação diferente de estabilização.

### Copic Color Library
Biblioteca integrada com **todas as cores oficiais Copic** (358 cores), organizadas por família de cor com os nomes e códigos reais dos marcadores. Permite trabalho digital que replica exatamente a paleta de marcadores Copic para artistas que fazem transição entre meios.

### French Curves e Réguas Flexíveis
Ferramentas que simulam réguas físicas que podem ser posicionadas no canvas. A **French Curve** (curva francesa) permite alinhar traços a curvas suaves predefinidas. A **Régua Reta** e a **Ellipse Guide** podem ser posicionadas e redimensionadas livremente.

### Flipbook Animation
Sistema de animação simplificado integrado com interface de flipbook (folheamento).

---

## COMPARATIVO DE FUNCIONALIDADES EXCLUSIVAS RELEVANTES

**Ferramentas que existem nos concorrentes mas NÃO no Procreate (até minha data de conhecimento):**

O Procreate não possui camadas vetoriais (CSP, Fresco, Krita possuem). Não possui réguas paramétricas posicionáveis (CSP e Krita possuem). Não possui múltiplos motores de pincel (Krita tem 10+). Não possui simulação de física de fluidos para aquarela (Fresco tem Live Brushes). Não possui ferramenta de gradiente dedicada (Infinite Painter tem). Não possui filtros não-destrutivos como Filter Masks (Krita tem). Não possui importação de modelos 3D (CSP tem). Não possui macros/ações automáticas (CSP tem Auto Actions). Não possui wrap-around mode para texturas tileable (Krita tem). Não possui importação de áudio para animação (Krita tem). Não possui perspectiva curvilínea de 5 pontos (Infinite Painter tem).

---

Este guia cobre as ferramentas documentadas oficialmente em cada aplicação. As interfaces e funcionalidades podem variar conforme atualizações dos apps após janeiro de 2025.