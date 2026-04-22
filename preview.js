const slider = document.querySelector("[data-base-slider]");
const output = document.querySelector("[data-base-output]");
const resetButton = document.querySelector("[data-base-reset]");
const sizingToggle = document.querySelector("[data-sizing-toggle]");
const gridToggle = document.querySelector("[data-grid-toggle]");
const gridOverlay = document.querySelector(".preview-grid-overlay");
const tokenRows = document.querySelectorAll("[data-token]");
const root = document.documentElement;
const body = document.body;
const defaultUserBase = 16;

const getComputedPixels = (token) => {
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.fontSize = `var(${token})`;
  document.body.append(probe);
  const pixels = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  return pixels;
};

const updateTokenReadouts = () => {
  tokenRows.forEach((row) => {
    const token = row.getAttribute("data-token");
    const target = row.querySelector("[data-token-output]");

    if (!token || !target) {
      return;
    }

    const pixels = getComputedPixels(token);
    target.textContent = `${pixels.toFixed(2)}px`;
  });
};

const updateOutput = (value) => {
  const label = `${value.toFixed(1)}px user base`;
  output.value = label;
  output.textContent = label;
};

const applyMerchantBase = (value = Number(slider.value)) => {
  const rounded = Number(value.toFixed(1));
  root.style.setProperty("--user-base-size", `${rounded}px`);
  slider.value = rounded.toFixed(1);
  updateOutput(rounded);
  updateTokenReadouts();
};

const syncSizingMode = () => {
  if (!sizingToggle || !body) {
    return;
  }

  body.dataset.previewSizing = sizingToggle.checked ? "fluid" : "fixed";
  updateTokenReadouts();
};

const syncGridOverlay = () => {
  if (!gridToggle || !gridOverlay || !body) {
    return;
  }

  gridOverlay.hidden = !gridToggle.checked;
  body.classList.toggle("is-grid-overlay-visible", gridToggle.checked);
};

if (slider && output && resetButton) {
  slider.addEventListener("input", () => applyMerchantBase());
  resetButton.addEventListener("click", () => applyMerchantBase(defaultUserBase));
  applyMerchantBase(defaultUserBase);
  window.addEventListener("resize", updateTokenReadouts);
}

if (sizingToggle) {
  sizingToggle.checked = true;
  sizingToggle.addEventListener("change", syncSizingMode);
  syncSizingMode();
}

if (gridToggle) {
  gridToggle.checked = false;
  gridToggle.addEventListener("change", syncGridOverlay);
  syncGridOverlay();
}
