---
name: Jambu — Registro pessoal
description: Registro pessoal compartilhado por Android e web, com dados locais e composição responsiva.
colors:
  verde-profundo: "#072C0D"
  verde-vivo: "#3BE058"
  amarelo: "#FFCE0F"
  branco: "#FFFFFF"
  fundo-escuro: "#101110"
  superficie-clara: "#F2F5F2"
  superficie-escura: "#1C1F1C"
  elevada-escura: "#242624"
  texto-escuro: "#F7F9F6"
  texto-secundario-claro: "#636863"
  texto-secundario-escuro: "#ABB3AB"
  linha-clara: "#DCE2DC"
  linha-escura: "#303630"
  borda-escura: "#869086"
  positivo-claro: "#21762F"
  positivo-escuro: "#B3FDBA"
  positivo-fundo-claro: "#E8F7E9"
  nota-baixa-claro: "#B42318"
  nota-baixa-escuro: "#FFB4AB"
  nota-media-claro: "#8A6507"
  nota-media-escuro: "#E6C16A"
  erro-claro: "#B42318"
  erro-escuro: "#FFB4AB"
  scrim-claro: "rgba(7,17,7,0.52)"
  scrim-escuro: "rgba(0,0,0,0.65)"
  foco: "#1AA332"
typography:
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "23px"
  emphasis:
    fontFamily: "Figtree, sans-serif"
    fontWeight: 600
  # Legado: primitivas web anteriores; telas atuais usam native-title/native-bar.
  title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: "36px"
    letterSpacing: "-0.6px"
  title-desktop:
    fontFamily: "Figtree, sans-serif"
    fontSize: "29px"
    fontWeight: 600
    lineHeight: "42px"
    letterSpacing: "-0.6px"
  title-feed-desktop:
    fontFamily: "Figtree, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: "44px"
    letterSpacing: "-0.7px"
  relato:
    fontFamily: "Figtree, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "23px"
  input:
    fontFamily: "Figtree, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  button:
    fontFamily: "Figtree, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "22px"
  rating:
    fontFamily: "Figtree, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "29px"
  rating-grid:
    fontFamily: "Figtree, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "25px"
  dish-title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: "27px"
    letterSpacing: "-0.4px"
  # Atual: média numérica do post compartilhado.
  post-score:
    fontFamily: "Figtree, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: "28px"
  comment-body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  # Atuais: estes papéis atendem telas compartilhadas Android/web.
  native-title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "29px"
  native-bar:
    fontFamily: "Figtree, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "26px"
  native-input:
    fontFamily: "Figtree, sans-serif"
    fontSize: "17px"
    fontWeight: 400
rounded:
  control: "12px"
  photo: "14px"
  panel: "16px"
  sheet-top: "24px"
  composer: "30px"
spacing:
  tight: "4px"
  label: "7px"
  compact: "8px"
  control: "12px"
  content: "16px"
  gutter: "20px"
  group: "24px"
  section: "28px"
  gutter-wide: "36px"
  social-inset: "64px"
