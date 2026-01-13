



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

document.getElementById("menu").addEventListener("click", function() {
    window.location.href = "inicio.html"
});



