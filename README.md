<div align="center">

# MUSA · Diário de cuidado

**Diário digital de cuidado e saúde mental feminina, inspirado em Nise da Silveira.**

PWA instalável no celular · 100% offline · seus dados nunca saem do aparelho.

[![Demo](https://img.shields.io/badge/demo-musa--app--bice.vercel.app-6D28D9?style=flat-square&logo=vercel&logoColor=white)](https://musa-app-bice.vercel.app)
[![PWA](https://img.shields.io/badge/PWA-instal%C3%A1vel-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://musa-app-bice.vercel.app)
[![Sem build](https://img.shields.io/badge/build-nenhum-3fb950?style=flat-square)](#-rodar-localmente)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](./LICENSE)

</div>

---

## 🔬 Sobre a pesquisa

O **MUSA** integra o projeto de pesquisa **Um Olhar para a Saúde Mental Feminina a partir da Literatura Comparada**, desenvolvido na **ArteCeb**. A pesquisa aproxima a literatura comparada do debate sobre saúde mental feminina — e este aplicativo é o produto de cuidado que nasceu dela: um espaço privado para registrar o dia, os sentimentos e os rituais de autocuidado.

O app inspira-se no legado de **Nise da Silveira** (1905–1999), psiquiatra brasileira que revolucionou o tratamento em saúde mental ao valorizar a arte, o afeto e a expressão como formas de cuidado.

> 🧠 **Site da pesquisa:** [musa-site](https://github.com/Wlissesdev/musa-site) · [musazip-ten.vercel.app](https://musazip-ten.vercel.app)

---

## ✨ Funcionalidades

- **Hoje** — registro do humor do dia e uma frase de cuidado que muda diariamente
- **Diário** — escrita livre e acompanhamento ao longo do tempo
- **Ateliê** — propostas criativas e rituais de expressão (referência a Nise da Silveira)
- **Calma** — exercícios de respiração guiada
- **Eu** — conquistas, sequência de dias, preferências e contatos de apoio (CVV 188, SAMU 192, Ligue 180)
- **PIN de acesso** — proteção por senha local
- **Tema claro/escuro** e layout responsivo (celular e desktop)
- **Offline-first** — funciona sem internet após a primeira visita

---

## 🔐 Privacidade

Todos os registros ficam **apenas no aparelho** (via `localStorage`). O MUSA **não envia dados para servidores**, **não exige cadastro** e **não usa rastreadores**.

O MUSA é uma ferramenta de cuidado e **não substitui** acompanhamento psicológico ou médico. Em situações de risco, procure ajuda — os contatos estão na aba **Eu** (CVV 188 · SAMU 192 · Ligue 180).

---

## 🛠️ Tecnologias

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Service%20Worker-5A0FC8?style=flat-square)

Aplicação **estática, sem etapa de build**: HTML, CSS e JavaScript (módulos ES) puros, com Service Worker para funcionar offline.

---

## 📁 Estrutura

```
.
├── index.html              # Estrutura da página (sidebar, abertura/PIN, toast)
├── manifest.webmanifest    # Metadados do PWA
├── sw.js                   # Service worker (cache offline)
├── icons/                  # Ícones do app e foto usada na interface
├── src/
│   ├── css/
│   │   └── app.css         # Estilos responsivos + tema claro/escuro
│   └── js/
│       ├── data.js         # Conteúdo fixo (humores, frases, rituais, livros, citações)
│       ├── store.js        # Estado do app e persistência em localStorage
│       ├── dom.js          # Utilidades (escape, datas, conquistas, toast, hash do PIN)
│       ├── views.js        # Renderização de cada aba (Hoje, Diário, Ateliê, Calma, Eu)
│       ├── actions.js      # Ações do usuário (registro, diário, plano, dados, PIN)
│       ├── pin.js          # Tela de PIN (criar, confirmar, remover, desbloquear)
│       └── main.js         # Ponto de entrada e inicialização
└── vercel.json             # Rewrites e headers (cache do SW, tipo do manifest)
```

---

## 🚀 Rodar localmente

Como o app usa **módulos ES** e **Service Worker**, é preciso um servidor local (não abra via `file://`):

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

---

## 🌐 Deploy

O deploy é feito na [Vercel](https://vercel.com). O `vercel.json` já cuida do fallback de rotas e dos cabeçalhos de cache do Service Worker.

```bash
vercel --prod
```

---

## 📱 Gerar APK (opcional)

1. Suba o site em um host HTTPS (ex.: Vercel).
2. Acesse [pwabuilder.com](https://pwabuilder.com), cole a URL e empacote para Android.
3. Instale o APK. Sem APK, dá para instalar direto pelo Chrome no Android: menu → **"Instalar app"**.

---

## 📄 Licença

Código sob a **Licença MIT** — veja [`LICENSE`](./LICENSE).
O conteúdo de pesquisa do projeto (textos, análises) é licenciado em **CC BY 4.0** no repositório [musa-site](https://github.com/Wlissesdev/musa-site).

---

<div align="center">
<sub>Projeto <strong>MUSA</strong> · ArteCeb · Inspirado em Nise da Silveira 💜</sub>
</div>
