const ROOT_URL = process.env.NEXT_PUBLIC_URL || "https://activity-tracker.vercel.app"

export const minikitConfig = {
  accountAssociation: {
    // These will be filled after signing at https://www.base.dev/preview?tab=account
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Activity Tracker",
    subtitle: "Track your Farcaster activity",
    description:
      "Track your Farcaster social activity with beautiful analytics and insights. See followers, engagement, and personalized improvement tips.",
    screenshotUrls: [
      `${ROOT_URL}/screenshots/dashboard.png`,
      `${ROOT_URL}/screenshots/stats.png`,
      `${ROOT_URL}/screenshots/guide.png`,
    ],
    iconUrl: `${ROOT_URL}/icon-512.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#f0f0f3",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social" as const,
    tags: ["farcaster", "analytics", "social", "tracker", "activity"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Track your Farcaster journey",
    ogTitle: "Activity Tracker - Farcaster Analytics",
    ogDescription: "Track your Farcaster social activity with beautiful analytics and insights.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    noindex: false,
  },
} as const
