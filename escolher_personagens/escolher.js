function escolher(personagem) {
    localStorage.setItem("personagemEscolhido", personagem);

    window.location.href = "../pag_niveis/nivel1/nivel1.html";
}

function abrirConfig() {
    window.location.href = "../config/config.html";
}
