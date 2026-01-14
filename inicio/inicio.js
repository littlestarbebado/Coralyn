document.addEventListener("DOMContentLoaded", () => {

  //Botão INICIAR
  document.getElementById("btnIniciar").addEventListener("click", () => {
    window.location.href = "../pag_niveis/niveis.html";
  });

  //Botão INICIAR SESSÃO
  document.getElementById("btnSessao").addEventListener("click", () => {
    alert("Login em desenvolvimento");
  });

  //Botão DEFINIÇÕES
  document.getElementById("btnSettings").addEventListener("click", () => {
    window.location.href = "config.html";
  });

});
