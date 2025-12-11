document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btnIniciar");
  const btnComoJogar = document.getElementById("btnComoJogar");
  const btnSessao = document.getElementById("btnSessao");
  const btnSettings = document.getElementById("btnSettings");

  btnIniciar.addEventListener("click", () => {
    window.location.href = "menu.html";
  });

  btnComoJogar.addEventListener("click", () => {
    alert("Mostrar instruções");
  });

  btnSessao.addEventListener("click", () => {
    alert("Abrir login");
  });

   btnSettings.addEventListener("click", () => {
    window.location.href = "config.html";
  });

});
