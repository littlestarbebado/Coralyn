musicaFundo.loop = true;

const volumeGuardado = localStorage.getItem("volumeMusica");
musicaFundo.volume = volumeGuardado !== null ? parseFloat(volumeGuardado) : 0.3;

musicaFundo.play().catch(() => {});

document.addEventListener("click", () => {
  if (musicaFundo.paused) musicaFundo.play();
}, { once: true });



// SLIDERS

const musica = document.getElementById("musica");
const efeitos = document.getElementById("efeitos");

const valorMusica = document.getElementById("valorMusica");
const valorEfeitos = document.getElementById("valorEfeitos");

// carregar sliders
musica.value = Math.round((volumeGuardado !== null ? volumeGuardado : 0.3) * 100);
efeitos.value = localStorage.getItem("volumeEfeitos") || 50;

valorMusica.textContent = musica.value + "%";
valorEfeitos.textContent = efeitos.value + "%";

//  slider música
musica.addEventListener("input", () => {
  const volume = musica.value / 100;
  musicaFundo.volume = volume;
  valorMusica.textContent = musica.value + "%";
  localStorage.setItem("volumeMusica", volume);
});

// slider efeitos (para futuro)
efeitos.addEventListener("input", () => {
  valorEfeitos.textContent = efeitos.value + "%";
  localStorage.setItem("volumeEfeitos", efeitos.value / 100);
});



// BOTÕES

document.querySelector(".nivel")?.addEventListener("click", () => {
  window.location.href = "../pag_niveis/niveis.html";
});

document.querySelector(".sair")?.addEventListener("click", () => {
  alert("Jogo fechado");
  window.location.href = "../inicio/inicio.html";
});

document.querySelector(".fechar")?.addEventListener("click", () => {
window.history.back();


});





const modal = document.querySelector(".overlay");
const btnAbrir = document.getElementById("btnSettings");
const btnFechar = document.querySelector(".fechar");

// Abrir o popup (sem mudar de página!)
btnAbrir.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Fechar o popup
btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
});
