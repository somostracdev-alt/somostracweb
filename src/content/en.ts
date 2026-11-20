import type { SiteContent } from "@/content/site";

export const englishSiteContent: SiteContent = {
  revision: 2,
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
    summary: "Marketing and sales management for ag and heavy-equipment companies.",
    tagline: "Strategy. System. Performance.",
    linksTitle: "Navigation",
    contactTitle: "Contact",
    copyright: "© 2026 TRAC. All rights reserved.",
    links: [
      { id: "inicio", label: "Home", href: "/" },
      { id: "quienes", label: "About us", href: "/quienes-somos" },
      { id: "servicios", label: "Services", href: "/servicios" },
      { id: "contacto", label: "Contact", href: "/contacto" },
    ],
  },
  seo: {
    homeTitle: "TRAC | Marketing and sales management for agriculture",
    homeDescription:
      "We connect your marketing with your sales. Strategy, campaigns, leads, and CRM for ag and heavy-equipment companies in Argentina.",
    aboutTitle: "About us | TRAC",
    aboutDescription:
      "A marketing and sales team specialized in Argentine agriculture. We go into the business, implement, and measure results.",
    servicesTitle: "Services | TRAC",
    servicesDescription:
      "Sales strategy, Meta and Google campaigns, lead capture, CRM, and optimization for ag and heavy-equipment companies.",
    contactTitle: "Contact | TRAC",
    contactDescription: "Tell us where your sales process is stuck. We reply within 24 hours.",
  },
  home: {
    hero: {
      prefix: "WE ARE",
      rotating: ["TRAC.", "STRATEGY.", "STRUCTURE.", "TRACTION."],
      subtitle: "Marketing and sales management for ag and heavy-equipment companies.",
      paragraphs: [
        "We go into your business, build the system that connects your marketing with your sales, and put it to work. With our own team and responsibility for the result.",
      ],
      image: "/brand/hero.png",
      primaryLabel: "Book a meeting",
      primaryHref: "/contacto",
      secondaryLabel: "Message us on WhatsApp",
    },
    install: {
      title: "We install a sales system.",
      paragraphs: [
        "Many ag companies do marketing and sell, but separately. Campaigns bring inquiries nobody follows, salespeople work without data, and decisions are made by feel. We join all of it into one system, from the moment someone sees your brand until the sale closes.",
        "We design, implement, measure, and optimize every stage.",
      ],
      stages: ["Strategy", "Demand generation", "The process", "Optimization"],
      ctaLabel: "Contact us",
      ctaHref: "/contacto",
    },
    system: {
      title: "A complete system,\nfrom demand to the sale.",
      image: "/brand/system.png",
      ctaLabel: "See our services",
      ctaHref: "/servicios",
    },
    sectors: {
      title: "We work with ag companies that sell.",
      items: [
        "Machinery and truck dealerships",
        "Implement and ag-parts manufacturers",
        "Input and seed companies",
        "Agricultural service companies",
      ],
      close: "If your company has a sales team and wants to sell more, we speak the same language.",
    },
    why: {
      title: "Why TRAC.",
      paragraphs: [
        "We design campaigns, yes. We also connect them to the sales system that turns them into real sales.",
        "We generate demand, yes. We also structure the follow-up so every lead is handled, measured, and closed.",
        "We optimize every action, yes. We also scale what works so growth holds.",
        "We advise you, yes. We also put in the team that does the work.",
      ],
      statValue: "7x.",
      statText: "better chance of qualifying a lead if you reply within the first hour.",
      statSource: "Source: Harvard Business Review, 2011",
      ctaLabel: "Book a meeting",
      ctaHref: "/contacto",
    },
    close: {
      title: "Does your marketing sell, or only communicate?",
      text: "Tell us where your sales process is stuck and we'll say how we would solve it.",
      ctaLabel: "Book a meeting",
      ctaHref: "/contacto",
    },
  },
  about: {
    title: "About us",
    paragraphs: [
      "We are a marketing and sales team that comes from agriculture and works inside our clients' businesses.",
    ],
    storyTitle: "The system behind the growth",
    storyParagraphs: [
      "TRAC started from seeing the same problem over and over from inside the industry. Ag companies with good products, good salespeople, and a marketing budget, but no system connecting it all. Campaigns that bring inquiries nobody follows. Salespeople who don't know where each customer came from. Decisions made without data. We come from that world. We know how ag sales work, how the buyer decides, and how a sales network operates. That is why we don't advise from the outside: we go in, build the system, and put it to work.",
    ],
    principlesTitle: "How we work",
    principles: [
      {
        title: "We go into the business",
        text: "Before we propose anything, we understand how you sell today: your process, your team, and your numbers.",
      },
      {
        title: "We implement",
        text: "We don't hand over a report and leave. We put in the team that does the work.",
      },
      {
        title: "We measure everything",
        text: "Every campaign, every lead, and every sale is recorded. What isn't measured can't be improved.",
      },
      {
        title: "We own the result",
        text: "Our work is judged on sales, not likes.",
      },
    ],
    teamTitle: "The team",
    team: [
      {
        title: "Cofounder and Head of sales",
        text: "Sales strategy, lead management, and client relationships.",
      },
      {
        title: "Cofounder and Head of marketing",
        text: "Marketing strategy, performance, and paid media.",
      },
      {
        title: "Dedicated team",
        text: "Each client has an exclusive account lead, plus specialists in design, content, and media.",
      },
    ],
    teamNote: "More than 10 years working in marketing for ag and heavy-equipment brands.",
    closeTitle: "Shall we talk?",
    closeText: "Tell us where your company stands and we'll see together where to start.",
    closeLabel: "Book a meeting",
    closeHref: "/contacto",
  },
  services: {
    title: "Services",
    paragraphs: [
      "We install sales systems that generate demand, improve conversion, and scale measurable results. Each service is part of the same system, and they work better together.",
    ],
    items: [
      {
        id: "estrategia",
        title: "Sales strategy",
        summary:
          "We define the focus, the audience, and the sales goals, and we align marketing to that. Without a clear strategy, there is no conversion.",
        lead: "We define where the business is and how to get there.",
        points: [
          "Diagnosis of the current sales process",
          "Focus, audience, and sales goals",
          "A marketing plan aligned to sales",
        ],
        closing: "Without a clear strategy, there is no conversion.",
        icon: "/brand/icon-estrategia.png",
        image: "/brand/service-estrategia.jpg",
      },
      {
        id: "demanda",
        title: "Demand generation",
        summary: "Meta and Google campaigns, content, and social. Every action has a goal and every campaign is measured.",
        lead: "We make the right customers find you.",
        points: ["Meta and Google campaigns", "Content strategy and social calendar", "Creative and ads"],
        closing: "Every action has a goal. Every campaign is measured.",
        icon: "/brand/icon-demanda.png",
        image: "/brand/service-demanda.jpg",
      },
      {
        id: "captura",
        title: "Lead capture and follow-up",
        summary:
          "Landing pages, WhatsApp, and CRM so no inquiry is lost and every lead is followed through to the close.",
        lead: "So no inquiry gets lost along the way.",
        points: ["Landing pages and website", "WhatsApp and CRM, connected", "Follow-up process and sales-team training"],
        closing: "If the process isn't measured, it can't be improved.",
        icon: "/brand/icon-captura.png",
        image: "/brand/service-captura.jpg",
      },
      {
        id: "optimizacion",
        title: "Measurement and optimization",
        summary: "We measure what matters: cost per lead, conversion, and sales. We scale what works and adjust what doesn't.",
        lead: "Decisions with data, not by feel.",
        points: [
          "Performance dashboard",
          "Monthly reports with cost per lead, conversion, and sales",
          "Ongoing adjustments to scale what works",
        ],
        closing: "Growth isn't improvised. It is optimized.",
        icon: "/brand/icon-optimizacion.png",
        image: "/brand/service-optimizacion.jpg",
      },
    ],
    closeTitle: "Not sure where to start?",
    closeText: "We help you define it in a first meeting.",
    closeLabel: "Book a meeting",
    closeHref: "/contacto",
  },
  contactPage: {
    title: "Contact",
    intro: "Tell us where your sales process is stuck. We reply within 24 hours. The first meeting is free.",
    stepsTitle: "What happens next",
    steps: [
      "We contact you to understand your business.",
      "We diagnose your sales process.",
      "We present a proposal built for you.",
    ],
    whatsappButton: "Message us on WhatsApp",
    nameLabel: "Name",
    companyLabel: "Company",
    sectorLabel: "Line of business",
    sectors: ["Dealership", "Implement manufacturer", "Inputs", "Seeds", "Agricultural services", "Other"],
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    zoneLabel: "Province or area",
    messageLabel: "Message",
    messagePlaceholder: "Tell us what you want to improve in your sales process",
    submitLabel: "I want you to contact me",
    privacy: "We use your data only to reply to your inquiry.",
    success: "Thank you! We received your inquiry and we'll write within 24 hours.",
  },
};
