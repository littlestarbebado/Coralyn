document.addEventListener("DOMContentLoaded", () => {

    // Botão da engrenagem
    const btnSettings = document.getElementById("btnSettings");
    

    // Modal
    const modal = document.getElementById("modalConfig");
    const closeModal = document.getElementById("closeModal");

    // Sliders
    const musica = document.getElementById("musica");
    const efeitos = document.getElementById("efeitos");
    const valorMusica = document.getElementById("valorMusica");
    const valorEfeitos = document.getElementById("valorEfeitos");

    // Botões do modal
    const btnMenu = document.getElementById("btnMenu");
    const btnSair = document.getElementById("btnSair");

    // ABRIR MODAL
    btnSettings.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // FECHAR MODAL
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // BOTÃO MENU
    btnMenu.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // BOTÃO SAIR
    btnSair.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // SLIDERS
    musica.addEventListener("input", () => {
        valorMusica.textContent = musica.value + "%";
    });

    efeitos.addEventListener("input", () => {
        valorEfeitos.textContent = efeitos.value + "%";
    });
});


document.getElementById("btnSettings").addEventListener("click", function() {
    window.location.href = "config.html"
});
