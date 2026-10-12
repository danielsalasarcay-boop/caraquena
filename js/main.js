/* Caraqueña Studio — interacciones */

// ---- Datos de contacto (único lugar donde se cambian) ----
const SITE = {
  // PENDIENTE: número de WhatsApp del estudio, formato internacional sin "+" ni espacios (ej. 584121234567)
  whatsapp: "",
  instagram: "https://www.instagram.com/caraquena.studio",
  waMessage: "Hola Caraqueña Studio, quiero información sobre un proyecto.",
};

const waLink = (text = SITE.waMessage) =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : SITE.instagram;

document.querySelectorAll(".js-wa").forEach((a) => (a.href = waLink()));
document.querySelectorAll(".js-ig").forEach((a) => (a.href = SITE.instagram));
document.querySelector(".js-year").textContent = new Date().getFullYear();

document.querySelector(".js-wa-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text = `Hola Caraqueña Studio, soy ${f.get("nombre")}. Me interesa: ${f.get("tipo")}.` +
    (f.get("mensaje") ? `\n\n${f.get("mensaje")}` : "");
  window.open(waLink(text), "_blank", "noopener");
});

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---- Menú móvil ----
const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".menu");
const toggleMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open);
  menu.setAttribute("aria-hidden", !open);
};
burger.addEventListener("click", () => toggleMenu(!document.body.classList.contains("menu-open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

// ---- Split de textos ----
document.querySelectorAll(".js-split-words").forEach((el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="split-word">${w}</span>`).join(" ");
});
document.querySelectorAll(".js-split-lines").forEach((el) => {
  el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="split-line"><span>${l.trim()}</span></span>`).join("");
});

// Sin GSAP (CDN caído) o con movimiento reducido: el sitio queda estático y usable.
if (!window.gsap || reduced) {
  document.body.classList.remove("is-loading");
  document.querySelector(".loader").remove();
  document.querySelector(".header").classList.remove("is-pre");
  document.querySelectorAll(".manifesto .split-word").forEach((w) => (w.style.opacity = 1));
} else {
  init();
}

function init() {
  gsap.registerPlugin(ScrollTrigger);

  // ---- Lenis smooth scroll ----
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      e.preventDefault();
      lenis.scrollTo(id === "#inicio" ? 0 : id, { offset: 0, duration: 1.6 });
    })
  );

  // ---- Header: se esconde al bajar, aparece al subir ----
  const header = document.querySelector(".header");
  let lastY = 0;
  lenis.on("scroll", ({ scroll }) => {
    header.classList.toggle("is-scrolled", scroll > 40);
    header.classList.toggle("is-hidden", scroll > lastY && scroll > 400 && !document.body.classList.contains("menu-open"));
    lastY = scroll;
  });

  // ---- Loader → intro ----
  const count = { v: 0 };
  const countEl = document.querySelector(".js-count");
  const intro = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove("is-loading");
      document.querySelector(".loader").remove();
      lenis.start();
    },
  });
  intro
    .from(".loader__logo .iso-ring", { rotate: -220, scale: .4, opacity: 0, transformOrigin: "410px 375px", duration: 1.3, ease: "expo.out" })
    .from(".loader__logo .iso-bar", { xPercent: -140, opacity: 0, duration: .7, ease: "expo.out" }, "-=.6")
    .to(count, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => (countEl.textContent = String(Math.round(count.v)).padStart(3, "0")) }, 0)
    .to(".loader__inner", { opacity: 0, scale: .9, duration: .4, ease: "power2.in" }, "+=.15")
    .to(".loader__panel--top", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=.1")
    .to(".loader__panel--bottom", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "<")
    .from(".hero__ring", { scale: .5, rotate: -90, opacity: 0, duration: 1.6, ease: "expo.out" }, "-=.7")
    .from(".hero__title .word", { yPercent: 110, duration: 1.2, stagger: .12, ease: "expo.out" }, "-=1.4")
    .from(".hero__eyebrow, .hero__lead, .hero__coords, .hero__scroll", { opacity: 0, y: 20, duration: .8, stagger: .08 }, "-=.9")
    .call(() => document.querySelector(".header").classList.remove("is-pre"), null, "-=.9")
    .from(".hero__grid", { opacity: 0, scale: 1.2, duration: 1.6, ease: "power2.out" }, "-=1.6");

  // ---- Hero: zoom a través del anillo ----
  const heroTl = gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1 },
  });
  heroTl
    .to(".hero__copy, .hero__scroll, .hero__coords", { opacity: 0, y: -40, duration: .25 }, 0)
    .to(".hero__ring", { scale: 11, rotate: 0, ease: "power2.in", duration: 1 }, 0)
    .to(".hero__grid", { scale: 2.4, opacity: 0, duration: .8 }, 0)
    .to(".hero__reveal", { opacity: 1, duration: .45 }, .35)
    .to(".hero__reveal img", { scale: 1, duration: 1, ease: "power1.out" }, .35)
    .to(".hero__ring", { opacity: 0, duration: .1 }, .9)
    .fromTo(".hero__after", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3 }, 1);

  // Coordenadas del cursor en el hero (detalle "plano técnico")
  const cx = document.querySelector(".js-coord-x");
  const cy = document.querySelector(".js-coord-y");
  document.querySelector(".hero").addEventListener("mousemove", (e) => {
    cx.textContent = "X " + String(Math.round(e.clientX)).padStart(4, "0");
    cy.textContent = "Y " + String(Math.round(e.clientY)).padStart(4, "0");
    gsap.to(".hero__ring-wrap", { x: (e.clientX / innerWidth - .5) * 24, y: (e.clientY / innerHeight - .5) * 24, duration: 1.2, ease: "power3.out" });
  });

  // ---- Manifiesto: palabras se encienden con el scroll ----
  gsap.to(".manifesto .split-word", {
    opacity: 1, stagger: .05, ease: "none",
    scrollTrigger: { trigger: ".manifesto", start: "top 80%", end: "bottom 45%", scrub: true },
  });

  // ---- Títulos por líneas ----
  document.querySelectorAll(".js-split-lines").forEach((el) => {
    gsap.from(el.querySelectorAll(".split-line > span"), {
      yPercent: 110, duration: 1.1, stagger: .1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  gsap.utils.toArray(".reveal-up").forEach((el, i) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1, delay: (i % 3) * .1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  gsap.from(".service", {
    y: 50, opacity: 0, duration: .9, stagger: .1, ease: "expo.out",
    scrollTrigger: { trigger: ".services__list", start: "top 80%" },
  });

  // ---- Proyectos: scroll horizontal ----
  const track = document.querySelector(".work__track");
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const workTween = gsap.to(track, {
    x: () => -dist(), ease: "none",
    scrollTrigger: {
      trigger: ".work", pin: ".work__pin", start: "top top", end: () => "+=" + dist(),
      scrub: 1, invalidateOnRefresh: true,
      onUpdate: (s) => gsap.set(".work__progress i", { scaleX: s.progress }),
    },
  });
  gsap.utils.toArray(".project__media img").forEach((img) => {
    gsap.fromTo(img, { xPercent: 8 }, {
      xPercent: -8, ease: "none",
      scrollTrigger: { trigger: img.closest(".project"), containerAnimation: workTween, start: "left right", end: "right left", scrub: true },
    });
  });

  // ---- Proceso: línea que avanza y activa pasos ----
  const mobile = matchMedia("(max-width: 900px)").matches;
  const line = document.querySelector(".process__line");
  const list = document.querySelector(".process__list");
  const placeLine = () => {
    if (mobile) { line.style.top = list.offsetTop + "px"; line.style.height = list.offsetHeight + "px"; }
    else line.style.top = list.offsetTop + "px";
  };
  placeLine();
  addEventListener("resize", placeLine);
  gsap.to(".process__line i", {
    [mobile ? "scaleY" : "scaleX"]: 1, ease: "none",
    scrollTrigger: { trigger: ".process__list", start: "top 75%", end: "bottom 55%", scrub: true },
  });
  gsap.utils.toArray(".step").forEach((step) => {
    ScrollTrigger.create({ trigger: step, start: "top 65%", onEnter: () => step.classList.add("is-active"), onLeaveBack: () => step.classList.remove("is-active") });
    gsap.from(step.querySelectorAll("h3, p"), { y: 30, opacity: 0, duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: step, start: "top 80%" } });
  });

  // ---- Contacto: el isotipo gira con el scroll ----
  gsap.to(".contact__bg svg", { rotate: 120, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".contact__form > *", { y: 40, opacity: 0, duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".contact__form", start: "top 85%" } });

  // ---- Footer: wordmark sube ----
  gsap.from(".footer__word", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  if (finePointer) desktopFx();

  addEventListener("load", () => ScrollTrigger.refresh());
}

function desktopFx() {
  // ---- Cursor ----
  const cursor = document.querySelector(".cursor");
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const label = cursor.querySelector(".cursor__label");
  gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50 });
  const rx = gsap.quickTo(ring, "x", { duration: .45, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: .45, ease: "power3" });
  const lx = gsap.quickTo(label, "x", { duration: .45, ease: "power3" });
  const ly = gsap.quickTo(label, "y", { duration: .45, ease: "power3" });
  addEventListener("mousemove", (e) => {
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    rx(e.clientX); ry(e.clientY); lx(e.clientX); ly(e.clientY);
  });
  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => { label.textContent = el.dataset.cursor; cursor.classList.add("is-big"); });
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-big"));
  });

  // ---- Botones magnéticos ----
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: "elastic.out(1, .4)" }));
  });

  // ---- Preview de servicios que sigue el cursor ----
  const preview = document.querySelector(".services__preview");
  const pimg = preview.querySelector("img");
  gsap.set(preview, { xPercent: -50, yPercent: -50 });
  const px = gsap.quickTo(preview, "x", { duration: .6, ease: "power3" });
  const py = gsap.quickTo(preview, "y", { duration: .6, ease: "power3" });
  const list = document.querySelector(".services__list");
  list.addEventListener("mousemove", (e) => { px(e.clientX + 40); py(e.clientY); });
  document.querySelectorAll(".service").forEach((s) => {
    s.addEventListener("mouseenter", () => {
      pimg.src = s.dataset.img;
      gsap.to(preview, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: .5, ease: "expo.out" });
    });
  });
  list.addEventListener("mouseleave", () => gsap.to(preview, { opacity: 0, scale: .6, duration: .4 }));
}
