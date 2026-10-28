# Jambu · Interface

Diário de experiências gastronômicas com feed, avaliações de pratos, fotos,
comentários, perfis e listas de salvos. A interface usa **Expo SDK 58, React Native
0.88, React 19 e TypeScript**, com telas compartilhadas entre Android e web.

Esta versão é um protótipo com dados de demonstração. Você pode rodar a interface
sem API, banco de dados, conta Expo ou arquivo `.env`.

## Começar pela web

Pré-requisitos: Git, **Node.js 24.3 ou superior da linha 24** e npm. O ambiente
local foi verificado com Node.js 24.22.1 e npm 11.19.1. O Expo instalado aceita
`^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`.

```bash
git clone https://github.com/lxvlucas/jambuappinterface.git
cd jambuappinterface/jambu
npm ci
npm run web -- --port 8095 --localhost --max-workers 2
```

Abra **[http://localhost:8095](http://localhost:8095)** no navegador. O feed é a
tela inicial. O Expo atualiza a interface quando o código muda. Para encerrar,
pressione `Ctrl+C` no terminal.

Se você já tem a pasta `jambu-interface`, entre em `jambu-interface/jambu` e execute
os dois últimos comandos. Todos os comandos abaixo também partem de `jambu/`.

## Rodar no Android

### Celular na mesma rede

Instale uma versão do Expo Go compatível com o SDK 58 no aparelho e execute:

```bash
npm start -- --port 8095 --max-workers 2
```

Conecte computador e celular à mesma rede e escaneie o QR code pelo Expo Go.
Deixe o Expo anunciar o endereço da rede local; `--localhost` é usado na prévia
web e na conexão Android por USB.

Se o Expo Go não suportar o SDK ou algum módulo nativo do projeto, use uma
compilação local conforme o [guia Android no Windows](jambu/docs/android-windows.md).

### Emulador ou compilação local

Configure Android Studio, Android SDK, JDK compatível e um dispositivo virtual,
ou conecte um celular com depuração USB autorizada. O guia Android explica a
configuração, a instalação de uma compilação local e o uso de ADB.

Com o emulador iniciado e Expo Go compatível instalado:

```bash
npm run android -- --port 8095 --localhost --max-workers 2
```

Para conexão por cabo, consulte o [guia de execução e USB](jambu/docs/mockup.md).

## Comandos úteis

| Comando em `jambu/` | Para que serve |
| --- | --- |
| `npm ci` | Instala as versões registradas em `package-lock.json` |
| `npm start` | Inicia o servidor de desenvolvimento Expo |
| `npm run web` | Abre a interface web |
| `npm run android` | Abre a interface no Android disponível |
| `npm run ios` | Solicita abertura no simulador iOS; exige macOS/Xcode |
| `npm run lint` | Verifica o código com ESLint |
| `npx tsc --noEmit` | Verifica os tipos TypeScript |
| `node scripts/test-mobile-core.mjs` | Testa avaliações, comentários, rascunhos e mídia |

Android e web são as plataformas de referência. O script de iOS existe no
projeto, mas não representa validação da interface nessa plataforma.

### Prévia do export web

```bash
npx expo export --platform web --output-dir dist/mockup-web --max-workers 2
node scripts/preview-mockup.mjs
```

Abra [http://127.0.0.1:8097](http://127.0.0.1:8097). O servidor atende apenas na
máquina local. Refaça o export após mudar o código. Como `app.json` configura
`web.output` como `server`, use esse script para servir o export.

## Organização

```text
jambu-interface/             # raiz do repositório (nome local pode variar)
├── README.md
├── .gitignore
├── UI/
│   ├── dummy-meals.md       # documento de dados fictícios
│   └── v1-felpudinho-logo.svg
└── jambu/                  # aplicativo executável; rode o npm aqui
    ├── src/app/            # rotas Expo Router
    ├── src/mobile/         # telas e componentes compartilhados Android/web
    ├── src/domain/         # entidades e regras de negócio
    ├── src/design/         # tema, marca e layout
    ├── assets/             # fontes e imagens do protótipo
    ├── scripts/            # verificações e ferramentas de desenvolvimento
    ├── docs/               # guias de execução e arquitetura
    ├── app.json
    ├── package.json
    └── package-lock.json
```

O nome `src/mobile` é histórico: essas telas também são usadas pela web.
As imagens de demonstração já estão incluídas; não é necessário reimportar os
fixtures para rodar. O importador opcional usa `UI/dummy-meals.md`, reaproveita as
fotos em `jambu/assets/mock/` e pode baixar imagens públicas referenciadas.

## O que funciona nesta versão

Feed, busca, diário, detalhe de refeições, perfis, listas de salvos, visualizador
de fotos, comentários e criação de avaliações com fotos e notas. A rota `/login`
é demonstrativa e não realiza autenticação.

Publicações, comentários, curtidas, seguimentos e salvos ficam em memória e
reiniciam ao recarregar. Apenas a preferência de tema da web persiste no navegador.
Não há upload para servidor nem persistência em banco. Algumas imagens remotas
dependem de internet, embora as fotos incluídas funcionem localmente.

## Cuidados ao versionar

O `.gitignore` exclui dependências, builds, caches, logs, capturas de revisão,
configurações locais, arquivos `.env`, credenciais e chaves de assinatura.
Mantenha `package-lock.json` e os assets necessários no Git.

Nunca coloque segredos no código nem em variáveis `EXPO_PUBLIC_*`: elas podem
ser incluídas no aplicativo entregue ao usuário. Se adicionar configurações de
ambiente, versione apenas um `.env.example` sem valores reais. Antes de enviar,
confira `git status` e `git diff --cached` na raiz.

## Se algo não abrir

- **Porta ocupada:** encerre o Expo anterior com `Ctrl+C` ou escolha outra porta
  com `--port 8098`; use a mesma porta no navegador ou nos comandos de ADB.
- **Cache desatualizado:** execute `npm start -- --clear`.
- **Dependências ausentes:** confirme que está em `jambu/` e rode `npm ci`.
- **Celular não conecta:** confira rede, firewall e compatibilidade do Expo Go;
  para cabo USB, siga o guia de ADB.

## Mais detalhes

- [Execução e conexão USB](jambu/docs/mockup.md)
- [Android no Windows](jambu/docs/android-windows.md)
- [Arquitetura e fluxos compartilhados](jambu/docs/mobile-ui.md)
- [Princípios do produto](jambu/PRODUCT.md)
- [Tokens e componentes de design](jambu/DESIGN.md)
