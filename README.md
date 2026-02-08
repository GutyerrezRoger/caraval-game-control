# 🎪 Caraval Game Control

Aplicação interativa desenvolvida em **React** para gerenciar a experiência de um Clube do Livro temático baseado em "Caraval". O sistema utiliza a API **BroadcastChannel** para comunicação em tempo real entre duas abas do navegador (Controle e Exibição), sem necessidade de servidor backend complexo.

## 🖥️ Telas

1.  **TV (Display):** Projetada para ser transmitida na TV. Reage aos comandos do mestre, exibe animações, cartas, votações e eliminações.
2.  **Admin (Mestre Lenda):** Painel de controle onde o organizador dispara eventos, troca as fases do jogo e controla a narrativa.

## 🛠️ Tecnologias

* React.js
* Tailwind CSS (Estilização e Animações)
* BroadcastChannel API (Comunicação entre abas)
* Lucide React (Ícones)

## ✨ Funcionalidades

* **Sistema de Cartas:** Revelação de cartas com animações de "mesa" (física de cartas).
* **Timeline Interativa:** Navegação pelos capítulos do livro.
* **Tribunal:** Gráficos de votação em tempo real com layout dinâmico.
* **Zona de Morte:** Sistema de eliminação de participantes com feedback visual.

## 🚀 Como rodar

1.  Clone o projeto.
2.  `npm install`
3.  `npm run dev`
4.  Abra duas abas: `localhost:5173/admin` e `localhost:5173/tv`.
