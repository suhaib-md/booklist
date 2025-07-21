import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&key=${API_KEY}&maxResults=10`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Google Books API:', error);
    return NextResponse.json({ error: 'Failed to fetch from Google Books API' }, { status: 500 });
  }
}
