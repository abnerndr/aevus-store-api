export class WelcomeMailTemplate {
  subject: string;
  html: string;
  text: string;
  constructor(name: string, dashboardUrl: string) {
    this.subject = '🚀 Bem vindo(a) nossa plataforma!';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo(a)!</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
    
        <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07); overflow: hidden;">
        
            <div style="width: 100%; text-align: center;">
                <img src="https://ruperth-cloud.s3.us-east-1.amazonaws.com/images/banner.jpg" 
                    alt="Banner de Boas-Vindas" 
                    width="600" 
                    style="width: 100%; max-width: 600px; height: auto; max-height: 180px; display: block; border-radius: 12px 12px 0 0; object-fit: cover;">
            </div>

            <div style="padding: 0 40px 40px 40px;"> 
            
                <h1 style="font-size: 26px; font-weight: 600; color: #1a1a1a; text-align: center; margin: 40px 0 16px 0;">
                    Bem-vindo(a), ${name}!
                </h1>
            
                <p style="font-size: 16px; color: #555555; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
                    Obrigado por se juntar à nossa plataforma! Estamos felizes em ter você como parte da nossa comunidade.
                </p>
            
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 40px 0;">
                    <p style="margin: 0; font-size: 14px; color: #14532d; font-weight: 600;">
                        ✅ Sua conta foi criada e verificada com sucesso!
                    </p>
                </div>
            
                <p style="font-size: 16px; color: #444; margin-top: 40px; margin-bottom: 24px;">
                    Aqui estão algumas coisas que você pode fazer a seguir:
                 </p>

                <ul style="font-size: 15px; color: #555; list-style-type: none; padding-left: 0; margin-bottom: 40px;">
                    <li style="margin-bottom: 12px;"><strong style="color: #1a1a1a;">→</strong> Complete seu perfil</li>
                    <li style="margin-bottom: 12px;"><strong style="color: #1a1a1a;">→</strong> Explore nossos recursos</li>
                    <li style="margin-bottom: 12px;"><strong style="color: #1a1a1a;">→</strong> Conecte-se com outros usuários</li>
                    <li style="margin-bottom: 12px;"><strong style="color: #1a1a1a;">→</strong> Comece a usar nossos serviços</li>
                </ul>

                <div style="text-align: center; margin-bottom: 40px;">
                    <a href="${dashboardUrl}"
                    style="background-color: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none;
                            border-radius: 8px; font-weight: 500; font-size: 16px; display: inline-block;">
                        Ir para o Painel
                    </a>
                </div>

                <p style="font-size: 13px; color: #999; margin-top: 40px; text-align: center;">
                    Se tiver alguma dúvida, sinta-se à vontade para contatar nossa equipe de suporte.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    this.text = `
    Bem-vindo(a), ${name}!

    Obrigado por se juntar à nossa plataforma! Estamos felizes em ter você como parte da nossa comunidade.

    ✅ Sua conta foi criada e verificada com sucesso!

    Aqui estão algumas coisas que você pode fazer a seguir:

    Complete seu perfil

    Explore nossos recursos

    Comece a usar nossos serviços

    Ir para o Painel

    Se tiver alguma dúvida, sinta-se à vontade para contatar nossa equipe de suporte.
    `;
  }
}
