function concluirNivel() {
  const nivelAtual = parseInt(localStorage.getItem("nivelAtual")) || 1;
  const proximoNivel = nivelAtual + 1;

  // desbloquear próximo nível
  const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
  if (nivelMaximo < proximoNivel) {
    localStorage.setItem("nivelMaximo", proximoNivel);
  }

  // guardar nível atual como concluído
  localStorage.setItem("nivelAtual", proximoNivel);

  // ir para página de vitória ou níveis
  window.location.href = "../vitoria/vitoria.html";
}
