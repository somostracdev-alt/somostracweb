import type { SiteContent } from "@/content/site";

export const englishSiteContent: SiteContent = {
  brand: {
    name: "TRAC",
    logo: "/brand/logo.png",
  },
  navigation: [
    { id: "inicio", label: "Home", href: "/" },
    { id: "quienes", label: "About us", href: "/quienes-somos" },
    { id: "servicios", label: "Services", href: "/servicios" },
    { id: "contacto", label: "Contact", href: "/contacto" },
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
    tagline: "Sales systems for ag and heavy equipment.",
    linksTitle: "Links",
    contactTitle: "Contact",
    copyright: "© 2026 TRAC. All rights reserved.",
    links: [
      { id: "inicio", label: "Home", href: "/" },
      { id: "quienes", label: "About us", href: "/quienes-somos" },
      { id: "servicios", label: "Services", href: "/servicios" },
      { id: "contacto", label: "Contact", href: "/contacto" },
    ],
  },
  home: {
    hero: {
      prefix: "WE ARE",
      rotating: ["TRAC.", "STRATEGY.", "STRUCTURE.", "TRACTION."],
      subtitle:
        "We build the sales process for ag and heavy-equipment dealerships: demand, follow-up, and closing.",
      paragraphs: [
        "We go into the dealership. We sort out how an inquiry comes in, who handles it, and how a deal is closed.",
        "We know the trade: how a machine is quoted, how the buyer decides, and how a sales team actually works.",
        "If marketing, the showroom, and sales don't share one process, deals fall through. That is the job.",
      ],
      image: "/brand/hero.png",
    },
    install: {
      title: "We install a sales system",
      paragraphs: [
        "We run the commercial process end to end: ads, capture, CRM, and follow-up through the sale.",
        "We don't hand over a campaign and leave. We stay in the operation until the circuit works with the dealership team.",
      ],
      ctaLabel: "CONTACT US",
      ctaHref: "/contacto",
    },
    system: {
      title: "The sales circuit,\nfrom ads to close",
      image: "/brand/system.png",
      ctaLabel: "SEE OUR SERVICES",
      ctaHref: "/servicios",
    },
    why: {
      title: "WHY TRAC?",
      paragraphs: [
        "Ads don't help if the salesperson doesn't know what to do with the inquiry.",
        "An empty or poorly kept CRM doesn't give you anything to decide on.",
        "We review numbers every week: which ad brings inquiries, which ones are lost, and where the sale stalls.",
      ],
    },
  },
  about: {
    title: "ABOUT US.",
    paragraphs: [
      "We work with ag and heavy-equipment dealerships that already sell, but don't have an ordered sales process.",
      "The work is operational: define the offer, bring in demand, log every inquiry, and measure the close.",
    ],
    storyTitle: "Where TRAC comes from",
    storyParagraphs: [
      "In many dealerships, marketing, the showroom, and sales work apart. The inquiry gets lost between an ad, a WhatsApp, and a spreadsheet.",
      "TRAC was built to join those parts. Campaign, landing, CRM, and sales follow-up, run by the same team.",
      "We go into the business, see how it sells today, and leave the process documented and running.",
    ],
  },
  services: {
    title: "SERVICES.",
    paragraphs: [
      "Four blocks. They can be taken together or one at a time, depending on how sales are set up today.",
      "Strategy, ads, inquiry capture, and a weekly pass over what isn't closing.",
    ],
    items: [
      {
        id: "estrategia",
        title: "Sales strategy and structure",
        paragraphs: [
          "We define who you sell to, with what offer, and what marketing has to do so salespeople have real work.",
          "You get a capture plan, channels, and targets. Not a report for the drawer.",
        ],
        icon: "/brand/icon-estrategia.png",
        image: "/brand/service-estrategia.jpg",
      },
      {
        id: "demanda",
        title: "Demand generation",
        paragraphs: [
          "We build and run Meta and Google campaigns to bring in inquiries from people buying equipment.",
          "Each ad has a budget, a goal, and a report. What doesn't bring inquiries gets cut.",
        ],
        icon: "/brand/icon-demanda.png",
        image: "/brand/service-demanda.jpg",
      },
      {
        id: "captura",
        title: "Capture and follow-up",
        paragraphs: [
          "Landing, WhatsApp, and CRM connected: every inquiry is logged and assigned to a salesperson.",
          "Without that record there is no way to know how many deals are being lost.",
        ],
        icon: "/brand/icon-captura.png",
        image: "/brand/service-captura.jpg",
      },
      {
        id: "optimizacion",
        title: "Optimization and scale",
        paragraphs: [
          "We read ads, contacts, and closes. We fix what doesn't convert and put more into what does.",
          "The bar is more useful inquiries, less wasted spend, and a process the team can keep running.",
        ],
        icon: "/brand/icon-optimizacion.png",
        image: "/brand/service-optimizacion.jpg",
      },
    ],
  },
  contactPage: {
    title: "Contact",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    submitLabel: "Send via WhatsApp",
  },
};