components:
  button-primary-light:
    backgroundColor: "{colors.verde-profundo}"
    textColor: "{colors.branco}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "12px 20px"
  button-secondary-light:
    backgroundColor: "{colors.superficie-clara}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "12px 20px"
  button-primary-dark:
    backgroundColor: "{colors.verde-vivo}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "12px 20px"
  button-secondary-dark:
    backgroundColor: "{colors.superficie-escura}"
    textColor: "{colors.texto-escuro}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "12px 20px"
  field:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    height: "52px"
    padding: "12px 15px"
  nav-item:
    backgroundColor: "{colors.superficie-clara}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: "50px"
    padding: "0 14px"
  chip-selected:
    backgroundColor: "{colors.superficie-clara}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 18px"
  meal-card:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.relato}"
    padding: "0 0 28px"
  rating:
    textColor: "{colors.verde-profundo}"
    typography: "{typography.rating}"
    size: "17px"
  native-field:
    backgroundColor: "{colors.superficie-clara}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.native-input}"
    rounded: "{rounded.control}"
    height: "56px"
    padding: "16px"
  native-tabs:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.label}"
    height: "48px"
  native-choice:
    backgroundColor: "{colors.amarelo}"
    textColor: "{colors.verde-profundo}"
    padding: "8px 11px"
  shared-feed-card:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.verde-profundo}"
    padding: "18px 0 8px"
  comment-composer-light:
    backgroundColor: "{colors.superficie-clara}"
    textColor: "{colors.verde-profundo}"
    typography: "{typography.comment-body}"
    rounded: "{rounded.composer}"
    padding: "2px 4px 2px 10px"
  post-score-low-light:
    textColor: "{colors.nota-baixa-claro}"
    typography: "{typography.post-score}"
  post-score-middle-light:
    textColor: "{colors.nota-media-claro}"
    typography: "{typography.post-score}"
  post-score-high-light:
    textColor: "{colors.verde-profundo}"
    typography: "{typography.post-score}"
  post-score-low-dark:
    textColor: "{colors.nota-baixa-escuro}"
    typography: "{typography.post-score}"
  post-score-middle-dark:
    textColor: "{colors.nota-media-escuro}"
    typography: "{typography.post-score}"
  post-score-high-dark:
    textColor: "{colors.verde-vivo}"
    typography: "{typography.post-score}"
---

# Design System: Jambu

## Overview

**Creative North Star: "Registro pessoal"**

Registro pessoal é a direção escolhida por Lucas em 24/10/2026: uma identidade leve e próxima, com letras abertas, espaço entre grupos e poucos destaques de cor. Figtree e formas suavemente arredondadas dão unidade às versões clara e escura.

O refinamento de 25/10/2026 preserva essa identidade no Android e na web, cuja adaptação foi autorizada pelo usuário. A logo felpudinho curto permanece provisória. A referência estrutural X/Instagram orienta a moldura responsiva; não substitui a identidade Jambu.

O tom de voz é direto e próximo: O que você achou? e Adicionar prato. O prato conserva fotografia e nota próprias; User’s Choice identifica uma escolha manual por publicação, independente da nota. O protótipo usa dados e ações em memória; não conecta a API.

**Key Characteristics:**

- Leveza e proximidade.
- Letras abertas e ênfase semibold.
- Superfícies planas, com separação por tom.
- Poucos destaques de cor.
- Temas claro e escuro com a mesma identidade.

A [referência de identidade](.impeccable/mocks/decision/registro.html) permanece válida para a marca. O [refinamento de leitura social de 26/10/2026](.impeccable/surfaces/social-reading.md) estende o [contrato anterior](.impeccable/surfaces/mobile-motion.md) no escopo de feed, conversa, mídia e editor. A [revisão media-v6](.impeccable/review/media-v6/finish-review.md) confirmou a composição e encontrou uma falha de interrupção do movimento horizontal nativo. A [verificação da correção](.impeccable/review/media-v6/fix-verification.md) registra a restauração da página selecionada e a exclusão entre pan e duplo toque; o [veredito independente](.impeccable/review/media-v6/finish-verdict.md) retornou ship para essa única correção, sem regressão material observada na fonte/captura fornecida. O ship anterior de social-v5 é histórico.

Extração atual: `src/design/theme.tsx`, `content-layout.tsx`, `src/domain/rating-color.ts`, layouts/rotas de `src/app`, shell web/nativo, fotos/feed, carrossel, primitivas, editor e fluxo de avaliação em `src/mobile`. O nome dessa pasta é histórico: agora contém telas e repositório compartilhados pelas duas plataformas. `src/components/jambu` conserva primitivas reutilizadas e composições anteriores; tokens ainda válidos foram preservados no frontmatter. As antigas medidas de Screen/MealCard não governam as rotas atuais.

A atualização documental de 26/10/2026 conferiu a fonte atual com o [pacote media-v6](.impeccable/review/media-v6/finish-packet.md), sua revisão e a verificação da correção. Não operou navegador ou dispositivo nem repetiu testes. As capturas nativas relatadas são do emulador e não comprovam pinça física, TalkBack, fontes de sistema maiores ou FPS de release. O [relatório documental social-v5](.impeccable/review/social-v5/documentation.md) permanece como evidência histórica.

