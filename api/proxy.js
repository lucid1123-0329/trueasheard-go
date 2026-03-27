// Vercel Serverless Function (Node.js)
// Edge 25초 제한 → Serverless 60초로 변경 (리포트 생성 타임아웃 해결)

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';
const FETCH_TIMEOUT = 55000; // 55초

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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    let gasResponse;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      gasResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        redirect: 'follow',
        signal: controller.signal,
      });
    } else {
      const url = new URL(req.url, `https://${req.headers.host}`);
      const params = url.searchParams.toString();
      const target = APPS_SCRIPT_URL + (params ? '?' + params : '');
      gasResponse = await fetch(target, { redirect: 'follow', signal: controller.signal });
    }

    const text = await gasResponse.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(text);

  } catch (err) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (err.name === 'AbortError') {
      return res.status(504).json({ ok: false, error: '서버 응답 시간 초과. 잠시 후 다시 시도해주세요.' });
    }
    return res.status(502).json({ ok: false, error: '서버 연결 실패: ' + err.message });
  } finally {
    clearTimeout(timer);
  }
}
