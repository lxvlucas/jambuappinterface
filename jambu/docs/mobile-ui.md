# Jambu Android e web: UI com dados locais

Atualizado em 26/10/2026. Android e web usam as mesmas telas e o mesmo repositório
tipado local. O nome `src/mobile` é histórico; a web foi autorizada a acompanhar
o refinamento. Expo/React Native/TypeScript executável, com API desconectada até
o usuário solicitar. Ações e publicações vivem somente na sessão em memória.

## Organização

- `src/app/*.tsx` e `*.native.tsx`: wrappers Expo Router para telas compartilhadas.
  Layouts configuram provider, navegação e tema.
- `src/domain/jambu.ts`: entidades, JambuRepository e validação;
  `rating-color.ts`: interpolação da média; `review-document.ts`: marcas,
  offsets UTF-16, edição de intervalos e URLs externas seguras.
- `src/mobile/data/`: fixtures, MemoryJambuRepository e provider injetável.
- `src/mobile/components/`: shell Android, shell web responsivo, fotos, nota, selo,
  unidade de post, carrossel e textos.
- `src/mobile/screens/`: feed, explorar, diário/perfis, detalhe, salvos,
  avaliação, restaurantes e ajustes.
- `src/mobile/features/review/`: reducer do rascunho, editor combinado, trilha,
  nota nativa, slider web, editor rico e barra de quatro ações.
- `src/mobile/features/media/`: provider que mantém a origem montada, viewer
  fullscreen e zoom nativo/web.
- `src/design/theme.tsx` e `content-layout.tsx`: temas, movimento reduzido e
  medidas da coluna/contêiner.
- `src/components/jambu/`: primitivas reutilizadas e composições web anteriores;
  essas últimas não são as telas ativas das rotas compartilhadas.

A integração futura precisa implementar HTTP, autenticação, upload/armazenamento,
paginação, cache, persistência de rascunhos, concorrência e adaptação de DTOs,
incluindo `reviewMarks` com `dishId` e `parentId` das respostas.
A injeção de JambuRepository é uma separação de responsabilidades; não entrega
esses serviços.

## Dados e decisões

`scripts/import-mobile-fixtures.mjs` importa o bloco JSON de
`../UI/dummy-meals.md`: 15 refeições e 29 pratos, agora em ambas as plataformas.
As cinco fotos locais fornecidas foram preservadas. O manifesto de
`assets/mobile-fixtures/` registra fotos adicionais; uma URL que falhou na
importação permanece remota. Foto indisponível mantém a área e informa a falha,
sem trocar a imagem por outro prato.

`fixtures.ts` acrescenta duas listas de outros autores e `demoChoices` explícitos.
São exemplos, não dados entregues pela API. O antigo `wouldEatAgain` é descartado,
não convertido em selo. A nota original 4,8 permanece; novas notas usam 0,5–5
em passos de 0,5. Essa diferença do contrato da API deverá ser resolvida quando
a conexão for solicitada. Localização de fixtures não redefine o mercado do produto.

## Fluxos compartilhados

O feed mostra outras pessoas; Para você segue os dados locais ordenados e
Seguindo filtra seguimentos. Restaurante e resumo com • contextualizam os pratos.
As fotos começam no recuo esquerdo 56, com margem direita 16. Uma foto ocupa a
largura restante, duas formam par fixo igual e três ou mais viram faixa livre.
Tocar a foto abre fullscreen no prato correspondente; o recuo abre o post.
Curtida ativa usa exatamente action, como Avaliar. A média fica ao lado do
restaurante, com estrelas de 10 abaixo. Numeral e preenchimento das estrelas
usam a mesma cor: ratingLow em 0,5, via ratingMiddle em 2,75, até action em 5.
As estrelas individuais de prato continuam amarelas sem contorno.

Feed mantém abas fora da lista; título rola. Busca mantém o campo e fixa
Lugares/Pratos/Pessoas depois do título. Explorar tem duas colunas; diário tem
três colunas de fotos 3:4 sem sobreposição de nome/nota/selo. Salvos separa
listas de outros autores, lugares e avaliações.

Criar começa pelo restaurante e galeria real/seletor de arquivo. Foto, nome,
nota e Choice ficam em um formulário de prato; cancelar preserva o rascunho.
Toque na estrela dá nota inteira; arraste ajusta meias notas. Sem botões visuais
±0,5. Ações ajustáveis nativas e teclado web (setas, Home, End) são alternativas.

Choice é manual, opcional, independente da nota e único por post. Ao marcar outro
prato, o formulário informa a substituição antes de salvar. Remover o escolhido
remove o selo. A miniatura com lápis reabre o editor; segurar cita o prato no
cursor do relato. O relato é amplo e sem caixa, diretamente após a trilha. Compartilhar
publica na memória e abre o diário. Não há botão de foto de exemplo nem Choice global.

O detalhe mostra fotos paginadas, legenda, nota/preço e relato/conversa. O indicador
segue continuamente o offset de scroll; tocar nele seleciona com scroll suave,
desativado sob movimento reduzido. Tocar fotos e menções abre fullscreen no prato
exato; fechar retorna à mesma posição na tela montada de origem.

