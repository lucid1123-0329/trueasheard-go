module.exports = function handler(req, res) {
  const code = req.query.code || '';
  
  if (!code) {
    res.redirect(302, 'https://blog.naver.com/trueasheard');
    return;
  }
  
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';
  const targetUrl = appsScriptUrl + '?go=' + encodeURIComponent(code);
  
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta property="og:title" content="명불허전학원 · 학습 상담 리포트">
<meta property="og:description" content="AI 기반 학습 분석 리포트를 확인하세요.">
<meta property="og:image" content="https://go.trueasheard.com/og-image.png">
<meta property="og:type" content="website">
<meta property="og:url" content="https://go.trueasheard.com/${code}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="명불허전학원 · 학습 상담 리포트">
<meta name="twitter:description" content="AI 기반 학습 분석 리포트를 확인하세요.">
<meta http-equiv="refresh" content="0;url=${targetUrl}">
<title>명불허전학원 리포트</title>
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px;">
<p>리포트 페이지로 이동 중...</p>
<p><a href="${targetUrl}">자동 이동되지 않으면 클릭</a></p>
<script>window.location.href="${targetUrl}";</script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};
