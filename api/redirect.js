export default function handler(req, res) {
  const code = req.query.code || '';
  
  if (!code) {
    res.redirect(302, 'https://blog.naver.com/trueasheard');
    return;
  }
  
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbz0HcYFu1zEAe7NjEmf3mT7oC2o6ZL84AxzQXryAwVX5gC5i7FBljeWdaUPVNx86Ct2/exec';
  
  res.redirect(302, appsScriptUrl + '?go=' + encodeURIComponent(code));
}
