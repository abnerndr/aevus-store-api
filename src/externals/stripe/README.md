# Módulo Stripe

Integração com a API do Stripe para processamento de pagamentos e assinaturas.

## Funcionalidades

- ✅ Criação e gerenciamento de clientes
- ✅ Criação de sessões de checkout
- ✅ Gerenciamento de assinaturas
- ✅ Portal de cobrança do cliente
- ✅ Webhooks para eventos do Stripe

## Webhooks

O endpoint de webhook está disponível em:
```
POST /webhooks/stripe
```

### Eventos suportados

- `checkout.session.completed` - Sessão de checkout concluída
- `customer.subscription.created` - Assinatura criada
- `customer.subscription.updated` - Assinatura atualizada
- `customer.subscription.deleted` - Assinatura cancelada
- `invoice.payment_succeeded` - Pagamento bem-sucedido
- `invoice.payment_failed` - Falha no pagamento

## Configuração

1. Configure as variáveis de ambiente no `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2024-12-18.acacia
```

2. Configure o webhook no dashboard do Stripe apontando para:
```
https://seu-dominio.com/webhooks/stripe
```

3. Certifique-se de selecionar os eventos mencionados acima no webhook.

## Uso

```typescript
import { StripeService } from './stripe.service';

constructor(private stripeService: StripeService) {}

// Criar cliente
const customer = await this.stripeService.createCustomer('user@example.com', 'Nome');

// Criar sessão de checkout
const session = await this.stripeService.createCheckoutSession({
  mode: 'subscription',
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  success_url: 'https://...',
  cancel_url: 'https://...',
});
```
