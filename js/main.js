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

isoParticles();

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
  // en el teléfono las películas fijas recorren menos: mismo contenido con la mitad de scroll
  const PIN = matchMedia("(max-width: 900px)").matches ? .5 : 1;
  ScrollTrigger.config({ ignoreMobileResize: true });
  // scroll táctil nativo (con su impulso natural); los pines usan anticipatePin
  window.__touchNormalize = () => {};
  // En pantallas táctiles el pin de ScrollTrigger (position:fixed puesto desde JS) llega tarde en el
  // scroll con impulso de iOS y el bloque queda flotando sobre otra sección. Allí se fija con
  // position:sticky, que mueve el compositor y nunca se desfasa del scroll.
  const TOUCH = matchMedia("(pointer: coarse)").matches;
  const stick = (el, box, top, dist) => {
    const size = () => {
      el.style.position = "sticky"; el.style.top = top() + "px";
      box.style.height = ""; box.style.height = box.offsetHeight + dist() + "px";
    };
    size();
    ScrollTrigger.addEventListener("refreshInit", size);
  };
  // config de fijado: pin clásico en escritorio, sticky en táctil (misma distancia de recorrido)
  const pinned = (el, box, dist, top = () => 0) => {
    if (!TOUCH) return { pin: el, anticipatePin: 1 };
    stick(el, box, top, dist);
    return {};
  };

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
      .from(".loader__logo .iso-ring", { rotate: -220, scale: .4, opacity: 0, svgOrigin: "410 375", duration: 1.3, ease: "expo.out" })
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
    let pinCfg = { trigger: canvas, start: "center 52%", end: "+=110%", pin: build, pinSpacing: true, anticipatePin: 1 };
    if (TOUCH) {
      const wrap = document.createElement("div");
      build.before(wrap); wrap.appendChild(build);
      wrap.style.marginBottom = getComputedStyle(build).marginBottom; build.style.marginBottom = "0px";
      const top = () => innerHeight * .52 - canvas.offsetTop - canvas.offsetHeight / 2;
      stick(build, wrap, top, () => innerHeight * 1.1);
      pinCfg = { trigger: wrap, start: () => "top " + top() + "px", end: () => "+=" + innerHeight * 1.1 };
    }
    gsap.timeline({
      scrollTrigger: {
        ...pinCfg, scrub: .8,
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
        trigger: film, start: "top top", end: () => "+=" + innerHeight * 6.5 * PIN, scrub: .9, ...pinned(q(".film__stage"), film, () => innerHeight * 6.5 * PIN),
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
      scrollTrigger: { trigger: reel, start: "top top", end: () => "+=" + dist() * (PIN < 1 ? 1.5 : 1.8), ...pinned(reel.querySelector(".reel__pin"), reel, () => dist() * (PIN < 1 ? 1.5 : 1.8)), scrub: 1.2, invalidateOnRefresh: true },
    });
    reel.querySelectorAll(".reel__item img").forEach((im) => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: im.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
  }
  gsap.utils.toArray(".pcard").forEach((c, i) => gsap.from(c, { y: 50, opacity: 0, duration: 1, delay: (i % 3) * .1, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 90%" } }));
  // Equipo en teléfono: carrusel; el retrato centrado se enmarca en naranja y marca su punto
  const team = document.querySelector(".team__grid");
  if (team && matchMedia("(max-width: 760px)").matches) {
    const people = [...team.querySelectorAll(".person")];
    const dots = document.createElement("div");
    dots.className = "team__dots"; dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = people.map(() => "<i></i>").join("");
    team.after(dots);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      e.target.classList.toggle("is-hot", e.isIntersecting);
      if (e.isIntersecting) [...dots.children].forEach((d, k) => d.classList.toggle("is-on", k === people.indexOf(e.target)));
    }), { root: team, threshold: .7 });
    people.forEach((p) => io.observe(p));
  }
  // en táctil no hay "pasar el mouse": el render sube cuando la ficha llega al centro de la pantalla
  if (!matchMedia("(hover: hover)").matches) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-hot", e.isIntersecting)), { rootMargin: "-38% 0px -38% 0px" });
    document.querySelectorAll(".pcard").forEach((c) => io.observe(c));
  }

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
        trigger: gf, start: "top top", end: () => "+=" + innerHeight * 8 * PIN, scrub: .9, ...pinned(q(".gfilm__stage"), gf, () => innerHeight * 8 * PIN),
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


  // ---- Conoce más: USM — título, foto actual, boceto a mano (video ligado al scroll), planos acotados y renders ----
  const uf = document.querySelector(".ufilm");
  if (uf) {
    const q = (sel) => uf.querySelector(sel);
    const caps = [...uf.querySelectorAll(".film__cap")];
    const rail = [...uf.querySelectorAll(".film__rail li")];
    const bounds = [1, 2.0, 4.0, 5.0, 99];
    const setChapter = (t) => {
      const i = bounds.findIndex((b) => t < b);
      caps.forEach((c, k) => c.classList.toggle("is-on", k === i));
      rail.forEach((li, k) => li.classList.toggle("is-on", k === i));
    };
    setChapter(0);
    const title = q(".ufilm__title text"), scan = q(".ufilm__scan");
    // Boceto como secuencia de imágenes dibujada en canvas (fiable en todos los teléfonos)
    const box = q(".ufilm__video"), cv = box.querySelector("canvas"), ctx2 = cv.getContext("2d");
    const N = +box.dataset.frames, frames = new Array(N);
    let loaded = false, lastF = -1;
    const draw = (i) => {
      i = Math.max(0, Math.min(N - 1, i));
      let k = i; while (k >= 0 && !(frames[k] && frames[k].complete && frames[k].naturalWidth)) k--;
      if (k < 0 || k === lastF) return;
      lastF = k; ctx2.drawImage(frames[k], 0, 0, cv.width, cv.height);
    };
    const loadFrames = () => {
      if (loaded) return; loaded = true;
      for (let i = 0; i < N; i++) { const im = new Image(); im.decoding = "async"; im.src = `img/usm/seq/${String(i + 1).padStart(3, "0")}.jpg`; frames[i] = im; if (i === 0) im.onload = () => draw(0); }
    };
    ScrollTrigger.create({ trigger: uf, start: "top 300%", once: true, onEnter: loadFrames });
    const vt = { t: 0 };
    const seek = () => draw(Math.round(vt.t * (N - 1)));
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: uf, start: "top top", end: () => "+=" + innerHeight * 6 * PIN, scrub: .9, ...pinned(q(".ufilm__stage"), uf, () => innerHeight * 6 * PIN),
        onUpdate: (st) => { setChapter(st.progress * 6); gsap.set(q(".film__progress i"), { scaleX: st.progress }); },
      },
    })
      .to({}, { duration: 6 }, 0)
      .fromTo(title, { strokeDasharray: 1600, strokeDashoffset: 1600, fillOpacity: 0 }, { strokeDashoffset: 0, duration: .6 }, 0)
      .to(title, { fillOpacity: 1, duration: .2 }, .5)
      .to(q(".ufilm__title"), { autoAlpha: 0, scale: .85, duration: .25 }, .85)
      .fromTo(q(".ufilm__actual"), { autoAlpha: 0, yPercent: 8, rotate: -2 }, { autoAlpha: 1, yPercent: 0, rotate: 0, duration: .4, ease: "power2.out" }, 1.0)
      .to(q(".ufilm__actual"), { autoAlpha: 0, scale: .9, xPercent: -30, duration: .35, ease: "power2.in" }, 1.8)
      .fromTo(q(".ufilm__video"), { autoAlpha: 0, scale: .96 }, { autoAlpha: 1, scale: 1, duration: .3, ease: "power2.out" }, 1.95)
      .to(vt, { t: 1, duration: 1.85, onUpdate: seek }, 2.05)
      .to(q(".ufilm__video"), { autoAlpha: 0, scale: 1.04, duration: .25 }, 3.95)
      .to(q(".ufilm__plans"), { autoAlpha: 0, duration: .25 }, 4.95)
      .set(q(".ufilm__r1"), { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" }, 5.0)
      .set(scan, { opacity: 1, left: "0%" }, 5.0)
      .to(q(".ufilm__r1"), { clipPath: "inset(0 0% 0 0)", duration: .45, ease: "power1.inOut" }, 5.0)
      .to(scan, { left: "100%", duration: .45, ease: "power1.inOut" }, 5.0)
      .set(scan, { opacity: 0 }, 5.46)
      .fromTo(q(".ufilm__r1"), { scale: 1.08 }, { scale: 1, duration: .7 }, 5.0)
      .fromTo(q(".ufilm__r2"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 }, 5.6);
    loadDraw(q(".ufilm__plans")).then((paths) => {
      const lines = paths.filter((p) => p.closest(".l")), dims = paths.filter((p) => p.closest(".d"));
      gsap.set(paths, { fillOpacity: 0 });
      tl.to(lines, { strokeDashoffset: 0, duration: .45, stagger: { amount: .15 } }, 4.05)
        .to(lines, { fillOpacity: 1, duration: .1 }, 4.5)
        .to(dims, { strokeDashoffset: 0, duration: .3, stagger: { amount: .3 } }, 4.35)
        .to(dims, { fillOpacity: 1, duration: .12, stagger: { amount: .08 } }, 4.8);
    });
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
;
      // la ciudad respira despacio dentro del círculo
      gsap.to(cityEl.querySelector("svg"), { scale: 1.12, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
    // el dibujo de Caracas se precarga; la secuencia arranca cuando está listo (en móvil puede tardar)
    // la secuencia avanza con el scroll (hacia adelante y hacia atrás); el punto de Parque Central late al terminar
    cityReady.then(() => {
      ScrollTrigger.create({
        trigger: wrap, start: "top 88%", end: "bottom 45%", scrub: .7, animation: tl,
        onUpdate: (st) => pin.classList.toggle("is-on", st.progress > .97),
      });
    });
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

  // ---- Contacto: las herramientas se dibujan al entrar ----
  gsap.utils.toArray(".contact__deco .js-draw").forEach((el, i) => loadDraw(el).then((paths) => {
    gsap.set(paths, { fillOpacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: ".contact", start: "top 75%" }, delay: i * .25 })
      .to(paths, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: { amount: .6 } })
      .to(paths, { fillOpacity: 1, duration: .6 }, "-=.5");
  }));

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

// ---- Isotipo de partículas (portada de Nosotros, solo computadora) ----
// Pariente del logo de partículas de D&A Lab, pero con el gesto de Caraqueña: los puntos llegan
// girando sobre el anillo (como el compás que lo traza), la barra naranja entra deslizando desde la
// izquierda y luego un brazo de luz naranja recorre el anillo. El cursor los dispersa y vuelven.
// Se pausa fuera de pantalla; con "reducir movimiento" se dibuja quieto; se ajusta al hueco libre.
function isoParticles() {
  const wrap = document.querySelector(".js-iso-particles");
  const sym = document.getElementById("isotipo");
  if (!wrap || !sym || !finePointer || !matchMedia("(min-width: 901px)").matches) return;
  const canvas = wrap.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const INK = "#121212", ORANGE = "#F15A24", GLOW = "#F15A24", DOT = 2.05;
  const [vx, vy, vw, vh] = sym.getAttribute("viewBox").split(/\s+/).map(Number);
  const CX = 410, CY = 375; // centro del anillo en el sistema del isotipo
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${vw * 2}" height="${vh * 2}">${sym.innerHTML.replace(/currentColor/g, "#000")}</svg>`);

  let W = 0, H = 0, P = [], raf = 0, t0 = 0, visible = true, mx = -9999, my = -9999, cx = 0, cy = 0, R = 1;
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

  function build() {
    const r = wrap.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(Math.min(r.height, 420));
    if (W < 40 || H < 110) { P = []; canvas.width = canvas.height = 0; return; } // sin hueco: no se dibuja
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // isotipo encajado en el hueco, centrado
    const s = Math.min(W / vw, H / vh) * .92;
    const mw = vw * s, mh = vh * s, ox = (W - mw) / 2, oy = (r.height - mh) / 2;
    cx = ox + (CX - vx) * s; cy = oy + (CY - vy) * s; R = 225 * s;
    const off = document.createElement("canvas");
    off.width = Math.ceil(mw); off.height = Math.ceil(mh);
    const o = off.getContext("2d");
    o.drawImage(img, 0, 0, mw, mh);
    const data = o.getImageData(0, 0, off.width, off.height).data;
    const step = mh < 220 ? 2.8 : 3.1;
    P = [];
    for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step) {
      const i = (Math.floor(y) * off.width + Math.floor(x)) * 4;
      if (data[i + 3] < 140) continue;
      const bar = data[i] > 150;
      const tx = ox + x, ty = oy + y;
      const ang = Math.atan2(ty - cy, tx - cx), rad = Math.hypot(tx - cx, ty - cy);
      P.push({
        tx, ty, ang, rad, bar, x: tx, y: ty, vx: 0, vy: 0,
        // anillo: entran girando desde fuera; el retraso sigue el ángulo, como un compás que traza
        a0: ang - 2.2 - Math.random() * .5, r0: rad * (1.25 + Math.random() * .3),
        d: bar ? 1250 + (tx - cx) * 1.2 + Math.random() * 120 : ((ang + Math.PI * 1.5) % (Math.PI * 2)) / (Math.PI * 2) * 650 + Math.random() * 160,
      });
    }
    if (reduced) drawStatic();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H + 400);
    for (const p of P) { ctx.fillStyle = p.bar ? ORANGE : INK; ctx.fillRect(p.tx - DOT / 2, p.ty - DOT / 2, DOT, DOT); }
  }

  function frame(now) {
    raf = 0;
    const t = now - t0;
    ctx.clearRect(0, 0, W, H + 400);
    const sweep = t > 2300 ? -Math.PI / 2 + ((t - 2300) / 3200) * Math.PI * 2 : null; // brazo de luz
    const breath = t > 2000 ? (Math.sin((t - 2000) / 560) + 1) / 2 : 0;
    for (const p of P) {
      let tx = p.tx, ty = p.ty;
      const k = (t - p.d) / 900;
      if (k < 1) { // viajando
        const e = ease(k);
        if (p.bar) { tx = p.tx - (1 - e) * R * 1.6; }
        else { const a = p.a0 + (p.ang - p.a0) * e, rr = p.r0 + (p.rad - p.r0) * e; tx = cx + Math.cos(a) * rr; ty = cy + Math.sin(a) * rr; }
        if (k < 0) { p.x = tx; p.y = ty; continue; }
      }
      if (p.bar && t > 2000) tx += breath * 3;
      const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      if (d2 < 3200) { const dist = Math.sqrt(d2) || 1, f = ((3200 - d2) / 3200) * 4.5; p.vx += (dx / dist) * f; p.vy += (dy / dist) * f; }
      p.vx = (p.vx + (tx - p.x) * .08) * .78; p.vy = (p.vy + (ty - p.y) * .08) * .78;
      p.x += p.vx; p.y += p.vy;
      let g = 0; // estela del brazo de luz: intensa en la punta, se apaga detrás
      if (sweep !== null && !p.bar) { let da = (sweep - p.ang) % (Math.PI * 2); if (da < 0) da += Math.PI * 2; g = da < .9 ? Math.pow(1 - da / .9, 2) * .8 : 0; }
      const a = k < 0 ? 0 : k < .25 ? k * 4 : 1, sz = DOT + g * .7;
      ctx.globalAlpha = a; ctx.fillStyle = p.bar ? ORANGE : INK;
      ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
      if (g > .02) { ctx.globalAlpha = a * g; ctx.fillStyle = GLOW; ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz); }
    }
    ctx.globalAlpha = 1;
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const run = () => { if (!raf && !reduced && P.length && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  img.onload = () => {
    build();
    if (reduced) return;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }).observe(wrap);
    document.addEventListener("visibilitychange", run);
    wrap.parentElement.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
    wrap.parentElement.addEventListener("pointerleave", () => { mx = my = -9999; });
    t0 = performance.now() + 350;
    run();
  };
  let rw = 0, rh = 0;
  new ResizeObserver(() => {
    const r = wrap.getBoundingClientRect();
    if (Math.round(r.width) === rw && Math.round(r.height) === rh) return;
    rw = Math.round(r.width); rh = Math.round(r.height);
    if (img.complete && img.naturalWidth) { build(); run(); }
  }).observe(wrap);
}
