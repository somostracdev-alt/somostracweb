export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeCookie = "trac-locale";

export const uiCopy = {
  es: {
    login: "Login",
    formKicker: "Formulario de consulta",
    formSent: "¡Gracias! Recibimos tu consulta y te escribimos en menos de 24 horas.",
    formMessage: (fields: {
      nombre: string;
      empresa: string;
      rubro: string;
      whatsapp: string;
      email: string;
      zona: string;
      mensaje: string;
    }) =>
      `Hola TRAC, soy ${fields.nombre} de ${fields.empresa}.\nRubro: ${fields.rubro}\nWhatsApp: ${fields.whatsapp}\nEmail: ${fields.email}${fields.zona ? `\nZona: ${fields.zona}` : ""}${fields.mensaje ? `\n\n${fields.mensaje}` : ""}`,
    waGreeting: "Hola! Quiero potenciar mi negocio con TRAC",
    waBubble: "Escribinos. Pedimos el rubro y cómo está armada la comercial, y respondemos por acá.",
    waOpen: "Abrir WhatsApp",
    waClose: "Cerrar",
    waLabel: "Chat por WhatsApp con TRAC",
    waRole: "Agro y pesados",
    waMessageLabel: "Tu mensaje",
    themeLight: "Pasar a modo claro",
    themeDark: "Pasar a modo oscuro",
    language: "Idioma",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    developedBy: "Desarrollado por",
    problemKicker: "De dónde se pierde la venta",
    processKicker: "El circuito",
    offerKicker: "Cuatro bloques",
    closeKicker: "Siguiente paso",
    contactKicker: "Hablemos",
    contactLead:
      "Escribinos. Pedimos el rubro y cómo está armada la comercial, y seguimos por WhatsApp.",
  },
  en: {
    login: "Login",
    formKicker: "Inquiry form",
    formSent: "Thank you! We received your inquiry and we'll write within 24 hours.",
    formMessage: (fields: {
      nombre: string;
      empresa: string;
      rubro: string;
      whatsapp: string;
      email: string;
      zona: string;
      mensaje: string;
    }) =>
      `Hi TRAC, this is ${fields.nombre} from ${fields.empresa}.\nLine of business: ${fields.rubro}\nWhatsApp: ${fields.whatsapp}\nEmail: ${fields.email}${fields.zona ? `\nArea: ${fields.zona}` : ""}${fields.mensaje ? `\n\n${fields.mensaje}` : ""}`,
    waGreeting: "Hi! I want to strengthen my dealership with TRAC",
    waBubble: "Write to us. Tell us the line of business and how sales are set up today. We'll reply here.",
    waOpen: "Open WhatsApp",
    waClose: "Close",
    waLabel: "WhatsApp chat with TRAC",
    waRole: "Ag and heavy equipment",
    waMessageLabel: "Your message",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
    language: "Language",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    developedBy: "Developed by",
    problemKicker: "Where the sale gets lost",
    processKicker: "The circuit",
    offerKicker: "Four blocks",
    closeKicker: "Next step",
    contactKicker: "Let's talk",
    contactLead:
      "Write to us. We ask the line of business and how sales are set up, and we continue on WhatsApp.",
  },
} as const;

export type UiCopy = (typeof uiCopy)[Locale];
