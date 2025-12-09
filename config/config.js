let musica = document.getElementById("musica");
let efeitos = document.getElementById("efeitos");

let valorMusica = document.getElementById("valorMusica");
let valorEfeitos = document.getElementById("valorEfeitos");

// carregar valores guardados
musica.value = localStorage.getItem("musica") || 50;
efeitos.value = localStorage.getItem("efeitos") || 50;

valorMusica.innerHTML = musica.value + "%";
valorEfeitos.innerHTML = efeitos.value + "%";

// quando mexer no slider
musica.oninput = function () {
    valorMusica.innerHTML = musica.value + "%";
    localStorage.setItem("musica", musica.value);
};

efeitos.oninput = function () {
    valorEfeitos.innerHTML = efeitos.value + "%";
    localStorage.setItem("efeitos", efeitos.value);
};

// botão menu
document.querySelector(".menu").onclick = function () {
    window.location.href = "index.html";
};

// botão sair
document.querySelector(".sair").onclick = function () {
    alert("Jogo fechado (simulação)");
};

// fechar popup
document.querySelector(".fechar").onclick = function () {
    window.location.href = "index.html";
};
