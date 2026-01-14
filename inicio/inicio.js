let musicaFundo;

document.addEventListener("DOMContentLoaded", () => {

<<<<<<< HEAD
  //Botão INICIAR
  document.getElementById("btnIniciar").addEventListener("click", () => {
    window.location.href = "../pag_niveis/niveis.html";
  });

  //Botão INICIAR SESSÃO
  document.getElementById("btnSessao").addEventListener("click", () => {
    alert("Login em desenvolvimento");
  });

  //Botão DEFINIÇÕES
  document.getElementById("btnSettings").addEventListener("click", () => {
    window.location.href = "config.html";
  });

=======
  // 🎵 Música de fundo
  musicaFundo = new Audio("../assets/audio/song.mp3");
  musicaFundo.loop = true;
  musicaFundo.volume = 0.3; // 🔊 volume correto

  musicaFundo.play().catch(() => {
    // autoplay bloqueado (normal)
  });

  // ▶️ ativar música no primeiro clique
  document.addEventListener("click", () => {
    if (musicaFundo.paused) {
      musicaFundo.play();
    }
  }, { once: true });

  // ---------------------------
  // CONFIGURAÇÕES / MODAL
  // ---------------------------

  const btnSettings = document.getElementById("btnSettings");
  const modal = document.getElementById("modalConfig");
  const closeModal = document.getElementById("closeModal");

  const musica = document.getElementById("musica");
  const efeitos = document.getElementById("efeitos");
  const valorMusica = document.getElementById("valorMusica");
  const valorEfeitos = document.getElementById("valorEfeitos");

  const btnMenu = document.getElementById("btnMenu");
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
  localStorage.setItem("volumeMusica", volume);
});


  efeitos.addEventListener("input", () => {
    valorEfeitos.textContent = efeitos.value + "%";
  });

  // botões
  btnMenu.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnSair.addEventListener("click", () => {
    musicaFundo.pause();
    window.close(); // ou outra ação
  });
>>>>>>> be9aa341047ee105d9ccb529b556e97f9644695a
});
document.getElementById("btn-config").addEventListener("click", () => {
  window.location.href = "../inicio/config.html";
});