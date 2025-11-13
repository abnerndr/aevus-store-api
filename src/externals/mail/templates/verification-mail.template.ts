export class VerificationMailTemplate {
  subject: string;
  html: string;
  text?: string;
  constructor(verificationUrl: string) {
    this.subject = '✉️ Verifique seu endereço de e-mail';
    this.html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificação de E-mail</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background: #fff; border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); overflow: hidden;">

        <div style="width: 100%; text-align: center;">
            <img src="https://ruperth-cloud.s3.us-east-1.amazonaws.com/images/banner.jpg" 
                 alt="Banner do Ruperth" 
                 width="600" 
                 style="width: 100%; max-width: 600px; height: auto; max-height: 160px; display: block; border-radius: 12px 12px 0 0; object-fit: cover;">
        </div>
        <div style="padding: 40px; text-align: center;">
            
            <p style="font-size: 16px; color: #444; margin-bottom: 30px; margin-top: 10px;">
                Falta pouco para ativar sua conta. Por favor, clique no botão abaixo para confirmar seu endereço de e-mail.
            </p>

            <a href="${verificationUrl}"
               style="background: #141414; color: white; padding: 10px 28px; text-decoration: none;
                      border-radius: 11px; font-weight: bold; font-size: 16px; display: inline-block;
                      margin-bottom: 35px; margin-top: 20px;">
                Verificar e-mail
            </a>
            
            <p style="font-size: 13px; color: #999; margin-bottom: 35px; margin-top: 25px;">
                Este link expira em <strong>24 horas</strong> por motivos de segurança.
            </p>

            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 35px 0; margin-top: 50px;">

            <p style="font-size: 13px; color: #666; line-height: 1.5; margin: 0 0 15px 0;">
                Se o botão não funcionar, copie e cole este link no seu navegador:
            </p>

            <a href="${verificationUrl}"
               style="color: #007bff; word-break: break-all; font-size: 15px; display: block;">
                ${verificationUrl}
            </a>
        </div>
    </div>
    </body>
    </html>
        `;
    this.text = `
    Verificação de e-mail

    Obrigado por se inscrever! Verifique seu endereço de e-mail para concluir o cadastro.

    ${verificationUrl}

    Este link irá expirar em 24 horas por motivos de segurança.
    `;
  }
}
