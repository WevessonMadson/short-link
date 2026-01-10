# 🔗 short-link

## 📌 Descrição

**short-link** é uma aplicação web construída com **React**, **Vite** e **TypeScript**, que permite ao usuário gerar links encurtados de forma prática e rápida.  
A interface possui um layout moderno, responsivo e organizado, com foco em simplicidade e eficiência no uso.

A aplicação foi projetada para ser estática e otimizada para deploy em plataformas como **Vercel**. O encurtador de URLs pode ser utilizado diretamente pelo usuário para transformar URLs longas em versões mais curtas e fáceis de compartilhar.

🔗 Deploy em produção:  
👉 https://t-short-link.vercel.app :contentReference[oaicite:1]{index=1}

---

## 🧠 Tecnologias utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

- **React** — Biblioteca principal para construção da interface de usuário.
- **Vite** — Ambiente de desenvolvimento rápido e ferramenta de build moderna.
- **TypeScript** — Tipagem estática para maior robustez e organização do código.
- **Tailwind CSS** — Utilitário de classes para estilização ágil e consistente.
- **shadcn/ui** — Componentes estilizados e reutilizáveis para a interface.
- **Vercel** — Plataforma de hospedagem e deploy contínuo.

---

## 🚀 Funcionalidades

- ✂️ Permite encurtar URLs longas para versões mais curtas.
- Permite edição de URLs longas, para não perder a URL curta já compartilhada.
- 📋 Interface clara para entrada e exibição dos links.
- 📱 Layout responsivo para diferentes dispositivos.
- ⚡ Experiência rápida no frontend com feedback visual.
- 🌐 Deploy estático otimizado para produção.

---

## 📁 Estrutura do projeto

```text
short-link/
├── public/
│   ├── favicon.ico
│   └── (outros arquivos públicos)
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   ├── data/              # Dados estáticos ou mocks
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Funções utilitárias
│   ├── pages/             # Páginas principais da aplicação
│   ├── styles/            # Estilos globais ou específicos
│   ├── App.tsx            # Componente raiz da aplicação
│   └── main.tsx           # Ponto de entrada do React
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── eslint.config.js
