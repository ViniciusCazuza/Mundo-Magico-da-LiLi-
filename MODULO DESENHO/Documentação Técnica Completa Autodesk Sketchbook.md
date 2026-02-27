

# Documentação Técnica Completa: Autodesk Sketchbook

> **Fontes principais:** sketchbook.com (site oficial), documentação de ajuda do Sketchbook (help pages oficiais), Sketchbook blog, release notes, comunidades de artistas no Reddit (r/sketchbook, r/digitalpainting), fóruns de ilustração, reviews técnicos comparativos publicados, e informações disponíveis na App Store/Google Play.

---

## CONTEXTO E HISTÓRICO

O Sketchbook (anteriormente **Autodesk Sketchbook**) é um aplicativo de desenho e pintura digital originalmente desenvolvido pela **Autodesk**. Em 2021, a Autodesk transferiu a propriedade do Sketchbook para a **Sketchbook, Inc.**, uma empresa independente fundada pelos criadores originais do app. Desde então, o desenvolvimento continua de forma independente.

O Sketchbook está disponível para **iPadOS**, **iOS (iPhone)**, **Android**, **Windows** e **macOS**. A versão mobile/tablet é gratuita com funcionalidades essenciais, com uma assinatura **Sketchbook Pro** que desbloqueia ferramentas avançadas. A versão desktop tem um modelo similar.

A filosofia de design do Sketchbook é fundamentalmente diferente de concorrentes como Procreate, CSP ou Krita. O Sketchbook prioriza **simplicidade de interface, velocidade de acesso e experiência de desenho natural** sobre quantidade de funcionalidades. A interface é propositalmente minimalista, projetada para que a maior parte da tela seja canvas, com ferramentas acessíveis por gestos e menus radiais em vez de barras de ferramentas permanentes.

---

## PARTE 1: INTERFACE E FILOSOFIA DE DESIGN

### 1.1 Interface Minimalista

A interface do Sketchbook esconde quase todos os controles quando não estão em uso. O canvas ocupa a tela inteira por padrão. Os elementos de interface principais são:

**Toolbar (Barra de Ferramentas):** Uma barra compacta no topo da tela (posição padrão, pode ser reposicionada) contendo acesso a: pincel ativo, borracha, seletor de cor, camadas, e menu principal. Em dispositivos touch, a barra pode ser minimizada para um único ícone.

**Brush Puck (Disco de Pincel):** Um círculo flutuante que aparece na tela e permite ajustar rapidamente o **tamanho** (arrastando o anel externo) e a **opacidade** (arrastando o anel interno) do pincel ativo sem precisar abrir nenhum menu. É uma das características mais reconhecidas e elogiadas do Sketchbook — permite ajuste em tempo real com uma mão enquanto se desenha com a outra.

**Lagoon (Lagoa de Ferramentas):** Na versão para iPad/tablet, um dock semicircular na parte inferior da tela que contém slots para pincéis favoritos, ferramentas de seleção, transformação e outros atalhos. A Lagoon pode ser personalizada com as ferramentas mais usadas e recolhida quando não necessária.

---

## PARTE 2: FERRAMENTAS DE PINTURA E DESENHO

### 2.1 Biblioteca de Pincéis

O Sketchbook vem com uma biblioteca de pincéis organizados em categorias. A quantidade é menor que a do Procreate (que tem 200+), mas os pincéis são projetados para cobrir os casos de uso principais com alta qualidade.

**Categorias de pincéis padrão:**

**a) Pencils (Lápis)**
Incluem simulações de grafite em diferentes durezas. Os pincéis de lápis respondem a pressão (mais leve = mais claro e fino, mais forte = mais escuro e grosso) e a inclinação do stylus (inclinar produz traços mais largos e suaves, simulando a técnica de sombreamento com a lateral do lápis). Exemplos: Pencil, Sketchy Pencil, Graphite.

**b) Inks (Tintas)**
Pincéis para lineart e nanquim. Traços com bordas nítidas, variação de espessura baseada em pressão. Exemplos: Technical Pen (espessura uniforme), Ink Pen (variação de espessura), Felt Tip (caneta hidrográfica), Ballpoint Pen (esferográfica com leve textura).

**c) Markers (Marcadores)**
Uma das áreas de maior destaque do Sketchbook. Os pincéis de marcador são projetados para simular marcadores profissionais como **Copic**, **Prismacolor** e **Chartpak**. Comportamento: semitransparentes, com **acúmulo de cor** ao passar múltiplas vezes sobre a mesma área (como marcadores reais). Os marcadores têm bordas ligeiramente suaves e interagem com traços adjacentes criando transições naturais.

**d) Paintbrushes (Pincéis de Pintura)**
Simulações de pincéis tradicionais: Acrylic (acrílica), Oil Brush (óleo), Watercolor (aquarela simplificada — não com simulação de fluidos como o Fresco, mas com comportamento translúcido e bordas suaves). Soft Brush (pincel macio para blending).

**e) Airbrushes (Aerógrafos)**
Pincéis de spray suave para gradientes, iluminação e efeitos atmosféricos. Bordas completamente difusas, sem textura de grão. Soft Airbrush, Hard Airbrush.

**f) Texture Brushes (Pincéis de Textura)**
Para adicionar texturas ao canvas: Stipple (pontilhismo), Hatching (hachurado), Noise, Canvas Texture.

**g) Synthetic Brushes**
Pincéis especializados que combinam comportamentos: Chisel Tip (ponta biselada como marcador angular), Flat Marker, Blender (mistura cores existentes no canvas).

