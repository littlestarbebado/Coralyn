const jogo = document.getElementById("jogo");
const vidaEl = document.getElementById("vida");
const pontosEl = document.getElementById("pontos");
const resultado = document.getElementById("resultado");

let vida = 3;
let pontos = 0;
let intervalo;

const itens = [
  { tipo: "comida", src: "assets/comida/alga.svg" },
  { tipo: "comida", src: "assets/comida/peixe.svg" },
  { tipo: "lixo", src: "assets/lixo/plastico.svg" },
  { tipo: "lixo", src: "assets/lixo/lata.svg" }
];

function criarItem() {
  const itemData = itens[Math.floor(Math.random() * itens.length)];
  const item = document.createElement("img");

  item.src = itemData.src;
  item.className = "item";
  item.style.left = Math.random() * 85 + "%";

  item.onclick = () => {
    if (itemData.tipo === "comida") {
      pontos++;
      pontosEl.textContent = pontos;
    } else {
      vida--;
      vidaEl.textContent = vida;
    }

    item.remove();
    verificarFim();
  };

  item.addEventListener("animationend", () => item.remove());
  jogo.appendChild(item);
}

document.querySelectorAll(".comida").forEach(comida => {
  comida.addEventListener("click", () => {
    comida.classList.add("removido");

    // remove do DOM depois da animação
    setTimeout(() => {
      comida.remove();
    }, 400);
  });
});


function verificarFim() {
  if (vida <= 0) {
    fim(false);
  }
  if (pontos >= 8) {
    fim(true);
  }
}

function fim(vitoria) {
  clearInterval(intervalo);
  resultado.classList.remove("hidden");
  resultado.textContent = vitoria
    ? "⭐ Estrela bem alimentada!"
    : "💔 A estrela ficou doente!";
}

intervalo = setInterval(criarItem, 1000);