const revealItems = document.querySelectorAll(".reveal");
const spotlightCards = document.querySelectorAll(".card-spotlight");
const header = document.querySelector(".site-header");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("counter-card")) {
        const value = entry.target.querySelector(".counter-value");
        if (value) {
          animateCounter(value);
        }
      }

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(element) {
  if (element.dataset.done === "true") {
    return;
  }

  const target = Number(element.dataset.target || 0);
  const duration = 1400;
  const startTime = performance.now();

  const step = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);

    element.textContent = `${current}+`;

    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }

    element.textContent = `${target}+`;
    element.dataset.done = "true";
  };

  requestAnimationFrame(step);
}

const syncHeaderState = () => {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

spotlightCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--spotlight-x", `${x}px`);
    card.style.setProperty("--spotlight-y", `${y}px`);
  });
});
