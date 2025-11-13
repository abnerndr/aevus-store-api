export class PasswordResetMailTemplate {
  subject: string;
  html: string;
  text: string;
  constructor(resetUrl: string) {
    this.subject = '🔐 Restaure seu acesso';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
        <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07); overflow: hidden;">
        
            <div style="width: 100%; text-align: center;">
                <img src="https://ruperth-cloud.s3.us-east-1.amazonaws.com/images/banner.jpg" 
                    alt="Banner de Marca" 
                    width="600" 
                    style="width: 100%; max-width: 600px; height: auto; max-height: 180px; display: block; border-radius: 12px 12px 0 0; object-fit: cover;">
            </div>

            <div style="padding: 0 40px 40px 40px; text-align: center;"> 
            
                <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 40px 0; margin-top: 35px;">
                    Você solicitou a redefinição de senha para sua conta. Clique no botão abaixo para definir uma nova senha.
                </p>

                <a href="${resetUrl}"
                style="background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px; display: inline-block; margin-bottom: 20px;">
                    Redefinir Senha
                </a>

                <div style="background-color: #fffbeb; border: 1px solid #ffcc00; border-radius: 8px; padding: 16px; margin: 40px 0;">
                    <p style="margin: 0; font-size: 13px; color: #856404; line-height: 1.5; text-align: left;">
                        <strong style="color: #856404;">⚠️ Atenção:</strong> Este link de redefinição expira em <strong>1 hora</strong> por questões de segurança.
                    </p>
                </div>
                <p style="font-size: 14px; color: #888888; line-height: 1.5; margin: 40px 0 16px 0;">
                    Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                </p>

                <a href="${resetUrl}"
                style="color: #444444; word-break: break-all; font-size: 15px; display: block; text-decoration: underline; margin-top: 30px ;">
                    ${resetUrl}
                </a>

                <p style="font-size: 13px; color: #999999; margin-top: 40px; margin-bottom: 0;">
                    Se você <strong>NÃO</strong> solicitou esta redefinição, por favor, ignore este e-mail.
                </p>
            </div>
        </div>
    </body>
    </html>
        `;
    this.text = `
    Redefinição de Senha

    Se o botão não funcionar, copie e cole este link no seu navegador:

    ${resetUrl}

    ⚠️ Atenção! Por segurança, este link de redefinição expira em 1 hora.

    Se você não solicitou este link, pode ignorar este e-mail com segurança.
    `;
  }
}
