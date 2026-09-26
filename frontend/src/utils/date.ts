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