A reconciliação de navigation-v7 conferiu `screen-transition.ts`, os layouts e shells de cena com o [pacote atual](.impeccable/review/navigation-v7/review-packet.md) e a [revisão independente](.impeccable/review/navigation-v7/finish-review.md), cujo único ajuste material é documental. As amostras web atuais em 390/768/1280/1440 registram origem imóvel; `final-native-comparison.json` registra correspondência exata do recorte rolado na volta. Os filmes e capturas nativos são do emulador Android. Os checks de TypeScript/lint e exports web/Hermes são os relatados no pacote, sem repetição nesta passada. Essa evidência não certifica FPS de release em aparelho físico de entrada, predictive back, TalkBack, fontes ampliadas ou cobertura nativa completa do tema escuro; esta atualização documental não atribui um veredito ship.

## Colors

O frontmatter é normativo. Fotografia carrega suas próprias cores; os verdes de interface permanecem pontuais.

### Primary

- **Verde profundo:** tinta e action no tema claro; onAction no escuro.
- **Verde vivo:** action no escuro, com verde profundo para onAction.
- **Foco:** contorno de foco e caret na web, conforme o CSS global.

### Secondary

- **Amarelo:** preenchimento das estrelas e fundo de User’s Choice nos dois temas; seleção de texto da web.

**The Yellow Fill Rule.** Estrelas individuais de prato são amarelas sem contorno nos dois temas, no próprio fundo e sem faixa. Exceção específica: as pequenas estrelas da média do post herdam a mesma cor dinâmica do numeral. Esta instrução mantém a substituição do contorno claro da amostra anterior.

### Neutral

| Papel de theme.tsx | Claro | Escuro |
| --- | --- | --- |
| background / raised | branco | fundo-escuro / elevada-escura |
| surface | superficie-clara | superficie-escura |
| ink | verde-profundo | texto-escuro |
| muted | texto-secundario-claro | texto-secundario-escuro |
| line | linha-clara | linha-escura |
| outline | texto-secundario-claro | borda-escura |
| emptyStar | linha-clara | texto-secundario-claro |
| scrim | scrim-claro | scrim-escuro |

Superfície escura e elevada são papéis distintos. Não voltar ao antigo alias que as confundia. O scrim do modal também difere do gradiente fotográfico local do detalhe.

### Semantic states

- **ratingLow:** nota-baixa-claro e nota-baixa-escuro. Coincidem hoje com error, mas são papéis independentes.
- **ratingMiddle:** nota-media-claro e nota-media-escuro.
- **Média do post:** interpolação RGB por canais de ratingLow em 0,5 a ratingMiddle em 2,75, depois action em 5. Valores fora do intervalo são limitados; os extremos são testados em `rating-color.ts`.
- **Positivo:** positivo-claro/escuro e positivo-fundo-claro permanecem no tema para aplicações semânticas existentes. Curtidas ativas usam action, não positive.
- **Erro:** erro-claro/escuro comunica falhas com mensagem textual.

**The Score Endpoint Rule.** A média 5 usa exatamente action do tema, como Avaliar e a curtida ativa. O numeral e o preenchimento das estrelas pequenas compartilham a cor interpolada; o número permanece visível em toda a escala. Choice não deriva da nota.

User’s Choice usa amarelo, símbolo e texto verde profundo em ambos os temas. No detalhe fotográfico, branco para nome/nota/preço, estrela vazia inversa `#687068` e gradiente preto transparente até 90% são aplicações locais de DishCarousel/Rating. Não promovê-las a novos neutros globais ou aplicá-las à grade do diário.

## Typography

**Display Font:** Figtree, com fallback sans-serif.
**Body Font:** Figtree, com fallback sans-serif.

A fonte local está em `assets/fonts/Figtree.ttf`, com licença SIL OFL. T declara Figtree explicitamente e deriva a entrelinha de tamanho × 1,45, salvo override. A ênfase permanece 600.

### Hierarchy

