document.addEventListener("DOMContentLoaded", () => {

  // ===== ESCOLHER PERSONAGEM =====
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {

      const personagem = card.dataset.personagem;

      if (!personagem) {
        console.error("Personagem não definida no data-personagem");
        return;
      }

      // guardar escolha
      localStorage.setItem("personagemEscolhido", personagem);
      console.log("Personagem guardada:", personagem);

      // ir para a página de níveis
      window.location.href = "../pag_niveis/niveis.html";
    });
  });

  // ===== MODAL DE DEFINIÇÕES =====

  const btnSettings = document.getElementById("settings-btn");
  const modal = document.getElementById("modalConfig");
  const closeModal = document.getElementById("closeModal");

  const btnNivel = document.getElementById("btnNivel");
  const btnSair = document.getElementById("btnSair");
  const btnIniciar = document.getElementById("btnIniciar");
  const btnSessao = document.getElementById("btnSessao");

  // ABRIR MODAL
  btnSettings.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // FECHAR MODAL
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // BOTÕES
  btnNivel.addEventListener("click", () => {
    window.location.href = "../pag_niveis/niveis.html";
  });

  btnIniciar.addEventListener("click", () => {
    window.location.href = "../escolher_personagens/escolher_personagens.html";
  });



  btnSair.addEventListener("click", () => {
    window.location.href = "inicio.html";
  });

});

