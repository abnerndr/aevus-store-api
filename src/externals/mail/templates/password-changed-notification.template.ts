export class PasswordChangedNotificationTemplate {
  subject: string;
  html: string;
  text: string;
  constructor(name: string, supportUrl: string, changeTimestamp: string) {
    this.subject = '🔐 Sua senha foi alterada!';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Senha Alterada</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
        <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07); overflow: hidden;">
        
            <div style="width: 100%; text-align: center;">
                <img src="https://ruperth-cloud.s3.us-east-1.amazonaws.com/images/banner.jpg" 
                    alt="Banner de Segurança" 
                    width="600" 
                    style="width: 100%; max-width: 600px; height: auto; max-height: 180px; display: block; border-radius: 12px 12px 0 0; object-fit: cover;">
            </div>

            <div style="padding: 0 40px 40px 40px; text-align: left;"> 
            
                <h1 style="font-size: 26px; font-weight: 600; color: #1a1a1a; text-align: center; margin: 40px 0 16px 0;">
                    Senha Alterada com Sucesso
                </h1>
            
                <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 16px 0;">
                    Olá, ${name},
                </p>
            
                <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 40px;">
                    Este é um e-mail para <strong>confirmar</strong> que a senha da sua conta foi alterada com sucesso.
                </p>
            
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 40px 0;">
                    <p style="margin: 0; font-size: 14px; color: #14532d; font-weight: 600;">
                        ✅ A sua senha foi alterada em <strong>${changeTimestamp} (horário de Brasília)</strong>.
                    </p>
                </div>
            
                <p style="font-size: 15px; color: #555; line-height: 1.6; margin-top: 40px; margin-bottom: 30px;">
                    Se foi <strong>você</strong> quem fez esta alteração, nenhuma outra ação é necessária e sua conta está segura.
                </p>
            
                <div style="background-color: #fffbe6; border: 1px solid #ffe88c; border-radius: 8px; padding: 16px; margin: 40px 0;">
                    <p style="margin: 0; font-size: 14px; color: #8a6200; font-weight: 600;">
                        ⚠️ <strong>Não foi você?</strong>
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #8a6200;">
                        Se você não solicitou esta alteração, <strong>proteja sua conta imediatamente</strong> usando o botão abaixo.
                    </p>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${supportUrl}"
                    style="background-color: #141414; color: white; padding: 14px 32px; text-decoration: none;
                            border-radius: 8px; font-weight: 500; font-size: 16px; display: inline-block;">
                        Não Reconheço esta Ação
                    </a>
                </div>
            
            </div>
        </div>
    </body>
    </html>
    `;
    this.text = `
    Olá, ${name},

    Este é um e-mail para confirmar que a senha da sua conta foi alterada!

    ✅ A sua senha foi alterada em ${changeTimestamp} (horário de Brasília).

    Se foi você quem fez esta alteração, nenhuma outra ação é necessária e sua conta está segura.

    Se você não solicitou esta alteração, proteja sua conta imediatamente entrando em contato com nosso suporte.

    Suporte: ${supportUrl}
    `;
  }
}
