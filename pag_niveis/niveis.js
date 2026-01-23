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
    window.location.href = "../inicio/inicio.html";
  });

  /* NÍVEIS DESBLOQUEADOS */
  const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
  const nivelAnimar = parseInt(localStorage.getItem("nivelRecemDesbloqueado"));

  document.querySelectorAll(".nivel").forEach(nivelEl => {
    const nivel = parseInt(nivelEl.dataset.nivel);

    if (nivel <= nivelMaximo) {
      nivelEl.classList.remove("bloqueado");
      nivelEl.classList.add("desbloqueado");
    }

    if (nivel === nivelAnimar) {
      nivelEl.classList.add("animar-desbloqueio");
      setTimeout(() => {
        localStorage.removeItem("nivelRecemDesbloqueado");
      }, 1000);
    }

    nivelEl.addEventListener("click", () => {
      if (nivelEl.classList.contains("desbloqueado")) {
        window.location.href = `../nivel_${nivel}/nivel${nivel}.html`;
      } else {
        alert("Este nível ainda não está desbloqueado!");
      }
    });
  });

  /* PERSONAGEM ESCOLHIDA */
  const personagem = localStorage.getItem("personagemEscolhido");
  const img = document.getElementById("personagem-img");

  if (img && personagem) {
    const personagens = {
      sereia: "../assets/characters/personagens/Sereia.png",
      mergulhador: "../assets/characters/personagens/Mergulhador.png"
    };

    img.src = personagens[personagem] || personagens.sereia;

    // animação flutuar + hover
    img.classList.add("flutuar");

    img.addEventListener("mouseleave", () => {
      img.style.transform = "";
    });
  }

});
