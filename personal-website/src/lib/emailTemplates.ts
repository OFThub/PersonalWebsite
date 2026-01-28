export function contactFormTemplate(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #06b6d4; margin-bottom: 5px; }
    .value { background: white; padding: 15px; border-left: 4px solid #06b6d4; }
    .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">📧 Yeni İletişim Mesajı</h1>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="label">Gönderen:</div>
        <div class="value">${data.name}</div>
      </div>
      
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      
      ${data.subject ? `
      <div class="field">
        <div class="label">Konu:</div>
        <div class="value">${data.subject}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="label">Mesaj:</div>
        <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Bu mesaj portfolio sitenizin iletişim formundan gönderilmiştir.</p>
      <p>© ${new Date().getFullYear()} Portfolio. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function autoReplyTemplate(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✨ Teşekkürler!</h1>
    </div>
    
    <div class="content">
      <p>Merhaba ${name},</p>
      
      <p>Mesajınız için teşekkür ederim! Mesajınızı aldım ve en kısa sürede size dönüş yapacağım.</p>
      
      <p>Genellikle 24-48 saat içinde yanıt veriyorum. Acil bir durumda benimle başka kanallardan da iletişime geçebilirsiniz:</p>
      
      <ul>
        <li>📧 Email: your-email@example.com</li>
        <li>💼 LinkedIn: linkedin.com/in/yourprofile</li>
        <li>🐙 GitHub: github.com/yourusername</li>
      </ul>
      
      <p>İyi günler dilerim!</p>
      
      <p style="margin-top: 30px;">
        <strong>Your Name</strong><br>
        Full Stack Developer
      </p>
    </div>
    
    <div class="footer">
      <p>Bu otomatik bir yanıttır. Lütfen bu mesaja yanıt vermeyiniz.</p>
      <p>© ${new Date().getFullYear()} Portfolio. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function newsletterTemplate(data: {
  title: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
    .cta { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">${data.title}</h1>
    </div>
    
    <div class="content">
      ${data.content}
      
      ${data.ctaText && data.ctaLink ? `
      <div class="cta">
        <a href="${data.ctaLink}" class="button">${data.ctaText}</a>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>Bu email'i almak istemiyorsanız <a href="#">buradan</a> abonelikten çıkabilirsiniz.</p>
      <p>© ${new Date().getFullYear()} Portfolio. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
  `;
}