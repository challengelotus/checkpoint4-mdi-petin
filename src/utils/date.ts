import { CardProximaAcaoDTO } from '../types/atividade';

export function formatarContadorProximaAcao(dataPrevistaStr: string, nomeAcao: string, tipo: string): CardProximaAcaoDTO {
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  
  const dataAlvo = new Date(dataPrevistaStr);
  const dataEvento = new Date(dataAlvo.getFullYear(), dataAlvo.getMonth(), dataAlvo.getDate());

  const diffMs = dataEvento.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const prefixo = tipo === 'VACINA' ? 'vacina' : tipo === 'MEDICAMENTO' ? 'medicamento' : 'consulta';

  // Menor ou igual a 30 dias -> exibe em dias
  if (diffDias <= 30) {
    return {
      numeroTempo: diffDias < 0 ? 0 : diffDias,
      unidadeTempo: diffDias === 1 ? 'dia' : 'dias',
      descricaoAcao: `até a ${prefixo} ${nomeAcao}`,
    };
  }

  // De 31 a 365 dias -> exibe em meses
  if (diffDias <= 365) {
    const meses = Math.floor(diffDias / 30);
    return {
      numeroTempo: meses,
      unidadeTempo: meses === 1 ? 'mês' : 'meses',
      descricaoAcao: `até a ${prefixo} ${nomeAcao}`,
    };
  }

  // Acima de 365 dias -> exibe em anos
  const anos = Math.floor(diffDias / 365);
  return {
    numeroTempo: anos,
    unidadeTempo: anos === 1 ? 'ano' : 'anos',
    descricaoAcao: `até a ${prefixo} ${nomeAcao}`,
  };
}

// ---------- Helpers de entrada/saída de datas (formato brasileiro) ----------

/** Aplica máscara dd/mm/aaaa enquanto o usuário digita. */
export function mascaraData(texto: string): string {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Aplica máscara hh:mm enquanto o usuário digita. */
export function mascaraHora(texto: string): string {
  const d = texto.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

/** "15/03/2026" -> "2026-03-15". Retorna null se vazio/inválido. */
export function dataBRparaISO(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const [, dd, mm, aaaa] = m;
  const d = Number(dd);
  const mes = Number(mm);
  const a = Number(aaaa);
  const dt = new Date(a, mes - 1, d);
  if (dt.getFullYear() !== a || dt.getMonth() !== mes - 1 || dt.getDate() !== d) {
    return null;
  }
  return `${aaaa}-${mm}-${dd}`;
}

/** "2026-03-15" (ou ISO completo) -> "15/03/2026". */
export function isoParaDataBR(iso?: string | null): string {
  if (!iso) return '';
  const [aaaa, mm, dd] = iso.split('T')[0].split('-');
  if (!aaaa || !mm || !dd) return '';
  return `${dd}/${mm}/${aaaa}`;
}

/** Valida "hh:mm". */
export function horaValida(texto: string): boolean {
  const m = /^(\d{2}):(\d{2})$/.exec(texto.trim());
  return !!m && Number(m[1]) < 24 && Number(m[2]) < 60;
}

/** Data local (YYYY-MM-DD) + hora local (hh:mm) -> ISO UTC para gravar no banco. */
export function combinarDataHoraISO(dataISO: string, hora: string): string {
  return new Date(`${dataISO}T${hora}:00`).toISOString();
}

/** Date -> "YYYY-MM-DD" no fuso local. */
export function dataLocalISO(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function nomeDoMes(mes: number): string {
  return MESES[mes - 1] ?? '';
}

/** Remove o prefixo técnico "LIMITE_PLANO_FREE:" das mensagens dos services. */
export function mensagemErro(error: unknown, padrao: string): string {
  const msg = error instanceof Error ? error.message : padrao;
  return msg.replace(/^LIMITE_PLANO_FREE:\s*/, '');
}

/** "Marina Souza" -> "MS" */
export function iniciais(nome?: string): string {
  const partes = (nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
