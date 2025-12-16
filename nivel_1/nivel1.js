// pag_niveis/nivel1.js
(() => {
  'use strict';

  // SELECTORS
  const popup = document.getElementById('popup');
  const perguntaEl = document.getElementById('pergunta');
  const botoes = Array.from(document.querySelectorAll('.opcao'));
  const lixosContainer = document.getElementById('lixos');

  const btnConfig = document.getElementById('btn-config');
  const popupConfig = document.getElementById('popup-config');
  const btnFecharConfig = document.getElementById('btn-fechar-config');
  const btnSair = document.getElementById('btn-sair');
  const btnMenu = document.getElementById('btn-menu');

  const progressCircle = document.getElementById('progress');
  const levelNumber = document.getElementById('level-number');

  // ESTE É O TEU PLAYER (não existia #player-img)
  const player = document.querySelector('.player');

  if (!player) console.warn("⚠ .player não encontrado no HTML!");

  // quick safety checks
  if (!lixosContainer) { console.error('#lixos não encontrado'); return; }
  if (!popup) console.warn('popup não encontrado');

  // GAME STATE
  let nivel = 1;
  let progresso = 0;
  let lixosAtivos = [];
  let lixoSelecionado = null;
  let respostaCorreta = 0;

  // ------- PERGUNTAS -------
  const perguntas = [
    { q: "Quanto plástico vai parar ao oceano por ano?", opcoes: ["8 milhões de toneladas", "10 quilos", "100 toneladas"], certa: 0 },
    { q: "Por que as tartarugas comem plástico?", opcoes: ["Parece medusas", "Cheira bem", "É nutritivo"], certa: 0 },
    { q: "O que são microplásticos?", opcoes: ["Pequenos pedaços de plástico", "Areia colorida", "Algas tóxicas"], certa: 0 },
    { q: "Qual é o maior problema do lixo no mar?", opcoes: ["Afeta a vida marinha", "A água fica mais quente", "A água fica mais azul"], certa: 0 },
    { q: "Peixes podem engolir plástico?", opcoes: ["Sim", "Não", "Só os grandes"], certa: 0 },
    { q: "Qual destes objetos demora mais a decompor?", opcoes: ["Garrafa de plástico", "Papel", "Comida"], certa: 0 },
    { q: "O plástico no mar pode entrar na cadeia alimentar humana?", opcoes: ["Sim", "Não", "Só na China"], certa: 0 },
    { q: "O que é uma 'ilha de lixo'?", opcoes: ["Aglomerado de plástico no mar", "Uma ilha turística", "Um vulcão"], certa: 0 },
    { q: "Qual animal marinho mais sofre com o plástico?", opcoes: ["Tartarugas", "Golfinhos", "Caranguejos"], certa: 0 },
    { q: "Qual a forma mais eficaz de reduzir lixo?", opcoes: ["Reciclar e reutilizar", "Deixar no chão", "Partir tudo"], certa: 0 },
    { q: "O plástico pode libertar toxinas na água?", opcoes: ["Sim", "Não", "Só ao sol"], certa: 0 },
    { q: "Qual destes NÃO deve ir para o mar?", opcoes: ["Plástico", "Água", "Areia"], certa: 0 }
  ];

  // ------- PROGRESS CIRCLE -------
  const raio = 45;
  const circunferencia = 2 * Math.PI * raio;
  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circunferencia}`;
    progressCircle.style.strokeDashoffset = `${circunferencia}`;
  }

  // UTILS
  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function escolherPergunta() { return perguntas[Math.floor(Math.random() * perguntas.length)]; }

  // ------- SETTINGS POPUP -------
  function bindSettingsUI() {
    btnConfig?.addEventListener('click', () => popupConfig.classList.remove('hidden'));
    btnFecharConfig?.addEventListener('click', () => popupConfig.classList.add('hidden'));
    popupConfig?.addEventListener('click', e => { if (e.target === popupConfig) popupConfig.classList.add('hidden'); });
    btnSair?.addEventListener('click', () => window.location.href = '../index.html');
    btnMenu?.addEventListener('click', () => window.location.href = '../niveis.html');
  }

  // ------- LIXOS -------
  function posicaoValida(novoRect, existentesRects, minDist = 70) {
    for (const r of existentesRects) {
      const dx = (novoRect.left + novoRect.width / 2) - (r.left + r.width / 2);
      const dy = (novoRect.top + novoRect.height / 2) - (r.top + r.height / 2);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) return false;
    }
    return true;
  }

function colide(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}


  function criarLixos(qtd){
  lixosContainer.innerHTML = '';
  lixosAtivos = [];
  const rects = [];

  for (let i = 0; i < qtd; i++) {

    const lixo = document.createElement('img');
    lixo.className = 'lixo';
    lixo.style.position = 'absolute';
    lixo.style.width = '120px';
    lixo.style.height = '120px';

    const n = rnd(1, 6);
    lixo.src = `../assets/lixo/lixo${n}.svg`;
    
    lixo.onload = () => {
      let tent = 0, colocado = false;

      while (!colocado && tent < 100) {
        const left = rnd(8, 82);
        const top = rnd(10, 75);

        lixo.style.left = left + '%';
        lixo.style.top = top + '%';

        const rect = lixo.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (!colide(rect, playerRect) && posicaoValida(rect, rects, 80)) {
          rects.push(rect);
          colocado = true;
          lixo.addEventListener('click', () => abrirPergunta(lixo));
          lixosAtivos.push(lixo);
        }
        tent++;
      }
    };

    lixosContainer.appendChild(lixo);
  }
}


  // ------- PERGUNTA -------
  botoes.forEach((btn, idx) => btn.addEventListener('click', () => responder(idx)));

  function abrirPergunta(lixo) {
    lixoSelecionado = lixo;
    const p = escolherPergunta();

    perguntaEl.textContent = p.q;
    respostaCorreta = p.certa;

    botoes.forEach((b, i) => b.textContent = p.opcoes[i]);

    popup.classList.remove('hidden');
  }

  function responder(opcao) {
    popup.classList.add('hidden');

    if (opcao !== respostaCorreta) {
      mostrarErro();
      return;
    }

    const rect = lixoSelecionado.getBoundingClientRect();
    mostrarLixoRemovido(rect.left + rect.width / 2, rect.top + rect.height / 2);

    lixoSelecionado.style.transition = 'transform .6s ease, opacity .6s ease';
    lixoSelecionado.style.transform = 'scale(0) rotate(360deg)';
    lixoSelecionado.style.opacity = '0';

    lixosAtivos = lixosAtivos.filter(l => l !== lixoSelecionado);

    setTimeout(() => {
      lixoSelecionado.remove();
      lixoSelecionado = null;
      atualizarProgresso();
    }, 620);
  }

function mostrarErro() {
  const flash = document.createElement('div');
  flash.className = 'erro-flash';
  document.body.appendChild(flash);

  setTimeout(() => flash.remove(), 600);
}


      function mostrarLixoRemovido(x, y) {
    const numParticulas = 12;
    for (let i = 0; i < numParticulas; i++) {
      const particula = document.createElement('div');
      particula.className = 'particle lixo-removido';
      
      const angle = (i / numParticulas) * Math.PI * 2;
      const velocity = 3 + Math.random() * 2;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      particula.style.left = x + 'px';
      particula.style.top = y + 'px';
      document.body.appendChild(particula);
      
      setTimeout(() => {
        particula.style.transform = `translate(${vx * 80}px, ${vy * 80}px)`;
        particula.style.opacity = '0';
      }, 10);
      
      setTimeout(() => particula.remove(), 800);
    }
  }

  // ------- PROGRESSO -------
  function quantidadeLixoPorNivel(n) {
    return Math.max(3, Math.floor(6 + Math.pow(n, 1.5)) + (Math.floor(Math.random() * 3) - 1));
  }

  function atualizarProgresso() {
    const total = quantidadeLixoPorNivel(nivel);
    const restante = lixosAtivos.length;

    progresso = Math.round(100 * (1 - restante / total));
    progresso = Math.min(100, Math.max(0, progresso));

    if (progressCircle) {
        const offset = circunferencia * (1 - progresso / 100);
        progressCircle.style.strokeDashoffset = `${offset}`;
    }

    updateScene(progresso);

    if (progresso >= 100) subirNivel();
}


  function subirNivel() {
  nivel++;

  if (levelNumber) levelNumber.textContent = `${nivel}`;

  const overlay = document.getElementById('level-up-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.opacity = '1';
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.classList.add('hidden'), 400);
    }, 1400);
  }

  // 👉 SE o nível terminou, muda para a próxima página
  setTimeout(() => {
window.location.href = `../nivel_${nivel}/nivel${nivel}.html`;
  }, 900);
}

  // ------- START DO NÍVEL -------

  function iniciarNivel() {
    progresso = 0;

    if (progressCircle)
      progressCircle.style.strokeDashoffset = `${circunferencia}`;

    if (player) {
      player.style.backgroundImage = "url('../characters/animals/estrela/estrela-sujo.svg')";
      player.style.backgroundSize = "contain";
      player.style.backgroundRepeat = "no-repeat";
      player.style.backgroundPosition = "center";
    }

    const qtd = quantidadeLixoPorNivel(nivel);
    criarLixos(qtd);
  }

  // ------- INIT -------
  function init() {
    bindSettingsUI();

    setTimeout(() => {
      const fala = document.getElementById('fala');
      if (fala) fala.style.display = 'none';
    }, 3000);

    iniciarNivel();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

function updateScene(progress) {
  const background = document.getElementById("background");
  const playerImg = document.getElementById("player");

  let stage = "";

  if (progress < 33) {
    stage = "sujo";
  } else if (progress < 66) {
    stage = "meio";
  } else {
    stage = "limpo";
  }

  // fundo certo
  background.style.backgroundImage =
    `url('../assets/fundo/fundo-${stage}.svg')`;

  // personagem certo
  playerImg.src = `../assets/characters/animals/estrela/estrela-${stage}.svg`;
}

