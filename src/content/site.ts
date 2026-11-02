export type SiteLink = {
  id: string;
  label: string;
  href: string;
};

export type SocialLink = {
  id: "linkedin" | "instagram";
  label: string;
  href: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  paragraphs: string[];
  icon: string;
  image: string;
};

/** Contenido editable. Cada bloque pasa a un formulario del admin. */
export type SiteContent = {
  brand: {
    name: string;
    logo: string;
  };
  navigation: SiteLink[];
  social: SocialLink[];
  contact: {
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    whatsappHref: string;
  };
  footer: {
    tagline: string;
    linksTitle: string;
    contactTitle: string;
    copyright: string;
    links: SiteLink[];
  };
  home: {
    hero: {
      prefix: string;
      rotating: string[];
      subtitle: string;
      paragraphs: string[];
      image: string;
    };
    install: {
      title: string;
      paragraphs: string[];
      ctaLabel: string;
      ctaHref: string;
    };
    system: {
      title: string;
      image: string;
      ctaLabel: string;
      ctaHref: string;
    };
    why: {
      title: string;
      paragraphs: string[];
    };
  };
  about: {
    title: string;
    paragraphs: string[];
    storyTitle: string;
    storyParagraphs: string[];
  };
  services: {
    title: string;
    paragraphs: string[];
    items: ServiceItem[];
  };
  contactPage: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    messageLabel: string;
    submitLabel: string;
  };
};

export const defaultSiteContent: SiteContent = {
  brand: {
    name: "TRAC",
    logo: "/brand/logo.png",
  },
  navigation: [
    { id: "inicio", label: "Inicio", href: "/" },
    { id: "quienes", label: "Quiénes somos", href: "/quienes-somos" },
    { id: "servicios", label: "Servicios", href: "/servicios" },
    { id: "contacto", label: "Contacto", href: "/contacto" },
  ],
  social: [
    { id: "linkedin", label: "LinkedIn", href: "" },
    { id: "instagram", label: "Instagram", href: "https://instagram.com/somostrac" },
  ],
  contact: {
    email: "info@somostrac.com.ar",
    phoneDisplay: "+54 9 11 7823-4757",
    phoneHref: "tel:+5491178234757",
    whatsappHref: "https://wa.me/5491178234757",
  },
  footer: {
    tagline: "Comercial para agro y pesados.",
    linksTitle: "Links",
    contactTitle: "Contacto",
    copyright: "© 2026 TRAC. Todos los derechos reservados.",
    links: [
      { id: "inicio", label: "Inicio", href: "/" },
      { id: "quienes", label: "Quienes Somos", href: "/quienes-somos" },
      { id: "servicios", label: "Servicios", href: "/servicios" },
      { id: "contacto", label: "Contacto", href: "/contacto" },
    ],
  },
  home: {
    hero: {
      prefix: "SOMOS",
      rotating: ["TRAC.", "ESTRATEGIA.", "ESTRUCTURA.", "TRACCIÓN."],
      subtitle:
        "Armamos el circuito comercial de concesionarias de agro y maquinaria pesada: demanda, seguimiento y cierre.",
      paragraphs: [
        "Entramos a la concesionaria. Ordenamos cómo entra la consulta, quién la atiende y con qué criterio se cierra.",
        "Conocemos el rubro: cómo se cotiza una máquina, cómo decide el comprador y cómo opera una red de vendedores.",
        "Si marketing, showroom y vendedores no comparten el mismo proceso, se pierden operaciones. Ese es el trabajo.",
      ],
      image: "/brand/hero.png",
    },
    install: {
      title: "Instalamos sistema comercial",
      paragraphs: [
        "Nos ocupamos del proceso comercial de punta a punta: pauta, captura, CRM y seguimiento de la venta.",
        "No entregamos una campaña y nos vamos. Nos quedamos en la operación hasta que el circuito funciona con el equipo de la concesionaria.",
      ],
      ctaLabel: "CONTACTANOS",
      ctaHref: "/contacto",
    },
    system: {
      title: "El circuito comercial,\nde la pauta al cierre",
      image: "/brand/system.png",
      ctaLabel: "CONOCÉ NUESTROS SERVICIOS",
      ctaHref: "/servicios",
    },
    why: {
      title: "POR QUÉ TRAC?",
      paragraphs: [
        "La pauta no sirve si el vendedor no sabe qué hacer con la consulta.",
        "Un CRM vacío o mal cargado no da información para decidir.",
        "Revisamos números todas las semanas: qué anuncio trae consultas, cuáles se pierden y dónde se frena la venta.",
      ],
    },
  },
  about: {
    title: "QUIENES SOMOS.",
    paragraphs: [
      "Trabajamos con concesionarias de agro y pesados que ya venden, pero no tienen un circuito comercial ordenado.",
      "El trabajo es operativo: definir oferta, captar demanda, registrar cada consulta y medir el cierre.",
    ],
    storyTitle: "De dónde viene TRAC",
    storyParagraphs: [
      "En muchas concesionarias el marketing, el showroom y los vendedores trabajan por separado. La consulta se pierde entre un anuncio, un WhatsApp y una planilla.",
      "TRAC se armó para unir esas partes. Campaña, landing, CRM y seguimiento comercial, a cargo de un mismo equipo.",
      "Entramos al negocio, vemos cómo se vende hoy y dejamos el proceso documentado y en marcha.",
    ],
  },
  services: {
    title: "SERVICIOS.",
    paragraphs: [
      "Cuatro bloques. Se pueden tomar juntos o de a uno, según cómo esté la comercial hoy.",
      "Estrategia, pauta, captura de consultas y ajuste semanal de lo que no cierra.",
    ],
    items: [
      {
        id: "estrategia",
        title: "Estrategia y arquitectura comercial",
        paragraphs: [
          "Definimos a quién se le vende, con qué oferta y qué tiene que hacer marketing para que el vendedor tenga trabajo concreto.",
          "Sale un plan de captación, canales y metas. No un diagnóstico para el cajón.",
        ],
        icon: "/brand/icon-estrategia.png",
        image: "/brand/service-estrategia.jpg",
      },
      {
        id: "demanda",
        title: "Generación de demanda",
        paragraphs: [
          "Armamos y operamos las campañas en Meta y Google para traer consultas de gente que está comprando máquina.",
          "Cada anuncio tiene presupuesto, objetivo y reporte. Lo que no trae consultas se corta.",
        ],
        icon: "/brand/icon-demanda.png",
        image: "/brand/service-demanda.jpg",
      },
      {
        id: "captura",
        title: "Sistema de captura y seguimiento",
        paragraphs: [
          "Landing, WhatsApp y CRM conectados: cada consulta queda registrada y asignada a un vendedor.",
          "Sin ese registro no hay forma de saber cuántas operaciones se están perdiendo.",
        ],
        icon: "/brand/icon-captura.png",
        image: "/brand/service-captura.jpg",
      },
      {
        id: "optimizacion",
        title: "Optimización y escalabilidad",
        paragraphs: [
          "Leemos pauta, contactos y cierres. Ajustamos lo que no convierte y reforzamos lo que sí.",
          "El criterio es más consultas útiles, menos plata tirada y un proceso que el equipo pueda sostener.",
        ],
        icon: "/brand/icon-optimizacion.png",
        image: "/brand/service-optimizacion.jpg",
      },
    ],
  },
  contactPage: {
    title: "Contacto",
    nameLabel: "Nombre",
    emailLabel: "Email",
    phoneLabel: "Teléfono",
    messageLabel: "Mensaje",
    submitLabel: "Enviar por WhatsApp",
  },
};

export { getSiteContent } from "@/lib/site-store";