- **Títulos compartilhados:** native-title para feed e busca; native-bar para PageBar. O prefixo native é legado, não restrição à plataforma.
- **Body / Label / Button:** leitura regular, rótulos 500/600 conforme componente e ações 600. Não aplicar semibold a toda a interface.
- **Feed:** restaurante 17/600 com entrelinha 24, resumo dos pratos 14/21 e média post-score com algarismos tabulares; estrelas de 10 abaixo do numeral, intervalo 1.
- **Identidade social:** no feed, nome 16/600, @14 e tempo abreviado ficam na mesma linha 14/21, separados por espaço e ponto médio, com truncamento. Identity em conversa/mídia conserva nome 16/600 e @14/muted próximos, intervalo 4 na variante inline; a variante empilhada conserva intervalo zero.
- **Conversa:** comentário 16/24; relato publicado 16/25; o texto amplo do editor permanece 17/26.
- **Prato e nota:** detalhe com nome 18/600, Rating de 18 e numeral um ponto maior; descobertas usam Rating de 14. A fração importada, inclusive 4,8, permanece representada.
- **Editor:** nome em 18/26; prompt de nota 15/600 e numeral 20 no nativo, 17/600 e 24 na web. Estrelas interativas de 36. Texto amplo do relato 17/26.
- **Selo:** texto 12/600, ou 11/600 compacto. Não recuperar o compacto de 10 da revisão anterior.

Os papéis title, title-desktop, title-feed-desktop, dish-title, rating-grid e relato do frontmatter continuam descrevendo primitivas/composições anteriores presentes no código. Não aplicar a antiga hierarquia de MealCard às novas telas. A entrada mantém composição própria de título; ela não define uma escala global.

## Layout

Grupos próximos e separações amplas preservam o ritmo. As medidas são unidades de layout React Native; na web equivalem a CSS px, no Android a dp.

- **Web abaixo de 760:** moldura compacta e navegação inferior com Início, Explorar, Avaliar, Salvos, Diário; criação ao centro. Safe area é aplicada uma vez.
- **Web 760–999:** trilho de 88, coluna principal de 600 e intervalo de 24; frame 712.
- **Web 1000–1199:** navegação rotulada de 216, principal 600 e intervalo 32; frame 848.
- **Web a partir de 1200:** acrescentar lateral de 260 para pessoas e lugares salvos; frame máximo 1140, com dois intervalos de 32.
- **Medidas internas:** grades e carrosséis usam a largura real do contêiner, incluindo desconto da barra de rolagem. Não derivar fotos da largura total do navegador.
- **Editor web:** a partir de 760, modal central de no máximo 520 × 760 com margem 32; em telas compactas, preenche a tela e rola.
- **Feed:** marca e abas persistem no shell compacto; o título sai com a lista. A busca mantém campo fora da rolagem e filtros sticky depois do título.
- **Grades:** Explorar tem duas colunas; o diário tem três colunas de fotos 3:4, intervalo 2 e nenhum texto/nota/selo sobre a grade.

PageBar usa mínimo 52, padding horizontal 8 e ícones com alvo 48. O shell nativo respeita insets e a barra inferior tem alvos mínimos de 58 mais inset. Detalhe, compositor e login dispensam a barra inferior compacta. A moldura desktop mantém sua navegação lateral nas telas internas; login dispensa a moldura.

Autoria, restaurante, resumo, fotos e ações compartilham social-inset à esquerda. Metadados e fotos deixam margem direita de 16; a linha de ações usa padding direito de 8 para seus alvos de 48. Avatar 38 fica no gutter, dentro de alvo 48. O recuo permite abrir o post. Dentro da largura restante, uma foto ocupa a área útil, com altura limitada a 360; duas dividem igualmente o espaço com intervalo 6 e altura limitada a 330; três ou mais usam faixa horizontal livre, intervalo 8, células 152 × 202 no compacto e 190 × 248 na web com coluna maior que 500. O detalhe pagina a largura medida, altura 4/3 dessa largura no Android e limite de 560 na web.

Fullscreen mede o viewport inteiro: a foto contida permanece centrada na tela, independentemente do cabeçalho e rodapé absolutos que a sobrepõem. Cabeçalho tem largura máxima 760; rodapé, 640 com margem horizontal 16. A tela de origem permanece montada.

## Elevation & Depth

