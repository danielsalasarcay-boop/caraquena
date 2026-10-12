/* Caraqueña Studio — interacciones */

// ---- Datos de contacto (único lugar donde se cambian) ----
const SITE = {
  whatsapp: "584142582223",
  email: "contacto@caraquena.com",
  instagram: "https://www.instagram.com/caraquena.studio",
  waMessage: "Hola Caraqueña, quiero información sobre un proyecto.",
};

const waLink = (text = SITE.waMessage) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll(".js-wa").forEach((a) => (a.href = waLink()));
document.querySelectorAll(".js-ig").forEach((a) => (a.href = SITE.instagram));
document.querySelectorAll(".js-mail").forEach((a) => (a.href = `mailto:${SITE.email}`));
document.querySelectorAll(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const header = document.querySelector(".header");

// ---- Menú móvil ----
const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".menu");
const toggleMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open);
  menu.setAttribute("aria-hidden", !open);
  if (window.lenisInstance) open ? window.lenisInstance.stop() : window.lenisInstance.start();
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

// ---- Dibujos: cada .js-draw carga su SVG (trazos vectorizados de bocetos y renders) ----
const draws = new Map();
const loadDraw = (el) => {
  if (!draws.has(el)) {
    draws.set(el, fetch(el.dataset.src).then((r) => r.text()).then((svg) => {
      el.innerHTML = svg;
      const paths = [...el.querySelectorAll("path")];
      paths.forEach((p) => {
        const len = Math.ceil(p.getTotalLength());
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
      });
      return paths;
    }));
  }
  return draws.get(el);
};
const drawEls = [...document.querySelectorAll(".js-draw")];

// Sin GSAP (CDN caído) o con movimiento reducido: todo queda dibujado y estático.
if (!window.gsap || reduced) {
  document.body.classList.remove("is-loading");
  document.querySelector(".loader")?.remove();
  header.classList.remove("is-pre");
  document.querySelectorAll(".split-word").forEach((w) => (w.style.opacity = 1));
  drawEls.forEach((el) => {
    el.classList.add("is-static");
    loadDraw(el).then((paths) => paths.forEach((p) => (p.style.strokeDashoffset = 0)));
  });
} else {
  init();
}

