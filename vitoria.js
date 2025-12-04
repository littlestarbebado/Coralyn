window.addEventListener('DOMContentLoaded', () => {
  // Sequência das estrelas animadas
  const estrelas = [
    document.getElementById('estrela1'),
    document.getElementById('estrela2'),
    document.getElementById('estrela3')
  ];

  estrelas.forEach((estrela, index) => {
    setTimeout(() => {
      estrela.style.animation = "estrelaSurgir 0.6s forwards";
    }, 900 + index * 300); // delay sequencial após a faixa aparecer
  });

  // Botão aparece por último para voltar ao inicio
  const btn = document.getElementById('btn-voltar');
  setTimeout(() => {
    btn.style.animation = "botaoSurgir 0.6s forwards";
  }, 900 + estrelas.length * 300);

  // Botão que leva para o início
  btn.addEventListener('click', () => {
    window.location.href = "index.html";
  });
});
