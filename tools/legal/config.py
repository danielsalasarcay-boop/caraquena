# Contenido de las páginas legales de Caraqueña Studio (terminos.html, privacidad.html, cookies.html).
# Regenerar: python3 tools/legal/legalgen.py tools/legal/config.py .
# Al cambiar un texto de fondo, sube VERSION y la fecha de UPDATED.
# Las páginas en inglés son las mismas con ?lang=en (el sitio no guarda nada en el navegador).
#
# PENDIENTE (lo da el dueño): razón social y RIF del estudio. Cuando estén, añadirlos en
# "Quiénes somos" (Términos) y "Responsable" (Privacidad).

VERSION = "2026-10-25"
WA = '<a href="https://wa.me/584142582223">+58 414 258 2223</a>'
MAIL = '<a href="mailto:contacto@caraquena.com">contacto@caraquena.com</a>'
IG = '<a href="https://www.instagram.com/caraquena.studio" rel="noopener">@caraquena.studio</a>'

SITE = {
    "name": "Caraqueña Studio",
    "brand_html": "Caraqueña <span style=\"color:#B83A0E;font-weight:400\">studio</span>",
    "kicker": {"es": "Caraqueña Studio · Caracas", "en": "Caraqueña Studio · Caracas"},
    "langs": ["es", "en"],
    "lang_key": None,
    "home": {"es": "index.html", "en": "index-en.html"},
    "files": {"terms": "terminos.html", "privacy": "privacidad.html", "cookies": "cookies.html"},
    "version": VERSION,
    "updated": {"es": "25 de octubre de 2026", "en": "October 25, 2026"},
    "head": '<link rel="icon" href="img/favicon.svg" type="image/svg+xml">\n'
            '<link rel="icon" href="img/favicon-32.png" sizes="32x32" type="image/png">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">',
    "style": {
        "bg": "#F1EFEA", "ink": "#121212", "muted": "#6B675F", "accent": "#B83A0E", "line": "rgba(18,18,18,.14)", "card": "#E7E4DD",
        "display": "'Archivo', system-ui, sans-serif", "body": "'Instrument Sans', system-ui, sans-serif",
        "brand_size": "18px", "brand_track": "0.06em", "brand_case": "uppercase", "brand_weight": "700", "h_weight": "700",
    },
}

