document.addEventListener('DOMContentLoaded', () => {

  // CONFIG
  const IDEAL_PH = 8.1;
  const SAFE_DELTA = 0.3;
  const MAX_PH = 13.3;
  const MIN_PH = 0;
  const TEMPO_PARA_VENCER = 3000; // 3 segundos

  // STATE
  let ph = 0;
  let tempoEstavel = 0;
  let nivelConcluido = false;
  let timerEstavel = null;

  // SELECTORS
  const phNumber = document.getElementById('phNumber');
  const thermoFill = document.getElementById('thermoFill');
  const fineSlider = document.getElementById('fineSlider');
  const acidBtn = document.getElementById('acidBtn');
  const baseBtn = document.getElementById('baseBtn');
  const estrela = document.querySelector('.estrela');

  // utils
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const round1 = v => Math.round(v * 10) / 10;

  function updateUI() {
    phNumber.textContent = round1(ph).toFixed(1);

    const percent = ((ph - MIN_PH) / (MAX_PH - MIN_PH)) * 100;
    thermoFill.style.height = `${clamp(percent, 0, 100)}%`;

    const diff = Math.abs(ph - IDEAL_PH);

    estrela.style.opacity = '1';

    // cores do termómetro 
    if (diff <= SAFE_DELTA) {
      thermoFill.style.background = '#2cff8b';
    } else {
      thermoFill.style.background = '#ff6b6b'; 
    }

    verificarVitoria(diff);
  }

  // CONDIÇÃO DE VITÓRIA 
  function verificarVitoria(diff) {
    if (nivelConcluido) return;

    if (diff <= SAFE_DELTA) {
      if (!timerEstavel) {
        timerEstavel = setInterval(() => {
          tempoEstavel += 100;

          if (tempoEstavel >= TEMPO_PARA_VENCER) {
            concluirNivel();
          }
        }, 100);
      }
    } else {
      tempoEstavel = 0;
      clearInterval(timerEstavel);
      timerEstavel = null;
    }
  }

function concluirNivel() {
  nivelConcluido = true;
  clearInterval(timerEstavel);

  const nivelMaximo = parseInt(localStorage.getItem("nivelMaximo")) || 1;
  if (nivelMaximo < 2) {
    localStorage.setItem("nivelMaximo", 2);
  }

  localStorage.setItem("nivelRecemDesbloqueado", 2);

  setTimeout(() => {
    window.location.href = "../vitoria/vitoria.html";
  }, 800);
}



  function changePH(delta) {
    ph = clamp(round1(ph + delta), MIN_PH, MAX_PH);
    fineSlider.value = ph;
    updateUI();
  }

  acidBtn.addEventListener('click', () => changePH(-0.2));
  baseBtn.addEventListener('click', () => changePH(0.2));

  fineSlider.addEventListener('input', e => {
    ph = clamp(parseFloat(e.target.value), MIN_PH, MAX_PH);
    updateUI();
  });

  setInterval(() => {
    const drift = (Math.random() - 0.5) * 0.06;
    ph = clamp(round1(ph + drift), MIN_PH, MAX_PH);
    fineSlider.value = ph;
    updateUI();
  }, 1300);

  // init
  fineSlider.value = ph;
  updateUI();
});
