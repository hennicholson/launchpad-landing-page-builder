import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Use nodejs runtime for reliable database access
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const domain = url.searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
  }

  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ error: 'Database not configured', debug: 'No DATABASE_URL' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Try with and without www prefix
    const domainWithoutWww = domain.replace(/^www\./, '');

    const rows = await sql`
      SELECT slug FROM projects
      WHERE (custom_domain = ${domain} OR custom_domain = ${domainWithoutWww})
      AND custom_domain_status = 'active'
      AND is_published = 'true'
      LIMIT 1
    `;

    if (rows.length > 0) {
      return NextResponse.json({ slug: rows[0].slug });
    }

    return NextResponse.json({ slug: null, domain, domainWithoutWww });
  } catch (error) {
    console.error('Domain lookup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Lookup failed', details: errorMessage }, { status: 500 });
  }
}
