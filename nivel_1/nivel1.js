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
    {
      q: "Sou uma estrela-do-mar. Quanto plástico invade o meu oceano todos os anos?",
      opcoes: ["Cerca de 8 milhões de toneladas", "Algumas centenas de quilos", "Menos de 1 tonelada"]
    },
    {
      q: "Confundi lixo com comida. Por que isso acontece?",
      opcoes: ["O plástico parece medusas", "Tem cheiro a algas", "Brilha no fundo do mar"]
    },
    {
      q: "O que são microplásticos que entram no meu corpo?",
      opcoes: ["Fragmentos minúsculos de plástico", "Areia poluída", "Restos de conchas"]
    },
    {
      q: "Qual é o maior perigo do lixo para animais como eu?",
      opcoes: [
        "Ferimentos, sufocamento e intoxicação",
        "Aumento da temperatura da água",
        "Perda da cor do oceano"
      ]
 
    },
    {
      q: "Mesmo sem dentes, eu posso ser afetada por plástico?",
      opcoes: ["Não, só peixes grandes", "Sim, através da cadeia alimentar", "Apenas se morder"]

    },
    {
      q: "Qual destes demora mais tempo a desaparecer do meu habitat?",
      opcoes: [ "Papel molhado", "Restos de comida","Garrafa de plástico"]

    },
    {
      q: "O plástico que engulo pode chegar aos humanos?",
      opcoes: [
        "Sim, através da cadeia alimentar",
        "Não, o corpo elimina",
        "Só em oceanos poluídos"
      ]
    },
    {
      q: "O que são as chamadas 'ilhas de lixo'?",
      opcoes: [
        
        "Ilhas artificiais",
        "Plataformas flutuantes",
        "Grandes zonas oceânicas com plástico acumulado"
      ]
    },
    {
      q: "Qual animal marinho sofre MAIS com o lixo plástico?",
      opcoes: ["Caranguejos", "Tartarugas e aves marinhas", "Polvos"]
    },
    {
      q: "Qual atitude humana ajuda verdadeiramente a salvar o meu lar?",
      opcoes: [
        
        "Recolher lixo só na praia",
        "Usar plástico biodegradável sempre",
        "Reduzir, reutilizar e reciclar"
      ]
    },
    {
      q: "O plástico liberta substâncias perigosas na água?",
      opcoes: ["Não, é inerte","Sim, ao longo do tempo", "Apenas com calor extremo"]
    },
    {
      q: "O que NUNCA deveria estar no oceano onde vivo?",
      opcoes: ["Sal" , "Plástico descartável", "Areia"]
    }
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


  function criarLixos(qtd) {
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
    mostrarTextoLixoRemovido();

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
  // Flash vermelho
  const flash = document.createElement('div');
  flash.className = 'erro-flash';
  document.body.appendChild(flash);

  // Mensagem dramática
  const msg = document.createElement('div');
  msg.className = 'erro-msg';
  msg.textContent = "RESPOSTA ERRADA!";
  document.body.appendChild(msg);

  // Tremer o ecrã
  document.body.classList.add("tremer");

  setTimeout(() => {
    flash.remove();
    msg.remove();
    document.body.classList.remove("tremer");
  }, 1200); // ⬅ tempo realista
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

  function mostrarTextoLixoRemovido() {
    const msg = document.getElementById("lixo-removido-msg");

    msg.style.opacity = "1";
    msg.style.transform = "translate(-50%, -50%) scale(1)";

    setTimeout(() => {
      msg.style.opacity = "0";
      msg.style.transform = "translate(-50%, -50%) scale(0.6)";
    }, 600);
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
    const nivelConcluido = nivel;

    nivel++;

    const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
    if (nivel > nivelMaximo) {
      localStorage.setItem("nivelMaximo", nivel);
    }

    localStorage.setItem("nivelRecemDesbloqueado", nivel);

    setTimeout(() => {
      window.location.href = "../pag_niveis/niveis.html";
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