---

### 2.2 Brush Editor (Editor de Pincéis)

O Sketchbook possui um editor de pincéis para personalização, embora menos granular que o Brush Studio do Procreate ou os Brush Engines do Krita.

**Parâmetros editáveis:**

**a) Properties (Propriedades Gerais)**

- **Size (Tamanho):** Tamanho mínimo e máximo do pincel. O tamanho real durante o desenho é interpolado entre esses valores com base na pressão do stylus.
- **Opacity (Opacidade):** Opacidade mínima e máxima. A pressão controla a opacidade entre esses limites.
- **Spacing (Espaçamento):** Distância entre os dabs (stamps) do pincel como porcentagem do diâmetro. Valores baixos = traço contínuo; valores altos = traço pontilhado ou texturizado.

**b) Stamp (Carimbo/Forma)**

- **Shape (Forma):** A imagem base usada para cada dab do pincel. Pode ser selecionada de uma biblioteca de formas predefinidas ou importada como imagem personalizada. A forma define o contorno e a textura interna de cada stamp — um círculo suave para pincéis lisos, uma forma irregular para pincéis texturizados, uma forma alongada para pincéis chatos.
- **Rotation (Rotação):** Como a forma rotaciona ao longo do traço. Opções: **Fixed** (ângulo fixo), **Direction** (rotaciona para seguir a direção do traço), **Random** (rotação aleatória a cada dab).
- **Squeeze (Compressão):** Achata a forma do stamp para criar pincéis elípticos ou chatos. Valores de 0 (forma original) a máximo (muito achatada).
- **Randomness:** Variação aleatória na forma, tamanho e posição de cada dab.

**c) Texture (Textura/Grão)**

- **Texture Source:** Imagem de textura que é aplicada dentro do traço. Funciona como uma máscara de textura — áreas claras da textura deixam o pincel depositar tinta, áreas escuras bloqueiam.
- **Scale (Escala):** Tamanho da textura em relação ao stamp.
- **Intensity (Intensidade):** Quão pronunciada é a textura. Valores baixos = textura sutil; valores altos = textura muito visível com áreas sem tinta aparentes.

**d) Pressure Curve (Curva de Pressão)**

O Sketchbook oferece uma **curva de pressão editável** para cada pincel individualmente (além da curva global do app). A curva mapeia a pressão física do stylus (eixo X) à resposta do pincel (eixo Y). Pode-se criar curvas customizadas arrastando pontos de controle. Uma curva linear produz resposta proporcional. Uma curva com onset rápido torna o pincel mais sensível a toque leve. Uma curva com onset lento requer mais pressão para atingir o efeito máximo.

**e) Dual Brush (Pincel Duplo)**

O Sketchbook permite combinar **dois stamps/formas** em um único pincel. O resultado é a interseção visual das duas formas — criando pincéis com texturas compostas. Parâmetros do segundo brush: forma, tamanho, espaçamento e rotação independentes do primeiro. O modo de combinação entre os dois stamps define como interagem visualmente.

---

### 2.3 Importação e Exportação de Pincéis

O Sketchbook suporta importação de pincéis nos seguintes formatos:

- **.brush** (formato nativo do Sketchbook)
- Compatibilidade com importação de certos formatos de pincéis do **Photoshop (.abr)** — permitindo usar a vasta biblioteca de pincéis disponíveis online criados para Photoshop.

A exportação permite compartilhar pincéis personalizados no formato nativo .brush.

---

### 2.4 Smudge/Blend Tool (Ferramenta de Esfumaço/Mistura)

Mistura cores existentes no canvas arrastando-as. O Sketchbook oferece essa funcionalidade de duas formas:

**Blender Brushes:** Pincéis dedicados na biblioteca que funcionam como blenders — não depositam cor nova, apenas misturam o que existe. Diferentes blenders têm diferentes comportamentos (suave, direcional, texturizado).

**Smudge mode do pincel:** Alguns pincéis podem ser configurados para ter um componente de mistura, depositando cor enquanto simultaneamente esfumaçam. A intensidade da mistura depende das configurações do pincel.

---

### 2.5 Eraser (Borracha)

A borracha no Sketchbook pode usar **qualquer formato de pincel**, assim como no Procreate. Seleciona-se o pincel desejado e ativa-se o modo borracha. A borracha com um pincel texturizado apaga de forma texturizada. Tamanho e opacidade são ajustáveis independentemente do pincel de desenho.

---

## PARTE 3: COPIC COLOR LIBRARY — DIFERENCIAL EXCLUSIVO

### 3.1 O que é

Este é um dos **diferenciais mais importantes e exclusivos** do Sketchbook. A aplicação inclui a **biblioteca oficial de cores Copic** integrada — todas as **358 cores** dos marcadores Copic, organizadas por família de cor com os **nomes e códigos oficiais** dos marcadores.

### 3.2 Cores Copic — Sistema de Nomenclatura

Os marcadores Copic usam um sistema de codificação alfanumérico: a letra indica a família de cor (B = Blue, BG = Blue-Green, G = Green, YG = Yellow-Green, Y = Yellow, YR = Yellow-Red/Orange, R = Red, RV = Red-Violet, V = Violet, BV = Blue-Violet, E = Earth tones, W = Warm Gray, C = Cool Gray, N = Neutral Gray, T = Toner Gray). O primeiro dígito indica a saturação (0 = mais saturada, 9 = mais dessaturada). O segundo dígito indica o valor/luminosidade (0 = mais claro, 9 = mais escuro). Exemplo: **BG05** = Blue-Green, saturação máxima, valor 5 (médio-claro).

