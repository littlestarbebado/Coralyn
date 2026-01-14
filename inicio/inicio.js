let musicaFundo;

document.addEventListener("DOMContentLoaded", () => {

  // Música de fundo
  musicaFundo = new Audio("../assets/audio/song.mp3");
  musicaFundo.loop = true;
  musicaFundo.volume = 0.3; // volume correto

  musicaFundo.play().catch(() => {
    // autoplay bloqueado (normal)
  });

  // ativar música no primeiro clique
  document.addEventListener("click", () => {
    if (musicaFundo.paused) {
      musicaFundo.play();
    }
  }, { once: true });

  // CONFIGURAÇÕES / MODAL
 

  const btnSettings = document.getElementById("btnSettings");
  const modal = document.getElementById("modalConfig");
  const closeModal = document.getElementById("closeModal");

  const musica = document.getElementById("musica");
  const efeitos = document.getElementById("efeitos");
  const valorMusica = document.getElementById("valorMusica");
  const valorEfeitos = document.getElementById("valorEfeitos");

  const btnNivel = document.getElementById("btnNivel");
  const btnSair = document.getElementById("btnSair");

  // abrir modal
  btnSettings.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // fechar modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // sliders
  musica.addEventListener("input", () => {
  const volume = musica.value / 100;
  musicaFundo.volume = volume;
  valorMusica.textContent = musica.value + "%";
  localStorage.setItem("volumeMusica", volume);
});


  efeitos.addEventListener("input", () => {
    valorEfeitos.textContent = efeitos.value + "%";
  });

  // botões
  btnNivel.addEventListener("click", () => {
    window.location.href = "../pag_niveis/niveis.html";
    
  });

  const btnIniciar = document.getElementById("btnIniciar");
  btnIniciar.addEventListener("click", () => {
   window.location.href = "../pag_niveis/niveis.html";
  });

  const btnSessao = document.getElementById("btnSessao");
  btnSessao.addEventListener("click", () => {
   window.location.href = "../escolher_personagens/escolher_personagens.html";
  });

  btnSair.addEventListener("click", () => {
    musicaFundo.pause();
    window.location.href = "inicio.html";
  });
});