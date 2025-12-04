/************************************
 *  CONFIGURAÇÕES GERAIS / POPUP    *
 ************************************/
const popup = document.getElementById("popup");
const perguntaEl = document.getElementById("pergunta");
const botoes = document.querySelectorAll(".opcao");
const lixosContainer = document.getElementById("lixos");

const btnConfig = document.getElementById("btn-config");
const popupConfig = document.getElementById("popup-config");
const btnFecharConfig = document.getElementById("btn-fechar-config");
const btnSair = document.getElementById("btn-sair");
const btnMenu = document.getElementById("btn-menu");

btnConfig.addEventListener("click", () => popupConfig.classList.remove("hidden"));
btnFecharConfig.addEventListener("click", () => popupConfig.classList.add("hidden"));
popupConfig.addEventListener("click", e => { if (e.target === popupConfig) popupConfig.classList.add("hidden"); });
btnSair.addEventListener("click", () => window.location.href = "../index.html");
btnMenu.addEventListener("click", () => window.location.href = "../niveis.html");

/************************************
 *   "FALA" INICIAL
 ************************************/
setTimeout(() => {
  const fala = document.getElementById("fala");
  if (fala) fala.style.display = "none";
}, 3000);

/************************************
 *   PERGUNTAS
 ************************************/
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

/************************************
 *   SISTEMA DE NÍVEL / PROGRESSO
 ************************************/
let nivel = 1;
let progresso = 0;
let lixosAtivos = [];
let lixoSelecionado = null;
let respostaCorreta = 0;

const progressCircle = document.getElementById("progress");
const levelNumber = document.getElementById("level-number");

const raio = 45;
const circunferencia = 2 * Math.PI * raio;
progressCircle.style.strokeDasharray = circunferencia;
progressCircle.style.strokeDashoffset = circunferencia;

const animaisPorNivel = ["Estrela de Mar", "Tartaruga", "Medusa", "Tubarão", "Polvo"];
const variantesProgresso = { inicial: "#0077c2", meio: "#00c27f", final: "#c2a300" };

/************************************
 *   CRIAR PERSONAGEM
 ************************************/
function criarPersonagem(nivelAtual) {
  let p = document.querySelector(".player");

  if (!p) {
    p = document.createElement("div");
    p.classList.add("player");
    document.body.appendChild(p);
  }

  p.style.width = "120px";
  p.style.height = "120px";
  p.style.borderRadius = "50%";
  p.style.position = "absolute";
  p.style.top = "50%";
  p.style.left = "50%";
  p.style.transform = "translate(-50%, -50%)";

  let t = document.getElementById("texto-animal");
  if (!t) {
    t = document.createElement("div");
    t.id = "texto-animal";
    t.style.position = "absolute";
    t.style.top = "50%";
    t.style.left = "50%";
    t.style.transform = "translate(-50%,-50%)";
    t.style.color = "white";
    t.style.fontSize = "16px";
    t.style.fontWeight = "bold";
    p.appendChild(t);
  }

  t.textContent = animaisPorNivel[(nivelAtual - 1) % animaisPorNivel.length];
  atualizarPersonagemVisual();
}

/************************************
 *   ATUALIZAR VISUAL DO PLAYER
 ************************************/
function atualizarPersonagemVisual() {
  const p = document.querySelector(".player");
  if (!p) return;

  if (progresso <= 50) p.style.background = variantesProgresso.inicial;
  else if (progresso < 100) p.style.background = variantesProgresso.meio;
  else p.style.background = variantesProgresso.final;
}

/************************************
 *   CRIAR LIXOS
 ************************************/
function criarLixos(qtd) {
  lixosContainer.innerHTML = "";
  lixosAtivos = [];

  for (let i = 0; i < qtd; i++) {
    const lixo = document.createElement("div");
    lixo.classList.add("lixo");

    lixosContainer.appendChild(lixo);

    // Tentativas de encontrar posição válida
    let tentativas = 0;
    let valido = false;

    while (!valido && tentativas < 50) {
      lixo.style.left = Math.random() * 75 + 10 + "%";
      lixo.style.top = Math.random() * 75 + 10 + "%";

      valido = posicaoValida(lixo, lixosAtivos);
      tentativas++;
    }

    // caso extremo: coloca em último sítio gerado
    lixo.style.animationDelay = (Math.random() * 2).toFixed(2) + "s";

    lixo.addEventListener("click", () => abrirPergunta(lixo));

    lixosAtivos.push(lixo);
  }
}