### 3.3 Como funciona no Sketchbook

No seletor de cor do Sketchbook, existe uma aba/opção dedicada para a **Copic Color Library**. Ao acessar:

- As cores são organizadas em famílias idênticas ao sistema Copic real.
- Cada cor exibe seu **código oficial** (ex: R29, E33, BV04) e o **nome descritivo** (ex: "Lipstick Red", "Sand", "Blue Berry").
- As cores são **colorimetricamente calibradas** para corresponder o mais próximo possível às cores reais dos marcadores Copic em papel.
- Ao selecionar uma cor Copic, ela se torna a cor ativa e pode ser usada com qualquer pincel.

### 3.4 Por que é relevante

Artistas profissionais que trabalham com marcadores Copic frequentemente fazem planejamento de paletas e composição digital antes de executar em marcadores físicos. Com a biblioteca Copic integrada, podem testar combinações de cores exatas no digital, planejar quais marcadores comprar (marcadores Copic são caros — cerca de \$5-\$8 por unidade), e criar versões digitais fiéis de trabalhos feitos originalmente em marcador. Para artistas de design industrial, design automotivo e design de produto — onde marcadores Copic são ferramentas profissionais padrão — esta funcionalidade é particularmente valiosa.

Nenhum outro app de pintura digital (Procreate, CSP, Krita, Fresco) inclui a biblioteca Copic oficial integrada.

---

## PARTE 4: FERRAMENTAS DE DESENHO DE PRECISÃO

### 4.1 Predictive Stroke (Traço Preditivo)

**O que é:** Um sistema de estabilização/suavização de traço que é diferente do StreamLine do Procreate.

**Como funciona:** Enquanto o StreamLine do Procreate funciona suavizando o caminho do traço com um algoritmo de média móvel (o traço "persegue" o cursor com atraso), o Predictive Stroke do Sketchbook usa um algoritmo **preditivo** que analisa a velocidade, direção e aceleração do traço para inferir a forma pretendida. O resultado é que o traço corrigido aparece mais próximo da intenção do artista e menos como um atraso mecânico.

**Configuração:** Ativado/desativado nas preferências de desenho. A intensidade da predição pode ser ajustada. Em configurações baixas, o traço é quase fiel ao movimento real da mão. Em configurações altas, curvas são significativamente suavizadas e linhas retas são endireitadas automaticamente.

**Diferença prática vs. StreamLine:** O StreamLine do Procreate introduz um atraso visual (o traço se desenha atrás do cursor) que pode ser desorientante para artistas acostumados a feedback imediato. O Predictive Stroke do Sketchbook tende a produzir um traço mais responsivo com menos atraso percebido, embora a diferença seja sutil e a preferência é subjetiva.

---

### 4.2 Steady Stroke

Além do Predictive Stroke, o Sketchbook oferece o **Steady Stroke**, que é uma estabilização mais tradicional similar ao StreamLine. Quando ativado, o traço segue o cursor com um atraso controlado, resultando em linhas mais suaves. A intensidade do atraso é configurável.

A existência de **dois sistemas de estabilização independentes** (Predictive Stroke e Steady Stroke) é um diferencial — o artista pode escolher o método que melhor se adapta ao seu estilo, ou combinar ambos.

---

### 4.3 Réguas e Guias — French Curves e Réguas Flexíveis

Este é um **diferencial significativo** do Sketchbook que não tem equivalente direto no Procreate.

#### Straight Edge (Régua Reta)

Ativa uma régua reta virtual na tela. Ao ativar, dois handles (alças) aparecem que podem ser posicionados livremente. O traço se alinha à linha entre os dois handles. A régua pode ser **movida** (arrastando o corpo da régua), **rotacionada** (arrastando os handles), e **travada** em ângulos específicos (snapping angular opcional a incrementos configuráveis como 15°, 30°, 45°, 90°). A régua permanece visível como uma sobreposição semitransparente no canvas até ser desativada. Diferente das guias de perspectiva do Procreate (que são globais e afetam todos os traços), a régua do Sketchbook é posicional — só afeta traços feitos junto à régua.

#### French Curve (Curva Francesa)

Ferramenta que simula uma curva francesa física — uma peça de plástico com curvaturas variadas usada em desenho técnico para traçar curvas suaves.

**Como funciona:** Ao ativar, uma forma curva aparece na tela. A curva pode ser: **movida** (arrastando), **rotacionada** (girando com gestos), **redimensionada** (pinch zoom). Ao desenhar próximo à borda da curva, o traço se alinha (snaps) ao contorno da curva. O artista pode reposicionar a curva francesa em qualquer lugar do canvas e usá-la como guia para diferentes seções da ilustração.

**Formas disponíveis:** O Sketchbook oferece diferentes shapes de curva francesa, cada uma com contornos de curvaturas variadas — de curvas suaves e amplas a curvas mais acentuadas. Isso replica a experiência de ter um conjunto de curvas francesas físicas.

**Diferencial:** Nenhum outro app de pintura digital oferece uma simulação de curva francesa posicionável. O CSP e Krita têm réguas curvas (Bézier), mas funcionam de forma diferente — define-se pontos de controle para criar a curva. A French Curve do Sketchbook é um objeto pré-formado que se posiciona, mais intuitivo para artistas com experiência em ferramentas de desenho técnico físicas.

#### Ellipse Guide (Guia de Elipse)

