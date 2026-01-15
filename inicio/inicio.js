document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTOS
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