function posicaoValida(novo, existentes) {
  const raio = 25; // raio aproximado do lixo (tamanho médio do quadrado)
  const distanciaMinima = raio * 2 + 10; // garante espaço entre eles

  for (let l of existentes) {
    const r = l.getBoundingClientRect();
    const n = novo.getBoundingClientRect();

    const dx = (n.left + n.width/2) - (r.left + r.width/2);
    const dy = (n.top + n.height/2) - (r.top + r.height/2);
    const distancia = Math.sqrt(dx*dx + dy*dy);

    if (distancia < distanciaMinima) {
      return false; // está a tocar → inválido
    }
  }
  return true;
}


/************************************
 *   ABRIR PERGUNTA
 ************************************/
function abrirPergunta(lixo) {
  lixoSelecionado = lixo;

  // 25% de chance — mini-jogo pH
  if (Math.random() < 0.25) {
    abrirMiniJogoPH();
    return;
  }

  // Pergunta normal
  const p = perguntas[Math.floor(Math.random() * perguntas.length)];
  perguntaEl.textContent = p.q;
  respostaCorreta = p.certa;

  botoes.forEach((b, i) => (b.textContent = p.opcoes[i]));

  popup.classList.remove("hidden");
}


/************************************
 *   ANIMAÇÃO LIXO REMOVIDO (feliz)
 ************************************/
function mostrarLixoRemovidoFeliz(x, y) {
  const msg = document.createElement("div");
  msg.id = "lixo-removido";
  msg.textContent = "LIXO REMOVIDO!";
  document.body.appendChild(msg);

  void msg.offsetWidth;
  msg.style.opacity = 1;
  msg.style.transform = "translate(-50%, -50%) scale(1.7)";

  let angle = 0;
  const shake = setInterval(() => {
    msg.style.transform = `translate(-50%, -50%) rotate(${Math.sin(angle) * 10}deg) scale(1.7)`;
    angle += 0.5;
  }, 25);

  for (let i = 0; i < 20; i++) {
    const part = document.createElement("div");
    part.classList.add("particle");
    part.style.left = x + "px";
    part.style.top = y + "px";
    document.body.appendChild(part);

    const ang = Math.random() * 2 * Math.PI;
    const dist = Math.random() * 150 + 50;

    setTimeout(() => {
      part.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
      part.style.opacity = 0;
    }, 50);

    setTimeout(() => part.remove(), 1200);
  }

  setTimeout(() => {
    clearInterval(shake);
    msg.style.opacity = 0;
    msg.style.transform = "translate(-50%, -100%) scale(1.5)";
    setTimeout(() => msg.remove(), 400);
  }, 1200);
}

/************************************
 *   ANIMAÇÃO DARK ERRO
 ************************************/
function mostrarErroDark() {
  const overlay = document.createElement("div");
  overlay.id = "error-overlay";
  document.body.appendChild(overlay);

  void overlay.offsetWidth;
  overlay.style.opacity = 1;

  const msg = document.createElement("div");
  msg.id = "erro-msg";
  msg.textContent = "ERRO!";
  document.body.appendChild(msg);

  void msg.offsetWidth;
  msg.style.opacity = 1;

  let i = 0;
  const tremor = setInterval(() => {
    msg.style.transform = `translate(-50%,-50%) rotate(${Math.sin(i) * 25}deg) scale(1.5)`;
    i += 0.5;
  }, 25);

  for (let p = 0; p < 30; p++) {
    const particle = document.createElement("div");
    particle.classList.add("error-particle");
    particle.style.left = window.innerWidth / 2 + "px";
    particle.style.top = window.innerHeight / 2 + "px";
    document.body.appendChild(particle);

    const ang = Math.random() * 2 * Math.PI;
    const dist = Math.random() * 200 + 50;

    setTimeout(() => {
      particle.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
      particle.style.opacity = 0;
    }, 50);

    setTimeout(() => particle.remove(), 1000);
  }

  setTimeout(() => {
    clearInterval(tremor);
    overlay.style.opacity = 0;
    msg.style.opacity = 0;

    setTimeout(() => {
      overlay.remove();
      msg.remove();
    }, 400);
  }, 1200);
}



