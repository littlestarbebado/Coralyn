let ph = 7; // valor inicial

const peixe1 = document.getElementById("peixe1");
const peixe2 = document.getElementById("peixe2");

const agua = document.getElementById("agua");
const phBar = document.getElementById("ph-bar");
const phValor = document.getElementById("ph-valor");
const estrela = document.getElementById("estrela");
const btnProximo = document.getElementById("btnProximo");

const idealPH = 7; // pH correto

// Atualizar interface
function atualizarPH() {
    phValor.textContent = "pH: " + ph;

    // Barra desce/subsobe
    phBar.style.height = (ph * 10) + "%";

    // Cores da barra + água
    if (ph < idealPH - 1) {
        phBar.style.background = "red";
        agua.style.background = "#002d5e";
    } else if (ph > idealPH + 1) {
        phBar.style.background = "purple";
        agua.style.background = "#3d006b";
    } else {
        phBar.style.background = "green";
        agua.style.background = "#0077ff";
    }

    // Peixes fogem se o pH estiver errado
    if (Math.abs(ph - idealPH) >= 2) {
        peixe1.style.transform = "translateX(-100px)";
        peixe2.style.transform = "translateX(100px)";
    } else {
        peixe1.style.transform = "translateX(0)";
        peixe2.style.transform = "translateX(0)";
    }

    // Quando o pH estiver perfeito → estrela aparece
    if (ph === idealPH) {
        estrela.classList.remove("hide");
        btnProximo.classList.remove("hide");
    } else {
        estrela.classList.add("hide");
        btnProximo.classList.add("hide");
    }
}

// Botões
document.getElementById("menosBtn").addEventListener("click", () => {
    if (ph > 0) ph--;
    atualizarPH();
});

document.getElementById("maisBtn").addEventListener("click", () => {
    if (ph < 14) ph++;
    atualizarPH();
});

// Atualiza no carregamento
atualizarPH();