function init() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // ---- Lenis smooth scroll ----
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  window.lenisInstance = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      e.preventDefault();
      lenis.scrollTo(id === "#inicio" || id === "#top" ? 0 : id, { duration: 1.6 });
    })
  );
  // Al llegar desde nosotros.html con un ancla (index.html#proyectos)
  if (location.hash.length > 1 && document.querySelector(location.hash)) {
    addEventListener("load", () => setTimeout(() => lenis.scrollTo(location.hash, { immediate: true }), 50));
  }

  // ---- Header: se esconde al bajar, aparece al subir; tinta oscura sobre secciones claras ----
  let lastY = 0;
  lenis.on("scroll", ({ scroll }) => {
    header.classList.toggle("is-scrolled", scroll > 40);
    header.classList.toggle("is-hidden", scroll > lastY && scroll > 400 && !document.body.classList.contains("menu-open"));
    lastY = scroll;
  });
  document.querySelectorAll('[data-theme="light"]').forEach((sec) => {
    const isHero = sec.classList.contains("hero");
    ScrollTrigger.create({
      trigger: sec, start: "top 40px",
      // en la portada, el portal negro la cubre hacia el final del recorrido
      end: isHero ? () => "+=" + (sec.offsetHeight - innerHeight) * 0.62 : "bottom 40px",
      onToggle: (s) => header.classList.toggle("is-light", s.isActive),
    });
  });

  // ---- Entrada ----
  const loader = document.querySelector(".loader");
  const heroDrawEl = document.querySelector('.js-draw[data-play="intro"]');
  const playHeroDraw = () => heroDrawEl && loadDraw(heroDrawEl).then((paths) => {
    gsap.timeline()
      .to(paths, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: { amount: 2.4 } })
      .to(paths, { fillOpacity: 1, duration: 1, ease: "power1.out", stagger: { amount: .6 } }, "-=1.2")
      .to(".hero__accent circle", { strokeDashoffset: 0, duration: 1.6, ease: "power3.inOut" }, "-=1.4");
  });

  if (loader) {
    lenis.stop();
    const count = { v: 0 };
    const countEl = document.querySelector(".js-count");
    gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("is-loading");
        loader.remove();
        lenis.start();
      },
    })
      .from(".loader__logo .iso-ring", { rotate: -220, scale: .4, opacity: 0, transformOrigin: "410px 375px", duration: 1.3, ease: "expo.out" })
      .from(".loader__logo .iso-bar", { xPercent: -140, opacity: 0, duration: .7, ease: "expo.out" }, "-=.6")
      .to(count, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => (countEl.textContent = String(Math.round(count.v)).padStart(3, "0")) }, 0)
      .to(".loader__inner", { opacity: 0, scale: .9, duration: .4, ease: "power2.in" }, "+=.15")
      .to(".loader__panel--top", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=.1")
      .to(".loader__panel--bottom", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "<")
      .call(playHeroDraw, null, "<+.3")
      .from(".hero__title .line > span", { yPercent: 110, duration: 1.2, stagger: .12, ease: "expo.out" }, "<+.3")
      .from(".hero__copy .eyebrow, .hero__lead, .hero__scroll, .hero__sketch figcaption", { opacity: 0, y: 20, duration: .8, stagger: .08 }, "-=.9")
      .call(() => header.classList.remove("is-pre"), null, "-=.9");
  } else {
    header.classList.remove("is-pre");
    gsap.from(".page-hero__title .split-line > span", { yPercent: 110, duration: 1.2, stagger: .1, ease: "expo.out", delay: .1 });
    gsap.from(".page-hero__lead, .page-hero .tag", { opacity: 0, y: 20, duration: .9, delay: .4 });
  }

  // ---- Portada: zoom al anillo del boceto y se entra por él (portal negro) ----
  if (document.querySelector(".hero")) {
    const sketch = document.querySelector(".hero__sketch");
    const portalAt = () => {
      const r = sketch.getBoundingClientRect();
      return `${((r.left + r.width * .496) / innerWidth) * 100}% ${((r.top + r.height * .518) / innerHeight) * 100}%`;
    };
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } })
      .to(".hero__copy, .hero__scroll, .hero__sketch figcaption", { opacity: 0, y: -40, duration: .25 }, 0)
      .to(sketch, { scale: 2.6, transformOrigin: "49.6% 51.8%", ease: "power2.in", duration: 1 }, 0)
      .to(".sheet", { scale: 1.6, opacity: 0, duration: .8 }, 0)
      .fromTo(".hero__portal", { clipPath: () => `circle(0% at ${portalAt()})` }, { clipPath: () => `circle(150% at ${portalAt()})`, ease: "power2.in", duration: .55 }, .45);
  }

  // ---- Texto del estudio: palabras se encienden con el scroll ----
  if (document.querySelector(".statement__text")) {
    gsap.to(".statement__text .split-word", {
      opacity: 1, stagger: .05, ease: "none",
      scrollTrigger: { trigger: ".statement__text", start: "top 80%", end: "bottom 50%", scrub: true },
    });
  }

  // ---- Títulos por líneas y bloques que suben ----
  document.querySelectorAll(".js-split-lines").forEach((el) => {
    if (el.closest(".page-hero")) return;
    gsap.from(el.querySelectorAll(".split-line > span"), {
      yPercent: 110, duration: 1.1, stagger: .1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  gsap.utils.toArray(".reveal-up").forEach((el, i) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1, delay: (i % 3) * .1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // ---- Proceso: líneas de construcción enmarcan cada foto, luego aparece la imagen ----
  if (document.querySelector(".process__shots")) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".process__shots", start: "top 80%" } });
    gsap.utils.toArray(".shot").forEach((shot, i) => {
      const hLines = shot.querySelectorAll(".shot__lines line:nth-of-type(odd)");
      const vLines = shot.querySelectorAll(".shot__lines line:nth-of-type(even)");
      gsap.set(hLines, { scaleX: 0, transformOrigin: "left center", transformBox: "fill-box" });
      gsap.set(vLines, { scaleY: 0, transformOrigin: "center top", transformBox: "fill-box" });
      const at = i * .25;
      tl.to(hLines, { scaleX: 1, duration: .9, stagger: .12, ease: "expo.inOut" }, at)
        .to(vLines, { scaleY: 1, duration: .9, stagger: .12, ease: "expo.inOut" }, at + .1)
        .fromTo(shot.querySelector("img"), { clipPath: "inset(0 0 100% 0)", scale: 1.15 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.2, ease: "expo.inOut" }, at + .6)
        .to(shot.querySelectorAll(".shot__lines line"), { opacity: .25, duration: .6 }, at + 1.4)
        .from(shot.querySelectorAll("figcaption > *"), { y: 20, opacity: 0, duration: .8, stagger: .08, ease: "expo.out" }, at + 1.1);
    });
  }

  // ---- Proyectos: se dibuja en líneas (de abajo hacia arriba) y luego entra el render ----
  gsap.utils.toArray(".build").forEach((build) => {
    const el = build.querySelector(".js-draw");
    const render = build.querySelector(".build__render");
    gsap.from(build.querySelectorAll(".build__info > *"), {
      y: 30, opacity: 0, duration: .9, stagger: .08, ease: "expo.out",
      scrollTrigger: { trigger: build, start: "top 70%" },
    });
    loadDraw(el).then((paths) => {
      gsap.timeline({ scrollTrigger: { trigger: build.querySelector(".build__canvas"), start: "top 85%", end: "bottom 35%", scrub: 1 } })
        .to(paths, { strokeDashoffset: 0, duration: .5, ease: "none", stagger: { amount: 1.6 } })
        .to(render, { clipPath: "inset(0% 0 0 0)", duration: .9, ease: "power2.inOut" }, "-=.25")
        .to(el, { opacity: .25, duration: .5 }, "<");
      ScrollTrigger.refresh();
    });
  });

  // ---- Nosotros ----
  if (document.querySelector(".page-hero__photo")) {
    gsap.fromTo(".page-hero__photo img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".page-hero__photo", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".page-hero__photo", { clipPath: "inset(12% 8% 0 8%)", ease: "none", scrollTrigger: { trigger: ".page-hero__photo", start: "top bottom", end: "top 30%", scrub: true } });
  }
  const orbit = document.querySelector(".js-orbit");
  if (orbit) {
    const strokes = orbit.querySelectorAll(".orbit:not(.orbit--mid)");
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.timeline({ scrollTrigger: { trigger: orbit, start: "top 75%" } })
      .to(strokes, { strokeDashoffset: 0, duration: 1.6, stagger: .2, ease: "expo.inOut" })
      .from(".orbit--mid", { opacity: 0, rotate: -60, transformOrigin: "50% 50%", duration: 1.4, ease: "expo.out" }, "-=1.2")
      .from(".orbit-core", { scale: 0, transformOrigin: "50% 50%", duration: 1, ease: "back.out(1.6)" }, "-=1")
      .from(".orbit-label", { opacity: 0, duration: .6, stagger: .15 }, "-=.6");
    gsap.from(".coverage__item", { y: 40, opacity: 0, duration: 1, stagger: .15, ease: "expo.out", scrollTrigger: { trigger: ".coverage__text", start: "top 75%" } });
  }
  if (document.querySelector(".closing__photo")) {
    gsap.fromTo(".closing__photo img", { clipPath: "inset(0 0 100% 0)", scale: 1.15 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".closing__photo", start: "top 80%" } });
  }

  // ---- Contacto y footer ----
  if (document.querySelector(".contact")) {
    gsap.from(".contact__lead > *, .contact__direct li", { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 80%" } });
  }
  gsap.from(".footer__word", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  if (finePointer) desktopFx();
  addEventListener("load", () => ScrollTrigger.refresh());
}

function desktopFx() {
  // ---- Botones magnéticos ----
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: "elastic.out(1, .4)" }));
  });
}