Uma guia de elipse posicionável que permite desenhar elipses perfeitas com controle total.

**Configurações:** **Posição** (centro da elipse, arrastável), **Largura e Altura** (raios maior e menor, ajustáveis independentemente por handles), **Rotação** (ângulo da elipse, arrastável), **Grau/Abertura** (ângulo de visão da elipse — simula como um círculo aparece em perspectiva a diferentes ângulos, de elipse fina/quase linha a círculo completo). Os traços se alinham ao contorno da elipse ao desenhar próximo a ela.

**Uso prático:** Essencial para design industrial, design automotivo (rodas, faróis, volantes), e ilustração arquitetônica (arcos, colunas). Artistas de concept design e design de produto valorizam particularmente esta ferramenta.

#### Ruler (Régua com Medida)

Régua reta com **marcações de distância** visíveis — como uma régua física com centímetros ou polegadas. Além de guiar o traço em linha reta, permite que o artista meça distâncias relativas no canvas. Pode-se usar as marcações para manter proporções consistentes (ex: todos os olhos na mesma distância, espaçamento regular entre colunas).

---

### 4.4 Symmetry Tools (Ferramentas de Simetria)

O Sketchbook oferece ferramentas de simetria para espelhamento em tempo real.

**Symmetry X (Simetria Vertical):** Espelha o traço ao longo do eixo vertical. Tudo que se desenha de um lado aparece espelhado do outro. O eixo pode ser **reposicionado** no canvas.

**Symmetry Y (Simetria Horizontal):** Espelha ao longo do eixo horizontal.

**Symmetry XY (Simetria em 4 quadrantes):** Espelha em ambos os eixos simultaneamente — o que se desenha em um quadrante aparece em todos os quatro.

**Radial Symmetry:** Espelhamento radial com número configurável de segmentos. O Sketchbook permite configurações de até múltiplos segmentos para criação de padrões radiais, rosetas e mandalas.

O eixo de simetria é representado visualmente por uma linha no canvas e pode ser reposicionado e rotacionado livremente.

---

## PARTE 5: SISTEMA DE CAMADAS

### 5.1 Painel de Camadas

Acessado pelo ícone de camadas na toolbar. O Sketchbook suporta um número significativo de camadas (o limite varia com o tamanho do canvas e a memória disponível do dispositivo).

**Operações por camada:**

- **Adicionar camada** (cria nova camada vazia)
- **Duplicar camada**
- **Deletar camada**
- **Reordenar** (arrastar para cima/baixo na pilha)
- **Visibilidade** (toggle para mostrar/ocultar)
- **Renomear**
- **Opacidade** (slider de 0% a 100%)
- **Lock Transparency (Bloquear Transparência):** Equivalente ao Alpha Lock do Procreate — só permite pintar onde já existem pixels, preservando áreas transparentes.
- **Lock Layer (Bloquear Camada):** Impede qualquer modificação na camada, protegendo-a de edições acidentais.
- **Merge Down (Mesclar com a camada abaixo)**
- **Flatten (Achatar todas as camadas)**

### 5.2 Blend Modes (Modos de Mesclagem)

O Sketchbook suporta os blend modes padrão da indústria:

**Normal:** Comportamento padrão — pixels da camada superior cobrem os inferiores de acordo com a opacidade.

**Multiply (Multiplicar):** Escurece a imagem multiplicando os valores de cor. Brancos desaparecem. Usado para sombreamento — pintar sombras em uma camada Multiply sobre a arte base escurece sem alterar as cores subjacentes de forma abrupta.

**Screen (Tela):** O oposto do Multiply — clareia a imagem. Pretos desaparecem. Usado para adicionar iluminação e brilhos.

**Add (Adicionar):** Soma os valores de cor, criando um efeito de clarear muito intenso. Usado para efeitos de luz forte, brilho e partículas luminosas.

**Overlay (Sobreposição):** Combina Multiply e Screen — escurece sombras e clareia luzes, aumentando o contraste. Preserva os meios-tons da camada inferior. Usado para color grading e ajuste de contraste.

**Darken (Escurecer):** Compara cada pixel e mantém o mais escuro entre a camada superior e inferior.

**Lighten (Clarear):** Compara cada pixel e mantém o mais claro.

**Color Burn (Queima de Cor):** Escurece e satura as cores da camada inferior com base na camada superior.

**Color Dodge (Subexposição de Cor):** Clareia e satura intensamente. Produz efeitos de brilho muito vibrantes.

**Soft Light (Luz Suave):** Versão mais sutil do Overlay. Usado para ajustes delicados de cor e iluminação.

**Hard Light (Luz Forte):** Versão mais intensa do Overlay. Usado para efeitos dramáticos de iluminação.

**Difference (Diferença):** Calcula a diferença absoluta entre as cores das duas camadas. Útil para efeitos especiais e verificação de alinhamento.

**Exclusion (Exclusão):** Similar a Difference, mas com menos contraste.

**Hue (Matiz):** Aplica a matiz da camada superior mantendo saturação e luminosidade da inferior.

**Saturation (Saturação):** Aplica a saturação da camada superior mantendo matiz e luminosidade da inferior.

**Color (Cor):** Aplica a matiz e saturação da camada superior mantendo a luminosidade da inferior. Usado para colorização de lineart ou fotografias em preto e branco.

**Luminosity (Luminosidade):** Aplica a luminosidade da camada superior mantendo matiz e saturação da inferior.

### 5.3 Agrupamento de Camadas

