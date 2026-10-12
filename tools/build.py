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
    h = h.replace("proyecto-planta-naranja.jpg", "sketch-tortuga.jpg")
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
      <a href="{b}#estudio" data-magnetic>Estudio</a>
      <a href="{b}#proceso" data-magnetic>Proceso</a>
      <a href="{b}#proyectos" data-magnetic>Proyectos</a>
      <a href="nosotros.html" data-magnetic{cur('nosotros')}>Nosotros</a>
    </nav>
    <a href="{b}#contacto" class="btn btn--small header__cta" data-magnetic><span>Contacto</span></a>
    <button class="header__burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
  </header>

  <div class="menu" aria-hidden="true">
    <nav class="menu__nav">
      <a href="{b}#estudio"><span class="mono">01</span>Estudio</a>
      <a href="{b}#proceso"><span class="mono">02</span>Proceso</a>
      <a href="{b}#proyectos"><span class="mono">03</span>Proyectos</a>
      <a href="nosotros.html"><span class="mono">04</span>Nosotros</a>
      <a href="{b}#contacto"><span class="mono">05</span>Contacto</a>
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
        <a href="{b}#estudio">Estudio</a><a href="{b}#proceso">Proceso</a><a href="{b}#proyectos">Proyectos</a><a href="nosotros.html">Nosotros</a><a class="js-ig" href="#" target="_blank" rel="noopener">Instagram</a>
      </nav>
    </div>
    <div class="footer__word" aria-hidden="true">CARAQUEÑA<svg><use href="#isotipo"/></svg></div>
    <div class="container footer__bottom mono">
      <span>© <span class="js-year"></span> Caraqueña Studio</span>
      <a href="#top" class="js-top">Volver arriba ↑</a>
    </div>
  </footer>

"""

def page(out, title, desc, b, current, main, with_loader):
    loader = P["loader"] if with_loader else ""
    html = head(title, desc, with_loader) + loader + "\n" + header(b, current) + "\n  <main>\n" + open(main).read() + "  </main>\n\n" + footer(b) + P["float"]
    open(out, "w").write(html)
    print(out, len(html))

page("index.html", "Caraqueña Studio — Arquitectura desde Caracas",
     "Estudio de arquitectura en Caracas: hotelería, vivienda y proyectos institucionales. Del boceto a la supervisión de obra, y diseño y consultoría para proyectos en todo el mundo.",
     "", "", "tools/main-index.html", True)
page("nosotros.html", "Nosotros — Caraqueña Studio",
     "Fabrizio Palmieri, Carlos Enrique Salas y David Ojalvo. Presencia y ejecución en Caracas; diseño, innovación y consultoría a nivel global.",
     "index.html", "nosotros", "tools/main-nosotros.html", False)
