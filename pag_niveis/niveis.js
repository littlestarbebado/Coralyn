document.addEventListener("DOMContentLoaded", () => {

  // BOTÃO CONFIG
  const btnConfig = document.getElementById("btn-config");
  if (btnConfig) {
    btnConfig.addEventListener("click", () => {
      window.location.href = "../inicio/config.html";
    });
  }

  // NÍVEIS DESBLOQUEADOS
  const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
  const nivelAnimar = parseInt(localStorage.getItem("nivelRecemDesbloqueado"));

  document.querySelectorAll(".nivel").forEach(nivelEl => {
    const nivel = parseInt(nivelEl.dataset.nivel);

    // desbloquear níveis
    if (nivel <= nivelMaximo) {
      nivelEl.classList.remove("bloqueado");
      nivelEl.classList.add("desbloqueado");
    }

    // animação do nível recém‑desbloqueado
    if (nivel === nivelAnimar) {
      nivelEl.classList.add("animar-desbloqueio");

      setTimeout(() => {
        localStorage.removeItem("nivelRecemDesbloqueado");
      }, 1000);
    }

    // clique no nível
    nivelEl.addEventListener("click", () => {
      if (nivelEl.classList.contains("desbloqueado")) {
        window.location.href = `../nivel_${nivel}/nivel${nivel}.html`;
      } else {
        alert("Este nível ainda não está desbloqueado!");
      }
    });
  });

});

  // botões
  btnNivel.addEventListener("click", () => {
    window.location.href = "../pag_niveis/niveis.html";
    
  });

  btnSair.addEventListener("click", () => {
    musicaFundo.pause();
    window.location.href = "inicio.html";
  });


document.addEventListener("DOMContentLoaded", () => {
  const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;

  document.querySelectorAll(".nivel").forEach(nivelEl => {
    const nivel = parseInt(nivelEl.dataset.nivel);

    if (nivel <= nivelMaximo) {
      nivelEl.classList.remove("bloqueado");
      nivelEl.classList.add("desbloqueado");
    }
  });
});

const nivelAtual = parseInt(localStorage.getItem("nivelAtual")) || 1;

document.getElementById("btnJogar").addEventListener("click", () => {
  window.location.href = `../nivel_${nivelAtual}/nivel${nivelAtual}.html`;
});
