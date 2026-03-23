export const config = { runtime: 'edge' };

export default function handler(req) {
  const url = new URL(req.url);
  const pathCode = url.pathname.slice(1);

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

  // ─── 루트 경로: 상담 관리 포털 ───────────────────────────
  if (!pathCode || pathCode === 'favicon.ico') {
    const portalUrl = APPS_SCRIPT_URL + '?mode=portal';
    const portalHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>명불허전학원 — 상담 관리 포털</title>
  <meta property="og:title" content="명불허전학원 상담 관리 포털">
  <meta property="og:description" content="통합 상담 관리 시스템 — 2주 학생 상담, 학부모 리포트, 대기열 관리">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url.origin}">
  <meta property="og:image" content="${url.origin}/og-image.png">
  <meta property="og:site_name" content="명불허전학원">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0f172a; }
    iframe {
      width: 100%; height: 100%; border: none;
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    }
    .loader {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 16px;
      background: #0f172a; color: #e2e8f0;
      font-family: -apple-system, 'Noto Sans KR', sans-serif;
      z-index: 10;
      transition: opacity .4s;
    }
    .loader.hide { opacity: 0; pointer-events: none; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,.15);
      border-top-color: #60a5fa;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loader p { font-size: 14px; opacity: .7; }
  </style>
</head>
<body>
  <div class="loader" id="loader">
    <div class="spinner"></div>
    <p>상담 관리 포털 로딩 중...</p>
  </div>
  <iframe src="${portalUrl}" id="portal" onload="document.getElementById('loader').classList.add('hide')"></iframe>
</body>
</html>`;

    return new Response(portalHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // ─── 단축 URL: 기존 로직 그대로 ─────────────────────────
  const name = url.searchParams.get('n') || '';
  const type = url.searchParams.get('t') || '';
  const targetUrl = APPS_SCRIPT_URL + '?go=' + encodeURIComponent(pathCode);
  
  let ogTitle = '명불허전학원 · 학습 상담 리포트';
  let ogDesc = 'AI 기반 학습 분석 리포트를 확인하세요.';

  if (name && type === 'bw') {
    ogTitle = name + ' 학생 · 2주 학습 상담 리포트';
    ogDesc = name + ' 학생의 2주간 학습 성과와 상담 결과입니다.';
  } else if (name && type === 'pr') {
    ogTitle = name + ' 학생 · 학부모 상담 리포트';
    ogDesc = name + ' 학생의 누적 학습 분석 리포트입니다.';
  } else if (name) {
    ogTitle = name + ' 학생 · 명불허전학원 리포트';
    ogDesc = name + ' 학생의 학습 분석 리포트를 확인하세요.';
  }

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>${ogTitle}</title>
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url.origin}/${pathCode}">
  <meta property="og:image" content="${url.origin}/og-image.png">
  <meta property="og:site_name" content="명불허전학원">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
</head>
<body>
  <script>window.location.href="${targetUrl}";</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