Camadas podem ser organizadas em **grupos (folders)**, que podem ser colapsados para economia de espaço no painel. Grupos podem ter seu próprio blend mode e opacidade, que afetam todas as camadas dentro do grupo coletivamente.

---

## PARTE 6: FERRAMENTAS DE COR

### 6.1 Color Editor (Editor de Cor)

O seletor de cor do Sketchbook oferece múltiplas interfaces:

**a) Color Wheel (Roda de Cores)**
Uma roda de matiz (hue) circular com um triângulo ou quadrado interno para seleção de saturação e valor. Toca-se na roda para selecionar a matiz e no triângulo/quadrado para ajustar saturação e brilho. A roda segue o modelo **HSB (Hue, Saturation, Brightness)**.

**b) Sliders (Controles Deslizantes)**
Sliders numéricos individuais para ajuste preciso. Modos: **HSB** (Hue, Saturation, Brightness), **RGB** (Red, Green, Blue). Campo hexadecimal para entrada de código de cor exata (ex: #FF5733).

**c) Copic Color Library** (detalhada na Parte 3)

**d) Color Palettes (Paletas de Cor)**
Paletas salvas com amostras de cores fixas. O Sketchbook permite criar paletas personalizadas, adicionando cores individualmente. As paletas podem ser organizadas e renomeadas.

### 6.2 Eyedropper (Conta-gotas)

Ativado por gesto (touch-and-hold no canvas) ou botão dedicado. Ao ativar, aparece uma lupa mostrando a cor do pixel sob o cursor. A cor selecionada se torna a cor ativa. O Sketchbook exibe a cor anterior e a nova para comparação visual.

### 6.3 Color Harmony — HSB Sliders com Relações Cromáticas

Embora menos elaborado que o painel Harmony do Procreate (que mostra complementar, tríade, etc. na roda), o Sketchbook permite que artistas naveguem pela roda de cores com consciência de relações cromáticas através da visualização da roda completa.

---

## PARTE 7: FERRAMENTAS DE SELEÇÃO E TRANSFORMAÇÃO

### 7.1 Selection Tools (Ferramentas de Seleção)

**a) Rectangle Select (Seleção Retangular)**
Arrasta-se para criar uma seleção retangular. A seleção é indicada por linhas tracejadas animadas ("marching ants").

**b) Lasso Select (Seleção Laço)**
Desenha-se à mão livre o contorno da seleção. Ao fechar o contorno (retornando ao ponto inicial), a área é selecionada.

**c) Magic Wand (Varinha Mágica)**
Toca-se em uma área e pixels de cor similar são selecionados automaticamente. A tolerância (threshold) é ajustável — controla quão diferentes as cores podem ser e ainda serem incluídas na seleção.

**Operações com seleção:**
**Add to Selection** (adicionar à seleção existente segurando modificador ou selecionando modo), **Subtract from Selection** (remover da seleção), **Invert Selection** (inverter — o que estava selecionado fica deselecionado e vice-versa), **Deselect** (remover toda seleção). Enquanto uma seleção está ativa, as ferramentas de pintura só afetam a área selecionada.

### 7.2 Transform Tool (Ferramenta de Transformação)

Ao ativar a transformação (com ou sem seleção ativa), o conteúdo da camada pode ser:

- **Movido** (arrastando)
- **Redimensionado** (arrastando handles de canto — manter proporção é configurável)
- **Rotacionado** (girando com gesto rotacional ou arrastando um handle de rotação)
- **Distorcido** (modo distort, onde cada canto pode ser movido independentemente para criar distorções em perspectiva)

**Interpolação:** O Sketchbook utiliza algoritmos de interpolação para suavizar o conteúdo ao transformar, evitando pixelização excessiva ao ampliar.

---

## PARTE 8: FERRAMENTAS DE FORMAS E TEXTO

### 8.1 Shape Tools (Ferramentas de Formas)

O Sketchbook possui ferramentas para desenhar formas geométricas perfeitas.

**Line (Linha):** Desenha uma linha reta entre dois pontos. A espessura e opacidade seguem as configurações do pincel ativo. Pode-se segurar para travar em ângulos específicos.

**Rectangle (Retângulo):** Desenha um retângulo arrastando de um canto ao oposto. Pode-se configurar para manter proporções quadradas (quadrado perfeito). O retângulo pode ser preenchido, ter apenas contorno, ou ambos.

**Ellipse/Circle (Elipse/Círculo):** Desenha uma elipse arrastando. Pode-se travar para criar um círculo perfeito. Mesmas opções de preenchimento e contorno.

**Polyline (Polilinha):** Desenha uma série de segmentos de linha reta conectados, clicando para cada vértice. Útil para formas angulares e poligonais.

### 8.2 Fill Tool (Ferramenta de Preenchimento)

Preenche uma área fechada com cor sólida. Ao tocar em uma área, todos os pixels contíguos de cor similar são preenchidos. A tolerância é ajustável para controlar quão estritamente a ferramenta respeita as bordas.

### 8.3 Text Tool (Ferramenta de Texto)

O Sketchbook inclui capacidade de adicionar texto editável ao canvas. Funcionalidades: seleção de fonte (fontes do sistema), tamanho, cor, e posicionamento. O texto pode ser movido e redimensionado. Após confirmar a posição, o texto é rasterizado na camada.

---

## PARTE 9: AJUSTES E FILTROS

### 9.1 Ajustes de Imagem Disponíveis

O Sketchbook oferece um conjunto de ajustes mais enxuto que concorrentes, coerente com sua filosofia de simplicidade.

