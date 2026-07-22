# My Roblox Game

Jogo feito com roblox-ts (TypeScript → Luau).

---

## Como Iniciar (Sem Console)

### Passo 1: Baixar o build pronto

1. Abra https://github.com/TAI-opensource/my-roblox-game/actions
2. Clique em **"Build Game"** (ícone verde ✓)
3. Na parte de baixo, clique em **"game-build"**
4. Clique em **"Download artifact"**
5. Descompacte na Área de Trabalho

---

### Passo 2: Iniciar o Rojo

1. Abra a pasta descompactada
2. Clique com o botão direito → **Open Git Bash here**
3. Cole:

```bash
./rojo serve
```

> Vai aparecer: `Serving on http://localhost:34872`
> **Deixe o terminal aberto!**

---

### Passo 3: Conectar no Roblox Studio

1. Abra o **Roblox Studio**
2. Abra seu jogo (Place)
3. Clique no plugin **Rojo** (ícone vermelho)
4. Clique em **Connect**

Pronto! O jogo vai aparecer no Studio.

---

## Como Editar o Código

### Opção 1: Pelo GitHub (sem console)

1. Abra https://github.com/TAI-opensource/my-roblox-game
2. Clique em **src/** → escolha o arquivo `.ts`
3. Clique no ícone ✏️ para editar
4. Faça suas mudanças
5. Clique em **Commit changes**
6. Vá em **Actions** → aguarde compilar
7. Baixe o novo **game-build**
8. No Studio, o Rojo atualiza automaticamente

### Opção 2: No PC (com console)

1. Clone o repositório
2. Abra o Git Bash na pasta do projeto
3. Rode:

```bash
npm install
npm install -g roblox-ts
rbxtsc -w
```

4. Em outro terminal:

```bash
./rojo serve
```

---

## Estrutura do Projeto

```
src/
├── server/          ← Scripts do servidor (main.server.ts)
├── client/          ← Scripts do cliente (main.client.ts)
└── shared/          ← Código compartilhado (PlayerData.ts)

out/                 ← Código compilado (gerado pelo build)
include/             ← Runtime files do roblox-ts
default.project.json ← Configuração do Rojo
tsconfig.json        ← Configuração do TypeScript
package.json         ← Dependências
```

---

## Arquivos Importantes

| Arquivo | O que faz |
|---|---|
| `src/server/main.server.ts` | Código que roda no servidor |
| `src/client/main.client.ts` | Código que roda no cliente |
| `src/shared/PlayerData.ts` | Dados compartilhados |

---

## Solução de Problemas

### "Couldn't connect to the Rojo server"
- Verifique se o terminal está rodando `./rojo serve`
- Verifique se está dentro da pasta do projeto

### "Rojo serve" não funciona
- Certifique-se de baixou o **game-build** (não o código fonte)
- O binário do Rojo já vem no build

### Rojo não conecta no Studio
- Verifique se o plugin Rojo está instalado
- Verifique se a porta 34872 não está bloqueada
