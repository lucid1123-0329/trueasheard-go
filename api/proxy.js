// Node.js Serverless Function (60s timeout on Hobby plan)
// Edge Runtime 25s 제한 해결

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  try {
    let gasResponse;

    if (req.method === 'POST') {
      // body 읽기
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString();

      gasResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        redirect: 'follow',
      });
    } else {
      // GET: query string 전달
      const url = new URL(req.url, `http://${req.headers.host}`);
      const params = url.searchParams.toString();
      const target = APPS_SCRIPT_URL + (params ? '?' + params : '');
      gasResponse = await fetch(target, { redirect: 'follow' });
    }

    const text = await gasResponse.text();
    
    res.writeHead(200, {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
    });
    res.end(text);

  } catch (err) {
    res.writeHead(500, {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
    });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
}

export const config = {
  maxDuration: 60, // 60초 타임아웃
};