**a) Hue/Saturation/Brightness (Matiz/Saturação/Brilho)**
Três sliders para ajustar matiz (deslocamento no espectro), saturação (intensidade das cores) e brilho (luminosidade). Aplicado à camada ativa ou à seleção.

**b) Color Balance (Balanço de Cor)**
Ajusta o equilíbrio entre pares de cores complementares com sliders para Shadows, Midtones e Highlights separadamente.

**c) Brightness/Contrast (Brilho/Contraste)**
Sliders simples para ajustar brilho geral e contraste da camada.

**d) Invert (Inverter)**
Inverte todas as cores da camada (negativo fotográfico).

**e) Gaussian Blur (Desfoque Gaussiano)**
Aplica desfoque suave com controle de raio/intensidade. Aplicado destrutivamente (assim como no Procreate).

**f) Sharpen (Nitidez)**
Aumenta a nitidez/definição dos detalhes. Controle de intensidade.

**Observação importante:** Assim como no Procreate, todos os ajustes no Sketchbook são **destrutivos** — uma vez aplicados, os pixels são permanentemente alterados. Não há sistema de Filter Layers ou Filter Masks como no Krita.

---

## PARTE 10: FLIPBOOK ANIMATION

### 10.1 Sistema de Animação

O Sketchbook inclui um modo de **Flipbook Animation** — animação frame-a-frame simplificada que evoca o conceito de flipbook (livro de folhear).

**Ativação:** Acessível pelo menu principal. Ao ativar, o Sketchbook entra em modo de animação com uma interface simplificada.

**Funcionalidades:**

**Frames:** Cada frame é uma tela independente. Pode-se adicionar novos frames, duplicar frames existentes, reordenar frames e deletar frames.

**Onion Skinning:** Exibe frames anteriores e/ou posteriores em transparência sobre o frame atual, permitindo ver o movimento e manter consistência entre frames. Configurações: número de frames fantasma visíveis (antes e depois), opacidade dos frames fantasma, cores diferenciadas para frames anteriores e posteriores.

**Playback:** Reprodução da animação em loop. Controle de **FPS (Frames Per Second)** — velocidade de reprodução.

**Exportação:** A animação pode ser exportada como sequência de imagens (PNG), GIF animado, ou vídeo.

**Limitação:** O sistema de animação do Sketchbook é significativamente mais simples que o do CSP (que tem timeline multi-track) ou Krita (que tem keyframing, audio sync e interpolation). É mais comparável ao Animation Assist do Procreate em escopo, sendo adequado para animações curtas e testes de movimento, mas não para projetos de animação complexos.

---

## PARTE 11: SCAN SKETCH — FUNCIONALIDADE DE DIGITALIZAÇÃO

### 11.1 O que é

O Sketchbook inclui uma funcionalidade de **Scan Sketch** que permite digitalizar desenhos feitos em papel usando a câmera do dispositivo, com processamento automático para limpeza.

### 11.2 Como funciona

**Captura:** Ao ativar Scan Sketch, a câmera do dispositivo é aberta. Aponta-se a câmera para um desenho em papel e captura-se a imagem.

**Processamento automático:** O Sketchbook processa a imagem capturada para: **remover o fundo do papel** (tornando-o transparente), **aumentar o contraste das linhas** (escurecendo o lineart e clareando/removendo manchas e sombras do papel), **correção de perspectiva** (se a foto foi tirada em ângulo, o app tenta retificar a perspectiva para que o desenho fique "plano"). O resultado é uma camada com o lineart limpo sobre fundo transparente, pronto para colorização digital.

**Importação:** O sketch digitalizado é importado como uma nova camada no canvas, onde pode ser posicionado, redimensionado e utilizado como base para pintura digital.

### 11.3 Relevância

Esta funcionalidade atende ao workflow de artistas que preferem esboçar em papel e colorir digitalmente. Embora apps como o Procreate permitam importar fotos, o processamento automático do Sketchbook (remoção de fundo, limpeza, ajuste de contraste) é uma conveniência que elimina passos manuais.

---

## PARTE 12: GESTOS E ATALHOS

### 12.1 Gestos Padrão

- **Pinch zoom:** Zoom in/out e rotação do canvas com dois dedos.
- **Two-finger tap:** Undo (desfazer).
- **Three-finger tap:** Redo (refazer).
- **Touch and hold:** Eyedropper (conta-gotas).
- **Three-finger swipe down:** Abre opções de copiar/colar (em algumas versões).

### 12.2 Brush Puck (reiterado por importância)

O Brush Puck é um elemento de interface flutuante que merece destaque por ser uma inovação de UX do Sketchbook. É um disco semitransparente que pode ser posicionado em qualquer lugar da tela. O anel externo controla o tamanho do pincel (arrasta-se circularmente para aumentar/diminuir). O anel interno controla a opacidade. O feedback é visual e imediato — o cursor do pincel muda de tamanho em tempo real. Isso permite ajustes constantes e rápidos sem interromper o fluxo de trabalho.

---

## PARTE 13: CANVAS E DOCUMENTO

### 13.1 Criação de Canvas

Ao criar um novo documento, configura-se: **Width e Height** (largura e altura em pixels, polegadas, centímetros ou milímetros), **DPI/PPI** (resolução — 72 para tela, 150 para impressão média, 300 para impressão de alta qualidade), **Orientation** (paisagem ou retrato), **Background Color** (cor de fundo — branco, preto, transparente ou cor personalizada).

