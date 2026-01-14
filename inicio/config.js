document.addEventListener("DOMContentLoaded", () => {

  const musica = document.getElementById("musica");
  const efeitos = document.getElementById("efeitos");
  const valorMusica = document.getElementById("valorMusica");
  const valorEfeitos = document.getElementById("valorEfeitos");
  const fechar = document.querySelector(".fechar");
  const btnMenu = document.getElementById("menu");
  const btnSair = document.querySelector(".sair");

  // 🔹 Carregar valores guardados
  musica.value = localStorage.getItem("volumeMusica") ?? 50;
  efeitos.value = localStorage.getItem("volumeEfeitos") ?? 50;

  valorMusica.textContent = musica.value + "%";
  valorEfeitos.textContent = efeitos.value + "%";

  // 🔹 Guardar alterações
  musica.addEventListener("input", () => {
    valorMusica.textContent = musica.value + "%";
    localStorage.setItem("volumeMusica", musica.value);
  });

  efeitos.addEventListener("input", () => {
    valorEfeitos.textContent = efeitos.value + "%";
    localStorage.setItem("volumeEfeitos", efeitos.value);
  });

  // 🔹 Voltar ao menu inicial
  function voltarMenu() {
    window.location.href = "inicio.html";
  }

  fechar.addEventListener("click", voltarMenu);
  btnMenu.addEventListener("click", voltarMenu);
  btnSair.addEventListener("click", voltarMenu);

});
