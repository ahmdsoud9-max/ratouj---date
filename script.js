const steps = [...document.querySelectorAll(".step")];
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const foodButtons = [...document.querySelectorAll(".food")];
const foodNext = document.getElementById("foodNext");
const summary = document.getElementById("summary");
const toast = document.getElementById("toast");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

let selectedFood = "";

function showStep(number) {
  steps.forEach(step => {
    step.classList.toggle("active", step.dataset.step === String(number));
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

yesBtn.addEventListener("click", () => {
  showStep(2);
  showToast("عرفت إنك رح تقولي نعم 😂❤️");
});

noBtn.addEventListener("click", () => {
  noBtn.style.display = "none";
  yesBtn.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.08)" },
      { transform: "scale(1)" }
    ],
    { duration: 500 }
  );
  showToast("زر لا اختفى... ما عاد عندك خيار 😂❤️");
});

document.querySelectorAll(".next").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.next === "3") {
      if (!dateInput.value || !timeInput.value) {
        showToast("اختاري التاريخ والوقت أولاً 🌸");
        return;
      }
    }
    if (button.dataset.next === "4") {
      if (!selectedFood) {
        showToast("اختاري شو رح ناكل 😋");
        return;
      }

      const date = new Date(`${dateInput.value}T${timeInput.value}`);
      const formattedDate = new Intl.DateTimeFormat("ar-SY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);

      const formattedTime = new Intl.DateTimeFormat("ar-SY", {
        hour: "numeric",
        minute: "2-digit"
      }).format(date);

      summary.innerHTML =
        `📅 <strong>${formattedDate}</strong><br>` +
        `🕐 <strong>${formattedTime}</strong><br>` +
        `🍽️ <strong>${selectedFood}</strong>`;
    }
    showStep(Number(button.dataset.next));
  });
});

foodButtons.forEach(button => {
  button.addEventListener("click", () => {
    foodButtons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");
    selectedFood = button.dataset.food;
  });
});

document.getElementById("againBtn").addEventListener("click", () => {
  selectedFood = "";
  foodButtons.forEach(b => b.classList.remove("selected"));
  dateInput.value = "";
  timeInput.value = "";
  noBtn.style.display = "";
  showStep(1);
});

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart-float";
  heart.textContent = Math.random() > .5 ? "♥" : "♡";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${12 + Math.random() * 18}px`;
  heart.style.animationDuration = `${5 + Math.random() * 6}s`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}

setInterval(createHeart, 900);
