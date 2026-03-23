export const config = { runtime: 'edge' };

export default function handler(req) {
  const url = new URL(req.url);
  const pathCode = url.pathname.slice(1);
  const name = url.searchParams.get('n') || '';
  const type = url.searchParams.get('t') || '';

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';

  if (!pathCode || pathCode === 'favicon.ico') {
    return new Response('', { status: 204 });
  }

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
  <meta property="og:image" content="${url.origin}/og-mbhj-v2.png">
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
