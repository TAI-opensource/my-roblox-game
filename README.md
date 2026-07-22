# My Roblox Game

Jogo feito com roblox-ts (TypeScript → Luau).

---

## Como Iniciar (Windows)

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18+)
- [Git Bash](https://git-scm.com/downloads) (já vem com o Git)
- [Roblox Studio](https://www.roblox.com/create/) com o plugin [Rojo](https://create.roblox.com/store/asset/6320945503/Rojo) instalado

---

### Passo 1: Baixar o projeto

1. Abra https://github.com/TAI-opensource/my-roblox-game
2. Clique no botão verde **<> Code**
3. Clique em **Download ZIP**
4. Descompacte na Área de Trabalho
5. Você terá uma pasta chamada `my-roblox-game-master`

---

### Passo 2: Instalar dependências

1. Abra a pasta `my-roblox-game-master`
2. Clique com o botão direito em espaço vazio → **Open Git Bash here**
3. Cole e aperte Enter:

```bash
npm install
```

4. Aguarde terminar (vai baixar uns pacotes)

---

### Passo 3: Instalar roblox-ts

No **mesmo terminal**, cole:

```bash
npm install -g roblox-ts
```

---

### Passo 4: Baixar o Rojo CLI

O Rojo que baixa pelo npm está descontinuado. Precisa baixar o correto:

1. Abra https://github.com/rojo-rbx/rojo/releases
2. Baixe o arquivo `rojo-x.x.x-windows.zip`
3. Descompacte em algum lugar (ex: `C:\rojo\`)
4. Copie o caminho da pasta onde descompactou

No **mesmo terminal**, cole (substitua pelo caminho real):

```bash
export PATH="$PATH:/c/Users/usuario/Desktop/rojo"
```

> **Ou** adicione manualmente a pasta do Rojo ao PATH do Windows:
> 1. Pesquise "Variáveis de Ambiente" no Windows
> 2. Clique em "Variáveis de Ambiente"
> 3. Em "Variáveis do sistema", selecione "Path"
> 4. Clique em "Editar" → "Novo"
> 5. Cole o caminho da pasta do Rojo
> 6. OK em tudo

---

### Passo 5: Compilar o jogo

No terminal dentro da pasta `my-roblox-game-master`, cole:

```bash
rbxtsc -w
```

> Vai aparecer: `Found 0 errors. Watching for file changes.`
> **Deixe este terminal aberto!**

---

### Passo 6: Iniciar o servidor Rojo

**IMPORTANTE:** Abra um **SEGUNDO** terminal **DENTRO da mesma pasta**:

1. Volte para a pasta `my-roblox-game-master`
2. Clique com o botão direito → **Open Git Bash here**
3. Cole:

```bash
rojo serve
```

> Vai aparecer: `Serving on http://localhost:34872`
> **Deixe este terminal aberto também!**

---

### Passo 7: Conectar no Roblox Studio

1. Abra o **Roblox Studio**
2. Abra seu jogo (Place)
3. Clique no plugin **Rojo** (ícone vermelho)
4. Clique em **Connect**

Pronto! O jogo vai aparecer no Studio.

---

## Editando o Código

1. Abra os arquivos `.ts` na pasta `src/` com qualquer editor (VSCode, Notepad++, etc.)
2. Salve o arquivo
3. O terminal do `rbxtsc -w` vai recompilar automaticamente
4. No Studio, o Rojo atualiza o jogo

---

## Estrutura do Projeto

```
my-roblox-game-master/
├── src/
│   ├── server/          ← Scripts do servidor (main.server.ts)
│   ├── client/          ← Scripts do cliente (main.client.ts)
│   └── shared/          ← Código compartilhado (PlayerData.ts)
├── out/                 ← Código compilado (gerado pelo rbxtsc)
├── include/             ← Runtime files do roblox-ts
├── default.project.json ← Configuração do Rojo
├── tsconfig.json        ← Configuração do TypeScript
└── package.json         ← Dependências
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

### "Rojo server not found"
- Verifique se o `rojo serve` está rodando no terminal
- Verifique se está na pasta certa do projeto

### "npm: command not found"
- Instale o Node.js em https://nodejs.org/

### "rbxtsc: command not found"
- Rode: `npm install -g roblox-ts`

### Rojo não conecta no Studio
- Verifique se o plugin Rojo está instalado
- Verifique se a porta 34872 não está bloqueada
