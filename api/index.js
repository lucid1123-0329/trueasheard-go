export const config = { runtime: 'edge' };

export default function handler(req) {
  const url = new URL(req.url);
  const pathCode = url.pathname.slice(1); // "/A1B2C3" → "A1B2C3"

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

  // 코드가 없으면 블로그로
  if (!pathCode || pathCode === 'favicon.ico') {
    return Response.redirect('https://blog.naver.com/trueasheard', 302);
  }

  // OG 메타 설정
  const ogTitle = '명불허전학원 · 학습 상담 리포트';
  const ogDesc = 'AI 기반 학습 분석 리포트를 확인하세요.';
  const targetUrl = APPS_SCRIPT_URL + '?go=' + encodeURIComponent(pathCode);

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
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
  <meta name="description" content="${ogDesc}">
  <style>
    *{margin:0;padding:0}html,body{width:100%;height:100%;overflow:hidden}
    iframe{width:100%;height:100%;border:none}
    .ld{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:#f8fafc;z-index:10;transition:opacity .3s}
    .ld.h{opacity:0;pointer-events:none}
    .sp{width:36px;height:36px;border:3px solid #e2e8f0;border-top-color:#1a237e;border-radius:50%;animation:s .8s linear infinite}
    @keyframes s{to{transform:rotate(360deg)}}
    .ld p{font-family:sans-serif;font-size:14px;color:#64748b}
  </style>
</head>
<body>
  <div class="ld" id="ld"><div class="sp"></div><p>리포트 로딩 중...</p></div>
  <iframe id="f" allowfullscreen></iframe>
  <script>
    var f=document.getElementById('f');
    f.src='${targetUrl}';
    f.onload=function(){document.getElementById('ld').classList.add('h')};
    setTimeout(function(){document.getElementById('ld').classList.add('h')},5000);
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
