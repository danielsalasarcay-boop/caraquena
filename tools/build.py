# Arma index.html y nosotros.html con el mismo header/menú/footer.
# Uso: python3 tools/build.py  (desde ~/caraquena)
import json, re

P = json.load(open("tools/parts.json"))

def head(title, desc, light=False):
    h = P["head"]
    h = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", h)
    h = re.sub(r'(<meta name="description" content=")[^"]*', r"\g<1>" + desc, h)
    h = re.sub(r'(<meta property="og:title" content=")[^"]*', r"\g<1>" + title, h)
    h = re.sub(r'(<meta property="og:description" content=")[^"]*', r"\g<1>" + desc, h)
    if not light:
        h = h.replace('<body class="is-loading">', '<body class="is-sub">')
    return h

def header(b, current=""):
    def cur(k): return ' aria-current="page"' if k == current else ""
    return f"""  <!-- HEADER -->
  <header class="header is-pre">
    <a href="{b or '#inicio'}" class="header__brand" aria-label="Caraqueña Studio, ir al inicio">
      <svg class="header__logo"><use href="#isotipo"/></svg>
      <span class="header__word">Caraqueña<em>studio</em></span>
    </a>
    <nav class="header__nav" aria-label="Principal">
      <a href="{b}#estudio">Estudio</a>
      <a href="{b}#proceso">Proceso</a>
      <a href="{b}#proyectos">Proyectos</a>
      <a href="nosotros.html"{cur('nosotros')}>Nosotros</a>
      <a href="conoce-mas.html"{cur('conoce')}>Conoce más</a>
    </nav>
    <div class="lang mono" aria-label="Idioma">__LANG__</div>
    <a href="{b}#contacto" class="btn btn--small header__cta"><span>Contacto</span></a>
    <button class="header__burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
  </header>

  <div class="menu" aria-hidden="true">
    <nav class="menu__nav">
      <a href="{b}#estudio"><span class="mono">01</span>Estudio</a>
      <a href="{b}#proceso"><span class="mono">02</span>Proceso</a>
      <a href="{b}#proyectos"><span class="mono">03</span>Proyectos</a>
      <a href="nosotros.html"><span class="mono">04</span>Nosotros</a>
      <a href="conoce-mas.html"><span class="mono">05</span>Conoce más</a>
      <a href="{b}#contacto"><span class="mono">06</span>Contacto</a>
    </nav>
    <div class="menu__foot mono"><a class="js-wa" href="#" target="_blank" rel="noopener">WhatsApp</a><a class="js-mail" href="#">Correo</a><a class="js-ig" href="#" target="_blank" rel="noopener">Instagram</a></div>
  </div>
"""

def footer(b):
    return f"""  <footer class="footer">
    <div class="container footer__top">
      <div class="footer__contact">
        <p class="mono">Caracas, Venezuela</p>
        <a class="footer__big js-mail" href="#">contacto@caraquena.com</a>
        <a class="footer__big js-wa" href="#" target="_blank" rel="noopener">+58 414 258 2223</a>
      </div>
      <nav class="footer__nav mono">
        <a href="{b}#estudio">Estudio</a><a href="{b}#proceso">Proceso</a><a href="{b}#proyectos">Proyectos</a><a href="nosotros.html">Nosotros</a><a href="conoce-mas.html">Conoce más</a><a class="js-ig" href="#" target="_blank" rel="noopener">Instagram</a>
      </nav>
    </div>
    <div class="footer__word" aria-hidden="true"><svg><use href="#isotipo"/></svg><div class="footer__lock"><span>CARAQUEÑA</span><span class="footer__tagline">Architecture, Design &amp; Construction.</span></div></div>
    <div class="container footer__bottom mono">
      <span>© <span class="js-year"></span> Caraqueña Studio. Todos los derechos reservados.</span>
      <a href="#top" class="js-top">Volver arriba ↑</a>
    </div>
  </footer>

"""

PAIRS_FILE = "tools/en.json"

def lang_switch(es_file, en_file, lang):
    es = f'<a href="{es_file}" hreflang="es" lang="es"{" aria-current=\"true\"" if lang == "es" else ""}>ES</a>'
    en = f'<a href="{en_file}" hreflang="en" lang="en"{" aria-current=\"true\"" if lang == "en" else ""}>EN</a>'
    return es + "<span>/</span>" + en

import hashlib
ASSET_V = hashlib.md5(open("css/style.css", "rb").read() + open("js/main.js", "rb").read()).hexdigest()[:8]

