import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      $schema: 'https://glama.ai/mcp/schemas/connector.json',
      claim: 'glama_claim_wbGrlkXVi5ckXCWgB3e1dxb0QmHLwvJ5',
    },
    {
      headers: {
        'cache-control': 'public, max-age=3600',
        'access-control-allow-origin': '*',
      },
    }
  )
}
