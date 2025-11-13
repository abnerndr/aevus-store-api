export class TwoFactorCodeMailTemplate {
  subject: string;
  html: string;
  text: string;
  constructor(code: string) {
    this.subject = '🛡️ Seu código de autenticação de dois fatores';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Duas Fatores</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
    
        <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07); overflow: hidden;">
        
            <div style="width: 100%; text-align: center;">
                <img src="https://ruperth-cloud.s3.us-east-1.amazonaws.com/images/banner.jpg" 
                    alt="Banner de Segurança" 
                    width="600" 
                    style="width: 100%; max-width: 600px; height: auto; max-height: 180px; display: block; border-radius: 12px 12px 0 0; object-fit: cover;">
            </div>

            <div style="padding: 0 40px 40px 40px; text-align: center;"> 
            
                <h1 style="font-size: 26px; font-weight: 600; color: #1a1a1a; margin: 40px 0 30px 0;">
                    🔐 Código de Segurança
                </h1>
            
                 <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-bottom: 20px;">
                    Seu código de autenticação de dois fatores é:
                </p>
            
                <div style="text-align: center; margin: 30px 0; background-color: #f9f9f9; padding: 25px 20px; border-radius: 12px; border: 2px solid #eeeeee;">
                    <h2 style="font-size: 38px; letter-spacing: 12px; margin: 0; color: #1a1a1a; font-family: 'Courier New', monospace; font-weight: bold;">
                        ${code}
                    </h2>
                </div>

                <div style="background-color: #fffbe6; border: 1px solid #ffe88c; border-radius: 8px; padding: 16px; margin: 30px 0 40px 0;">
                    <p style="margin: 0; font-size: 14px; color: #8a6200; font-weight: 600;">
                        ⚠️ <strong>Atenção:</strong> Este código irá expirar em <strong>5 minutos</strong>.
                    </p>
                </div>

                <p style="font-size: 15px; color: #666; margin-bottom: 40px;">
                    Insira este código na tela do seu aplicativo para concluir o processo de login.
                </p>

                <p style="font-size: 13px; color: #999; margin-top: 40px;">
                    Se você não solicitou este código, pode ignorar este e-mail com segurança.
                </p> 
            </div>
        </div>
    </body>
    </html>
    `;
    this.text = `
    🔐 Código de Segurança

    Atenção: Este código irá expirar em 5 minuto

    Insira este código na tela do seu aplicativo para concluir o processo de login.

    Se você não solicitou este código, pode ignorar este e-mail com segurança.
    `;
  }
}
