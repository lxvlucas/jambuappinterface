# Produto — Jambu

<!-- impeccable:product-schema 1 -->

## Platform

android

Alvos confirmados: aplicativo Android e produto completo na web, usando o projeto
Expo/React Native existente. iOS não foi confirmado neste alinhamento.

## Users

O documento Proto-personas do Jambu, versão 1 de 24/10/2026, fornecido por Lucas,
detalha as descrições desta conversa. São hipóteses de comportamento, ainda sem
entrevistas, a confirmar ou corrigir nos testes internos:

- Curador: quer guardar e mostrar registros de comida com cuidado estético; valoriza
  fotografia, perfil como vitrine e reconhecimento do próprio gosto.
- Crítico de Prato: acompanha reviews de comida e quer compartilhar uma opinião
  específica sobre cada prato, com nota e preço quando informado.
- Arquivista: constrói um acervo pessoal para lembrar o que comeu e o que achou;
  valoriza precisão, consulta ao histórico e controle de exposição.
- Quem Busca a Verdade: necessidade de leitura comum aos demais perfis; quer decidir
  se um prato vale a pena com base em experiências recentes e contextualizadas.

A privacidade desejada pelo Arquivista é uma lacuna declarada no documento, e não
uma capacidade já entregue. As frases das personas são ilustrativas, não depoimentos
de participantes ou evidência de pesquisa validada.

O hábito de registrar, avaliar e compartilhar no Letterboxd é uma referência de uso
citada pelo usuário. Não representa aprovação para copiar sua identidade visual.

## Product Purpose

Guardar, avaliar e compartilhar as próprias experiências gastronômicas, com foco
na avaliação de cada prato. O lugar contextualiza onde a experiência aconteceu.

## Positioning

A unidade central de avaliação é o prato consumido em uma experiência. O registro
pode agrupar vários pratos, cada um com sua avaliação. A identidade deve tornar
esse foco compreensível sem depender de uma explicação técnica.

## Operating Context

Ao abrir o produto autenticado, a pessoa chega ao feed das outras pessoas e tem
acesso fácil ao próprio diário. O diário reúne seu histórico pessoal. O mockup
interativo de 25/10/2026 propõe a navegação e os termos públicos para a próxima
rodada de avaliação; a implementação não representa aprovação visual definitiva.

## Capabilities and Constraints

- Frontend: Expo/React Native e TypeScript, agora com mockup interativo Android/web.
  Feed, busca, diário, perfis, detalhes/comentários, guardados, publicação, ajustes
  e login usam dados de demonstração em memória, sem conexão com a API.
- API existente: Java/Spring Boot. A main publicada foi inspecionada no commit
  b48194a36597a0583f30673f23499344e8de8a66, em 24/10/2026.
- O código consultado oferece cadastro, login, sessões persistentes, perfis,
  seguimentos, feed com abas Para você/Seguindo, curtidas e comentários.
- O feed consultado exclui os próprios posts; estes ficam no perfil. Para você
  reúne posts de outras pessoas em ordem cronológica, sem recomendação por IA.
- Uma publicação agrupa pratos com nome e nota; pode incluir relato, modalidade e
  data da refeição. Cada prato pode incluir foto, preço e marcação Comeria novamente.
- A API usa notas de 0,5 a 5, em passos de 0,5, e fotos verticais 3:4 com moderação.
- Há busca/cadastro de lugares, perfis de estabelecimentos e sugestão de correções.
- O diário é um histórico pessoal; isso não significa privado. O documento de
  personas mantém Só para mim fora do MVP, e a API consultada permite a leitura de
  posts por outras pessoas autenticadas. Não apresentar controle de privacidade
  funcional sem uma decisão de escopo e implementação correspondente.
- Lucas confirmou uma foto obrigatória para cada prato avaliado, inclusive em
  publicações com vários pratos. A API consultada recebe o upload separadamente da
  criação da publicação; garantir essa regra no fluxo conectado permanece trabalho
  futuro. A aprovação desta regra não afirma que já há validação no backend.
- A confirmação de um lugar não comprova visita, consumo ou autenticidade da opinião.
- Grade do perfil, consulta ao histórico e compartilhamento de perfil são necessidades
  das proto-personas. Seu comportamento na interface e o acesso externo ao perfil
  ainda precisam ser definidos, sem presumir leitura pública sem autenticação.
- Essas capacidades são evidências do backend; a composição das telas, os termos
  públicos e a prioridade de cada função ainda dependem do alinhamento de design.
