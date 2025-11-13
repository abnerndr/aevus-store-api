export class MagicLinkMailTemplate {
  subject: string;
  html: string;
  text: string;
  constructor(magicLinkUrl: string) {
    this.subject = '🪄 MagicLink - Realize seu login de forma rápida';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Link Mágico de Login</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
    
    <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07); overflow: hidden;">
        
        <div style="width: 100%; text-align: center;">
            <img src="https://ruperth-cloud.s3.us-east-1.amazonaws.com/images/banner.jpg" 
                 alt="Banner do Ruperth" 
                 width="600" 
                 style="width: 100%; max-width: 600px; height: auto; max-height: 160px; display: block; border-radius: 12px 12px 0 0; object-fit: cover;">
        </div>
        
        <div style="padding: 0 40px 40px 40px;"> 
            
            <p style="font-size: 16px; color: #555555; line-height: 1.6; text-align: center; margin: 40px 0 40px 0;">
                Clique no botão abaixo para acessar sua conta de forma segura e instantânea. Não é necessária senha!
            </p>
            
            <div style="text-align: center; margin-bottom: 40px;">
                <a href="${magicLinkUrl}"
                   style="background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px; display: inline-block;">
                    Acessar Minha Conta
                </a>
            </div>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 8px; padding: 16px; margin: 40px 0;">
                <p style="margin: 0; font-size: 13px; color: #777777; line-height: 1.5; text-align: left;">
                    <strong style="color: #333333;">⚠️ Lembrete de Segurança:</strong> Este link é de uso único e expira em <strong>15 minutos</strong>. Não o compartilhe com ninguém.
                </p>
            </div>

            <p style="font-size: 14px; color: #888888; line-height: 1.5; text-align: center; margin: 0 0 30px 0; ">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
            </p>
            
            <a href="${magicLinkUrl}"
               style="color: #444444; word-break: break-all; font-size: 15px; text-align: center; display: block; text-decoration: underline;  padding 10px;">
                ${magicLinkUrl}
            </a>
            
        <div style="text-align: center; padding: 25px; max-width: 600px; margin: 0 auto;">
            <p style="font-size: 13px; color: #999999;">
                Se você não solicitou este acesso, pode ignorar este e-mail com segurança.
            </p>
        </div>
        </div>
    </div>
    </body>
    </html>
        `;
    this.text = `
    Magic Link Login

    Se o botão não funcionar, copie e cole este link no seu navegador:

    ${magicLinkUrl}

    ⚠️ Atenção: Por segurança, este link mágico só é válido por 15 minutos e só pode ser usado uma vez.

    Se você não solicitou esta redefinição, pode ignorar este e-mail com segurança. Sua senha não será alterada.
    `;
  }
}
