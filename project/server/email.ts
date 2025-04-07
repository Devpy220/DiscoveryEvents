import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";

// Verificar se a chave de API do MailerSend está definida
if (!process.env.MAILERSEND_API_KEY) {
  console.warn("MAILERSEND_API_KEY não está definida. O envio de emails não funcionará.");
}

// Inicializar o cliente MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

// Remetente padrão para todos os emails
const defaultSender = new Sender("no-reply@discoveryevents.com", "Discovery Event's");

/**
 * Enviar email com comprovante de compra
 */
export async function sendTicketConfirmation(
  userEmail: string,
  userName: string,
  orderDetails: {
    orderId: number;
    eventName: string;
    eventDate: Date;
    ticketType: string;
    ticketPrice: number;
    quantity: number;
    totalPrice: number;
    purchaseDate: Date;
    venueLocation: string;
  },
  ticketPdfUrl?: string
) {
  try {
    // Formatar data do evento
    const eventDate = orderDetails.eventDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Formatar data da compra
    const purchaseDate = orderDetails.purchaseDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Construir o corpo do email com detalhes HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Compra de Ingresso</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #6b3fa0; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          .ticket-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .ticket-qr { text-align: center; margin: 20px 0; }
          .total-section { font-weight: bold; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #6b3fa0; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmação de Compra</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${userName}</strong>!</p>
            <p>Sua compra foi confirmada com sucesso. Abaixo estão os detalhes do seu ingresso:</p>
            
            <div class="ticket-details">
              <h2>${orderDetails.eventName}</h2>
              <p><strong>Data e Hora:</strong> ${eventDate}</p>
              <p><strong>Local:</strong> ${orderDetails.venueLocation}</p>
              <p><strong>Tipo de Ingresso:</strong> ${orderDetails.ticketType}</p>
              <p><strong>Quantidade:</strong> ${orderDetails.quantity}</p>
              <p><strong>Preço Unitário:</strong> R$ ${orderDetails.ticketPrice.toFixed(2)}</p>
              <p class="total-section">
                <strong>Valor Total:</strong> R$ ${orderDetails.totalPrice.toFixed(2)}<br>
                <strong>Data da Compra:</strong> ${purchaseDate}<br>
                <strong>Número do Pedido:</strong> #${orderDetails.orderId}
              </p>
            </div>
            
            <div class="ticket-qr">
              <p>Use o QR Code abaixo para acessar o evento:</p>
              <img src="https://chart.googleapis.com/chart?cht=qr&chl=ORDER-${orderDetails.orderId}&chs=180x180&choe=UTF-8&chld=L|2" alt="QR Code do Ingresso">
            </div>
            
            <p>
              Você pode acessar seus ingressos a qualquer momento na seção 
              <a href="https://discoveryevents.repl.co/profile">Meus Ingressos</a> 
              do seu perfil.
            </p>
            
            <p>Agradecemos pela sua compra!</p>
            <p>Equipe Discovery Event's</p>
          </div>
          <div class="footer">
            <p>
              Esta é uma mensagem automática, por favor não responda a este email.<br>
              © ${new Date().getFullYear()} Discovery Event's. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </body>
    </html>
    `;

    // Configurar parâmetros de email
    const recipients = [
      new Recipient(userEmail, userName)
    ];

    // Criar parâmetros de email
    const emailParams = new EmailParams()
      .setFrom(defaultSender)
      .setTo(recipients)
      .setSubject(`Confirmação de Ingresso - ${orderDetails.eventName}`)
      .setHtml(emailHtml)
      .setText(`Confirmação de compra para ${orderDetails.eventName}. Seu pedido #${orderDetails.orderId} foi confirmado. Data: ${eventDate}. Local: ${orderDetails.venueLocation}. Total: R$ ${orderDetails.totalPrice.toFixed(2)}.`);

    // Adicionar anexo do PDF se disponível
    if (ticketPdfUrl) {
      // emailParams.addAttachment(ticketPdfUrl, "ingresso.pdf"); // Para implementação futura
    }

    // Enviar email
    await mailerSend.email.send(emailParams);
    
    console.log(`Email de confirmação enviado para ${userEmail} - Pedido #${orderDetails.orderId}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de confirmação:", error);
    return false;
  }
}

/**
 * Enviar email de boas-vindas para novos usuários
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const recipients = [
      new Recipient(userEmail, userName)
    ];

    const emailParams = new EmailParams()
      .setFrom(defaultSender)
      .setTo(recipients)
      .setSubject("Bem-vindo ao Discovery Event's")
      .setHtml(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Bem-vindo ao Discovery Event's</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #6b3fa0; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
              .button { display: inline-block; padding: 10px 20px; background-color: #6b3fa0; color: white; text-decoration: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bem-vindo ao Discovery Event's!</h1>
              </div>
              <div class="content">
                <p>Olá, <strong>${userName}</strong>!</p>
                <p>Estamos felizes em ter você conosco. Com o Discovery Event's, você pode:</p>
                
                <ul>
                  <li>Encontrar os melhores eventos próximos a você</li>
                  <li>Comprar ingressos com segurança e facilidade</li>
                  <li>Vender seus próprios ingressos na plataforma</li>
                  <li>Receber atualizações sobre seus eventos favoritos</li>
                </ul>
                
                <p style="text-align: center; margin: 30px 0;">
                  <a href="https://discoveryevents.repl.co/events" class="button">Explorar Eventos</a>
                </p>
                
                <p>Estamos sempre disponíveis para ajudar com qualquer dúvida que você possa ter.</p>
                <p>Divirta-se!</p>
                <p>Equipe Discovery Event's</p>
              </div>
              <div class="footer">
                <p>
                  Esta é uma mensagem automática, por favor não responda a este email.<br>
                  © ${new Date().getFullYear()} Discovery Event's. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </body>
        </html>
      `)
      .setText(`Bem-vindo ao Discovery Event's, ${userName}! Estamos felizes em ter você conosco. Explore eventos, compre e venda ingressos com facilidade em nossa plataforma. Visite https://discoveryevents.repl.co para começar.`);

    await mailerSend.email.send(emailParams);
    
    console.log(`Email de boas-vindas enviado para ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de boas-vindas:", error);
    return false;
  }
}