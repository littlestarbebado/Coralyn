// Guarda e carrega progresso
function setNivel(n) { localStorage.setItem("nivelAtual", n); }
function getNivel() { return Number(localStorage.getItem("nivelAtual") || 1); }

// Para mini-jogos 
function desbloquearNivel(n) {
  const atual = getNivel();
  if (n > atual) setNivel(n);
}

console.log("Core carregado.");
