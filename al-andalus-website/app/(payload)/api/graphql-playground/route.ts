/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'
import { NextResponse } from 'next/server'

const playgroundEnabled =
  process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true' ||
  process.env.NODE_ENV !== 'production'

export const GET = playgroundEnabled
  ? GRAPHQL_PLAYGROUND_GET(config)
  : async () => NextResponse.json({ error: 'Not found' }, { status: 404 })
