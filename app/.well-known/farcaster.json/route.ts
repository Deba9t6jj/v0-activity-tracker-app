import { minikitConfig } from "@/lib/minikit-config"

function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value)),
  )
}

export async function GET() {
  return Response.json({
    accountAssociation: minikitConfig.accountAssociation,
    miniapp: withValidProperties(minikitConfig.miniapp),
  })
}
