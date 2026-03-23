// Vercel Serverless Function (Node.js)
// Edge 25초 제한 → Serverless 60초로 변경 (리포트 생성 타임아웃 해결)

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

export const config = {
  maxDuration: 60
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    let gasResponse;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      gasResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        redirect: 'follow',
      });
    } else {
      const url = new URL(req.url, `https://${req.headers.host}`);
      const params = url.searchParams.toString();
      const target = APPS_SCRIPT_URL + (params ? '?' + params : '');
      gasResponse = await fetch(target, { redirect: 'follow' });
    }

    const text = await gasResponse.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(text);

  } catch (err) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(500).json({ success: false, error: err.message });
  }
}
