localStorage.setItem("nivelAtual", 5);
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
  let nivel = 5;
  let progresso = 0;
  let lixosAtivos = [];
  let lixoSelecionado = null;
  let respostaCorreta = 0;

  // ------- PERGUNTAS -------
const perguntas = [
  {
    q: "Sou um polvo. Sabias que o plástico pode afetar a minha inteligência? Como?",
    opcoes: [
      "Interferindo no meu sistema nervoso",
      "Mudando a cor da minha pele",
      "Reduzindo o número de braços"
    ],
    certa: 0
  },
  {
    q: "Microplásticos já foram encontrados em qual destas partes do meu corpo?",
    opcoes: [
      "Apenas nos tentáculos",
      "No sistema digestivo e nos tecidos",
      "Só na superfície da pele"
    ],
    certa: 1
  },
  {
    q: "Porque o polvo é especialmente vulnerável ao lixo escondido em fendas?",
    opcoes: [
      "Porque caça em tocas e buracos",
      "Porque vive apenas à superfície",
      "Porque não consegue ver bem"
    ],
    certa: 0
  },
  {
    q: "O que acontece quando um polvo usa lixo como abrigo?",
    opcoes: [
      "Pode ficar preso ou ferido",
      "Fica mais protegido de predadores",
      "Nada acontece"
    ],
    certa: 0
  },
  {
    q: "Qual destes objetos representa MAIOR perigo para mim no fundo do mar?",
    opcoes: [
      "Garrafas de vidro",
      "Redes de pesca abandonadas",
      "Conchas naturais"
    ],
    certa: 1
  },
  {
    q: "Por que os polvos são considerados indicadores da saúde do oceano?",
    opcoes: [
      "Porque vivem pouco tempo",
      "Porque acumulam toxinas rapidamente",
      "Porque só comem algas"
    ],
    certa: 1
  },
  {
    q: "Mesmo que eu não engula plástico diretamente, posso ser afetado porque…",
    opcoes: [
      "O plástico dissolve-se na água",
      "As minhas presas já o ingeriram",
      "O plástico desaparece sozinho"
    ],
    certa: 1
  },
  {
    q: "Qual destas afirmações é VERDADEIRA?",
    opcoes: [
      "O plástico no oceano é reciclado naturalmente",
      "O plástico apenas afeta animais grandes",
      "O plástico fragmenta-se mas nunca desaparece"
    ],
    certa: 2
  },
  {
    q: "Porque redes fantasmas são especialmente perigosas para polvos?",
    opcoes: [
      "Porque são coloridas",
      "Porque continuam a capturar animais sem controlo",
      "Porque afundam lentamente"
    ],
    certa: 1
  },
  {
    q: "Qual destas ações humanas teria MAIOR impacto imediato na minha sobrevivência?",
    opcoes: [
      "Reduzir plástico descartável",
      "Criar mais aquários",
      "Pescar mais profundamente"
    ],
    certa: 0
  },
  {
    q: "O plástico que me afeta hoje pode impactar futuras gerações porque…",
    opcoes: [
      "O oceano se renova rapidamente",
      "O plástico permanece durante séculos",
      "Os polvos não vivem muito"
    ],
    certa: 1
  },
  {
    q: "Se o oceano continuar a poluir-se, o que pode acontecer comigo?",
    opcoes: [
      "Nada, eu adapto-me sempre",
      "Perda de habitat e sobrevivência",
      "Apenas mudança de cor"
    ],
    certa: 1
  },
  {
    q: "Qual destas frases resume melhor o problema do lixo no oceano?",
    opcoes: [
      "É um problema apenas visual",
      "Afeta todo o ecossistema marinho",
      "Afeta só zonas costeiras"
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
  atualizarProgresso(); 
  return;
}


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

  // guarda progresso
  localStorage.setItem("nivelAtual", nivel);

  const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
  if (nivel + 1 > nivelMaximo) {
    localStorage.setItem("nivelMaximo", nivel + 1);
  }

  // marca nível recém-desbloqueado
  localStorage.setItem("nivelRecemDesbloqueado", nivel + 1);

  // 👉 VAI PARA A VITÓRIA
  setTimeout(() => {
    window.location.href = "../vitoria/vitoria.html";
  }, 800);
}



  // ------- START DO NÍVEL -------

  function iniciarNivel() {
    progresso = 0;

    if (progressCircle)
      progressCircle.style.strokeDashoffset = `${circunferencia}`;

    if (player) {
      player.style.backgroundImage = "url('../characters/animals/polvo/polvo-sujo.svg')";
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
  playerImg.src = `../assets/characters/animals/polvo/polvo-${stage}.svg`;

}