import os, re as _re
def mobile_pictures(html):
    def rep(m):
        pre, src, post = m.group(1), m.group(2), m.group(3)
        if not os.path.exists(src[:-4] + "-m.jpg"): return m.group(0)
        if 'decoding=' not in pre + post: post = post.rstrip("/").rstrip() + ' decoding="async"'
        return f'<picture><source media="(max-width: 900px)" srcset="{src[:-4]}-m.jpg"><img {pre}src="{src}"{post}></picture>'
    return _re.sub(r'<img ([^>]*?)src="(img/(?:guanta|otter|usm|portafolio/[a-z-]+|bocetos)/[^"]+?\.jpg)"([^>]*)>', rep, html)

def page(out, title, desc, b, current, main, with_loader, out_en, title_en, desc_en):
    loader = P["loader"] if with_loader else ""
    html = head(title, desc, with_loader) + loader + "\n" + header(b, current) + "\n  <main>\n" + open(main).read() + "  </main>\n\n" + footer(b) + P["float"]
    html = html.replace('href="css/style.css"', f'href="css/style.css?v={ASSET_V}"').replace('src="js/main.js"', f'src="js/main.js?v={ASSET_V}"')
    html = mobile_pictures(html)
    alt = f'  <link rel="alternate" hreflang="es" href="https://caraquena.vercel.app/{out.replace("index.html", "")}">\n  <link rel="alternate" hreflang="en" href="https://caraquena.vercel.app/{out_en}">\n'
    html = html.replace("  <link rel=\"icon\"", alt + "  <link rel=\"icon\"", 1)
    if out.startswith("conoce-mas"):
        html = html.replace('<meta name="theme-color"', '<meta name="robots" content="noindex, nofollow">\n  <meta name="theme-color"', 1)
    open(out, "w").write(html.replace("__LANG__", lang_switch(out, out_en, "es")))
    print(out, len(html))
    # Versión en inglés: mismas piezas, textos traducidos
    en = html.replace('<html lang="es">', '<html lang="en">').replace(f"<title>{title}</title>", f"<title>{title_en}</title>")
    en = en.replace(f'content="{title}"', f'content="{title_en}"').replace(f'content="{desc}"', f'content="{desc_en}"')
    import json
    for es_txt, en_txt in json.load(open(PAIRS_FILE)):
        en = en.replace(es_txt, en_txt)
    # enlaces internos hacia las páginas en inglés
    en = en.replace('href="index.html', 'href="index-en.html').replace('href="nosotros.html', 'href="nosotros-en.html').replace('href="conoce-mas.html', 'href="conoce-mas-en.html')
    en = en.replace('<a href="#inicio" class="header__brand"', '<a href="#inicio" class="header__brand"')
    open(out_en, "w").write(en.replace("__LANG__", lang_switch(out, out_en, "en")))
    print(out_en, len(en))

page("index.html", "Caraqueña Studio — Arquitectura desde Caracas",
     "Estudio de arquitectura en Caracas: hotelería y desarrollos de gran escala, vivienda e interiorismo. Del boceto a la supervisión de obra, y diseño y consultoría para proyectos en todo el mundo.",
     "", "", "tools/main-index.html", True, "index-en.html", "Caraqueña Studio — Architecture from Caracas",
     "Architecture studio in Caracas: large-scale hospitality and developments, housing and interiors. From the first sketch to site supervision, plus design and consulting for projects worldwide.")
page("nosotros.html", "Nosotros — Caraqueña Studio",
     "Fabrizio Palmieri, Carlos Enrique Salas y Elías Ojalvo. Presencia y ejecución en Caracas; diseño, innovación y consultoría a nivel global.",
     "index.html", "nosotros", "tools/main-nosotros.html", False, "nosotros-en.html", "About — Caraqueña Studio",
     "Fabrizio Palmieri, Carlos Enrique Salas and Elías Ojalvo. On-site presence and execution in Caracas; design, innovation and consulting worldwide.")
page("conoce-mas.html", "Conoce más — Caraqueña Studio",
     "Portafolio de Caraqueña Studio: Otter La Tortuga, Puerto de Guanta e interiorismo, del boceto al render.",
     "index.html", "conoce", "tools/main-conoce-mas.html", False, "conoce-mas-en.html", "Learn more — Caraqueña Studio",
     "Caraqueña Studio portfolio: Otter La Tortuga, Puerto de Guanta and interiors, from sketch to render.")
