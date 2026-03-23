export const config = { runtime: 'edge' };

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

export default async function handler(req) {
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    let gasResponse;

    if (req.method === 'POST') {
      // POST: body를 그대로 전달
      const body = await req.text();
      gasResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        redirect: 'follow',
      });
    } else {
      // GET: query string 전달
      const url = new URL(req.url);
      const params = url.searchParams.toString();
      const target = APPS_SCRIPT_URL + (params ? '?' + params : '');
      gasResponse = await fetch(target, { redirect: 'follow' });
    }

    const text = await gasResponse.text();
    return new Response(text, { status: 200, headers: CORS_HEADERS });

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
