document.getElementById("btn-config").addEventListener("click", () => {
  window.location.href = "../inicio/config.html";
});

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