A interface é plana em repouso. Espaço, tom e divisórias agrupam; não há sombra de card. O modal web usa scrim e a fotografia do detalhe usa gradiente funcional.

**The Flat Surface Rule.** Separar agrupamentos por espaço, tom e divisórias; não adicionar sombra de cartão à identidade.

O feed chega visível, sem entrada decorativa por célula. O carrossel usa scroll nativo/Reanimated: o indicador deriva continuamente do offset no runtime UI; tocar um indicador solicita scroll suave. Com movimento reduzido, a seleção programática deixa de ser suave.

LikeButton usa feedback de 120 ms, opacidade 0,8 e escala 0,94; movimento reduzido mantém escala 1. A primitiva Button preserva pressão imediata de escala 0,97 e opacidade 0,85, e transições web de 140 ms. Não afirmar que todo feedback é eliminado.

Android e web compartilham a sobreposição horizontal de post, perfil, restaurante, ajustes e criação: a cena entra pela direita sobre a origem imóvel e sai para a direita na volta. Somente a cena de cima usa translateX, sem deslocamento vertical, parallax, sombra ou escurecimento da origem. A entrada dura 295 ms e a saída 294 ms, com cubic-bezier(0.7, 0, 0.3, 1), conforme o Figma LN8FHBVpv7pnOibbDbjFox, nó 1:38; pausas e loop da demonstração não integram a interação. Movimento reduzido substitui o deslocamento por opacidade de 100 ms nos dois sentidos. Rotas pares são instantâneas nas duas plataformas. Expo Router js-stack controla histórico, retenção e remoção das cenas; no Android, a transição usa o driver Animated nativo do navegador. Não há pilha paralela implementada pelo app nem nova dependência para essa transição.

DishEditor usa Modal fade; a passagem da escolha de restaurante para o compositor usa FadeIn de 180 ms, ou 100 com movimento reduzido. Esses fades preservam estado legível. Os avisos da primitiva legada conservam 160 ms e duração de 3000 ms, onde utilizados.

A mídia usa Modal fade. A faixa horizontal mantém as páginas montadas e acompanha o dedo no runtime UI nativo, com spring de 400 ms/dampingRatio 0,85 para assentar; zoom alterna 1/2,5 com spring de 280 ms/dampingRatio 1. Arraste vertical para cima ou baixo fecha em 200 ms; arraste curto restaura a posição. Após interromper uma animação horizontal, pan vertical concluído, pan com zoom e gesto cancelado restauram o offset horizontal da página selecionada. Pan e duplo toque competem por Race, simultâneos à pinça; o toque limita deslocamento a 8, duração a 220 ms e intervalo a 280 ms. O runtime respeita movimento reduzido.

Na web, ponteiros atualizam transformações do compositor diretamente, sem render React a cada quadro; o assentamento usa transform 260 ms cubic-bezier(0.23,1,0.32,1), ou nenhuma transição com movimento reduzido. Não há entrada decorativa por comentário. O tema escuro é local ao fullscreen; abrir a mídia não altera a preferência global.

O fundo do fullscreen deriva da própria foto ativa, em cover com blur 16 e opacidade 0,48 sobre preto. Cabeçalho e rodapé recebem degradês de borda: preto 0,94 na borda, 0,72 em 60%, transparente no interior. Seguir é uma pílula translúcida branca 0,16, borda branca 0,24; o compositor flutuante usa rgba(30,34,30,0.88) e borda branca 0,2. São tratamentos locais de legibilidade; não são novos papéis de cor globais.

## Shapes

Controles usam raio control; fotos do feed usam 12; o detalhe e a grade fotográfica dispensam o arredondamento de card. Avatares são circulares. O editor web usa panel; cantos sheet-top permanecem em componentes anteriores.

Ícones locais preservam os paths SVG exportados do kit Figma ACS9dMzutYe5bVUPeFuUxb, em src/components/jambu/kit-icons.ts, aplicando somente cores semânticas Jambu. Negrito, Itálico, Link, Citar (book-open), editar, criar, curtir e salvar compartilham essa família; coração e bookmark têm estados preenchidos. O kit fornece também a referência blur/md 16, sem substituir fontes ou paleta. RatingStar sobrepõe silhuetas amarelas em recorte proporcional por overflow sobre a parte vazia, sem contorno e sem IDs de ClipPath. A logo mantém sua geometria original: a regra sem contorno pertence às estrelas.

