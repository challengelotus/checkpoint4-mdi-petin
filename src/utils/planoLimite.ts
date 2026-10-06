import { router } from 'expo-router';

/**
 * Sinaliza que uma ação foi barrada pelo limite do plano gratuito.
 * O service já redirecionou o usuário para a tela de assinatura; as telas
 * devem apenas interromper o fluxo (sem alert) quando receberem este erro.
 */
export class LimitePlanoError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'LimitePlanoError';
    // Mantém o instanceof funcionando quando Error é transpilado
    Object.setPrototypeOf(this, LimitePlanoError.prototype);
  }
}

export function ehLimitePlano(error: unknown): boolean {
  return (
    error instanceof LimitePlanoError ||
    (error instanceof Error && error.name === 'LimitePlanoError')
  );
}

/** Leva o usuário à tela de assinatura explicando o motivo e devolve o erro para ser lançado. */
export function redirecionarParaAssinatura(motivo: string): LimitePlanoError {
  router.push({
    pathname: '/assinatura',
    params: { motivo },
  });

  return new LimitePlanoError(motivo);
}