- Lucas autorizou criar mockups reutilizáveis das telas com autonomia visual e os
  dados de dummy-meals.md, preservando a identidade escolhida. Inclui revisão local
  e abertura no Expo Go já instalado no Android conectado. Não inclui publicação,
  instalação de APK, commit ou push.

## Refinamento Android e web — 25/10/2026

Lucas autorizou concluir o refinamento mobile e adaptar o produto web completo à
mesma experiência, com moldura estrutural X/Instagram. A API permanece
desconectada até solicitação explícita. As duas plataformas usam as mesmas telas,
entidades e o contrato tipado JambuRepository com implementação em memória;
`src/mobile` é um nome histórico, não um limite de plataforma.
Ver [arquitetura e fluxos](docs/mobile-ui.md).

- Feed com restaurante, resumo dos pratos em • e nota média numérica. Uma foto
  preenche a largura útil; duas formam par fixo igual; três ou mais usam faixa livre.
- Curtidas ativas usam exatamente action, como Avaliar. A cor da média vai de
  ratingLow em 0,5 a ratingMiddle em 2,75 e action em 5; o numeral continua visível.
- Criar: restaurante → galeria/seletor de arquivo → formulário único com nome,
  nota e Choice → trilha editável com lápis → relato amplo sem caixa →
  Compartilhar localmente e abrir o diário. Foto, nome e nota são obrigatórios.
- Toque na estrela dá nota inteira, arraste ajusta 0,5. Não há botões visuais
  ±0,5; ações ajustáveis nativas e teclado web continuam disponíveis.
- User’s Choice é manual, independente da maior nota, opcional e único por post.
  O formulário explica a substituição da escolha anterior. Remover o prato
  escolhido remove o selo. Não há escolha global nem botão de foto de exemplo.
- Abas do feed persistem; busca mantém campo e filtros sticky. Diário tem três
  colunas fotográficas. Navegação compacta tem cinco destinos, Avaliar ao centro.
  Salvos contém listas de outras pessoas, lugares e avaliações.
- Na web, abaixo de 760 a moldura é compacta; 760+ usa trilho 88 e intervalo 24;
  1000+ usa sidebar 216 e intervalo 32; 1200+ inclui lateral 260. A coluna principal
  é 600 e o frame máximo é 1140. Grades/fotos medem sua largura real.
- As 15 refeições/29 pratos são fictícios. Notas importadas como 4,8 são
  preservadas; novas notas usam passos de 0,5. A divergência com o contrato da API
  inspecionado deverá ser resolvida na integração futura. As duas listas de
  outros autores e Choice de fixtures são exemplos explícitos, não migração da API.

A [revisão da base de 25/10](.impeccable/review/finish-review-current.md) retornou ship no
escopo do protótipo, sem atribuir aprovação visual definitiva do usuário a cada
estado. A [verificação](.impeccable/review/verification-current.md) registra checks,
capturas e limites; TalkBack, predictive Back, Safari/Firefox e performance de
release permanecem fora da cobertura. A revisão mobile-v2 é histórica e foi
superada pelo contrato atual e pela revisão fresca.

## Leitura social e editor — 26/10/2026

Esta extensão preserva Registro pessoal e os mesmos dados em memória. No feed,
a média fica ao lado do restaurante com estrelas pequenas na mesma cor dinâmica.
Nome 16/600 e @14 ficam próximos. As fotos reservam recuo esquerdo 56 para abrir
o post; tocar a imagem abre fullscreen no prato exato. Fechar retorna à posição
da tela de origem mantida montada. A camada preta usa tema escuro local sem
alterar a preferência de tema.

O fullscreen reúne zoom, navegação entre pratos, autoria, seguir, trecho do relato,
curtida e conversa. Comentários crescem com o texto e respostas usam recuo sem
linhas conectoras. A barra do relato oferece somente Negrito, Itálico, Link externo
http/https e Citar prato, acima do teclado Android. Citar insere no cursor um
vínculo por dishId; após publicar localmente, a menção abre a imagem desse prato.
Relatos aceitam 5000 caracteres; comentários, 1000. `reviewMarks` e `parentId`
estão no contrato local; seu transporte e persistência na API seguem trabalho futuro.

