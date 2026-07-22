# My Roblox Game

Jogo feito com roblox-ts (TypeScript → Luau).

## Como usar

### Opção 1: Baixar pronto (sem console)

1. Va em **Actions** → **Build Game** → baixe o **game-build**
2. Descompacte a pasta `out/`
3. No Roblox Studio, abra o Rojo e clique em **Connect**

### Opção 2: Desenvolver (com console)

```bash
git clone https://github.com/TAI-opensource/my-roblox-game.git
cd my-roblox-game
npm install
npm install -g roblox-ts
rbxtsc -w
```

Em outro terminal:
```bash
npx rojo serve
```

No Studio, clique em **Connect** no Rojo.

## Estrutura

```
src/
├── server/     ← Scripts do servidor
├── client/     ← Scripts do cliente
└── shared/     ← Código compartilhado
```
