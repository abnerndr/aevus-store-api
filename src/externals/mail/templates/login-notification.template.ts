export class LoginNotificationMailTemplate {
  subject: string;
  html: string;
  text: string;
  constructor(
    name: string,
    loginTimestamp: string,
    ipAddress: string,
    userAgent: string,
    changePasswordUrl: string,
  ) {
    this.subject = '🔔 Novo login na sua conta!';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alerta de Novo Login</title>
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
                    ⚠️ Alerta de Novo Login!
                 </h1>
            
                <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 16px 0;">
                    Olá, ${name},
                </p>
            
                <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 30px;">
                    Detectamos um novo login na sua conta com os seguintes detalhes:
                </p>
            
                <div style="background-color: #fffbe6; border: 1px solid #ffe88c; border-radius: 8px; padding: 20px; margin: 30px 0; font-size: 15px; color: #8a6200;">
                    <p style="margin: 5px 0;"><strong>Data:</strong> ${loginTimestamp}</p>
                    <p style="margin: 5px 0;"><strong>Endereço IP:</strong> ${ipAddress}</p>
                    <p style="margin: 5px 0;"><strong>Dispositivo/Localização:</strong> ${userAgent}</p>
                </div>
            
                <p style="font-size: 15px; color: #555; line-height: 1.6; margin-top: 30px; margin-bottom: 40px;">
                    Se foi <strong>você</strong> quem fez este acesso, nenhuma outra ação é necessária.
                </p>
            
                <div style="background-color: #fef4f4; border: 1px solid #fde7e7; border-radius: 8px; padding: 16px; margin: 40px 0;">
                    <p style="margin: 0; font-size: 14px; color: #a13a3a; font-weight: 600;">
                    ⚠️  Não reconhece este acesso?
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #a13a3a;">
                         Se você não foi o autor deste login, recomendamos que <strong>proteja sua conta imediatamente</strong>.
                    </p>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${changePasswordUrl}"
                    style="background-color: #d93025; color: white; padding: 14px 32px; text-decoration: none;
                            border-radius: 8px; font-weight: 500; font-size: 16px; display: inline-block;">
                        Alterar Senha 
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    this.text = `
    ⚠️ Alerta de Novo Login!
    
    Olá, ${name},

    Detectamos um novo login na sua conta. Abaixo estão os detalhes:

    Data: ${loginTimestamp}

    Endereço IP: ${ipAddress}

    Dispositivo: ${userAgent}

    Se foi você quem fez este acesso, nenhuma outra ação é necessária.

    Se você não foi o autor deste login, recomendamos que altere sua senha imediatamente para proteger sua conta.

    Alterar Senha: ${changePasswordUrl}
    `;
  }
}