T_ES = [
    ("1. Quiénes somos", [
        f"Caraqueña Studio es un estudio de arquitectura, diseño y construcción con sede en Caracas, Venezuela. Contacto: {MAIL}, WhatsApp {WA} e Instagram {IG}.",
    ]),
    ("2. Aceptación", [
        "Estos términos regulan el uso de este sitio y la contratación de nuestros servicios. Al usar el sitio o aceptar una propuesta nuestra por escrito, declaras que los conoces y los aceptas. Cada proyecto se rige además por su propuesta escrita; si hay diferencias, prevalece la propuesta.",
        "Las comunicaciones y aceptaciones por medios electrónicos (correo o WhatsApp) tienen plena validez, conforme a la Ley sobre Mensajes de Datos y Firmas Electrónicas.",
    ]),
    ("3. Servicios y propuesta", [[
        "Ofrecemos diseño arquitectónico y de interiores, consultorías, desarrollo de proyectos y supervisión de obras, según se acuerde en cada propuesta.",
        "Antes de empezar te enviamos una propuesta escrita con el alcance, las fases, los entregables, los honorarios, la forma de pago y los plazos. El trabajo empieza cuando la aceptas por escrito.",
        "Los honorarios se expresan en dólares estadounidenses y pueden pagarse en bolívares a la tasa oficial del Banco Central de Venezuela del día del pago, conforme a la normativa vigente.",
        "Los trabajos fuera del alcance de la propuesta, o los cambios pedidos después de aprobada una fase, se cotizan aparte.",
    ]]),
    ("4. Responsabilidades del cliente", [[
        "Entregar a tiempo la información necesaria (levantamientos, documentos del inmueble, requerimientos) y garantizar que es correcta y que tiene derecho a usarla.",
        "Salvo que la propuesta diga otra cosa, gestionar y pagar los permisos, licencias y trámites ante las autoridades, para los que te entregaremos la documentación técnica acordada.",
        "Si el proyecto queda sin respuesta del cliente más de 30 días, se pausa y los plazos se ajustan.",
    ]]),
    ("5. Obras y terceros", [
        "La construcción la ejecutan los contratistas que contrate el cliente o que se acuerden en la propuesta. Cuando supervisamos una obra, respondemos por nuestra supervisión en los términos acordados, no por los trabajos, materiales o retrasos de contratistas y proveedores, ni por cambios hechos sin nuestra aprobación.",
    ]),
    ("6. Propiedad intelectual", [[
        "Los planos, renders, bocetos y demás documentos del proyecto son obras protegidas por la Ley sobre el Derecho de Autor. Con el pago de cada fase, el cliente recibe una licencia para usarlos en la construcción del proyecto en el lugar acordado.",
        "Caraqueña Studio conserva los derechos de autor y puede mostrar el proyecto en su portafolio sin identificar al cliente, salvo que este pida por escrito que no se muestre.",
        "Los renders son representaciones ilustrativas: los materiales, colores y el resultado construido pueden variar.",
    ]]),
    ("7. Confidencialidad", [
        "Toda la información que nos compartes sobre tu proyecto, tu inmueble y tu negocio es confidencial. No la divulgamos ni la usamos para nada distinto a tu proyecto, ni durante el trabajo ni después. Solo la compartimos con los profesionales y contratistas que participen en tu proyecto, con tu conocimiento, o cuando la ley lo exija.",
    ]),
    ("8. Cancelación", [
        "Cualquiera de las partes puede terminar el proyecto avisando por escrito. En ese caso se pagan los honorarios de las fases completadas y del trabajo hecho en la fase en curso, según la propuesta. Lo no pagado no se entrega ni puede usarse.",
    ]),
    ("9. Responsabilidad", [
        "Nuestra responsabilidad por cada proyecto se limita a los honorarios pagados por la fase de que se trate, salvo dolo o lo que la ley disponga de forma imperativa. No respondemos por daños indirectos ni por lucro cesante. La información del sitio es general y no sustituye una propuesta ni una asesoría para tu caso.",
    ]),
    ("10. Fuerza mayor", [
        "Ninguna de las partes responde por retrasos o incumplimientos causados por hechos ajenos a su control que no pudo prever ni evitar (causa extraña no imputable, artículo 1.272 del Código Civil): cortes de electricidad o de internet, escasez de materiales, condiciones climáticas, emergencias sanitarias o decisiones de autoridades. Quien se vea afectado avisa a la otra parte lo antes posible y los plazos se extienden mientras dure el impedimento.",
    ]),
    ("11. Contenido de este sitio", [
        "Los textos, imágenes, renders, bocetos, animaciones, logotipo y diseño de este sitio son de Caraqueña Studio. No pueden copiarse ni reutilizarse sin permiso escrito.",
    ]),
    ("12. Ley aplicable y reclamos", [
        f"Estos términos se rigen por las leyes de la República Bolivariana de Venezuela. Si tienes un reclamo, escríbenos a {MAIL} y te responderemos en un plazo máximo de 15 días hábiles. Las diferencias se resolverán primero de forma amistosa y, si no es posible, ante los tribunales competentes de Caracas, sin perjuicio de los derechos que la ley reconoce a los consumidores.",
    ]),
    ("13. Cambios", [
        "Podemos actualizar estos términos. La versión vigente es la publicada en esta página con su fecha; los proyectos ya contratados se rigen por la versión que aceptaste.",
    ]),
]

