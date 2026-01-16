localStorage.setItem("nivelAtual", 2);
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

  const player = document.querySelector('.player');

  if (!player) console.warn("⚠ .player não encontrado no HTML!");

  if (!lixosContainer) { console.error('#lixos não encontrado'); return; }
  if (!popup) console.warn('popup não encontrado');

  // GAME STATE
  let nivel = 2;
  let progresso = 0;
  let lixosAtivos = [];
  let lixoSelecionado = null;
  let respostaCorreta = 0;

  // ------- PERGUNTAS -------
  const perguntas = [
    {
      q: "Sou um tubarão. Porque é que o plástico é perigoso mesmo para mim?",
      opcoes: [
        "Porque me corta os dentes",
        "Porque pode ser confundido com presas",
        "Porque muda o sabor da água"
      ],
      certa: 1
    },
    {
      q: "O que acontece quando engulo um peixe que já comeu plástico?",
      opcoes: [
        "Nada, o meu corpo filtra tudo",
        "O plástico pode acumular-se no meu corpo",
        "Fico imediatamente doente"
      ],
      certa: 1
    },
    {
      q: "As redes de pesca abandonadas são perigosas porque…",
      opcoes: [
        "Continuam a capturar animais durante anos",
        "Enferrujam rapidamente",
        "Só afetam peixes pequenos"
      ],
      certa: 0
    },
    {
      q: "Qual destes materiais é MAIS comum no lixo marinho?",
      opcoes: [
        "Vidro",
        "Metal",
        "Plástico"
      ],
      certa: 2
    },
    {
      q: "Porque é que o lixo no oceano afeta toda a cadeia alimentar?",
      opcoes: [
        "Porque os predadores comem as presas contaminadas",
        "Porque só afeta animais grandes",
        "Porque se dissolve rapidamente"
      ],
      certa: 0
    },
    {
      q: "O que são microplásticos?",
      opcoes: [
        "Plásticos usados apenas em fábricas",
        "Plásticos grandes cortados por humanos",
        "Fragmentos muito pequenos de plástico"
      ],
      certa: 2
    },
    {
      q: "Qual é uma consequência REAL do lixo para os tubarões?",
      opcoes: [
        "Mudança de cor da pele",
        "Ferimentos e problemas internos",
        "Perda da visão imediata"
      ],
      certa: 1
    },
    {
      q: "Qual destas ações humanas ajuda mais a proteger o oceano?",
      opcoes: [
        "Usar plástico apenas no verão",
        "Reduzir o uso de plásticos descartáveis",
        "Deitar lixo longe da costa"
      ],
      certa: 1
    },
    {
      q: "Porque é errado dizer que o oceano é grande demais para ser poluído?",
      opcoes: [
        "Porque as correntes espalham o lixo por todo o planeta",
        "Porque o lixo afunda sempre",
        "Porque os animais evitam zonas sujas"
      ],
      certa: 0
    },
    {
      q: "O plástico no oceano pode desaparecer sozinho?",
      opcoes: [
        "Sim, em poucos meses",
        "Não, pode durar centenas de anos",
        "Sim, se estiver no fundo do mar"
      ],
      certa: 1
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

      if (lixosAtivos.length === 0) {
        setTimeout(() => {
          window.location.href = "../minijogo_estrela/comida.html";
        }, 600);
        return;
      }

      atualizarProgresso();
    }, 620);
  }

  function mostrarErro() {
    const flash = document.createElement('div');
    flash.className = 'erro-flash';
    document.body.appendChild(flash);

    const msg = document.createElement('div');
    msg.className = 'erro-msg';
    msg.textContent = "RESPOSTA ERRADA!";
    document.body.appendChild(msg);

    document.body.classList.add("tremer");

    setTimeout(() => {
      flash.remove();
      msg.remove();
      document.body.classList.remove("tremer");
    }, 1200);
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
      player.style.backgroundImage = "url('../characters/animals/tubarao/tubarao-sujo.svg')";
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

  background.style.backgroundImage =
    `url('../assets/fundo/fundo-${stage}.svg')`;

  playerImg.src = `../assets/characters/animals/tubarao/tubarao-${stage}.svg`;

}

// nível atual concluído
const nivelAtual = 2;

// guardar nível atual
localStorage.setItem("nivelAtual", nivelAtual);

// desbloquear próximo nível
const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
if (nivelMaximo < nivelAtual + 1) {
  localStorage.setItem("nivelMaximo", nivelAtual + 1);
}
