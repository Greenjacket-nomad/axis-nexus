// Axis Mundi Application Constants

export const APP_CONFIG = {
  name: "Axis Mundi",
  description: "Technology & Innovation Insights",
  url: "http://localhost:3000",
  version: "1.0.0",
} as const;

export const N8N_CONFIG = {
  baseUrl: "http://mkholm-n8n.duckdns.org:5679",
  endpoints: {
    contact: "/webhook/Form",
    subscribe: "/webhook/subscribe", 
    chat: "/webhook/chat",
  },
} as const;

export const LAYOUT = {
  maxWidth: "1200px",
  section: {
    paddingTop: "120px",
    paddingBottom: "50px",
    paddingTopMobile: "60px",
    paddingBottomMobile: "30px",
  },
  grid: {
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
    gap: "24px",
  },
  card: {
    padding: "24px",
    borderRadius: "0px", // Sharp edges
    shadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  },
} as const;

export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { name: "GitHub", href: "#", external: true },
  { name: "LinkedIn", href: "#", external: true },
  { name: "Twitter", href: "#", external: true },
] as const;