T_EN = [
    ("1. Who we are", [
        f"Caraqueña Studio is an architecture, design and construction studio based in Caracas, Venezuela. Contact: {MAIL}, WhatsApp {WA} and Instagram {IG}.",
    ]),
    ("2. Acceptance", [
        "These terms govern the use of this site and the hiring of our services. By using the site or accepting a proposal from us in writing, you confirm that you know and accept them. Each project is also governed by its written proposal; if they differ, the proposal prevails.",
        "Electronic communications and acceptances (email or WhatsApp) are fully valid under Venezuela's Law on Data Messages and Electronic Signatures.",
    ]),
    ("3. Services and proposal", [[
        "We offer architectural and interior design, consulting, project development and construction supervision, as agreed in each proposal.",
        "Before starting we send you a written proposal with the scope, phases, deliverables, fees, payment method and timeline. Work starts when you accept it in writing.",
        "Fees are expressed in US dollars and may be paid in bolívares at the official Central Bank of Venezuela rate on the payment date, as required by law.",
        "Work outside the scope of the proposal, or changes requested after a phase is approved, are quoted separately.",
    ]]),
    ("4. Client responsibilities", [[
        "Provide the necessary information on time (surveys, property documents, requirements) and ensure it is accurate and that you are entitled to use it.",
        "Unless the proposal says otherwise, manage and pay for permits, licenses and filings with the authorities, for which we will deliver the agreed technical documentation.",
        "If the client does not respond for more than 30 days, the project is paused and the timeline is adjusted.",
    ]]),
    ("5. Construction and third parties", [
        "Construction is carried out by contractors hired by the client or agreed in the proposal. When we supervise a project, we are responsible for our supervision as agreed, not for the work, materials or delays of contractors and suppliers, nor for changes made without our approval.",
    ]),
    ("6. Intellectual property", [[
        "Plans, renders, sketches and other project documents are works protected by Venezuela's Copyright Law. Upon payment of each phase, the client receives a license to use them to build the project at the agreed location.",
        "Caraqueña Studio keeps the copyright and may show the project in its portfolio without identifying the client, unless the client asks in writing for it not to be shown.",
        "Renders are illustrative representations: materials, colors and the built result may vary.",
    ]]),
    ("7. Confidentiality", [
        "All information you share with us about your project, your property and your business is confidential. We do not disclose it or use it for anything other than your project, during the work or afterwards. We only share it with the professionals and contractors involved in your project, with your knowledge, or when required by law.",
    ]),
    ("8. Cancellation", [
        "Either party may end the project by written notice. In that case, the fees for completed phases and for the work done in the current phase are paid, according to the proposal. Unpaid work is not delivered and may not be used.",
    ]),
    ("9. Liability", [
        "Our liability for each project is limited to the fees paid for the phase concerned, except for willful misconduct or what the law mandatorily provides. We are not liable for indirect damages or loss of profit. The information on the site is general and does not replace a proposal or advice for your case.",
    ]),
    ("10. Force majeure", [
        "Neither party is liable for delays or failures caused by events beyond its control that it could not foresee or avoid (article 1,272 of the Venezuelan Civil Code): power or internet outages, material shortages, weather conditions, health emergencies or decisions of authorities. The affected party will notify the other as soon as possible and deadlines are extended for as long as the impediment lasts.",
    ]),
    ("11. Content of this site", [
        "The texts, images, renders, sketches, animations, logo and design of this site belong to Caraqueña Studio. They may not be copied or reused without written permission.",
    ]),
    ("12. Governing law and complaints", [
        f"These terms are governed by the laws of the Bolivarian Republic of Venezuela. If you have a complaint, write to {MAIL} and we will reply within 15 business days. Disputes will first be settled amicably and, if that is not possible, before the competent courts of Caracas, without prejudice to the rights the law grants consumers.",
    ]),
    ("13. Changes", [
        "We may update these terms. The current version is the one published on this page with its date; projects already contracted are governed by the version you accepted.",
    ]),
]

