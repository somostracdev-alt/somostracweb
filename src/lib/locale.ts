export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeCookie = "trac-locale";

export const uiCopy = {
  es: {
    login: "Login",
    formKicker: "Formulario de consulta",
    formSent: "Se abrió WhatsApp con tu mensaje. Si no lo ves, revisá que el navegador no haya bloqueado la ventana.",
    formMessage: (nombre: string, email: string, telefono: string, mensaje: string) =>
      `Hola TRAC, soy ${nombre}.\nEmail: ${email}\nTeléfono: ${telefono}\n\n${mensaje}`,
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
  },
  en: {
    login: "Login",
    formKicker: "Inquiry form",
    formSent: "WhatsApp opened with your message. If you don't see it, check that the browser didn't block the window.",
    formMessage: (nombre: string, email: string, telefono: string, mensaje: string) =>
      `Hi TRAC, this is ${nombre}.\nEmail: ${email}\nPhone: ${telefono}\n\n${mensaje}`,
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
  },
} as const;

export type UiCopy = (typeof uiCopy)[Locale];
