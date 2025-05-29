import { getEmojiForWord } from "./emojiService.js";

document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("items-container");
  const newItemInput = document.getElementById("new-item");
  const addItemBtn = document.getElementById("add-item");
  const spinButton = document.getElementById("spin-button");
  const warningText = document.getElementById("warning");
  const resultDisplay = document.getElementById("result");
  const resultText = resultDisplay.querySelector("span");
  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas.getContext("2d");

  const baseSize = 500;
  const scale = window.devicePixelRatio || 1;
  canvas.width = baseSize * scale;
  canvas.height = baseSize * scale;
  canvas.style.width = baseSize + "px";
  canvas.style.height = baseSize + "px";
  ctx.scale(scale, scale);

  const radius = baseSize / 2;
  let items = ["🍕 Pizza", "🎮 Game", "📚 Book", "🎬 Movie", "🏖️ Beach", "🎉 Party"];
  let isSpinning = false;
  let currentRotation = 0;

  const colors = [
    "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA",
    "#F472B6", "#FDBA74", "#4ADE80", "#38BDF8", "#C084FC"
  ];

  function renderItemList() {
    itemsContainer.innerHTML = "";

    items.forEach((text, index) => {
      const wrapper = document.createElement("div");

      const input = document.createElement("input");
      input.type = "text";
      input.value = text;
      input.addEventListener("change", () => {
        items[index] = input.value;
        drawWheel(currentRotation);
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        items.splice(index, 1);
        renderItemList();
        drawWheel(currentRotation);
      });

      wrapper.appendChild(input);
      wrapper.appendChild(removeBtn);
      itemsContainer.appendChild(wrapper);
    });

    const isValid = items.length >= 2;
    warningText.classList.toggle("hidden", isValid);
    spinButton.disabled = !isValid;
  }

  function drawWheel(rotationDegrees = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate((rotationDegrees * Math.PI) / 180);

    const angleStep = (2 * Math.PI) / items.length;

    for (let i = 0; i < items.length; i++) {
      const startAngle = i * angleStep;
      const endAngle = startAngle + angleStep;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + angleStep / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#1a365d";
      ctx.font = "bold 20px Fredoka, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 3;
      ctx.fillText(items[i], radius - 16, 6);
      ctx.restore();
    }

    ctx.restore();
  }

  function spinWheel() {
    if (isSpinning || items.length < 2) return;

    resultDisplay.classList.add("hidden");
    resultText.textContent = "";

    isSpinning = true;
    spinButton.classList.add("active-border");
    spinButton.disabled = true;

    const spins = 6;
    const extraDegrees = Math.random() * 360;
    const rotationTarget = spins * 360 + extraDegrees;
    const duration = 3000;
    const start = performance.now();
    const initialRotation = currentRotation;

    function animate(time) {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);

      currentRotation = initialRotation + rotationTarget * eased;
      drawWheel(currentRotation);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalAngle = currentRotation % 360;
        const correctedAngle = (360 - finalAngle) % 360;
        const sliceAngle = 360 / items.length;
        const index = Math.floor(correctedAngle / sliceAngle) % items.length;

        resultText.textContent = items[index];
        resultDisplay.classList.remove("hidden", "animate-zoom-fade");
        void resultDisplay.offsetWidth;
        resultDisplay.classList.add("animate-zoom-fade");

        spinButton.classList.remove("active-border");
        spinButton.disabled = false;
        isSpinning = false;

        spinButton.blur();
        setTimeout(() => spinButton.focus({ preventScroll: true }), 10);
      }
    }

    requestAnimationFrame(animate);
  }

  async function addItem() {
    const rawInput = newItemInput.value.trim().toLowerCase();
    if (!rawInput) return;

    const capitalized = rawInput.charAt(0).toUpperCase() + rawInput.slice(1);
    const emoji = await getEmojiForWord(rawInput);
    const newItem = emoji ? `${emoji} ${capitalized}` : capitalized;

    items.push(newItem);
    newItemInput.value = "";
    renderItemList();
    drawWheel(currentRotation);
  }

  addItemBtn.addEventListener("click", addItem);
  newItemInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addItem();
  });
  spinButton.addEventListener("click", spinWheel);

  spinButton.focus({ preventScroll: true });
  spinButton.blur();
  setTimeout(() => spinButton.focus({ preventScroll: true }), 10);

  renderItemList();
  drawWheel();
});

document.addEventListener("keydown", (e) => {
  const spinButton = document.getElementById("spin-button");
  if ((e.key === "Enter" || e.key === " ") && document.activeElement === spinButton) {
    e.preventDefault();
    spinButton.click();
  }
});