P_ES = [
    ("1. Responsable", [
        f"Caraqueña Studio, estudio de arquitectura con sede en Caracas, Venezuela, es responsable de los datos que nos das. Para cualquier pregunta sobre tus datos: {MAIL} o WhatsApp {WA}.",
    ]),
    ("2. Qué datos tratamos y para qué", [
        "El sitio no tiene formularios ni registro de usuarios, no usa cookies ni guarda nada en tu navegador, y no tiene herramientas de analítica o publicidad. Solo tratamos lo que tú decides enviarnos:",
        ("table", ["Cuándo", "Datos", "Para qué"], [
            ["Si nos escribes por correo, WhatsApp o Instagram", "Tu nombre, correo, número o usuario y lo que nos cuentes.", "Responderte y preparar tu propuesta."],
            ["Si nos contratas", "Los datos necesarios para la propuesta, la facturación y el proyecto (por ejemplo, documentos y planos del inmueble).", "Ejecutar el proyecto y cumplir obligaciones legales y fiscales."],
            ["Al visitar el sitio", "Datos técnicos de conexión (dirección IP, navegador) que reciben el alojamiento y los proveedores de contenido.", "Entregar la página de forma segura. No accedemos a ellos."],
        ]),
        "Usamos tus datos con tu consentimiento, que das al escribirnos, y para ejecutar el contrato cuando nos contratas. No vendemos datos, no los usamos para publicidad y no te enviaremos mensajes promocionales sin tu permiso.",
    ]),
    ("3. Con quién se comparten", [
        "Solo con quien hace falta para atenderte, y con las autoridades cuando la ley lo exija:",
        [
            "Los profesionales y contratistas que participen en tu proyecto, con tu conocimiento.",
            "Meta (WhatsApp e Instagram) y nuestro proveedor de correo, para las conversaciones que inicias.",
            "Vercel y GitHub (alojamiento del sitio).",
            "Google (fuentes tipográficas), cdnjs y jsDelivr (archivos de animación), que reciben datos técnicos de conexión, como la IP, para entregar la página.",
        ],
        "Algunos de estos proveedores procesan datos fuera de Venezuela, principalmente en Estados Unidos.",
    ]),
    ("4. Cuánto tiempo los guardamos", [[
        "Consultas que no se convierten en proyecto: hasta 12 meses.",
        "Datos de clientes y proyectos: mientras dure la relación y lo que exijan las leyes fiscales y mercantiles.",
    ]]),
    ("5. Tus derechos", [
        "Según los artículos 28 y 60 de la Constitución, puedes pedir en cualquier momento saber qué datos tenemos sobre ti y para qué, que los actualicemos, corrijamos o eliminemos, y retirar tu consentimiento, sin efecto sobre lo hecho antes. Escríbenos y responderemos en un máximo de 15 días hábiles. Si pides eliminar tus datos, solo conservaremos lo que exija la ley.",
    ]),
    ("6. Seguridad y menores", [
        "El sitio funciona con conexión cifrada (HTTPS) y la información de tu proyecto solo la maneja el equipo de Caraqueña Studio. Nuestros servicios son para mayores de edad.",
    ]),
    ("7. Cambios", [
        "Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha.",
    ]),
]

P_EN = [
    ("1. Controller", [
        f"Caraqueña Studio, an architecture studio based in Caracas, Venezuela, is responsible for the data you give us. For any question about your data: {MAIL} or WhatsApp {WA}.",
    ]),
    ("2. What data we process and why", [
        "The site has no forms or user accounts, uses no cookies and stores nothing in your browser, and has no analytics or advertising tools. We only process what you choose to send us:",
        ("table", ["When", "Data", "Purpose"], [
            ["If you write to us by email, WhatsApp or Instagram", "Your name, email, number or username and what you tell us.", "Answer you and prepare your proposal."],
            ["If you hire us", "The data needed for the proposal, invoicing and the project (for example, property documents and plans).", "Carry out the project and meet legal and tax obligations."],
            ["When you visit the site", "Technical connection data (IP address, browser) received by the hosting and content providers.", "Deliver the page securely. We do not access it."],
        ]),
        "We use your data with your consent, which you give by writing to us, and to perform the contract when you hire us. We do not sell data, use it for advertising or send you promotional messages without your permission.",
    ]),
    ("3. Who we share it with", [
        "Only with those needed to serve you, and with authorities when required by law:",
        [
            "The professionals and contractors involved in your project, with your knowledge.",
            "Meta (WhatsApp and Instagram) and our email provider, for the conversations you start.",
            "Vercel and GitHub (site hosting).",
            "Google (fonts), cdnjs and jsDelivr (animation files), which receive technical connection data, such as your IP, to deliver the page.",
        ],
        "Some of these providers process data outside Venezuela, mainly in the United States.",
    ]),
    ("4. How long we keep it", [[
        "Inquiries that do not become a project: up to 12 months.",
        "Client and project data: for the duration of the relationship and as long as tax and commercial law requires.",
    ]]),
    ("5. Your rights", [
        "Under articles 28 and 60 of the Venezuelan Constitution, you may at any time ask what data we hold about you and why, have it updated, corrected or deleted, and withdraw your consent, without affecting what was done before. Write to us and we will reply within 15 business days. If you ask us to delete your data, we will only keep what the law requires.",
    ]),
    ("6. Security and minors", [
        "The site uses an encrypted connection (HTTPS) and your project information is handled only by the Caraqueña Studio team. Our services are for adults.",
    ]),
    ("7. Changes", [
        "If we change this policy, we will publish the new version on this page with its date.",
    ]),
]

