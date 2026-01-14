// ph.js — mini-jogo pH (água, peixes, termómetro, stress, estrela)
document.addEventListener('DOMContentLoaded', () => {
  // CONFIG
  const IDEAL_PH = 8.1;
  const SAFE_DELTA = 0.30;   // +/- zone considered ideal
  const STRESS_THRESHOLD = IDEAL_PH - 1.0; // when below this, stress rises
  const MAX_PH = 13.3;
  const MIN_PH = 0;

  // STATE
  let ph = IDEAL_PH;
  let naturalDriftInterval = null;

  // SELECTORS
  const phNumber = document.getElementById('phNumber');
  const thermoFill = document.getElementById('thermoFill');
  const fineSlider = document.getElementById('fineSlider');
  const acidBtn = document.getElementById('acidBtn');
  const baseBtn = document.getElementById('baseBtn');
  const mar = document.getElementById('mar');
  
  const idealRangeText = document.getElementById('idealRangeText');

  // init text
  idealRangeText.textContent = `${IDEAL_PH.toFixed(1)} ± ${SAFE_DELTA.toFixed(1)}`;

  // util
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
  function round1(v){ return Math.round(v*10)/10; }

  // UI update
  function updateUI(){
    phNumber.textContent = round1(ph).toFixed(1);

    // THERMO fill percent — map 0..14 to 0..100
    const percent = ((ph - MIN_PH) / (MAX_PH - MIN_PH)) * 100;
    thermoFill.style.height = `${clamp(percent,0,100)}%`;

    // thermo color: green if inside safe delta, yellow if near, red otherwise (acidic) / bluish if alkaline
    const diff = Math.abs(ph - IDEAL_PH);
    if (diff <= SAFE_DELTA) {
      thermoFill.style.background = '#2cff8b'; // green
      estrela.classList.add('visible'); estrela.classList.remove('hidden');
    } else if (diff <= 0.8) {
      thermoFill.style.background = '#ffd24d'; // yellow
      estrela.classList.add('hidden'); estrela.classList.remove('visible');
    } else {
      // show red for acid, light blue for strongly basic
      if (ph < IDEAL_PH) thermoFill.style.background = '#ff6b6b';
      else thermoFill.style.background = '#ff6b6b';
      estrela.classList.add('hidden'); estrela.classList.remove('visible');
    }

    // WATER color: acid (reddish), ideal (turquoise), basic (deep blue)
    if (ph < IDEAL_PH - 0.6) {
      mar.style.background = 'linear-gradient(180deg,#ff8a8a,#b30000)';
    } else if (ph > IDEAL_PH + 0.6) {
      mar.style.background = 'linear-gradient(180deg,#9ad7ff,#004a9f)';
    } else {
      mar.style.background = 'linear-gradient(180deg,#4cc0ff,#0060c0)';
    }

    // STRESS: when too acidic, fill increases; otherwise decreases
    let stressPercent = 0;
    if (ph < STRESS_THRESHOLD) {
      // linear from STRESS_THRESHOLD down to 0 -> 0..100%
      stressPercent = ( (STRESS_THRESHOLD - ph) / (STRESS_THRESHOLD - MIN_PH) ) * 100;
    } else {
      stressPercent = 0;
    }
    stressFill.style.height = `${clamp(stressPercent,0,100)}%`;

    // FISH behaviour: when far from ideal they flee (translate X and reduce opacity)
   
    
  }

  

  // change functions
  function changePH(delta) {
    ph = clamp(Math.round((ph + delta)*10)/10, MIN_PH, MAX_PH);
    fineSlider.value = ph;
    updateUI();
  }

  // events
  acidBtn.addEventListener('click', () => changePH(-0.2));
  baseBtn.addEventListener('click', () => changePH(0.2));

  fineSlider.addEventListener('input', (e) => {
    ph = clamp(parseFloat(e.target.value), MIN_PH, MAX_PH);
    updateUI();
  });

  // Natural slow drift so player must interact
  function startNaturalDrift(){
    if (naturalDriftInterval) clearInterval(naturalDriftInterval);
    naturalDriftInterval = setInterval(() => {
      const drift = (Math.random() - 0.5) * 0.06;
      ph = clamp(Math.round((ph + drift)*10)/10, MIN_PH, MAX_PH);
      fineSlider.value = ph;
      updateUI();
    }, 1300);
  }

  // initial
  fineSlider.value = ph;
  updateUI();
  startNaturalDrift();
});