## Components

### Buttons

Primária: action/onAction; secundária: surface/ink; ghost: transparente/ink. Base com mínimo 48, padding 12 × 20, raio control e fonte button. Desabilitado reduz opacidade a 0,5; IconButton parte de 48 × 48. Foco web é contorno de 2 afastado 4 na cor foco. O CSS global acrescenta feedback de hover, seleção, caret e scrollbar com a paleta.

### Chips

As telas atuais usam Tabs sublinhadas, com mínimo 48 e sublinhado de 2 no ativo; texto passa de muted a ink/600. chip-selected conserva a variante anterior em surface, sem mudar o contrato atual de filtros sticky.

### Cards / Containers

MealFeedCard é uma unidade aberta: autoria, linha com restaurante e média alinhados no topo, nomes/notas separados por •, fotos e ações; separação por divisória, sem caixa. As estrelas pequenas ficam abaixo da média. Tocar a foto abre fullscreen no prato correspondente; o recuo esquerdo, restaurante e Ver mais abrem o post. Curtir, comentar e salvar têm alvos separados. O coração preenchido e sua contagem usam exatamente action quando ativos.

### Inputs / Fields

O campo compartilhado usa rótulo 14/600, intervalo 8, surface/ink, mínimo 56 e padding 16. SearchField tem entrada mínima 48 e botão limpar próprio. O nome de prato é multilinha, mínimo 60; o relato é TextInput amplo e transparente, mínimo 240, sem borda nem container arredondado, diretamente após a trilha. Cancelar galeria/editor preserva o rascunho. Falha de foto mantém a área e informa Foto indisponível.

CommentComposer é uma cápsula surface com raio composer e altura mínima 56, padding 2 vertical, 10 à esquerda e 4 à direita. A entrada usa comment-body; na web cresce de 25 até 124; no Android, de 28 até 124, com padding vertical 4 e includeFontPadding false para preservar texto multilinha acima do teclado. Após o limite, rola internamente. Avatar 30 e envio com glifo 21 mantêm o tamanho visual. O alvo efetivo de enviar é 48 × 48. Responder e cancelar resposta têm alvo mínimo 48; o contexto de resposta pode ser cancelado antes de enviar. Comentários usam no máximo 1000 caracteres. O mesmo componente fica acima do teclado no post e na mídia; flutuante, usa o tratamento translúcido local de Elevation & Depth.

### Navigation

O shell web varia entre compacto, trilho e sidebar conforme Layout. O shell Android usa cinco destinos, Avaliar ao centro e safe area. O detalhe mantém PageBar e dispensa destinos inferiores. Não recuperar os breakpoints 1000/1320 e a sidebar 224 da composição web anterior.

Cabeçalho, abas e navegação inferior pertencem à própria cena e permanecem montados e imóveis na origem enquanto a próxima a cobre. Voltar revela a mesma cena e posição de rolagem. Na web compacta, cada cena fica limitada à altura do viewport, com rolagem interna; a partir de 760, somente a coluna central de 600 transita (598 úteis entre bordas), enquanto os trilhos laterais permanecem estáticos. A sobreposição e sua alternativa de movimento reduzido seguem Elevation & Depth.

### Avaliação e User’s Choice

Rating apresenta numeral e uma descrição acessível. Novas notas vão de 0,5 a 5 em passos de 0,5; tocar uma estrela dá nota inteira, arrastar ajusta meias estrelas. Não há botões visuais +0,5/−0,5. Android expõe ações ajustáveis; web usa slider com setas, Home e End. Preservar notas decimais importadas sem normalização silenciosa.

Nome, nota e Choice ficam no mesmo formulário. Choice é manual, opcional e único por post, independente da maior nota. A troca explica qual prato será substituído e altera o texto de salvar; remover o escolhido remove o selo. O antigo wouldEatAgain não gera Choice automaticamente.

