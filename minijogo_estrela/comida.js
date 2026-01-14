const jogo = document.getElementById("jogo");
const vidaEl = document.getElementById("vida");
const pontosEl = document.getElementById("pontos");
const resultado = document.getElementById("resultado");

let vida = 3;
let pontos = 0;
let intervalo;
let jogoAtivo = true; // 🔴 controla se o jogo ainda está a correr

// 🔧 AQUI colocas os caminhos das TUAS imagens
const itens = [
  { tipo: "comida", src: "../assets/comida/alga.svg" },
 

  { tipo: "lixo", src: "../assets/lixo/lixo1.svg" },
  { tipo: "lixo", src: "../assets/lixo/lixo6.svg" },
  { tipo: "lixo", src: "../assets/lixo/lixo5.svg" },
  
];

function criarItem() {
  if (!jogoAtivo) return; // 🔴 não cria mais itens se o jogo acabou

  const itemData = itens[Math.floor(Math.random() * itens.length)];
  const item = document.createElement("img");

  item.src = itemData.src;
  item.classList.add("item", itemData.tipo);
  item.style.left = Math.random() * 85 + "%";

  item.addEventListener("click", () => {
    if (!jogoAtivo) return;

    if (itemData.tipo === "comida") {
      pontos++;
      pontosEl.textContent = pontos;
    } else {
      vida--;

      // 🔴 impede a vida de ficar negativa
      if (vida < 0) vida = 0;

      vidaEl.textContent = vida;
    }

    item.classList.add("removido");
    setTimeout(() => item.remove(), 300);

    verificarFim();
  });

  item.addEventListener("animationend", () => item.remove());
  jogo.appendChild(item);
}

function verificarFim() {
  if (vida === 0) {
    fim(false); // 🔴 perdeu assim que chega a 0
  }

  if (pontos >= 8) {
    fim(true);
  }
}

function fim(vitoria) {
  clearInterval(intervalo);

  if (!vitoria) {
    const popup = document.getElementById("popup-fim");
    popup.classList.remove("hidden");
    return;
  }

  // vitória (se quiseres usar depois)
  resultado.classList.remove("hidden");
  resultado.textContent = "⭐ Estrela bem alimentada!";
}

// começa o jogo
intervalo = setInterval(criarItem, 1000);