A [revisão social-v5](.impeccable/review/social-v5/finish-review.md) encontrou uma
correção agrupada de alvos Android. O [veredito final](.impeccable/review/social-v5/finish-verdict.md)
retornou ship após essa correção, sem regressão material observada no lote.
A [verificação final](.impeccable/review/social-v5/verification.md) delimita a
cobertura. A evidência nativa atual é do emulador; não certifica pinça física,
TalkBack nem FPS de release. Não houve integração com a API.

## Brand Commitments

- Nome: Jambu.
- Logo provisória confirmada: felpudinho curto; não é a marca definitiva.
- Paleta fornecida pelo usuário no Figma:
  https://www.figma.com/design/J58QVBC3znr1D4N65mCRVk/
- Cores-base lidas pela integração: #072C0D, #1AA332, #3BE058, #FFCE0F,
  #000000 e #FFFFFF, acompanhadas de escalas tonais e cinzas.
- Temas claro e escuro, acompanhando o sistema e permitindo escolha manual,
  confirmados para o aplicativo e a web.
- Referência de identidade visual: Mubi.
- Instagram: familiaridade e comportamento de carrosséis. O refinamento de
  25/10/2026 também autoriza X/Instagram como referências estruturais da moldura
  web e das fotos de feed, preservando a identidade Jambu; não presumir Stories.
- Notion: simplicidade visual, poucas cores, posicionamento dos elementos e feedback
  de interação; evitar excesso de botões e de opções aparentes.
- Evitar LinkedIn e Telegram como referências visuais.
- O nome faz referência à planta jambu. Lucas forneceu uma narrativa sobre sua
  experiência sensorial, a flor amarela e sua ligação com a gastronomia e a cultura
  brasileira. A representação dessa origem fica no nome, nas cores e na logo,
  conforme resposta de Lucas; não expandir para grafismos, texturas ou linguagem
  regional por iniciativa do design. A narrativa é material de marca, não
  verificação científica.
- Direção visual escolhida por Lucas em 24/10/2026: Registro pessoal, o primeiro
  card da comparação. A escolha foi acompanhada por uma foto desse card no tema
  escuro. Não interpretar alterações de cor causadas pela fotografia da tela como
  novos valores de marca.
- Base da amostra escolhida: Figtree, ênfase de peso 600, formas suaves com raio
  de 12 px em controles, espaçamento generoso e poucos destaques de cor.
- A documentação visual dessa base fica em DESIGN.md. Dimensões do painel de
  comparação não são especificações de layout das telas do aplicativo.
- Tom de voz confirmado em 25/10/2026: direto e próximo, como O que você achou?,
  Comeria de novo e Adicionar prato.
- Estrelas individuais de prato: amarelas nos dois temas, no próprio fundo e SEM contorno, conforme
  pedido mais recente de Lucas em 25/10/2026, que substitui a decisão anterior
  de contorno discreto no claro. A nota numérica acompanha as estrelas.
  Não usar a faixa verde da alternativa descartada como padrão de avaliação.
  Exceção confirmada em 26/10/2026: as pequenas estrelas da média do post usam
  a mesma cor dinâmica do numeral.
- Componentes e estados ainda não exemplificados e detalhes futuros de movimento
  continuam em aberto; a escolha da direção não aprova telas futuras.

## Evidence on Hand

- Paleta no frame ColorPalette, node 1:2 do arquivo Figma indicado acima.
- Logo provisória: ../../assets/logos/jambu-v1-felpudinho-curto-logo.svg.
- Variações de símbolo e logotipo em ../../assets/logos/.
- Contratos, controllers e DTOs da main da API consultada.
- Respostas de Lucas nesta conversa confirmando propósito, público, entrada,
  plataformas e uso provisório da logo, seguidas da escolha de Registro pessoal.
- Documento Proto-personas do Jambu, versão 1, fornecido nesta conversa; suas
  referências a outros documentos não os tornam fontes já consultadas.
- dummy-meals.md fornecido por Lucas: a proposta web inicial usa quatro refeições
  e dez pratos; as rotas atuais Android/web usam o documento atualizado com
  15 refeições e 29 pratos, perfis, preços, notas, comentários e fotos fictícios.

## Product Principles

- Dar clareza à opinião sobre cada prato consumido.
- Permitir construir um histórico pessoal de experiências.
- Tornar essas experiências compartilháveis entre pessoas.
- Manter o diário facilmente acessível a partir da experiência social.
- Compartilhar a identidade entre Android e web, respeitando o uso de cada plataforma.
- Distinguir hipóteses de público e requisitos propostos das capacidades entregues.
