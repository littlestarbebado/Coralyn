function escolher(personagem) {
    localStorage.setItem("personagemEscolhido", personagem);

    window.location.href = "../pag_niveis/nivel1/nivel1.html";
}

function abrirConfig() {
    window.location.href = "../config/config.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const btnSettings = document.getElementById("btnSettings");
  const modal = document.getElementById("modalConfig");
  const closeModal = document.getElementById("closeModal");

  const musica = document.getElementById("musica");
  const valorMusica = document.getElementById("valorMusica");

  const btnSair = document.getElementById("btnSair");

  // abrir definições
  btnSettings.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // fechar definições
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // fechar clicando fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // slider música (guardar valor)
  musica.addEventListener("input", () => {
    valorMusica.textContent = musica.value + "%";
    localStorage.setItem("volumeMusica", musica.value);
  });

  // sair para início
  btnSair.addEventListener("click", () => {
    window.location.href = "../inicio/inicio.html";
  });

});

