export const config = { runtime: 'edge' };

export default function handler(req) {
  const url = new URL(req.url);
  const pathCode = url.pathname.slice(1);

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

  if (!pathCode || pathCode === 'favicon.ico') {
    return Response.redirect('https://blog.naver.com/trueasheard', 302);
  }

  const targetUrl = APPS_SCRIPT_URL + '?go=' + encodeURIComponent(pathCode);
  const ogTitle = '명불허전학원 · 학습 상담 리포트';
  const ogDesc = 'AI 기반 학습 분석 리포트를 확인하세요.';

  // SNS 크롤러는 OG 태그를 읽고, 일반 사용자는 즉시 리다이렉트
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
