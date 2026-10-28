# Executar o protótipo Jambu

Atualizado em 25/10/2026. Android e web compartilham telas, fixtures e repositório
local. A identidade Registro pessoal foi preservada. A API permanece desconectada
até solicitação do usuário; publicação bem-sucedida aqui é uma alteração em memória.

## Abrir a web

Execute na pasta `jambu-interface/jambu`, com as dependências instaladas:

```powershell
npm run web -- --port 8095 --localhost --max-workers 2
```

Abra [a prévia Metro](http://localhost:8095). A entrada do app é o feed.
`/login` é demonstrativo; não autentica nem envia credenciais.

Para revisar export de produção, sem watcher do Metro:

```powershell
node node_modules/expo/bin/cli export --platform web --output-dir dist/mockup-web --max-workers 2
node scripts/preview-mockup.mjs
```

Abra [a prévia exportada](http://127.0.0.1:8097). O servidor aceita apenas loopback.
Reexporte após mudar código; o servidor serve `dist/mockup-web`.
Não iniciar dois Metros na mesma porta. Limitar workers ajuda no limite de arquivos
abertos deste ambiente Windows.

## Abrir o Android

Com emulador iniciado ou aparelho com Expo Go compatível com SDK 58:

```powershell
npm run android -- --port 8095 --localhost --max-workers 2
```

O [guia Android no Windows](android-windows.md) descreve JDK, SDK e ADB.
Para o aparelho USB deste ambiente, com depuração autorizada, use Metro na porta
8095. Quando ele escuta somente em IPv6, inicie a ponte em outro terminal:

```powershell
node scripts/dev-usb-proxy.mjs
```

Depois, usando ADB do Android SDK:

```powershell
adb reverse tcp:8095 tcp:8095
adb reverse tcp:8096 tcp:8096
adb shell am start -a android.intent.action.VIEW -d exp://127.0.0.1:8095 host.exp.exponent
```

O proxy depende do Metro em `[::1]:8095` e encaminha IPv4 nas portas 8095/8096.
O manifesto anuncia 8095 também para bundle/reload, portanto a ponte dessa porta
é necessária mesmo que a abertura inicial use 8096. Se Metro já atende IPv4,
use sua porta diretamente sem o proxy. Esses comandos abrem Expo Go existente;
não instalam APK. O menu introdutório do Expo Go pode aparecer na primeira abertura.

## Rotas e interações

| Rota | Conteúdo |
| --- | --- |
| `/` | Feed Para você/Seguindo, uma/duas/3+ fotos, curtidas e salvos |
| `/explore` | Busca Lugares/Pratos/Pessoas, duas colunas e recuperação de vazio |
| `/diary` | Diário próprio, três colunas fotográficas e avaliações |
| `/meal/:id` | Detalhe, fotos paginadas, relato e comentários; `?dish=1` abre a segunda foto |
| `/profile/:id` | Perfil de outra pessoa, seguir e seus registros |
| `/restaurant/:id` | Lugar como contexto e avaliações dos pratos |
| `/saved` | Listas de outros autores, lugares e avaliações salvas |
| `/new` | Restaurante, galeria, formulário único de prato, trilha/edição e relato |
| `/settings` | Tema claro/escuro/sistema e limites da demonstração |
| `/login` | Tela de entrada demonstrativa, sem autenticação real |

O feed exclui posts próprios. Para você apresenta os fixtures em ordem temporal;
Seguindo filtra seguimentos locais. Não há recomendação por IA.

Cada prato exige foto, nome e nota. A galeria é real no Android e abre o seletor
de arquivo na web. Nome, nota e Choice convivem no formulário; toque dá nota
inteira, arraste ajusta meias estrelas. Sem botões visuais ±0,5.
Teclado web e ações ajustáveis Android oferecem alternativas.
Choice é manual, independente da nota, único por post, com explicação de troca.
Não há foto de exemplo nem Choice global. O lápis da trilha reabre a edição;
remover o escolhido remove Choice. O relato é amplo e sem caixa; Compartilhar
publica localmente e abre o diário.

Curtidas ativas e média 5 usam exatamente action do tema. A média numérica vai
de vermelho em 0,5, via âmbar em 2,75, para action em 5. O numeral permanece visível.
Fotos do feed têm uma composição ampla, dupla fixa ou faixa livre para 3+.
O detalhe mantém seleção e indicador contínuo associados à fotografia.

A web usa shell compacto abaixo de 760; trilho 88 + intervalo 24 em 760+;
sidebar 216 + intervalo 32 em 1000+; lateral 260 em 1200+. Principal 600 e frame
máximo 1140. Grades e carrosséis medem sua largura útil. O editor desktop tem
máximo 520 × 760. Android conserva alvos e navegação de plataforma.

## Dados, estrutura e limites

As rotas atuais usam 15 refeições e 29 pratos de `src/mobile/data/meals.json`,
importados do documento atualizado. Duas listas e seleções explícitas de Choice
são exemplos em `fixtures.ts`. Notas originais como 4,8 são preservadas; novas
notas usam passos de 0,5. O antigo dataset de quatro refeições/dez pratos
permanece histórico no código anterior, sem governar as telas atuais.

`src/mobile` tem nome histórico e contém componentes, telas e provider de ambas
as plataformas. `src/domain` define JambuRepository e validações;
MemoryJambuRepository mantém snapshots e ações da sessão. Detalhes em
[UI compartilhada e arquitetura](mobile-ui.md).

Curtidas, seguimentos, salvos, comentários e publicações reiniciam ao recarregar.
Só a preferência web de tema persiste em localStorage; Android mantém tema na
sessão e inicia acompanhando o sistema. A futura conexão exige HTTP,
autenticação real, upload/moderação, persistência, paginação, cache e recuperação
de rede. Não presumir perfil externo sem autenticação, registro privado,
comprovação de visita ou autenticidade das opiniões.

## Movimento e imagens

O feed chega visível. Indicador segue o offset do carrossel no runtime UI;
seleção programática deixa de ser suave com movimento reduzido. Like usa 120 ms,
com escala desativada sob movimento reduzido. Rotas Android pares usam fade
120 ms, hierárquicas usam stack padrão ou fade reduzido; web usa none.
Modal usa fade e entrada no compositor usa 180/100 ms. Consulte a descrição de navegação em [arquitetura e fluxos](mobile-ui.md).

Figtree local e licença estão em `assets/fonts/`. A marca provisória está
incorporada em `src/design/brand.ts` a partir da logo fornecida.
`assets/mock/manifest.json` e `assets/mobile-fixtures/manifest.json` registram
origens das imagens; metadados estão nos rasters. A verificação atual escaneou
49 rasters com proveniência, preservando as fotos locais fornecidas. Uma URL
remota não baixada continua remota e usa fallback se falhar. Fotos e personagens
de fixtures não comprovam pratos reais em estabelecimentos.

## Verificação

Consulte o [README principal](../../README.md) para instalação desde o clone.
Os relatórios e capturas locais de revisão ficam fora do Git. Para verificar a base:

```bash
npm run lint
npx tsc --noEmit
node scripts/test-mobile-core.mjs
```

Esses checks não certificam acessibilidade de plataforma, todos os navegadores
ou desempenho de uma compilação de produção.
