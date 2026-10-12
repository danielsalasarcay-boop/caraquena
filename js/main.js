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

// El teléfono recuerda dónde estabas y te deja a mitad de página: siempre abrir en la portada
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash.length < 2) window.scrollTo(0, 0);

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
  window.__touchNormalize?.(!open);
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

// ---- Conoce más: visor de fichas del portafolio ----
const lbEl = document.querySelector(".lb");
if (lbEl) {
  const img = lbEl.querySelector(".lb__img"), thumbs = lbEl.querySelector(".lb__thumbs");
  const titleEl = lbEl.querySelector(".lb__title"), countEl = lbEl.querySelector(".lb__count");
  let list = [], idx = 0, lastFocus = null;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    img.src = list[idx]; countEl.textContent = `${idx + 1} / ${list.length}`;
    thumbs.querySelectorAll("button").forEach((b, k) => b.classList.toggle("is-on", k === idx));
    thumbs.children[idx]?.scrollIntoView({ inline: "center", block: "nearest" });
  };
  const open = (card) => {
    const g = card.dataset.gallery, n = +card.dataset.count;
    const sfx = innerWidth <= 900 ? "-m" : "";
    list = Array.from({ length: n }, (_, k) => `img/portafolio/${g}/${String(k + 1).padStart(2, "0")}${sfx}.jpg`);
    titleEl.textContent = card.querySelector(".pcard__title").textContent;
    img.alt = titleEl.textContent;
    thumbs.innerHTML = list.map((src, k) => `<button type="button" aria-label="${k + 1}"><img src="${src.replace(/(-m)?\.jpg$/, "-m.jpg")}" alt="" loading="lazy" decoding="async"></button>`).join("");
    thumbs.querySelectorAll("button").forEach((b, k) => b.addEventListener("click", () => show(k)));
    lastFocus = document.activeElement;
    lbEl.hidden = false; document.documentElement.style.overflow = "hidden";
    window.lenisInstance?.stop(); window.__touchNormalize?.(false);
    show(0); lbEl.querySelector(".lb__close").focus();
  };
  const close = () => {
    lbEl.hidden = true; document.documentElement.style.overflow = "";
    window.lenisInstance?.start(); window.__touchNormalize?.(true); lastFocus?.focus();
  };
  document.querySelectorAll(".pcard").forEach((c) => c.querySelector(".pcard__open").addEventListener("click", () => open(c)));
  lbEl.querySelector(".lb__close").addEventListener("click", close);
  lbEl.querySelector(".lb__nav--prev").addEventListener("click", () => show(idx - 1));
  lbEl.querySelector(".lb__nav--next").addEventListener("click", () => show(idx + 1));
  addEventListener("keydown", (e) => {
    if (lbEl.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });
  // deslizar en el teléfono
  let x0 = null;
  img.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  img.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// ---- Imágenes: se descargan y decodifican con anticipación (antes de que entren a pantalla),
// así no hay tirón al revelarlas durante una animación ----
if ("IntersectionObserver" in window) {
  // cola: una imagen a la vez, en ratos libres del navegador
  const queue = []; let busy = false;
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 60));
  const pump = () => {
    if (busy || !queue.length) return;
    busy = true;
    idle(() => {
      const im = queue.shift(); im.loading = "eager";
      const done = () => { busy = false; pump(); };
      (im.decode ? im.decode() : Promise.resolve()).then(done, done);
    }, { timeout: 400 });
  };
  const enqueue = (im) => { if (!im.__q) { im.__q = 1; queue.push(im); pump(); } };
  const pre = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { pre.unobserve(en.target); enqueue(en.target); }
  }), { rootMargin: "200% 0px 200% 0px" });
  document.querySelectorAll('img[loading="lazy"]').forEach((im) => pre.observe(im));
  document.querySelectorAll(".reel, .film, .gfilm, .work").forEach((sec) => {
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { io.disconnect(); sec.querySelectorAll("img").forEach(enqueue); } }, { rootMargin: "120% 0px" });
    io.observe(sec);
  });
}

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
  // En pantallas táctiles el dedo mueve la página fuera del hilo de JS y los pines "saltan":
  // normalizeScroll sincroniza el scroll táctil con las animaciones.
  const isTouch = ScrollTrigger.isTouch === 1;
  window.__touchNormalize = (on) => { if (isTouch) ScrollTrigger.normalizeScroll(on ? { allowNestedScroll: true, lockAxis: false, momentum: (self) => Math.min(3, self.velocityY / 1000) } : false); };

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
    // iOS ignora overflow:hidden: bloquear el dedo y la rueda mientras está la pantalla de carga
    const block = (e) => e.preventDefault();
    addEventListener("touchmove", block, { passive: false });
    addEventListener("wheel", block, { passive: false });
    window.__unblock = () => { removeEventListener("touchmove", block); removeEventListener("wheel", block); };
    const count = { v: 0 };
    const countEl = document.querySelector(".js-count");
    gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("is-loading");
        loader.remove();
        if (location.hash.length < 2) { window.scrollTo(0, 0); lenis.scrollTo(0, { immediate: true, force: true }); }
        window.__unblock?.();
        lenis.start();
        ScrollTrigger.refresh();
        window.__touchNormalize?.(true);
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
    window.__touchNormalize(true);
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
      return `${((r.left + r.width * .489) / innerWidth) * 100}% ${((r.top + r.height * .515) / innerHeight) * 100}%`;
    };
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } })
      .to(".hero__copy, .hero__scroll, .hero__sketch figcaption", { opacity: 0, y: -40, duration: .25 }, 0)
      .to(sketch, { scale: 2.6, transformOrigin: "48.9% 51.5%", ease: "power2.in", duration: 1 }, 0)
      .to(".sheet", { opacity: 0, duration: .6 }, 0)
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
    });
  });

  // ---- Conoce más: Otter como película (isla → boceto → planta → corte → fachada a mano → boceto a marcador → render) ----
  const film = document.querySelector(".film");
  if (film) {
    const q = (sel) => film.querySelector(sel);
    const caps = [...film.querySelectorAll(".film__cap")];
    const rail = [...film.querySelectorAll(".film__rail li")];
    const bounds = [1.25, 2.5, 3.7, 4.6, 5.38, 99];
    const setChapter = (t) => {
      const i = bounds.findIndex((b) => t < b);
      caps.forEach((c, k) => c.classList.toggle("is-on", k === i));
      rail.forEach((li, k) => li.classList.toggle("is-on", k === i));
    };
    setChapter(0);
    const titleText = q(".film__title text");
    const plan = q(".film__plan"), section = q(".film__section"), sketch = q(".film__sketch");
    const facadeDraw = q(".film__facade .draw");
    gsap.set(plan, { transformPerspective: 1400 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: film, start: "top top", end: "+=650%", scrub: .9, pin: q(".film__stage"), anticipatePin: 1,
        onUpdate: (st) => { setChapter(st.progress * 6); gsap.set(q(".film__progress i"), { scaleX: st.progress }); },
      },
    })
      .to({}, { duration: 6 }, 0) // duración fija: los trazos se insertan después sin alterar el ritmo
      .to(q(".film__aerial"), { scale: 1.45, duration: 1.4 }, 0)
      .fromTo(titleText, { strokeDasharray: 2600, strokeDashoffset: 2600 }, { strokeDashoffset: 0, duration: .55 }, 0)
      .to(titleText, { fillOpacity: 1, duration: .2 }, .45)
      .to(q(".film__title"), { opacity: 0, scale: 1.15, duration: .25 }, .95)
      .fromTo(q(".film__paper"), { clipPath: "circle(0% at 50% 45%)" }, { clipPath: "circle(150% at 50% 45%)", duration: .55, ease: "power2.in" }, 1.05)
      .set(q(".film__aerial"), { autoAlpha: 0 }, 1.62)
      .to(sketch, { scale: 1.3, opacity: 0, duration: .3 }, 2.4)
      .from(plan, { rotation: -10, scale: .9, duration: .9 }, 2.6)
      .to(plan, { rotationX: 58, rotation: -22, scale: .78, yPercent: -12, opacity: 0, duration: .45, ease: "power2.in" }, 3.55)
      .to(section, { yPercent: -20, opacity: 0, duration: .2 }, 4.45)
      .set(q(".film__scan--v"), { opacity: 1 }, 5)
      .fromTo(q(".film__marker"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .35, ease: "power1.inOut" }, 5)
      .fromTo(q(".film__scan--v"), { left: "0%" }, { left: "100%", duration: .35, ease: "power1.inOut" }, 5)
      .set(q(".film__scan--v"), { opacity: 0 }, 5.36)
      .to(facadeDraw, { opacity: 0, duration: .1 }, 5.25)
      .set(q(".film__scan--h"), { opacity: 1 }, 5.4)
      .fromTo(q(".film__render"), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .38, ease: "power1.inOut" }, 5.4)
      .fromTo(q(".film__scan--h"), { top: "100%" }, { top: "0%", duration: .38, ease: "power1.inOut" }, 5.4)
      .set(q(".film__scan--h"), { opacity: 0 }, 5.79)
      .fromTo(q(".film__facade"), { scale: 1.06 }, { scale: 1, duration: .8 }, 5.2);
    const drawIn = (el, at, len, fill = true) => loadDraw(el).then((paths) => {
      tl.to(paths, { strokeDashoffset: 0, duration: len * .5, stagger: { amount: len * .5 } }, at);
      if (fill) tl.to(paths, { fillOpacity: 1, duration: .15, stagger: { amount: .1 } }, at + len - .1);
    });
    Promise.all([drawIn(sketch, 1.3, .95), drawIn(plan, 2.65, .9), drawIn(section, 3.85, .55), drawIn(facadeDraw, 4.55, .45, false)]);
  }

  // ---- Conoce más: renders de Otter en una tira horizontal ----
  const reel = document.querySelector(".reel");
  if (reel) {
    const track = reel.querySelector(".reel__track");
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: reel, start: "top top", end: () => "+=" + dist(), pin: reel.querySelector(".reel__pin"), scrub: .8, invalidateOnRefresh: true },
    });
    reel.querySelectorAll(".reel__item img").forEach((im) => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: im.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
  }
  gsap.utils.toArray(".pcard").forEach((c, i) => gsap.from(c, { y: 50, opacity: 0, duration: 1, delay: (i % 3) * .1, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 90%" } }));

  // ---- Conoce más: Puerto de Guanta — azul plano; el puerto crece fase por fase sobre el mismo plano ----
  const gf = document.querySelector(".gfilm");
  if (gf) {
    const q = (sel) => gf.querySelector(sel);
    const caps = [...gf.querySelectorAll(".film__cap")];
    const rail = [...gf.querySelectorAll(".film__rail li")];
    const bounds = [1.2, 2.2, 3.6, 5.1, 6.85, 99];
    const setChapter = (t) => {
      const i = bounds.findIndex((b) => t < b);
      caps.forEach((c, k) => c.classList.toggle("is-on", k === i));
      rail.forEach((li, k) => li.classList.toggle("is-on", k === i));
    };
    setChapter(0);
    const [baseEl, f1El, f2El, f3El] = gf.querySelectorAll(".gfilm__layer");
    const title = q(".gfilm__title text");
    const sv = q(".gfilm__scanv"), sh = q(".gfilm__scanh");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: gf, start: "top top", end: "+=800%", scrub: .9, pin: q(".gfilm__stage"), anticipatePin: 1,
        onUpdate: (st) => { setChapter(st.progress * 8); gsap.set(q(".film__progress i"), { scaleX: st.progress }); },
      },
    })
      .to({}, { duration: 8 }, 0)
      // 01 situación actual
      .to(q(".gfilm__actual"), { scale: 1.3, duration: 1.4 }, 0)
      .fromTo(title, { strokeDasharray: 2800, strokeDashoffset: 2800 }, { strokeDashoffset: 0, duration: .55 }, 0)
      .to(title, { fillOpacity: 1, duration: .2 }, .45)
      .to(q(".gfilm__title"), { opacity: 0, scale: 1.15, duration: .25 }, .9)
      // 02 se abre el plano azul
      .fromTo(q(".gfilm__blue"), { clipPath: "circle(0% at 50% 55%)" }, { clipPath: "circle(150% at 50% 55%)", duration: .5, ease: "power2.in" }, 1.0)
      .set(q(".gfilm__actual"), { autoAlpha: 0 }, 1.52)
      .fromTo(q(".gfilm__map"), { scale: 1.06 }, { scale: 1, duration: 6.8 }, 1.2)
      // 03 fase 1 → render por iris desde la zona de expansión
      .set(q(".gfilm__r1"), { autoAlpha: 1, clipPath: "circle(0% at 30% 72%)" }, 2.95)
      .to(q(".gfilm__r1"), { clipPath: "circle(140% at 30% 72%)", duration: .45, ease: "power2.inOut" }, 2.95)
      .to(q(".gfilm__r1"), { autoAlpha: 0, duration: .25 }, 3.55)
      // 04 fase 2 → render con barrido vertical
      .set(q(".gfilm__r2"), { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" }, 4.45)
      .set(sv, { opacity: 1, left: "0%" }, 4.45)
      .to(q(".gfilm__r2"), { clipPath: "inset(0 0% 0 0)", duration: .4, ease: "power1.inOut" }, 4.45)
      .to(sv, { left: "100%", duration: .4, ease: "power1.inOut" }, 4.45)
      .set(sv, { opacity: 0 }, 4.86)
      .to(q(".gfilm__r2"), { autoAlpha: 0, duration: .25 }, 5.05)
      // 05 fase 3 → cianotipo → render
      .fromTo(q(".gfilm__cyan"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .35 }, 6.0)
      .set(q(".gfilm__r3"), { autoAlpha: 1, clipPath: "inset(100% 0 0 0)" }, 6.45)
      .set(sh, { opacity: 1, top: "100%" }, 6.45)
      .to(q(".gfilm__r3"), { clipPath: "inset(0% 0 0 0)", duration: .4, ease: "power1.inOut" }, 6.45)
      .to(sh, { top: "0%", duration: .4, ease: "power1.inOut" }, 6.45)
      .set(sh, { opacity: 0 }, 6.86)
      // 06 de día a noche: barrido de arriba hacia abajo
      .set(q(".gfilm__night"), { autoAlpha: 1, clipPath: "inset(0 0 100% 0)" }, 7.0)
      .set(sh, { opacity: 1, top: "0%" }, 7.0)
      .to(q(".gfilm__night"), { clipPath: "inset(0 0 0% 0)", duration: .55, ease: "power1.inOut" }, 7.0)
      .to(sh, { top: "100%", duration: .55, ease: "power1.inOut" }, 7.0)
      .set(sh, { opacity: 0 }, 7.56);
    // En teléfono el plano no cabe completo: paneo hacia el oeste para ver la fase 2 y de vuelta para la 3
    if (matchMedia("(max-width: 760px)").matches) {
      tl.to(q(".gfilm__map"), { xPercent: -28, duration: .5, ease: "power1.inOut" }, 3.65)
        .to(q(".gfilm__map"), { xPercent: -50, duration: .5, ease: "power1.inOut" }, 5.1);
    }
    // trazos con su relleno propio (CSS): se dibuja el contorno y luego entra el relleno por grupo
    const drawIn = (el, at, len) => loadDraw(el).then((paths) => {
      gsap.set(paths, { fillOpacity: 0 });
      tl.to(paths, { strokeDashoffset: 0, duration: len * .6, stagger: { amount: len * .4 } }, at)
        .to(paths, { fillOpacity: 1, duration: .2, stagger: { amount: .12 } }, at + len - .15);
    });
    Promise.all([drawIn(baseEl, 1.3, .85), drawIn(f1El, 2.25, .65), drawIn(f2El, 3.75, .65), drawIn(f3El, 5.25, .7)]);
  }


  // ---- Nosotros ----
  if (document.querySelector(".page-hero__photo")) {
    gsap.from(".page-hero__photo img", { clipPath: "inset(10% 6% 10% 6%)", scale: 1.06, ease: "none", scrollTrigger: { trigger: ".page-hero__photo", start: "top bottom", end: "top 35%", scrub: true } });
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
      .to(strokes, { strokeDashoffset: 0, duration: 1.1, stagger: .08, ease: "expo.inOut" })
      .from(wrap.querySelector(".orbit--mid"), { opacity: 0, rotate: -60, transformOrigin: "50% 50%", duration: 1.2, ease: "expo.out" }, "-=1")
      .from(orbit.querySelectorAll(".orbit-label"), { opacity: 0, duration: .5, stagger: .12 }, "-=.7")
      .set(logo, { opacity: 1 }, .45)
      .from(ring, { rotate: -100, scale: .82, opacity: 0, svgOrigin: "410 375", duration: 1, ease: "expo.out" }, .45)
      .from(bar, { x: -90, opacity: 0, duration: .6, ease: "expo.out" }, .95)
      .addLabel("morph", 1.75)
      .to(bar, { x: 80, opacity: 0, duration: .5, ease: "power2.in" }, "morph")
      .to(orbit.querySelector(".om-wedge"), { attr: { points: "410,375 410,375 410,375 410,375" }, duration: .75, ease: "power3.inOut" }, "morph")
      .to(orbit.querySelector(".om-hole"), { attr: { r: 0 }, duration: .8, ease: "power3.inOut" }, "morph+=.05")
      .set(orbit.querySelectorAll(".om-wedge, .om-hole"), { attr: { fill: "#fff" } }, "morph+=.85")
      .to(ring, { attr: { fill: "#f05a25" }, duration: .7, ease: "sine.inOut" }, "morph+=.2")
      .set(core, { fillOpacity: 1 }, "morph+=.9")
      .to(logo, { opacity: 0, duration: .25 }, "morph+=.9")
      .addLabel("city", "morph+=.65");
    const cityReady = loadDraw(cityEl).then((paths) => {
      gsap.set(paths, { fillOpacity: 0 });
      tl.to(paths, { strokeDashoffset: 0, duration: .8, ease: "power2.inOut", stagger: { amount: 1.5 } }, "city")
        .to(paths, { fillOpacity: 1, duration: .6, stagger: { amount: .4 } }, "-=.8")
        .call(() => pin.classList.add("is-on"), null, "-=.4");
      // la ciudad respira despacio dentro del círculo
      gsap.to(cityEl.querySelector("svg"), { scale: 1.12, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
    // el dibujo de Caracas se precarga; la secuencia arranca cuando está listo (en móvil puede tardar)
    ScrollTrigger.create({ trigger: wrap, start: "top 85%", once: true, onEnter: () => cityReady.then(() => tl.play()) });
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
    let run;
    const play = () => {
      run?.kill(); prog.p = 0; paint();
      method.classList.add("is-drawing");
      run = gsap.to(prog, { p: 1, duration: 5, ease: "power1.inOut", onUpdate: paint, onComplete: () => method.classList.remove("is-drawing") });
    };
    ScrollTrigger.create({
      trigger: list, start: "top 80%", end: "bottom top",
      onEnter: play,
      onLeaveBack: () => { run?.kill(); prog.p = 0; paint(); method.classList.remove("is-drawing"); },
    });
  }

  // ---- Contacto y footer ----
  if (document.querySelector(".contact")) {
    gsap.from(".contact__lead > *, .contact__direct li", { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 80%" } });
  }
  gsap.from(".footer__word", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  if (finePointer) desktopFx();
  addEventListener("load", () => ScrollTrigger.refresh());
  // imágenes perezosas cambian la altura de la página: recalcular (agrupado) cuando cargan
  // solo si la altura del documento cambió de verdad (recalcular todos los pines es caro y da tirón)
  let refreshT, lastH = document.documentElement.scrollHeight;
  const maybeRefresh = () => {
    clearTimeout(refreshT);
    refreshT = setTimeout(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) > 2) { lastH = h; ScrollTrigger.refresh(); }
    }, 300);
  };
  document.querySelectorAll("img").forEach((im) => { if (!im.complete) im.addEventListener("load", maybeRefresh, { once: true }); });
  ScrollTrigger.addEventListener("refresh", () => (lastH = document.documentElement.scrollHeight));
}

function desktopFx() {
  // ---- Botones magnéticos ----
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .12, y: (e.clientY - r.top - r.height / 2) * .18, duration: .6, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: .7, ease: "power3.out" }));
  });
}
