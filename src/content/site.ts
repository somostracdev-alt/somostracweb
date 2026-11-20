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

export type CopyBlock = {
  title: string;
  text: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  summary: string;
  lead: string;
  points: string[];
  closing: string;
  icon: string;
  image: string;
};

/** Bumped when the public copy is replaced. Older saved JSON keeps images and contact data only. */
export const contentRevision = 2;

/** Contenido editable. Cada bloque pasa a un formulario del admin. */
export type SiteContent = {
  revision: number;
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
    summary: string;
    tagline: string;
    linksTitle: string;
    contactTitle: string;
    copyright: string;
    links: SiteLink[];
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    contactTitle: string;
    contactDescription: string;
  };
  home: {
    hero: {
      prefix: string;
      rotating: string[];
      subtitle: string;
      paragraphs: string[];
      image: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
    };
    install: {
      title: string;
      paragraphs: string[];
      stages: string[];
      ctaLabel: string;
      ctaHref: string;
    };
    system: {
      title: string;
      image: string;
      ctaLabel: string;
      ctaHref: string;
    };
    sectors: {
      title: string;
      items: string[];
      close: string;
    };
    why: {
      title: string;
      paragraphs: string[];
      statValue: string;
      statText: string;
      statSource: string;
      ctaLabel: string;
      ctaHref: string;
    };
    close: {
      title: string;
      text: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  about: {
    title: string;
    paragraphs: string[];
    storyTitle: string;
    storyParagraphs: string[];
    principlesTitle: string;
    principles: CopyBlock[];
    teamTitle: string;
    team: CopyBlock[];
    teamNote: string;
    closeTitle: string;
    closeText: string;
    closeLabel: string;
    closeHref: string;
  };
  services: {
    title: string;
    paragraphs: string[];
    items: ServiceItem[];
    closeTitle: string;
    closeText: string;
    closeLabel: string;
    closeHref: string;
  };
  contactPage: {
    title: string;
    intro: string;
    stepsTitle: string;
    steps: string[];
    whatsappButton: string;
    nameLabel: string;
    companyLabel: string;
    sectorLabel: string;
    sectors: string[];
    whatsappLabel: string;
    emailLabel: string;
    zoneLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    privacy: string;
    success: string;
  };
};

export const defaultSiteContent: SiteContent = {
  revision: contentRevision,
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
    summary: "Marketing y gestión comercial para empresas del agro y pesados.",
    tagline: "Estrategia. Sistema. Performance.",
    linksTitle: "Navegación",
    contactTitle: "Contacto",
    copyright: "© 2026 TRAC. Todos los derechos reservados.",
    links: [
      { id: "inicio", label: "Inicio", href: "/" },
      { id: "quienes", label: "Quiénes somos", href: "/quienes-somos" },
      { id: "servicios", label: "Servicios", href: "/servicios" },
      { id: "contacto", label: "Contacto", href: "/contacto" },
    ],
  },
  seo: {
    homeTitle: "TRAC | Marketing y gestión comercial para el agro",
    homeDescription:
      "Conectamos tu marketing con tus ventas. Estrategia, campañas, leads y CRM para empresas del agro y pesados en Argentina.",
    aboutTitle: "Quiénes somos | TRAC",
    aboutDescription:
      "Equipo de marketing y gestión comercial especializado en el agro argentino. Entramos al negocio, implementamos y medimos resultados.",
    servicesTitle: "Servicios | TRAC",
    servicesDescription:
      "Estrategia comercial, campañas en Meta y Google, captura de leads, CRM y optimización para empresas del agro y pesados.",
    contactTitle: "Contacto | TRAC",
    contactDescription:
      "Contanos dónde está trabado tu proceso comercial. Te respondemos en menos de 24 horas.",
  },
  home: {
    hero: {
      prefix: "SOMOS",
      rotating: ["TRAC.", "ESTRATEGIA.", "ESTRUCTURA.", "TRACCIÓN."],
      subtitle: "Marketing y gestión comercial para empresas del agro y pesados.",
      paragraphs: [
        "Entramos a tu negocio, armamos el sistema que conecta tu marketing con tus ventas y lo ponemos a funcionar. Con equipo propio y responsabilidad sobre el resultado.",
      ],
      image: "/brand/hero.png",
      primaryLabel: "Agendá una reunión",
      primaryHref: "/contacto",
      secondaryLabel: "Escribinos por WhatsApp",
    },
    install: {
      title: "Instalamos un sistema comercial.",
      paragraphs: [
        "Muchas empresas del agro hacen marketing y venden, pero por separado. Las campañas generan consultas que nadie sigue, los vendedores trabajan sin datos y las decisiones se toman a ojo. Nosotros unimos todo en un solo sistema, desde que alguien ve tu marca hasta que cierra la compra.",
        "Diseñamos, implementamos, medimos y optimizamos cada etapa.",
      ],
      stages: ["Estrategia", "Generación de demanda", "El proceso", "Optimización"],
      ctaLabel: "Contactanos",
      ctaHref: "/contacto",
    },
    system: {
      title: "Un sistema completo,\nde la demanda a la venta.",
      image: "/brand/system.png",
      ctaLabel: "Conocé nuestros servicios",
      ctaHref: "/servicios",
    },
    sectors: {
      title: "Trabajamos con el agro que vende.",
      items: [
        "Concesionarios de maquinaria y camiones",
        "Fábricas de implementos y agropartes",
        "Empresas de insumos y semillas",
        "Empresas de servicios agrícolas",
      ],
      close: "Si tu empresa tiene un equipo comercial y quiere vender más, hablamos el mismo idioma.",
    },
    why: {
      title: "Por qué TRAC.",
      paragraphs: [
        "Diseñamos campañas, sí. Pero también las conectamos con el sistema comercial que las convierte en ventas reales.",
        "Generamos demanda, sí. Pero también estructuramos el seguimiento para que cada lead se gestione, se mida y se cierre.",
        "Optimizamos cada acción, sí. Pero también escalamos lo que funciona para que el crecimiento sea sostenido.",
        "Te asesoramos, sí. Pero también ponemos el equipo que lo ejecuta.",
      ],
      statValue: "7x.",
      statText: "más chances de calificar un lead si lo respondés dentro de la primera hora.",
      statSource: "Fuente: Harvard Business Review, 2011",
      ctaLabel: "Agendá una reunión",
      ctaHref: "/contacto",
    },
    close: {
      title: "¿Tu marketing vende o solo comunica?",
      text: "Contanos dónde está trabado tu proceso comercial y te decimos cómo lo resolveríamos.",
      ctaLabel: "Agendá una reunión",
      ctaHref: "/contacto",
    },
  },
  about: {
    title: "Quiénes somos",
    paragraphs: [
      "Somos un equipo de marketing y gestión comercial que viene del agro y trabaja adentro del negocio de sus clientes.",
    ],
    storyTitle: "El sistema detrás del crecimiento",
    storyParagraphs: [
      "TRAC nace de ver el mismo problema una y otra vez desde adentro del rubro. Empresas del agro con buenos productos, buenos vendedores y presupuesto en marketing, pero sin un sistema que conecte todo. Campañas que generan consultas que nadie sigue. Vendedores que no saben de dónde viene cada cliente. Decisiones tomadas sin datos. Venimos de ese mundo. Sabemos cómo se vende en el agro, cómo decide el comprador y cómo funciona una red comercial. Por eso no asesoramos desde afuera: entramos, armamos el sistema y lo ponemos a funcionar.",
    ],
    principlesTitle: "Cómo trabajamos",
    principles: [
      {
        title: "Entramos al negocio",
        text: "Antes de proponer, entendemos cómo vendés hoy: tu proceso, tu equipo y tus números.",
      },
      {
        title: "Implementamos",
        text: "No entregamos un informe y nos vamos. Ponemos el equipo que ejecuta.",
      },
      {
        title: "Medimos todo",
        text: "Cada campaña, cada lead y cada venta queda registrada. Lo que no se mide no se puede mejorar.",
      },
      {
        title: "Nos hacemos cargo del resultado",
        text: "Nuestro trabajo se evalúa en ventas, no en likes.",
      },
    ],
    teamTitle: "El equipo",
    team: [
      {
        title: "Cofundadora y Head comercial",
        text: "Estrategia comercial, gestión de leads y relación con clientes.",
      },
      {
        title: "Cofundadora y Head de marketing",
        text: "Estrategia de marketing, performance y pauta digital.",
      },
      {
        title: "Equipo dedicado",
        text: "Cada cliente tiene una ejecutiva de cuentas exclusiva, además de especialistas en diseño, contenido y pauta.",
      },
    ],
    teamNote: "Más de 10 años trabajando en marketing para marcas del agro y pesados.",
    closeTitle: "¿Hablamos?",
    closeText: "Contanos en qué está tu empresa y vemos juntos por dónde empezar.",
    closeLabel: "Agendá una reunión",
    closeHref: "/contacto",
  },
  services: {
    title: "Servicios",
    paragraphs: [
      "Instalamos sistemas comerciales que generan demanda, mejoran la conversión y escalan resultados medibles. Cada servicio es una parte del mismo sistema, y funcionan mejor juntos.",
    ],
    items: [
      {
        id: "estrategia",
        title: "Estrategia comercial",
        summary:
          "Definimos el foco, el público y los objetivos de venta, y alineamos el marketing con eso. Sin estrategia clara, no hay conversión.",
        lead: "Definimos dónde está el negocio y cómo llegar.",
        points: [
          "Diagnóstico del proceso comercial actual",
          "Definición de foco, público y objetivos de venta",
          "Plan de marketing alineado a ventas",
        ],
        closing: "Sin estrategia clara, no hay conversión.",
        icon: "/brand/icon-estrategia.png",
        image: "/brand/service-estrategia.jpg",
      },
      {
        id: "demanda",
        title: "Generación de demanda",
        summary:
          "Campañas en Meta y Google, contenido y redes. Cada acción tiene un objetivo y cada campaña se mide.",
        lead: "Hacemos que te encuentren los clientes correctos.",
        points: ["Campañas en Meta y Google", "Estrategia de contenido y calendario de redes", "Piezas y anuncios"],
        closing: "Cada acción tiene un objetivo. Cada campaña se mide.",
        icon: "/brand/icon-demanda.png",
        image: "/brand/service-demanda.jpg",
      },
      {
        id: "captura",
        title: "Captura y seguimiento de leads",
        summary:
          "Landing pages, WhatsApp y CRM para que ninguna consulta se pierda y cada lead tenga seguimiento hasta el cierre.",
        lead: "Que ninguna consulta se pierda en el camino.",
        points: [
          "Landing pages y web",
          "WhatsApp y CRM integrados",
          "Proceso de seguimiento y capacitación al equipo comercial",
        ],
        closing: "Si no se mide el proceso, no se puede mejorar.",
        icon: "/brand/icon-captura.png",
        image: "/brand/service-captura.jpg",
      },
      {
        id: "optimizacion",
        title: "Medición y optimización",
        summary:
          "Medimos lo que importa: costo por lead, conversión y ventas. Escalamos lo que funciona y ajustamos lo que no.",
        lead: "Decisiones con datos, no a ojo.",
        points: [
          "Tablero de performance",
          "Reportes mensuales con costo por lead, conversión y ventas",
          "Ajustes continuos para escalar lo que funciona",
        ],
        closing: "El crecimiento no se improvisa, se optimiza.",
        icon: "/brand/icon-optimizacion.png",
        image: "/brand/service-optimizacion.jpg",
      },
    ],
    closeTitle: "¿No sabés por dónde empezar?",
    closeText: "Te ayudamos a definirlo en una primera reunión.",
    closeLabel: "Agendá una reunión",
    closeHref: "/contacto",
  },
  contactPage: {
    title: "Contacto",
    intro:
      "Contanos dónde está trabado tu proceso comercial. Te respondemos en menos de 24 horas. La primera reunión es sin costo.",
    stepsTitle: "Qué pasa después",
    steps: [
      "Te contactamos para conocer tu negocio.",
      "Hacemos un diagnóstico de tu proceso comercial.",
      "Te presentamos una propuesta a medida.",
    ],
    whatsappButton: "Escribinos por WhatsApp",
    nameLabel: "Nombre",
    companyLabel: "Empresa",
    sectorLabel: "Rubro",
    sectors: [
      "Concesionario",
      "Fábrica de implementos",
      "Insumos",
      "Semillas",
      "Servicios agrícolas",
      "Otro",
    ],
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    zoneLabel: "Provincia o zona",
    messageLabel: "Mensaje",
    messagePlaceholder: "Contanos qué querés mejorar en tu proceso comercial",
    submitLabel: "Quiero que me contacten",
    privacy: "Usamos tus datos solo para responder tu consulta.",
    success: "¡Gracias! Recibimos tu consulta y te escribimos en menos de 24 horas.",
  },
};

export { getSiteContent } from "@/lib/site-store";
