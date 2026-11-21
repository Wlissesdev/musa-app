# MUSA

Diário digital de cuidado e saúde mental feminina, inspirado em Nise da Silveira.
Funciona como PWA (instalável no celular) e mantém **todos os dados no próprio aparelho** —
nada é enviado para servidores.

## Como funciona

Site estático, sem etapa de build. Basta publicar a pasta.

- `index.html` — estrutura da página (sidebar de navegação, telas de abertura/PIN, toast).
- `src/css/app.css` — estilos responsivos (mobile e desktop) e tema claro/escuro.
- `src/js/`
  - `data.js` — conteúdo fixo (humores, frases, rituais, livros, respiração, citações).
  - `store.js` — estado do app e persistência em `localStorage`.
  - `dom.js` — utilidades (escape, datas, sequência, conquistas, toast, hash do PIN).
  - `views.js` — renderização de cada aba (Hoje, Diário, Ateliê, Calma, Eu).
  - `actions.js` — ações do usuário (registro, diário, plano, dados, PIN).
  - `pin.js` — tela de PIN (criar, confirmar, remover, desbloquear).
  - `main.js` — ponto de entrada: abertura, registro das funções globais e inicialização.
- `manifest.webmanifest` — metadados do PWA.
- `sw.js` — service worker (funciona offline).
- `icons/` — ícones do app e a foto usada na interface.

## Rodar localmente

Como usa módulos ES e service worker, precisa de um servidor (não abra via `file://`):

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Deploy no Vercel

1. Instale a CLI: `npm i -g vercel`
2. Na pasta do projeto: `vercel` (preview) ou `vercel --prod` (produção).

O `vercel.json` já cuida do fallback de rotas e dos cabeçalhos.

## Gerar APK (opcional)

1. Suba o site em um host HTTPS (ex.: Vercel).
2. Abra https://pwabuilder.com, cole a URL e empacote para Android.
3. Instale o APK. Sem APK, dá para instalar direto pelo Chrome no Android:
   menu → "Instalar app". O ícone é a foto da Nise (`icons/maskable-512.png`).

## Privacidade

Os registros ficam apenas no aparelho (localStorage). O MUSA **não substitui**
acompanhamento psicológico ou médico. Em situações de risco, use os contatos
da aba **Eu** (CVV 188, SAMU 192, Ligue 180).