/************************************
 *   RESPONDER PERGUNTA
 ************************************/
function responder(opcaoEscolhida) {
  popup.classList.add("hidden");

  if (opcaoEscolhida !== respostaCorreta) {
    mostrarErroDark();
    return;
  }

  const rect = lixoSelecionado.getBoundingClientRect();
  mostrarLixoRemovidoFeliz(rect.left + rect.width / 2, rect.top + rect.height / 2);

  lixoSelecionado.style.transition = "0.6s";
  lixoSelecionado.style.opacity = "0";
  lixoSelecionado.style.transform = "scale(0) rotate(360deg)";

  const index = lixosAtivos.indexOf(lixoSelecionado);
  if (index !== -1) lixosAtivos.splice(index, 1);

  setTimeout(() => {
    lixoSelecionado.remove();
    atualizarProgresso();
  }, 600);
}

/************************************
 *   SISTEMA DE PROGRESSO
 ************************************/
function atualizarProgresso() {
  if (lixosAtivos.length === 0) {
    progresso = 100;
  } else {
    const total = quantidadeLixoPorNivel(nivel);
    progresso = 100 * (1 - lixosAtivos.length / total);
  }

  if (progresso > 100) progresso = 100;

  const offset = circunferencia * (1 - progresso / 100);
  progressCircle.style.strokeDashoffset = offset;
  atualizarPersonagemVisual();

  if (progresso >= 100) {
    subirNivel();
  }
}

/************************************
 *   SUBIR DE NÍVEL
 ************************************/
function subirNivel() {
  nivel++;
  levelNumber.textContent = nivel;

  animarLevelUpCentral(nivel);

  if (nivel > 5) {
    mostrarFimDeJogo();
    return;
  }

  setTimeout(() => iniciarNivel(), 1600);
}

/************************************
 *   ANIMAÇÃO LEVEL UP
 ************************************/
function animarLevelUpCentral(nivelAtual) {
  const overlay = document.getElementById("level-up-overlay");
  const text = document.getElementById("level-up-text");
  const waves = document.getElementById("level-up-waves");

  text.textContent = `NÍVEL ${nivelAtual}!`;

  overlay.classList.remove("hidden");
  overlay.style.opacity = 1;

  text.style.animation = "none";
  void text.offsetWidth;
  text.style.animation = "levelUpZoomBounce 1s forwards";

  waves.style.animation = "none";
  void waves.offsetWidth;
  waves.style.animation = "wavePulse 1.5s ease-out forwards";

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 40; i++) {
    const part = document.createElement("div");
    part.classList.add("level-up-particle");
    part.style.left = cx + "px";
    part.style.top = cy + "px";
    document.body.appendChild(part);

    const ang = Math.random() * 2 * Math.PI;
    const dist = Math.random() * 250 + 60;

    setTimeout(() => {
      part.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
      part.style.opacity = 0;
    }, 50);

    setTimeout(() => part.remove(), 1500);
  }

  setTimeout(() => {
    overlay.style.opacity = 0;
    setTimeout(() => overlay.classList.add("hidden"), 400);
  }, 1700);
}

/************************************
 *   DIFICULDADE POR NÍVEL
 ************************************/
function quantidadeLixoPorNivel(nivel) {
  const base = Math.floor(6 + Math.pow(nivel, 1.5));
  const variacao = Math.floor(Math.random() * 3) - 1;
  return base + variacao;
}

/************************************
 *   FIM DO JOGO
 ************************************/
function mostrarFimDeJogo() {
  window.location.href = "../vitoria.html";
}

/************************************
 *   INÍCIO DO NÍVEL
 ************************************/
function iniciarNivel() {
  progresso = 0;
  progressCircle.style.strokeDashoffset = circunferencia;

  criarPersonagem(nivel);
  criarLixos(quantidadeLixoPorNivel(nivel));
}

/************************************
 *   INICIAR JOGO
 ************************************/
iniciarNivel();
