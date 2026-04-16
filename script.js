window.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");
  const spotlightCards = document.querySelectorAll(".card-spotlight");
  const header = document.querySelector(".site-header");
  const experienceToggle = document.querySelector(".experience-toggle");
  const additionalPanel = document.querySelector(".additional-panel");
  const toggleLabel = document.querySelector(".toggle-label");

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
    if (!header) {
      return;
    }

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

  if (experienceToggle && additionalPanel && toggleLabel) {
    const openPanel = () => {
      additionalPanel.hidden = false;
      additionalPanel.classList.add("is-open");
      additionalPanel.style.maxHeight = "0px";

      requestAnimationFrame(() => {
        additionalPanel.style.maxHeight = `${additionalPanel.scrollHeight}px`;
      });

      experienceToggle.setAttribute("aria-expanded", "true");
      toggleLabel.textContent = "Show Less";
    };

    const closePanel = () => {
      additionalPanel.style.maxHeight = `${additionalPanel.scrollHeight}px`;

      requestAnimationFrame(() => {
        additionalPanel.style.maxHeight = "0px";
        additionalPanel.classList.remove("is-open");
      });

      experienceToggle.setAttribute("aria-expanded", "false");
      toggleLabel.textContent = "View Full Experience";

      window.setTimeout(() => {
        additionalPanel.hidden = true;
      }, 420);
    };

    experienceToggle.addEventListener("click", () => {
      const isOpen = experienceToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closePanel();
        return;
      }

      openPanel();
    });
  }
});