ChoiceToggle expõe switch com checked explícito. A pista mede 54 × 32, thumb 24 e alvo mínimo 64 × 48; desligado usa outline e thumb branco, ligado usa action/onAction com check. Thumb desloca 22 em 150 ms ease-out, ou duração zero com movimento reduzido. O selo amarelo identifica a escolha publicada; o controle manual não depende da nota.

### Detalhe e composição

Foto, legenda e seleção pertencem ao mesmo prato; indicador contínuo de 16 × 5 corre sobre pontos de 5 em alvos 48. O relato e comentários seguem abaixo. Fotos no feed/detalhe e menções publicadas abrem o prato exato em fullscreen. Fechar a camada restaura a tela e a posição de origem; ela permanece montada.

A criação começa pelo restaurante, abre galeria real/seletor de arquivo, reúne os campos do prato e salva na trilha. Miniatura com lápis reabre para editar; segurar cita o prato no cursor. O relato tem limite 5000. A barra contém somente Negrito, Itálico, Link externo e Citar prato, acima do teclado Android. O picker oferece pratos do rascunho e insere o nome no cursor, preservando o restante e restaurando o foco. Links aceitam somente http/https. Compartilhar publica somente no repositório local, abrindo o diário. Não há foto de exemplo nem seletor global de Choice.

Marcas tipadas usam offsets UTF-16 e dishId estável; renomear não troca a identidade citada. Editar dentro de uma menção ou link desfaz seu vínculo atômico. Na leitura, citações e links usam action/sublinhado, com citação em 600. Fixtures sem marcas ainda reconhecem nomes completos como compatibilidade; esse fallback não é o contrato de novos relatos.

### Mídia e conversa

Fullscreen tem fundo preto, foto contida, fechar, ampliar/restaurar e navegação com contador quando há vários pratos. Botão e duplo toque alternam 1/2,5; pinça nativa limita escala a 1–4 e permite pan. A web oferece botão, duplo clique e gestos por ponteiro. O rodapé reúne avatar, nome/@, Seguir para outros autores, duas linhas do relato, curtida, comentários e compositor. Setas, Seguir e alternância de comentários preservam alvos mínimos 48. A ação explícita Abrir avaliação completa navega ao post; fechar apenas retorna à origem.

CommentList ordena respostas por parentId da mesma refeição e usa recuo 40 para todos os descendentes, sem linhas conectoras nem aumento cumulativo do recuo. Avatares são 36 na raiz e 30 na resposta. A futura integração da API precisa mapear reviewMarks e parentId; esses campos vivem hoje somente na memória.

O sidecar contém amostras HTML/CSS autocontidas, traduzidas do tema JS. Elas demonstram aparência e estados; não substituem gesto, roteamento ou física nativa. Fluxos, arquitetura, dados e limites estão em [docs/mobile-ui.md](docs/mobile-ui.md).

## Do's and Don'ts

### Do:

- Do preservar Figtree, ênfase 600 e controles com raio 12 como base da direção escolhida.
- Do usar os papéis de cor de cada tema em conjunto e manter verde pontual.
- Do manter fotografia, nome, nota e indicador associados ao prato ativo.
- Do manter estrelas de prato amarelas sem contorno, nota numérica e descrição acessível nos dois temas; nas estrelas pequenas da média, usar a cor do numeral.
- Do usar exatamente action para curtidas ativas e para a média 5, mantendo Choice independente da nota.
- Do medir o contêiner real de fotos e grades e conferir alvos de toque; a base Android parte de 48 dp.

### Don't:

- Don't copiar as medidas do painel comparativo como dimensões de telas.
- Don't tratar Prato por prato ou os textos da entrada como slogan oficial.
- Don't expandir a referência brasileira para grafismos, texturas ou linguagem regional além do nome, das cores e da logo.
- Don't recuperar contorno de estrelas, controles visuais ±0,5, foto de exemplo ou seletor global de Choice de versões históricas.
- Don't apresentar estados sem validação como aprovados pelo usuário nem transformar a revisão do protótipo em certificação de produção.
- Don't converter Comeria de novo automaticamente em User’s Choice nem tratar ações em memória como integração da API.