C_ES = [
    ("1. Este sitio no usa cookies", [
        "Caraqueña Studio no usa cookies propias ni de terceros: ni analítica, ni publicidad, ni píxeles de redes sociales. Tampoco guarda datos en el almacenamiento de tu navegador. Por eso no te mostramos un aviso para aceptarlas.",
    ]),
    ("2. Fuentes y archivos externos", [
        "Las tipografías (Google Fonts) y los archivos de animación (cdnjs y jsDelivr) se descargan de servicios externos. No instalan cookies, pero reciben datos técnicos de conexión, como la IP, para entregarlos.",
    ]),
    ("3. WhatsApp e Instagram", [
        "Los botones de WhatsApp e Instagram son enlaces normales: no cargan nada de esos servicios hasta que los pulsas. A partir de ahí aplican sus propias políticas.",
    ]),
    ("4. Cambios", [
        "Si algún día añadimos cookies que no sean estrictamente necesarias, te pediremos permiso antes de activarlas y actualizaremos esta política.",
    ]),
]

C_EN = [
    ("1. This site uses no cookies", [
        "Caraqueña Studio uses no first-party or third-party cookies: no analytics, advertising or social media pixels. It does not store data in your browser's storage either. That is why we do not show you a banner to accept them.",
    ]),
    ("2. External fonts and files", [
        "The fonts (Google Fonts) and animation files (cdnjs and jsDelivr) are downloaded from external services. They set no cookies but receive technical connection data, such as your IP, to deliver them.",
    ]),
    ("3. WhatsApp and Instagram", [
        "The WhatsApp and Instagram buttons are plain links: nothing from those services loads until you tap them. From then on, their own policies apply.",
    ]),
    ("4. Changes", [
        "If we ever add cookies that are not strictly necessary, we will ask for your permission before enabling them and update this policy.",
    ]),
]

DOCS = {
    "terms": {
        "es": {"title": "Términos y condiciones", "description": "Condiciones de uso del sitio de Caraqueña Studio y de la contratación de servicios de arquitectura, diseño y construcción.",
               "intro": [], "sections": T_ES},
        "en": {"title": "Terms and conditions", "description": "Terms of use of the Caraqueña Studio website and of hiring architecture, design and construction services.",
               "intro": ["The Spanish version prevails in case of discrepancy."], "sections": T_EN},
    },
    "privacy": {
        "es": {"title": "Política de privacidad", "description": "Qué datos trata Caraqueña Studio, para qué, con quién se comparten y cómo ejercer tus derechos.",
               "intro": ["Aquí te contamos qué datos tuyos usamos, para qué, cuánto tiempo los guardamos y cómo puedes pedir que los cambiemos o borremos."], "sections": P_ES},
        "en": {"title": "Privacy policy", "description": "What data Caraqueña Studio processes, why, who it is shared with and how to exercise your rights.",
               "intro": ["Here we explain what data of yours we use, why, how long we keep it and how you can ask us to change or delete it. The Spanish version prevails in case of discrepancy."], "sections": P_EN},
    },
    "cookies": {
        "es": {"title": "Política de cookies", "description": "Caraqueña Studio no usa cookies ni guarda datos en tu navegador.",
               "intro": [], "sections": C_ES},
        "en": {"title": "Cookie policy", "description": "Caraqueña Studio uses no cookies and stores nothing in your browser.",
               "intro": ["The Spanish version prevails in case of discrepancy."], "sections": C_EN},
    },
}
