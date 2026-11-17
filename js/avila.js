/* Caraqueña Studio — "Caracas, en obra"
   Croquis de línea 100% dibujado en código: el Ávila en un solo trazo, la planta sobre el terreno,
   la torre que sube piso por piso con su grúa, cotas y niveles, y al final la ciudad viva en loop.
   Usa el GSAP + ScrollTrigger que ya carga el sitio. Sin GSAP o con "reducir movimiento": queda
   la ilustración final, completa y quieta. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const secs = document.querySelectorAll("[data-avila]");
  if (!secs.length) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqScrub = matchMedia("(min-width: 901px) and (pointer: fine)");
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const f = (n) => Math.round(n * 10) / 10;
  const E = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  // azar con semilla: el dibujo "a mano" sale idéntico en cada carga (nada salta al recargar)
  const rng = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // perfil del Ávila visto desde Caracas, de oeste a este: [posición, altura]
  const RIDGE = [[0, 338], [.05, 358], [.09, 350], [.14, 390], [.18, 408], [.215, 430], [.245, 454], [.262, 468],
    [.285, 466], [.31, 446], [.345, 418], [.39, 400], [.44, 412], [.5, 430], [.56, 448], [.62, 468], [.665, 494],
    [.7, 524], [.722, 546], [.74, 534], [.757, 516], [.775, 530], [.8, 562], [.825, 538], [.85, 504], [.875, 494],
    [.9, 508], [.93, 526], [.96, 498], [1, 468], [1.06, 440], [1.12, 452], [1.2, 420], [1.28, 432], [1.36, 398], [1.45, 372], [1.6, 384], [1.75, 404], [1.9, 372], [2.05, 392], [2.2, 360], [2.4, 372]];
  const SLOPES = [[.215, -.5, 60], [.262, -.7, 85], [.285, .7, 80], [.345, .3, 55], [.44, -.4, 60],
    [.665, -.6, 80], [.722, -.75, 95], [.722, .5, 70], [.757, .1, 50], [.8, -.4, 85], [.8, .75, 95], [.875, .2, 50], [.93, -.6, 80], [.93, .7, 70]];

  // logo oficial de La Capital del Cielo (medio globo + nombre), tal cual el vector de marca; caja 243..749 × -704..-407
  const LCDC = ["M389.26-574.57c0,24.86,0,49.73,0,74.59-.79-.39-1.55-.89-2.39-1.15-4.11-1.29-7.16,1.74-10.71,2.72-.03,0-.01.16-.02.29,1.05.23,2.08.28,3.11-.2,3.25-1.5,6.56-2.24,10.01-.64,0,29.55,0,59.09.06,88.64,0,1.91-.42,2.65-2.48,2.55-6.15-.29-12.39-.38-18.35-1.69-9.35-2.05-18.91-3.48-27.89-6.97-6.1-2.38-12.24-4.79-18.02-7.84-7.93-4.18-15.6-8.92-22.61-14.55-6.27-5.04-12.12-10.54-17.49-16.6-3.59-4.05-7.35-7.95-10.51-12.33-4.13-5.72-8.08-11.58-11.18-17.95-1.42-2.91-3-5.74-4.4-8.68-6.14-12.87-9.83-26.46-11.87-40.48-1.11-7.64-1.81-15.38-1.54-23.12.66-18.63,3.7-36.78,11.05-54.1,4.54-10.69,9.87-20.86,16.67-30.3,6.05-8.4,12.98-15.96,20.49-23.05,5.94-5.6,12.37-10.48,19.15-15.02,4.25-2.84,8.79-5.04,13.17-7.58,5.73-3.32,12.03-5.17,18.11-7.61,10.42-4.19,21.3-6.07,32.37-7.23,4.25-.45,8.5-.95,12.74-1.47,1.9-.23,2.58.36,2.58,2.43-.08,22.12.13,44.24-.16,66.35-.08,6.05.41,12.07.17,18.11-.25,6.17-.06,12.35-.06,18.53s0,12.35,0,18.53c0,1.08-.02,2.17-.02,3.25-2.75,0-5.53.26-8.25-.03-4.22-.46-8.61-.26-12.49-2.53-1.02-.6-2.47-1-3.17.13-.94,1.52-2.15,2.97-1.22,5.25,1.13,2.77,3.5,4.51,4.92,7.01.72,1.25,2.33,1.91,3.95,1.63.71-.12,1.34-.77,2.04-.83,3.44-.28,3.56-.37,3.34-4.17-2.14,2.57-4.64,1.02-6.97.86-2.23-.15-3.16-2.08-3.85-3.83-.4-1-.17-2.46.63-3.22.72-.69,1.58.34,2.09.86.71.74,1.09,0,1.61-.02.92-.03,1.37-.82,2.23-.94,3.45-.51,6.49,2.9,10.06.99.09-.05.34.08.44.19,1.26,1.55,3.04,1.06,4.66,1.21ZM261.97-496.96c.16.17.33.34.49.51,3.04,3.93,7.1,6.02,12,6.54,2.68,1.1,5.59,1.96,7.74,3.89,2.64,2.36,5.22,1.23,7.83.5,1.42-.4,2.73-.72,4.02.09.54.34,1.06.45,1.64.46,3.74.1,7.49.34,11.22.42,7.43.16,14.38,2.25,21.37,4.35,2.74.83,5.54,2.1,8.46.7,3.71-1.78,6.74-4.88,11-5.64.55-.1.98-.84,1.47-1.29,2.12-.79,4.24-1.57,6.57-2.44-2.76-1.71-5.51-.58-6.64,2.38-2.55.85-5.31.08-7.84,2.19-2.08,1.74-5.48,2.75-8.31,1.72-2.92-1.06-6.67-.22-8.73-3.5-.3-.48-1.06-.4-1.64-.14-.71.32-1.52.49-2.19.12-3.99-2.24-9.35-1.11-12.62-5.13-.21-.25-.79-.2-1.19-.29-.54-.13-.97-.5-.96-1.02.06-2.86-2.14-3.05-3.97-4.3-1.78-1.21-4.04-2.9-5.07-5.19-1.13-2.53-.4-5.27-.55-7.92-.11-2.02-3.13-4.17-4.86-3.14-2.16,1.29-2.04-.13-2.16-1.44-.07-.75-.01-1.5-.03-2.25-.03-1.12.36-2.39-1.77-1.9-.56.13-2.68-.24-2.57-1.96.09-1.44,2.72-2.75,4.26-2.2,0-1.97.29-3.78,1.74-5.31.56-.59.95-1.81.75-2.55-.74-2.69.02-5.29.05-7.93.02-1.52-2.13-4.34-3.49-4.28-1.89.08-2.51,1.7-2.99,3.22-.27.86-.31,1.79-.49,2.68-.53,2.66-.36,5.81-2.34,7.69-2.19,2.08-2.41,4.23-1.9,6.75.25,1.25.28,2.49.23,3.73-.05,1.06-.09,2.42-1.67,2.18-1.32-.19-2.76-.66-2.32-2.53.38-1.62-.24-2.4-1.75-2.95-1.01-.37-1.8-1.41-1.61-2.49.51-2.91.08-5.79.15-8.68.04-1.66-.76-2.16-1.67-2.02-2.28.37-1.62-1.16-1.73-2.24.77-.44.41-1.37.86-1.96.28-.36.8-.75.36-1.26-.41-.48-.9-.16-1.33.08-.55.31-1.33.53-1.08,1.39.18.61.54,1.18.83,1.76-4.49.82-5.52,2.21-5.61,7.18-.04,2.49-.12,5.04.64,7.37.75,2.3.88,5.06,3.35,6.53.19.43-.22,1.35.78,1.12.32-.07.83-.67.76-.84-.27-.67-.97-.2-1.46-.36-.97-3.32,2.21-2.02,3.3-3.45.39,4.44.35,5.34-1.23,6.41-1.48,1-1.19,1.76-.18,2.74.99.97,1.27,2.22,1.7,3.49.71,2.07.47,4.07.36,6.11-.08,1.38.46,2.82,1.61,3.07,1.56.34,2.98-1.01,4.07-1.96,1.08-.94-.14-2.01-.94-2.91-1.09-1.21-2.4-2.33-2.68-4.08-.07-.47-.11-1.05.52-1.25.51-.16.74.19.91.61.59,1.53,1.96,2.17,3.27,2.92,5.19,2.98,4.9,8.72,3.45,12.97-.12.34-.51.79-.82.82-2.3.22-4.42,1.6-6.84,1.06-.92-1.6-1.59-3.32-3.89-3.6-2.67-.32-.06-4.33-3.01-4.7-.06,0-.07-.76-.03-1.16.05-.49,1.36-.98.1-1.43-1.03-.37-1.19.61-1.4,1.3-.59,1.89-1.48,3.37-3.81,3.1-.17-.16-.34-.33-.51-.49-.03-.06-.04-.13-.09-.18-.03-.03-.09-.02-.14-.03.08.07.16.14.23.21ZM287.53-566.08c0-.33,0-.67,0-1-.43-3.54-.51-7.1-.52-10.66,0-1.28-1.96-2.67-2.72-2-1.17,1.04-2.74,2.21-3,3.55-.58,2.98-2.17,5.33-3.56,7.86-.57,1.05-1.33,2.29.57,3.26.45.23,1.71.9,1.64,1.89-.21,3.42,1.45,2.82,3.45,1.72.43-.24.92-.39,1.4-.5,2.27-.48,3.17-1.85,2.73-4.11ZM352.42-662.93c-.08-.64-.59-.74-1.08-.81-1.42-.19-2.4.63-3.15,1.63-.75,1-2.02,2.19-2.78,1.7-2.02-1.3-3.57-1.98-4.96.6-.03.05-.34.03-.47-.05-1.09-.71-2.1.05-3.13.18-2.83.36-5.2,2.4-8.31,2.06-1.32-.14-.98,1.26-.41,2,1.26,1.62,2.86,2.94,3.95,4.73.34.56,1.25.89,2.01.32,2.8-2.09,5.39-4.48,8.62-5.95,3.13-1.43,5.44-4.17,8.71-5.37.47-.17.84-.53,1-1.05ZM307.73-603.79c-1.95.97-4.3.85-6.01,2.68-1.46,1.56-2.72,3.32-4.48,4.62-1.42,1.05-.26,2.31.18,3.35.44,1.03,1.18.73,2.22.44,1.89-.53,3.59-.87,3.98-3.18.05-.28.63-.63.99-.66,2.02-.2,4.04-1.21,6.09-.08.48.27.92.55,1.41-.24,1.18-1.88,1.39-3.91,1.33-6.03-.02-.56-.39-.79-.81-.62-1.66.66-3.26.34-4.91-.27ZM347.56-575.54c.42-1.64-.45-3.35.85-4.69.27-.28.05-.59-.25-.81-2.29-1.7-.58-2.86.69-3.79,1.06-.78,2.43-1.14,4.13-1.89-2.75-.63-4.56-2.08-6.7-2.66-.74-.2-3.3-1.39-1.97,1.53.43.95-.08,1.58-.42,2.32-2.32,5.01-1.36,7.7,3.67,9.99ZM378.82-601.26c-.26,1.42.18,3.54-2.24,4.36-.54.19-.27.89.06,1.28.36.43,1.07,1.22,1.33.74,1.02-1.86,3.27-1.42,4.55-2.77,3.13-3.32,3.05-7.09,1.79-11.59-.97,3.4-.34,7.54-5.5,7.97ZM315.25-672.75c-.52.06-1.45-.19-1.95.72-.52.95.36,1.37.7,2.07.77,1.57,1.83,2.67,3.32,3.48.56.31.02,2.33,1.58,1.11,1.24-.97.65-1.76-.41-2.54-.77-.57-1.07-1.49-.77-2.46.66-2.1-.49-2.48-2.47-2.38ZM273.44-555.67c.18-.2.41-.33.48-.53.58-1.67,2.21-2.46,3.16-3.8.43-.62,1.57-1.05,1.08-2-.4-.78-1.07-1.55-2.11-1.56-1.05-.01-1.65.71-2.06,1.57-.63,1.34-.82,2.82-1.7,4.11-.56.81.28,1.64,1.15,2.21ZM273.56-552.36c-.31-1.4-.67-2.8-2.05-2.95-1.13-.12-1.44,1.06-1.57,2.14-.11.89-.43,1.76-.68,2.63-.35,1.18.62,1.62,1.28,2.16.59.47,1.17.05,1.44-.48.6-1.17,1.09-2.39,1.58-3.5ZM380.19-586.72c-1.55-1.87-3-3.09-5.35-2.93-2.24.15-1.81,2.26-2.7,3.4-.21.27-.41.62-.09.86.22.16.67.24.9.12,2.17-1.14,4.55-1.25,7.25-1.45ZM318.13-640.77c.05,1.15.23,2.91,1.39,2.68,1.21-.24,2.15-1.8,3.21-2.78-1.11-.53-.83-2.5-2.68-2.39-1.76.11-2.02,1.09-1.93,2.49ZM326.21-643.65c-.56-.69.76-2.32-.89-2.29-1.53.02-1.72,1.47-1.7,2.84.02,1.16.2,1.95,1.63,1.88,2.25-.12.41-1.65.96-2.43ZM311-661.47c1.07,1.08,2.06,1.82,2.4,3.09.16.61.93.79,1.47.4,1.17-.85.71-2.11.6-3.22-.06-.59-.87-1.27-1.2-.7-.87,1.52-1.88.06-3.27.43ZM271.06-545.25c-.31-.83.44-2.29-1.37-2.3-1.43,0-1.11,1.11-1.2,1.96-.14,1.3.53,2.21,1.71,2.27,1.4.07.51-1.23.86-1.93ZM310.75-665.25c-.52.16-1.51-.31-1.39.81.1.91.4,1.77,1.68,1.71.98-.05,1.6-.27,1.55-1.4-.06-1.3-1.01-1.04-1.83-1.11ZM303.82-661.42c-1.14-1.04-2.31-1.02-3.54-.46-.49.22-1.32.22-.84,1.1.26.48.9,1.25,1.31.73.81-1.01,2.15-.29,3.07-1.37ZM357.17-582.81c.27-1.06,2.22-.82,1.69-2.32-.18-.5-.82-1.07-1.41-.74-1.23.7-.69,1.86-.28,3.06ZM384.15-631.28c-.33-.69-.74-1.37-1.58-1.35-.98.02-.81.87-.8,1.49.01.72.32,1.39,1.15,1.23.63-.12,1.15-.61,1.23-1.37ZM260.83-497.88c-.07-.14-.13-.28-.2-.41-.11.07-.22.13-.32.21,0,0,.06.18.12.19.13.03.26,0,.4,0Z","M424.86-686.54v60.9h-3.48v-60.9h3.48Z","M482.28-625.64h-3.48v-12.62c-3.22,8-10.61,13.49-19.49,13.49-12.01,0-22.27-10.09-22.27-22.62s10.09-22.62,22.62-22.62,22.62,10.09,22.62,22.62v21.75ZM459.66-628.08c10.61,0,19.14-8.61,19.14-19.32s-8.53-19.32-19.14-19.32-19.14,8.61-19.14,19.32,8.53,19.32,19.14,19.32Z","M440.52-520.37c-12.53,0-22.62-10.09-22.62-22.62s10.09-22.62,22.62-22.62v3.31c-10.61,0-19.14,8.61-19.14,19.32s8.53,19.31,19.14,19.31v3.31Z","M494.46-521.24h-3.48v-12.62c-3.22,8-10.62,13.49-19.49,13.49-12.01,0-22.27-10.09-22.27-22.62s10.09-22.62,22.62-22.62,22.62,10.09,22.62,22.62v21.75ZM471.84-523.68c10.61,0,19.14-8.61,19.14-19.31s-8.53-19.32-19.14-19.32-19.14,8.61-19.14,19.32,8.53,19.31,19.14,19.31Z","M504.9-542.99c0-12.53,10.09-22.62,22.62-22.62s22.62,10.09,22.62,22.62-10.09,22.62-22.62,22.62c-8.53,0-15.92-5.57-19.14-13.57v30.1h-3.48v-39.15ZM508.38-542.21c.35,10.27,8.79,18.36,19.14,18.36s19.14-8.53,19.14-19.14-8.53-19.14-19.14-19.14-19.14,8.53-19.14,19.14v.78Z","M564.06-582.14c1.48,0,2.61,1.13,2.61,2.61s-1.13,2.61-2.61,2.61-2.61-1.13-2.61-2.61,1.13-2.61,2.61-2.61ZM565.8-564.74v43.5h-3.48v-43.5h3.48Z","M600.6-520.37c-12.53,0-22.62-10.09-22.62-22.62v-26.1h3.48v19.31h19.14v3.31h-19.14v3.48c0,10.61,8.53,19.14,19.14,19.14v3.48Z","M654.53-521.24h-3.48v-12.62c-3.22,8-10.62,13.49-19.49,13.49-12.01,0-22.27-10.09-22.27-22.62s10.09-22.62,22.62-22.62,22.62,10.09,22.62,22.62v21.75ZM631.91-523.68c10.61,0,19.14-8.61,19.14-19.31s-8.53-19.32-19.14-19.32-19.14,8.61-19.14,19.32,8.53,19.31,19.14,19.31Z","M671.06-582.14v60.9h-3.48v-60.9h3.48Z","M440.52-415.97c-12.53,0-22.62-10.09-22.62-22.62s10.09-22.62,22.62-22.62c8.53,0,15.92,5.66,19.14,13.66v-30.19h3.48v39.15c0,12.53-10.09,22.62-22.62,22.62ZM440.52-419.28c10.62,0,19.14-8.61,19.14-19.31s-8.53-19.32-19.14-19.32-19.14,8.61-19.14,19.32,8.53,19.31,19.14,19.31Z","M517.95-438.59c0,12.53-10.09,22.62-22.62,22.62s-22.62-10.09-22.62-22.62,10.09-22.62,22.62-22.62c11.31,0,20.71,8.27,22.36,19.14h-41.24c-.17,1.13-.26,2.35-.26,3.48,0,10.7,8.53,19.31,19.14,19.31s19.14-8.61,19.14-19.31h3.48ZM477.4-445.38h35.85c-2.7-7.31-9.74-12.53-17.92-12.53s-15.23,5.22-17.92,12.53Z","M533.61-477.74v60.9h-3.48v-60.9h3.48Z","M603.03-415.97c-12.53,0-22.62-10.09-22.62-22.62s10.09-22.62,22.62-22.62v3.31c-10.61,0-19.14,8.61-19.14,19.32s8.53,19.31,19.14,19.31v3.31Z","M616.95-477.74c1.48,0,2.61,1.13,2.61,2.61s-1.13,2.61-2.61,2.61-2.61-1.13-2.61-2.61,1.13-2.61,2.61-2.61ZM618.69-460.34v43.5h-3.48v-43.5h3.48Z","M676.11-438.59c0,12.53-10.09,22.62-22.62,22.62s-22.62-10.09-22.62-22.62,10.09-22.62,22.62-22.62c11.31,0,20.71,8.27,22.36,19.14h-41.24c-.17,1.13-.26,2.35-.26,3.48,0,10.7,8.53,19.31,19.14,19.31s19.14-8.61,19.14-19.31h3.48ZM635.57-445.38h35.85c-2.7-7.31-9.74-12.53-17.92-12.53s-15.23,5.22-17.92,12.53Z","M691.77-477.74v60.9h-3.48v-60.9h3.48Z","M726.57-461.21c12.53,0,22.62,10.09,22.62,22.62s-10.09,22.62-22.62,22.62-22.62-10.09-22.62-22.62,10.09-22.62,22.62-22.62ZM726.57-419.45c10.62,0,19.14-8.53,19.14-19.14s-8.53-19.14-19.14-19.14-19.14,8.53-19.14,19.14,8.53,19.14,19.14,19.14Z"];

  secs.forEach(mount);

  function mount(sec) {
    const stage = sec.querySelector(".avila__stage");
    const title = sec.querySelector(".avila__title");
    if (!stage || !title) return;
    // titular letra por letra (el texto real queda en aria-label)
    title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
    title.querySelectorAll(".l").forEach((l) => l.setAttribute("aria-hidden", "true"));
    (function split(node) {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach((ch) => {
            if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return; }
            const sp = document.createElement("span"); sp.className = "c"; sp.textContent = ch; frag.appendChild(sp);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) split(n);
      });
    })(title);

    let scene = null, W = 0, H = 0, timer = 0, inView = false;
    const canAnim = () => !!(window.gsap && window.ScrollTrigger) && !reduce.matches;
    const sync = () => scene && scene.run(inView && !document.hidden);
    const rebuild = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      const keep = scene ? scene.state() : null;
      if (scene) scene.destroy();
      const anim = canAnim(), scrub = anim && mqScrub.matches;
      sec.classList.toggle("is-scrub", scrub);
      W = stage.clientWidth; H = stage.clientHeight;
      scene = build(sec, stage, W, H, anim, scrub);
      scene.restore(keep);
      sync();
    };
    rebuild();
    // redimensionar o girar: se redibuja a la medida nueva y sigue en el mismo punto
    const later = () => { clearTimeout(timer); timer = setTimeout(() => { if (Math.abs(stage.clientWidth - W) > 1 || Math.abs(stage.clientHeight - H) > 1 || sec.classList.contains("is-scrub") !== (canAnim() && mqScrub.matches)) rebuild(); }, 160); };
    if ("ResizeObserver" in window) new ResizeObserver(later).observe(stage); else addEventListener("resize", later);
    [reduce, mqScrub].forEach((m) => m.addEventListener ? m.addEventListener("change", rebuild) : m.addListener(rebuild));
    // fuera de pantalla o con la pestaña oculta: todo en pausa
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { inView = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0 }).observe(stage);
    else inView = true;
    document.addEventListener("visibilitychange", sync);
    sec.avila = { seek: (p) => scene && scene.seek(p), get scene() { return scene; } };
  }

  function build(sec, stage, W, H, anim, scrub) {
    const gs = anim ? window.gsap : null;
    const R = rng(11), rnd = (a, b) => a + R() * (b - a);

    // ---------- medidas (unidades nominales; s = px por unidad) ----------
    const v = W / H < .85;                       // vertical: composición propia, no el horizontal encogido
    let Wn, Hn, s;
    if (v) { Hn = Math.max(760, H / W * 390); s = H / Hn; Wn = W / s; }
    else { Hn = 900; s = H / 900; Wn = W / s; if (Wn < 1150) { Wn = 1150; s = W / Wn; Hn = H / s; } }
    const q = v ? .7 : 1;
    const G = Hn - (v ? 150 : 140);              // línea de terreno
    const FY = v ? 126 : 0;                      // al final la cámara sube el terreno para dejar sitio al titular (vertical)
    const PAN2 = Math.round(Wn * (v ? 1.5 : 1.16)); // segundo recorrido hacia la derecha (el primero se mide más abajo)
    const DOWN = v ? 380 : Math.round(Hn * .62);  // descenso al subsuelo: el metro va hondo
    const AX = Wn * (v ? .5 : .62), KZ = v ? 1.1 : 1.08;  // eje y factor del acercamiento final
    const PXB = .24, PYB = .3;                    // el Ávila está lejos: se mueve menos que la ciudad
    const bw = v ? 40 : 72, dx = v ? 20 : 34, dy = v ? 10 : 17, fh = v ? 30 : 44;
    const nF = clamp(Math.floor((G - 96 - 82 * q) / fh), 6, v ? 12 : 11);
    const ft = v ? clamp(Wn * .133, 46, 66) : clamp(Wn * .06, 60, 96);
    const padL = v ? 20 : 80;
    const bx = v ? Math.round((Wn - 3 * bw - 2 * dx) / 2 - 14) : Math.round(Wn * .42);
    const xR = bx + 3 * bw, Dx = 2 * dx, Dy = 2 * dy, bR = xR + Dx;
    const top = G - nF * fh;
    const cx = bR + (v ? 30 : 46);               // eje de la grúa 1
    const X = (i) => bx + i * bw, Y = (k) => G - k * fh;
    // en pantallas muy bajas (teléfono girado) trazo y rótulos bajan con la escala para no encimarse
    const sw = (v ? 1 : 1.08) * clamp(s / .6, .72, 1) / s, fs = (v ? 9 : 10.5) * clamp(s / .72, .6, 1) / s;
    // conector entre torres: estación → casitas → plaza del obelisco → Esfera → valla
    const STW = (v ? 118 : 238) * q, zS = (v ? Wn + 26 : cx + 178) + STW + 46 * q, zMini = v ? 90 : 300, zPlaza = v ? 280 : 610, zEsf = v ? 190 : 340, qP = q * (v ? 1.2 : 1.5);
    const PAN = Math.round(Math.max(Wn * (v ? 2.2 : 1.6), zS + zMini + 40 + zPlaza + zEsf + (v ? 236 : 46 - Wn * .06)));
    const WX = PAN + Wn, WX2 = PAN + PAN2 + Wn;
    const cmA = zS + zMini + 40 + zPlaza * .5 - AX, cmB = Math.min(PAN - 60, zS + zMini + 40 + zPlaza + zEsf * .5 - AX);   // donde se detiene la cámara  // borde derecho de la escena 2 y del mundo
    const MG = 26 / s;                           // margen para el paralaje del cursor

    sec.dataset.comp = v ? "v" : "h";
    const css = stage.style;
    css.setProperty("--u", s + "px"); css.setProperty("--pl", padL * s + "px"); css.setProperty("--gy", (G - FY) * s + "px");
    css.setProperty("--ft", f(ft)); css.setProperty("--sw", sw + "px"); css.setProperty("--fs", fs + "px");

    // ---------- lápiz: rectas que se pasan de la esquina y se comban apenas ----------
    const pen = () => {
      let d = "", max = 0;
      const P = {
        l(x1, y1, x2, y2, o, w) {
          const ex = x2 - x1, ey = y2 - y1, L = Math.hypot(ex, ey) || 1, ux = ex / L, uy = ey / L;
          o = (o == null ? 2.2 : o) * q; w = (w == null ? Math.min(.6, .1 + L * .0026) : w) * q;
          const a = o * (.35 + R() * .8), b = o * (.35 + R() * .8), m = (R() - .5) * 4 * w, t = .35 + R() * .3;
          d += `M${f(x1 - ux * a)} ${f(y1 - uy * a)}Q${f(x1 + ex * t - uy * m)} ${f(y1 + ey * t + ux * m)} ${f(x2 + ux * b)} ${f(y2 + uy * b)}`;
          max = Math.max(max, L + a + b + 2); return P;
        },
        p(a, b, o, w) { return P.l(a[0], a[1], b[0], b[1], o, w); },
        box(pts, o) { pts.forEach((p, i) => { const n = pts[(i + 1) % pts.length]; P.l(p[0], p[1], n[0], n[1], o); }); return P; },
        c(pts, close) { // trazo continuo
          let L = 0; d += `M${f(pts[0][0])} ${f(pts[0][1])}`;
          for (let i = 1; i < pts.length + (close ? 1 : 0); i++) {
            const a = pts[i - 1], b = pts[i % pts.length], ex = b[0] - a[0], ey = b[1] - a[1], len = Math.hypot(ex, ey) || 1;
            const m = (R() - .5) * 2 * Math.min(.5, len * .012) * q;
            d += `Q${f(a[0] + ex * .5 - ey / len * m)} ${f(a[1] + ey * .5 + ex / len * m)} ${f(b[0])} ${f(b[1])}`; L += len;
          }
          max = Math.max(max, L + 2); return P;
        },
        o(x, y, r) { // círculo de un solo gesto, que no cierra exacto
          const a = rnd(-.6, .6), c = Math.cos(a), sn = Math.sin(a);
          d += `M${f(x + r * c)} ${f(y + r * sn)}A${f(r)} ${f(r)} 0 1 1 ${f(x - r * c)} ${f(y - r * sn)}A${f(r)} ${f(r)} 0 1 1 ${f(x + r * Math.cos(a + .3))} ${f(y + r * Math.sin(a + .3))}`;
          max = Math.max(max, 6.6 * r + 3); return P;
        },
        raw(str, len) { d += str; max = Math.max(max, len); return P; },
        get d() { return d; }, get len() { return max; },
      };
      return P;
    };
    const S = (parent, p, cls, glow) => {
      const L = Math.ceil(p.len * 1.04 + 2);
      if (glow) {
        const g = E("g", {}, parent), a = E("path", { d: p.d, class: cls + " av-glow" }, g), b = E("path", { d: p.d, class: cls }, g);
        a._L = b._L = L; return g;
      }
      const e = E("path", { d: p.d, class: cls || "" }, parent); e._L = L; return e;
    };
    const T = (parent, x, y, str, anchor, cls) => { const t = E("text", { x: f(x), y: f(y), "text-anchor": anchor || "start", class: cls || "" }, parent); t.textContent = str; return t; };
    const paths = (e) => e.tagName === "path" ? [e] : [...e.querySelectorAll("path")].filter((p) => p._L);
    const poly = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
    const up = (p, z) => [p[0], p[1] - z];
    const seg2 = (pn, a, b) => pn.l(a[0], a[1], b[0], b[1], 0, 0);
    const circ = (x, y, r) => `M${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 1 ${f(x + r)} ${f(y)}`;
    const bil = (c, a, b) => { const tx0 = c[0][0] + (c[1][0] - c[0][0]) * a, ty0 = c[0][1] + (c[1][1] - c[0][1]) * a, bx0 = c[3][0] + (c[2][0] - c[3][0]) * a, by0 = c[3][1] + (c[2][1] - c[3][1]) * a; return [tx0 + (bx0 - tx0) * b, ty0 + (by0 - ty0) * b]; };

    // ---------- animación: si no hay línea de tiempo (estático) cada pieza queda en su estado final ----------
    const draw = (tl, e, at, dur, ease) => {
      if (!tl) return;
      const ps = paths(e); ps.forEach((p) => { p.style.strokeDasharray = p._L; p.style.strokeDashoffset = p._L; });
      tl.to(ps, { strokeDashoffset: 0, duration: dur || .5, ease: ease || "power2.inOut" }, at);
    };
    const erase = (tl, e, at, dur) => {
      if (!tl) { e.remove(); return; }
      tl.fromTo(paths(e), { strokeDashoffset: 0 }, { strokeDashoffset: (i, t) => t._L, duration: dur || .4, ease: "power2.in", immediateRender: false }, at);
    };
    const show = (tl, e, at, dur, to) => { if (!tl) return; e.style.opacity = 0; tl.to(e, { opacity: to || 1, duration: dur || .35, ease: "none" }, at); };
    const hide = (tl, e, at, dur) => { if (!tl) { e.remove(); return; } tl.fromTo(e, { opacity: 1 }, { opacity: 0, duration: dur || .4, ease: "none", immediateRender: false }, at); };

    // ---------- capas ----------
    const copy = sec.querySelector(".avila__copy"), hud = sec.querySelector(".avila__hud"), pct = sec.querySelector(".avila__pct b");
    const tEl = sec.querySelector(".avila__title"), sign = sec.querySelector(".avila__sign"), chars = [...tEl.querySelectorAll(".c")];
    const made = [];
    const world = document.createElement("div"); world.className = "avila__world"; world.setAttribute("aria-hidden", "false"); stage.insertBefore(world, hud || copy); made.push(world);
    const mkSvg = (cls) => { const e = E("svg", { class: "avila__svg " + cls, viewBox: `${f(-MG)} ${f(-MG)} ${f(Wn + 2 * MG)} ${f(Hn + 2 * MG)}`, preserveAspectRatio: "none", focusable: "false" }); world.appendChild(e); made.push(e); return e; };
    const mkDiv = (cls, flat) => { const e = document.createElement("div"); e.className = cls; e.setAttribute("aria-hidden", "true"); if (flat) stage.insertBefore(e, hud || copy); else world.appendChild(e); made.push(e); return e; };
    // de atrás hacia adelante: Ávila · cielo fijo · vida del Ávila · tren · ciudad · vida al frente
    const svgB = mkSvg("avila__svg--back"), lifeS = mkDiv("avila__life"), lifeB = mkDiv("avila__life avila__life--cam"), lifeM = mkDiv("avila__life avila__life--cam"),
      svgF = mkSvg("avila__svg--front"), lifeF = mkDiv("avila__life avila__life--cam"), lifeT = mkDiv("avila__life"), lifeX = mkDiv("avila__life avila__life--cam"), FS = 1.7;
    const uid = "av" + Math.round(R() * 1e6);
    svgB.setAttribute("role", "img"); svgB.setAttribute("aria-labelledby", uid + "t " + uid + "d");
    E("title", { id: uid + "t" }, svgB).textContent = sec.dataset.title || "";
    E("desc", { id: uid + "d" }, svgB).textContent = sec.dataset.desc || "";
    svgF.setAttribute("aria-hidden", "true");
    const camB = E("g", {}, svgB), camF = E("g", {}, svgF), L = {};
    ["avila", "tele"].forEach((n) => { L[n] = E("g", { class: "av-" + n }, camB); });
    E("path", { class: "av-occ", d: `M-400 ${f(G)}H${f(WX2 + 600)}V${f(G + DOWN + Hn * 2)}H-400Z` }, camF);   // el terreno es opaco
    ["via", "ctx", "occ", "terreno", "ejes", "obra", "fachada", "luz", "andamio", "techo", "b2", "b2top", "valla", "sub", "grua", "cotas", "gente"].forEach((n) => { L[n] = E("g", { class: "av-" + n }, camF); });

    const sprite = (layer, w, h, cls) => E("svg", { class: "avila__sp " + (cls || ""), viewBox: `0 0 ${f(w)} ${f(h)}`, width: f(w * s), height: f(h * s), "aria-hidden": "true", focusable: "false" }, layer);
    const place = (e, x, y) => { e._x = x * s; e._y = y * s; if (gs) gs.set(e, { x: e._x, y: e._y }); else e.style.transform = `translate(${f(e._x)}px,${f(e._y)}px)`; };

    const tlI = gs ? gs.timeline({ paused: true }) : null;   // entrada: el Ávila se dibuja solo
    const tlM = gs ? gs.timeline({ paused: true }) : null;   // maestro: el recorrido
    const amb = [], life = [];                                // loops: ambiente (desde que anochece) y final

    // =====================================================================
    // TIEMPOS DEL RECORRIDO
    // =====================================================================
    const tm = { D: 1 };
    tm.plan = 1.85; tm.crane = 3.2; tm.f0 = 4.8;
    tm.top = tm.f0 + nF * tm.D; tm.leave = tm.top + .6; tm.clean = tm.leave + 1.7; tm.light = tm.clean + .5;
    // paseo: tramo A → parada en la plaza → tramo B → parada en la Esfera → tramo C hasta la valla
    tm.pan = tm.light + 2.3; tm.pA = 3; tm.hA = 4.2; tm.pB = 2.2; tm.hB = 3.2; tm.pC = 3.2; tm.panD = tm.pA + tm.hA + tm.pB + tm.hB + tm.pC;
    tm.tA = tm.pan + tm.pA; tm.tB = tm.tA + tm.hA + tm.pB; tm.tC = tm.tB + tm.hB;
    const NF2 = 16, d2 = .62;
    tm.b0 = tm.pan + tm.panD + .5; tm.crane2 = tm.b0 + .9; tm.f2 = tm.b0 + 2.4;
    tm.top2 = tm.f2 + NF2 * d2; tm.leave2 = tm.top2 + .5; tm.clean2 = tm.leave2 + 1.6; tm.light2 = tm.clean2 + .3;
    tm.down = tm.light2 + 1.5; tm.downD = 3.4; tm.under = tm.down + tm.downD + .5; tm.underD = 4.8; tm.hS = 3; tm.rise = tm.under + tm.underD + tm.hS; tm.riseD = 3.2;   // parada en la estación antes de subir
    const NF3 = 15, d3 = .5;
    tm.b3 = tm.rise + .5; tm.crane3 = tm.b3 + .5; tm.f3 = tm.b3 + 2.1; tm.top3 = tm.f3 + NF3 * d3; tm.logo = tm.top3 + .3;
    tm.leave3 = tm.logo + 2.3; tm.clean3 = tm.leave3 + 1.5; tm.zoom = tm.clean3 + .5; tm.zoomD = 4; tm.light3 = tm.zoom;   // «zoom» = el descenso final por la torre
    tm.title = tm.zoom + tm.zoomD - .5; tm.sign = tm.title + .95; tm.end = tm.sign + 1.5;

    // =====================================================================
    // CÁMARA — baja del Ávila a la obra, corre a la derecha y termina en el subsuelo
    // =====================================================================
    const cam = { x: 0, y: 0, z: gs ? 1 : 0, k: 1, ay: G }, par = { x: 0, y: 0 }, cull = [];
    let fcx = 0, fcy = 0, lifeBT = "", lifeFT = "";   // foco del acercamiento inicial (La Silla)
    // el cursor mueve las capas a distinta velocidad: profundidad sin repintar el dibujo
    const applyLife = () => {
      const px = par.x, py = par.y, PP = 1400, zc = (z) => `translateZ(${z}px) scale(${((PP - z) / PP).toFixed(4)})`;
      const zo = (z) => `translateZ(${z}px) translate(${f(W / 2)}px,${f(H / 2)}px) scale(${((PP - z) / PP).toFixed(4)}) translate(${f(-W / 2)}px,${f(-H / 2)}px)`;   // para capas con origen 0 0
      world.style.transform = `rotateX(${(-py * 1.5).toFixed(3)}deg) rotateY(${(px * 2.1).toFixed(3)}deg)`;
      svgB.style.transform = zc(-260); lifeS.style.transform = zc(-380); svgF.style.transform = zc(0); lifeT.style.transform = zc(50);
      lifeB.style.transform = zo(-260) + " " + lifeBT; lifeM.style.transform = lifeF.style.transform = lifeFT;
      lifeX.style.transform = zo(130) + ` translate3d(${f(-cam.x * FS * s)}px,${f(-cam.y * FS * s)}px,0)`;
    };
    const applyCam = () => {
      const k = cam.k, kz = 1 + cam.z * .5, kb = 1 + (k - 1) * .3, bxp = -cam.x * PXB, byp = -cam.y * PYB, zin = cam.z > 0;
      const btx = zin ? bxp + cam.z * (Wn * .56 - fcx) + fcx * (1 - kz) : bxp + AX * (1 - kb), bty = zin ? byp + cam.z * (Hn * .47 - fcy) + fcy * (1 - kz) : byp + cam.ay * (1 - kb), bk = zin ? kz : kb;
      const ftx = AX * (1 - k) - cam.x * k, fty = cam.ay * (1 - k) - cam.y * k + cam.z * Hn * .6;
      camB.setAttribute("transform", `translate(${f(btx)} ${f(bty)}) scale(${bk.toFixed(4)})`);
      camF.setAttribute("transform", `translate(${f(ftx)} ${f(fty)}) scale(${k.toFixed(4)})`);
      lifeBT = `translate3d(${f(btx * s)}px,${f(bty * s)}px,0) scale(${bk.toFixed(4)})`; lifeFT = `translate3d(${f(ftx * s)}px,${f(fty * s)}px,0) scale(${k.toFixed(4)})`;
      // recorte por cámara: cada grupo del dibujo conoce su caja; si queda fuera del cuadro deja de pintarse
      if (cull.length) { const x0 = -ftx / k - 70, x1 = (Wn - ftx) / k + 70, y0 = -fty / k - 70, y1 = (Hn - fty) / k + 70; for (const c of cull) { const vis = c[2] > x0 && c[1] < x1 && c[4] > y0 && c[3] < y1; if (vis !== c[5]) { c[5] = vis; c[0].style.display = vis ? "" : "none"; } } }
      lifeT.style.opacity = cam.y > 50 ? 0 : 1;
      applyLife();
    };

    // =====================================================================
    // 1 · EL ÁVILA — una sola línea continua con el Humboldt arriba, y curvas de nivel debajo
    // =====================================================================
    const anchors = v ? [[.17, 0], [.262, bx * .5], [.285, bx * .5 + 30 * q], [.31, bx + 6], [.65, bR], [.86, Wn]] : [[0, 0], [.27, bx * .56], [.47, bx], [.65, bR], [1, Wn]];
    const nA = anchors.length - 1, t0 = anchors[0][0], tE = anchors[nA][0], tMax = tE + (PXB * (PAN + PAN2) + 120) / (Wn * (v ? 1.6 : .9));
    const mapX = (t) => {
      if (t > tE) return Wn + (t - tE) * Wn * (v ? 1.6 : .9);
      for (let i = 0; i < nA; i++) if (t <= anchors[i + 1][0] || i === nA - 1) { const a = anchors[i], b = anchors[i + 1]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); }
    };
    const hLow = v ? nF * fh * .66 : 400, ka = v ? clamp((G - hLow - 128) / 162, .5, 1.6) : 1.12;
    const hAt = (t) => { for (let i = 0; i < RIDGE.length - 1; i++) if (t <= RIDGE[i + 1][0]) { const a = RIDGE[i], b = RIDGE[i + 1]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); } return RIDGE[RIDGE.length - 1][1]; };
    const ry = (h) => G - (hLow + (h - 400) * ka);
    const rp = (t) => [mapX(t), ry(v && t > .3 && t < .6 ? Math.max(hAt(t), 436) : hAt(t))];
    const ts = [t0].concat(RIDGE.map((p) => p[0]).filter((t) => t > t0 && t < tMax), [tMax]);
    const jit = (p) => [p[0], p[1] + (R() - .5) * 3 * q];
    const A = ts.filter((t) => t <= .262).map((t) => jit(rp(t))), B = ts.filter((t) => t >= .285).map((t) => jit(rp(t)));
    A[0][0] = -6;
    const cr = (pts, k) => { let d = ""; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += `C${f(p1[0] + (p2[0] - p0[0]) / 6 * k)} ${f(p1[1] + (p2[1] - p0[1]) / 6 * k)} ${f(p2[0] - (p3[0] - p1[0]) / 6 * k)} ${f(p2[1] - (p3[1] - p1[1]) / 6 * k)} ${f(p2[0])} ${f(p2[1])}`; } return d; };
    const hs = A[A.length - 1], hx = hs[0], hy = hs[1];           // cumbre del Pico El Ávila: aquí va el hotel
    B[0][0] = Math.min(Math.max(B[0][0], hx + 50 * q), (B[1] ? B[1][0] : 1e9) - 8 * q); B[0][1] = hy + 1;
    // torre cilíndrica robusta (ancho ≈ un tercio del alto) sobre el cuerpo bajo de bóvedas
    const hw = B[0][0] - hx, tw = 19 * q, tx = hx + 5 * q, th = 62 * q, pb = 7 * q, vx1 = tx + tw + 2 * q, vw2 = (B[0][0] - 1.5 * q - vx1) / 3;
    const hotel = `L${f(hx)} ${f(hy - pb)}L${f(tx)} ${f(hy - pb)}L${f(tx)} ${f(hy - th)}Q${f(tx + tw / 2)} ${f(hy - th - 3 * q)} ${f(tx + tw)} ${f(hy - th)}L${f(tx + tw)} ${f(hy - pb)}L${f(vx1)} ${f(hy - pb)}` +
      [0, 1, 2].map((i) => `Q${f(vx1 + vw2 * (i + .5))} ${f(hy - pb - 9 * q)} ${f(vx1 + vw2 * (i + 1))} ${f(hy - pb)}`).join("") + `L${f(B[0][0])} ${f(hy - pb)}L${f(B[0][0])} ${f(B[0][1])}`;
    const ridge = E("path", { class: "av-g av-r", d: `M${f(A[0][0])} ${f(A[0][1])}` + cr(A, .34) + hotel + cr(B, .34) }, L.avila);
    ridge._L = Math.ceil(ridge.getTotalLength() + 4);
    const all = A.concat(B), XB = all[all.length - 1][0];
    const ridgeAt = (x) => { for (let i = 0; i < all.length - 1; i++) if (x <= all[i + 1][0]) { const a = all[i], b = all[i + 1]; return a[1] + (b[1] - a[1]) * clamp((x - a[0]) / ((b[0] - a[0]) || 1), 0, 1); } return all[all.length - 1][1]; };
    const silla = rp(.76); fcx = silla[0]; fcy = ry(520);
    // curvas de nivel: la montaña leída como plano topográfico, cada vez más tenues hacia la falda
    const KC = 5, baseY = ry(400) + (v ? 96 : 160), contours = [], cFn = [];
    for (let k = 1; k <= KC; k++) {
      const u = Math.pow(k / (KC + .5), 1.12), pts = [], step = v ? 30 : 52, ph = R() * 6;
      for (let x = -6; x <= XB + step; x += step) { const r0 = ridgeAt(x); pts.push([x, r0 + (baseY - r0) * u + Math.sin(x / (38 + k * 9) + ph) * (3 + k) * q + (R() - .5) * 5 * q]); }
      if (k >= 4) { const e = E("path", { class: "av-g av-t", d: `M${f(pts[0][0])} ${f(pts[0][1])}` + cr(pts, 1) }, L.avila); e._L = Math.ceil(e.getTotalLength() + 4); e.style.opacity = f(.5 - (k - 4) * .16); contours.push(e); }
      cFn.push((x) => { for (let i = 0; i < pts.length - 1; i++) if (x <= pts[i + 1][0]) { const a = pts[i], b = pts[i + 1]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return pts[pts.length - 1][1]; });
    }
    const footAt = cFn[KC - 1];
    // filas y quebradas: de cada cumbre y cada hombro baja una fila hacia la ciudad; su cara este va rayada, en sombra
    const slopes = E("g", {}, L.avila), hsh = pen(), hk = v ? .62 : 1;
    all.forEach((p0, i) => {
      if (i < 1 || i > all.length - 2) return;
      const peak = p0[1] < all[i - 1][1] && p0[1] < all[i + 1][1]; if (!peak && (v ? i % 4 : i % 2)) return;   // en vertical, menos filas: la montaña va comprimida
      const x0 = p0[0], y0 = p0[1] + 2 * q, Ls = (baseY - y0) * (peak ? rnd(.82, .98) : rnd(.45, .72)) * (v ? .62 : 1), dxs = Ls * (rnd(-.14, .14) + (i % 4 < 2 ? .2 : -.16)), n = Math.round(clamp(Ls / (17 * q), 3, 11));
      if (Math.abs(x0 - (tx + tw / 2)) < 14 * q) return;
      const at = (u2) => { const m = 1 - u2; return [x0 + 3 * m * m * u2 * dxs * .08 + 3 * m * u2 * u2 * dxs * .66 + u2 * u2 * u2 * dxs, y0 + 3 * m * m * u2 * Ls * .36 + 3 * m * u2 * u2 * Ls * .62 + u2 * u2 * u2 * Ls]; };
      S(slopes, pen().raw(`M${f(x0)} ${f(y0)}C${f(x0 + dxs * .08)} ${f(y0 + Ls * .36)} ${f(x0 + dxs * .66)} ${f(y0 + Ls * .62)} ${f(x0 + dxs)} ${f(y0 + Ls)}`, Ls * 1.15), "av-g av-t");
      for (let j2 = 1; j2 <= n; j2++) { const u2 = j2 / (n + 1.4), a = at(u2), ln = (16 - 9 * u2) * q * hk * (peak ? 1.2 : .9); hsh.raw(`M${f(a[0] + 1.6 * q)} ${f(a[1])}L${f(a[0] + ln)} ${f(a[1] + ln * .62)}`, ln * 1.2); }
    });
    const hshE = S(L.avila, hsh, "av-g av-t"); hshE.style.opacity = .4;
    // bruma al pie: la montaña se separa de la ciudad con unas pocas líneas largas
    const mist = pen(); [[-8, .22, 0], [.3, .58, 9], [.5, .86, -5], [.74, 1.02, 14], [.1, .4, 22]].forEach((m) => mist.c([[XB * m[0], baseY + (m[2] + 10) * q], [XB * (m[0] + m[1]) / 2, baseY + (m[2] + 11) * q], [XB * m[1], baseY + (m[2] + 10) * q]]));
    const mistE = S(L.avila, mist, "av-g av-t"); mistE.style.opacity = .28;
    if (tlI) { tlI.fromTo(hshE, { opacity: 0 }, { opacity: .4, duration: 1, ease: "none" }, 2.6); draw(tlI, mistE, 2.2, 1.6, "power1.inOut"); }
    // Hotel Humboldt: anillos de balcón curvados (se ve desde abajo), montantes, tambor de remate con antena y bóvedas del cuerpo bajo
    const hb = pen(), nRg = 13;
    for (let i = 1; i <= nRg; i++) { const y = hy - pb - (th - pb) * i / (nRg + 1); hb.raw(`M${f(tx)} ${f(y)}Q${f(tx + tw / 2)} ${f(y - 2.6 * q)} ${f(tx + tw)} ${f(y)}`, tw * 1.1); }
    [.2, .5, .8].forEach((u) => hb.l(tx + tw * u, hy - pb, tx + tw * u, hy - th - (u === .5 ? 2.2 : 1.2) * q, 0, 0));
    hb.raw(`M${f(tx + tw * .28)} ${f(hy - th - 2 * q)}V${f(hy - th - 7 * q)}Q${f(tx + tw / 2)} ${f(hy - th - 9 * q)} ${f(tx + tw * .72)} ${f(hy - th - 7 * q)}V${f(hy - th - 2 * q)}`, tw * 1.4)
      .l(tx + tw / 2, hy - th - 8 * q, tx + tw / 2, hy - th - 20 * q, 0, 0).l(tx + tw / 2 - 2.4 * q, hy - th - 14 * q, tx + tw / 2 + 2.4 * q, hy - th - 14 * q, 0, 0);
    [0, 1, 2].forEach((i) => { const x0 = vx1 + vw2 * i; hb.l(x0 + vw2 * .5, hy - pb - 4.4 * q, x0 + vw2 * .5, hy, 0, 0).l(x0 + vw2 * .22, hy - pb * .75, x0 + vw2 * .22, hy - 1, 0, 0).l(x0 + vw2 * .78, hy - pb * .75, x0 + vw2 * .78, hy - 1, 0, 0); });
    hb.l(hx + 1.2 * q, hy - pb * .5, tx - 1 * q, hy - pb * .5, 0, 0);
    [.305, .33].forEach((t, i) => { const a = rp(t), hh = (i ? 13 : 18) * q; hb.l(a[0], a[1], a[0], a[1] - hh, 0, 0).l(a[0] - 2.4 * q, a[1], a[0], a[1] - hh * .7, 0, 0).l(a[0] + 2.4 * q, a[1], a[0], a[1] - hh * .7, 0, 0).l(a[0] - 1.6 * q, a[1] - hh * .45, a[0] + 1.6 * q, a[1] - hh * .45, 0, 0); });
    const hotelD = S(L.avila, hb, "av-g av-t");
    draw(tlI, ridge, .1, 2.6, "power1.inOut");
    if (tlI) {
      contours.forEach((e, i) => draw(tlI, e, 1.1 + i * .28, 1.7, "power1.inOut"));
      paths(slopes).forEach((p, i) => draw(tlI, p, 1.9 + i * .06, .45)); draw(tlI, hotelD, 2.3, .4);
      tlI.fromTo(hud, { opacity: 0 }, { opacity: 1, duration: .5, ease: "none" }, .2);
    }
    if (tlM) {
      // el Ávila baja de intensidad mientras se trabaja el plano y vuelve cuando la obra cierra
      [[tm.plan, tm.leave + 1.5], [tm.b0 + .4, tm.leave2 + 1.2]].forEach((w) => { tlM.to(L.avila, { opacity: .42, duration: .8, ease: "none" }, w[0]); tlM.to(L.avila, { opacity: 1, duration: .9, ease: "none" }, w[1]); });
      tlM.to(cam, { z: 0, duration: 1.5, ease: "power2.inOut" }, 0);
    }

    // =====================================================================
    // 2 · TERRENO, CALLE Y VIADUCTO
    // =====================================================================
    const gpen = pen(); for (let x = -10; x < Wn + 10; x += Wn * .5) gpen.l(x, G + (R() - .5), Math.min(x + Wn * .5, Wn + 12), G + (R() - .5), 0, .8);
    draw(tlM, S(L.terreno, gpen, "av-r"), 1.2, .9, "power1.inOut");
    const g2 = S(L.terreno, pen().c([[Wn + 8, G], [Wn + PAN * .33, G + .5], [Wn + PAN * .66, G - .3], [WX, G], [WX + PAN2 * .5, G + .4], [WX2 + 40, G]]), "av-r");
    draw(tlM, g2, tm.pan - .1, tm.panD * 1.3, "sine.inOut");
    { const zb = pen(); [bR + 34 * q, PAN + Wn * (v ? .86 : .93), PAN + PAN2 + AX + (v ? 108 : 190)].forEach((x0) => { for (let i = 0; i < 6; i++) zb.l(x0 + i * 6 * q, G + 3 * q, x0 + i * 6 * q - 7 * q, G + 12 * q, 0, 0); }); draw(tlM, S(L.terreno, zb, "av-t av-dim"), tm.plan + .9, .6); }
    const hatch = pen();
    for (let x = bx - 70 * q; x < cx + 60 * q; x += 40 * q) for (let i = 0; i < 3; i++) hatch.l(x + i * 5 * q, G + 2 * q, x + i * 5 * q - 5 * q, G + 8 * q, 0, 0);
    draw(tlM, S(L.terreno, hatch, "av-m av-t"), 1.7, .5);
    const lampsOn = [];
    // estación elevada y viaducto: por aquí pasa el tren durante el paneo
    const vy = G - (v ? 48 : 72), stX = v ? Wn + 26 : cx + 178, stW = STW, via = pen(), st = pen(), vEnd = PAN + Wn + 30;   // la terminal queda entre la escena de la torre 2 y la final
    // ---------- estación elevada: pilas con capitel, tablero con viga de borde, andén bajo una bóveda ligera sobre columnas en Y,
    //            vestíbulo acristalado a nivel de calle, escalera de dos tramos con descanso y ascensor de vidrio ----------
    const stLights = []; let stPeople = null, boardUpd = null;
    {
      const X0 = stX, X1 = stX + stW, dq = q, dkB = vy + 9 * q, g = L.via, t0 = tm.plan + .6, sd = 12 * q, se = 6 * q;   // sd/se: fuga de la profundidad
      const occ = (pts) => E("path", { class: "av-occ", d: poly(pts) }, g), occD = (d) => E("path", { class: "av-occ", d }, g);
      // pilas: fuste ahusado, capitel en martillo y zapata
      const pr = pen(); [X0 + 26 * q, X1 - 26 * q].forEach((x) => { occ([[x - 5 * q, G], [x + 5 * q, G], [x + 4 * q, dkB + 10 * q], [x + 15 * q, dkB], [x - 15 * q, dkB], [x - 4 * q, dkB + 10 * q]]);
        pr.l(x - 5 * q, G, x - 4 * q, dkB + 10 * q, 0, .1).l(x + 5 * q, G, x + 4 * q, dkB + 10 * q, 0, .1).l(x - 4 * q, dkB + 10 * q, x - 15 * q, dkB, 0, 0).l(x + 4 * q, dkB + 10 * q, x + 15 * q, dkB, 0, 0).box([[x - 10 * q, G], [x + 10 * q, G], [x + 10 * q, G - 3 * q], [x - 10 * q, G - 3 * q]], 0); });
      draw(tlM, S(g, pr, ""), t0, .6, "power1.out");
      // tablero: losa del andén con su espesor en fuga y la viga de borde con goterón
      occ([[X0 - 4 * q, vy], [X1, vy], [X1, dkB], [X0 - 4 * q, dkB]]);
      const dk = pen().l(X0 - 4 * q, vy, X1, vy, 0, .2).l(X0 - 4 * q, vy + 2.6 * q, X1, vy + 2.6 * q, 0, .2).l(X0 - 4 * q, dkB, X1, dkB, 0, .2).l(X0 - 4 * q, vy, X0 - 4 * q, dkB, 0, 0).l(X0 - 4 * q, vy, X0 - 4 * q + sd, vy - se, 0, 0).l(X0 - 4 * q + sd, vy - se, X1, vy - se, 0, .2).l(X0, dkB + 1.6 * q, X1, dkB + 1.6 * q, 0, 0);
      for (let x = X0 + 8 * q; x < X1; x += 16 * q) dk.l(x, vy + 2.6 * q, x, dkB, 0, 0);
      draw(tlM, S(g, dk, ""), t0 + .3, .7);
      // andén: borde con franja táctil y vía con durmientes
      const an = pen().l(X0 + sd * .5, vy - se * .5, X1, vy - se * .5, 0, 0); for (let x = X0 + 10 * q; x < X1 - 3 * q; x += 5 * q) an.l(x, vy - se * .5 - .6 * q, x + 2.4 * q, vy - se * .5 - .6 * q, 0, 0);
      draw(tlM, S(g, an, "av-t av-dim"), t0 + .6, .5);
      // vestíbulo acristalado bajo el tablero, con puertas y marquesina
      const vx0 = X0 + 58 * q, vx1 = X0 + 112 * q, vh = 30 * q; occ([[vx0, G], [vx1, G], [vx1, G - vh], [vx0, G - vh]]);
      const vb = pen().box([[vx0, G], [vx1, G], [vx1, G - vh], [vx0, G - vh]], .4).l(vx0 - 2 * q, G - vh - 2.4 * q, vx1 + 2 * q, G - vh - 2.4 * q, 0, .1).l(vx0 - 2 * q, G - vh, vx0 - 2 * q, G - vh - 2.4 * q, 0, 0).l(vx1 + 2 * q, G - vh, vx1 + 2 * q, G - vh - 2.4 * q, 0, 0).l(vx0, G - vh * .72, vx1, G - vh * .72, 0, 0);
      for (let x = vx0 + 9 * q; x < vx1 - 2 * q; x += 9 * q) vb.l(x, G - vh, x, G, 0, 0);
      const dc = (vx0 + vx1) / 2; vb.box([[dc - 8 * q, G], [dc + 8 * q, G], [dc + 8 * q, G - 18 * q], [dc - 8 * q, G - 18 * q]], 0).l(dc, G, dc, G - 18 * q, 0, 0).l(dc - 14 * q, G - 20 * q, dc + 14 * q, G - 20 * q, 0, .1).l(dc - 14 * q, G - 20 * q, dc - 16 * q, G - 17 * q, 0, 0).l(dc + 14 * q, G - 20 * q, dc + 16 * q, G - 17 * q, 0, 0);
      draw(tlM, S(g, vb, "av-t"), t0 + .7, .8);
      // escalera de dos tramos con descanso, peldaños y pasamanos (sube de la calle al andén atravesando el tablero)
      const sx = X0 + 120 * q, rise = (G - vy) / 2, run = 30 * q, n = 9, stp = pen(), rail = pen(), occS = [];
      const flight = (xa, ya, dir) => { let x = xa, y = ya; const pts = [[x, y]]; for (let k = 0; k < n; k++) { y -= rise / n; pts.push([x, y]); x += dir * run / n; pts.push([x, y]); } stp.c(pts); stp.l(xa + dir * 2 * q, ya + 2.4 * q, x + dir * 2 * q, y + 2.4 * q, 0, 0); rail.l(xa, ya - 9 * q, x, y - 9 * q, 0, 0).l(xa, ya, xa, ya - 9 * q, 0, 0).l(x, y, x, y - 9 * q, 0, 0); occS.push([[xa, ya + 2.4 * q], [xa, ya], [x, y], [x, y + 2.4 * q]]); return [x, y]; };
      const m1 = flight(sx, G, 1); stp.l(m1[0], m1[1], m1[0] + 9 * q, m1[1], 0, 0).l(m1[0], m1[1] + 2.4 * q, m1[0] + 9 * q, m1[1] + 2.4 * q, 0, 0).l(m1[0] + 9 * q, m1[1], m1[0] + 9 * q, G, 0, 0);
      flight(m1[0] + 9 * q, m1[1], -1);
      draw(tlM, S(g, stp, "av-t"), t0 + 1, 1, "power1.inOut"); draw(tlM, S(g, rail, "av-t av-dim"), t0 + 1.4, .6);
      // ascensor de vidrio entre la pila y el vestíbulo
      const ex = X0 + 38 * q, ew = 13 * q, et = vy - 30 * q, ev = pen().box([[ex, G], [ex + ew, G], [ex + ew, et], [ex, et]], 0).l(ex, et + 3 * q, ex + ew, et + 3 * q, 0, 0).l(ex + 1.6 * q, et + 3 * q, ex + 1.6 * q, G, 0, 0).l(ex + ew - 1.6 * q, et + 3 * q, ex + ew - 1.6 * q, G, 0, 0);
      for (let y = G - 26 * q; y > et + 8 * q; y -= 26 * q) ev.l(ex, y, ex + ew, y, 0, 0);   // caja de vidrio: marco doble y pocos travesaños
      ev.box([[ex + 2.6 * q, G - 1 * q], [ex + ew - 2.6 * q, G - 1 * q], [ex + ew - 2.6 * q, G - 13 * q], [ex + 2.6 * q, G - 13 * q]], 0).l(ex + ew / 2, G - 13 * q, ex + ew / 2, et + 3 * q, 0, 0);   // cabina abajo y su cable
      draw(tlM, S(g, ev, "av-t"), t0 + 1.2, .7);
      // cubierta: bóveda rebajada con su espesor, nervios en fuga, sobre columnas en Y; vidrios cortavientos al fondo del andén
      const rb = vy - 34 * q, rk = 11 * q, ra = X0 - 8 * q, rz = X1 + 10 * q, arc = (dx2, dy2, off) => `M${f(ra + dx2)} ${f(rb + dy2 + off)}Q${f((ra + rz) / 2 + dx2)} ${f(rb - rk * 2 + dy2 + off)} ${f(rz + dx2)} ${f(rb + dy2 + off)}`;
      occD(arc(0, 0, 0) + `L${f(rz + sd)} ${f(rb - se)}Q${f((ra + rz) / 2 + sd)} ${f(rb - rk * 2 - se)} ${f(ra + sd)} ${f(rb - se)}Z`);
      const rf = pen().raw(arc(0, 0, 0), stW * 1.2).raw(arc(0, 0, 2.4 * q), stW * 1.2).raw(arc(sd, -se, 0), stW * 1.2).l(ra, rb, ra + sd, rb - se, 0, 0).l(rz, rb, rz + sd, rb - se, 0, 0).l(ra, rb, ra, rb + 2.4 * q, 0, 0).l(rz, rb, rz, rb + 2.4 * q, 0, 0);
      for (let k = 1; k < 12; k++) { const u2 = k / 12, x = ra + (rz - ra) * u2, y = rb - rk * 4 * u2 * (1 - u2); rf.l(x, y, x + sd, y - se, 0, 0); }
      const col = pen(); [X0 + 18 * q, (X0 + X1) / 2 + 6 * q, X1 - 6 * q].forEach((x) => { const yb = vy - se * .5, yr = rb + 2.4 * q + 1.2 * q, yk = yb - (yb - yr) * .58; col.l(x - .9 * q, yb, x - .9 * q, yk, 0, 0).l(x + .9 * q, yb, x + .9 * q, yk, 0, 0).l(x, yk, x - 9 * q, yr + rk * .3, 0, 0).l(x, yk, x + 9 * q, yr - rk * .2, 0, 0); });
      const gl = pen(); for (let x = X0 + sd + 6 * q; x < X1; x += 8 * q) gl.l(x, vy - se, x, vy - se - 22 * q, 0, 0); gl.l(X0 + sd, vy - se - 22 * q, X1, vy - se - 22 * q, 0, 0).l(X0 + sd, vy - se - 11 * q, X1, vy - se - 11 * q, 0, 0);
      draw(tlM, S(g, col, ""), t0 + 1.3, .6); draw(tlM, S(g, rf, ""), t0 + 1.6, .9, "power1.inOut"); const glE = S(g, gl, "av-t av-dim"); glE.style.opacity = .55; draw(tlM, glE, t0 + 1.9, .7);
      // cartel colgante con la M y luminarias bajo la bóveda (se encienden al anochecer)
      const cs = (X0 + X1) / 2 - 28 * q, cy2 = rb - 2 * q, sg = pen().l(cs + 4 * q, cy2, cs + 4 * q, cy2 + 5 * q, 0, 0).l(cs + 26 * q, cy2, cs + 26 * q, cy2 + 5 * q, 0, 0).box([[cs, cy2 + 5 * q], [cs + 30 * q, cy2 + 5 * q], [cs + 30 * q, cy2 + 12 * q], [cs, cy2 + 12 * q]], 0);
      for (let k = 0; k < 3; k++) sg.l(cs + 11 * q, cy2 + (7.4 + k * 1.8) * q, cs + 27 * q, cy2 + (7.4 + k * 1.8) * q, 0, 0);
      draw(tlM, S(g, sg, "av-t"), t0 + 2.2, .5); const mE = S(g, pen().raw(circ(cs + 5.6 * q, cy2 + 8.5 * q, 2.6 * q), 18 * q).raw(`M${f(cs + 4.2 * q)} ${f(cy2 + 9.8 * q)}V${f(cy2 + 7.2 * q)}L${f(cs + 5.6 * q)} ${f(cy2 + 8.8 * q)}L${f(cs + 7 * q)} ${f(cy2 + 7.2 * q)}V${f(cy2 + 9.8 * q)}`, 8 * q), "av-o", true); show(tlM, mE, t0 + 2.4, .3);
      const lt = pen(); for (let k = 1; k < 8; k++) { const u2 = k / 8, x = ra + (rz - ra) * u2, y = rb + 2.4 * q - rk * 4 * u2 * (1 - u2); if (Math.abs(x - (cs + 15 * q)) < 20 * q) continue; lt.l(x - 3 * q, y + 1.6 * q, x + 3 * q, y + 1.6 * q, 0, 0); [-2, 0, 2].forEach((o2) => lt.l(x + o2 * q, y + 2.6 * q, x + o2 * 1.8 * q, y + 7 * q, 0, 0)); }
      const ltE = S(g, lt, "av-h av-t", true); show(tlM, ltE, tm.clean + .5, .4); stLights.push(ltE);
      // acabados: franja naranja en la viga de borde, cumbrera con lucernario, bajantes, torniquetes y máquinas en el vestíbulo,
      // bancos en el andén, jardinera y aparcabicis en la calle
      const fx = pen().l(X0 - 4 * q, vy + 5.6 * q, X1, vy + 5.6 * q, 0, .1); S(g, fx, "av-o av-t", true); draw(tlM, g.lastChild, t0 + .9, .8);
      const ac = pen().raw(arc(sd * .5, -se * .5, 0), stW * 1.2);
      for (let k = 4; k < 21; k++) { const u2 = k / 24, x = ra + (rz - ra) * u2 + sd * .5, y = rb - se * .5 - rk * 4 * u2 * (1 - u2); ac.l(x, y, x + 1.6 * q, y - 2 * q, 0, 0); }
      [ra + 3 * q, rz - 3 * q].forEach((x) => ac.l(x, rb + 2.4 * q, x, vy - se * .5, 0, 0));
      for (let k = 0; k < 4; k++) { const x = vx0 + 5 * q + k * 5 * q; ac.box([[x, G], [x + 1.8 * q, G], [x + 1.8 * q, G - 8 * q], [x, G - 8 * q]], 0).l(x + 1.8 * q, G - 6 * q, x + 4 * q, G - 6 * q, 0, 0); }
      [vx1 - 14 * q, vx1 - 8 * q].forEach((x) => ac.box([[x, G], [x + 5 * q, G], [x + 5 * q, G - 14 * q], [x, G - 14 * q]], 0).box([[x + 1 * q, G - 12 * q], [x + 4 * q, G - 12 * q], [x + 4 * q, G - 9 * q], [x + 1 * q, G - 9 * q]], 0));
      [X0 + 98 * q, X0 + 176 * q].forEach((x) => ac.l(x, vy - se * .5 - 5 * q, x + 14 * q, vy - se * .5 - 5 * q, 0, 0).l(x + 1.4 * q, vy - se * .5 - 5 * q, x + 1.4 * q, vy - se * .5 - .6 * q, 0, 0).l(x + 12.6 * q, vy - se * .5 - 5 * q, x + 12.6 * q, vy - se * .5 - .6 * q, 0, 0));
      const pl = X0 + 166 * q; ac.box([[pl, G], [pl + 22 * q, G], [pl + 22 * q, G - 6 * q], [pl, G - 6 * q]], 0); [4, 11, 18].forEach((o) => ac.raw(circ(pl + o * q, G - 10 * q, 4 * q), 28 * q));
      for (let k = 0; k < 3; k++) ac.raw(`M${f(pl + 28 * q + k * 6 * q)} ${f(G)}v${f(-6 * q)}q${f(2.2 * q)} ${f(-3 * q)} ${f(4.4 * q)} 0v${f(6 * q)}`, 18 * q);
      draw(tlM, S(g, ac, "av-t"), t0 + 2, .9);
      // gente esperando en el andén y entrando al vestíbulo
      stPeople = () => { const pp = E("g", {}, g); [X0 + 70 * q, X0 + 76 * q, X1 - 50 * q].forEach((x, k) => mkFig(pp, x, vy - se * .5 - .6 * q, fh * (k === 1 ? .36 : .46), false)); mkFig(pp, dc + 12 * q, G, fh * .5, false); show(tlM, pp, t0 + 2.4, .4); };
    }
    via.c([[stX + stW, vy], [WX * .5, vy + .4], [WX, vy - .3], [vEnd, vy]]).c([[stX + stW, vy + 5 * q], [WX, vy + 5 * q + .3], [vEnd, vy + 5 * q]]);
    const viaE = S(L.via, via, "av-t");
    {
      const tx0 = vEnd, ts = pen().box([[tx0, vy + 5 * q], [tx0 + stW, vy + 5 * q], [tx0 + stW, vy - 22 * q], [tx0, vy - 22 * q]], 1.5).l(tx0 - 12 * q, vy - 27 * q, tx0 + stW + 9 * q, vy - 22 * q, 0, .3).l(tx0 - 12 * q, vy - 30 * q, tx0 + stW + 9 * q, vy - 25 * q, 0, .3).l(tx0 + 12 * q, vy + 5 * q, tx0 + 12 * q, G, 0, .2).l(tx0 + stW - 12 * q, vy + 5 * q, tx0 + stW - 12 * q, G, 0, .2);
      [.12, .34, .56, .78].forEach((u) => ts.l(tx0 + stW * u, vy - 18 * q, tx0 + stW * u, vy + 1, 0, 0));
      draw(tlM, S(L.via, ts, "av-t"), tm.under + .4, .9);
    }
    const pierEls = [];
    for (let x = stX + stW + 70 * q; x < vEnd - 30 * q; x += 150 * q) pierEls.push([x, S(L.via, pen().l(x - 4 * q, vy + 5 * q, x - 3 * q, G, 0, .3).l(x + 4 * q, vy + 5 * q, x + 3 * q, G, 0, .3).l(x - 9 * q, vy + 5 * q, x + 9 * q, vy + 5 * q, 0, 0).l(x - 9 * q, vy + 8 * q, x + 9 * q, vy + 8 * q, 0, 0).l(x - 6 * q, G, x + 6 * q, G, 0, 0), "av-t av-dim")]);
    // =====================================================================
    // 3 · TORRE 1 — planta, ejes, cotas, estructura, andamios, fachada y luces
    // =====================================================================
    const lights = [];
    const mkLight = (c, parent) => {
      const ctr = bil(c, .5, .5), inn = c.map((p) => { const ex = ctr[0] - p[0], ey = ctr[1] - p[1], l = Math.hypot(ex, ey) || 1; return [p[0] + ex / l * 2.4 * q, p[1] + ey / l * 2.4 * q]; });
      const m = E("g", {}, parent), inner = E("g", {}, m), hot = R() < .3 ? "av-h" : "av-o";
      S(inner, pen().c(inn, true), hot, true);
      const hp = pen(); [.2, .45, .7].forEach((u) => { const p1 = bil(inn, u, 1), p2 = bil(inn, u + .22, 0); hp.l(p1[0], p1[1], p2[0], p2[1], 0, 0); });
      S(inner, hp, hot + " av-t");
      if (R() < .3) inner.style.opacity = 0;       // algunas quedan apagadas: se encienden en el loop
      m._in = inner; m._c = ctr; lights.push(m); return m;
    };
    const zap = pen(); for (let i = 0; i < 4; i++) zap.c([[X(i) - 5 * q, G + 1], [X(i) - 9 * q, G + 8 * q], [X(i) + 9 * q, G + 8 * q], [X(i) + 5 * q, G + 1]]);
    const zapE = S(L.terreno, zap, "av-t"); draw(tlM, zapE, tm.plan + .75, .5);
    const plan = pen();
    for (let i = 0; i < 4; i++) plan.l(X(i), G, X(i) + Dx, G - Dy, 3);
    for (let j = 1; j < 3; j++) plan.l(bx + j * dx, G - j * dy, xR + j * dx, G - j * dy, 3);
    const planE = S(L.ejes, plan, "av-t"); draw(tlM, planE, tm.plan, .7);
    const axes = E("g", {}, L.ejes), bubY = v ? 40 : 52, br = v ? 8 : 10, e0 = v ? 30 : 40, bst = v ? 20 : 26;
    for (let i = 0; i < 4; i++) {
      const g = E("g", {}, axes);
      S(g, pen().l(X(i), G + 2, X(i), G + bubY - br, 0, 0), "av-m av-t"); S(g, pen().o(X(i), G + bubY, br), "av-t");
      T(g, X(i), G + bubY + fs * .36, "ABCD"[i], "middle");
      show(tlM, g, tm.plan + .25 + i * .1, .3);
    }
    for (let j = 0; j < 3; j++) {
      const g = E("g", {}, axes), ax = bx - e0 - j * bst, ay = G - j * dy;
      S(g, pen().l(bx + j * dx - 2, ay, ax + br, ay, 0, 0), "av-m av-t"); S(g, pen().o(ax, ay, br), "av-t");
      T(g, ax, ay + fs * .36, String(j + 1), "middle");
      show(tlM, g, tm.plan + .7 + j * .1, .3);
    }
    // escala humana: el arquitecto en obra, saludando
    const mkFig = (parent, fx, fy, hf, helmet) => { // muñeco de palito; con casco si es obrero
      const hr = hf * .1, g = E("g", {}, parent);
      S(g, pen().o(fx, fy - hf + hr, hr).l(fx, fy - hf + 2 * hr + .4, fx - .5, fy - hf * .42, 0, .15).l(fx - .5, fy - hf * .42, fx - hf * .14, fy, 0, .15).l(fx - .5, fy - hf * .42, fx + hf * .13, fy, 0, .15)
        .l(fx, fy - hf * .74, fx - hf * .18, fy - hf * .5, 0, .15).l(fx, fy - hf * .74, fx + hf * .2, fy - hf * .97, 0, .15), "");
      if (helmet) S(g, pen().raw(`M${f(fx - hr * 1.5)} ${f(fy - hf + hr * .8)}A${f(hr * 1.5)} ${f(hr * 1.5)} 0 0 1 ${f(fx + hr * 1.5)} ${f(fy - hf + hr * .8)}`, hr * 5).l(fx - hr * 2, fy - hf + hr * .8, fx + hr * 2.4, fy - hf + hr * .8, 0, 0), "av-h");
      return g;
    };
    const mkMan = (fx, at) => draw(tlM, mkFig(L.gente, fx, G, fh * .58, false), at, .5);
    if (stPeople) stPeople();
    const mkSit = (parent, fx, fy, hf) => { // sentado en un banco
      const hr = hf * .1, g = E("g", {}, parent);
      S(g, pen().o(fx, fy - hf * .58, hr).l(fx, fy - hf * .47, fx - .4, fy, 0, .1).l(fx - .4, fy, fx + hf * .22, fy + .4, 0, .1).l(fx + hf * .22, fy + .4, fx + hf * .23, fy + hf * .27, 0, .1).l(fx, fy - hf * .36, fx + hf * .17, fy - hf * .12, 0, .1), ""); return g;
    };
    const worker = (parent, x, y, tIn, tOut, hf) => { // obrero: aparece donde se trabaja y se va cuando esa parte queda lista
      const g = mkFig(parent, x, y, hf || fh * .46, true);
      if (!tlM) { if (tOut != null) g.remove(); return g; }
      show(tlM, g, tIn, .15); if (tOut != null) hide(tlM, g, tOut, .15); return g;
    };
    mkMan(bR + (v ? 12 : 26), tm.plan + .9);
    // acera en fuga al costado: la torre pisa el terreno (nada flota)
    // parcela en fuga al costado: una explanada con su borde del fondo a la misma altura que la esquina trasera,
    // así la torre pisa un plano y la esquina deja de flotar sobre la línea de terreno
    const ground3 = (x0, x1, dyy, at, m) => {
      m = (m || 44) * q; const gp = pen(), jn = pen();
      gp.l(x0, G, x1, G - dyy, 1.5, .2).l(x1, G - dyy, x1 + m, G - dyy, 0, .2).l(x0 + m, G, x1 + m, G - dyy, 1, .2).l(x0, G - 2.2 * q, x0 + m, G - 2.2 * q, 0, 0);
      for (let i = 1; i < 4; i++) { const u = i / 4; jn.l(x0 + (x1 - x0) * u, G - dyy * u, x0 + (x1 - x0) * u + m, G - dyy * u, 0, 0); }
      for (let i = 1; i < 4; i++) jn.l(x0 + m * i / 4, G, x1 + m * i / 4, G - dyy, 0, 0);
      E("path", { class: "av-occ", d: poly([[x0, G], [x1, G - dyy], [x1 + m, G - dyy], [x0 + m, G]]) }, L.terreno);
      draw(tlM, S(L.terreno, gp, ""), at, .6); draw(tlM, S(L.terreno, jn, "av-t av-dim"), at + .25, .6);
    };
    ground3(xR, bR, Dy, tm.plan + .95, v ? 20 : 40);
    // casitas de contexto: se construyen igual que las torres, en pequeño (columnas, losas, fachada y luces)
    const mkMini = (x0, nb, nfl, t0, dS, kind) => {
      const mb = v ? 22 : 34, mdx = v ? 9 : 14, mdy = mdx / 2, mfh = v ? 17 : 24, nd = 1.5, g = E("g", {}, L.ctx), li0 = lights.length;
      const m3 = (a, b, z) => [x0 + a * mb + b * mdx, G - b * mdy - z];
      draw(tlM, S(g, pen().p(m3(nb, 0, 0), m3(nb, nd, 0), 1, .2).p(m3(nb + .28, 0, 0), m3(nb + .28, nd, 0), 0, .2).p(m3(nb, nd, 0), m3(nb + .28, nd, 0), 0, 0).p(m3(nb, nd * .5, 0), m3(nb + .28, nd * .5, 0), 0, 0), "av-t"), t0 - .2, .4);
      for (let k = 0; k < nfl; k++) {
        const z0 = k * mfh, z1 = z0 + mfh, a = t0 + k * dS, last = k === nfl - 1, fg = E("g", {}, g);
        const oc = E("path", { class: "av-occ", d: poly(last ? [m3(0, 0, z0), m3(nb, 0, z0), m3(nb, nd, z0), m3(nb, nd, z1), m3(0, nd, z1), m3(0, 0, z1)] : [m3(0, 0, z0), m3(nb, 0, z0), m3(nb, nd, z0), m3(nb, nd, z1), m3(nb, 0, z1), m3(0, 0, z1)]) }, fg);
        const col = pen(), gh = pen(), sl = pen();
        for (let i = 0; i <= nb; i++) col.p(m3(i, 0, z0), m3(i, 0, z1), 1.4);
        col.p(m3(nb, nd, z0), m3(nb, nd, z1), 1.4); gh.p(m3(0, nd, z0), m3(0, nd, z1), .5);
        sl.p(m3(0, 0, z1), m3(nb, 0, z1), 2).p(m3(nb, 0, z1), m3(nb, nd, z1), 2);
        if (last) sl.p(m3(0, 0, z1), m3(0, nd, z1), 1.6).p(m3(0, nd, z1), m3(nb, nd, z1), 1.6); else gh.p(m3(0, 0, z1), m3(0, nd, z1), .5).p(m3(0, nd, z1), m3(nb, nd, z1), .5);
        draw(tlM, S(fg, col, ""), a, dS * .5); const ghE = S(fg, gh, "av-t av-dim"); draw(tlM, ghE, a + .05, dS * .5); draw(tlM, S(fg, sl, ""), a + dS * .45, dS * .4);
        const tf = a + dS * 1.5; show(tlM, oc, tf, .2); hide(tlM, ghE, tf, .2);
        const fr = pen(), lg = E("g", {}, fg);
        for (let i = 0; i < nb; i++) {
          const door = k === 0 && i === 0, c = door ? [m3(i + .34, 0, z0 + mfh * .72), m3(i + .66, 0, z0 + mfh * .72), m3(i + .66, 0, z0), m3(i + .34, 0, z0)] : [m3(i + .2, 0, z0 + mfh * .76), m3(i + .8, 0, z0 + mfh * .76), m3(i + .8, 0, z0 + mfh * .3), m3(i + .2, 0, z0 + mfh * .3)];
          const shop = k === 0 && kind && i === nb - 1 && nb > 1;
          if (shop) { // local con santamaría y toldo
            const sc = [m3(i + .12, 0, z0 + mfh * .74), m3(i + .88, 0, z0 + mfh * .74), m3(i + .88, 0, z0), m3(i + .12, 0, z0)]; fr.box(sc, .4);
            for (let u = 1; u < 6; u++) fr.p(bil(sc, 0, u / 6), bil(sc, 1, u / 6), 0, 0);
            const a0 = [sc[0][0] - 2 * q, sc[0][1] - 1.6 * q], a1 = [sc[1][0] + 2 * q, sc[1][1] - 1.6 * q]; fr.l(a0[0], a0[1], a1[0], a1[1], 0, 0).l(a0[0], a0[1], a0[0] - 3 * q, a0[1] + 5 * q, 0, 0).l(a1[0], a1[1], a1[0] - 3 * q, a1[1] + 5 * q, 0, 0).l(a0[0] - 3 * q, a0[1] + 5 * q, a1[0] - 3 * q, a1[1] + 5 * q, 0, 0);
            for (let u = 1; u < 5; u++) fr.l(a0[0] + (a1[0] - a0[0]) * u / 5, a0[1], a0[0] + (a1[0] - a0[0]) * u / 5 - 3 * q, a0[1] + 5 * q, 0, 0);
            continue;
          }
          fr.box(c, .4);
          if (door) fr.p(bil(c, .5, 0), bil(c, .5, 1), 0, 0).l(c[0][0] - 3 * q, c[0][1] - 2.2 * q, c[1][0] + 3 * q, c[1][1] - 2.2 * q, 0, 0).l(c[0][0] - 3 * q, c[0][1] - 3.6 * q, c[1][0] + 3 * q, c[1][1] - 3.6 * q, 0, 0).raw(circ(c[1][0] - 2.2 * q, (c[1][1] + c[2][1]) / 2, .6 * q), 4 * q);
          else { // ventana con dintel y alféizar; en los pisos altos, balcón con baranda
            fr.p(bil(c, .5, 0), bil(c, .5, 1), 0, 0).l(c[3][0] - 1.6 * q, c[3][1] + 1.8 * q, c[2][0] + 1.6 * q, c[2][1] + 1.8 * q, 0, 0).l(c[0][0] - 1 * q, c[0][1] - 1.6 * q, c[1][0] + 1 * q, c[1][1] - 1.6 * q, 0, 0); mkLight(c, lg);
            if (k > 0 && i === 0 && nb > 1) { const r0 = [c[3][0] - 2.4 * q, c[3][1] + 1.8 * q], r1 = [c[2][0] + 2.4 * q, c[2][1] + 1.8 * q], rh = mfh * .32; fr.l(r0[0], r0[1] - rh, r1[0], r1[1] - rh, 0, 0).l(r0[0], r0[1], r0[0], r0[1] - rh, 0, 0).l(r1[0], r1[1], r1[0], r1[1] - rh, 0, 0); for (let u = 1; u < 6; u++) fr.l(r0[0] + (r1[0] - r0[0]) * u / 6, r0[1], r0[0] + (r1[0] - r0[0]) * u / 6, r0[1] - rh, 0, 0); }
          }
        }
        const cs = [m3(nb, .35, z0 + mfh * .76), m3(nb, 1.15, z0 + mfh * .76), m3(nb, 1.15, z0 + mfh * .3), m3(nb, .35, z0 + mfh * .3)]; fr.box(cs, .4); mkLight(cs, lg);
        fr.p(m3(0, 0, z1 - 2.2 * q), m3(nb, 0, z1 - 2.2 * q), 0, 0).p(m3(nb, 0, z1 - 2.2 * q), m3(nb, nd, z1 - 2.2 * q), 0, 0);   // cornisa
        const shd = pen(); [.07, .14, .21, 1.29, 1.36, 1.43].forEach((b) => shd.p(m3(nb, b, z0 + mfh * .08), m3(nb, b, z0 + mfh * .9), 0, 0));   // el costado va rayado: queda en sombra
        draw(tlM, S(fg, fr, "av-t"), tf + .05, .35); show(tlM, S(fg, shd, "av-t av-dim"), tf + .2, .3, .5);
        if (k % 2 === 1) worker(L.gente, m3(nb * .5, 0, z0)[0], m3(0, 0, z0)[1], a, a + dS * 1.4, mfh * .62);
      }
      // remate: antepecho y tanque o caja de escalera
      const zt = nfl * mfh, rp2 = pen(), ph = 4 * q;
      [[0, 0], [nb, 0], [nb, nd], [0, nd]].forEach((c, i, arr) => { const n = arr[(i + 1) % 4]; rp2.p(up(m3(c[0], c[1], zt), ph), up(m3(n[0], n[1], zt), ph), 1, .2).p(m3(c[0], c[1], zt), up(m3(c[0], c[1], zt), ph), 0, 0); });
      const b0 = m3(kind ? .25 : nb - .85, .4, zt), bw3 = mb * .5, bh3 = (kind ? 9 : 12) * q, ex = mdx * .5, ey = mdy * .5;
      rp2.box([[b0[0], b0[1]], [b0[0] + bw3, b0[1]], [b0[0] + bw3, b0[1] - bh3], [b0[0], b0[1] - bh3]], .6).l(b0[0] + bw3, b0[1], b0[0] + bw3 + ex, b0[1] - ey, 0, 0).l(b0[0] + bw3, b0[1] - bh3, b0[0] + bw3 + ex, b0[1] - bh3 - ey, 0, 0).l(b0[0] + bw3 + ex, b0[1] - ey, b0[0] + bw3 + ex, b0[1] - bh3 - ey, 0, 0).l(b0[0], b0[1] - bh3, b0[0] + ex, b0[1] - bh3 - ey, 0, 0).l(b0[0] + ex, b0[1] - bh3 - ey, b0[0] + bw3 + ex, b0[1] - bh3 - ey, 0, 0);
      if (!kind && nb > 1) { const c0 = m3(.2, .75, zt), c1 = m3(nb - 1.1, .75, zt); rp2.l(c0[0], c0[1], c0[0], c0[1] - 11 * q, 0, 0).l(c1[0], c1[1], c1[0], c1[1] - 11 * q, 0, 0).l(c0[0], c0[1] - 10 * q, c1[0], c1[1] - 10 * q, 0, .6); for (let i = 1; i < 4; i++) { const xx = c0[0] + (c1[0] - c0[0]) * i / 4.2; rp2.box([[xx, c0[1] - 10 * q], [xx + 3.4 * q, c0[1] - 10 * q], [xx + 3.4 * q, c0[1] - 5 * q], [xx, c0[1] - 5 * q]], 0); } }
      { const an = m3(nb * .55, 1, zt); rp2.l(an[0], an[1], an[0], an[1] - 17 * q, 0, 0).l(an[0] - 3 * q, an[1] - 11 * q, an[0] + 3 * q, an[1] - 11 * q, 0, 0).l(an[0] - 2 * q, an[1] - 14 * q, an[0] + 2 * q, an[1] - 14 * q, 0, 0).p(m3(nb, .04, 1), m3(nb, .04, zt), 0, 0); }   // antena y bajante
      const tEnd = t0 + nfl * dS; draw(tlM, S(g, rp2, "av-t"), tEnd + .2, .5);
      return { from: li0, to: lights.length, tEnd };
    };
    const litMini = (r, t) => lights.slice(r.from, r.to).forEach((m, i) => show(tlM, m, Math.max(t, r.tEnd + .9) + i * .05, .2));
    const kinds = [[2, 3], [3, 2], [2, 4], [2, 2], [3, 3]], mW = (nb) => nb * (v ? 22 : 34) + (v ? 14 : 21) + 12 * q;
    const miniRow = (xa0, xb0, tOf, dS, i0, tLit) => { let x = xa0, i = i0; while (x + mW(kinds[i % 5][0]) < xb0) { const kk = kinds[i % 5]; litMini(mkMini(x, kk[0], kk[1], tOf(x, i - i0), dS, i % 2), tLit); x += mW(kk[0]) + rnd(14, 28); i++; } };
    // a los pies del teleférico: una quinta caraqueña de los 50, la Caracas de siempre junto a la torre nueva
    if (!v) {
      const g = E("g", {}, L.ctx), occ = (pts) => E("path", { class: "av-occ", d: poly(pts) }, g), seg = (pn, a, b) => pn.l(a[0], a[1], b[0], b[1], 0, 0), t0 = tm.f0 + 1.2, tN = tm.light + .4;
      // ===== QUINTA: zócalo, portal de tres arcos, ventanas con reja y postigos, cornisa con dentículos, techo de teja criolla a dos aguas, muro con reja, buganvilla y un escarabajo =====
      const xa = 74 * q, xb = xa + 128 * q, H = 36 * q, ds = 16 * q, es = 8 * q, rh = 24 * q, ov = 4 * q;
      const E0 = [xa - ov, G - H - 2 * q], E1 = [xb + ov, G - H - 2 * q], R0 = [xa - ov + ds / 2, G - H - 2 * q - es / 2 - rh], R1 = [xb + ov + ds / 2, G - H - 2 * q - es / 2 - rh], B1 = [xb + ov + ds, G - H - 2 * q - es];
      occ([[xa, G], [xb, G], [xb + ds, G - es], [xb + ds, G - H - es], B1, R1, R0, E0, [xa, G - H]]);
      const wl = pen(); seg(wl, [xa, G], [xa, G - H]); seg(wl, [xb, G], [xb, G - H]); seg(wl, [xb, G], [xb + ds, G - es]); seg(wl, [xb + ds, G - es], [xb + ds, G - H - es]); seg(wl, [xa, G - 3 * q], [xb, G - 3 * q]); seg(wl, [xb, G - 3 * q], [xb + ds, G - 3 * q - es]);
      for (let x = xa + 6 * q; x < xb; x += 9 * q) seg(wl, [x, G], [x, G - 3 * q]);
      seg(wl, [xa, G - H + 3 * q], [xb, G - H + 3 * q]); for (let x = xa + 2 * q; x < xb - 1; x += 3 * q) seg(wl, [x, G - H + 3 * q], [x, G - H + 1.4 * q]);
      draw(tlM, S(g, wl, ""), t0, .9, "power1.out");
      // portal: cuatro columnas con capitel y basa, tres arcos de medio punto, sombra rayada al fondo y la puerta de dos hojas al centro
      const pt = pen(), sh = pen(), cx0 = (xa + xb) / 2, aw = 20 * q, ay = G - 24 * q;
      for (let i = 0; i < 4; i++) { const x = cx0 - 1.5 * aw + i * aw; seg(pt, [x - 1.3 * q, G - 3 * q], [x - 1.3 * q, ay]); seg(pt, [x + 1.3 * q, G - 3 * q], [x + 1.3 * q, ay]); pt.box([[x - 2.4 * q, ay], [x + 2.4 * q, ay], [x + 2.4 * q, ay - 1.6 * q], [x - 2.4 * q, ay - 1.6 * q]], 0); seg(pt, [x - 2.2 * q, G - 4.4 * q], [x + 2.2 * q, G - 4.4 * q]); }
      for (let i = 0; i < 3; i++) { const x = cx0 - 1.5 * aw + i * aw; pt.raw(`M${f(x + 1.3 * q)} ${f(ay - 1.6 * q)}A${f(aw / 2 - 1.3 * q)} ${f(aw / 2 - 1.3 * q)} 0 0 1 ${f(x + aw - 1.3 * q)} ${f(ay - 1.6 * q)}`, aw * 1.6).raw(`M${f(x - .6 * q)} ${f(ay - 1.6 * q)}A${f(aw / 2 + .6 * q)} ${f(aw / 2 + .6 * q)} 0 0 1 ${f(x + aw + .6 * q)} ${f(ay - 1.6 * q)}`, aw * 1.7);
        if (i !== 1) for (let d = 0; d < aw - 2.6 * q; d += 3.4 * q) seg(sh, [x + 1.3 * q + d, G - 3 * q], [x + 1.3 * q + Math.min(aw - 2.6 * q, d + 6 * q), G - 3 * q - Math.min(aw - 2.6 * q - d, 6 * q) * 3]); }
      const dl = cx0 - 6 * q, dr = cx0 + 6 * q, dt = G - 21 * q; pt.box([[dl, G - 3 * q], [dr, G - 3 * q], [dr, dt], [dl, dt]], 0); seg(pt, [cx0, G - 3 * q], [cx0, dt]); [dl + 1.4 * q, cx0 + 1.4 * q].forEach((x) => pt.box([[x, dt + 2 * q], [x + 3.2 * q, dt + 2 * q], [x + 3.2 * q, dt + 8 * q], [x, dt + 8 * q]], 0).box([[x, dt + 10 * q], [x + 3.2 * q, dt + 10 * q], [x + 3.2 * q, G - 6 * q], [x, G - 6 * q]], 0));
      seg(pt, [cx0 - 1.5 * aw - 4 * q, G - 1.5 * q], [cx0 + 1.5 * aw + 4 * q, G - 1.5 * q]);
      draw(tlM, S(g, pt, ""), t0 + .7, 1, "power1.inOut"); const shE = S(g, sh, "av-t av-dim"); draw(tlM, shE, t0 + 1.4, .6);
      // ventanas: marco, reja de barrotes con remate en arco, alféizar, dintel y postigos abiertos
      const wn = pen(); [xa + 17 * q, xb - 17 * q].forEach((wx) => { const w2 = 8 * q, yt = G - 30 * q, yb = G - 9 * q; wn.box([[wx - w2, yb], [wx + w2, yb], [wx + w2, yt], [wx - w2, yt]], 0); for (let x = wx - w2 + 2.6 * q; x < wx + w2 - 1; x += 2.6 * q) seg(wn, [x, yb], [x, yt + 3 * q]);
        seg(wn, [wx - w2, yb - 7 * q], [wx + w2, yb - 7 * q]); seg(wn, [wx - w2, yb - 14 * q], [wx + w2, yb - 14 * q]); wn.raw(`M${f(wx - w2)} ${f(yt + 3 * q)}Q${f(wx)} ${f(yt - 1.6 * q)} ${f(wx + w2)} ${f(yt + 3 * q)}`, w2 * 2.4);
        seg(wn, [wx - w2 - 2 * q, yb + 1.4 * q], [wx + w2 + 2 * q, yb + 1.4 * q]); seg(wn, [wx - w2 - 1.4 * q, yt - 2.4 * q], [wx + w2 + 1.4 * q, yt - 2.4 * q]);
        [-1, 1].forEach((sd) => { const x1 = wx + sd * w2, x2 = wx + sd * (w2 + 5 * q); wn.box([[x1, yb], [x2, yb], [x2, yt], [x1, yt]], 0); for (let y = yt + 2.4 * q; y < yb; y += 2.4 * q) seg(wn, [Math.min(x1, x2) + .8 * q, y], [Math.max(x1, x2) - .8 * q, y]); });
        mkLight([[wx - w2 + .6 * q, yt + 3.6 * q], [wx + w2 - .6 * q, yt + 3.6 * q], [wx + w2 - .6 * q, yb - .6 * q], [wx - w2 + .6 * q, yb - .6 * q]], E("g", {}, g)); });
      draw(tlM, S(g, wn, "av-t"), t0 + 1.1, .9);
      // techo de teja criolla: alero con doble línea, hiladas paralelas al alero, canales a lo largo de la pendiente, cumbrera y el hastial con su óculo
      occ([E0, E1, R1, R0]); occ([E1, R1, B1]);
      const rf = pen(); seg(rf, E0, E1); seg(rf, [E0[0], E0[1] + 2 * q], [E1[0], E1[1] + 2 * q]); seg(rf, E0, [E0[0], E0[1] + 2 * q]); seg(rf, E1, [E1[0], E1[1] + 2 * q]); seg(rf, E0, R0); seg(rf, E1, R1); seg(rf, R0, R1); seg(rf, [R0[0], R0[1] - 1.6 * q], [R1[0], R1[1] - 1.6 * q]); seg(rf, R1, B1); seg(rf, E1, B1); seg(rf, [xb + ds, G - H - es], B1);
      const tl = pen(), lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      for (let k = 1; k < 7; k++) seg(tl, lerp2(E0, R0, k / 7), lerp2(E1, R1, k / 7));
      for (let k = 0; k < 7; k++) { const a = lerp2(E0, R0, k / 7), b = lerp2(E0, R0, (k + 1) / 7), off = k % 2 ? 2.6 * q : 0; for (let x = 3 * q + off; x < (E1[0] - E0[0]) - 1; x += 5.2 * q) tl.raw(`M${f(a[0] + x)} ${f(a[1])}Q${f((a[0] + b[0]) / 2 + x + 1.2 * q)} ${f((a[1] + b[1]) / 2)} ${f(b[0] + x)} ${f(b[1])}`, 8 * q); }
      const gc = [(E1[0] + R1[0] + B1[0]) / 3, (E1[1] + R1[1] + B1[1]) / 3 + 1.4 * q]; rf.raw(circ(gc[0], gc[1], 2.2 * q), 15 * q);
      draw(tlM, S(g, rf, ""), t0 + 1.6, .8); const tlE = S(g, tl, "av-t"); tlE.style.opacity = .7; draw(tlM, tlE, t0 + 2.1, 1.1, "power1.inOut");
      // farol de pared junto a la puerta (se enciende de noche)
      const fl = pen().l(dr + 4 * q, G - 18 * q, dr + 6.4 * q, G - 18 * q, 0, 0).box([[dr + 5 * q, G - 17 * q], [dr + 8.4 * q, G - 17 * q], [dr + 8 * q, G - 12 * q], [dr + 5.4 * q, G - 12 * q]], 0); draw(tlM, S(g, fl, "av-t"), t0 + 2.4, .3);
      const flOn = S(g, pen().box([[dr + 5.8 * q, G - 16 * q], [dr + 7.6 * q, G - 16 * q], [dr + 7.4 * q, G - 13 * q], [dr + 6 * q, G - 13 * q]], 0), "av-h", true); show(tlM, flOn, tN, .4);
      // muro de frente con reja de lanzas y portón al centro; buganvilla en flor trepando por la esquina
      const mr = pen(), rj = pen(), gl0 = cx0 - 15 * q, gl1 = cx0 + 15 * q;
      [[xa - 10 * q, gl0], [gl1, xb + 10 * q]].forEach((r) => { mr.box([[r[0], G], [r[1], G], [r[1], G - 7 * q], [r[0], G - 7 * q]], 0); seg(mr, [r[0] - .8 * q, G - 7.8 * q], [r[1] + .8 * q, G - 7.8 * q]); for (let x = r[0] + 1.6 * q; x < r[1]; x += 3 * q) { seg(rj, [x, G - 7.8 * q], [x, G - 17 * q]); rj.raw(`M${f(x - .7 * q)} ${f(G - 16.4 * q)}L${f(x)} ${f(G - 18.2 * q)}L${f(x + .7 * q)} ${f(G - 16.4 * q)}`, 4 * q); } seg(rj, [r[0], G - 14.6 * q], [r[1], G - 14.6 * q]); });
      [gl0, gl1].forEach((x) => mr.box([[x - 2 * q, G], [x + 2 * q, G], [x + 2 * q, G - 19 * q], [x - 2 * q, G - 19 * q]], 0).box([[x - 2.8 * q, G - 19 * q], [x + 2.8 * q, G - 19 * q], [x + 2.8 * q, G - 20.6 * q], [x - 2.8 * q, G - 20.6 * q]], 0));
      for (let x = gl0 + 3.4 * q; x < gl1 - 2 * q; x += 2.8 * q) { const top = G - 15 * q - 3 * q * Math.sin(Math.PI * (x - gl0) / (gl1 - gl0)); seg(rj, [x, G - .6 * q], [x, top]); }
      rj.raw(`M${f(gl0 + 2 * q)} ${f(G - 15 * q)}Q${f(cx0)} ${f(G - 21 * q)} ${f(gl1 - 2 * q)} ${f(G - 15 * q)}`, 34 * q); seg(rj, [cx0, G - .6 * q], [cx0, G - 18 * q]);
      occ([[xa - 10 * q, G], [gl0 + 2 * q, G], [gl0 + 2 * q, G - 7.8 * q], [xa - 10 * q, G - 7.8 * q]]); occ([[gl1 - 2 * q, G], [xb + 10 * q, G], [xb + 10 * q, G - 7.8 * q], [gl1 - 2 * q, G - 7.8 * q]]);
      draw(tlM, S(g, mr, ""), t0 + 2.6, .7); const rjE = S(g, rj, "av-t"); rjE.style.opacity = .75; draw(tlM, rjE, t0 + 2.9, .8);
      const bg = pen(), bf = pen(), bx0 = xb - 2 * q; bg.raw(`M${f(bx0)} ${f(G - 7.8 * q)}C${f(bx0 + 6 * q)} ${f(G - 18 * q)} ${f(bx0 - 4 * q)} ${f(G - 26 * q)} ${f(bx0 + 3 * q)} ${f(G - H - 1 * q)}`, 40 * q).raw(`M${f(bx0 + 1 * q)} ${f(G - 16 * q)}Q${f(bx0 + 9 * q)} ${f(G - 22 * q)} ${f(bx0 + 12 * q)} ${f(G - 30 * q)}`, 18 * q);
      const flw = (x, y, r) => bf.raw(`M${f(x - r)} ${f(y)}H${f(x + r)}M${f(x)} ${f(y - r)}V${f(y + r)}`, r * 4);
      [[.3, 5, 2], [.55, -1, 3], [.78, 4, 2], [.95, 1, 3]].forEach((c) => { const cx2 = bx0 + c[1] * q, cy2 = G - 8 * q - c[0] * (H - 6 * q); for (let k = 0; k < 7; k++) { const a2 = k * .9 + c[2], r2 = (k ? 2.6 : 0) * q * (1 + (k % 2) * .5); flw(cx2 + Math.cos(a2) * r2, cy2 + Math.sin(a2) * r2 * .8, (.9 + (k % 3) * .2) * q); } });
      [[xa - 4 * q, G - 11 * q], [xa + 1 * q, G - 13 * q], [xa - 1 * q, G - 9 * q], [xa + 3 * q, G - 10 * q]].forEach((c) => flw(c[0], c[1], 1 * q));
      draw(tlM, S(g, bg, "av-g av-t"), t0 + 3.1, .7); draw(tlM, S(g, bf, "av-o av-t"), t0 + 3.5, .8, "power1.out");
      // escarabajo estacionado frente a la quinta
      const vw2 = xb - 46 * q, vk = pen().raw(`M${f(vw2)} ${f(G - 4 * q)}Q${f(vw2 - .4 * q)} ${f(G - 9 * q)} ${f(vw2 + 5 * q)} ${f(G - 10 * q)}Q${f(vw2 + 9 * q)} ${f(G - 16 * q)} ${f(vw2 + 16 * q)} ${f(G - 16 * q)}Q${f(vw2 + 24 * q)} ${f(G - 16 * q)} ${f(vw2 + 27 * q)} ${f(G - 9 * q)}Q${f(vw2 + 31 * q)} ${f(G - 8 * q)} ${f(vw2 + 31 * q)} ${f(G - 4 * q)}Z`, 80 * q)
        .raw(`M${f(vw2 + 10 * q)} ${f(G - 10.6 * q)}Q${f(vw2 + 12 * q)} ${f(G - 14.4 * q)} ${f(vw2 + 16 * q)} ${f(G - 14.6 * q)}V${f(G - 10.6 * q)}Z`, 16 * q).raw(`M${f(vw2 + 17.4 * q)} ${f(G - 14.6 * q)}Q${f(vw2 + 22 * q)} ${f(G - 14.4 * q)} ${f(vw2 + 24 * q)} ${f(G - 10.6 * q)}H${f(vw2 + 17.4 * q)}Z`, 16 * q)
        .raw(circ(vw2 + 7 * q, G - 2.8 * q, 2.8 * q), 19 * q).raw(circ(vw2 + 24 * q, G - 2.8 * q, 2.8 * q), 19 * q).raw(circ(vw2 + 1.6 * q, G - 7.4 * q, 1.1 * q), 8 * q).l(vw2 + 10 * q, G - 5.4 * q, vw2 + 21 * q, G - 5.4 * q, 0, 0);
      E("path", { class: "av-occ", d: vk.d.split("Z")[0] + "Z" }, L.gente); draw(tlM, S(L.gente, vk, "av-t"), t0 + 3.4, .7);
    }
    // cotas, niveles y marcas de corte (lenguaje de plano, en naranja)
    const cotas = E("g", {}, L.cotas), cy0 = G + (v ? 19 : 25);
    const chain = E("g", {}, cotas), cpn = pen().l(X(0) - 5, cy0, X(3) + 5, cy0, 0, .4);
    for (let i = 0; i < 4; i++) cpn.l(X(i) - 3 * q, cy0 + 3 * q, X(i) + 3 * q, cy0 - 3 * q, 0, 0);
    S(chain, cpn, "av-o av-t", true);
    for (let i = 0; i < 3; i++) T(chain, X(i) + bw / 2, cy0 - 3 * q, "6.00", "middle", "av-o");
    show(tlM, chain, tm.plan + 1.1, .4);
    const cut = E("g", {}, cotas);
    const xa = v ? Math.max(12, bx - 84) : bx - 152, xb = v ? Math.min(Wn - 12, cx + 84) : cx + 128, ah = 13 * q;
    [[xa, 1, "A"], [xb, -1, "A'"]].forEach((m) => {
      S(cut, pen().l(m[0], G - 7 * q, m[0], G + 15 * q, 0, 0), "av-o av-b");
      S(cut, pen().l(m[0], G + 15 * q, m[0] + m[1] * ah, G + 15 * q, 0, 0).l(m[0] + m[1] * ah, G + 15 * q, m[0] + m[1] * (ah - 4 * q), G + 12 * q, 0, 0).l(m[0] + m[1] * ah, G + 15 * q, m[0] + m[1] * (ah - 4 * q), G + 18 * q, 0, 0), "av-o", true);
      T(cut, m[0] + m[1] * 1, G + 15 * q + fs * 1.5, m[2], m[1] > 0 ? "start" : "end", "av-o");
    });
    show(tlM, cut, tm.plan + 1.25, .4);
    const mkN0 = (parent, nx, at) => {
      const n0 = E("g", {}, parent);
      S(n0, pen().c([[nx - 5 * q, G - 7 * q], [nx + 5 * q, G - 7 * q], [nx, G - .5]], true), "av-o av-t");
      T(n0, nx + 8 * q, G - 4 * q, "N±0.00", "start", "av-o"); show(tlM, n0, at, .3);
    };
    mkN0(cotas, cx + (v ? 15 : 30), tm.crane + 1.3);
    const mkTag = (parent, xr, y, label, dir) => { // nivel: extensión, quiebre a 45°, repisa y cota
      const d = dir || -1, g = E("g", {}, parent), e1 = xr + d * 19 * q, e2 = e1 + d * 9 * q, yw = y - 9 * q, tw2 = label.length * fs * .66 + 5 * q, xe = e2 + d * tw2, xt = xr + d * 10 * q;
      S(g, pen().l(xr, y, e1, y, 0, 0).l(e1, y, e2, yw, 0, 0).l(e2, yw, xe, yw, 0, 0).l(xe, yw - 2.4 * q, xe, yw + 2.4 * q, 0, 0), "av-o av-t", true);
      S(g, pen().c([[xt - 4.4 * q, y - 6.4 * q], [xt + 4.4 * q, y - 6.4 * q], [xt, y - .5]], true), "av-o av-t");
      T(g, e2 + d * 2.5 * q, yw - 3 * q, label, d < 0 ? "end" : "start", "av-o av-lv"); return g;
    };
    const lv = []; for (let k = 1; k <= nF; k++) lv[k] = mkTag(cotas, bx - 7 * q, Y(k), "N+" + (3 * k).toFixed(2));
    if (!v) {
      const vdim = E("g", {}, cotas), vx = bx - 122;
      S(vdim, pen().l(vx, G, vx, top, 3, 1).l(vx - 3, G + 3, vx + 3, G - 3, 0, 0).l(vx - 3, top + 3, vx + 3, top - 3, 0, 0), "av-o av-t", true);
      const tt = T(vdim, vx - 5, (G + top) / 2, (3 * nF).toFixed(2), "middle", "av-o"); tt.setAttribute("transform", `rotate(-90 ${f(vx - 5)} ${f((G + top) / 2)})`);
      show(tlM, vdim, tm.top + .1, .4);
    }
    const sideP = (u, y) => [xR + u * dx, y - u * dy];
    for (let k = 0; k < nF; k++) {
      const yb = Y(k), yt = Y(k + 1), a = tm.f0 + k * tm.D, roof = k === nF - 1;
      const col = pen(); for (let i = 0; i < 4; i++) col.l(X(i), yb, X(i), yt, 2.2);
      for (let j = 1; j < 3; j++) col.l(xR + j * dx, yb - j * dy, xR + j * dx, yt - j * dy, 2.2);
      draw(tlM, S(L.obra, col, ""), a, .42);
      const gh = pen(); for (let j = 1; j < 3; j++) gh.l(bx + j * dx, yb - j * dy, bx + j * dx, yt - j * dy, 1);
      for (let i = 1; i < 3; i++) gh.l(X(i) + Dx, yb - Dy, X(i) + Dx, yt - Dy, 1);
      const sl = pen(), th2 = 3.6 * q;      // losa: doble línea al frente y al costado
      sl.l(bx, yt, xR, yt, 3.4).l(xR, yt, bR, yt - Dy, 3.4).l(bx, yt + th2, xR, yt + th2, 1).l(xR, yt + th2, bR, yt - Dy + th2, 1);
      if (roof) sl.l(bx, yt, bx + Dx, yt - Dy, 3).l(bx + Dx, yt - Dy, bR, yt - Dy, 3);
      else gh.l(bx, yt, bx + Dx, yt - Dy, 1).l(bx + Dx, yt - Dy, bR, yt - Dy, 1);
      const ghE = S(L.obra, gh, "av-t av-dim"); draw(tlM, ghE, a + .08, .42);
      draw(tlM, S(L.obra, sl, ""), a + .56, .36);
      show(tlM, lv[k + 1], a + .8, .25);
      if (k > 0) worker(L.gente, X([0, 2, 1][k % 3]) + bw * .5, yb, a + .05, a + 1.5);
      // andamio del piso: sube con la estructura y se retira dos pisos después
      const sc = pen(), sx0 = bx - 7 * q, sx1 = xR + 7 * q, n = 6, cw = (sx1 - sx0) / n;
      for (let i = 0; i <= n; i++) sc.l(sx0 + i * cw, yb, sx0 + i * cw, yt, 1.5, .4);
      sc.l(sx0, yt + 6 * q, sx1, yt + 6 * q, 2, .5).l(sx0, yt + 8.5 * q, sx1, yt + 8.5 * q, 2, .5).l(sx0, (yb + yt) / 2 + 2, sx1, (yb + yt) / 2 + 2, 2, .5);
      for (let i = k % 2; i < n; i += 2) sc.l(sx0 + i * cw, yb, sx0 + (i + 1) * cw, yt + 8.5 * q, 0, .3);
      const scE = S(L.andamio, sc, "av-m av-t");
      draw(tlM, scE, a + .12, .4); erase(tlM, scE, Math.min(a + 2.15 * tm.D, tm.top + .15 + (k - nF + 3) * .12), .38);
      // fachada: carpinterías, balcones con baranda, alféizares y parasoles al costado
      const fr = pen(), det = pen(), pbF = k === 0, wy0 = yt + fh * (pbF ? .17 : .21), wy1 = pbF ? yb - 1 : yb - fh * .2, quads = [];
      for (let i = 0; i < 3; i++) {
        const mid = i === 1, a0 = pbF ? (mid ? .3 : .1) : (mid ? .1 : .15), b0 = 1 - a0, x0 = X(i) + bw * a0, x1 = X(i) + bw * b0;
        const c = [[x0, wy0], [x1, wy0], [x1, wy1], [x0, wy1]]; quads.push(c); fr.box(c, .9);
        (pbF ? (mid ? [.5] : [.34, .67]) : (mid ? [.33, .67] : [.5])).forEach((m) => { const p1 = bil(c, m, 0), p2 = bil(c, m, 1); fr.l(p1[0], p1[1], p2[0], p2[1], 0, 0); });
        if (mid && !pbF) { // balcón: losa volada y baranda de pletinas
          const ry0 = yb - fh * .4, ry1 = yb - 1.5 * q, xl = x0 - 4 * q, xr2 = x1 + 4 * q;
          det.l(xl, ry0, xr2, ry0, .6, .3).l(xl, ry1, xr2, ry1, .6, .3).l(xl, ry0, xl, ry1, 0, 0).l(xr2, ry0, xr2, ry1, 0, 0);
          for (let u = 1; u < 9; u++) det.l(xl + (xr2 - xl) * u / 9, ry0, xl + (xr2 - xl) * u / 9, ry1, 0, 0);
        } else if (!pbF) { det.l(x0 - 2.5 * q, wy1 + 2.4 * q, x1 + 2.5 * q, wy1 + 2.4 * q, 0, 0).l(x0, wy0 - 2.4 * q, x1, wy0 - 2.4 * q, 0, 0).l(x0, wy0 - 4 * q, x1, wy0 - 4 * q, 0, 0); if (R() < .45) { const yb2 = wy0 + (wy1 - wy0) * rnd(.22, .5); det.l(x0 + 1, yb2, x1 - 1, yb2, 0, 0).l(x0 + 1, yb2 - 1.6 * q, x1 - 1, yb2 - 1.6 * q, 0, 0); } }
        if (mid && pbF) fr.l(x0 - 6 * q, wy0 - 3 * q, x1 + 6 * q, wy0 - 3 * q, 1, .3).l(x0 - 6 * q, wy0 - 5.5 * q, x1 + 6 * q, wy0 - 5.5 * q, 1, .3);
      }
      for (let j = 0; j < 2; j++) {
        const c = [sideP(j + .2, wy0), sideP(j + .8, wy0), sideP(j + .8, wy1), sideP(j + .2, wy1)]; quads.push(c); fr.box(c, .9);
        const p1 = bil(c, .5, 0), p2 = bil(c, .5, 1); fr.l(p1[0], p1[1], p2[0], p2[1], 0, 0);
        if (!pbF) { const s0 = sideP(j + .12, wy0 - 2.6 * q), s1 = sideP(j + .88, wy0 - 2.6 * q); det.l(s0[0], s0[1], s1[0], s1[1], 0, 0); }
      }
      const frE = S(L.fachada, fr, "av-t"), detE = S(L.fachada, det, "av-t");
      const oc = E("path", { class: "av-occ", d: poly([[bx, yb], [xR, yb], [bR, yb - Dy], [bR, yt - Dy], [xR, yt], [bx, yt]]) }, L.occ);
      const tf = Math.min(a + 2.6 * tm.D, tm.top + .45 + (k - nF + 3) * .3);
      show(tlM, oc, tf, .3); hide(tlM, ghE, tf, .3); draw(tlM, frE, tf + .05, .5); draw(tlM, detE, tf + .3, .45);
      if (pbF) hide(tlM, planE, tf, .3);
      quads.forEach((c, qi) => { if (!(pbF && qi === 1)) mkLight(c, L.luz); });
    }
    const L1 = lights.length, ph2R = 7 * q;
    // lona de obra: malla con el isotipo y el nombre en vertical; se desenrolla desde arriba y se retira cuando la obra cierra
    const mkLona = (parent, xc, yT, w, h, tIn, tOut) => {
      const wrap = E("g", { transform: `translate(${f(xc)} ${f(yT)})` }, parent), g = E("g", {}, wrap), x0 = -w / 2, pn = pen(), mesh = pen();
      E("path", { class: "av-occ", d: poly([[x0, 0], [x0 + w, 0], [x0 + w, h], [x0, h]]) }, g);
      pn.box([[x0, 0], [x0 + w, 0], [x0 + w, h], [x0, h]], 0).l(x0 - 1.5 * q, h + 2.4 * q, x0 + w + 1.5 * q, h + 2.4 * q, 0, 0).l(x0, -4 * q, x0, 0, 0, 0).l(x0 + w, -4 * q, x0 + w, 0, 0, 0);
      for (let i = 0; i <= 4; i++) pn.raw(circ(x0 + 2 * q + (w - 4 * q) * i / 4, 2.4 * q, .9 * q), 6 * q);
      for (let d = -h + 6 * q; d < w; d += 6.5 * q) { let xa = d, xb = d + h, ya = 0, yb = h; if (xa < 0) { ya = -xa; xa = 0; } if (xb > w) { yb = h - (xb - w); xb = w; } if (xb - xa > 2) mesh.l(x0 + xa, ya, x0 + xb, yb, 0, 0); }
      S(g, mesh, "av-t av-dim").style.opacity = .22; S(g, pn, "av-t");
      const rr = w * .25, ri = rr * .556, icy = rr + 9 * q, a1 = -Math.PI / 4, a2 = Math.PI * 1.25, pt = (r, a) => `${f(r * Math.cos(a))} ${f(icy + r * Math.sin(a))}`;
      E("path", { class: "av-occ", d: circ(0, icy, rr + 3 * q) }, g);
      S(g, pen().raw(`M${pt(rr, a1)}A${f(rr)} ${f(rr)} 0 1 1 ${pt(rr, a2)}L${pt(ri, a2)}A${f(ri)} ${f(ri)} 0 1 0 ${pt(ri, a1)}Z`, rr * 9.2), "av-r");
      S(g, pen().c([[rr * .52, icy + rr * .8], [rr * 1.06, icy + rr * .8], [rr * 1.06, icy + rr * .98], [rr * .42, icy + rr * .98]], true), "av-o av-r", true);
      const avail = h - (icy + rr) - 16 * q, fz = Math.min(w * .3, avail / 6.2), tx2 = E("text", { class: "av-word av-wbg", transform: `translate(${f(fz * .36)} ${f(h - 7 * q)}) rotate(-90)`, style: `font-size:${f(fz)}px`, textLength: f(Math.min(avail, fz * 6.2)), lengthAdjust: "spacingAndGlyphs" }, g); tx2.textContent = "CARAQUEÑA";
      if (!tlM) { wrap.remove(); return; }
      gs.set(g, { scaleY: 0, svgOrigin: "0 0" }); tlM.to(g, { scaleY: 1, duration: .7, ease: "power2.out" }, tIn).to(g, { scaleY: 0, duration: .5, ease: "power2.in" }, tOut);
    };
    if (nF > 6) mkLona(L.andamio, X(0) + bw * .5, Y(5) + 3 * q, bw * .84, fh * 4 - 8 * q, tm.f0 + 5.3, tm.top + .25);
    {
      // planta baja: pilotis de doble línea, jardineras y escalones de acceso; azotea: baranda, pérgola y equipos; bajantes al costado
      const pb2 = pen(), rf2 = pen(), dc = X(1) + bw * .5;
      for (let i = 0; i < 4; i++) pb2.l(X(i) + 2.4 * q, G, X(i) + 2.4 * q, Y(1) + 3.6 * q, 0, 0);
      [0, 2].forEach((i) => { const a = X(i) + bw * .16, b = X(i) + bw * .84; pb2.box([[a, G], [b, G], [b, G - 5 * q], [a, G - 5 * q]], .3); for (let u = 0; u < 5; u++) pb2.raw(`M${f(a + (b - a) * u / 5)} ${f(G - 5 * q)}q${f((b - a) / 10)} ${f(-5 * q)} ${f((b - a) / 5)} 0`, (b - a) / 3); });
      pb2.l(dc - bw * .3, G - 1.6 * q, dc + bw * .3, G - 1.6 * q, 0, 0).l(dc - bw * .25, G - 3.2 * q, dc + bw * .25, G - 3.2 * q, 0, 0);
      [.06, 1.94].forEach((u) => { const a = sideP(u, G), b = sideP(u, top); rf2.l(a[0], a[1], b[0], b[1], 0, 0); });
      draw(tlM, S(L.fachada, pb2, "av-t"), tm.f0 + 3.1, .7);
      for (let x = bx; x <= xR + .1; x += bw / 8) rf2.l(x, top - ph2R, x, top - ph2R - 5 * q, 0, 0);
      rf2.l(bx, top - ph2R - 5 * q, xR, top - ph2R - 5 * q, 0, .2); for (let u = 0; u <= 2.01; u += .25) { const a = sideP(u, top - ph2R); rf2.l(a[0], a[1], a[0], a[1] - 5 * q, 0, 0); }
      { const a = sideP(0, top - ph2R - 5 * q), b = sideP(2, top - ph2R - 5 * q); rf2.l(a[0], a[1], b[0], b[1], 0, .2); }
      const pg = [[.12, .45], [.95, .45], [.95, 1.5], [.12, 1.5]].map((c) => [bx + c[0] * bw + c[1] * dx, top - c[1] * dy]), ph3 = 13 * q;
      pg.forEach((c, i) => { const n = pg[(i + 1) % 4]; rf2.l(c[0], c[1], c[0], c[1] - ph3, 0, 0).l(c[0], c[1] - ph3, n[0], n[1] - ph3, .8, .2); });
      for (let u = 1; u < 6; u++) { const a = [pg[0][0] + (pg[1][0] - pg[0][0]) * u / 6, pg[0][1] - ph3], b = [pg[3][0] + (pg[2][0] - pg[3][0]) * u / 6, pg[3][1] - ph3]; rf2.l(a[0], a[1], b[0], b[1], 0, 0); }
      draw(tlM, S(L.techo, rf2, "av-t"), tm.leave + 1.7, .8);
    }
    { const bal = E("g", {}, L.gente); [3, 6, 9].filter((k) => k < nF).forEach((k, i) => mkFig(bal, X(1) + bw * (.36 + i * .14), Y(k) - 1.5 * q, fh * .36, false)); show(tlM, bal, tm.light + 1.4, .5); }
    {
      // lenguaje de plano: ejes de columna en trazo y punto que se prolongan sobre el techo, y arranques de acero mientras sube
      const ej = E("g", {}, cotas);
      for (let i = 0; i < 4; i++) { const e = E("path", { class: "av-o av-t av-axis", d: `M${f(X(i))} ${f(G)}V${f(top - 26 * q)}` }, ej); e._L = 0; }
      show(tlM, ej, tm.f0 + .4, .6, .55);
      for (let k = 0; k < nF - 1; k++) {
        const st2 = pen(), y = Y(k + 1); for (let i = 0; i < 4; i++) st2.l(X(i) - 1.6 * q, y, X(i) - 1.6 * q, y - 9 * q, 0, 0).l(X(i) + 1.6 * q, y, X(i) + 1.6 * q, y - 8 * q, 0, 0);
        const e = S(L.andamio, st2, "av-o av-t"); draw(tlM, e, tm.f0 + k + .7, .2); erase(tlM, e, tm.f0 + k + 1.02, .12);
      }
    }
    // techo: antepecho, núcleo de escaleras, tanque y antena con baliza
    const ph2 = 7 * q, rf = pen();
    [[bx, top], [xR, top], [bR, top - Dy], [bx + Dx, top - Dy]].forEach((p) => rf.l(p[0], p[1], p[0], p[1] - ph2, 0, 0));
    rf.l(bx, top - ph2, xR, top - ph2, 2.4).l(xR, top - ph2, bR, top - Dy - ph2, 2.4).l(bx, top - ph2, bx + Dx, top - Dy - ph2, 2.4).l(bx + Dx, top - Dy - ph2, bR, top - Dy - ph2, 2.4);
    const nP = (a, b, z) => [bx + a * bw + b * dx, top - b * dy - z];
    const kh = 20 * q, k0 = nP(1.25, .5, 0), k1 = nP(2.15, .5, 0), k2 = nP(2.15, 1.45, 0), k3 = nP(1.25, 1.45, 0);
    const core = pen().box([k0, k1, up(k1, kh), up(k0, kh)], 1.6).l(k1[0], k1[1], k2[0], k2[1], 1).l(k2[0], k2[1], k2[0], k2[1] - kh, 1).l(k1[0], k1[1] - kh, k2[0], k2[1] - kh, 1.6).l(k0[0], k0[1] - kh, k3[0], k3[1] - kh, 1.6).l(k3[0], k3[1] - kh, k2[0], k2[1] - kh, 1.6);
    const roofOcc = E("path", { class: "av-occ", d: poly([[bx, top], [xR, top], [bR, top - Dy], [bR, top - Dy - ph2], [bx + Dx, top - Dy - ph2], [bx, top - ph2]]) }, L.techo);
    const coreOcc = E("path", { class: "av-occ", d: poly([k0, k1, k2, up(k2, kh), up(k3, kh), up(k0, kh)]) }, L.techo);
    const rfE = S(L.techo, rf, ""), coreE = S(L.techo, core, "");
    const am = nP(1.7, 1, kh), an = 30 * q;
    const t3 = nP(.35, .7, 0), tkw = 17 * q, tkh = 13 * q;
    const extra = S(L.techo, pen().l(am[0], am[1], am[0], am[1] - an, 0, .4).l(am[0] - 4 * q, am[1] - an * .55, am[0] + 4 * q, am[1] - an * .55, 0, 0).l(am[0] - 2.6 * q, am[1] - an * .78, am[0] + 2.6 * q, am[1] - an * .78, 0, 0)
      .box([[t3[0], t3[1] - 4 * q], [t3[0] + tkw, t3[1] - 4 * q], [t3[0] + tkw, t3[1] - 4 * q - tkh], [t3[0], t3[1] - 4 * q - tkh]], 1).l(t3[0] + 2 * q, t3[1], t3[0] + 2 * q, t3[1] - 4 * q, 0, 0).l(t3[0] + tkw - 2 * q, t3[1], t3[0] + tkw - 2 * q, t3[1] - 4 * q, 0, 0)
      .l(t3[0] + tkw, t3[1] - 4 * q, t3[0] + tkw + 7 * q, t3[1] - 7.5 * q, 0, 0).l(t3[0] + tkw, t3[1] - 4 * q - tkh, t3[0] + tkw + 7 * q, t3[1] - 7.5 * q - tkh, 0, 0).l(t3[0] + tkw + 7 * q, t3[1] - 7.5 * q, t3[0] + tkw + 7 * q, t3[1] - 7.5 * q - tkh, 0, 0).l(t3[0], t3[1] - 4 * q - tkh, t3[0] + 7 * q, t3[1] - 7.5 * q - tkh, 0, 0).l(t3[0] + 7 * q, t3[1] - 7.5 * q - tkh, t3[0] + tkw + 7 * q, t3[1] - 7.5 * q - tkh, 0, 0), "");
    const beacon = S(L.techo, pen().o(am[0], am[1] - an - 2.6 * q, 2.2 * q), "av-h", true);
    const hBeacon = S(L.avila, pen().o(tx + tw / 2, hy - th - 22 * q, 1.7 * q), "av-h", true);
    show(tlM, roofOcc, tm.top + .1, .2); show(tlM, coreOcc, tm.top + .2, .2); draw(tlM, rfE, tm.top + .1, .5); draw(tlM, coreE, tm.top + .35, .5);
    draw(tlM, extra, tm.leave + 1.5, .6); show(tlM, beacon, tm.leave + 2, .2); show(tlM, hBeacon, tm.clean + .3, .2);

    // =====================================================================
    // GRÚA TORRE — trepa por tramos, lleva piezas, gira y se desmonta
    // =====================================================================
    const mkCrane = (o) => {
      const gr = E("g", {}, L.grua), ccx = o.cx, mastH = o.mastH, nSeg = Math.ceil(mastH / (2 * o.fh + 6)), segH = mastH / nSeg, mw = 11 * q;
      if (!tlM) { gr.remove(); return; }
      const base = S(gr, pen().box([[ccx - 11 * q, G], [ccx + 11 * q, G], [ccx + 11 * q, G - 5 * q], [ccx - 11 * q, G - 5 * q]], 1).l(ccx - 15 * q, G, ccx - mw / 2, G - 13 * q, 0, 0).l(ccx + 15 * q, G, ccx + mw / 2, G - 13 * q, 0, 0), "av-o");
      const segs = [];
      for (let i = 0; i < nSeg; i++) {
        const y0 = G - i * segH, y1 = G - (i + 1) * segH, g = E("g", {}, gr), z2 = [], n = Math.max(3, Math.round(segH / (mw * 1.25)));
        S(g, pen().l(ccx - mw / 2, y0, ccx - mw / 2, y1, .6, .3).l(ccx + mw / 2, y0, ccx + mw / 2, y1, .6, .3), "av-o", true);
        for (let m = 0; m <= n; m++) z2.push([ccx + (m % 2 ? 1 : -1) * mw / 2, y0 + (y1 - y0) * m / n]);
        S(g, pen().c(z2), "av-o av-t"); g.style.opacity = 0; segs.push(g);
      }
      const jw = E("g", { transform: `translate(${f(ccx)} ${f(G - mastH)})` }, gr), jib = E("g", {}, jw), slew = E("g", {}, jib);
      const Lj = ccx - o.reach + 26 * q, Lc = 62 * q, apex = 26 * q;
      S(jib, pen().box([[-8 * q, -1], [8 * q, -1], [8 * q, 6 * q], [-8 * q, 6 * q]], .6).l(-5 * q, -1, 0, -apex, 0, .3).l(5 * q, -1, 0, -apex, 0, .3)
        .box([[5 * q, 8 * q], [17 * q, 8 * q], [17 * q, 19 * q], [5 * q, 19 * q]], .5), "av-o");
      S(slew, pen().l(-7 * q, 0, -Lj, 0, 0, .5).l(-7 * q, 7 * q, -Lj + 6 * q, 7 * q, 0, .5).l(-Lj, 0, -Lj + 6 * q, 7 * q, 0, 0).l(7 * q, 1.5 * q, Lc, 1.5 * q, 0, .4).l(7 * q, 6.5 * q, Lc, 6.5 * q, 0, .4), "av-o", true);
      const jz = [], jn = Math.round(Lj / (9 * q)); for (let m = 0; m <= jn; m++) jz.push([-7 * q - (Lj - 13 * q) * m / jn, m % 2 ? 0 : 7 * q]);
      const cz = [], cn = Math.round(Lc / (10 * q)); for (let m = 0; m <= cn; m++) cz.push([7 * q + (Lc - 7 * q) * m / cn, m % 2 ? 1.5 * q : 6.5 * q]);
      S(slew, pen().c(jz).c(cz).l(0, -apex, -Lj * .56, 0, 0, .6).l(0, -apex, Lc - 5 * q, 1.5 * q, 0, .4)
        .box([[Lc - 25 * q, 6.5 * q], [Lc - 14 * q, 6.5 * q], [Lc - 14 * q, 19 * q], [Lc - 25 * q, 19 * q]], .4).box([[Lc - 12 * q, 6.5 * q], [Lc - 1 * q, 6.5 * q], [Lc - 1 * q, 19 * q], [Lc - 12 * q, 19 * q]], .4), "av-o av-t");
      const tro = E("g", {}, slew), trY = 11 * q;
      S(tro, pen().box([[-5 * q, 7 * q], [5 * q, 7 * q], [5 * q, trY], [-5 * q, trY]], .3), "av-o");
      const cabW = E("g", { transform: `translate(0 ${f(trY)})` }, tro), cab = S(cabW, pen().raw("M0 0V100", 100), "av-o av-t");
      const hk = E("g", {}, cabW);
      S(hk, pen().box([[-2.6 * q, 0], [2.6 * q, 0], [2.6 * q, 4 * q], [-2.6 * q, 4 * q]], .2).raw(`M0 ${f(4 * q)}v${f(2.4 * q)}q0 ${f(3 * q)} ${f(-3 * q)} ${f(2.6 * q)}`, 8), "av-o");
      const load = E("g", {}, hk);
      S(load, pen().l(0, 7 * q, -11 * q, 15 * q, 0, 0).l(0, 7 * q, 11 * q, 15 * q, 0, 0), "av-t");
      S(load, pen().box([[-13 * q, 15 * q], [13 * q, 15 * q], [13 * q, 19 * q], [-13 * q, 19 * q]], .5), "");
      const jibTop = G - mastH, hkUp = 12 * q, xp = o.xPick - ccx, lifts = o.lifts;
      const offOf = (n) => (nSeg - n) * segH;
      let cur = Math.min(2, nSeg), off = offOf(cur), hy0 = hkUp, tX = xp;
      const hkAt = (absY) => absY - 19 * q - (jibTop + off + trY);
      const hook = (to, at, dur, ease) => { tlM.fromTo(hk, { y: hy0 }, { y: to, duration: dur, ease: ease || "power1.inOut", immediateRender: false }, at).fromTo(cab, { scaleY: hy0 / 100 }, { scaleY: to / 100, duration: dur, ease: ease || "power1.inOut", immediateRender: false }, at); hy0 = to; };
      const trolley = (to, at, dur) => { tlM.fromTo(tro, { x: tX }, { x: to, duration: dur, ease: "power1.inOut", immediateRender: false }, at); tX = to; };
      gs.set(cab, { svgOrigin: "0 0" }); gs.set(slew, { svgOrigin: "0 0" });
      const c = o.t;
      gr.style.opacity = 0; tlM.set(gr, { opacity: 1 }, c);
      draw(tlM, base, c, .3);
      for (let i = 0; i < cur; i++) { tlM.set(segs[i], { opacity: 1 }, c + .2 + i * .3); draw(tlM, segs[i], c + .2 + i * .3, .35, "power1.out"); }
      gs.set(jib, { y: off, opacity: 0 }); gs.set(tro, { x: tX }); gs.set(hk, { y: hy0 }); gs.set(cab, { scaleY: hy0 / 100 }); gs.set(load, { opacity: 0 });
      tlM.to(jib, { opacity: 1, duration: .25, ease: "none" }, c + .75);
      tlM.fromTo(slew, { scaleX: -1 }, { scaleX: 1, duration: .65, ease: "sine.inOut" }, c + .85);
      hook(hkAt(G - 1), c + 1.3, .28);
      // ciclo por piso: iza la pieza por delante de la fachada, la lleva y la asienta donde va la losa
      lifts.forEach((lf, k) => {
        const a = lf.a, d = lf.d;
        tlM.fromTo(load, { opacity: 0 }, { opacity: 1, duration: .06 * d, ease: "none", immediateRender: false }, a);
        hook(hkUp, a + .05 * d, .27 * d); trolley(lf.x - ccx, a + .3 * d, .2 * d); hook(hkAt(lf.y), a + .48 * d, .15 * d);
        tlM.fromTo(load, { opacity: 1 }, { opacity: 0, duration: .08 * d, ease: "none", immediateRender: false }, a + .64 * d);
        hook(hkUp, a + .7 * d, .12 * d);
        if (k < lifts.length - 1) {
          // trepado: la torre crece un tramo cuando el edificio la alcanza
          const need = G - lifts[k + 1].y + 46 * q;
          if (cur < nSeg && cur * segH < need) {
            const i = cur; cur++; const to = offOf(cur);
            tlM.set(segs[i], { opacity: 1 }, a + .66 * d); draw(tlM, segs[i], a + .66 * d, .26 * d, "power1.out");
            tlM.fromTo(jib, { y: off }, { y: to, duration: .26 * d, ease: "back.out(1.6)", immediateRender: false }, a + .68 * d); off = to;
          }
          trolley(xp, a + .8 * d, .13 * d); hook(hkAt(G - 1), a + .92 * d, .08 * d, "power1.in");
        }
      });
      const dd = o.leave;
      while (cur < nSeg) { tlM.set(segs[cur], { opacity: 1 }, dd - .5); draw(tlM, segs[cur], dd - .5, .2); const to = offOf(cur + 1); tlM.fromTo(jib, { y: off }, { y: to, duration: .2, immediateRender: false }, dd - .5); off = to; cur++; }
      // desmontaje: gira, baja tramo a tramo y se va
      tlM.fromTo(slew, { scaleX: 1 }, { scaleX: -1, duration: .6, ease: "sine.inOut", immediateRender: false }, dd);
      const down = offOf(1), dt = .85 / Math.max(1, nSeg - 1);
      tlM.fromTo(jib, { y: off }, { y: down, duration: .85, ease: "none", immediateRender: false }, dd + .55);
      for (let i = nSeg - 1; i >= 1; i--) tlM.fromTo(paths(segs[i]), { strokeDashoffset: 0 }, { strokeDashoffset: (n, t) => t._L, duration: dt, ease: "none", immediateRender: false }, dd + .55 + (nSeg - 1 - i) * dt);
      tlM.fromTo(gr, { opacity: 1 }, { opacity: 0, duration: .3, ease: "none", immediateRender: false }, dd + 1.4);
    };
    mkCrane({ cx, mastH: nF * fh + 56 * q, fh, reach: bx, xPick: bx + bw * .5, t: tm.crane, leave: tm.leave,
      lifts: Array.from({ length: nF }, (_, k) => ({ a: tm.f0 + k * tm.D, d: tm.D, x: bx + ([1, 2, 0][k % 3] + .5) * bw, y: Y(k + 1) - 2 })) });
    // remate de la torre 1: se limpian las cotas y se enciende ventana por ventana
    hide(tlM, cotas, tm.clean, .7); hide(tlM, axes, tm.clean + .1, .6); hide(tlM, zapE, tm.clean + .1, .5);
    const shuffle = (arr) => arr.map((m) => [R(), m]).sort((a, b) => a[0] - b[0]).map((o) => o[1]);
    shuffle(lights.slice(0, L1)).forEach((m, i) => show(tlM, m, tm.light + i * (1.9 / L1), .22));

    // =====================================================================
    // 4 · PANEO — la calle sigue: valla de Caraqueña armándose y el tren que nos adelanta
    // =====================================================================
    if (tlM) {
      const leg = (a, b, at, d) => tlM.fromTo(cam, { x: a }, { x: b, duration: d, ease: "sine.inOut", immediateRender: false }, at);
      leg(0, cmA, tm.pan, tm.pA); leg(cmA, cmB, tm.tA + tm.hA, tm.pB); leg(cmB, PAN, tm.tC, tm.pC);
      gs.set(lifeX, { opacity: 0 });
      [[tm.pan, tm.pA], [tm.tA + tm.hA, tm.pB], [tm.tC, tm.pC], [tm.under, tm.underD]].forEach((l) => tlM.fromTo(lifeX, { opacity: 0 }, { opacity: 1, duration: l[1] * .22, ease: "none", immediateRender: false }, l[0] + l[1] * .12).fromTo(lifeX, { opacity: 1 }, { opacity: 0, duration: l[1] * .22, ease: "none", immediateRender: false }, l[0] + l[1] * .64));
      // en cada parada la cámara se acerca despacio a mirar y vuelve a su distancia antes de seguir
      [[tm.tA, tm.hA, v ? 1.18 : 1.3], [tm.tB, tm.hB, v ? 1.22 : 1.36]].forEach((h) => tlM.fromTo(cam, { k: 1 }, { k: h[2], duration: h[1] * .42, ease: "sine.inOut", immediateRender: false }, h[0] - .2).fromTo(cam, { k: h[2] }, { k: 1, duration: h[1] * .34, ease: "sine.inOut", immediateRender: false }, h[0] + h[1] * .7));
    }
    const vw = v ? 190 : clamp(Wn * .26, 300, 420), vh = vw * .42, vx0 = v ? PAN - 208 : PAN + Math.round(Wn * .06), vyb = G - (v ? 70 : 100), vyt = vyb - vh, tv = tm.tC + (v ? 1.3 : .9);
    {
      const g = L.valla, p1 = vx0 + vw * .22, p2 = vx0 + vw * .78, pw = 5 * q;
      const posts = pen().l(p1 - pw, G, p1 - pw, vyb, 0, .2).l(p1 + pw, G, p1 + pw, vyb, 0, .2).l(p2 - pw, G, p2 - pw, vyb, 0, .2).l(p2 + pw, G, p2 + pw, vyb, 0, .2).l(p1 - pw * 2, G, p1 + pw * 2, G, 0, 0).l(p2 - pw * 2, G, p2 + pw * 2, G, 0, 0);
      const brace = pen(), nb = 4; [p1, p2].forEach((px) => { const z2 = []; for (let i = 0; i <= nb; i++) z2.push([px + (i % 2 ? pw : -pw), G - (G - vyb) * i / nb]); brace.c(z2); });
      brace.l(p1 + pw, G - (G - vyb) * .45, p2 - pw, G - (G - vyb) * .45, 0, .2).l(p1 + pw, G - (G - vyb) * .45, p2 - pw, vyb, 0, .2).l(p2 - pw, G - (G - vyb) * .45, p1 + pw, vyb, 0, .2);
      draw(tlM, S(g, posts, ""), tv, .5, "power1.out"); draw(tlM, S(g, brace, "av-t"), tv + .2, .6);
      const occ = E("path", { class: "av-occ", d: poly([[vx0, vyb], [vx0 + vw, vyb], [vx0 + vw, vyt], [vx0, vyt]]) }, g); show(tlM, occ, tv + .75, .2);
      const frame = pen().box([[vx0, vyb], [vx0 + vw, vyb], [vx0 + vw, vyt], [vx0, vyt]], 3).box([[vx0 + 4 * q, vyb - 4 * q], [vx0 + vw - 4 * q, vyb - 4 * q], [vx0 + vw - 4 * q, vyt + 4 * q], [vx0 + 4 * q, vyt + 4 * q]], .5)
        .l(vx0 - 5 * q, vyb + 4 * q, vx0 + vw + 5 * q, vyb + 4 * q, 0, .2).l(vx0 - 5 * q, vyb + 6.5 * q, vx0 + vw + 5 * q, vyb + 6.5 * q, 0, .2);
      draw(tlM, S(g, frame, ""), tv + .5, .7);
      // isotipo: anillo abierto arriba y barra naranja, trazados a compás
      const Rr = vh * .3, ri = Rr * .556, icx = vx0 + vh * .52, icy = vyt + vh * .46, a1 = -Math.PI / 4, a2 = Math.PI * 1.25;
      const pt = (r, a) => `${f(icx + r * Math.cos(a))} ${f(icy + r * Math.sin(a))}`;
      const ring = S(g, pen().raw(`M${pt(Rr, a1)}A${f(Rr)} ${f(Rr)} 0 1 1 ${pt(Rr, a2)}L${pt(ri, a2)}A${f(ri)} ${f(ri)} 0 1 0 ${pt(ri, a1)}Z`, Rr * 9.2), "av-r");
      const bar = S(g, pen().c([[icx + Rr * .52, icy + Rr * .8], [icx + Rr * 1.06, icy + Rr * .8], [icx + Rr * 1.06, icy + Rr * .98], [icx + Rr * .42, icy + Rr * .98]], true), "av-o av-r", true);
      const hpn = pen(); for (let i = 1; i < 6; i++) hpn.l(icx + Rr * (.44 + i * .1), icy + Rr * .97, icx + Rr * (.5 + i * .1), icy + Rr * .81, 0, 0);
      const barH = S(g, hpn, "av-o av-t");
      draw(tlM, ring, tv + 1, 1.3, "power1.inOut"); draw(tlM, bar, tv + 2.1, .4); draw(tlM, barH, tv + 2.3, .3);
      // el nombre se ajusta al ancho libre del cartel: nunca se sale
      const txX = icx + Rr * 1.55, avail = vx0 + vw - 13 * q - txX, fz = Math.min(vh * .25, avail / 6.2);
      const word = E("text", { x: f(txX), y: f(icy + fz * .2), class: "av-word", style: `font-size:${f(fz)}px`, textLength: f(Math.min(avail, fz * 6.2)), lengthAdjust: "spacingAndGlyphs" }, g); word.textContent = "CARAQUEÑA";
      const sub = E("text", { x: f(txX + fz * .04), y: f(icy + fz * .2 + fz * .62), class: "av-o av-wsub", style: `font-size:${f(Math.max(fs * .85, fz * .3))}px` }, g); sub.textContent = "STUDIO";
      show(tlM, word, tv + 1.9, .5); show(tlM, sub, tv + 2.2, .4);
      // andamio colgante con dos obreros: baja mientras trazan el logo
      const rx1 = vx0 + vh * .16, rx2 = vx0 + vh * .9, py0 = vyt + vh * .34, ropes = S(g, pen().l(rx1, vyt - 3 * q, rx1, vyb, 0, 0).l(rx2, vyt - 3 * q, rx2, vyb, 0, 0), "av-t av-dim"), plat = E("g", {}, g);
      S(plat, pen().l(rx1 - 4 * q, py0, rx2 + 4 * q, py0, 0, .2).l(rx1 - 4 * q, py0 + 2.4 * q, rx2 + 4 * q, py0 + 2.4 * q, 0, .2).l(rx1 - 4 * q, py0, rx1 - 4 * q, py0 - 7 * q, 0, 0).l(rx2 + 4 * q, py0, rx2 + 4 * q, py0 - 7 * q, 0, 0).l(rx1 - 4 * q, py0 - 7 * q, rx2 + 4 * q, py0 - 7 * q, 0, .2), "av-t");
      const wh = Math.min(vh * .2, 17 * q); mkFig(plat, rx1 + (rx2 - rx1) * .3, py0, wh, true); mkFig(plat, rx1 + (rx2 - rx1) * .72, py0, wh, true);
      if (tlM) { show(tlM, ropes, tv + .8, .2); show(tlM, plat, tv + .85, .2); tlM.fromTo(plat, { y: 0 }, { y: vyb - 4 * q - py0, duration: 1.6, ease: "none", immediateRender: false }, tv + 1); }
      hide(tlM, plat, tv + 2.8, .25); hide(tlM, ropes, tv + 2.85, .25);
      worker(L.gente, vx0 + vw * .5, G, tv + .1, null, fh * .5); worker(L.gente, p1 - 16 * q, G, tv + .3, tv + 3, fh * .5);
      // reflectores
      const lamps = pen(), rays = pen();
      [.2, .5, .8].forEach((u) => { const lx = vx0 + vw * u; lamps.l(lx, vyt, lx, vyt - 9 * q, 0, 0).l(lx, vyt - 9 * q, lx - 9 * q, vyt - 6 * q, 0, 0).box([[lx - 13 * q, vyt - 8 * q], [lx - 8 * q, vyt - 8 * q], [lx - 8 * q, vyt - 3.5 * q], [lx - 13 * q, vyt - 3.5 * q]], .2); [-8, 0, 8].forEach((o2) => rays.l(lx - 10.5 * q, vyt - 2 * q, lx - 10.5 * q + o2 * q, vyt + 9 * q, 0, 0)); });
      draw(tlM, S(g, lamps, "av-t"), tv + 1.2, .4); const raysE = S(g, rays, "av-h av-t", true); show(tlM, raysE, tv + 2.9, .3); lampsOn.push(raysE);
    }
    // casitas entre la estación y la valla: se levantan cuando la cámara pasa
    const tOf = (x) => { const c = x - Wn * .84; return c <= cmA ? tm.pan + tm.pA * clamp(c / cmA, 0, 1) : c <= cmB ? tm.tA + tm.hA + tm.pB * (c - cmA) / (cmB - cmA) : tm.tC + tm.pC * clamp((c - cmB) / (PAN - cmB), 0, .85); };
    miniRow(zS, zS + zMini, (x) => tOf(x), .5, 1, 0);
    // ---------- PLAZA: explanada en fuga (misma proyección que las torres) con espejo de agua, obelisco, alameda, bancos, faroles y gente ----------
    const plX = zS + zMini + 40, flow = [], sway = [], kP = v ? .46 : 1, PW = 500 * kP, PD = 130 * kP, PZ = 7 * kP;
    const pq = (a, b, z) => [plX + 20 * kP + a + b * .5, G - b * .25 - (z || 0)], tq = (a, b, z) => pq(a, b, PZ + (z || 0));
    {
      const g = E("g", {}, L.ctx), t0 = tm.tA - 1, u = kP, ppl = E("g", {}, L.gente);
      const bx3 = (pn, a0, a1, b0, b1, z0, z1, o) => pn.box([tq(a0, b0, z0), tq(a1, b0, z0), tq(a1, b0, z1), tq(a0, b0, z1)], o || 0).p(tq(a1, b0, z0), tq(a1, b1, z0), 0, 0).p(tq(a1, b1, z0), tq(a1, b1, z1), 0, 0).p(tq(a1, b0, z1), tq(a1, b1, z1), 0, 0).p(tq(a0, b0, z1), tq(a0, b1, z1), 0, 0).p(tq(a0, b1, z1), tq(a1, b1, z1), 0, 0);
      // zócalo con escalinata al frente y despiece del pavimento
      E("path", { class: "av-occ", d: poly([pq(0, 0), pq(PW, 0), pq(PW, PD), tq(PW, PD), tq(0, PD), tq(0, 0)]) }, g);
      const base = pen().box([pq(0, 0), pq(PW, 0), tq(PW, 0), tq(0, 0)], 1.4).p(tq(0, 0), tq(0, PD), 1.4, .2).p(tq(0, PD), tq(PW, PD), 1.4, .2).p(tq(PW, PD), tq(PW, 0), 1.4, .2).p(pq(PW, 0), pq(PW, PD), .8, .2).p(pq(PW, PD), tq(PW, PD), 0, 0);
      [1, 2].forEach((i) => base.p(pq(PW * .36, 0, PZ * i / 3), pq(PW * .64, 0, PZ * i / 3), 0, 0)); base.p(pq(PW * .36, 0), tq(PW * .36, 0), 0, 0).p(pq(PW * .64, 0), tq(PW * .64, 0), 0, 0);
      draw(tlM, S(g, base, ""), t0, .9, "power1.inOut");
      const pav = pen(); for (let i = 1; i < 12; i++) pav.p(tq(PW * i / 12, 0), tq(PW * i / 12, PD), 0, 0); [.2, .8].forEach((b) => pav.p(tq(0, PD * b), tq(PW, PD * b), 0, .2));
      draw(tlM, S(g, pav, "av-t av-dim"), t0 + .5, .9);
      // espejo de agua: brocal doble, lámina con sus reflejos
      const a0 = PW * .2, a1 = PW * .8, b0 = PD * .34, b1 = PD * .62, bm = (b0 + b1) / 2, pool = pen();
      E("path", { class: "av-occ", d: poly([tq(a0, b0), tq(a1, b0), tq(a1, b1), tq(a0, b1)]) }, g);
      pool.box([tq(a0, b0), tq(a1, b0), tq(a1, b1), tq(a0, b1)], .8).box([tq(a0 + 5 * u, b0 + 4 * u), tq(a1 - 3 * u, b0 + 4 * u), tq(a1 - 5 * u, b1 - 4 * u), tq(a0 + 3 * u, b1 - 4 * u)], 0).p(tq(a0, b0), tq(a0, b0, 3 * u), 0, 0).p(tq(a1, b0), tq(a1, b0, 3 * u), 0, 0).p(tq(a0, b0, 3 * u), tq(a1, b0, 3 * u), 0, .2);
      [[.1, .34], [.42, .7], [.76, .93], [.2, .5], [.58, .88]].forEach((r, i) => pool.p(tq(a0 + (a1 - a0) * r[0], b0 + (b1 - b0) * (i < 3 ? .68 : .36)), tq(a0 + (a1 - a0) * r[1], b0 + (b1 - b0) * (i < 3 ? .68 : .36)), 0, 0));
      draw(tlM, S(g, pool, "av-t"), t0 + .9, .8);
      // obelisco de cuerpo entero sobre su base de dos gradas, y dos astas
      const ca = PW * .5, cb = PD * .83, zb = 11 * u, z1 = 178 * u, zA = 194 * u, ob = pen();
      const FL0 = tq(ca - 7 * u, cb - 7 * u, zb), FR0 = tq(ca + 7 * u, cb - 7 * u, zb), BR0 = tq(ca + 7 * u, cb + 7 * u, zb), FL1 = tq(ca - 3.6 * u, cb - 3.6 * u, z1), FR1 = tq(ca + 3.6 * u, cb - 3.6 * u, z1), BR1 = tq(ca + 3.6 * u, cb + 3.6 * u, z1), AP = tq(ca, cb, zA);
      E("path", { class: "av-occ", d: poly([tq(ca - 20 * u, cb - 14 * u), tq(ca + 20 * u, cb - 14 * u), tq(ca + 20 * u, cb + 14 * u), tq(ca + 20 * u, cb + 14 * u, 5 * u), BR0, BR1, AP, FL1, FL0, tq(ca - 20 * u, cb - 14 * u, 5 * u)]) }, g);
      bx3(ob, ca - 20 * u, ca + 20 * u, cb - 14 * u, cb + 14 * u, 0, 5.5 * u, .6); bx3(ob, ca - 13 * u, ca + 13 * u, cb - 10 * u, cb + 10 * u, 5.5 * u, zb, .4);
      ob.p(FL0, FL1, 0, .15).p(FR0, FR1, 0, .15).p(BR0, BR1, 0, .15).p(FL0, FR0, 0, 0).p(FR0, BR0, 0, 0).p(FL1, FR1, 0, 0).p(FR1, BR1, 0, 0).p(FL1, AP, 0, 0).p(FR1, AP, 0, 0).p(BR1, AP, 0, 0);
      for (let i = 1; i < 6; i++) { const w = i / 6, l = (a, b) => [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w]; ob.p(l(FR0, FR1), l(BR0, BR1), 0, 0); }   // el costado en sombra, rayado
      draw(tlM, S(g, ob, ""), t0 + 1.1, 1.3, "power1.out");
      const fl = pen(); [-1, 1].forEach((sd) => { const b = tq(ca + sd * 46 * u, cb), h2 = 118 * u; fl.l(b[0], b[1], b[0], b[1] - h2, 0, .1).l(b[0] - 2.4 * u, b[1], b[0] + 2.4 * u, b[1], 0, 0).raw(`M${f(b[0])} ${f(b[1] - h2 + 1)}q${f(6 * u)} ${f(-3 * u)} ${f(11 * u)} ${f(1 * u)}t${f(11 * u)} ${f(1 * u)}v${f(11 * u)}q${f(-5 * u)} ${f(-4 * u)} ${f(-11 * u)} ${f(-1 * u)}t${f(-11 * u)} ${f(-1 * u)}`, 60 * u); });
      draw(tlM, S(g, fl, "av-t"), t0 + 1.7, .8);
      // surtidores en fila sobre el espejo (sprite propio: el agua no para de correr)
      { const x0 = tq(a0 + (a1 - a0) * .07, bm)[0], fw = (a1 - a0) * .86, fhh = 44 * u, e = sprite(lifeF, fw, fhh), jets = E("g", {}, e);
        for (let i = 0; i < 7; i++) { const jx = fw * (i + .5) / 7, hh = (i === 3 ? 38 : i % 2 ? 22 : 29) * u; [-1, 1].forEach((sd) => flow.push(E("path", { class: "av-flow", d: `M${f(jx)} ${f(fhh)}Q${f(jx + sd * 3 * u)} ${f(fhh - hh * 1.9)} ${f(jx + sd * 7 * u)} ${f(fhh)}` }, jets))); }
        place(e, x0, tq(0, bm)[1] - fhh); if (tlM) { e.style.opacity = 0; tlM.to(e, { opacity: 1, duration: .6, ease: "none" }, t0 + 2.3); } }
      // bancos en fuga con gente sentada; faroles de dos brazos en las esquinas del espejo; carrito, palomas
      const fur = pen(), glb = pen();
      [.23, .7].forEach((fa, i) => { const a = PW * fa, b = PD * .16, L2 = 34 * u; fur.p(tq(a, b, 7 * u), tq(a + L2, b, 7 * u), 0, .1).p(tq(a, b + 7 * u, 7 * u), tq(a + L2, b + 7 * u, 7 * u), 0, .1).p(tq(a, b, 7 * u), tq(a, b + 7 * u, 7 * u), 0, 0).p(tq(a + L2, b, 7 * u), tq(a + L2, b + 7 * u, 7 * u), 0, 0).p(tq(a + 2 * u, b), tq(a + 2 * u, b, 7 * u), 0, 0).p(tq(a + L2 - 2 * u, b), tq(a + L2 - 2 * u, b, 7 * u), 0, 0).p(tq(a, b + 7 * u, 7 * u), tq(a, b + 7 * u, 15 * u), 0, 0).p(tq(a + L2, b + 7 * u, 7 * u), tq(a + L2, b + 7 * u, 15 * u), 0, 0).p(tq(a, b + 7 * u, 15 * u), tq(a + L2, b + 7 * u, 15 * u), 0, .1).p(tq(a, b + 7 * u, 11 * u), tq(a + L2, b + 7 * u, 11 * u), 0, .1);
        const s0 = tq(a + L2 * (i ? .3 : .68), b + 2 * u, 7 * u); mkSit(ppl, s0[0], s0[1], fh * .46); if (!i && !v) { const s1 = tq(a + L2 * .3, b + 2 * u, 7 * u); mkSit(ppl, s1[0], s1[1], fh * .5); } });
      [[a0 - 12 * u, b0 - 6 * u], [a1 + 12 * u, b0 - 6 * u], [a0 - 12 * u, b1 + 8 * u], [a1 + 12 * u, b1 + 8 * u]].forEach((c) => { const b = tq(c[0], c[1]), lh = 44 * u; fur.l(b[0] - .9 * u, b[1], b[0] - .6 * u, b[1] - lh, 0, 0).l(b[0] + .9 * u, b[1], b[0] + .6 * u, b[1] - lh, 0, 0).l(b[0] - 3 * u, b[1], b[0] + 3 * u, b[1], 0, 0).l(b[0] - 2 * u, b[1] - 4 * u, b[0] + 2 * u, b[1] - 4 * u, 0, 0).raw(`M${f(b[0] - 8 * u)} ${f(b[1] - lh - 3 * u)}Q${f(b[0] - 8 * u)} ${f(b[1] - lh + 2 * u)} ${f(b[0])} ${f(b[1] - lh + 1 * u)}Q${f(b[0] + 8 * u)} ${f(b[1] - lh + 2 * u)} ${f(b[0] + 8 * u)} ${f(b[1] - lh - 3 * u)}`, 26 * u).l(b[0], b[1] - lh, b[0], b[1] - lh - 5 * u, 0, 0);
        [-8, 0, 8].forEach((o2) => glb.raw(circ(b[0] + o2 * u, b[1] - lh - (o2 ? 5.6 : 7.8) * u, 2.4 * u), 16 * u)); });
      if (!v) { const cb2 = tq(PW * .89, PD * .2), cxv = cb2[0], cy = cb2[1];
        fur.box([[cxv, cy - 5 * u], [cxv + 20 * u, cy - 5 * u], [cxv + 20 * u, cy - 15 * u], [cxv, cy - 15 * u]], .4).raw(circ(cxv + 4.5 * u, cy - 3 * u, 3 * u), 20 * u).raw(circ(cxv + 15.5 * u, cy - 3 * u, 3 * u), 20 * u).l(cxv + 20 * u, cy - 13 * u, cxv + 27 * u, cy - 16 * u, 0, 0).l(cxv + 10 * u, cy - 15 * u, cxv + 10 * u, cy - 33 * u, 0, 0).l(cxv - 4 * u, cy - 30 * u, cxv + 10 * u, cy - 36 * u, 0, 0).l(cxv + 24 * u, cy - 30 * u, cxv + 10 * u, cy - 36 * u, 0, 0).l(cxv - 4 * u, cy - 30 * u, cxv + 24 * u, cy - 30 * u, 0, 0).l(cxv + 3 * u, cy - 30 * u, cxv + 10 * u, cy - 36 * u, 0, 0).l(cxv + 17 * u, cy - 30 * u, cxv + 10 * u, cy - 36 * u, 0, 0);
        mkFig(ppl, cxv + 33 * u, cy, fh * .52, false); mkFig(ppl, cxv - 10 * u, cy + 1, fh * .5, false); mkFig(ppl, cxv - 17 * u, cy + 1, fh * .34, false); }
      for (let i = 0; i < 8; i++) { const b = tq(PW * (.42 + i * .022), PD * (.06 + (i % 3) * .04)); fur.raw(`M${f(b[0])} ${f(b[1] - 1.4 * u)}l${f(1.6 * u)} ${f(1.4 * u)}l${f(1.8 * u)} ${f(-1.8 * u)}`, 5 * u); }
      [[.3, 118], [.34, 128], [.38, 112], [.62, 136]].forEach((c) => { const b = tq(PW * c[0], PD * .5, c[1] * u); fur.raw(`M${f(b[0] - 3 * u)} ${f(b[1])}q${f(1.5 * u)} ${f(-2 * u)} ${f(3 * u)} 0q${f(1.5 * u)} ${f(-2 * u)} ${f(3 * u)} 0`, 8 * u); });
      draw(tlM, S(g, fur, "av-t"), t0 + 1.9, .9); show(tlM, S(g, glb, "av-h av-t", true), Math.max(t0 + 2.6, tm.clean), .4);
      // gente en distintos planos de la explanada
      [[.1, .5, .5], [.125, .46, .46], [.93, .72, .5], [.56, .28, .5], [.6, .3, .36], [.16, .88, .48]].forEach((c) => { const b = tq(PW * c[0], PD * c[1]); mkFig(ppl, b[0], b[1], fh * c[2], false); });
      show(tlM, ppl, t0 + 2.4, .6);
      // papagayo: el hilo sale de la mano del niño; todo el conjunto se mece
      { const kb = tq(PW * .8, PD * .46), kw = 64 * u * 1.3, kh = 96 * u * 1.3, e = sprite(lifeF, kw, kh), kp = pen(), w = u * 1.3;
        kp.raw(`M0 ${f(kh)}Q${f(kw * .5)} ${f(kh * .62)} ${f(kw - 9 * w)} ${f(11 * w)}`, kh * 1.3).c([[kw - 9 * w, 2 * w], [kw - 3 * w, 11 * w], [kw - 9 * w, 22 * w], [kw - 15 * w, 11 * w]], true).l(kw - 9 * w, 2 * w, kw - 9 * w, 22 * w, 0, 0).l(kw - 15 * w, 11 * w, kw - 3 * w, 11 * w, 0, 0).raw(`M${f(kw - 9 * w)} ${f(22 * w)}q${f(4 * w)} ${f(5 * w)} 0 ${f(9 * w)}q${f(-4 * w)} ${f(4 * w)} ${f(1 * w)} ${f(9 * w)}`, 22 * w);
        draw(tlM, S(e, kp, "av-t"), t0 + 2.5, .9); place(e, kb[0] + 4 * u, kb[1] - fh * .36 - kh); mkFig(ppl, kb[0], kb[1], fh * .36, false);
        var kiteEl = e; if (gs) gs.set(e, { transformOrigin: "0% 100%" }); }
    }
    // alameda: árboles de compás al fondo y en las esquinas del frente; se mecen apenas (sprites)
    (v ? [[.05, .93], [.3, .93], [.7, .93], [.95, .93]] : [[.05, .93], [.2, .93], [.35, .93], [.65, .93], [.8, .93], [.95, .93], [.03, .1], [.975, .1]]).forEach((c, i) => {
      const u = kP, cr2 = (i % 2 ? 17 : 21) * u * (v ? 1.5 : 1), tw3 = cr2 * 2 + 8 * u, th3 = cr2 * 2 + (i % 2 ? 26 : 34) * u, e = sprite(lifeF, tw3, th3), cxx = tw3 / 2, cyy = cr2 + 3 * u, b = tq(PW * c[0], PD * c[1]);
      E("path", { class: "av-occ", d: circ(cxx, cyy, cr2) }, e);
      const tp2 = pen().l(cxx - 1.3 * u, th3, cxx - .9 * u, cyy + cr2 * .5, 0, .1).l(cxx + 1.3 * u, th3, cxx + .9 * u, cyy + cr2 * .5, 0, .1).raw(circ(cxx, cyy, cr2), cr2 * 6.4).raw(circ(cxx, cyy, cr2 * .2), cr2 * 1.4).box([[cxx - 5 * u, th3 - 1], [cxx + 5 * u, th3 - 1], [cxx + 7 * u, th3 - 3 * u], [cxx - 3 * u, th3 - 3 * u]], 0);
      for (let k = 0; k < 9; k++) { const a = Math.PI * 2 * k / 9 + i, r1 = cr2 * .3, r2 = cr2 * (k % 2 ? .62 : .86); tp2.raw(`M${f(cxx + r1 * Math.cos(a))} ${f(cyy + r1 * Math.sin(a))}L${f(cxx + r2 * Math.cos(a))} ${f(cyy + r2 * Math.sin(a))}`, cr2); }
      draw(tlM, S(e, tp2, "av-t"), tm.tA - .2 + i * .18, .9); place(e, b[0] - tw3 / 2, b[1] - th3 + 1);
      if (gs) { gs.set(e, { transformOrigin: "50% 100%" }); sway.push(e); }
    });
    // ---------- ESFERA: varillas colgadas que arman un círculo naranja, una por una ----------
    const esX = plX + zPlaza + zEsf * .5, rods = [], obX = plX + zPlaza * .5;
    {
      const q = qP, Re = (v ? 56 : 64) * q, eW = Re * 2 + 44 * q, eH = Re * 2 + 50 * q, e = sprite(lifeF, eW, eH, "avila__sp--glow"), ecx = eW / 2, ecy = 30 * q + Re, tE = tm.tB - .5, nR = v ? 27 : 37;
      const fr = pen().l(ecx - Re - 14 * q, eH, ecx - Re - 14 * q, 7 * q, 0, .15).l(ecx - Re - 11 * q, eH, ecx - Re - 11 * q, 7 * q, 0, .15).l(ecx + Re + 14 * q, eH, ecx + Re + 14 * q, 7 * q, 0, .15).l(ecx + Re + 11 * q, eH, ecx + Re + 11 * q, 7 * q, 0, .15)
        .l(ecx - Re - 20 * q, 7 * q, ecx + Re + 20 * q, 7 * q, 0, .2).l(ecx - Re - 20 * q, 10 * q, ecx + Re + 20 * q, 10 * q, 0, .2).l(ecx - Re - 18 * q, eH, ecx - Re - 7 * q, eH, 0, 0).l(ecx + Re + 7 * q, eH, ecx + Re + 18 * q, eH, 0, 0);
      draw(tlM, S(e, fr, "av-t"), tE, .6);
      for (let i = 0; i < nR; i++) {
        const x = ecx - Re + 2 * Re * (i + .5) / nR, hh = Math.sqrt(Math.max(0, Re * Re - (x - ecx) * (x - ecx)));
        const wire = S(e, pen().raw(`M${f(x)} ${f(10 * q)}V${f(ecy - hh)}`, ecy - hh), "av-t av-dim"), rod = S(e, pen().raw(`M${f(x)} ${f(ecy - hh)}V${f(ecy + hh)}`, hh * 2 + 2), "av-o");
        draw(tlM, wire, tE + .5 + i * .05, .3, "power1.in"); draw(tlM, rod, tE + .7 + i * .05, .35, "power1.out"); rods.push(rod);
      }
      place(e, esX - eW / 2, G - eH);
      const pp2 = E("g", {}, L.gente); mkFig(pp2, esX - Re - 30 * q, G, fh * .5, false); show(tlM, pp2, tE + .8, .4);
    }
    // tren del viaducto: sale de la estación y nos adelanta
    const mkTrain = (layer, n, doors) => {
      const dSpec = [], cw = 60 * q, ch = 14 * q, gap = 3.4 * q, w = n * (cw + gap) + 8 * q, e = sprite(layer, w + 18 * q, ch + 8 * q), body = pen(), glass = pen(), under = pen(), y0 = 2 * q, y1 = y0 + ch;
      for (let i = 0; i < n; i++) {
        const x0 = 4 * q + i * (cw + gap), last = i === n - 1, first = i === 0;
        body.raw(`M${f(x0 + (first ? 5 * q : 0))} ${f(y0)}H${f(x0 + cw - (last ? 8 * q : 0))}${last ? `L${f(x0 + cw)} ${f(y0 + 7 * q)}` : ""}V${f(y1)}H${f(x0)}V${f(first ? y0 + 7 * q : y0)}${first ? `L${f(x0 + 5 * q)} ${f(y0)}` : ""}Z`, (cw + ch) * 2.1);
        body.l(x0 + (first ? 6 : 1) * q, y0 + 1.6 * q, x0 + cw - (last ? 9 : 1) * q, y0 + 1.6 * q, 0, 0).l(x0 + .6 * q, y0 + 10.6 * q, x0 + cw - .6 * q, y0 + 10.6 * q, 0, 0);
        [.22, .5, .78].forEach((u) => { const d0 = x0 + cw * u - 3.4 * q; if (doors && u === .5 && !first && !last) { dSpec.push(d0); return; } body.box([[d0, y0 + 3 * q], [d0 + 6.8 * q, y0 + 3 * q], [d0 + 6.8 * q, y1 - .8 * q], [d0, y1 - .8 * q]], 0).l(d0 + 3.4 * q, y0 + 3 * q, d0 + 3.4 * q, y1 - .8 * q, 0, 0); });
        [[.045, .16], [.285, .435], [.565, .715], [.84, .955]].forEach((r2, j) => { if ((first && j === 0) || (last && j === 3)) return; glass.box([[x0 + cw * r2[0], y0 + 4 * q], [x0 + cw * r2[1], y0 + 4 * q], [x0 + cw * r2[1], y0 + 8.6 * q], [x0 + cw * r2[0], y0 + 8.6 * q]], 0); if (R() < .8) under.raw(circ(x0 + cw * (r2[0] + r2[1]) / 2 + rnd(-2.4, 2.4) * q, y0 + 6.4 * q, 1.25 * q), 8 * q); });
        if (last) glass.c([[x0 + cw - 6.6 * q, y0 + 2.8 * q], [x0 + cw - 1.4 * q, y0 + 7.4 * q], [x0 + cw - 6.6 * q, y0 + 7.4 * q]], true);
        if (first) glass.c([[x0 + 6.6 * q, y0 + 2.8 * q], [x0 + 1.4 * q, y0 + 7.4 * q], [x0 + 6.6 * q, y0 + 7.4 * q]], true);
        [.17, .83].forEach((u) => { const b2 = x0 + cw * u; under.l(b2 - 7 * q, y1 + 1.4 * q, b2 + 7 * q, y1 + 1.4 * q, 0, 0).raw(circ(b2 - 3.6 * q, y1 + 3.6 * q, 2 * q), 13 * q).raw(circ(b2 + 3.6 * q, y1 + 3.6 * q, 2 * q), 13 * q); });
        under.box([[x0 + cw * .36, y1], [x0 + cw * .64, y1], [x0 + cw * .64, y1 + 2.6 * q], [x0 + cw * .36, y1 + 2.6 * q]], 0).box([[x0 + cw * .3, y0 - 1.6 * q], [x0 + cw * .7, y0 - 1.6 * q], [x0 + cw * .7, y0], [x0 + cw * .3, y0]], 0);
        if (!last) under.l(x0 + cw, y0 + 3 * q, x0 + cw + gap, y0 + 3 * q, 0, 0).l(x0 + cw, y1 - 1 * q, x0 + cw + gap, y1 - 1 * q, 0, 0).l(x0 + cw + gap * .5, y0 + 3 * q, x0 + cw + gap * .5, y1 - 1 * q, 0, 0);
      }
      S(e, body, "av-t"); S(e, glass, "av-h av-t"); S(e, under, "av-t");
      const hx2 = 4 * q + n * (cw + gap) - gap; S(e, pen().l(hx2 + 1 * q, y0 + 9 * q, hx2 + 13 * q, y0 + 7.4 * q, 0, 0).l(hx2 + 1 * q, y0 + 9.6 * q, hx2 + 13 * q, y0 + 12 * q, 0, 0), "av-h av-t", true);
      // puertas del medio de cada coche: dos hojas que corren a los lados y dejan ver el interior
      e._doors = dSpec.map((d0) => { const g = E("g", {}, e); E("path", { class: "av-occ", d: poly([[d0, y0 + 3 * q], [d0 + 6.8 * q, y0 + 3 * q], [d0 + 6.8 * q, y1 - .8 * q], [d0, y1 - .8 * q]]) }, g); S(g, pen().l(d0, y0 + 3 * q, d0 + 6.8 * q, y0 + 3 * q, 0, 0).l(d0, y0 + 3 * q, d0, y1 - .8 * q, 0, 0).l(d0 + 6.8 * q, y0 + 3 * q, d0 + 6.8 * q, y1 - .8 * q, 0, 0), "av-h av-t");
        const mk = (xa) => { const lf = E("g", {}, g); E("path", { class: "av-sil", d: poly([[xa, y0 + 3 * q], [xa + 3.4 * q, y0 + 3 * q], [xa + 3.4 * q, y1 - .8 * q], [xa, y1 - .8 * q]]) }, lf); return lf; }; return [mk(d0), mk(d0 + 3.4 * q), d0 + 3.4 * q]; });
      e._w = w; e._h = ch + 6 * q; return e;
    };
    const train = mkTrain(lifeM, 3), trY2 = vy - train._h, trA = stX + 4 * q, trZ = vEnd - train._w - 6 * q;
    place(train, vEnd - train._w - 6 * q, trY2);
    if (tlM) { train.style.opacity = 0; tlM.set(train, { x: trA * s }, tm.light - .1).to(train, { opacity: 1, duration: .4, ease: "none" }, tm.light);   // espera en el andén con las luces encendidas tlM.fromTo(train, { x: trA * s }, { x: trZ * s, duration: tm.panD - 1.2, ease: "sine.inOut", immediateRender: false }, tm.pan + .6);
      // la punta del tren va trazando la vía: el viaducto y sus pilas aparecen justo donde llega el morro
      const xS = stX + stW, t1 = tm.pan + .6, D1 = tm.panD - 1.2, n1a = trA + train._w, n1b = trZ + train._w, vp = paths(viaE);
      vp.forEach((p2) => { p2.style.strokeDasharray = p2._L; p2.style.strokeDashoffset = p2._L; });
      tlM.fromTo(vp, { strokeDashoffset: (i, t) => t._L - (n1a - xS) }, { strokeDashoffset: (i, t) => t._L - (n1b - xS) - 10, duration: D1, ease: "sine.inOut", immediateRender: false }, t1);
      pierEls.forEach((pe) => show(tlM, pe[1], t1 + D1 * Math.acos(1 - 2 * clamp((pe[0] - n1a) / (n1b - n1a), 0, 1)) / Math.PI + .05, .3, .5)); }

    // =====================================================================
    // 5 · TORRE 2 — sótanos, núcleo por delante, podio, cuerpo en voladizo, diagonales y corona
    // =====================================================================
    const ox = PAN + (v ? 118 : Math.round(Wn * .53)), bw2 = v ? 33 : 58, ex2 = v ? 16 : 28, ey2 = v ? 8 : 14, fh2 = v ? 26 : 30;
    const p3 = (a, b, z) => [ox + a * bw2 + b * ex2, G - b * ey2 - z], Z = (k) => k * fh2;
    const ext = (k) => k < 2 ? [-1.2, 4.2, 0, 2] : k >= 8 && k < 11 ? [-1, 3, 0, 2] : k === 15 ? [.5, 2.5, .3, 1.7] : k > 15 ? null : [0, 3, 0, 2];
    const tA = (k) => tm.f2 + k * d2, cot2 = E("g", {}, L.cotas);
    // excavación y sótanos (se ven enteros cuando la cámara baja al final)
    const bfh = fh2 * .9, pxa = p3(-1.2, 0, 0)[0], pxb = p3(4.2, 0, 0)[0], yB1 = G + bfh, yB2 = G + 2 * bfh, PL = DOWN * .3;
    {
      const g = L.sub, walls = pen().l(pxa, G, pxa, yB2 + 4 * q, 0, .4).l(pxa - 4 * q, G, pxa - 4 * q, yB2 + 4 * q, 0, .4).l(pxb, G, pxb, yB2 + 4 * q, 0, .4).l(pxb + 4 * q, G, pxb + 4 * q, yB2 + 4 * q, 0, .4);
      const slabs = pen().l(pxa - 4 * q, yB2, pxb + 4 * q, yB2, 1, .5).l(pxa - 4 * q, yB2 + 4 * q, pxb + 4 * q, yB2 + 4 * q, 1, .5).l(pxa, yB1, pxb, yB1, 0, .4).l(pxa, yB1 + 2.6 * q, pxb, yB1 + 2.6 * q, 0, .4);
      const cols = pen(), piles = pen(), hat = pen();
      for (let a = -1; a <= 4; a++) { const x = p3(a, 0, 0)[0]; cols.l(x - 1.6 * q, G, x - 1.6 * q, yB2, 0, .2).l(x + 1.6 * q, G, x + 1.6 * q, yB2, 0, .2); piles.c([[x - 4 * q, yB2 + 4 * q], [x - 2.4 * q, yB2 + PL - 7 * q], [x, yB2 + PL], [x + 2.4 * q, yB2 + PL - 7 * q], [x + 4 * q, yB2 + 4 * q]]); }
      for (let x = pxa - 4 * q; x < pxb + 4 * q; x += 7 * q) hat.l(x, yB2 + 4 * q, x + 4 * q, yB2, 0, 0);
      draw(tlM, S(g, walls, ""), tm.b0, .5, "power1.in"); draw(tlM, S(g, piles, "av-t"), tm.b0 + .35, .6); draw(tlM, S(g, slabs, ""), tm.b0 + .7, .5); draw(tlM, S(g, hat, "av-m av-t"), tm.b0 + .9, .4); draw(tlM, S(g, cols, "av-t"), tm.b0 + 1.1, .4);
      // carros en el estacionamiento
      const car = (x, y) => pen().raw(`M${f(x)} ${f(y)}h${f(20 * q)}v${f(-4 * q)}q${f(-1 * q)} ${f(-1.4 * q)} ${f(-3.4 * q)} ${f(-1.6 * q)}l${f(-2.6 * q)} ${f(-3.4 * q)}h${f(-6.6 * q)}l${f(-3 * q)} ${f(3.4 * q)}q${f(-3.6 * q)} ${f(.2 * q)} ${f(-4.4 * q)} ${f(1.8 * q)}z`, 62 * q).o(x + 4.6 * q, y, 1.7 * q).o(x + 15.4 * q, y, 1.7 * q);
      const cars = E("g", {}, g); [[.1, yB1], [2.3, yB1], [1.2, yB2], [3.1, yB2]].forEach((c) => S(cars, car(p3(c[0], 0, 0)[0] + 6 * q, c[1] - 2.6 * q), "av-t")); draw(tlM, cars, tm.b0 + 1.5, .5);
      [[yB1, v ? "N−3" : "N−3.00"], [yB2, v ? "N−6" : "N−6.00"]].forEach((n, i) => show(tlM, mkTag(g, pxb + 7 * q, n[0], n[1], 1), tm.b0 + 1.2 + i * .15, .3));
      ground3(p3(4.2, 0, 0)[0], p3(4.2, 2, 0)[0], 2 * ey2, tm.b0 + 1.3, v ? 18 : 34);
    }
    // núcleo de ascensores: sube un par de pisos por delante de las losas, con su encofrado trepante
    {
      const g = E("g", {}, L.b2), c0 = [1.15, .6], c1 = [1.85, 1.4];
      for (let k = 0; k < NF2; k++) {
        const z0 = Z(k), z1 = Z(k + 1), cp = pen().p(p3(c0[0], c0[1], z0), p3(c0[0], c0[1], z1), 0, .3).p(p3(c1[0], c0[1], z0), p3(c1[0], c0[1], z1), 0, .3).p(p3(c1[0], c1[1], z0), p3(c1[0], c1[1], z1), 0, .3).p(p3(c0[0], c0[1], z1), p3(c1[0], c0[1], z1), 0, .3).p(p3(c1[0], c0[1], z1), p3(c1[0], c1[1], z1), 0, .3);
        draw(tlM, S(g, cp, k === 11 ? "" : "av-t"), Math.max(tm.b0 + 1.5, tA(k) - 2.3 * d2), d2 * .9, "none");
      }
      if (tlM) {
        const a = p3(c0[0], c0[1], 0), b = p3(c1[0], c0[1], 0), c = p3(c1[0], c1[1], 0), form = E("g", {}, L.b2top);
        S(form, pen().box([[a[0] - 3 * q, a[1]], [b[0] + 3 * q, b[1]], [b[0] + 3 * q, b[1] - 8 * q], [a[0] - 3 * q, a[1] - 8 * q]], .4).p([b[0] + 3 * q, b[1]], [c[0] + 3 * q, c[1]], 0, 0).p([b[0] + 3 * q, b[1] - 8 * q], [c[0] + 3 * q, c[1] - 8 * q], 0, 0).p([c[0] + 3 * q, c[1]], [c[0] + 3 * q, c[1] - 8 * q], 0, 0), "av-o", true);
        const tS = tm.b0 + 1.5, tZ = tA(NF2 - 1) - 1.4 * d2;
        form.style.opacity = 0; tlM.to(form, { opacity: 1, duration: .2, ease: "none" }, tS).fromTo(form, { y: 0 }, { y: -Z(NF2), duration: tZ - tS, ease: "none", immediateRender: false }, tS).to(form, { opacity: 0, duration: .25, ease: "none" }, tZ);
      }
    }
    const L2a = lights.length, lifts2 = [];
    for (let k = 0; k < NF2; k++) {
      const e = ext(k), nx = ext(k + 1), [a0, a1, b0, b1] = e, z0 = Z(k), z1 = Z(k + 1), a = tA(k), open = k === 11, g = E("g", {}, L.b2);
      const exposed = !nx || k + 1 === 11 || nx[0] > a0 || nx[1] < a1 || nx[2] > b0 || nx[3] < b1;
      const as = [a0]; for (let i = Math.ceil(a0 + .01); i < a1 - .01; i++) as.push(i); as.push(a1);
      const bs = [b0]; for (let j = Math.ceil(b0 + .01); j < b1 - .01; j++) bs.push(j); bs.push(b1);
      const oc = E("path", { class: "av-occ", d: poly(exposed ? [p3(a0, b0, z0), p3(a1, b0, z0), p3(a1, b1, z0), p3(a1, b1, z1), p3(a0, b1, z1), p3(a0, b0, z1)] : [p3(a0, b0, z0), p3(a1, b0, z0), p3(a1, b1, z0), p3(a1, b1, z1), p3(a1, b0, z1), p3(a0, b0, z1)]) }, g);
      const col = pen(), gh = pen(), sl = pen(), th2 = 3 * q, bold = k < 2 || (k >= 8 && k < 11);
      as.forEach((u) => col.p(p3(u, b0, z0), p3(u, b0, z1), 1.8)); bs.slice(1).forEach((w) => col.p(p3(a1, w, z0), p3(a1, w, z1), 1.8));
      bs.slice(1).forEach((w) => gh.p(p3(a0, w, z0), p3(a0, w, z1), .8)); as.slice(1, -1).forEach((u) => gh.p(p3(u, b1, z0), p3(u, b1, z1), .8));
      sl.p(p3(a0, b0, z1), p3(a1, b0, z1), 3).p(p3(a1, b0, z1), p3(a1, b1, z1), 3).p(p3(a0, b0, z1 - th2), p3(a1, b0, z1 - th2), .8).p(p3(a1, b0, z1 - th2), p3(a1, b1, z1 - th2), .8);
      if (exposed) sl.p(p3(a0, b0, z1), p3(a0, b1, z1), 2.6).p(p3(a0, b1, z1), p3(a1, b1, z1), 2.6); else gh.p(p3(a0, b0, z1), p3(a0, b1, z1), .8).p(p3(a0, b1, z1), p3(a1, b1, z1), .8);
      draw(tlM, S(g, col, bold ? "av-r" : ""), a, d2 * .5);
      const ghE = S(g, gh, "av-t av-dim"); draw(tlM, ghE, a + .05, d2 * .5);
      draw(tlM, S(g, sl, bold ? "av-r" : ""), a + d2 * .5, d2 * .42);
      lifts2.push({ a, d: d2, x: ox + (clamp([1, 2, 0][k % 3], Math.ceil(a0), Math.floor(a1) - 1) + .5) * bw2, y: G - z1 - 2 });
      const tf = Math.min(a + 2.7, tm.top2 + .35 + (k - NF2 + 5) * .17);
      if (open) { oc.remove(); hide(tlM, ghE, tf, .3); continue; }
      show(tlM, oc, tf, .25); hide(tlM, ghE, tf, .25);
      // fachada por zonas: vitrina en el podio, lamas, bandas corridas y el cuerpo volado con más despiece
      const fr = pen(), zb = k === 0 ? [.04, .8] : bold ? [.16, .86] : [.26, .8], quads = [];
      const cellF = (u0, u1) => [p3(u0, b0, z0 + fh2 * zb[1]), p3(u1, b0, z0 + fh2 * zb[1]), p3(u1, b0, z0 + fh2 * zb[0]), p3(u0, b0, z0 + fh2 * zb[0])];
      const cellS = (w0, w1) => [p3(a1, w0, z0 + fh2 * zb[1]), p3(a1, w1, z0 + fh2 * zb[1]), p3(a1, w1, z0 + fh2 * zb[0]), p3(a1, w0, z0 + fh2 * zb[0])];
      if (k === 1) { // lamas del estacionamiento del podio
        for (let i = 1; i < 6; i++) fr.p(p3(a0 + .08, b0, z0 + fh2 * i / 6.4), p3(a1 - .08, b0, z0 + fh2 * i / 6.4), 0, .3).p(p3(a1, b0 + .08, z0 + fh2 * i / 6.4), p3(a1, b1 - .08, z0 + fh2 * i / 6.4), 0, .2);
      } else {
        for (let i = 0; i < as.length - 1; i++) { const m = (as[i + 1] - as[i]) * .1, c = cellF(as[i] + m, as[i + 1] - m); quads.push(c); fr.box(c, .6); (bold && k > 1 ? [.33, .67] : [.5]).forEach((u) => fr.p(bil(c, u, 0), bil(c, u, 1), 0, 0)); }
        for (let j = 0; j < bs.length - 1; j++) { const m = (bs[j + 1] - bs[j]) * .14, c = cellS(bs[j] + m, bs[j + 1] - m); quads.push(c); fr.box(c, .6); fr.p(bil(c, .5, 0), bil(c, .5, 1), 0, 0); }
        if (k === 0) fr.p(p3(a0, b0, z0 + fh2 * .9), p3(a1, b0, z0 + fh2 * .9), 0, .3);
      }
      draw(tlM, S(g, fr, "av-t"), tf + .05, .4);
      const lg = E("g", {}, g); quads.forEach((c) => mkLight(c, lg));
      if (k % 2 === 1 && k < NF2 - 1) { const tg = mkTag(cot2, p3(-1.2, 0, 0)[0] - 8 * q, G - z1, "N+" + (v ? String(3 * (k + 1)) : (3 * (k + 1)).toFixed(2))); show(tlM, tg, a + d2 * .8, .25); }
      if (k > 1 && k % 2 === 0) worker(L.gente, p3(a0 + .55 + (k % 3) * .7, b0, z0)[0], p3(0, b0, z0)[1], a, a + d2 * 2.4, fh2 * .62);
    }
    {
      // megadiagonales, puntales del voladizo, terraza y corona
      const g = L.b2top, z = Z, dg = pen().c([p3(0, 0, z(2)), p3(3, 0, z(5)), p3(0, 0, z(8))]), dgs = pen().p(p3(3, 0, z(2)), p3(3, 2, z(8)), 1).p(p3(3, 2, z(2)), p3(3, 0, z(8)), 1);
      draw(tlM, S(g, dg, "av-r"), tA(4), d2 * 5, "none"); draw(tlM, S(g, dgs, ""), tA(5), d2 * 3.4, "none");
      const du = pen().p(p3(0, 0, z(12)), p3(3, 0, z(15)), 1).p(p3(3, 0, z(12)), p3(0, 0, z(15)), 1).p(p3(3, 0, z(12)), p3(3, 2, z(15)), 1).p(p3(3, 2, z(12)), p3(3, 0, z(15)), 1);
      draw(tlM, S(g, du, ""), tA(13), d2 * 2.6, "none");
      const strut = pen().p(p3(0, 0, z(5.6)), p3(-1, 0, z(8)), 1.5).p(p3(0, 0, z(6.6)), p3(-.52, 0, z(8)), 1);
      draw(tlM, S(g, strut, "av-b"), tA(8) - .25, .5);
      const sgh = S(g, pen().p(p3(0, 2, z(5.6)), p3(-1, 2, z(8)), 1), "av-t av-dim"); draw(tlM, sgh, tA(8) - .15, .5);
      // terraza del piso abierto: baranda y dos árboles
      const tr = pen(), zt = z(11), rh = 7 * q;
      tr.p(up(p3(-1, 0, zt), rh), up(p3(0, 0, zt), rh), 1, .3).p(up(p3(-1, 0, zt), rh), up(p3(-1, 2, zt), rh), 1, .3);
      for (let i = 0; i <= 6; i++) tr.p(p3(-1 + i / 6, 0, zt), up(p3(-1 + i / 6, 0, zt), rh), 0, 0);
      [[-.62, .55], [-.4, 1.35]].forEach((t2) => { const b = p3(t2[0], t2[1], zt); tr.l(b[0], b[1], b[0], b[1] - 10 * q, 0, .3).o(b[0], b[1] - 15 * q, 5.5 * q).o(b[0] + 3 * q, b[1] - 12 * q, 3.4 * q); });
      for (let i = 0; i <= 9; i++) tr.p(p3(i / 3, 0, zt), up(p3(i / 3, 0, zt), rh), 0, 0); tr.p(up(p3(0, 0, zt), rh), up(p3(3, 0, zt), rh), 1, .3).p(up(p3(3, 0, zt), rh), up(p3(3, 2, zt), rh), 1, .3);
      draw(tlM, S(g, tr, "av-t"), tA(12) + .3, .7);
      {
        const zp = z(2), pd = pen(), A = p3(3.28, .35, zp), B = p3(4.05, .35, zp), C = p3(4.05, 1.65, zp), D2 = p3(3.28, 1.65, zp);
        pd.box([A, B, C, D2], .4).box([p3(3.34, .45, zp), p3(3.99, .45, zp), p3(3.99, 1.55, zp), p3(3.34, 1.55, zp)], 0);
        [.75, 1.05, 1.35].forEach((b) => pd.p(p3(3.44, b, zp), p3(3.9, b, zp), 0, 0));
        [[-.85, .55], [-.45, 1.4], [-.9, 1.5]].forEach((t2) => { const b = p3(t2[0], t2[1], zp); pd.l(b[0], b[1], b[0], b[1] - 8 * q, 0, 0).raw(circ(b[0], b[1] - 12 * q, 4.6 * q), 30 * q).raw(circ(b[0], b[1] - 12 * q, 1.4 * q), 9 * q); });
        [[-1.1, .2], [-.15, .2]].forEach((c) => pd.p(p3(c[0], c[1], zp), up(p3(c[0], c[1], zp), 4 * q), 0, 0)); pd.p(up(p3(-1.2, 0, zp), 4 * q), up(p3(0, 0, zp), 4 * q), 0, .2).p(up(p3(3, 0, zp), 4 * q), up(p3(4.2, 0, zp), 4 * q), 0, .2).p(up(p3(4.2, 0, zp), 4 * q), up(p3(4.2, 2, zp), 4 * q), 0, .2);
        // marquesina de acceso y lamas de la corona
        const c0 = p3(1, 0, z(.8)), c1 = p3(2, 0, z(.8)); pd.l(c0[0], c0[1], c1[0], c1[1], 0, 0).l(c0[0] - 4 * q, c0[1] + 5 * q, c1[0] - 4 * q, c1[1] + 5 * q, 0, 0).l(c0[0], c0[1], c0[0] - 4 * q, c0[1] + 5 * q, 0, 0).l(c1[0], c1[1], c1[0] - 4 * q, c1[1] + 5 * q, 0, 0).l(c0[0] - 3 * q, c0[1] + 5 * q, c0[0] - 3 * q, G, 0, 0).l(c1[0] - 5 * q, c1[1] + 5 * q, c1[0] - 5 * q, G, 0, 0);
        for (let i = 1; i < 5; i++) pd.p(p3(.56, .3, z(15) + fh2 * i / 5.4), p3(2.44, .3, z(15) + fh2 * i / 5.4), 0, 0);
        draw(tlM, S(g, pd, "av-t"), tm.top2 + .4, .9);
      }
      // corona: mástil con baliza y marco del remate
      const tp = p3(1.5, 1, z(16)), sh = 40 * q, sp = pen().l(tp[0], tp[1], tp[0], tp[1] - sh, 0, .4).l(tp[0] - 5 * q, tp[1] - sh * .4, tp[0] + 5 * q, tp[1] - sh * .4, 0, 0).l(tp[0] - 3 * q, tp[1] - sh * .66, tp[0] + 3 * q, tp[1] - sh * .66, 0, 0).l(tp[0] - 9 * q, tp[1], tp[0], tp[1] - sh * .4, 0, 0).l(tp[0] + 9 * q, tp[1], tp[0], tp[1] - sh * .4, 0, 0);
      const rail = pen(), zr = z(15); [[0, 0], [3, 0], [3, 2], [0, 2]].forEach((c, i, arr) => { const n = arr[(i + 1) % 4]; rail.p(up(p3(c[0], c[1], zr), 5 * q), up(p3(n[0], n[1], zr), 5 * q), 1, .3).p(p3(c[0], c[1], zr), up(p3(c[0], c[1], zr), 5 * q), 0, 0); });
      draw(tlM, S(g, rail, "av-t"), tm.top2, .5); draw(tlM, S(g, sp, ""), tm.leave2 + 1.3, .6);
      var beacon2 = S(g, pen().o(tp[0], tp[1] - sh - 2.6 * q, 2.2 * q), "av-h", true); show(tlM, beacon2, tm.leave2 + 1.8, .2);
    }
    const cx2 = p3(4.2, 2, 0)[0] + 40 * q;
    mkCrane({ cx: cx2, mastH: NF2 * fh2 + 56 * q, fh: fh2, reach: ox - bw2, xPick: ox + bw2 * 1.5, t: tm.crane2, leave: tm.leave2, lifts: lifts2 });
    mkN0(cot2, cx2 + (v ? 15 : 30), tm.crane2 + 1.3); mkMan(cx2 - (v ? 14 : 20), tm.b0 + 1.4);
    hide(tlM, cot2, tm.clean2, .7);
    shuffle(lights.slice(L2a)).forEach((m, i, arr) => show(tlM, m, tm.light2 + i * (1.7 / arr.length), .2));

    // =====================================================================
    // 6 · SUBSUELO — la cámara baja y el metro nos lleva a la derecha, hasta la estación de la torre 3
    // =====================================================================
    const c3 = PAN + PAN2 + AX, R3 = v ? 58 : 92, ry3 = R3 * .3, fh3 = v ? 26 : 30;
    const longs = [], escs = [], tuY = G + DOWN - (v ? 96 : 200), tuH = v ? 40 : 58, UP = Math.max(60, NF3 * fh3 - (v ? 300 : 350)), mY0 = tuY + tuH - 5 * q - (20 * q);
    if (tlM) {
      tlM.to(cam, { y: DOWN, duration: tm.downD, ease: "sine.inOut" }, tm.down);
      tlM.fromTo(cam, { x: PAN }, { x: PAN + PAN2, duration: tm.underD, ease: "sine.inOut", immediateRender: false }, tm.under);
      tlM.fromTo(cam, { k: 1 }, { k: .93, duration: tm.underD * .3, ease: "sine.inOut", immediateRender: false }, tm.under + tm.underD * .2).fromTo(cam, { k: .93 }, { k: 1, duration: tm.underD * .3, ease: "sine.inOut", immediateRender: false }, tm.under + tm.underD * .56);
      { const t0s = tm.under + tm.underD, kS = v ? 1.25 : 1.5;   // la cámara se acerca a la estación: se ve la gente, los torniquetes, las escaleras
        tlM.set(cam, { ay: tuY - DOWN + 4 * q }, t0s - .3).fromTo(cam, { k: 1 }, { k: kS, duration: tm.hS * .42, ease: "sine.inOut", immediateRender: false }, t0s - .2).fromTo(cam, { k: kS }, { k: 1, duration: tm.hS * .3, ease: "sine.inOut", immediateRender: false }, t0s + tm.hS * .66).set(cam, { ay: G }, tm.rise); }
      tlM.fromTo(cam, { y: DOWN }, { y: 0, duration: tm.riseD, ease: "sine.inOut", immediateRender: false }, tm.rise);
      tlM.fromTo(cam, { y: 0 }, { y: -UP, duration: NF3 * d3 * .82, ease: "sine.inOut", immediateRender: false }, tm.f3 + NF3 * d3 * .2);
      tlM.fromTo(cam, { y: -UP }, { y: FY / KZ, duration: tm.zoomD, ease: "power2.inOut", immediateRender: false }, tm.zoom);
      tlM.fromTo(cam, { k: 1 }, { k: KZ, duration: tm.zoomD * .4, ease: "sine.inOut", immediateRender: false }, tm.zoom + tm.zoomD * .6);
    }
    {
      const g = L.sub, x0 = PAN - 60, x1 = WX2 + 60, n = 6, tA2 = [], tB2 = [];
      for (let i = 0; i <= n; i++) { tA2.push([x0 + (x1 - x0) * i / n, tuY + (R() - .5)]); tB2.push([x0 + (x1 - x0) * i / n, tuY + tuH + (R() - .5)]); }
      longs.push(S(g, pen().c(tA2).c(tB2), "av-r"));
      // estación: caja con losa de techo, mezanina, andén; todo antes para poder dejarle hueco a las tramas
      const sx0 = c3 - R3 - 150 * q, sx1 = c3 + R3 + 150 * q, ym = tuY - 12 * q, vt = ym - 30 * q, platY = mY0 + 15.4 * q, xs = sx0 + 26 * q, sxT = xs + 18 * q, Hs = ym - G;
      const inSt = (x, y) => x > sx0 - 14 * q && x < sx1 + 60 * q && y > vt - 12 * q, inStair = (x, y) => x > xs - Hs * .5 - 30 * q && x < xs + 40 * q && y < ym + 10 * q && y > G;
      const skip = (x, y) => (x > pxa - 30 && x < pxb + 80 * q && y < yB2 + PL + 14 * q) || inSt(x, y) || inStair(x, y) || (y > tuY - 12 * q && y < tuY + tuH + 12 * q);
      // revestimiento del túnel: doble línea con juntas de dovela
      const lin = pen().l(x0, tuY - 4 * q, x1, tuY - 4 * q, 0, .5).l(x0, tuY + tuH + 4 * q, x1, tuY + tuH + 4 * q, 0, .5);
      const linJ = pen(), trayJ = pen(), tJ = tm.under + tm.underD * .8; for (let x = x0 + 20; x < x1; x += 38 * q) linJ.l(x, tuY - 4 * q, x, tuY, 0, 0).l(x, tuY + tuH, x, tuY + tuH + 4 * q, 0, 0);
      longs.push(S(g, lin, "av-t")); show(tlM, S(g, linJ, "av-t av-dim"), tJ, .9, .6);
      // vía: riel sobre durmientes; bandeja de cables con sus soportes y luminarias en la clave
      const ry0 = tuY + tuH - 4.4 * q, trk = pen().l(x0, ry0, x1, ry0, 0, .4).l(x0, ry0 + 1.4 * q, x1, ry0 + 1.4 * q, 0, .4), slp = pen(), tray = pen().l(x0, tuY + 4.6 * q, x1, tuY + 4.6 * q, 0, .4).l(x0, tuY + 6 * q, x1, tuY + 6 * q, 0, .4);
      for (let x = x0 + 6; x < x1; x += 8 * q) slp.l(x, ry0 + 1.4 * q, x, ry0 + 3.8 * q, 0, 0);
      for (let x = x0 + 30; x < x1; x += 64 * q) { trayJ.l(x, tuY, x, tuY + 4.6 * q, 0, 0); trayJ.box([[x + 24 * q, tuY + 7.4 * q], [x + 36 * q, tuY + 7.4 * q], [x + 36 * q, tuY + 9.2 * q], [x + 24 * q, tuY + 9.2 * q]], 0); }
      // tercer riel con sus aisladores y señales de vía con la luz encendida
      const r3 = pen().l(x0, ry0 - 2.6 * q, x1, ry0 - 2.6 * q, 0, .4), sig = pen(), sigOn = pen();
      for (let x = x0 + 14; x < x1; x += 26 * q) trayJ.l(x, ry0 - 2.6 * q, x, ry0, 0, 0);
      for (let x = x0 + 190 * q; x < x1; x += 380 * q) { if (x > sx0 - 20 * q && x < sx1 + 20 * q) continue; sig.l(x, ry0, x, ry0 - 17 * q, 0, 0).box([[x - 2.4 * q, ry0 - 26 * q], [x + 2.4 * q, ry0 - 26 * q], [x + 2.4 * q, ry0 - 17 * q], [x - 2.4 * q, ry0 - 17 * q]], 0).raw(circ(x, ry0 - 19.4 * q, 1.2 * q), 8 * q); sigOn.raw(circ(x, ry0 - 23.4 * q, 1.3 * q), 9 * q); }
      longs.push(S(g, trk, "av-t"), S(g, tray, "av-t av-dim"), S(g, r3, "av-t av-dim")); show(tlM, S(g, slp, "av-t av-dim"), tJ, .9, .5); show(tlM, S(g, trayJ, "av-t av-dim"), tJ, .9, .6);
      show(tlM, S(g, sig, "av-t"), tJ, .6); show(tlM, S(g, sigOn, "av-h", true), tJ + .3, .4);
      // geotecnia: límites de estrato y su trama convencional (relleno, arcilla, arena, roca)
      const bnd = v ? [G + 70, G + 150, G + 225] : [G + 120, G + 215, G + 300], str = pen(), CH = 420 * q, chunks = new Map(), mk = (li, x) => { const kk = li + "|" + Math.floor((x - x0) / CH); if (!chunks.has(kk)) chunks.set(kk, [li, pen()]); return chunks.get(kk)[1]; }, marks = [0, 1, 2, 3], lims = [G + 16 * q].concat(bnd, [tuY - 12 * q]);
      bnd.forEach((y, i) => { let pts = []; for (let x = x0; x <= x1; x += 90 * q) { const yy = y + Math.sin(x / 90 + i * 2) * 4 * q; if (skip(x, yy)) { if (pts.length > 1) str.c(pts); pts = []; continue; } pts.push([x, yy]); } if (pts.length > 1) str.c(pts); });
      const mark = (li, x, y) => { const m = mk(li, x); if (li === 0) m.l(x, y, x + 7 * q, y, 0, 0); else if (li === 1) m.l(x, y, x + 6 * q, y, 0, 0).l(x + 2 * q, y + 2.4 * q, x + 8 * q, y + 2.4 * q, 0, 0); else if (li === 2) m.raw(circ(x, y, .8 * q), 6 * q).raw(circ(x + 5 * q, y + 2.2 * q, .8 * q), 6 * q); else m.l(x, y + 3 * q, x + 5 * q, y - 3 * q, 0, 0).l(x + 3 * q, y + 3 * q, x + 8 * q, y - 3 * q, 0, 0); };
      for (let li = 0; li < 4; li++) for (let y = lims[li] + 12 * q, r = 0; y < lims[li + 1] - 6 * q; y += 22 * q, r++) for (let x = x0 + (r % 2 ? 35 : 0) * q + 10; x < x1; x += 70 * q) if (!skip(x, y)) mark(li, x, y);
      for (let y = tuY + tuH + 16 * q, r = 0; y < tuY + tuH + (v ? 56 : 110) * q; y += 22 * q, r++) for (let x = x0 + (r % 2 ? 35 : 0) * q + 10; x < x1; x += 70 * q) mark(3, x, y);
      draw(tlM, S(g, str, "av-m av-t"), tm.down + .3, tm.downD + tm.underD * .7, "sine.inOut"); chunks.forEach((c) => show(tlM, S(g, c[1], "av-m av-t"), tm.down + .5 + c[0] * .25, .9, .62));
      const hz = pen(); for (let x = PAN - 20; x < WX2 + 20; x += 40 * q) { if ((x > pxa - 12 * q && x < pxb + 12 * q) || Math.abs(x - c3) < R3 + 24 * q) continue; for (let i = 0; i < 3; i++) hz.l(x + i * 5 * q, G + 2 * q, x + i * 5 * q - 5 * q, G + 8 * q, 0, 0); }
      draw(tlM, S(g, hz, "av-m av-t"), tm.b0 + .3, .5);
      // servicios: colector bajo la calle con sus pozos de visita
      const pipe = pen(), py = G + 24 * q;
      [[x0, pxa - 12 * q], [pxb + 12 * q, xs - Hs * .5 - 40 * q], [sx1 + 70 * q, x1]].forEach((r) => { if (r[1] - r[0] < 60) return; pipe.l(r[0], py, r[1], py, 0, .3).l(r[0], py + 4.6 * q, r[1], py + 4.6 * q, 0, .3); for (let x = r[0] + 40 * q; x < r[1]; x += 110 * q) pipe.l(x, py - 1.4 * q, x, py + 6 * q, 0, 0).l(x + 3 * q, py - 1.4 * q, x + 3 * q, py + 6 * q, 0, 0);
        for (let x = r[0] + 150 * q; x < r[1] - 40 * q; x += 420 * q) { pipe.l(x - 4 * q, G, x - 4 * q, py, 0, 0).l(x + 4 * q, G, x + 4 * q, py, 0, 0).l(x - 6 * q, G + 1.4 * q, x + 6 * q, G + 1.4 * q, 0, 0); for (let yy = G + 5 * q; yy < py - 2 * q; yy += 4 * q) pipe.l(x - 2 * q, yy, x + 2 * q, yy, 0, 0); } });
      draw(tlM, S(g, pipe, "av-t av-dim"), tm.down + .4, tm.downD + tm.underD * .8, "sine.inOut");
      // gálibo del túnel acotado
      { const dxx = sx0 - 130 * q, dg = E("g", {}, g); S(dg, pen().l(dxx, tuY, dxx, tuY + tuH, 2, .2).l(dxx - 3 * q, tuY + 3 * q, dxx + 3 * q, tuY - 3 * q, 0, 0).l(dxx - 3 * q, tuY + tuH + 3 * q, dxx + 3 * q, tuY + tuH - 3 * q, 0, 0), "av-o av-t", true); const tt = T(dg, dxx - 4 * q, tuY + tuH / 2, "5.20", "middle", "av-o av-lv"); tt.setAttribute("transform", `rotate(-90 ${f(dxx - 4 * q)} ${f(tuY + tuH / 2)})`); show(tlM, dg, tm.under + tm.underD * .5, .4); }
      // ---- la estación en corte longitudinal ----
      const tS = tm.under + tm.underD * .5, box = pen(), hat2 = pen();
      box.l(sx0, vt, sx1, vt, 2, .3).l(sx0, vt + 4 * q, sx1, vt + 4 * q, 0, .3).l(sx0, vt, sx0, tuY - 4 * q, 0, .2).l(sx0 - 4 * q, vt, sx0 - 4 * q, tuY - 4 * q, 0, .2).l(sx1, vt, sx1, tuY - 4 * q, 0, .2).l(sx1 + 4 * q, vt, sx1 + 4 * q, tuY - 4 * q, 0, .2);
      for (let x = sx0 + 3 * q; x < sx1; x += 6 * q) hat2.l(x, vt + 4 * q, x + 3 * q, vt, 0, 0);
      // mezanina con los huecos de las escaleras mecánicas
      const vd = [[sx0 + 62 * q, sx0 + 116 * q], [sx1 - 116 * q, sx1 - 62 * q]];
      [[sx0, vd[0][0]], [vd[0][1], vd[1][0]], [vd[1][1], sx1]].forEach((r) => { box.l(r[0], ym, r[1], ym, 0, .3).l(r[0], ym + 3 * q, r[1], ym + 3 * q, 0, .3); for (let x = r[0] + 3 * q; x < r[1] - 2 * q; x += 6 * q) hat2.l(x, ym + 3 * q, x + 2.4 * q, ym, 0, 0); });
      // andén con su borde, franja táctil y columnas
      box.l(sx0, platY, sx1, platY, 0, .3).l(sx0, platY + 2.6 * q, sx1, platY + 2.6 * q, 0, .3);
      for (let x = sx0 + 6 * q; x < sx1 - 6 * q; x += 7 * q) hat2.l(x, platY - 1.6 * q, x + 3.4 * q, platY - 1.6 * q, 0, 0);
      for (let x = sx0 + 36 * q; x < sx1 - 20 * q; x += 46 * q) { if (vd.some((r) => x > r[0] - 6 * q && x < r[1] + 6 * q)) continue; box.l(x - 1.4 * q, ym + 3 * q, x - 1.4 * q, platY, 0, 0).l(x + 1.4 * q, ym + 3 * q, x + 1.4 * q, platY, 0, 0).l(x - 3.4 * q, ym + 5 * q, x + 3.4 * q, ym + 5 * q, 0, 0); }
      draw(tlM, S(g, box, ""), tS, 1.2, "power1.inOut"); show(tlM, S(g, hat2, "av-m av-t"), tS + .6, .6, .7);
      // escaleras mecánicas (andén ↔ mezanina), escalera a la calle en dos tramos, ascensor y pozo de ventilación
      const mov = pen();
      vd.forEach((r, i) => { const a = i ? [r[0], ym] : [r[1], ym], b = i ? [r[1], platY] : [r[0], platY]; mov.l(a[0], a[1], b[0], b[1], 0, .2).l(a[0], a[1] - 3 * q, b[0], b[1] - 3 * q, 0, .2).l(a[0], a[1] - 9 * q, b[0], b[1] - 9 * q, 0, .2); for (let u = .1; u < 1; u += .1) mov.l(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - 3 * q, 0, 0); });
      const m1 = [xs - Hs * .5, ym - Hs * .5]; [[[xs, ym], m1], [m1, [xs, G]]].forEach((fl) => { const a = fl[0], b = fl[1], n = Math.round(Hs * .5 / (7 * q)); mov.l(a[0], a[1], b[0], b[1], 0, .2).l(a[0], a[1] - 9 * q, b[0], b[1] - 9 * q, 0, .2); for (let i = 1; i < n; i++) { const u = i / n; mov.l(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - 2.6 * q, 0, 0); } });
      mov.l(m1[0] - 16 * q, m1[1], m1[0], m1[1], 0, 0).l(m1[0] - 16 * q, m1[1], m1[0] - 16 * q, m1[1] - 9 * q, 0, 0);
      const ex0 = sx1 - 30 * q; mov.l(ex0, platY, ex0, G, 0, .3).l(ex0 + 12 * q, platY, ex0 + 12 * q, G, 0, .3).box([[ex0 + 1.4 * q, ym - 15 * q], [ex0 + 10.6 * q, ym - 15 * q], [ex0 + 10.6 * q, ym - 1 * q], [ex0 + 1.4 * q, ym - 1 * q]], 0).l(ex0 + 6 * q, ym - 15 * q, ex0 + 6 * q, vt + 4 * q, 0, 0);
      const vx3 = sx1 + 44 * q; mov.l(vx3, tuY - 4 * q, vx3, G, 0, .3).l(vx3 + 9 * q, tuY - 4 * q, vx3 + 9 * q, G, 0, .3);
      draw(tlM, S(g, mov, "av-t"), tS + .5, 1.3, "power1.inOut"); vd.forEach((r, i) => escs.push(i ? [r[1], platY, r[0], ym] : [r[0], platY, r[1], ym]));
      // torniquetes, rótulos y bancos
      const fit = pen(), cxm = (sx0 + sx1) / 2;
      for (let i = -2; i <= 2; i++) fit.box([[cxm + i * 9 * q - 1.6 * q, ym - 8 * q], [cxm + i * 9 * q + 1.6 * q, ym - 8 * q], [cxm + i * 9 * q + 1.6 * q, ym], [cxm + i * 9 * q - 1.6 * q, ym]], 0);
      fit.l(cxm - 44 * q, ym - 8 * q, cxm - 22 * q, ym - 8 * q, 0, 0).l(cxm + 22 * q, ym - 8 * q, cxm + 44 * q, ym - 8 * q, 0, 0);
      [-.3, 0, .3].forEach((u) => { const x = cxm + (sx1 - sx0) * u; fit.l(x - 9 * q, ym + 3 * q, x - 9 * q, ym + 7 * q, 0, 0).l(x + 9 * q, ym + 3 * q, x + 9 * q, ym + 7 * q, 0, 0).box([[x - 12 * q, ym + 7 * q], [x + 12 * q, ym + 7 * q], [x + 12 * q, ym + 12 * q], [x - 12 * q, ym + 12 * q]], 0).raw(circ(x - 8 * q, ym + 9.5 * q, 1.5 * q), 10 * q); });
      [.2, .8].forEach((u) => { const x = sx0 + (sx1 - sx0) * u; fit.l(x - 10 * q, platY - 6 * q, x + 10 * q, platY - 6 * q, 0, 0).l(x - 8 * q, platY - 6 * q, x - 8 * q, platY, 0, 0).l(x + 8 * q, platY - 6 * q, x + 8 * q, platY, 0, 0); });
      draw(tlM, S(g, fit, "av-t"), tS + 1, .8);
      {
        // franja de azulejos en el andén, línea de luminarias, reloj, máquinas de boletos, plano de la red y papeleras
        const eq = pen(), y1t = platY - 27 * q, y2t = platY - 21 * q;
        vd.concat([[sx1, sx1]]).reduce((xa2, r) => { if (r[0] - xa2 > 30 * q) { eq.l(xa2 + 4 * q, y1t, r[0] - 4 * q, y1t, 0, 0).l(xa2 + 4 * q, y2t, r[0] - 4 * q, y2t, 0, 0); for (let x = xa2 + 10 * q; x < r[0] - 6 * q; x += 9 * q) eq.l(x, y1t, x, y2t, 0, 0); } return r[1]; }, sx0);
        for (let x = sx0 + 14 * q; x < sx1 - 20 * q; x += 24 * q) { if (vd.some((r) => x > r[0] - 14 * q && x < r[1] + 4 * q)) continue; eq.box([[x, ym + 4.4 * q], [x + 11 * q, ym + 4.4 * q], [x + 11 * q, ym + 5.8 * q], [x, ym + 5.8 * q]], 0); }
        const ckc = sx0 + 36 * q + Math.round((cxm + (sx1 - sx0) * .15 - sx0 - 36 * q) / (46 * q)) * 46 * q, ckx = ckc + 23 * q, ckr = 15 * q, cky = ym + 9 * q + ckr;   // entre dos columnas
        { // reloj de andén: caja de dos caras colgada de la losa, esfera de 60 minutos y la hora real de quien está mirando
          const ck = E("g", {}, g), dz = 3.2 * q, P = (a, r, o) => [ckx + (o || 0) + r * Math.sin(a), cky - (o ? o * .5 : 0) - r * Math.cos(a)];
          // ménsula: dos tirantes desde la losa, travesaño con florón y la argolla de la caja
          const br = pen().l(ckx - 7 * q, ym + 3 * q, ckx - 2 * q, cky - ckr - 4 * q, 0, 0).l(ckx + 7 * q, ym + 3 * q, ckx + 2 * q, cky - ckr - 4 * q, 0, 0).l(ckx - 9 * q, ym + 3 * q, ckx + 9 * q, ym + 3 * q, 0, 0)
            .l(ckx - 4.6 * q, cky - ckr - 4 * q, ckx + 4.6 * q, cky - ckr - 4 * q, 0, 0).raw(circ(ckx, cky - ckr - 2 * q, 1.6 * q), 11 * q).raw(circ(ckx, ym + 6 * q, 1.2 * q), 8 * q);
          S(ck, br, "av-t");
          // caja: la cara trasera asoma corrida (tiene espesor) y se unen por el canto
          E("path", { class: "av-occ", d: circ(ckx + dz, cky - dz * .5, ckr + .8 * q) + circ(ckx, cky, ckr + .8 * q) }, ck);
          const box = pen().raw(circ(ckx + dz, cky - dz * .5, ckr + .6 * q), ckr * 6.6);
          E("path", { class: "av-occ", d: circ(ckx, cky, ckr + .6 * q) }, ck);
          box.l(ckx + (ckr + .6 * q) * Math.cos(-.46), cky + (ckr + .6 * q) * Math.sin(-.46), ckx + dz + (ckr + .6 * q) * Math.cos(-.46), cky - dz * .5 + (ckr + .6 * q) * Math.sin(-.46), 0, 0)
            .l(ckx + (ckr + .6 * q) * Math.cos(2.68), cky + (ckr + .6 * q) * Math.sin(2.68), ckx + dz + (ckr + .6 * q) * Math.cos(2.68), cky - dz * .5 + (ckr + .6 * q) * Math.sin(2.68), 0, 0);
          S(ck, box, "av-t");
          // esfera: bisel doble, 60 minutos, barras horarias (más gruesas en 12, 3, 6 y 9) y la barra naranja del isotipo bajo el centro
          const dial = pen().raw(circ(ckx, cky, ckr + .6 * q), ckr * 6.6).raw(circ(ckx, cky, ckr - .8 * q), ckr * 6.2), bars = pen();
          for (let i2 = 0; i2 < 60; i2++) { const a2 = Math.PI * i2 / 30, hr = i2 % 5 === 0; if (hr) continue; const r1 = ckr - 1.8 * q, r2 = ckr - 2.9 * q; dial.l(ckx + r1 * Math.sin(a2), cky - r1 * Math.cos(a2), ckx + r2 * Math.sin(a2), cky - r2 * Math.cos(a2), 0, 0); }
          for (let i2 = 0; i2 < 12; i2++) { const a2 = Math.PI * i2 / 6, big = i2 % 3 === 0, r1 = ckr - 1.8 * q, r2 = ckr - (big ? 5.6 : 4.6) * q, w2 = (big ? .95 : .62) * q, c2 = Math.cos(a2), s2 = Math.sin(a2);
            bars.raw(`M${f(ckx + r1 * s2 - w2 * c2)} ${f(cky - r1 * c2 - w2 * s2)}L${f(ckx + r1 * s2 + w2 * c2)} ${f(cky - r1 * c2 + w2 * s2)}L${f(ckx + r2 * s2 + w2 * c2)} ${f(cky - r2 * c2 + w2 * s2)}L${f(ckx + r2 * s2 - w2 * c2)} ${f(cky - r2 * c2 - w2 * s2)}Z`, 0); }
          S(ck, dial, "av-t"); E("path", { class: "av-hand", d: bars.d }, ck);
          E("path", { class: "av-hand av-o", d: `M${f(ckx - 2.6 * q)} ${f(cky + 4.4 * q)}h${f(5.2 * q)}v${f(1.1 * q)}h${f(-5.2 * q)}Z` }, ck);
          // agujas afiladas y segundero de andén: naranja, con disco cerca de la punta y contrapeso
          const hand = (len, tail, w0, w1, cls) => { const e2 = E("path", { class: cls, d: `M${f(ckx - w0)} ${f(cky + tail)}L${f(ckx - w1)} ${f(cky - len)}L${f(ckx)} ${f(cky - len - w1)}L${f(ckx + w1)} ${f(cky - len)}L${f(ckx + w0)} ${f(cky + tail)}Z` }, ck); return e2; };
          const hH = hand(ckr * .52, 2.2 * q, .95 * q, .55 * q, "av-hand"), hM = hand(ckr * .8, 2.6 * q, .75 * q, .38 * q, "av-hand");
          const hS = E("path", { class: "av-hand av-o", d: `M${f(ckx - .22 * q)} ${f(cky + 3.6 * q)}V${f(cky - ckr * .62)}H${f(ckx + .22 * q)}V${f(cky + 3.6 * q)}Z` + circ(ckx, cky - ckr * .62, 1.3 * q) + circ(ckx, cky + 3.6 * q, .7 * q) }, ck);
          E("path", { class: "av-hand av-o", d: circ(ckx, cky, .8 * q) }, ck);
          if (gs) ck.classList.add("avila__clock");
          const tick = () => { const d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, h = d.getHours() % 12 + m / 60;
            hH.setAttribute("transform", `rotate(${f(h * 30)} ${f(ckx)} ${f(cky)})`); hM.setAttribute("transform", `rotate(${f(m * 6)} ${f(ckx)} ${f(cky)})`); hS.setAttribute("transform", `rotate(${d.getSeconds() * 6} ${f(ckx)} ${f(cky)})`); };
          tick(); if (gs) amb.push(gs.timeline({ repeat: -1, paused: true, onRepeat: tick }).to({}, { duration: 1 }));
        }
        const mpx = sx1 - 150 * q; eq.box([[mpx, ym - 19 * q], [mpx + 22 * q, ym - 19 * q], [mpx + 22 * q, ym - 6 * q], [mpx, ym - 6 * q]], 0).l(mpx + 3 * q, ym - 15 * q, mpx + 19 * q, ym - 11 * q, 0, 0).l(mpx + 3 * q, ym - 9 * q, mpx + 19 * q, ym - 15 * q, 0, 0).raw(circ(mpx + 11 * q, ym - 12.6 * q, 1.2 * q), 8 * q);
        [.36, .64].forEach((u) => { const x = sx0 + (sx1 - sx0) * u; eq.box([[x, platY - 7 * q], [x + 4 * q, platY - 7 * q], [x + 3.4 * q, platY], [x + .6 * q, platY]], 0); });
        draw(tlM, S(g, eq, "av-t av-dim"), tS + 1.2, .9);
        // otra pieza de Caraqueña, distinta de la valla y del rótulo de azotea: una caja de luz en el andén, como las del metro
        { const aw = 104 * q, ah = 26 * q, ax = cxm - (sx1 - sx0) * .2 - aw / 2, ay = ym + 9 * q, ad = E("g", {}, g), rr2 = ah * .3, ri2 = rr2 * .556, icx2 = ax + ah * .56, icy2 = ay + ah * .46, a1 = -Math.PI / 4, a2 = Math.PI * 1.25, pt2 = (r, a) => `${f(icx2 + r * Math.cos(a))} ${f(icy2 + r * Math.sin(a))}`;
          E("path", { class: "av-occ", d: poly([[ax, ay], [ax + aw, ay], [ax + aw, ay + ah], [ax, ay + ah]]) }, ad);
          S(ad, pen().box([[ax, ay], [ax + aw, ay], [ax + aw, ay + ah], [ax, ay + ah]], 0).l(ax + 12 * q, ay, ax + 12 * q, ym + 3 * q, 0, 0).l(ax + aw - 12 * q, ay, ax + aw - 12 * q, ym + 3 * q, 0, 0), "av-o av-t", true);
          S(ad, pen().raw(`M${pt2(rr2, a1)}A${f(rr2)} ${f(rr2)} 0 1 1 ${pt2(rr2, a2)}L${pt2(ri2, a2)}A${f(ri2)} ${f(ri2)} 0 1 0 ${pt2(ri2, a1)}Z`, rr2 * 9.2), "av-t");
          S(ad, pen().c([[icx2 + rr2 * .52, icy2 + rr2 * .8], [icx2 + rr2 * 1.06, icy2 + rr2 * .8], [icx2 + rr2 * 1.06, icy2 + rr2 * .98], [icx2 + rr2 * .42, icy2 + rr2 * .98]], true), "av-o av-t", true);
          const tx3 = icx2 + rr2 * 1.7, av3 = ax + aw - 6 * q - tx3, fz3 = Math.min(ah * .34, av3 / 6.2);
          const w3 = E("text", { x: f(tx3), y: f(icy2 + fz3 * .12), class: "av-word", style: `font-size:${f(fz3)}px`, textLength: f(Math.min(av3, fz3 * 6.2)), lengthAdjust: "spacingAndGlyphs" }, ad); w3.textContent = "CARAQUEÑA";
          const s3 = E("text", { x: f(tx3 + fz3 * .04), y: f(icy2 + fz3 * .12 + fz3 * .7), class: "av-o av-wsub", style: `font-size:${f(Math.max(3, fz3 * .36))}px` }, ad); s3.textContent = "STUDIO";
          show(tlM, ad, tS + 1.5, .6); }
        // en la calle: baranda de la boca del metro y aparcabicis
        const sr = pen(); sr.l(xs - 46 * q, G - 9 * q, xs - 5 * q, G - 9 * q, 0, .2); for (let x = xs - 46 * q; x <= xs - 5 * q; x += 8.2 * q) sr.l(x, G, x, G - 9 * q, 0, 0);
        for (let i = 0; i < 3; i++) sr.raw(`M${f(xs + (36 + i * 7) * q)} ${f(G)}v${f(-6 * q)}q${f(2.4 * q)} ${f(-3 * q)} ${f(4.8 * q)} 0v${f(6 * q)}`, 20 * q);
        draw(tlM, S(L.terreno, sr, "av-t"), tm.rise + tm.riseD * .6, .6);
      }
      // calle: boca del metro con marquesina, cabina del ascensor y rejilla de ventilación
      const st3 = E("g", {}, L.terreno), sp3 = pen().l(xs - 3 * q, G, xs - 3 * q, G - 22 * q, 0, .2).l(xs + 22 * q, G, xs + 22 * q, G - 22 * q, 0, .2).l(xs - 8 * q, G - 22 * q, xs + 27 * q, G - 24 * q, 0, .2).l(xs - 8 * q, G - 24.4 * q, xs + 27 * q, G - 26.4 * q, 0, .2)
        .box([[ex0 - 1 * q, G], [ex0 + 13 * q, G], [ex0 + 13 * q, G - 20 * q], [ex0 - 1 * q, G - 20 * q]], .6).l(ex0 + 6 * q, G, ex0 + 6 * q, G - 20 * q, 0, 0).l(ex0 - 3 * q, G - 20 * q, ex0 + 15 * q, G - 20 * q, 0, 0)
        .box([[vx3 - 1 * q, G], [vx3 + 10 * q, G], [vx3 + 10 * q, G - 7 * q], [vx3 - 1 * q, G - 7 * q]], .4);
      for (let i = 1; i < 5; i++) sp3.l(vx3 - 1 * q, G - i * 1.4 * q, vx3 + 10 * q, G - i * 1.4 * q, 0, 0);
      draw(tlM, S(st3, sp3, "av-t"), tm.rise + tm.riseD * .5, .8);
      // gente: esperando en el andén y cruzando la mezanina
      const pax = E("g", {}, g), ph3 = (v ? 12 : 17) * q;
      [.05, .93].forEach((u) => mkFig(pax, sx0 + (sx1 - sx0) * u + rnd(-3, 3), platY, ph3, false));
      [.4].forEach((u) => mkFig(pax, sx0 + (sx1 - sx0) * u, ym, ph3, false)); show(tlM, pax, tS + 1.2, .6);
      show(tlM, mkTag(g, sx1 + 62 * q, ym, v ? "N−8" : "N−8.00", 1), tS + 1.2, .3);
      show(tlM, mkTag(g, sx1 + 62 * q, ry0, v ? "N−24" : "N−24.00", 1), tS + 1.4, .3);
      // tótem del metro en la calle
      const tg = E("g", {}, L.terreno); S(tg, pen().l(sxT, G, sxT, G - 30 * q, 0, .2).l(sxT - 3 * q, G, sxT + 3 * q, G, 0, 0).o(sxT, G - 37 * q, 7 * q), "av-t"); T(tg, sxT, G - 37 * q + fs * .36, "M", "middle", "av-o av-lv");
      show(tlM, tg, tm.rise + tm.riseD * .6, .4);
    }
    const metro = mkTrain(lifeF, v ? 4 : 6, "av-h"), mY = mY0, mA = PAN - metro._w - 60, mB = PAN + Wn * (v ? .2 : .42), mC = c3 - metro._w / 2;
    place(metro, mC, mY);
    if (tlM) {
      metro.style.opacity = 0; tlM.to(metro, { opacity: 1, duration: .2, ease: "none" }, tm.down + .5);
      tlM.fromTo(metro, { x: mA * s }, { x: mB * s, duration: 1.5, ease: "power2.out" }, tm.down + .6);
      tlM.fromTo(metro, { x: mB * s }, { x: mC * s, duration: tm.underD, ease: "sine.inOut", immediateRender: false }, tm.under);
      // la punta del metro va trazando el túnel, los rieles y la bandeja; al detenerse en la estación el trazo sigue hasta el fondo
      const lp = longs.map(paths).flat(), xT0 = PAN - 60, off = (nx) => (i, t) => t._L - (nx + metro._w - xT0);
      lp.forEach((p2) => { p2.style.strokeDasharray = p2._L; p2.style.strokeDashoffset = p2._L; });
      tlM.fromTo(lp, { strokeDashoffset: off(mA) }, { strokeDashoffset: off(mB), duration: 1.5, ease: "power2.out", immediateRender: false }, tm.down + .6)
        .fromTo(lp, { strokeDashoffset: off(mB) }, { strokeDashoffset: off(mC), duration: tm.underD, ease: "sine.inOut", immediateRender: false }, tm.under)
        .fromTo(lp, { strokeDashoffset: off(mC) }, { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut", immediateRender: false }, tm.under + tm.underD + .15);
      tlM.fromTo(metro, { opacity: 1 }, { opacity: 0, duration: .4, ease: "none", immediateRender: false }, tm.rise + tm.riseD * .7);
    } else metro.remove();
    hide(tlM, L.sub, tm.rise + tm.riseD * .7, .45);

    // =====================================================================
    // 6b · TORRE 3 — otra estructura: cilindro de anillos y diagrilla, con el isotipo de Caraqueña en la azotea
    // =====================================================================
    const L3a = lights.length, cot3 = E("g", {}, L.cotas), z3 = (k) => G - k * fh3, tF3 = (k) => tm.f3 + k * d3, NC = 8;
    const nd3 = (i, k) => { const th = Math.PI * i / NC; return [c3 + R3 * Math.cos(th), z3(k) + ry3 * Math.sin(th)]; };   // i 0..8: frente, de derecha a izquierda
    const nb3 = (i, k) => { const th = -Math.PI * i / NC; return [c3 + R3 * Math.cos(th), z3(k) + ry3 * Math.sin(th)]; };  // fondo
    const arcL = Math.PI * (3 * (R3 + ry3) - Math.sqrt((3 * R3 + ry3) * (R3 + 3 * ry3))) / 2 + 4;
    const arcF = (y, r, e) => `M${f(c3 - (r || R3))} ${f(y)}A${f(r || R3)} ${f(e || ry3)} 0 0 0 ${f(c3 + (r || R3))} ${f(y)}`, arcB = (y, r, e) => `M${f(c3 - (r || R3))} ${f(y)}A${f(r || R3)} ${f(e || ry3)} 0 0 1 ${f(c3 + (r || R3))} ${f(y)}`;
    const Rs = v ? 25 : 38, trs = 13 * q, lifts3 = [], topY = z3(NF3);
    {
      const g3 = E("g", {}, L.b2), t0 = tm.b3;
      // planta en el terreno: huella, plaza y ejes radiales (así el cilindro pisa)
      const rP = R3 + 20 * q, eP = rP * .3, base = pen().raw(arcF(G), arcL).raw(arcB(G), arcL), plaza = pen().raw(arcF(G, rP, eP), arcL * 1.25).raw(arcB(G, rP, eP), arcL * 1.25);
      for (let i = 0; i < 16; i++) { const th = Math.PI * i / 8; plaza.l(c3 + R3 * Math.cos(th), G + ry3 * Math.sin(th), c3 + rP * Math.cos(th), G + eP * Math.sin(th), 0, 0); }
      draw(tlM, S(L.terreno, base, ""), t0, .8, "power1.inOut"); draw(tlM, S(L.terreno, plaza, "av-t"), t0 + .3, .9, "power1.inOut");
      const radial = pen(); for (let i = 0; i < 8; i++) { const a = nd3(i, 0), b = nb3(8 - i, 0); radial.l(a[0], a[1], b[0], b[1], 0, 0); }
      const radE = S(g3, radial, "av-t av-dim"); draw(tlM, radE, t0 + .5, .6);
      // núcleo central
      const coreG = E("g", {}, g3), rc = R3 * .24, ec = rc * .3;
      for (let k = 0; k < NF3; k++) draw(tlM, S(coreG, pen().l(c3 - rc, z3(k), c3 - rc, z3(k + 1), 0, .15).l(c3 + rc, z3(k), c3 + rc, z3(k + 1), 0, .15).raw(arcF(z3(k + 1), rc, ec), rc * 3.4), "av-t"), Math.max(t0 + 1, tF3(k) - 2 * d3), d3 * .9, "none");
      for (let k = 0; k < NF3; k++) {
        const a = tF3(k), fg = E("g", {}, g3), y0 = z3(k), y1 = z3(k + 1), last = k === NF3 - 1;
        const oc = E("path", { class: "av-occ", d: `M${f(c3 - R3)} ${f(y0)}A${f(R3)} ${f(ry3)} 0 0 0 ${f(c3 + R3)} ${f(y0)}L${f(c3 + R3)} ${f(y1)}` + (last ? `A${f(R3)} ${f(ry3)} 0 0 0 ${f(c3 - R3)} ${f(y1)}Z` : `A${f(R3)} ${f(ry3)} 0 0 1 ${f(c3 - R3)} ${f(y1)}Z`) }, fg);
        const col = pen(), gh = pen(), dg = pen();
        for (let i = 0; i <= NC; i++) col.p(nd3(i, k), nd3(i, k + 1), 1.2, .15);
        for (let i = 1; i < NC; i++) gh.p(nb3(i, k), nb3(i, k + 1), .5, .15);
        for (let i = 0; i < NC; i++) (k + i) % 2 ? dg.p(nd3(i + 1, k), nd3(i, k + 1), 0, .15) : dg.p(nd3(i, k), nd3(i + 1, k + 1), 0, .15);
        draw(tlM, S(fg, col, ""), a, d3 * .5);
        const ghE = S(fg, gh, "av-t av-dim"), bk = E("path", { class: last ? "" : "av-t av-dim", d: arcB(y1) }, fg); bk._L = Math.ceil(arcL);
        draw(tlM, ghE, a + .05, d3 * .5); draw(tlM, bk, a + d3 * .45, d3 * .5);
        const ringE = S(fg, pen().raw(arcF(y1), arcL).raw(arcF(y1 + 3 * q), arcL), ""); draw(tlM, ringE, a + d3 * .4, d3 * .5, "power1.inOut");
        draw(tlM, S(fg, dg, "av-t"), a + d3 * .7, d3 * .6);
        lifts3.push({ a, d: d3, x: c3 + [-.4, .32, 0][k % 3] * R3, y: y1 - 2 });
        const tf = Math.min(a + 2.2, tm.top3 + .3 + (k - NF3 + 5) * .16);
        show(tlM, oc, tf, .25); hide(tlM, ghE, tf, .25); if (!last) hide(tlM, bk, tf, .25);
        if (k === 0) hide(tlM, radE, tf, .25);
        const lg = E("g", {}, fg);
        if (k === 0) { // acceso: puerta doble al centro
          const d0 = nd3(4.5, 0), d1 = nd3(3.5, 0), dh = fh3 * .74; draw(tlM, S(fg, pen().l(d0[0], d0[1], d0[0], d0[1] - dh, 0, 0).l(d1[0], d1[1], d1[0], d1[1] - dh, 0, 0).l(d0[0] - 4 * q, d0[1] - dh, d1[0] + 4 * q, d1[1] - dh, 0, 0).l(d0[0] - 4 * q, d0[1] - dh - 3 * q, d1[0] + 4 * q, d1[1] - dh - 3 * q, 0, 0).l(c3, d0[1] + 1, c3, d0[1] - dh, 0, 0), "av-t"), tf + .1, .4);
        } else for (let i = 1; i < NC - 1; i++) { const c = [nd3(i + 1, k + 1), nd3(i, k + 1), nd3(i, k), nd3(i + 1, k)]; mkLight([bil(c, .16, .22), bil(c, .84, .22), bil(c, .84, .8), bil(c, .16, .8)], lg); }
        if (k % 3 === 2 && !last) show(tlM, mkTag(cot3, c3 - R3 - 8 * q, y1, "N+" + (v ? String(3 * (k + 1)) : (3 * (k + 1)).toFixed(2))), a + d3 * .8, .25);
        if (k > 0 && k % 2 === 0) worker(L.gente, c3 + [-.5, .3, -.1][k % 3] * R3, y0 + ry3 * .8, a, a + d3 * 2.6, fh3 * .62);
      }
      // azotea: antepecho, armadura y el isotipo — anillo abierto arriba y barra naranja
      const gt = L.b2top, tl0 = tm.logo, icy = topY - trs - Rs, ri = Rs * .556, a1 = -Math.PI / 4, a2 = Math.PI * 1.25;
      const pt = (r, a) => `${f(c3 + r * Math.cos(a))} ${f(icy + r * Math.sin(a))}`;
      E("path", { class: "av-occ", d: `M${f(c3 - R3)} ${f(topY)}A${f(R3)} ${f(ry3)} 0 1 0 ${f(c3 + R3)} ${f(topY)}V${f(topY - 5 * q)}A${f(R3)} ${f(ry3)} 0 1 1 ${f(c3 - R3)} ${f(topY - 5 * q)}Z` }, gt).style.opacity = tlM ? 0 : 1;
      if (tlM) tlM.to(gt.lastChild, { opacity: 1, duration: .2, ease: "none" }, tm.top3 + .1);
      const par3 = pen().raw(arcF(topY - 5 * q), arcL).raw(arcB(topY - 5 * q), arcL); for (let i = 0; i <= NC; i++) par3.p(nd3(i, NF3), up(nd3(i, NF3), 5 * q), 0, 0);
      draw(tlM, S(gt, par3, "av-t"), tm.top3 + .1, .6);
      {
        const kM = Math.round(NF3 * .62), yM = z3(kM), rM = R3 + 8 * q, eM = rM * .3, mr2 = pen().raw(arcF(yM, rM, eM), arcL * 1.1).raw(arcF(yM - 6 * q, rM, eM), arcL * 1.1).raw(arcF(yM + 2.4 * q, rM, eM), arcL * 1.1);
        for (let i = 0; i <= 16; i++) { const th = Math.PI * i / 16, x = c3 + rM * Math.cos(th), y = yM + eM * Math.sin(th); mr2.l(x, y, x, y - 6 * q, 0, 0); }
        draw(tlM, S(gt, mr2, "av-t"), tF3(kM) + 1.2, .7);   // mirador: anillo volado con baranda
        const ex3 = pen(), rc2 = R3 + 13 * q, ec2 = rc2 * .3, a0 = Math.PI * .36, a1 = Math.PI * .64, yc = G - fh3 * .86, pA = [c3 + rc2 * Math.cos(a1), yc + ec2 * Math.sin(a1)], pB = [c3 + rc2 * Math.cos(a0), yc + ec2 * Math.sin(a0)];
        ex3.raw(`M${f(pA[0])} ${f(pA[1])}A${f(rc2)} ${f(ec2)} 0 0 0 ${f(pB[0])} ${f(pB[1])}`, rc2).raw(`M${f(pA[0])} ${f(pA[1] + 2.6 * q)}A${f(rc2)} ${f(ec2)} 0 0 0 ${f(pB[0])} ${f(pB[1] + 2.6 * q)}`, rc2).l(pA[0] + 2 * q, pA[1] + 2.6 * q, pA[0] + 2 * q, G + ec2 * .9, 0, 0).l(pB[0] - 2 * q, pB[1] + 2.6 * q, pB[0] - 2 * q, G + ec2 * .9, 0, 0);
        [c3 - R3 - 30 * q, c3 + R3 + 26 * q].forEach((x, i) => ex3.l(x, G, x, G - 15 * q, 0, 0).raw(circ(x, G - 22 * q, 8 * q), 52 * q).raw(circ(x, G - 22 * q, 2.4 * q), 16 * q).box([[x - 6 * q, G], [x + 6 * q, G], [x + 6 * q, G - 3.4 * q], [x - 6 * q, G - 3.4 * q]], 0));
        for (let i = 0; i < 8; i++) { const th = Math.PI * (i + .5) / 8, rb = R3 + 22 * q; ex3.l(c3 + rb * Math.cos(th), G + rb * .3 * Math.sin(th), c3 + rb * Math.cos(th), G + rb * .3 * Math.sin(th) - 4 * q, 0, 0); }   // bolardos
        draw(tlM, S(L.gente, ex3, "av-t"), tm.top3 + .6, .9);
      }
      const tr3 = pen(), bx0 = c3 - Rs * .82, bx1 = c3 + Rs * .82, by = topY + ry3 * .25, ty0 = topY - trs;
      tr3.l(bx0, by, bx0, ty0, 0, .15).l(bx1, by, bx1, ty0, 0, .15).l(bx0 - 6 * q, ty0, bx1 + 6 * q, ty0, 0, .2).l(bx0 - 6 * q, ty0 + 3 * q, bx1 + 6 * q, ty0 + 3 * q, 0, .2).l(bx0, by, bx1, ty0 + 3 * q, 0, .15).l(bx1, by, bx0, ty0 + 3 * q, 0, .15)
        .l(bx0, ty0, c3 - Rs * 1.5, by - ry3 * .9, 0, .15).l(bx1, ty0, c3 + Rs * 1.5, by - ry3 * .9, 0, .15);   // tornapuntas hacia atrás
      draw(tlM, S(gt, tr3, "av-t"), tl0, .6);
      const ring = S(gt, pen().raw(`M${pt(Rs, a1)}A${f(Rs)} ${f(Rs)} 0 1 1 ${pt(Rs, a2)}L${pt(ri, a2)}A${f(ri)} ${f(ri)} 0 1 0 ${pt(ri, a1)}Z`, Rs * 9.2), "av-r", true);
      const rib = pen(); for (let i = 0; i <= 12; i++) { const a = a1 + (a2 - a1) * i / 12; rib.l(c3 + ri * Math.cos(a), icy + ri * Math.sin(a), c3 + Rs * Math.cos(a), icy + Rs * Math.sin(a), 0, 0); }
      const bar = S(gt, pen().c([[c3 + Rs * .52, icy + Rs * .8], [c3 + Rs * 1.06, icy + Rs * .8], [c3 + Rs * 1.06, icy + Rs * .98], [c3 + Rs * .42, icy + Rs * .98]], true), "av-o av-r", true);
      const bh = pen(); for (let i = 1; i < 6; i++) bh.l(c3 + Rs * (.44 + i * .1), icy + Rs * .97, c3 + Rs * (.5 + i * .1), icy + Rs * .81, 0, 0);
      draw(tlM, ring, tl0 + .6, 1.4, "power1.inOut"); draw(tlM, S(gt, rib, "av-t av-dim"), tl0 + 1.3, .8); draw(tlM, bar, tl0 + 1.9, .4); draw(tlM, S(gt, bh, "av-o av-t"), tl0 + 2.1, .3);
      var signGlow = [ring.firstChild, bar.firstChild];
      // obreros en la azotea y uno en la escalera, rematando el logo
      worker(gt, c3 - Rs * 1.3, topY + ry3 * .1, tl0 + .1, null, fh3 * .6); worker(gt, c3 + Rs * 1.42, topY + ry3 * .2, tl0 + .3, null, fh3 * .6);
      const lad = pen(), lx = c3 - Rs * .62; lad.l(lx - 2.4 * q, by, lx - .4 * q, icy + Rs * .3, 0, .15).l(lx + 2.4 * q, by, lx + 4.4 * q, icy + Rs * .3, 0, .15); for (let i = 1; i < 7; i++) lad.l(lx - 2.4 * q + i * .3 * q, by - (by - icy - Rs * .3) * i / 7, lx + 2.4 * q + i * .3 * q, by - (by - icy - Rs * .3) * i / 7, 0, 0);
      const ladE = S(gt, lad, "av-t"); draw(tlM, ladE, tl0 + .4, .4); erase(tlM, ladE, tm.leave3 + .2, .4);
      worker(gt, lx + 1.4 * q, by - (by - icy - Rs * .3) * .52, tl0 + .7, tm.leave3 + .1, fh3 * .56);
      var beacon3 = S(gt, pen().o(c3, icy - Rs - 5 * q, 2 * q), "av-h", true); show(tlM, beacon3, tm.leave3 + 1, .2);
    }
    const cx3 = c3 + R3 + (v ? 32 : 48);
    lifts3.push({ a: tm.logo + .1, d: 1.1, x: c3, y: topY - trs - Rs });
    mkCrane({ cx: cx3, mastH: NF3 * fh3 + trs + 2 * Rs + 34 * q, fh: fh3, reach: c3 - R3 * .6, xPick: c3 - R3 * .3, t: tm.crane3, leave: tm.leave3, lifts: lifts3 });
    mkN0(cot3, cx3 + (v ? 15 : 30), tm.crane3 + 1.3); mkMan(cx3 - (v ? 13 : 20), tm.b3 + 1.2);
    // ---------- junto a la última torre: un estadio al estilo del nuevo Monumental — tambor elíptico de lamas verticales,
    //            cubierta en voladizo que sube hacia afuera, gradas a la vista por encima del borde y torres de iluminación ----------
    if (!v) {
      const g = E("g", {}, L.b2), sx = cx3 + 270 * q, rx = 182 * q, ry = rx * .27, Hf = 78 * q, cr = 26 * q, co = 18 * q, t0 = tm.f3 + .3, tN = tm.zoom + 1.2;
      const fA = (y, r, e) => `M${f(sx - r)} ${f(y)}A${f(r)} ${f(e)} 0 0 0 ${f(sx + r)} ${f(y)}`, bA = (y, r, e) => `M${f(sx - r)} ${f(y)}A${f(r)} ${f(e)} 0 0 1 ${f(sx + r)} ${f(y)}`, aL = (r, e) => Math.PI * (3 * (r + e) - Math.sqrt((3 * r + e) * (r + 3 * e))) + 8;   // perímetro completo (los arcos usan la mitad)
      const P = (th, r, e, y) => [sx + r * Math.cos(th), y + e * Math.sin(th)], yT = G - Hf, yC = yT - cr, rC = rx + co, eC = rC * .27;
      // silueta opaca: tapa la montaña detrás
      E("path", { class: "av-occ", d: `M${f(sx - rC)} ${f(yC)}A${f(rC)} ${f(eC)} 0 0 1 ${f(sx + rC)} ${f(yC)}L${f(sx + rx)} ${f(G)}A${f(rx)} ${f(ry)} 0 0 1 ${f(sx - rx)} ${f(G)}Z` }, g);
      // explanada alrededor y zócalo
      const pz = pen().raw(fA(G, rx + 26 * q, (rx + 26 * q) * .27), aL(rx + 26 * q, (rx + 26 * q) * .27) / 2).raw(fA(G - 4 * q, rx, ry), aL(rx, ry) / 2).raw(fA(G, rx, ry), aL(rx, ry) / 2);
      for (let k = 0; k <= 12; k++) { const th = Math.PI * k / 12, a = P(th, rx, ry, G), b = P(th, rx + 26 * q, (rx + 26 * q) * .27, G); seg2(pz, a, b); }
      draw(tlM, S(g, pz, "av-t"), t0, 1, "power1.inOut");
      // gradas del fondo: anillos que bajan hacia la cancha, con pasillos y el público como puntitos
      const gr = pen(), crowd = pen();
      for (let k = 0; k < 6; k++) { const r = rx - 6 * q - k * 15 * q, y = yT + 4 * q + k * 7 * q; if (r < 40 * q) break; gr.raw(bA(y, r, r * .27), aL(r, r * .27) / 2); for (let a = -.94; a <= -.06; a += .11) { const p1 = P(Math.PI * a, r, r * .27, y), p2 = P(Math.PI * a, r - 15 * q, (r - 15 * q) * .27, y + 7 * q); seg2(gr, p1, p2); }
        for (let a = -.92; a <= -.08; a += .018) { const pp = P(Math.PI * (a + (k % 2) * .009), r - 7 * q, (r - 7 * q) * .27, y + 3.4 * q); crowd.raw(`M${f(pp[0])} ${f(pp[1])}v${f(-1.4 * q)}`, 2 * q); } }
      const fieldY = yT + 4 * q + 6 * 7 * q; gr.raw(bA(fieldY, 64 * q, 64 * q * .27), aL(64 * q, 17 * q) / 2);
      draw(tlM, S(g, gr, "av-t av-dim"), t0 + 1.6, 1.4, "power1.inOut"); const crE = S(g, crowd, "av-t"); crE.style.opacity = 0; show(tlM, crE, tN - .4, .8, .55);
      // fachada: banda frontal opaca y lamas verticales en todo el frente, con el gran pórtico de acceso al centro
      E("path", { class: "av-occ", d: `M${f(sx - rx)} ${f(yT)}A${f(rx)} ${f(ry)} 0 0 0 ${f(sx + rx)} ${f(yT)}L${f(sx + rx)} ${f(G)}A${f(rx)} ${f(ry)} 0 0 1 ${f(sx - rx)} ${f(G)}Z` }, g);
      const fc = pen().raw(fA(yT, rx, ry), aL(rx, ry) / 2).raw(fA(yT + 3 * q, rx, ry), aL(rx, ry) / 2); seg2(fc, [sx - rx, G], [sx - rx, yT]); seg2(fc, [sx + rx, G], [sx + rx, yT]);
      draw(tlM, S(g, fc, ""), t0 + .6, .9);
      const NL = 72, groups = [pen(), pen(), pen(), pen()];
      for (let k = 1; k < NL; k++) { const th = Math.PI * k / NL; if (th > Math.PI * .43 && th < Math.PI * .57) continue; const a = P(th, rx, ry, G - 4 * q), b = P(th, rx, ry, yT + 3 * q); seg2(groups[Math.floor(k / NL * 4)], a, b); seg2(groups[Math.floor(k / NL * 4)], [a[0] + .9 * q, a[1]], [b[0] + .9 * q, b[1]]); }
      groups.forEach((pn, i2) => draw(tlM, S(g, pn, "av-t"), t0 + .9 + i2 * .35, .7, "power1.out"));
      const pa = P(Math.PI * .57, rx, ry, G), pb = P(Math.PI * .43, rx, ry, G), po = pen(), ph = 46 * q;
      seg2(po, [pa[0], pa[1] - 4 * q], [pa[0], pa[1] - ph]); seg2(po, [pb[0], pb[1] - 4 * q], [pb[0], pb[1] - ph]); po.raw(`M${f(pa[0])} ${f(pa[1] - ph)}Q${f((pa[0] + pb[0]) / 2)} ${f(pa[1] - ph - 12 * q)} ${f(pb[0])} ${f(pb[1] - ph)}`, (pb[0] - pa[0]) * 1.2);
      for (let k = 1; k < 7; k++) { const x = pa[0] + (pb[0] - pa[0]) * k / 7; seg2(po, [x, pa[1] - 4 * q], [x, pa[1] - 30 * q]); } seg2(po, [pa[0], pa[1] - 30 * q], [pb[0], pb[1] - 30 * q]);
      for (let k = 0; k < 5; k++) seg2(po, [pa[0] - (6 + k * 4) * q, pa[1] + (1 + k * 2.2) * q], [pb[0] + (6 + k * 4) * q, pb[1] + (1 + k * 2.2) * q]);
      draw(tlM, S(g, po, ""), t0 + 2.2, .9);
      // cubierta: anillo en voladizo que sube hacia afuera; se ve su borde doble, el fondo por encima de las gradas y los nervios por debajo
      E("path", { class: "av-occ", d: `M${f(sx - rC)} ${f(yC)}A${f(rC)} ${f(eC)} 0 0 0 ${f(sx + rC)} ${f(yC)}L${f(sx + rx)} ${f(yT)}A${f(rx)} ${f(ry)} 0 0 1 ${f(sx - rx)} ${f(yT)}Z` }, g);
      const cv = pen().raw(fA(yC, rC, eC), aL(rC, eC) / 2).raw(fA(yC + 3.4 * q, rC, eC), aL(rC, eC) / 2).raw(bA(yC, rC, eC), aL(rC, eC) / 2).raw(bA(yC + 3.4 * q, rC - 4 * q, (rC - 4 * q) * .27), aL(rC, eC) / 2);
      seg2(cv, [sx - rC, yC], [sx - rx, yT]); seg2(cv, [sx + rC, yC], [sx + rx, yT]);
      for (let k = 1; k < 24; k++) { const th = Math.PI * k / 24; seg2(cv, P(th, rx, ry, yT), P(th, rC, eC, yC + 3.4 * q)); }
      draw(tlM, S(g, cv, ""), t0 + 2.8, 1.2, "power1.inOut");
      // torres de iluminación: mástil en celosía desde el borde del fondo, cabezal con su retícula de reflectores (de noche se encienden)
      const lt = pen(), lOn = pen();
      [-.12, -.36, -.64, -.88].forEach((a) => { const b0 = P(Math.PI * a, rC - 2 * q, (rC - 2 * q) * .27, yC), top = G - 268 * q, w0 = 4.2 * q, w1 = 2 * q, x0 = b0[0];
        seg2(lt, [x0 - w0, b0[1]], [x0 - w1, top]); seg2(lt, [x0 + w0, b0[1]], [x0 + w1, top]);
        const n = 16; for (let k = 0; k < n; k++) { const y1 = b0[1] + (top - b0[1]) * k / n, y2 = b0[1] + (top - b0[1]) * (k + 1) / n, wa = w0 + (w1 - w0) * k / n, wb = w0 + (w1 - w0) * (k + 1) / n; seg2(lt, [x0 + (k % 2 ? wa : -wa), y1], [x0 + (k % 2 ? -wb : wb), y2]); }
        const hx = x0 - 13 * q, hy = top - 15 * q; lt.box([[hx, hy], [hx + 26 * q, hy], [hx + 26 * q, hy + 13 * q], [hx, hy + 13 * q]], 0); for (let c2 = 1; c2 < 5; c2++) seg2(lt, [hx + 26 * q * c2 / 5, hy], [hx + 26 * q * c2 / 5, hy + 13 * q]); seg2(lt, [hx, hy + 6.5 * q], [hx + 26 * q, hy + 6.5 * q]); seg2(lt, [x0, hy + 13 * q], [x0, top]);
        for (let c2 = 0; c2 < 5; c2++) for (let r2 = 0; r2 < 2; r2++) lOn.raw(circ(hx + 26 * q * (c2 + .5) / 5, hy + 6.5 * q * (r2 + .5), 1.4 * q), 9 * q); });
      draw(tlM, S(g, lt, "av-t"), t0 + 3.4, 1.6, "power1.out"); const lOnE = S(g, lOn, "av-h", true); show(tlM, lOnE, tN, .5); stLights.push(lOnE);
      // marcador: pantalla sobre el borde del fondo, entre las torres de luz; equipos, reloj del partido, marcador y cinta que corre
      {
        const bw = 128 * q, bh = 50 * q, lh = 16 * q, e = sprite(lifeF, bw, bh + lh, "avila__sp--board"), mid = bw / 2, cid2 = uid + "mq";
        E("path", { class: "av-occ", d: poly([[0, 0], [bw, 0], [bw, bh], [0, bh]]) }, e);
        const fr2 = pen().box([[0, 0], [bw, 0], [bw, bh], [0, bh]], 0).box([[2.4 * q, 2.4 * q], [bw - 2.4 * q, 2.4 * q], [bw - 2.4 * q, bh - 2.4 * q], [2.4 * q, bh - 2.4 * q]], 0)
          .l(2.4 * q, 17 * q, bw - 2.4 * q, 17 * q, 0, 0).l(2.4 * q, 39 * q, bw - 2.4 * q, 39 * q, 0, 0).l(mid - 30 * q, 2.4 * q, mid - 30 * q, 17 * q, 0, 0).l(mid + 30 * q, 2.4 * q, mid + 30 * q, 17 * q, 0, 0)
          .l(bw * .26, bh, bw * .26, bh + lh, 0, 0).l(bw * .26 + 3 * q, bh, bw * .26 + 3 * q, bh + lh, 0, 0).l(bw * .74, bh, bw * .74, bh + lh, 0, 0).l(bw * .74 - 3 * q, bh, bw * .74 - 3 * q, bh + lh, 0, 0).l(bw * .26 + 3 * q, bh + 2 * q, bw * .74 - 3 * q, bh + lh - 2 * q, 0, 0).l(bw * .26 + 3 * q, bh + lh - 2 * q, bw * .74 - 3 * q, bh + 2 * q, 0, 0);
        S(e, fr2, "av-t");
        const tx = (x, y, str, size, cls, anchor) => { const t2 = E("text", { x: f(x), y: f(y), "text-anchor": anchor || "middle", class: cls, style: `font-size:${f(size)}px` }, e); t2.textContent = str; return t2; };
        tx(mid - 46 * q, 12.6 * q, "CCS", 7.4 * q, "av-lv"); tx(mid + 46 * q, 12.6 * q, "VIS", 7.4 * q, "av-lv");
        const clk = tx(mid, 12.6 * q, "89:12", 7.4 * q, "av-o av-lv");
        const dH = tx(mid - 24 * q, 35 * q, "3", 21 * q, "av-o av-lv av-led"), dA = tx(mid + 24 * q, 35 * q, "3", 21 * q, "av-o av-lv av-led"), dS = tx(mid, 33 * q, "–", 14 * q, "av-o av-lv");
        const gol = tx(mid, 35 * q, "¡GOL!", 19 * q, "av-o av-lv av-led"); gol.style.opacity = 0;
        const cp2 = E("clipPath", { id: cid2 }, e); E("path", { d: poly([[3 * q, 39.6 * q], [bw - 3 * q, 39.6 * q], [bw - 3 * q, bh - 3 * q], [3 * q, bh - 3 * q]]) }, cp2);
        const mq = E("g", {}, E("g", { "clip-path": `url(#${cid2})` }, e)), segW = 96 * q;
        for (let k = 0; k < 4; k++) { const t2 = E("text", { x: f(k * segW + 4 * q), y: f(46.4 * q), class: "av-o av-lv", style: `font-size:${f(5.4 * q)}px`, textLength: f(segW - 8 * q), lengthAdjust: "spacingAndGlyphs" }, mq); t2.textContent = "CARACAS 3 – 3 VISITANTE  ·"; }
        const bp = P(-Math.PI / 2, rC, eC, yC); place(e, sx - bw / 2, bp[1] - bh - lh + 2 * q);
        if (tlM) {
          e.style.opacity = 0; tlM.to(e, { opacity: 1, duration: .5, ease: "none" }, t0 + 3.8);
          const tGoal = tm.title - .25; let lastG = -1;
          const gz = (k) => gol.setAttribute("transform", `translate(${f(mid)} ${f(29 * q)}) scale(${(.88 + .12 * k).toFixed(3)}) translate(${f(-mid)} ${f(-29 * q)})`), sm = (x) => x * x * (3 - 2 * x);
          let lastA = null;
          boardUpd = (t) => { // el gol entra con calma: los números se desvanecen, el ¡GOL! crece, late dos veces y se retira dejando el 4–3
            const u = t - tGoal, after = u >= .45;
            if (after !== lastA) { lastA = after; dH.textContent = after ? "4" : "3"; [...mq.children].forEach((t2) => (t2.textContent = u >= 0 ? "¡GOL! CARACAS 4 – 3 VISITANTE  ·" : "CARACAS 3 – 3 VISITANTE  ·")); }
            let k = 0; if (u > 0 && u < 2.6) k = u < .45 ? sm(u / .45) : u < 1.9 ? .8 + .2 * Math.cos((u - .45) / 1.45 * Math.PI * 4) : 1 - sm((u - 1.9) / .7);
            gol.style.opacity = k.toFixed(3); gz(Math.min(1, k * 1.25)); const d = (1 - Math.min(1, k * 1.4)).toFixed(3); [dH, dA, dS].forEach((x) => (x.style.opacity = d)); };
          // el reloj del partido corre de verdad y la cinta se desplaza
          let sec0 = 89 * 60 + 12; amb.push(gs.timeline({ repeat: -1, paused: true, onRepeat: () => { sec0 = sec0 >= 93 * 60 ? 88 * 60 : sec0 + 1; const m2 = Math.floor(sec0 / 60), s2 = sec0 % 60; clk.textContent = (m2 >= 90 ? "90+" + (m2 - 89) : String(m2)) + ":" + String(s2).padStart(2, "0"); } }).to({}, { duration: 1 }));
          amb.push(gs.fromTo(mq, { x: 0 }, { x: -segW, duration: 4.2, ease: "none", repeat: -1, paused: true }));
          // en el estado final, el gol se celebra de nuevo cada tanto
          const celeb = gs.timeline({ repeat: -1, repeatDelay: 8, paused: true, delay: 3 }), gk = { k: 0 };
          celeb.to([dH, dA, dS], { opacity: 0, duration: .5, ease: "sine.inOut" }, 0).to(gk, { k: 1, duration: .5, ease: "sine.out", onUpdate: () => { gol.style.opacity = gk.k; gz(gk.k); } }, 0)
            .to(gol, { opacity: .6, duration: .4, ease: "sine.inOut", repeat: 3, yoyo: true }, .6)
            .to(gol, { opacity: 0, duration: .7, ease: "sine.inOut" }, 2.3).to([dH, dA, dS], { opacity: 1, duration: .7, ease: "sine.inOut" }, 2.4); life.push(celeb);
        } else { dH.textContent = "4"; [...mq.children].forEach((t2) => (t2.textContent = "¡GOL! CARACAS 4 – 3 VISITANTE  ·")); }
      }
      // la franja de luz del borde de la cubierta y gente llegando al pórtico
      const rim = S(g, pen().raw(fA(yC + 1.7 * q, rC - 1 * q, eC), aL(rC, eC) / 2), "av-o av-t", true); show(tlM, rim, tN + .2, .6);
      const pp = E("g", {}, L.gente); [[-22, .5], [-14, .46], [12, .5], [20, .36], [30, .5]].forEach((c) => mkFig(pp, (pa[0] + pb[0]) / 2 + c[0] * q * 1.8, (pa[1] + pb[1]) / 2 + 9 * q, fh * c[1], false)); show(tlM, pp, t0 + 3, .5);
    }
    hide(tlM, cot3, tm.clean3, .7);
    lights.slice(L3a).forEach((m) => show(tlM, m, tm.zoom + tm.zoomD * (.06 + .7 * clamp((m._c[1] - topY) / (G - topY), 0, 1)) + R() * .25, .2));
    if (tlM) {
      tlM.to(hud, { opacity: 0, duration: .5, ease: "none" }, tm.clean3);
      tlM.fromTo(chars, { opacity: 0, yPercent: 38, rotation: -7 }, { opacity: 1, yPercent: 0, rotation: 0, duration: .5, stagger: .045, ease: "back.out(2.2)" }, tm.title);
      tlM.fromTo(sign, { opacity: 0, x: -10 * s }, { opacity: 1, x: 0, duration: .6, ease: "power2.out" }, tm.sign);
      tlM.to({}, { duration: .01 }, tm.end);
    } else { if (hud) hud.style.opacity = 0; cam.x = PAN + PAN2; cam.y = FY / KZ; cam.k = KZ; }

    // =====================================================================
    // 7 · LA CIUDAD VIVA — teleférico, neblina, luna, estrellas, guacamayas, trenes
    // =====================================================================
    const liveB = E("g", {}, L.tele);
    // teleférico: estación en la falda, lomo por donde suben los soportes, doble cable y cabinas colgando
    const sx = v ? Math.max(12, hx - 56) : mapX(.085), sy = footAt(sx) - 4 * q, ux2 = hx - 6 * q, uy2 = hy - 4 * q;
    const cab0 = [sx + 4 * q, sy - 10 * q], cab1 = [ux2, uy2 - 9 * q], cabP = (u) => [cab0[0] + (cab1[0] - cab0[0]) * u, cab0[1] + (cab1[1] - cab0[1]) * u];
    const sag = (u) => (v ? 9 : 17) * q * (1 + Math.sin(u * Math.PI) * .5), terr = [[sx - 12 * q, sy + 6 * q]];
    for (let i = 1; i < 8; i++) { const u = i / 8, pp = cabP(u); terr.push([pp[0], pp[1] + sag(u) + (i % 2 ? 1.6 : -1.2) * q]); }
    terr.push([ux2 + 5 * q, uy2 + 6 * q]);
    const lomo = E("path", { class: "av-g av-t", d: `M${f(terr[0][0])} ${f(terr[0][1])}` + cr(terr, .5) }, liveB); lomo._L = Math.ceil(lomo.getTotalLength() + 4);
    const tp = pen().box([[sx - 9 * q, sy + 6 * q], [sx + 8 * q, sy + 6 * q], [sx + 8 * q, sy - 6 * q], [sx - 9 * q, sy - 6 * q]], .5).l(sx - 12 * q, sy - 6 * q, sx + 11 * q, sy - 11.5 * q, 0, 0).l(sx - 12 * q, sy - 8 * q, sx + 11 * q, sy - 13.5 * q, 0, 0)
      .l(sx - 3 * q, sy + 6 * q, sx - 3 * q, sy - 1 * q, 0, 0).l(sx + 3 * q, sy + 6 * q, sx + 3 * q, sy - 1 * q, 0, 0).l(sx - 3 * q, sy - 1 * q, sx + 3 * q, sy - 1 * q, 0, 0)
      .box([[ux2 - 11 * q, uy2 + 5 * q], [ux2 + 3 * q, uy2 + 5 * q], [ux2 + 3 * q, uy2 - 7 * q], [ux2 - 11 * q, uy2 - 7 * q]], .4).l(ux2 - 13 * q, uy2 - 7 * q, ux2 + 5 * q, uy2 - 10.5 * q, 0, 0).l(ux2 - 7 * q, uy2 + 5 * q, ux2 - 7 * q, uy2 - 2 * q, 0, 0).l(ux2 - 1 * q, uy2 + 5 * q, ux2 - 1 * q, uy2 - 2 * q, 0, 0);
    [.2, .4, .6, .8].forEach((u) => { const pp = cabP(u), by2 = pp[1] + sag(u), ty2 = pp[1] - 2.5 * q, hh = by2 - ty2; tp.l(pp[0] - 1 * q, ty2, pp[0] - 3.6 * q, by2, 0, 0).l(pp[0] + 1 * q, ty2, pp[0] + 3.6 * q, by2, 0, 0).l(pp[0] - 1.9 * q, ty2 + hh * .35, pp[0] + 1.9 * q, ty2 + hh * .35, 0, 0).l(pp[0] - 2.8 * q, ty2 + hh * .7, pp[0] + 2.8 * q, ty2 + hh * .7, 0, 0).l(pp[0] - 1.9 * q, ty2 + hh * .35, pp[0] + 2.8 * q, ty2 + hh * .7, 0, 0).l(pp[0] - 4.5 * q, ty2, pp[0] + 4.5 * q, ty2, 0, 0); });
    const teleE = S(liveB, tp, "av-t"), wire = S(liveB, pen().l(cab0[0], cab0[1], cab1[0], cab1[1], 0, .3).l(cab0[0], cab0[1] - 2.4 * q, cab1[0], cab1[1] - 2.4 * q, 0, .3), "av-t");
    draw(tlM, lomo, 1.5, .9); draw(tlM, wire, 1.8, 1.1); draw(tlM, teleE, 2.2, .9);
    const cabins = [0, 1].map((n) => {
      const e = sprite(lifeB, 20 * q, 26 * q, "avila__sp--glow");
      S(e, pen().l(10 * q, 0, 10 * q, 4 * q, 0, 0).l(10 * q, 4 * q, 7 * q, 9 * q, 0, 0).l(10 * q, 4 * q, 13 * q, 9 * q, 0, 0).raw(`M${f(4 * q)} ${f(9 * q)}h${f(12 * q)}q${f(2.4 * q)} 0 ${f(2.4 * q)} ${f(2.4 * q)}v${f(8 * q)}q0 ${f(2.4 * q)} ${f(-2.4 * q)} ${f(2.4 * q)}h${f(-12 * q)}q${f(-2.4 * q)} 0 ${f(-2.4 * q)} ${f(-2.4 * q)}v${f(-8 * q)}q0 ${f(-2.4 * q)} ${f(2.4 * q)} ${f(-2.4 * q)}`, 54 * q), "av-o");
      S(e, pen().box([[4.6 * q, 11.4 * q], [9.2 * q, 11.4 * q], [9.2 * q, 15.6 * q], [4.6 * q, 15.6 * q]], 0).box([[10.8 * q, 11.4 * q], [15.4 * q, 11.4 * q], [15.4 * q, 15.6 * q], [10.8 * q, 15.6 * q]], 0).l(2.4 * q, 18 * q, 17.6 * q, 18 * q, 0, 0), "av-h av-t");
      const pp = cabP(n ? .72 : .3); place(e, pp[0] - 10 * q, pp[1]);
      return e;
    });
    // luna y estrellas: tan lejos que no se mueven con la cámara
    // estrellas: tan lejos que no se mueven con la cámara (sin luna, por pedido)
    const stars = [], skyB = Math.max(v ? 150 : 150, ry(562) - 26 * q);
    for (let i = 0, tries = 0; i < (v ? 8 : 15) && tries < 90; tries++) {
      const x = rnd(16, Wn - 16), y = rnd(v ? 100 : 74, skyB);
      const z = rnd(2, 3.6) * q, e = sprite(lifeS, 10, 10); S(e, pen().l(5 - z, 5, 5 + z, 5, 0, 0).l(5, 5 - z, 5, 5 + z, 0, 0), "av-t"); place(e, x - 5, y - 5); stars.push(e); i++;
    }
    // neblina: bancos de líneas horizontales que tapan la cresta al pasar, como las nubes que se le montan al Ávila
    const backW = XB + 40;
    const clouds = (v ? [[ry(540) + 2, .5, .2, 240]] : [[ry(548) + 4, .62, .3, 260], [ry(470) - 4, .5, .8, 300]]).map((c) => {
      const w = 230 * c[1], h = 56 * c[1], e = sprite(lifeB, 230, 56); e.setAttribute("width", f(w * s)); e.setAttribute("height", f(h * s));
      const rows = [[70, 150, 6], [34, 186, 15], [58, 222, 24], [8, 196, 33], [44, 170, 42], [92, 140, 50]].map((r) => [r[0] + rnd(-10, 10), r[1] + rnd(-12, 8), r[2]]);
      const under = pen(), over = pen(); rows.forEach((r) => { under.raw(`M${f(r[0])} ${r[2]}H${f(r[1])}`, r[1] - r[0]); over.l(r[0], r[2], r[1], r[2], 0, .5); });
      const u = E("path", { class: "av-under", d: under.d }, e); u._L = 0; S(e, over, "av-t");
      e._c = { y: c[0] - h * .5, w, p: c[2], dur: c[3] }; place(e, -w + (backW + w) * c[2], e._c.y); return e;
    });
    // ---------- SAMÁN junto al titular: tronco corto y grueso, cinco brazos casi horizontales y una copa ancha y plana que
    // crece por colonización del espacio; al final le brotan las hojas, en naranja, y de vez en cuando cae alguna ----------
    const fallers = [];
    {
      const sc = v ? .13 : .215, tW = 1000 * sc, tH = 640 * sc, tx0 = PAN + PAN2 + (v ? 80 : Wn * .4385), e = sprite(lifeF, tW, tH), Rt = rng(41), rr = (a, b) => a + Rt() * (b - a);
      const BX = 500, GY = 600, nodes = [], node = (x, y, parent, g, skel) => { const n = { x, y, parent, g, kids: [], skel }; if (parent) parent.kids.push(n); nodes.push(n); return n; };
      const chain = (from, a0, a1, len, g, wig) => { let n = from, x = from.x, y = from.y; const steps = Math.max(2, Math.round(len / 11)), ph = Rt() * 6.28; for (let i = 1; i <= steps; i++) { const u = i / steps, a = a0 + (a1 - a0) * u * u * (3 - 2 * u) + Math.sin(u * 5.2 + ph) * wig * (1 - u * .4); x += Math.cos(a) * len / steps; y += Math.sin(a) * len / steps; n = node(x, y, n, g, true); } return n; };
      const base = node(BX, GY - 2, null, -1, true), trunkTop = chain(base, -1.51, -1.61, 96, -1, .04);
      [[-2.45, -3.0, 370], [-2.02, -2.55, 290], [-1.66, -1.48, 200], [-1.12, -.6, 290], [-.7, -.14, 370]].forEach((l, g) => chain(trunkTop, l[0], l[1], l[2], g, .15));
      const along = (g, fr) => { const ns = nodes.filter((n) => n.g === g && n.skel); return ns[Math.floor(ns.length * fr)]; };
      [[0, .38, -1.85, -2.15, 230], [0, .7, -2.0, -2.35, 170], [1, .55, -1.62, -1.9, 190], [3, .55, -1.52, -1.24, 190], [4, .38, -1.29, -.99, 230], [4, .7, -1.14, -.8, 170], [2, .65, -1.8, -2.05, 140], [2, .5, -1.34, -1.1, 140]].forEach((c) => chain(along(c[0], c[1]), c[2], c[3], c[4], c[0], .2));
      const cTop = (x) => 70 + 210 * Math.pow(Math.abs((x - BX) / 492), 2.4), cBot = (x) => cTop(x) + 60 + 110 * (1 - Math.pow((x - BX) / 480, 2));
      const attr = []; for (let gd = 0; attr.length < (v ? 170 : 300) && gd < 9000; gd++) { const x = rr(14, 986), y = rr(56, 450); if (y >= cTop(x) && y <= cBot(x)) attr.push([x, y]); }
      const DI = 96, DK = 18, STEP = 14;
      for (let it = 0; it < 90 && attr.length; it++) {
        const pull = new Map();
        for (const a of attr) { let best = null, bd = DI * DI; for (const n of nodes) { if (n.g < 0) continue; const d = (a[0] - n.x) * (a[0] - n.x) + (a[1] - n.y) * (a[1] - n.y); if (d < bd) { bd = d; best = n; } } if (best) { const d = Math.sqrt(bd) || 1; let vv = pull.get(best); if (!vv) pull.set(best, vv = [0, 0]); vv[0] += (a[0] - best.x) / d; vv[1] += (a[1] - best.y) / d; } }
        if (!pull.size) break; const fresh = [];
        pull.forEach((vv, n) => { if (n.kids.length > 2) return; const ddx = vv[0] + rr(-.25, .25), ddy = vv[1] - .18 + rr(-.25, .25), l = Math.hypot(ddx, ddy) || 1; fresh.push(node(n.x + ddx / l * STEP, n.y + ddy / l * STEP, n, n.g, false)); });
        for (let i = attr.length - 1; i >= 0; i--) for (const c of fresh) if ((attr[i][0] - c.x) * (attr[i][0] - c.x) + (attr[i][1] - c.y) * (attr[i][1] - c.y) < DK * DK) { attr.splice(i, 1); break; }
      }
      let maxD = 1; nodes.forEach((n) => { n.d = n.parent ? n.parent.d + Math.hypot(n.x - n.parent.x, n.y - n.parent.y) : 0; maxD = Math.max(maxD, n.d); });
      const NB = 10, X2 = (n) => f(n.x * sc) + " " + f(n.y * sc), T0 = tm.title - 1.7;
      // tronco: contorno de base ensanchada, con unas vetas
      const tk = pen().raw(`M${f((BX - 58) * sc)} ${f(GY * sc)}Q${f((BX - 34) * sc)} ${f((GY - 26) * sc)} ${f((BX - 30) * sc)} ${f((GY - 98) * sc)}`, 110 * sc).raw(`M${f((BX + 60) * sc)} ${f(GY * sc)}Q${f((BX + 32) * sc)} ${f((GY - 26) * sc)} ${f((BX + 28) * sc)} ${f((GY - 98) * sc)}`, 110 * sc)
        .raw(`M${f((BX - 12) * sc)} ${f((GY - 8) * sc)}Q${f((BX - 8) * sc)} ${f((GY - 50) * sc)} ${f((BX - 10) * sc)} ${f((GY - 92) * sc)}`, 90 * sc).raw(`M${f((BX + 14) * sc)} ${f((GY - 6) * sc)}Q${f((BX + 8) * sc)} ${f((GY - 44) * sc)} ${f((BX + 10) * sc)} ${f((GY - 90) * sc)}`, 90 * sc).raw(`M${f((BX - 78) * sc)} ${f(GY * sc)}H${f((BX + 80) * sc)}`, 160 * sc);
      draw(tlM, S(e, tk, ""), T0, .6, "power1.out");
      // ramas por franjas de distancia al tronco: así se ve crecer de adentro hacia afuera
      const bands = Array.from({ length: NB }, () => [pen(), pen(), pen()]);
      nodes.forEach((n) => { if (!n.parent || n.g < 0) return; const b = Math.min(NB - 1, Math.floor(n.d / maxD * NB)), cl = n.skel ? (n.d / maxD < .42 ? 0 : 1) : 2; bands[b][cl].raw(`M${X2(n.parent)}L${X2(n)}`, STEP * sc * 1.4); });
      bands.forEach((bd, i) => bd.forEach((pn, cl) => { if (pn.d) draw(tlM, S(e, pn, ["av-b", "av-r", "av-t"][cl]), T0 + .35 + i * .17, .32, "none"); }));
      // hojas: folíolos cortos en naranja alrededor de cada punta y a lo largo de las ramillas
      const lv = Array.from({ length: 8 }, () => [pen(), pen()]), leafAt = (n, k) => { const b = Math.min(7, Math.floor(n.d / maxD * 8)); for (let j = 0; j < k; j++) { const a = rr(0, 6.28), r0 = rr(2, 15), l = rr(5, 9), x = n.x + Math.cos(a) * r0, y = n.y + Math.sin(a) * r0 * .8, a2 = rr(0, 3.14); lv[b][Rt() < .35 ? 1 : 0].raw(`M${f(x * sc)} ${f(y * sc)}l${f(Math.cos(a2) * l * sc)} ${f(Math.sin(a2) * l * sc)}`, l * sc + 1); } };
      nodes.forEach((n, i) => { if (n.g < 0 || n.skel) return; if (!n.kids.length) leafAt(n, v ? 4 : 7); else leafAt(n, i % 2 ? 3 : 1); });
      lv.forEach((pr, i) => pr.forEach((pn, c) => { if (pn.d) { const el = S(e, pn, c ? "av-h" : "av-o"); draw(tlM, el, T0 + 1.7 + i * .2 + c * .1, .5, "power1.out"); } }));
      place(e, tx0 - BX * sc, G - GY * sc);
      // hojas que caen (solo en el estado vivo)
      for (let i = 0; i < (v ? 3 : 5); i++) { const lf = sprite(lifeF, 8, 8); S(lf, pen().raw("M1 6L7 2", 8), i % 2 ? "av-h" : "av-o"); const x0 = tx0 + rr(-380, 380) * sc, y0 = G - rr(300, 430) * sc; place(lf, x0, y0); lf.style.opacity = 0; fallers.push([lf, x0, y0, rr(4.5, 7.5), rr(0, 5)]); }
    }
    // faroles: poste fino con brazo; la luz es un sprite con resplandor que se enciende al anochecer y respira
    const lampIn = [];
    (v ? [[stX + stW + 18 * q, 1], [vx0 - 14 * q, 1], [PAN + PAN2 + Wn * .93, 2]] : [[bx - 274, 0], [Wn * .978, 0], [vx0 + vw + 36, 1], [PAN + Wn * .905, 1]]).forEach((lm, i) => {
      const x = lm[0], hgt = 64 * q, at = lm[1] === 0 ? tm.plan + .5 + i * .1 : lm[1] === 1 ? tOf(x) : tm.b3 + .2 + i * .1;
      const lp = pen().l(x - 1.2 * q, G, x - .8 * q, G - hgt, 0, .15).l(x + 1.2 * q, G, x + .8 * q, G - hgt, 0, .15), lh = pen().raw(`M${f(x)} ${f(G - hgt)}q${f(1 * q)} ${f(-8 * q)} ${f(13 * q)} ${f(-7 * q)}`, 18 * q)
        .box([[x + 10 * q, G - hgt - 8.6 * q], [x + 19 * q, G - hgt - 7.4 * q], [x + 18.6 * q, G - hgt - 4.6 * q], [x + 10.4 * q, G - hgt - 5.6 * q]], .2).l(x - 4 * q, G, x + 4 * q, G, 0, 0).l(x - 2.4 * q, G - 5 * q, x + 2.4 * q, G - 5 * q, 0, 0);
      draw(tlM, S(L.terreno, lp, "av-t"), at, .45, "power1.out"); draw(tlM, S(L.terreno, lh, "av-t"), at + .4, .3);
      const e = sprite(lifeF, 44 * q, 40 * q, "avila__sp--lamp"), inner = E("g", {}, e), gp = pen();
      [-15, -8, 0, 8, 15].forEach((o2) => gp.l(22 * q, 4 * q, 22 * q + o2 * q, (31 - Math.abs(o2) * .5) * q, 0, 0)); gp.raw(circ(22 * q, 3 * q, 2.3 * q), 16 * q);
      S(inner, gp, "av-h av-t"); place(e, x + 14.5 * q - 22 * q, G - hgt - 5.5 * q);
      if (tlM) { e.style.opacity = 0; tlM.to(e, { opacity: 1, duration: .35, ease: "none" }, Math.max(at + .5, tm.clean + .3 + i * .2)); lampIn.push(inner); }
    });
    // carros: línea fina con faro encendido; van por la calle y pasan por detrás de torres y casitas
    const mkCar = (bus) => {
      const w = (bus ? 50 : 25) * q, h = 13 * q, e = sprite(lifeM, w + 12 * q, h + 3 * q), cp = pen();
      if (bus) { cp.raw(`M${f(1 * q)} ${f(11 * q)}V${f(3 * q)}Q${f(1 * q)} ${f(1 * q)} ${f(3 * q)} ${f(1 * q)}H${f(w - 4 * q)}Q${f(w)} ${f(1 * q)} ${f(w)} ${f(6 * q)}V${f(11 * q)}Z`, w * 2.6); for (let i = 0; i < 5; i++) cp.box([[(4 + i * 8.6) * q, 3.4 * q], [(10.6 + i * 8.6) * q, 3.4 * q], [(10.6 + i * 8.6) * q, 7 * q], [(4 + i * 8.6) * q, 7 * q]], 0); }
      else cp.raw(`M${f(1 * q)} ${f(11 * q)}V${f(8 * q)}Q${f(1.4 * q)} ${f(6.4 * q)} ${f(4.6 * q)} ${f(6.2 * q)}L${f(8 * q)} ${f(2.4 * q)}H${f(16 * q)}L${f(19.6 * q)} ${f(6.2 * q)}Q${f(24 * q)} ${f(6.6 * q)} ${f(24 * q)} ${f(9 * q)}V${f(11 * q)}Z`, w * 2.8).l(8.8 * q, 6.2 * q, 18.8 * q, 6.2 * q, 0, 0).l(12.4 * q, 2.6 * q, 12.4 * q, 6.2 * q, 0, 0);
      S(e, cp, "av-t"); S(e, pen().raw(circ(w * (bus ? .2 : .26), 11.4 * q, 2 * q), 14 * q).raw(circ(w * (bus ? .8 : .78), 11.4 * q, 2 * q), 14 * q), "av-t");
      S(e, pen().l(w + .6 * q, 8.4 * q, w + 9 * q, 7 * q, 0, 0).l(w + .6 * q, 8.8 * q, w + 9 * q, 10.6 * q, 0, 0), "av-h av-t", true);
      e._w = w + 12 * q; e._h = h; return e;
    };
    // peatones: caminan por la acera (las piernas alternan en dos tiempos)
    const mkWalker = (layer) => {
      const hf = (v ? 15 : 20) * q, w = hf * .8, e = sprite(layer || lifeM, w, hf + 1), x = w / 2, hr = hf * .1;
      S(e, pen().raw(circ(x, hr + .5, hr), hr * 7).l(x, 2 * hr + .8, x, hf * .58, 0, 0).l(x, hf * .28, x - hf * .16, hf * .5, 0, 0).l(x, hf * .28, x + hf * .16, hf * .48, 0, 0), "av-t");
      const lg = E("g", { transform: `translate(${f(x)} ${f(hf * .58)})` }, e), li = E("g", {}, lg); S(li, pen().l(0, 0, -hf * .15, hf * .42, 0, 0).l(0, 0, hf * .12, hf * .42, 0, 0), "av-t"); e._legs = li; e._h = hf + 1; return e;
    };
    const mkBike = () => {
      const w = 34 * q, h = 26 * q, e = sprite(lifeM, w, h), r = 5.4 * q, y0 = h - r - .6;
      S(e, pen().raw(circ(7 * q, y0, r), r * 7).raw(circ(27 * q, y0, r), r * 7).l(7 * q, y0, 14 * q, y0 - 9 * q, 0, 0).l(14 * q, y0 - 9 * q, 24 * q, y0 - 9 * q, 0, 0).l(24 * q, y0 - 9 * q, 27 * q, y0, 0, 0).l(14 * q, y0 - 9 * q, 17 * q, y0, 0, 0).l(17 * q, y0, 7 * q, y0, 0, 0).l(17 * q, y0, 24 * q, y0 - 9 * q, 0, 0).l(24 * q, y0 - 9 * q, 25 * q, y0 - 12.5 * q, 0, 0).l(23 * q, y0 - 12.5 * q, 27 * q, y0 - 12.5 * q, 0, 0)
        .raw(circ(19 * q, 3.2 * q, 2.2 * q), 15 * q).l(18 * q, 5.6 * q, 13.6 * q, y0 - 10 * q, 0, 0).l(17.4 * q, 7.4 * q, 24.6 * q, y0 - 12.2 * q, 0, 0), "av-t");
      const cg = E("g", { transform: `translate(${f(17 * q)} ${f(y0)})` }, e), ci = E("g", {}, cg); S(ci, pen().l(0, 0, 3 * q, 3 * q, 0, 0).l(0, 0, -3 * q, -3 * q, 0, 0).l(13.6 * q - 17 * q, -10 * q, -3 * q, -3 * q, 0, 0), "av-t"); e._legs = ci; e._h = h; return e;
    };
    const mkDog = () => { const w = 22 * q, h = 12 * q, e = sprite(lifeM, w, h); S(e, pen().l(4 * q, 5 * q, 15 * q, 5 * q, 0, 0).l(4 * q, 5 * q, 3 * q, h, 0, 0).l(6 * q, 5 * q, 7 * q, h, 0, 0).l(13 * q, 5 * q, 12 * q, h, 0, 0).l(15 * q, 5 * q, 16 * q, h, 0, 0).l(15 * q, 5 * q, 19 * q, 2 * q, 0, 0).l(19 * q, 2 * q, 21.5 * q, 3.4 * q, 0, 0).l(18 * q, 2.4 * q, 17.4 * q, .4 * q, 0, 0).l(4 * q, 5 * q, 1 * q, 2 * q, 0, 0).l(19 * q, 2.6 * q, 30 * q, -9 * q, 0, 0), "av-t"); e._h = h; return e; };
    // chispas de soldadura: suben con la obra, piso a piso
    const sparks = [];
    const mkSpark = (x, ys, t1) => {
      const e = sprite(lifeF, 18 * q, 18 * q, "avila__sp--lamp"), inner = E("g", {}, e), sp2 = pen();
      for (let i = 0; i < 7; i++) { const a = i * .9 + .3, r1 = 1.5 * q, r2 = (4 + (i % 3) * 2.2) * q; sp2.raw(`M${f(9 * q + r1 * Math.cos(a))} ${f(9 * q + r1 * Math.sin(a))}L${f(9 * q + r2 * Math.cos(a))} ${f(9 * q + r2 * Math.sin(a))}`, r2); }
      S(inner, sp2, "av-h av-t"); place(e, x - 9 * q, ys[0][1] - 9 * q);
      if (!tlM) { e.remove(); return; }
      e.style.opacity = 0; tlM.set(e, { opacity: 1 }, ys[0][0]); ys.forEach((pt2) => tlM.set(e, { y: (pt2[1] - 9 * q) * s }, pt2[0])); tlM.set(e, { opacity: 0 }, t1); sparks.push(inner);
    };
    mkSpark(xR - 3 * q, Array.from({ length: nF }, (_, k) => [tm.f0 + k + .45, Y(k + 1) - 3 * q]), tm.top + .3);
    mkSpark(X(1), Array.from({ length: nF }, (_, k) => [tm.f0 + k + .2, Y(k) - fh * .5]), tm.top + .1);
    mkSpark(p3(3, 0, 0)[0], Array.from({ length: NF2 }, (_, k) => [tA(k) + .3, G - Z(k + 1) - 3 * q]), tm.top2 + .2);
    mkSpark(p3(.5, 0, 0)[0], Array.from({ length: NF2 }, (_, k) => [tA(k) + .1, G - Z(k) - fh2 * .5]), tm.top2);
    mkSpark(c3 + R3 * .72, Array.from({ length: NF3 }, (_, k) => [tF3(k) + .2, z3(k + 1) + ry3 * .68]), tm.top3 + .2);
    mkSpark(c3 - R3 * .5, Array.from({ length: NF3 }, (_, k) => [tF3(k) + .08, z3(k) + ry3 * .85 - fh3 * .5]), tm.top3);
    mkSpark(c3 + Rs * .7, [[tm.logo + .7, topY - trs - Rs * .3]], tm.logo + 2.2);
    mkSpark(vx0 + vh * .52, [[tv + 1.1, vyt + vh * .3], [tv + 1.6, vyt + vh * .5], [tv + 2.1, vyt + vh * .68]], tv + 2.6);
    const qT = q * 1.4;   // el furgón va más grande que los carros: tiene que leerse
    const mkTruck = (cq) => { // furgón: el de La Capital del Cielo (su logo oficial, en azul) o el de Caraqueña (nombre y barra naranja)
      const q = qT, hb = cq ? 22 : 32, yb = (3 + hb) * q, w = 78 * q, e = sprite(lifeF, w + 12 * q, yb + 8 * q, cq ? "" : "avila__sp--lcdc"), tp = pen();
      tp.box([[1 * q, 3 * q], [54 * q, 3 * q], [54 * q, yb], [1 * q, yb]], .2).raw(`M${f(54 * q)} ${f(yb)}V${f(yb - 14 * q)}H${f(66 * q)}L${f(73 * q)} ${f(yb - 7 * q)}H${f(77 * q)}V${f(yb)}Z`, 80 * q).box([[57 * q, yb - 12 * q], [65 * q, yb - 12 * q], [70 * q, yb - 7 * q], [57 * q, yb - 7 * q]], 0).l(1 * q, yb + 1.6 * q, 77 * q, yb + 1.6 * q, 0, 0);
      S(e, tp, "av-t"); S(e, pen().raw(circ(13 * q, yb + 2.6 * q, 3.4 * q), 22 * q).raw(circ(13 * q, yb + 2.6 * q, 1.2 * q), 8 * q).raw(circ(63 * q, yb + 2.6 * q, 3.4 * q), 22 * q).raw(circ(63 * q, yb + 2.6 * q, 1.2 * q), 8 * q), "av-t");
      if (cq) { // Caraqueña: el nombre a lo largo del furgón, la barra naranja debajo y el isotipo en la puerta
        const tx3 = E("text", { x: f(4.5 * q), y: f(16 * q), class: "av-word", style: `font-size:${f(7.4 * q)}px`, textLength: f(46 * q), lengthAdjust: "spacingAndGlyphs" }, e); tx3.textContent = "CARAQUEÑA";
        S(e, pen().box([[4.5 * q, 19 * q], [20 * q, 19 * q], [20 * q, 21.4 * q], [4.5 * q, 21.4 * q]], 0), "av-o", true); S(e, pen().raw(`M${f(63.6 * q)} ${f(yb - 4.6 * q)}A${f(2.4 * q)} ${f(2.4 * q)} 0 1 1 ${f(60.4 * q)} ${f(yb - 4.6 * q)}`, 14 * q), "av-t");
      } else { // el logo real, escalado al costado del furgón
        const k = (hb - 6) * q / 297, g = E("g", { transform: `translate(${f(5 * q - 243 * k)} ${f(6 * q + 704 * k)}) scale(${k.toFixed(5)})` }, e); LCDC.forEach((d) => E("path", { class: "av-lcg", d }, g));
      }
      S(e, pen().l(w + .6 * q, yb - 4 * q, w + 9 * q, yb - 5.4 * q, 0, 0).l(w + .6 * q, yb - 3.4 * q, w + 9 * q, yb - 1.6 * q, 0, 0), "av-h av-t", true);
      e._w = w + 12 * q; e._h = yb + 6 * q; return e;
    };
    const xStop = PAN + PAN2 + AX * (1 - 1 / KZ) - (v ? 70 : 110), cars = [], walkers = [];
    const bikes = (v ? [[-40, xStop, 96, .33]] : [[-40, xStop, 92, .16], [xStop, -40, 104, .52], [-40, xStop, 84, .8]]).map((c) => { const e = mkBike(); if (c[1] < c[0]) e.style.scale = "-1 1"; place(e, c[0] + (c[1] - c[0]) * c[3], G - e._h - 1); e._r = c; return e; });
    const dog = mkDog(); place(dog, 0, G - dog._h - 1);
    (v ? [[-30, xStop, 190, .12], [xStop, -30, 230, .5], [-30, xStop, 210, .84], [c3 + 4, WX2 + 40, 38, .3]] : [[-30, xStop, 230, .06], [xStop, -30, 260, .2], [-30, xStop, 250, .41], [xStop, -30, 240, .58], [-30, xStop, 270, .77], [xStop, -30, 220, .93], [c3 + 6, WX2 + 60, 46, .2], [c3 + 6, WX2 + 60, 58, .7]]).forEach((c) => {
      const e = mkWalker(); place(e, c[0] + (c[1] - c[0]) * c[3], G - e._h - 1); e._r = c; walkers.push(e);
    });
    // [desde, hasta, segundos, fase]: unos recorren la ciudad; otros salen por detrás de la torre 3 hacia la derecha
    (v ? [[-80, xStop, 46, .15, 0], [-80, xStop, 58, .62, 1], [c3 - 10, WX2 + 80, 9, .2, 0]] : [[-80, xStop, 44, .08, 0], [-80, xStop, 52, .36, 1], [-80, xStop, 40, .63, 0], [-80, xStop, 60, .86, 0], [c3 - 20, WX2 + 90, 9, .1, 0], [c3 - 20, WX2 + 90, 13, .6, 1]]).forEach((c) => {
      const e = c[4] === 2 ? mkTruck() : mkCar(c[4]); place(e, c[0] + (c[1] - c[0]) * c[3], G - e._h - 1.4 * q); e._r = c; cars.push(e);
    });
    // ---------- mezclador de concreto de Caraqueña: llega en retroceso a las dos primeras obras, el trompo gira mientras vacía y se va cuando la estructura corona ----------
    const mixFlow = [], mixDrum = [];
    const mkMixer = (flip) => {   // a escala del plano: ~9 m de largo (una bicicleta son 1,8 m)
      const u = q * 1.35, W2 = 86 * u, H2 = 37 * u, e = sprite(lifeF, W2, H2), cid = uid + "mx" + mixDrum.length;
      const g = E("g", { transform: (flip ? `translate(${f(W2)} 0) scale(-1 1) ` : "") + `scale(${u.toFixed(4)})`, style: `--sw:${(sw / u).toFixed(4)}px` }, e), occ = (d) => E("path", { class: "av-occ", d }, g);
      const drum = "M26 8L70 5.3Q73.6 11.5 70 17.7L26 27Q19 17.5 26 8Z", cab = "M2 28.6V17L5 11Q6 9.4 8 9.4H19.4V28.6Z";
      occ(drum); occ(cab); occ("M1 24H83V29.4H1Z"); occ("M65.6 5.8L71 .6H78L73 6.4Z"); occ("M70.4 17.6L82.6 21.2L81.6 23.2L70 18.6Z");
      [11, 55, 65.6].forEach((x) => occ(circ(x, 31.2, 4.8)));
      // trompo: aspas helicoidales que giran dentro, recortadas por su silueta
      const cp = E("clipPath", { id: cid }, g); E("path", { d: drum }, cp);
      const bl = E("g", {}, E("g", { "clip-path": `url(#${cid})` }, g)), bp = pen(); for (let x = 6; x < 92; x += 7) bp.raw(`M${x} 28Q${x + 6} 16 ${x + 11} 3`, 30);
      S(bl, bp, "av-t av-dim"); mixDrum.push(bl);
      const d1 = pen().raw(drum, 160).raw("M26 8Q23 17.5 26 27", 22);
      [37, 49, 61].forEach((x) => { const t = (x - 26) / 44, yt = 8 - 2.7 * t, yb = 27 - 9.3 * t; d1.raw(`M${x} ${f(yt)}Q${x + 1.6} ${f((yt + yb) / 2)} ${x} ${f(yb)}`, 24); });
      S(g, d1, "av-t");
      // cabina: parabrisas, ventana lateral, puerta con manija, espejo, parrilla, parachoques y estribo
      const c1 = pen().raw(cab, 70).raw("M4.6 17L7.4 12.2H12.8V17Z", 20).raw("M14.6 11.8H18V17H14.6Z", 14).raw("M13.8 10V27", 17).raw("M15.2 19.6H17.4", 3)
        .raw("M5 13L2.6 12.2V15.6L4.4 15.8", 8).raw("M.8 23.6H3.6V28.6H.8Z", 14).raw("M2.1 19.6H3.6M2.1 21H3.6M2.1 22.4H3.6", 6).raw("M14 28.9H18.6M14.4 30.4H18.2", 9);
      // chasis, tanque de agua y de combustible, escape, guardafangos, soportes del trompo, tolva con escalera y canal
      c1.raw("M3 28.6H83M3 27H83", 160).raw("M21 26.4V20.4Q21 19 22.4 19H26.4", 12).raw("M20.2 27V5.6M21.8 27V5.6M19.6 5.6H22.4", 46).raw("M23 28.9H30V32.6H23Z", 18)
        .raw("M4.4 28.6A6.6 6.6 0 0 1 17.6 28.6", 22).raw("M48.4 28.6A6.6 6.6 0 0 1 61.6 28.6M59 28.6A6.6 6.6 0 0 1 72.2 28.6", 44)
        .raw("M30 27L33 24.4L37.4 25.2M58 27L62.6 16.4M69.4 27L65.4 16.8", 40)
        .raw("M65.6 5.8L71 .6H78L73 6.4", 22).raw("M75 27L72.8 6.2M77.4 27L75.2 6.2", 44).raw("M74.8 23H77M74.4 19.4H76.6M74 15.8H76.2M73.6 12.2H75.8M73.2 8.6H75.4", 12)
        .raw("M70.4 17.6L82.6 21.2L81.6 23.2L70 18.6", 30).raw("M72.6 27.2H74.2V34H72.6Z", 15);
      S(g, c1, "av-t");
      [11, 55, 65.6].forEach((x) => S(g, pen().raw(circ(x, 31.2, 4.6), 30).raw(circ(x, 31.2, 3), 20).raw(circ(x, 31.2, 1), 7)
        .raw([0, 1, 2, 3, 4].map((k) => { const a = k * 1.2566; return `M${f(x + 1.7 * Math.cos(a))} ${f(31.2 + 1.7 * Math.sin(a))}h.01`; }).join(""), 3), "av-t"));
      S(g, pen().l(1.2, 23.8, -7, 22, 0, 0).l(1.2, 24.6, -7, 26.6, 0, 0), "av-h av-t", true);
      const pour = E("path", { class: "av-flow", d: "M82.2 22.4Q84.6 27 84.4 36.6" }, g); pour.style.opacity = 0; mixFlow.push(pour);
      // rótulo a lo largo del eje del trompo y la barra naranja del isotipo
      const tg = E("g", { transform: `scale(${u.toFixed(4)})`, style: `--sw:${(sw / u).toFixed(4)}px` }, e), xm = flip ? 86 - 48 : 48, rot = flip ? 7.8 : -7.8;
      const tx = E("text", { x: xm, y: 17.6, "text-anchor": "middle", class: "av-word av-wbg", transform: `rotate(${rot} ${xm} 15.4)`, style: "font-size:7.6px", textLength: 36, lengthAdjust: "spacingAndGlyphs" }, tg); tx.textContent = "CARAQUEÑA";
      S(tg, pen().box([[xm - 18, 20.4], [xm - 4, 20.4], [xm - 4, 22], [xm - 18, 22]], 0), "av-o", true).setAttribute("transform", `rotate(${rot} ${xm} 15.4)`);
      e._w = W2; e._h = H2; e._pour = pour; return e;
    };
    if (!v && tlM) [[bx - 178 - 86 * q * 1.35, -220, tm.f0 + .1, tm.top - .5, 0], [cx2 + 92, PAN + Wn + 60, tm.b0 + 1.4, tm.top2 - .4, 1]].forEach((m) => {
      const e = mkMixer(m[4]), xP = m[0], yP = G - 35.8 * q * 1.35;
      place(e, m[1], yP); e.style.opacity = 0;
      tlM.set(e, { opacity: 1 }, m[2] - .05).fromTo(e, { x: m[1] * s }, { x: xP * s, duration: 1.6, ease: "power2.out", immediateRender: false }, m[2])
        .fromTo(e._pour, { opacity: 0 }, { opacity: 1, duration: .2, ease: "none", immediateRender: false }, m[2] + 1.8).to(e._pour, { opacity: 0, duration: .2, ease: "none" }, m[3] - .3)
        .fromTo(e, { x: xP * s }, { x: m[1] * s, duration: 1.8, ease: "power2.in", immediateRender: false }, m[3]).set(e, { opacity: 0 }, m[3] + 1.85);
      worker(L.gente, m[4] ? xP - 12 * q : xP + e._w + 8 * q, G, m[2] + 1.7, m[3] - .2, fh * .48);
    });
    // ---------- el camión de La Capital del Cielo sale UNA sola vez: cuando la torre 2 ya está encendida, entra por la izquierda,
    //            pasa bajo la valla y se estaciona en el tramo libre de calle antes de la torre; la cámara baja al metro y no vuelve ----------
    if (tlM && !v) {
      const tk = mkTruck(), park = PAN + vw + Wn * .06 + 70 * q, xIn = PAN - tk._w - 40, tA2 = tm.light2 - .2;
      place(tk, xIn, G - tk._h); tk.style.opacity = 0;
      tlM.set(tk, { opacity: 1 }, tA2).fromTo(tk, { x: xIn * s }, { x: park * s, duration: 1.7, ease: "power2.out", immediateRender: false }, tA2).set(tk, { opacity: 0 }, tm.under);
    }
    { // el camión de Caraqueña llega a la obra de la torre 3, descarga cabilla y bloques, y se va cuando la estructura corona
      const tk = mkTruck(1), xP = c3 - R3 - 300 * q, mx0 = xP + tk._w + 10 * q, mt = pen();
      place(tk, xP, G - tk._h - 1.4 * q);
      for (let i = 0; i < 5; i++) mt.l(mx0 + i * 1.2 * q, G - 2 * q - i * 1.9 * q, mx0 + 40 * q + i * 1.2 * q, G - 2 * q - i * 1.9 * q, 0, .1);
      mt.l(mx0 + 8 * q, G, mx0 + 12 * q, G - 11 * q, 0, 0).l(mx0 + 30 * q, G, mx0 + 34 * q, G - 11 * q, 0, 0).box([[mx0 + 52 * q, G], [mx0 + 72 * q, G], [mx0 + 72 * q, G - 3 * q], [mx0 + 52 * q, G - 3 * q]], 0);
      for (let r2 = 0; r2 < 3; r2++) for (let c2 = 0; c2 < 3 - (r2 > 1 ? 1 : 0); c2++) mt.box([[mx0 + (53.4 + c2 * 6.2) * q, G - (3 + r2 * 4.4) * q], [mx0 + (58.6 + c2 * 6.2) * q, G - (3 + r2 * 4.4) * q], [mx0 + (58.6 + c2 * 6.2) * q, G - (7 + r2 * 4.4) * q], [mx0 + (53.4 + c2 * 6.2) * q, G - (7 + r2 * 4.4) * q]], 0);
      const mE = S(L.gente, mt, "av-t"); draw(tlM, mE, tm.f3 + 1.5, .6); hide(tlM, mE, tm.top3, .4); worker(L.gente, mx0 + 46 * q, G, tm.f3 + 1.4, tm.top3, fh * .5);
      if (tlM) { tk.style.opacity = 0; tlM.set(tk, { opacity: 1 }, tm.f3 - .3).fromTo(tk, { x: (PAN + PAN2 - tk._w - 60) * s }, { x: xP * s, duration: 1.7, ease: "power2.out", immediateRender: false }, tm.f3 - .3).fromTo(tk, { x: xP * s }, { x: (WX2 + 90) * s, duration: 2.1, ease: "power2.in", immediateRender: false }, tm.top3 + .2).set(tk, { opacity: 0 }, tm.top3 + 2.35); } else tk.remove();
    }
    const flock = document.createElement("div"); flock.className = "avila__flock"; lifeT.appendChild(flock);
    const birds = [[0, 0, 1], [-46 * q, 17 * q, .84]].map((b) => {
      const k = b[2] * q * (v ? .9 : .96), e = sprite(flock, 60, 46, "avila__sp--glow"); e.setAttribute("width", f(60 * k * s)); e.setAttribute("height", f(46 * k * s));
      const w2 = E("g", { transform: "translate(30 26)" }, e), w2i = E("g", {}, w2);
      S(w2i, pen().raw("M0 0Q0 -16 -11 -27Q-3 -12 8 0", 60), "av-h av-t");
      S(e, pen().raw("M2 32Q16 29 30 27Q38 25 44 24", 46).raw("M30 27Q37 31 44 28", 16).raw("M44 24Q44 19 48 19Q52 19.5 51.5 23Q51 26.5 47 27Q45 27 44 24", 26).raw("M51.5 22Q55 23 53 27", 7), "av-o");
      S(e, pen().raw("M3 34Q15 33 28 29", 28), "av-t");
      const w1 = E("g", { transform: "translate(35 26)" }, e), w1i = E("g", {}, w1);
      S(w1i, pen().raw("M0 0Q-4 -20 -22 -32Q-10 -14 9 -1", 80).raw("M-6 -12Q-11 -17 -16 -26", 16).raw("M-1 -8Q-5 -13 -9 -20", 14), "av-h");
      place(e, b[0], b[1]); e._w = [w1i, w2i]; return e;
    });
    const bandY = () => rnd(v ? 96 : 96, v ? 170 : 210);
    if (gs) gs.set(flock, { x: -90 * s, y: bandY() * s, opacity: 0 }); else flock.style.transform = `translate(${f(Wn * .3 * s)}px,${f((v ? 130 : 170) * s)}px)`;
    const beacons = [beacon, hBeacon, beacon2, beacon3];
    if (tlM) {
      const dayEls = clouds.concat(cars, walkers, bikes, [dog]);
      stars.concat(cabins, dayEls).forEach((e, i) => { e.style.opacity = 0; tlM.to(e, { opacity: stars.indexOf(e) >= 0 ? .85 : clouds.indexOf(e) >= 0 ? .5 : 1, duration: .6, ease: "none" }, (cabins.indexOf(e) >= 0 ? 2.9 : dayEls.indexOf(e) >= 0 ? tm.plan + .1 : tm.clean + .3) + (i % 7) * .12); });
      // ambiente: corre desde que anochece sobre la torre 1
      clouds.forEach((e) => { const c = e._c, tw2 = gs.fromTo(e, { x: -c.w * s }, { x: backW * s, duration: c.dur, ease: "none", repeat: -1, paused: true }); tw2.progress(c.p); amb.push(tw2); });
      cabins.forEach((e, n) => { const a = cabP(.04), b = cabP(.96), tw2 = gs.fromTo(e, { x: (a[0] - 10 * q) * s, y: a[1] * s }, { x: (b[0] - 10 * q) * s, y: b[1] * s, duration: 24, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }); tw2.progress(n ? .76 : .28); amb.push(tw2); });
      walkers.forEach((e) => { const c = e._r, tw2 = gs.fromTo(e, { x: c[0] * s }, { x: c[1] * s, duration: c[2], ease: "none", repeat: -1, paused: true }); tw2.progress(c[3]); amb.push(tw2); amb.push(gs.fromTo(e._legs, { scaleX: 1 }, { scaleX: -1, duration: .3, ease: "steps(1)", repeat: -1, yoyo: true, svgOrigin: "0 0", paused: true })); });
      bikes.forEach((e) => { const c = e._r, tw2 = gs.fromTo(e, { x: c[0] * s }, { x: c[1] * s, duration: c[2], ease: "none", repeat: -1, paused: true }); tw2.progress(c[3]); amb.push(tw2); amb.push(gs.to(e._legs, { rotation: 360, svgOrigin: "0 0", duration: .7, ease: "none", repeat: -1, paused: true })); });
      { const c = walkers[0]._r, tw2 = gs.fromTo(dog, { x: (c[0] + 20 * q) * s }, { x: (c[1] + 20 * q) * s, duration: c[2], ease: "none", repeat: -1, paused: true }); tw2.progress(c[3]); amb.push(tw2); }
      mixDrum.forEach((e) => amb.push(gs.fromTo(e, { x: 0 }, { x: -7 * q, duration: .55, ease: "none", repeat: -1, paused: true })));
      mixFlow.forEach((e) => amb.push(gs.fromTo(e, { strokeDashoffset: 0 }, { strokeDashoffset: -13 * q, duration: .5, ease: "none", repeat: -1, paused: true })));
      sparks.forEach((e) => { amb.push(gs.to(e, { opacity: 0, duration: .07, ease: "steps(1)", repeat: -1, yoyo: true, repeatDelay: rnd(.05, .2), paused: true })); amb.push(gs.to(e, { rotation: 120, transformOrigin: "50% 50%", duration: .33, ease: "steps(3)", repeat: -1, paused: true })); });
      cars.forEach((e) => { const c = e._r, tw2 = gs.fromTo(e, { x: c[0] * s }, { x: c[1] * s, duration: c[2], ease: "none", repeat: -1, paused: true }); tw2.progress(c[3]); amb.push(tw2); });
      stars.forEach((e) => amb.push(gs.to(e, { opacity: .2, duration: rnd(1.2, 2.8), ease: "sine.inOut", repeat: -1, yoyo: true, delay: rnd(0, 2), paused: true })));
      flow.forEach((e, i) => amb.push(gs.fromTo(e, { strokeDashoffset: 0 }, { strokeDashoffset: -13 * q, duration: .55 + (i % 5) * .06, ease: "none", repeat: -1, paused: true })));
      amb.push(gs.fromTo(kiteEl, { rotation: -9 }, { rotation: 11, duration: 2.1, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }));
      amb.push(gs.to(kiteEl, { y: "-=" + 9 * q * s, duration: 1.3, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }));
      sway.forEach((e, i) => amb.push(gs.fromTo(e, { rotation: -1.1 }, { rotation: 1.3, duration: 2.6 + i * .37, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true })));
      amb.push(gs.to(rods, { opacity: .3, duration: .7, ease: "sine.inOut", stagger: { each: .06, repeat: -1, yoyo: true }, paused: true }));
      lampIn.forEach((e) => amb.push(gs.to(e, { opacity: .55, duration: rnd(1.3, 2.3), ease: "sine.inOut", repeat: -1, yoyo: true, paused: true })));
      // balizas: parpadeo seco (dos repintados por ciclo, no sesenta)
      amb.push(gs.to(beacons, { opacity: .15, duration: .9, ease: "steps(1)", repeat: -1, yoyo: true, paused: true }));
      // final: guacamayas, trenes que pasan y ventanas que se prenden y apagan
      birds.forEach((e, i) => { amb.push(gs.fromTo(e._w, { scaleY: 1 }, { scaleY: -.55, duration: .24 + i * .03, ease: "sine.inOut", repeat: -1, yoyo: true, svgOrigin: "0 0", paused: true })); amb.push(gs.to(e, { y: "+=" + 7 * q * s, duration: .9 + i * .23, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true })); });
      const span = W + 180 * s, fly = gs.timeline({ repeat: -1, repeatDelay: 4.5, paused: true, delay: .5, onRepeat: () => gs.set(flock, { y: bandY() * s }) });
      fly.fromTo(flock, { x: -90 * s }, { x: W + 90 * s, duration: span / ((v ? 62 : 120) * s), ease: "none" }, 0);
      amb.push(fly);
      fallers.forEach((fl) => { const lf = fl[0], t2 = gs.timeline({ repeat: -1, repeatDelay: fl[4] + 1.5, delay: fl[4], paused: true }); t2.fromTo(lf, { x: fl[1] * s, y: fl[2] * s, opacity: 0, rotation: 0 }, { opacity: 1, duration: .4, ease: "none" }).to(lf, { y: (G - 4) * s, duration: fl[3], ease: "power1.in" }, 0).to(lf, { x: "+=" + 26 * q * s, rotation: 220, duration: fl[3] / 3, ease: "sine.inOut", repeat: 2, yoyo: true }, 0).to(lf, { opacity: 0, duration: .5, ease: "none" }, fl[3] - .3); life.push(t2); });
      life.push(gs.fromTo(signGlow, { opacity: .17 }, { opacity: .5, duration: 1.6, ease: "steps(6)", repeat: -1, yoyo: true, paused: true }));
      const flick = gs.timeline({ repeat: -1, paused: true, onRepeat: toggle }); flick.to({}, { duration: .55 }); amb.push(flick);
    }
    function toggle() {
      const pool = lights.filter((l) => +l.style.opacity > .9 && !l._keep); if (!pool.length) return;
      const m = pool[Math.floor(Math.random() * pool.length)], on = +gs.getProperty(m._in, "opacity") > .5;
      const lit = pool.filter((l) => +gs.getProperty(l._in, "opacity") > .5).length / pool.length;
      if (on && lit < .55) return;
      gs.to(m._in, { opacity: on ? 0 : 1, duration: .45, ease: "power1.inOut", overwrite: true });
    }
    // ---------- ventanas con historia: tele que parpadea, alguien que pasa, alguien que riega las matas, una cortina que se cierra ----------
    const story = (x0, y0, w, h, kind, tShow) => {
      const e = sprite(lifeF, w, h, "avila__sp--win"), g = E("g", {}, e), sil = (d) => E("path", { class: "av-sil", d }, g), bust = (cx2, r) => `M${f(cx2 - r * 2.1)} ${f(h)}Q${f(cx2 - r * 2)} ${f(h - r * 2.6)} ${f(cx2)} ${f(h - r * 2.7)}Q${f(cx2 + r * 2)} ${f(h - r * 2.6)} ${f(cx2 + r * 2.1)} ${f(h)}Z` + circ(cx2, h - r * 3.9, r);
      const lt = lights.find((l) => Math.abs(l._c[0] - (x0 + w / 2)) < 3 && Math.abs(l._c[1] - (y0 + h / 2)) < 3); if (lt) { lt._keep = true; lt._in.style.opacity = 1; }
      place(e, x0, y0); if (!tlM) { if (kind === 3) sil(`M0 0H${f(w * .22)}V${f(h)}H0Z`); else sil(bust(w * .5, h * .13)); return; }
      e.style.opacity = 0; tlM.to(e, { opacity: 1, duration: .5, ease: "none" }, tShow);
      if (kind === 0) { // sofá, alguien mirando y el resplandor de la tele
        sil(bust(w * .34, h * .12)); S(g, pen().l(w * .08, h * .82, w * .56, h * .82, 0, 0).l(w * .08, h * .82, w * .08, h, 0, 0), "av-t");
        const tv = E("g", {}, e); S(tv, pen().box([[w * .7, h * .46], [w * .94, h * .46], [w * .94, h * .8], [w * .7, h * .8]], 0).l(w * .82, h * .8, w * .82, h, 0, 0), "av-t"); const gl = S(tv, pen().l(w * .68, h * .5, w * .52, h * .4, 0, 0).l(w * .68, h * .63, w * .5, h * .63, 0, 0).l(w * .68, h * .76, w * .52, h * .86, 0, 0), "av-h av-t");
        amb.push(gs.to(gl, { opacity: .15, duration: .12, ease: "steps(1)", repeat: -1, yoyo: true, repeatDelay: .22, paused: true }));
      } else if (kind === 1) { // alguien cruza el cuarto, se detiene y vuelve
        const b = sil(bust(0, h * .13)); amb.push(gs.fromTo(b, { x: -w * .2 }, { x: w * 1.2, duration: rnd(5, 8), ease: "sine.inOut", repeat: -1, yoyo: true, repeatDelay: rnd(1.5, 4), paused: true }));
      } else if (kind === 2) { // riega las matas del alféizar
        sil(bust(w * .3, h * .13)); const pots = pen(); [.56, .72, .88].forEach((u) => pots.box([[w * u - 2.4 * q, h - 5 * q], [w * u + 2.4 * q, h - 5 * q], [w * u + 1.8 * q, h - .6], [w * u - 1.8 * q, h - .6]], 0).l(w * u, h - 5 * q, w * u, h - 10 * q, 0, 0).l(w * u, h - 8 * q, w * u - 2.6 * q, h - 11 * q, 0, 0).l(w * u, h - 7 * q, w * u + 2.6 * q, h - 10 * q, 0, 0)); S(g, pots, "av-t");
        const arm = E("g", { transform: `translate(${f(w * .36)} ${f(h * .62)})` }, g), ai = E("g", {}, arm); S(ai, pen().l(0, 0, w * .14, -h * .06, 0, 0).box([[w * .14, -h * .14], [w * .2, -h * .14], [w * .2, -h * .02], [w * .14, -h * .02]], 0).l(w * .2, -h * .1, w * .25, -h * .04, 0, 0), "av-t");
        amb.push(gs.fromTo(ai, { rotation: -8 }, { rotation: 16, svgOrigin: "0 0", duration: 1.3, ease: "sine.inOut", repeat: -1, yoyo: true, repeatDelay: .6, paused: true }));
      } else { // cortinas: se cierran un rato y vuelven a abrirse
        [0, 1].forEach((sd) => { const c = E("g", { transform: `translate(${sd ? f(w) : 0} 0) scale(${sd ? -1 : 1} 1)` }, g), ci = E("g", {}, c); E("path", { class: "av-sil", d: `M0 0H${f(w * .5)}V${f(h)}H0Z` }, ci); S(ci, pen().l(w * .12, 0, w * .12, h, 0, 0).l(w * .25, 0, w * .25, h, 0, 0).l(w * .38, 0, w * .38, h, 0, 0), "av-t");
          amb.push(gs.fromTo(ci, { scaleX: .3 }, { scaleX: 1, svgOrigin: "0 0", duration: 1.6, ease: "power1.inOut", repeat: -1, yoyo: true, repeatDelay: 5, delay: 2, paused: true })); });
      }
    };
    [[2, 0, 0], [4, 2, 1], [6, 0, 2], [8, 2, 3], [9, 0, 1], [5, 0, 3], [3, 2, 0]].filter((c) => c[0] < nF).forEach((c, i) => story(X(c[1]) + bw * .15 + 2.4 * q, Y(c[0] + 1) + fh * .21 + 2.4 * q, bw * .7 - 4.8 * q, fh * .59 - 4.8 * q, c[2], tm.light + .3 + i * .14));
    [[3, 0, 1], [5, 2, 0], [13, 1, 1], [6, 1, 3], [12, 2, 0]].forEach((c, i) => { const a = p3(c[1] + .1, 0, Z(c[0]) + fh2 * .8), b = p3(c[1] + .9, 0, Z(c[0]) + fh2 * .26); story(a[0] + 2 * q, a[1] + 2 * q, b[0] - a[0] - 4 * q, b[1] - a[1] - 4 * q, c[2], tm.light2 + .2 + i * .12); });
    // ---------- góndola de limpieza de fachada (torre 1 ya terminada): cuelga de dos pescantes en la azotea y sube y baja despacio con dos operarios ----------
    {
      const gx0 = X(2) + 5 * q, gw = bw - 10 * q, yTop = top - 9 * q, hh = G - yTop, by = hh + 22 * q, wrap = document.createElement("div");
      wrap.className = "avila__clip"; wrap.style.cssText = `left:${f(gx0 * s)}px;top:${f(yTop * s)}px;width:${f(gw * s)}px;height:${f((hh - 2 * q) * s)}px`; lifeF.appendChild(wrap);
      const e = sprite(wrap, gw, hh + 30 * q);
      S(e, pen().l(3 * q, 0, 3 * q, by - 9 * q, 0, 0).l(gw - 3 * q, 0, gw - 3 * q, by - 9 * q, 0, 0), "av-t av-dim");
      E("path", { class: "av-occ", d: poly([[0, by - 9 * q], [gw, by - 9 * q], [gw, by + 2.6 * q], [0, by + 2.6 * q]]) }, e);
      const gp = pen().l(0, by, gw, by, 0, .1).l(0, by + 2.6 * q, gw, by + 2.6 * q, 0, .1).l(0, by - 9 * q, gw, by - 9 * q, 0, .1).l(0, by - 9 * q, 0, by + 2.6 * q, 0, 0).l(gw, by - 9 * q, gw, by + 2.6 * q, 0, 0); for (let i = 1; i < 6; i++) gp.l(gw * i / 6, by - 9 * q, gw * i / 6, by, 0, 0);
      S(e, gp, "av-t"); mkFig(e, gw * .3, by, 15 * q, true); mkFig(e, gw * .72, by, 14 * q, true); S(e, pen().l(gw * .3 + 3 * q, by - 14.4 * q, gw * .3 + 8 * q, by - 19 * q, 0, 0).l(gw * .3 + 5.6 * q, by - 20.6 * q, gw * .3 + 10.4 * q, by - 17.4 * q, 0, 0), "av-h av-t");
      const yA = 12 * q - hh + 26 * q, yB = -28 * q; place(e, 0, yA);
      const dv = pen(); [gx0 + 3 * q, gx0 + gw - 3 * q].forEach((x) => dv.l(x + 5 * q, top - ph2R, x + 5 * q, top - ph2R - 10 * q, 0, 0).l(x + 5 * q, top - ph2R - 10 * q, x, top - ph2R - 12 * q, 0, 0).l(x, top - ph2R - 12 * q, x, top - 9 * q, 0, 0)); draw(tlM, S(L.techo, dv, "av-t"), tm.clean + .4, .5);
      if (tlM) { wrap.style.opacity = 0; tlM.to(wrap, { opacity: 1, duration: .5, ease: "none" }, tm.clean + .8); amb.push(gs.fromTo(e, { y: yA * s }, { y: yB * s, duration: 17, ease: "sine.inOut", repeat: -1, yoyo: true, repeatDelay: 2.2, paused: true })); }
    }
    // ---------- ascensores panorámicos: una cabina encendida que sube y baja con sus paradas, en las tres torres ----------
    const mkLift = (x, yA, yB, tShow, dur, layerG) => {
      draw(tlM, S(layerG, pen().l(x - 4.8 * q, yA, x - 4.8 * q, yB - 12 * q, 0, .1).l(x + 4.8 * q, yA, x + 4.8 * q, yB - 12 * q, 0, .1), "av-t av-dim"), tShow, .8, "power1.out");
      const e = sprite(lifeF, 9 * q, 12 * q, "avila__sp--glow"); S(e, pen().box([[.8 * q, .8 * q], [8.2 * q, .8 * q], [8.2 * q, 11.2 * q], [.8 * q, 11.2 * q]], 0).l(.8 * q, 4 * q, 8.2 * q, 4 * q, 0, 0).raw(circ(4.5 * q, 6.4 * q, 1.2 * q), 8 * q).l(4.5 * q, 7.6 * q, 4.5 * q, 11 * q, 0, 0), "av-h av-t"); place(e, x - 4.5 * q, yA - 12 * q);
      if (!tlM) return; e.style.opacity = 0; tlM.to(e, { opacity: 1, duration: .4, ease: "none" }, tShow + .6);
      amb.push(gs.fromTo(e, { y: (yA - 12 * q) * s }, { y: (yB - 12 * q) * s, duration: dur, ease: "sine.inOut", repeat: -1, yoyo: true, repeatDelay: 1.8, paused: true }));
    };
    mkLift(bx - 6.4 * q, G, top + 12 * q, tm.clean + .5, 6, L.fachada);
    mkLift(p3(3, 1, 0)[0], G - ey2 - Z(2), G - ey2 - Z(15) + 12 * q, tm.clean2 + .4, 7, L.b2top);
    mkLift(c3, G + ry3, topY + ry3 + 12 * q, tm.clean3 + .2, 6.5, L.b2top);
    // ---------- estación: gente en las escaleras mecánicas; al llegar el metro abre puertas, bajan unos y suben otros ----------
    if (tlM) {
      const t0s = tm.under + tm.underD, tOut = tm.rise + tm.riseD * .7, ph = (v ? 12 : 17) * q, inSub = [];
      escs.forEach((es, i) => [0, .5].forEach((ph0) => { const e = sprite(lifeF, 8 * q, ph + 1); mkFig(e, 4 * q, ph + .5, ph, false); place(e, es[0] - 4 * q, es[1] - ph - 1); inSub.push(e);
        const tw2 = gs.fromTo(e, { x: (es[0] - 4 * q) * s, y: (es[1] - ph - 1) * s }, { x: (es[2] - 4 * q) * s, y: (es[3] - ph - 1) * s, duration: 5, ease: "none", repeat: -1, paused: true }); tw2.progress(ph0 + i * .2); amb.push(tw2); }));
      const dl = metro._doors.map((d) => d[0]), dr = metro._doors.map((d) => d[1]);
      tlM.fromTo(dl, { x: 0 }, { x: -3 * q, duration: .4, ease: "power1.inOut", immediateRender: false }, t0s + .2).fromTo(dr, { x: 0 }, { x: 3 * q, duration: .4, ease: "power1.inOut", immediateRender: false }, t0s + .2)
        .fromTo(dl, { x: -3 * q }, { x: 0, duration: .4, ease: "power1.inOut", immediateRender: false }, t0s + tm.hS - .8).fromTo(dr, { x: 3 * q }, { x: 0, duration: .4, ease: "power1.inOut", immediateRender: false }, t0s + tm.hS - .8);
      const pY = mY0 + 15.4 * q; metro._doors.forEach((d, i) => { if (i > 2) return; const dxw = mC + d[2], bo = mkWalker(lifeF), al = mkWalker(lifeF), sd = i % 2 ? 1 : -1; inSub.push(bo, al);
        gs.set([bo, al], { x: (dxw - bo._h * .4) * s, y: (pY - bo._h) * s });
        tlM.fromTo(al, { x: (dxw - al._h * .4) * s, opacity: 0 }, { x: (dxw - al._h * .4 - sd * 70 * q) * s, opacity: 1, duration: 1.3, ease: "none", immediateRender: false }, t0s + .65 + i * .12).fromTo(bo, { x: (dxw - bo._h * .4 + sd * 62 * q) * s, opacity: 1 }, { x: (dxw - bo._h * .4) * s, opacity: 0, duration: 1.1, ease: "none", immediateRender: false }, t0s + 1.1 + i * .12);
        [bo, al].forEach((w2) => amb.push(gs.fromTo(w2._legs, { scaleX: 1 }, { scaleX: -1, duration: .3, ease: "steps(1)", repeat: -1, yoyo: true, svgOrigin: "0 0", paused: true }))); });
      inSub.forEach((e) => { const o = +e.style.opacity; e.style.opacity = 0; tlM.to(e, { opacity: 1, duration: .4, ease: "none" }, t0s - 1.6); tlM.to(e, { opacity: 0, duration: .4, ease: "none" }, tOut); });
    }
    // primer plano: postes con sus cables (paneo 1) y pilotes en corte (paneo subterráneo) que cruzan más rápido que la ciudad
    {
      const pole = (Xp, y0, y1, arms) => { const w = 70 * q, h = y1 - y0, e = sprite(lifeX, w, h, "avila__sp--fore"), pp = pen().l(w / 2 - 3.4 * q, h, w / 2 - 2.2 * q, 0, 0, .2).l(w / 2 + 3.4 * q, h, w / 2 + 2.2 * q, 0, 0, .2);
        if (arms) { pp.l(5 * q, 16 * q, w - 5 * q, 16 * q, 0, 0).l(5 * q, 20 * q, w - 5 * q, 20 * q, 0, 0).l(13 * q, 44 * q, w - 13 * q, 44 * q, 0, 0).l(w / 2, 48 * q, w - 13 * q, 44 * q, 0, 0).l(w / 2, 48 * q, 13 * q, 44 * q, 0, 0); [8, w / q - 8, 16, w / q - 16].forEach((ix) => pp.l(ix * q, 16 * q, ix * q, 10 * q, 0, 0)); }
        else for (let y = 40 * q; y < h; y += 70 * q) pp.l(w / 2 - 9 * q, y, w / 2 + 9 * q, y, 0, 0).l(w / 2 - 9 * q, y + 5 * q, w / 2 + 9 * q, y + 5 * q, 0, 0);
        S(e, pp, ""); place(e, Xp - w / 2, y0); };
      const a0 = Wn + 90, a1 = FS * PAN - 110, nP = v ? 3 : 4, yT = v ? 150 : 130, sp = (a1 - a0) / (nP - 1);
      for (let i = 0; i < nP; i++) {
        pole(a0 + sp * i, yT, Hn + 30, true);
        if (i < nP - 1) { const e = sprite(lifeX, sp, 90 * q, "avila__sp--fore"), cp = pen(); [[8, 10, 46], [-8, 10, 54], [16, 44, 40]].forEach((c) => cp.raw(`M${f(35 * q + c[0] * q - 35 * q + 0)} ${f(c[1] * q)}Q${f(sp / 2)} ${f((c[1] + c[2]) * q)} ${f(sp + c[0] * q)} ${f(c[1] * q)}`, sp * 1.1)); S(e, cp, "av-t"); place(e, a0 + sp * i, yT); }
      }
      const b0 = FS * PAN + Wn + 80, b1 = FS * (PAN + PAN2) - 100; for (let i = 0; i < 3; i++) pole(b0 + (b1 - b0) * i / 2, FS * DOWN - 20, FS * DOWN + Hn + 30, false);
    }
    // cada cambio de escena lo anuncia un barrido de plotter sobre retícula de plano
    const grid = mkDiv("avila__grid", 1), scanV = mkDiv("avila__scan avila__scan--v", 1), scanH = mkDiv("avila__scan avila__scan--h", 1);
    if (!tlM) [grid, scanV, scanH].forEach((e) => e.remove());
    else {
      gs.set([grid, scanV, scanH], { opacity: 0 });
      const fx = (at, dur, vert) => {
        tlM.fromTo(grid, { opacity: 0 }, { opacity: 1, duration: dur * .28, ease: "sine.out", immediateRender: false }, at).fromTo(grid, { opacity: 1 }, { opacity: 0, duration: dur * .42, ease: "sine.in", immediateRender: false }, at + dur * .52);
        const e = vert ? scanH : scanV, d = dur * .55;
        tlM.fromTo(e, vert ? { y: -12, opacity: 1 } : { x: -12, opacity: 1 }, Object.assign({ duration: d, ease: "power2.inOut", immediateRender: false }, vert ? { y: H + 12 } : { x: W + 12 }), at + .04).set(e, { opacity: 0 }, at + .05 + d);
      };
      fx(tm.pan, 2.4, 0); fx(tm.down, tm.downD, 1); fx(tm.under, tm.underD, 0); fx(tm.rise, tm.riseD, 1); fx(tm.zoom, tm.zoomD, 0);
    }
    { // se mide una sola vez, con la cámara en el origen
      camF.removeAttribute("transform"); const sv = svgF.getBoundingClientRect(), kx = (Wn + 2 * MG) / sv.width;
      const add = (el, pad) => { const r = el.getBoundingClientRect(); if (r.width < 1 && r.height < 1) return; cull.push([el, (r.left - sv.left) * kx - MG - pad, (r.right - sv.left) * kx - MG + pad, (r.top - sv.top) * kx - MG - pad, (r.bottom - sv.top) * kx - MG + pad, true]); };
      Object.keys(L).forEach((n) => { if (n === "avila" || n === "tele") return; [...L[n].children].forEach((ch) => add(ch, n === "grua" ? 440 * q : n === "b2top" ? 120 * q : 34)); });
    }
    applyCam();
    const sheet = mkDiv("avila__sheet", 1), hint = mkDiv("avila__hint", 1);
    sheet.innerHTML = "<span><b>A-01</b></span><span>1:200</span><span><b>N+0.00</b></span>"; hint.innerHTML = "<i></i>";
    const shNo = sheet.firstChild.firstChild, shLv = sheet.lastChild.firstChild; let lastSh = "";
    const lvl = (n) => (n < 0 ? "N−" : "N+") + Math.abs(n).toFixed(2);
    const setSheet = (t) => { // qué lámina se está dibujando y a qué nivel va la obra en este instante
      const sc = t < tm.pan + tm.panD * .5 ? 1 : t < tm.under + tm.underD * .5 ? 2 : 3;
      const fl = sc === 1 ? clamp(Math.floor((t - tm.f0) / tm.D) + 1, 0, nF) : sc === 2 ? clamp(Math.floor((t - tm.f2) / d2) + 1, 0, NF2) : clamp(Math.floor((t - tm.f3) / d3) + 1, 0, NF3);
      const n = cam.y > 4 && t < tm.zoom ? -Math.round(cam.y / DOWN * 8) * 3 : fl * 3, str = sc + "|" + n;
      if (str !== lastSh) { lastSh = str; shNo.textContent = "A-0" + sc; shLv.textContent = lvl(n); }
    };
    if (!tlM) { sheet.remove(); hint.remove(); }
    else {
      tlI.fromTo(sheet, { opacity: 0 }, { opacity: 1, duration: .5, ease: "none" }, .4); tlM.to(sheet, { opacity: 0, duration: .5, ease: "none" }, tm.clean3);
      if (scrub) { tlI.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: .6, ease: "none" }, 1.6); tlM.to(hint, { autoAlpha: 0, duration: .35, ease: "none" }, .15); } else hint.remove();
    }
    let ptT = 0;
    const onMove = (ev) => {
      const r = stage.getBoundingClientRect();
      gs.to(par, { x: (ev.clientX - r.left) / r.width * 2 - 1, y: (ev.clientY - r.top) / r.height * 2 - 1, duration: .9, ease: "power2.out", overwrite: true, onUpdate: applyLife });
      const now = performance.now(); if (now - ptT < 70) return; ptT = now;
      const k = cam.k, wx = ((ev.clientX - r.left) / s - (AX * (1 - k) - cam.x * k)) / k, wy = ((ev.clientY - r.top) / s - (cam.ay * (1 - k) - cam.y * k)) / k, rad = 42 * q;
      for (const m of lights) if (Math.abs(m._c[0] - wx) < rad && Math.abs(m._c[1] - wy) < rad && +m.style.opacity > .9 && +m._in.style.opacity !== 1) gs.to(m._in, { opacity: 1, duration: .25, overwrite: true });
    };
    const hoverOK = gs && matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (hoverOK) stage.addEventListener("pointermove", onMove, { passive: true });
    else if (gs) amb.push(gs.timeline({ repeat: -1, yoyo: true, paused: true, onUpdate: applyLife }).fromTo(par, { x: -.55, y: -.3 }, { x: .55, y: .35, duration: 7, ease: "sine.inOut" }));

    // ---------- avance de obra (contador, pariente del de la pantalla de carga) ----------
    let live = false, ambOn = false, running = false, lastPct = -1, started = false, stg = null, stIn = null;
    const setLive = (on) => {
      if (on === live) return; live = on;
      life.forEach((l) => (on && running ? l.play() : l.pause()));
    };
    const setAmb = (on) => { if (on === ambOn) return; ambOn = on; gs.to(flock, { opacity: on ? 1 : 0, duration: .4, overwrite: "auto" }); amb.forEach((l) => (on && running ? l.play() : l.pause())); };
    if (tlM) {
      tlM.eventCallback("onUpdate", () => {
        applyCam();
        const t = tlM.time(); setSheet(t); if (boardUpd) boardUpd(t);
        const n = Math.round(clamp((t - tm.plan) / (tm.logo + 2.3 - tm.plan), 0, 1) * 100);
        if (n !== lastPct && pct) { lastPct = n; pct.textContent = String(n).padStart(3, "0"); }
        setAmb(t >= 1.3); setLive(tlM.progress() >= .999);
      });
      const ST = window.ScrollTrigger; gs.registerPlugin(ST);
      if (scrub) {
        stg = ST.create({ trigger: sec, start: "top top", end: () => "+=" + (sec.offsetHeight - innerHeight) * .95, scrub: 1.1, animation: tlM, invalidateOnRefresh: false });
        stIn = ST.create({ trigger: sec, start: "top 96%", once: true, onEnter: () => { started = true; tlI.play(); } });
      } else {
        tlI.eventCallback("onComplete", () => { if (running) tlM.play(); });
        tlM.timeScale(1.6);
        stIn = ST.create({ trigger: sec, start: "top 85%", once: true, onEnter: () => { started = true; if (running) tlI.play(); } });
      }
    } else if (pct) pct.textContent = "100";

    return {
      tm, dur: tlM ? tlM.duration() : 0,
      state: () => (tlM ? { started, intro: tlI.progress(), p: tlM.progress() } : null),
      restore(k) {
        if (!tlM) return;
        if (scrub) {
          // recarga a mitad de página: aparece ya en su punto, sin "rebobinar"
          if (stg.progress > 0 || (k && k.started)) { started = true; tlI.progress(1); tlM.progress(stg.progress); }
        } else if (k && k.started) { started = true; tlI.progress(k.intro); tlM.progress(k.p); }
        applyCam();
      },
      run(on) {
        running = on; if (!tlM) return;
        life.forEach((l) => (live && on ? l.play() : l.pause())); amb.forEach((l) => (ambOn && on ? l.play() : l.pause()));
        if (!started) return;
        if (!on) { tlI.pause(); if (!scrub) tlM.pause(); return; }
        if (tlI.progress() < 1) tlI.play(); else if (!scrub && tlM.progress() < 1) tlM.play();
      },
      seek(p) { if (!tlM) return; started = true; tlI.progress(1); if (!scrub) tlM.pause(); tlM.progress(p); },
      destroy() {
        if (gs) {
          [stg, stIn].forEach((x) => x && x.kill()); life.concat(amb).forEach((l) => l.kill()); tlI.kill(); tlM.kill();
          gs.killTweensOf([flock, cam, par].concat(lights.map((m) => m._in))); if (hoverOK) stage.removeEventListener("pointermove", onMove);
          gs.set([hud, sign].concat(chars), { clearProps: "all" });
        } else if (hud) hud.style.opacity = "";
        made.forEach((e) => e.remove());
      },
    };
  }
})();
