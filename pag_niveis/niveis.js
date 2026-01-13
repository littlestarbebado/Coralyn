// Se ainda não houver progresso, começa no nível 1
if (!localStorage.getItem("nivelDesbloqueado")) {
  localStorage.setItem("nivelDesbloqueado", "1");
}

const nivelMax = Number(localStorage.getItem("nivelDesbloqueado"));
const niveis = document.querySelectorAll(".nivel");

niveis.forEach(nivelEl => {
  const numeroNivel = Number(nivelEl.dataset.nivel);

  if (numeroNivel <= nivelMax) {
    // DESBLOQUEADO
    nivelEl.classList.remove("bloqueado");
    nivelEl.classList.add("desbloqueado");

    nivelEl.addEventListener("click", () => {
      window.location.href = `../nivel_1/nivel${numeroNivel}.html`;
    });

  } else {
    // BLOQUEADO
    nivelEl.classList.remove("desbloqueado");
    nivelEl.classList.add("bloqueado");

    nivelEl.addEventListener("click", () => {
      alert("🔒 Este nível ainda não está desbloqueado!");
    });
  }
});

