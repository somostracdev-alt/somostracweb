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
    tagline: "Estrategia. Sistema. Performance.",
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
        "Marketing y ventas dejan de ser acciones aisladas y pasan a ser un sistema que genera resultados.",
      paragraphs: [
        "No somos una agencia creativa ni una consultora teórica. Somos un equipo que entra al negocio, diseña el sistema que falta y lo pone a funcionar, con responsabilidad sobre el resultado.",
        "Llevamos años dentro del rubro agro y pesados. Entendemos cómo se vende una maquinaria, cómo piensa el comprador y cómo se gestiona una red comercial real. Entramos al negocio sabiendo cómo hacerlo crecer.",
        "El marketing es el motor. El sistema comercial es la transmisión. El performance es el resultado.",
      ],
      image: "/brand/hero.png",
    },
    install: {
      title: "Instalamos sistema comercial",
      paragraphs: [
        "TRAC es un partner de performance comercial para concesionarias de agro y pesados. No hacemos acciones aisladas, intervenimos en todo el proceso, desde la generación de demanda hasta el cierre de la venta.",
        "Diseñamos, implementamos, medimos y optimizamos cada etapa para lograr resultados sostenidos.",
      ],
      ctaLabel: "CONTACTANOS",
      ctaHref: "/contacto",
    },
    system: {
      title: "Sistema completo\nde performance comercial",
      image: "/brand/system.png",
      ctaLabel: "CONOCÉ NUESTROS SERVICIOS",
      ctaHref: "/servicios",
    },
    why: {
      title: "POR QUÉ TRAC",
      paragraphs: [
        "Diseñamos campañas, sí. Pero también las conectamos con el sistema comercial que las convierte en ventas reales.",
        "Generamos demanda, sí. Pero también estructuramos el seguimiento para que cada lead se gestione, se mida y se cierre.",
        "Optimizamos cada acción, sí. Pero también escalamos lo que funciona para que el crecimiento sea sostenido.",
      ],
    },
  },
  about: {
    title: "QUIENES SOMOS.",
    paragraphs: [
      "Ayudamos a concesionarias a dejar atrás las acciones aisladas y construir un sistema comercial con estructura, seguimiento y optimización constante.",
      "Cada decisión, campaña y proceso está pensado para generar rendimiento real y crecimiento sostenible.",
    ],
    storyTitle: "El sistema detrás del crecimiento",
    storyParagraphs: [
      "TRAC nace para resolver un problema común en muchas concesionarias: acciones comerciales sin estructura ni medición real.",
      "Combinamos estrategia, marketing digital, seguimiento y optimización bajo una misma lógica de performance comercial.",
      "No trabajamos con campañas aisladas. Diseñamos sistemas preparados para generar resultados sostenidos y escalables.",
    ],
  },
  services: {
    title: "SERVICIOS.",
    paragraphs: [
      "Implementamos sistemas comerciales diseñados para generar demanda, mejorar la conversión y escalar resultados de forma medible.",
      "Cada servicio forma parte de una estructura orientada a performance real.",
    ],
    items: [
      {
        id: "estrategia",
        title: "Estrategia y arquitectura comercial",
        paragraphs: [
          "Definimos el foco del negocio, estructuramos la captación y alineamos marketing con objetivos reales de venta.",
          "Sin estrategia clara, no hay conversión.",
        ],
        icon: "/brand/icon-estrategia.png",
      },
      {
        id: "demanda",
        title: "Generación de demanda",
        paragraphs: [
          "Diseñamos y gestionamos campañas en Meta y Google orientadas a resultados.",
          "Cada acción tiene un objetivo, cada campaña se mide.",
        ],
        icon: "/brand/icon-demanda.png",
      },
      {
        id: "captura",
        title: "Sistema de captura y seguimiento",
        paragraphs: [
          "Implementamos landing pages, integración con WhatsApp y CRM para registrar y gestionar cada lead.",
          "Si no se mide el proceso, no se puede mejorar.",
        ],
        icon: "/brand/icon-captura.png",
      },
      {
        id: "optimizacion",
        title: "Optimización y escalabilidad",
        paragraphs: [
          "Analizamos datos, mejoramos la conversión y escalamos lo que funciona.",
          "El crecimiento no es improvisado, es optimizado.",
        ],
        icon: "/brand/icon-optimizacion.png",
      },
    ],
  },
  contactPage: {
    title: "Contacto",
    nameLabel: "Nombre",
    emailLabel: "Email",
    messageLabel: "Mensaje",
    submitLabel: "ENVIAR",
  },
};

export function getSiteContent(): SiteContent {
  return defaultSiteContent;
}
