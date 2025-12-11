

(() => {
  "use strict";

  // CONFIGURAÇÕES DO JOGO
 
  const IDEAL_PH = 8.1;        // pH ideal
  const SAFE_DELTA = 0.30;     // margem aceitável
  const TIME_TO_SURVIVE = 30;  // tempo necessário para ganhar
  const HEALTH_DECAY = 6;      // dano por segundo fora da zona segura
  const ROUND = 2;             // casas decimais


  // ESTADO DO JOGO

  let ph = IDEAL_PH;
  let timeLeft = TIME_TO_SURVIVE;
  let health = 100;
  let running = false;

  let tickInterval = null;
  let driftInterval = null;

  // -----------------------------
  // ELEMENTOS HTML
  // -----------------------------
  const elPH = document.getElementById("phValue");
  const elSafe = document.getElementById("safeRange");
  const elTimer = document.getElementById("timer");
  const elHealth = document.getElementById("health");

  const btnAcid = document.getElementById("acidBtn");
  const btnBase = document.getElementById("baseBtn");
  const slider = document.getElementById("fineSlider");

  const msg = document.getElementById("message");
  const result = document.getElementById("result");
  const btnRestart = document.getElementById("restart");
  const estrela = document.getElementById("estrelaImg");

  // Mostrar zona segura
  elSafe.textContent = `${IDEAL_PH.toFixed(1)} ± ${SAFE_DELTA.toFixed(2)}`;


  // -----------------------------
  // FUNÇÕES AUXILIARES
  // -----------------------------
  const round = v =>
    Math.round(v * Math.pow(10, ROUND)) / Math.pow(10, ROUND);

  const isSafe = v =>
    Math.abs(v - IDEAL_PH) <= SAFE_DELTA;

  function updateUI() {
    elPH.textContent = round(ph).toFixed(ROUND);
    elTimer.textContent = Math.ceil(Math.max(0, timeLeft));
    elHealth.value = Math.max(0, Math.min(100, health));

    // Muda cor da estrela (verde => saudável, vermelho => fraca)
    const hue = Math.round(120 * (health / 100));
    estrela.style.filter = `hue-rotate(${hue - 120}deg) saturate(${0.6 + health / 200})`;
  }

  // -----------------------------
  // CONTROLO DE pH
  // -----------------------------
  function changePH(delta) {
    ph = Math.min(14, Math.max(0, ph + delta));
    slider.value = Math.round(ph * 10); // sincroniza slider
    updateUI();
  }

  function addAcid() {
    changePH(-0.20);
    if (!isSafe(ph)) health = Math.max(0, health - 4);
  }

  function addBase() {
    changePH(+0.20);
    if (!isSafe(ph)) health = Math.max(0, health - 4);
  }

  // Slider de ajuste fino
  slider.addEventListener("input", () => {
    ph = slider.value / 10;
    updateUI();
  });


  // -----------------------------
  // DRIFT NATURAL DO pH
  // -----------------------------
  function startDrift() {
    if (driftInterval) clearInterval(driftInterval);

    driftInterval = setInterval(() => {
      const drift = (Math.random() - 0.5) * 0.06;  
      changePH(drift);
    }, 1200);
  }


  // -----------------------------
  // LOOP PRINCIPAL DO JOGO
  // -----------------------------
  function startTick() {
    if (tickInterval) clearInterval(tickInterval);

    tickInterval = setInterval(() => {
      if (isSafe(ph)) {
        msg.textContent = "Excelente! pH dentro da zona segura!";
        timeLeft -= 1;
        health = Math.min(100, health + 2);
      } else {
        msg.textContent = "Cuidado! pH fora dos limites!";
        health -= HEALTH_DECAY;
        timeLeft -= 0.6;
      }

      if (timeLeft < 0) timeLeft = 0;
      if (health < 0) health = 0;

      updateUI();
      checkEnd();
    }, 1000);
  }


  // -----------------------------
  // VERIFICA FIM DE JOGO
  // -----------------------------
  function checkEnd() {
    if (health <= 0) {
      finish(false, "A estrela não resistiu...");
    } else if (timeLeft <= 0) {
      if (isSafe(ph)) finish(true, "Parabéns! Estrela salva!");
      else finish(false, "O tempo acabou e o pH estava errado!");
    }
  }

  function finish(win, text) {
    running = false;
    clearInterval(tickInterval);
    clearInterval(driftInterval);

    result.textContent = text;
    result.classList.remove("hidden");
    result.classList.add(win ? "win" : "lose");

    btnRestart.classList.remove("hidden");
    msg.textContent = win ? "Vitória!" : "Game Over";
  }


  // -----------------------------
  // REINICIAR
  // -----------------------------
  function restart() {
    ph = IDEAL_PH;
    timeLeft = TIME_TO_SURVIVE;
    health = 100;

    result.classList.add("hidden");
    result.classList.remove("win", "lose");
    btnRestart.classList.add("hidden");

    msg.textContent = "Mantém o pH estável até o tempo acabar!";
    slider.value = Math.round(ph * 10);

    updateUI();

    running = true;
    startTick();
    startDrift();
  }

  // Botões
  btnAcid.addEventListener("click", addAcid);
  btnBase.addEventListener("click", addBase);
  btnRestart.addEventListener("click", restart);

  // Iniciar automaticamente
  restart();
})();