/**
 * Full-page 3D: section depth on scroll, card reveals, hero mouse tilt
 */
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const sections = document.querySelectorAll(".scene-section");
  const cards = document.querySelectorAll(
    ".work .box, .certificates .box, .education .box-container .box, .skills .bar, .experience .timeline .container, .about .row"
  );

  cards.forEach((el) => el.classList.add("card-3d"));

  /* Scroll: sections tilt into view */
  function updateSectionDepth() {
    const vh = window.innerHeight;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, offset));
      const rotateX = clamped * -6;
      const translateZ = (1 - Math.abs(clamped)) * 24 - Math.abs(clamped) * 12;
      section.style.transform = `perspective(1400px) rotateX(${rotateX}deg) translateZ(${translateZ}px)`;
    });
  }

  /* Cards fade & rise in 3D */
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.style.opacity = "1";
          entry.target.style.transform =
            "perspective(1000px) rotateX(0deg) translateY(0) translateZ(0)";
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform =
      "perspective(1000px) rotateX(14deg) translateY(48px) translateZ(-40px)";
    card.style.transition = "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease";
    cardObserver.observe(card);
  });

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          updateSectionDepth();
          scrollTicking = false;
        });
      }
    },
    { passive: true }
  );
  updateSectionDepth();

  /* Hero image mouse 3D tilt */
  const heroImg = document.querySelector(".home .image img.tilt");
  if (heroImg) {
    const homeSection = document.querySelector(".home");
    homeSection.addEventListener("mousemove", (e) => {
      const rect = homeSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImg.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 12}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    homeSection.addEventListener("mouseleave", () => {
      heroImg.style.transform = "";
    });
  }

  /* Work / certificate cards: subtle mouse tilt */
  document.querySelectorAll(".work .box, .certificates .box").forEach((box) => {
    box.addEventListener("mousemove", (e) => {
      const rect = box.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (!box.classList.contains("is-visible")) return;
      box.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(12px)`;
    });
    box.addEventListener("mouseleave", () => {
      if (box.classList.contains("is-visible")) {
        box.style.transform =
          "perspective(1000px) rotateX(0deg) translateY(0) translateZ(0)";
      }
    });
  });
})();