## Leitura social, mídia e editor — 26/10/2026

Identity aproxima display name 16/600 e @14, com intervalo 4 e data abaixo.
CommentComposer é compartilhado pelo post e pela mídia. A cápsula vazia tem 52,
entrada 25 que cresce até 124 e depois rola, avatar 30 e envio efetivo 48 × 48.
O texto aceita até 1000 caracteres. Responder mantém `parentId` validado na mesma
refeição; cancelar limpa o contexto da resposta. A lista usa avatares 36/30 e
recuo 40 para todos os descendentes, sem linhas e sem aumentar o recuo a cada nível.

MediaProvider monta uma camada fullscreen sobre a origem. O preto contém a foto
sem corte; DarkSurface aplica o tema escuro somente nessa camada, sem alterar a
preferência global. Há fechar, ampliar/restaurar, navegação e contador de pratos,
autoria, Seguir para outros autores, relato de duas linhas, curtida, comentários
e compositor. Fechar preserva a origem; Abrir avaliação completa é uma navegação
explícita. Seguir, responder, cancelar, setas, envio e alternância da conversa
preservam alvos de 48. O teclado Android deixa compositor e barra visíveis.

Zoom nativo usa GestureHandler/Reanimated para pinça 1–4 e pan; botão e duplo
toque alternam 1/2,5 com spring 280 ms/dampingRatio 1. O runtime respeita movimento
reduzido. Web usa botão, duplo clique e ponteiros para zoom/pan. Implementação
de gesto não equivale a validação de dois dedos físicos ou performance de release.

A barra do relato contém apenas Negrito, Itálico, Link externo e Citar prato,
acima do teclado Android. Seleção formata o intervalo; sem seleção B/I alternam
o estilo para digitar. Picker lista somente pratos do rascunho e insere o nome
no cursor/seleção preservando o restante, depois restaura cursor e foco.
Links aceitam apenas URLs completas http/https. Limite do relato: 5000 caracteres.

`ReviewDocument` combina texto e marcas tipadas de bold/italic/link/dish. Intervalos
usam offsets UTF-16, compatíveis com TextInput e seleção DOM; citações usam
`dishId`, não igualdade de nomes. Editar dentro da citação/link elimina seu vínculo
atômico; editar fora desloca offsets. Remover prato elimina marcas inválidas na
publicação. O renderer usa action/sublinhado e 600 para citações, e abre a imagem
do ID correspondente. Fixtures antigas sem marcas ainda têm fallback por nome
completo. Novos relatos persistem `reviewMarks` apenas na sessão em memória.

## Web responsiva e Android

| Largura web | Estrutura |
| --- | --- |
| abaixo de 760 | shell compacto; cinco destinos, Avaliar ao centro |
| 760–999 | trilho 88, intervalo 24, principal 600; frame 712 |
| 1000–1199 | sidebar 216, intervalo 32, principal 600; frame 848 |
| 1200+ | acrescenta lateral 260 e intervalo 32; frame máximo 1140 |

Fotos/grades medem sua coluna real. O editor web tem máximo 520 × 760 no desktop
e preenche a tela compacta. Android usa safe areas, navegação inferior e stack
hierárquico; detalhe e compositor dispensam a barra inferior.
O shell desktop conserva a sidebar nas telas internas.

Movimento de navegação: pares sem animação; post, perfil, restaurante, ajustes e
criação entram pela direita sobre a cena anterior, que fica imóvel. Na volta,
somente a cena de cima sai para a direita. Expo Router `js-stack` controla o
histórico e retém a cena de saída até terminar a transição; não há estado de
navegação paralelo. No Android, o navegador executa o transform pelo driver
nativo. A opção usa 295 ms na entrada, 294 ms na saída e curva
`cubic-bezier(0.7, 0, 0.3, 1)`. As pausas e o loop da demonstração não
fazem parte da navegação. Movimento reduzido substitui o deslocamento por
opacidade de 100 ms.

O cabeçalho e a navegação inferior pertencem a cada cena, calculados pelo seu
próprio nome de rota; nunca se removem da cena de origem ao abrir outra. O
viewport web limita a altura das cenas e mantém a rolagem dentro do app. Em
desktop, as laterais permanecem estáticas e só a coluna central transita.
Like mantém 120 ms; modal de prato usa fade e a entrada interna no compositor
mantém 180 ms ou 100 com movimento reduzido. Essas regras substituem as
transições históricas de mobile-v2 e as anteriores a navigation-v7.

## Execução e verificação

Veja o [README principal](../../README.md) e o [guia de execução](mockup.md).
Na pasta jambu/, execute:

```bash
npm run lint
npx tsc --noEmit
node scripts/test-mobile-core.mjs
```

Capturas e relatórios locais de revisão não são versionados. Os checks acima
verificam código e regras do protótipo; não substituem testes de acessibilidade,
gestos em aparelhos físicos ou desempenho de uma compilação de produção.
