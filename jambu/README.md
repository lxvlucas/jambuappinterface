# Jambu

Aplicativo Expo/React Native/TypeScript para Android e web. Esta pasta contém o
código executável; a pasta irmã UI/ reúne referências e dados fictícios.

## Abrir a interface

Com Node.js 24.3+ da linha 24 e npm instalados, execute nesta pasta:

```bash
npm ci
npm run web -- --port 8095 --localhost --max-workers 2
```

Abra [http://localhost:8095](http://localhost:8095). O protótipo funciona com dados
de demonstração, sem API ou arquivo .env. Ações da sessão reiniciam ao recarregar.

O **[README principal](../README.md)** contém os passos desde o clone, execução
no Android, prévia do export web, estrutura do projeto e cuidados com credenciais.

## Verificar

```bash
npm run lint
npx tsc --noEmit
node scripts/test-mobile-core.mjs
```

## Documentação

- [Execução e conexão USB](docs/mockup.md)
- [Android no Windows](docs/android-windows.md)
- [Arquitetura e fluxos compartilhados](docs/mobile-ui.md)
- [Princípios do produto](PRODUCT.md)
- [Tokens e componentes](DESIGN.md)
