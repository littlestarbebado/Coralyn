document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btnIniciar");
  const btnComoJogar = document.getElementById("btnComoJogar");
  const btnSessao = document.getElementById("btnSessao");

  btnIniciar.addEventListener("click", () => {
    alert("Iniciar jogo");
  });

  btnComoJogar.addEventListener("click", () => {
    alert("Mostrar instruções");
  });

  btnSessao.addEventListener("click", () => {
    alert("Abrir login");
  });
});