O Sketchbook suporta canvas de tamanho considerável, embora o limite máximo dependa do dispositivo e da memória RAM disponível. O número máximo de camadas também é limitado pelo tamanho do canvas e memória.

### 13.2 Formatos de Exportação

- **TIFF** (com camadas preservadas)
- **PSD** (formato Photoshop — preserva camadas, blend modes e opacidade, permitindo continuação do trabalho em Photoshop ou outros apps compatíveis com PSD)
- **PNG** (imagem achatada com transparência)
- **JPEG** (imagem achatada, compressão lossy)
- **BMP** (bitmap sem compressão)

A exportação em **PSD com camadas** é particularmente importante para workflows profissionais, pois permite transição fluida entre Sketchbook e outros softwares da pipeline de produção.

### 13.3 Importação de Imagens

Permite importar imagens nos formatos comuns (JPEG, PNG, TIFF, PSD, BMP) como novas camadas no canvas. A imagem importada pode ser reposicionada e transformada.

---

## PARTE 14: PREFERÊNCIAS E CONFIGURAÇÕES GLOBAIS

### 14.1 Stylus Settings (Configurações de Stylus)

- **Global Pressure Curve:** Curva de pressão global que afeta todos os pincéis. Editável com pontos de controle. Permite que o artista calibre a resposta de pressão do stylus para seu estilo de trabalho e força de mão.
- **Palm Rejection:** Rejeição de palma para uso com stylus — ignora toques da palma da mão enquanto se desenha com o stylus.

### 14.2 Interface Settings

- **Handedness:** Configuração para destros ou canhotos — reposiciona elementos de interface (como a Lagoon e o Brush Puck) para o lado apropriado.
- **Background Color:** Cor da área ao redor do canvas.
- **UI Brightness:** Ajuste de brilho da interface (claro/escuro).

---

## PARTE 15: DIFERENCIAIS EXCLUSIVOS DO SKETCHBOOK — RESUMO COMPARATIVO

### 15.1 vs. Procreate

**Vantagens do Sketchbook sobre o Procreate:**

O Sketchbook oferece a **Copic Color Library** oficial — funcionalidade ausente em todos os concorrentes. Possui **French Curve, Ellipse Guide e réguas posicionáveis** com comportamento que simula ferramentas físicas de desenho técnico — o Procreate não tem equivalente (suas guias de desenho são grades e perspectivas fixas, não ferramentas posicionáveis). O **Brush Puck** para ajuste de tamanho/opacidade é mais rápido que os sliders laterais do Procreate para ajustes frequentes. O **Scan Sketch** com processamento automático é mais avançado que simplesmente importar uma foto no Procreate. É **multiplataforma** (iOS, Android, Windows, macOS), enquanto o Procreate é exclusivo iPad. A importação de **pincéis .abr do Photoshop** amplia significativamente a biblioteca disponível. O **Predictive Stroke + Steady Stroke** oferece dois métodos de estabilização distintos vs. o único StreamLine do Procreate.

**Vantagens do Procreate sobre o Sketchbook:**

O Procreate tem um **Brush Studio muito mais profundo** com controles granulares para cada aspecto do pincel (Shape, Grain, Dynamics, Apple Pencil, Wet Mix, Color Dynamics, Rendering). Possui **muito mais pincéis padrão** (200+ vs. biblioteca menor do Sketchbook). Oferece **ajustes de imagem mais completos** (Curves, Gradient Map, Liquify, Glitch, Halftone, Chromatic Aberration, Bloom, Motion Blur, Perspective Blur). O sistema de **Drawing Guide** com perspectiva de 1-3 pontos com snap automático é mais poderoso para ilustração arquitetônica que as réguas do Sketchbook. O **Animation Assist** é comparável ao Flipbook do Sketchbook mas oferece controles ligeiramente mais detalhados. O **QuickShape** (correção automática de formas) é mais versátil. O **timelapse automático** grava todo o processo de criação. Oferece mais **blend modes** (27 vs. ~16 do Sketchbook). O **ColorDrop** com threshold ajustável é mais refinado que o fill do Sketchbook. O Procreate tem **Clipping Masks e Layer Masks** mais robustas.

---

### 15.2 vs. Clip Studio Paint

**Vantagens do Sketchbook sobre o CSP:**

Interface significativamente mais **simples e intuitiva** — o CSP tem uma das interfaces mais complexas entre apps de arte digital, com dezenas de paletas e menus. O **Brush Puck** é mais rápido para ajustes que a paleta de propriedades do CSP. As **French Curves e Ellipse Guides** posicionáveis são mais intuitivas que o sistema de réguas do CSP para certos workflows (design industrial). A **Copic Color Library** é exclusiva. O Sketchbook é **gratuito** nas funcionalidades básicas vs. CSP que é pago (assinatura ou licença). O **Scan Sketch** não tem equivalente direto no CSP. A **curva de aprendizado** do Sketchbook é drasticamente menor.

**Vantagens do CSP sobre o Sketchbook:**

O CSP possui **camadas vetoriais completas** com edição de nós, borracha vetorial e correção de linhas. Tem **sistema de réguas** muito mais extenso (10+ tipos especializados). Oferece **modelos 3D** articuláveis. Possui **Auto Actions** (macros). Tem **screentone** e ferramentas de mangá dedicadas. O editor de pincéis é mais profundo. O sistema de camadas é mais robusto com mais blend modes e funcionalidades. A timeline de animação é significativamente mais poderosa. Suporta **documentos multipágina** para quadrinhos e mangá.

