// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || 'kenya';

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_KEY}`
  );

  const data = await response.json();

  return NextResponse.json(data);
}

