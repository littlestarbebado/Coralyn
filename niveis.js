document.querySelectorAll('.nivel').forEach(nivelEl => {
  nivelEl.addEventListener('click', () => {
    if (nivelEl.classList.contains('desbloqueado')) {
      const nivel = nivelEl.dataset.nivel;
      window.location.href = `nivel${nivel}.html`;
    } else {
      alert("Este nível ainda não está desbloqueado!");
    }
  });
});