---

### 15.3 vs. Krita

**Vantagens do Sketchbook sobre o Krita:**

O Sketchbook é drasticamente mais **simples e acessível** — Krita é complexo e voltado para usuários avançados. Disponível nativamente para **iPad e Android tablets** — Krita não tem versão iOS e sua versão Android é limitada. O **Brush Puck** e a interface minimalista proporcionam experiência de desenho mais fluida em tablets. As **French Curves** são mais intuitivas que os Assistants do Krita para uso casual. A **Copic Color Library** é exclusiva. O **Scan Sketch** não tem equivalente no Krita.

**Vantagens do Krita sobre o Sketchbook:**

O Krita tem **10+ brush engines** fundamentalmente diferentes. Possui **filtros não-destrutivos** (Filter Masks, Filter Layers, Transform Masks). Oferece **Wrap Around Mode** para texturas tileable. Tem **importação de áudio** na timeline de animação. Possui **Pop-up Palette** configurável. Tem **G'MIC** com 500+ filtros. Oferece **camadas vetoriais** baseadas em SVG. É completamente **gratuito e open source** sem nenhuma restrição. Suporte a **Python scripting** para automação. Sistema de **Resource Management** para pincéis e assets.

---

### 15.4 vs. Adobe Fresco

**Vantagens do Sketchbook sobre o Fresco:**

A **Copic Color Library** é exclusiva. As **French Curves e réguas** posicionáveis não existem no Fresco. O **Scan Sketch** é mais desenvolvido. O Sketchbook é **independente** do ecossistema Adobe e não requer assinatura Creative Cloud. A interface é mais simples e focada. O **Predictive Stroke** e **Steady Stroke** são dois sistemas de estabilização vs. a estabilização básica do Fresco. O Sketchbook funciona em **Android** — Fresco não tem versão Android.

**Vantagens do Fresco sobre o Sketchbook:**

O Fresco tem **Live Brushes** com simulação de física de fluidos para aquarela e volume de tinta para óleo — incomparavelmente mais avançado que os pincéis de aquarela e óleo do Sketchbook. Possui **pincéis vetoriais** integrados com Illustrator. A integração com **Creative Cloud** e ecossistema Adobe (Photoshop, Illustrator, Lightroom) é incomparável. Os pincéis de Photoshop são nativamente compatíveis com total fidelidade. Possui mais ajustes e filtros.

---

## PARTE 16: FUNCIONALIDADES DA VERSÃO PRO (ASSINATURA)

A versão gratuita do Sketchbook inclui as ferramentas essenciais de desenho e pintura. A assinatura **Sketchbook Pro** desbloqueia funcionalidades avançadas, que incluem (com base nas informações disponíveis até janeiro de 2025):

- **Mais pincéis** — acesso à biblioteca completa de pincéis, incluindo sets profissionais adicionais.
- **Brush Editor completo** — acesso a todos os parâmetros de personalização de pincéis (alguns parâmetros avançados são restritos na versão gratuita).
- **Camadas adicionais** — limite expandido de camadas.
- **Ferramentas de precisão avançadas** — acesso completo a réguas, curvas francesas, guia de elipse.
- **Flipbook Animation**
- **Exportação em formatos avançados** (PSD com camadas, TIFF)
- **Canvas de tamanho maior**
- **Copic Color Library completa**
- **Gradient e Pattern Fill** tools
- **Selection tools avançados** — Magic Wand e modos adicionais
- **Distort transform**
- **Text tool**

---

## PARTE 17: PONTOS FORTES RECONHECIDOS PELA COMUNIDADE

Com base em fóruns, reviews e feedback de artistas:

**Design Industrial e de Produto:** O Sketchbook é frequentemente citado como o app preferido por designers industriais e de produto, especialmente pela combinação de Copic Colors, Ellipse Guide, French Curves e marcadores digitais. Profissionais vindos do design automotivo (onde Copic markers e ellipse templates são ferramentas padrão) encontram no Sketchbook o equivalente digital mais fiel ao seu workflow tradicional.

**Sketching rápido e ideação:** A interface minimalista e o acesso rápido às ferramentas (via Brush Puck e Lagoon) tornam o Sketchbook excelente para sessões rápidas de esboço e brainstorming visual — menos tempo navegando menus, mais tempo desenhando.

**Transição do tradicional:** Para artistas que vêm do desenho tradicional, a experiência do Sketchbook é frequentemente descrita como a mais "natural" e menos intimidadora entre os apps de arte digital, devido à simplicidade da interface e ao foco em ferramentas que simulam instrumentos físicos familiares.

**Multiplataforma:** Artistas que trabalham em múltiplos dispositivos (iPad em mobilidade, PC no estúdio, telefone para esboços rápidos) valorizam a disponibilidade cross-platform com interface consistente.

**Limitações reconhecidas:** A comunidade reconhece que o Sketchbook é menos poderoso para: pintura digital avançada (onde Procreate, CSP e Krita se destacam), quadrinhos e mangá (onde CSP domina), animação (onde CSP e Krita são superiores), e edição de imagem (onde nenhum deles substitui Photoshop). O Sketchbook é melhor descrito como **excelente para desenho e esboço, bom para pintura básica, e limitado para workflows complexos**.

---

> Esta documentação reflete funcionalidades verificáveis com base nas fontes oficiais e comunitárias disponíveis até janeiro de 2025. Atualizações do aplicativo após essa data podem ter introduzido ou removido funcionalidades.