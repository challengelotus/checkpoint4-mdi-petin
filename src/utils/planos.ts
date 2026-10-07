import { Usuario } from '@/types/auth';

/** Limites do plano gratuito (os mesmos aplicados em vacinaService e medicamentoService). */
export const LIMITE_PETS_FREE = 1;
export const LIMITE_VACINAS_FREE = 5;
export const LIMITE_MEDICAMENTOS_FREE = 3;

/**
 * Link de checkout do plano Premium (ex.: Payment Link do Stripe ou Mercado Pago).
 * Configure no .env: EXPO_PUBLIC_PREMIUM_CHECKOUT_URL
 * Opcional: EXPO_PUBLIC_PREMIUM_PRECO (texto exibido, ex.: "R$ 19,90/mês")
 */
export const PREMIUM_CHECKOUT_URL =
  process.env.EXPO_PUBLIC_PREMIUM_CHECKOUT_URL ?? '';
export const PREMIUM_PRECO = process.env.EXPO_PUBLIC_PREMIUM_PRECO ?? 'R$19,90';
export const FREE_PRECO = 'R$0,00';

export function nomeDoPlano(plano?: Usuario['plano']): string {
  return plano === 'PREMIUM' ? 'Premium' : 'Gratuito';
}

/**
 * Monta a URL de checkout identificando o usuário, para que o webhook do
 * pagamento saiba qual conta ativar. (Parâmetros no padrão do Stripe Payment Links.)
 */
export function montarUrlCheckout(usuario: Usuario): string {
  if (!PREMIUM_CHECKOUT_URL) return '';

  const sep = PREMIUM_CHECKOUT_URL.includes('?') ? '&' : '?';
  return (
    `${PREMIUM_CHECKOUT_URL}${sep}client_reference_id=${encodeURIComponent(usuario.id)}` +
    `&prefilled_email=${encodeURIComponent(usuario.email)}`
  );
}
