/* Caraqueña Studio — interacciones */

// ---- Datos de contacto (único lugar donde se cambian) ----
const SITE = {
  whatsapp: "584142582223",
  email: "contacto@caraquena.com",
  instagram: "https://www.instagram.com/caraquena.studio",
  waMessage: document.documentElement.lang === "en"
    ? "Hi Caraqueña, I'd like information about a project."
    : "Hola Caraqueña, quiero información sobre un proyecto.",
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

// ---- Botones: texto que rueda + flecha ----
document.querySelectorAll(".btn > span:only-child").forEach((label) => {
  const t = label.textContent;
  label.outerHTML = `<span class="btn__roll"><span>${t}</span><span aria-hidden="true">${t}</span></span><span class="btn__arrow" aria-hidden="true">→</span>`;
});

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
  document.querySelectorAll(".js-kicker text").forEach((t) => (t.style.fillOpacity = 1));
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
      end: isHero ? () => "+=" + ((sec.offsetHeight - innerHeight) * 0.85 + 40) : "bottom 40px",
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
    gsap.from(".page-hero__lead", { opacity: 0, y: 20, duration: .9, delay: .6 });
    // Título "Nosotros" que se dibuja en trazos naranja y luego se rellena
    const kicker = document.querySelector(".js-kicker");
    if (kicker) document.fonts.ready.then(() => {
      const text = kicker.querySelector("text");
      const bb = text.getBBox();
      kicker.setAttribute("viewBox", `${bb.x - 4} ${bb.y - 4} ${bb.width + 8} ${bb.height + 8}`);
      gsap.timeline({ delay: .2 })
        .fromTo(text, { strokeDasharray: 2400, strokeDashoffset: 2400 }, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" })
        .to(text, { fillOpacity: 1, duration: .9, ease: "power1.out" }, "-=.7");
    });
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
        .fromTo(shot.querySelector("img"), { clipPath: "inset(0 0 100% 0)", yPercent: 4 }, { clipPath: "inset(0 0 0% 0)", yPercent: 0, duration: 1.2, ease: "expo.inOut" }, at + .6)
        .to(shot.querySelectorAll(".shot__lines line"), { opacity: .25, duration: .6 }, at + 1.4)
        .from(shot.querySelectorAll("figcaption > *"), { y: 20, opacity: 0, duration: .8, stagger: .08, ease: "expo.out" }, at + 1.1);
    });
  }

  // ---- Proyectos (premium): al acercarse se dibujan las líneas; al centrarse, el proyecto se fija
  //      y pasa de trazo a boceto a marcador (nano-banana) y luego al render, con barridos naranja ----
  gsap.utils.toArray(".build").forEach((build) => {
    const canvas = build.querySelector(".build__canvas");
    const el = build.querySelector(".js-draw");
    const marker = build.querySelector(".build__marker");
    const render = build.querySelector(".build__render");
    const scanV = build.querySelector(".build__scan--v");
    const scanH = build.querySelector(".build__scan--h");
    const stages = build.querySelectorAll(".build__stages li");
    const setStage = (i) => stages.forEach((li, k) => { li.classList.toggle("is-on", k === i); li.classList.toggle("is-done", k < i); });
    gsap.from(build.querySelectorAll(".build__info > *"), {
      y: 30, opacity: 0, duration: .9, stagger: .08, ease: "expo.out",
      scrollTrigger: { trigger: build, start: "top 70%" },
    });
    // 2) fijo en pantalla (se crea ya, en orden, para que los pines no se encimen):
    //    el boceto a marcador barre de izquierda a derecha, luego el render sube
    gsap.timeline({
      scrollTrigger: {
        trigger: canvas, start: "center 52%", end: "+=110%", scrub: .8, pin: build, pinSpacing: true, anticipatePin: 1,
        onUpdate: (s) => setStage(s.progress < .42 ? (s.progress < .05 ? 0 : 1) : 2),
        onLeaveBack: () => setStage(0),
      },
    })
      .set(scanV, { opacity: 1 }, 0)
      .fromTo(marker, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "power1.inOut", duration: .4 }, 0)
      .fromTo(scanV, { left: "0%" }, { left: "100%", ease: "power1.inOut", duration: .4 }, 0)
      .set(scanV, { opacity: 0 }, .4)
      .to(el, { opacity: 0, duration: .15 }, .3)
      .set(scanH, { opacity: 1 }, .5)
      .fromTo(render, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "power1.inOut", duration: .42 }, .5)
      .fromTo(scanH, { top: "100%" }, { top: "0%", ease: "power1.inOut", duration: .42 }, .5)
      .set(scanH, { opacity: 0 }, .92)
      .fromTo(canvas, { scale: .97 }, { scale: 1, ease: "none", duration: 1 }, 0)
      .to({}, { duration: .08 });
    // 1) trazo: se dibuja mientras el proyecto sube hacia el centro (cuando el SVG termina de cargar)
    loadDraw(el).then((paths) => {
      gsap.timeline({ scrollTrigger: { trigger: canvas, start: "top 92%", end: "center 52%", scrub: .8 } })
        .to(paths, { strokeDashoffset: 0, ease: "none", stagger: { amount: 1 }, duration: .6 });
      ScrollTrigger.refresh();
    });
  });

  // ---- Conoce más: Otter La Tortuga — el boceto se dibuja y desde su anillo central se abre el render ----
  const otter = document.querySelector(".otter");
  if (otter) {
    const sketchBox = otter.querySelector(".otter__sketch");
    const render = otter.querySelector(".otter__render");
    const step = otter.querySelector(".js-otter-step");
    const en = document.documentElement.lang === "en";
    const labels = en ? ["01 — Site sketch", "02 — Ink", "03 — Render"] : ["01 — Boceto de implantación", "02 — Tinta", "03 — Render"];
    const ringAt = () => {
      const s = sketchBox.getBoundingClientRect(), st = otter.getBoundingClientRect();
      return `${((s.left - st.left + s.width * .496) / st.width) * 100}% ${((s.top - st.top + s.height * .518) / st.height) * 100}%`;
    };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: otter, start: "top top", end: "+=220%", pin: otter.querySelector(".otter__stage"), scrub: .8, invalidateOnRefresh: true,
        onUpdate: (s) => (step.textContent = labels[s.progress < .45 ? 0 : s.progress < .6 ? 1 : 2]),
      },
    });
    loadDraw(otter.querySelector(".js-draw")).then((paths) => {
      tl.to(paths, { strokeDashoffset: 0, ease: "none", stagger: { amount: .9 }, duration: .45 }, 0)
        .to(paths, { fillOpacity: 1, duration: .12, stagger: { amount: .05 } }, .47)
        .to(sketchBox, { scale: 2.4, transformOrigin: "49.6% 51.8%", ease: "power2.in", duration: .4 }, .6)
        .fromTo(render, { clipPath: () => `circle(0% at ${ringAt()})`, scale: 1.25 }, { clipPath: () => `circle(80% at ${ringAt()})`, scale: 1, ease: "power2.inOut", duration: .4 }, .62)
        .to({}, { duration: .1 });
      ScrollTrigger.refresh();
    });
  }

  // ---- Nosotros ----
  if (document.querySelector(".page-hero__photo")) {
    gsap.fromTo(".page-hero__photo img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".page-hero__photo", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".page-hero__photo", { clipPath: "inset(12% 8% 0 8%)", ease: "none", scrollTrigger: { trigger: ".page-hero__photo", start: "top bottom", end: "top 30%", scrub: true } });
  }
  const orbit = document.querySelector(".js-orbit");
  if (orbit) {
    const wrap = orbit.closest(".orbit-wrap");
    const strokes = orbit.querySelectorAll(".orbit:not(.orbit--mid)");
    const cityEl = wrap.querySelector(".js-draw");
    const pin = wrap.querySelector(".orbit-pin");
    const core = orbit.querySelector(".orbit-core");
    const logo = orbit.querySelector(".orbit-logo");
    const ring = orbit.querySelector(".ol-ring");
    const bar = orbit.querySelector(".ol-bar");
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(core, { fillOpacity: 0 });
    // Anillos → aparece el isotipo de Caraqueña → su hueco se cierra y se vuelve el disco naranja → se dibuja Caracas
    const tl = gsap.timeline({ paused: true })
      .to(strokes, { strokeDashoffset: 0, duration: 1.4, stagger: .12, ease: "expo.inOut" })
      .from(wrap.querySelector(".orbit--mid"), { opacity: 0, rotate: -60, transformOrigin: "50% 50%", duration: 1.4, ease: "expo.out" }, "-=1.2")
      .from(orbit.querySelectorAll(".orbit-label"), { opacity: 0, duration: .6, stagger: .15 }, "-=.8")
      .set(logo, { opacity: 1 }, .7)
      .from(ring, { rotate: -100, scale: .82, opacity: 0, svgOrigin: "410 375", duration: 1.3, ease: "expo.out" }, .7)
      .from(bar, { x: -90, opacity: 0, duration: .8, ease: "expo.out" }, 1.4)
      .addLabel("morph", "+=.7")
      .to(bar, { x: 80, opacity: 0, duration: .7, ease: "power2.in" }, "morph")
      .to(orbit.querySelector(".om-wedge"), { attr: { points: "411,287 411,287 411,67 411,67" }, duration: 1.1, ease: "power3.inOut" }, "morph")
      .to(orbit.querySelector(".om-hole"), { attr: { r: 0 }, duration: 1.2, ease: "power3.inOut" }, "morph+=.1")
      .set(orbit.querySelectorAll(".om-wedge, .om-hole"), { attr: { fill: "#fff" } }, "morph+=1.3")
      .to(ring, { attr: { fill: "#f05a25" }, duration: 1, ease: "sine.inOut" }, "morph+=.35")
      .set(core, { fillOpacity: 1 }, "morph+=1.35")
      .to(logo, { opacity: 0, duration: .3 }, "morph+=1.35")
      .addLabel("city", "morph+=1.3");
    loadDraw(cityEl).then((paths) => {
      gsap.set(paths, { fillOpacity: 0 });
      tl.to(paths, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut", stagger: { amount: 2.2 } }, "city")
        .to(paths, { fillOpacity: 1, duration: .8, stagger: { amount: .5 } }, "-=1")
        .call(() => pin.classList.add("is-on"), null, "-=.4");
      // la ciudad respira despacio dentro del círculo
      gsap.to(cityEl.querySelector("svg"), { scale: 1.12, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
    ScrollTrigger.create({ trigger: wrap, start: "top 80%", once: true, onEnter: () => tl.play() });
    gsap.from(".coverage__item", { y: 40, opacity: 0, duration: 1, stagger: .15, ease: "expo.out", scrollTrigger: { trigger: ".coverage__text", start: "top 75%" } });
  }
  if (document.querySelector(".closing__photo")) {
    gsap.fromTo(".closing__photo img", { clipPath: "inset(0 0 100% 0)", scale: 1.15 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".closing__photo", start: "top 80%" } });
  }

  // ---- Método: al aparecer, la línea naranja avanza sola de punta a punta y enciende cada paso al tocarlo ----
  if (document.querySelector(".method")) {
    const method = document.querySelector(".method");
    const list = method.querySelector(".method__list");
    const mSteps = gsap.utils.toArray(".method .step");
    const prog = { p: 0 };
    const paint = () => {
      const x = prog.p * list.offsetWidth;
      gsap.set(".method__line i", { scaleX: prog.p });
      gsap.set(".method__line b", { left: prog.p * 100 + "%" });
      mSteps.forEach((st) => st.classList.toggle("is-active", prog.p > 0 && x >= st.offsetLeft - 2));
    };
    gsap.from(".method__head > *", { y: 20, opacity: 0, duration: .8, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: method, start: "top 85%" } });
    ScrollTrigger.create({
      trigger: list, start: "top 85%", once: true,
      onEnter: () => {
        method.classList.add("is-drawing");
        gsap.to(prog, { p: 1, duration: 5, ease: "power1.inOut", onUpdate: paint, onComplete: () => method.classList.remove("is-drawing") });
      },
    });
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
