import { supabase } from './client';
import { ProntuarioService, DadosProntuario } from '../../types/prontuario';

export const prontuarioService: ProntuarioService = {
  async obterDadosProntuario(petId: string): Promise<DadosProntuario> {
    // 1. Busca dados do Pet
    const { data: pet, error: petErr } = await supabase
      .from('pets')
      .select('nome, especie, raca, peso, data_nascimento')
      .eq('id', petId)
      .single();

    if (petErr) throw new Error(`Erro ao buscar dados do pet: ${petErr.message}`);

    // 2. Busca Vacinas
    const { data: vacinas } = await supabase
      .from('vacinas')
      .select('nome, doses_vacinas(data_prevista, status)')
      .eq('pet_id', petId);

    // 3. Busca Medicamentos
    const { data: medicamentos } = await supabase
      .from('medicamentos')
      .select('nome, dosagem, frequencia')
      .eq('pet_id', petId);

    // Formata Vacinas
    const listaVacinas: DadosProntuario['vacinas'] = [];
    vacinas?.forEach((v: any) => {
      v.doses_vacinas?.forEach((d: any) => {
        listaVacinas.push({
          nome: v.nome,
          dataPrevista: d.data_prevista,
          status: d.status,
        });
      });
    });

    return {
      pet: {
        nome: pet.nome,
        especie: pet.especie,
        raca: pet.raca || 'Não informada',
        peso: pet.peso,
        dataNascimento: pet.data_nascimento,
      },
      vacinas: listaVacinas,
      medicamentos: medicamentos || [],
    };
  },

  gerarHtmlProntuario(dados: DadosProntuario): string {
    const { pet, vacinas, medicamentos } = dados;

    const linhasVacinas = vacinas.length > 0
      ? vacinas.map(v => `
          <tr>
            <td>${v.nome}</td>
            <td>${v.dataPrevista || '-'}</td>
            <td>${v.status}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="3">Nenhuma vacina registrada.</td></tr>';

    const linhasMedicamentos = medicamentos.length > 0
      ? medicamentos.map(m => `
          <tr>
            <td>${m.nome}</td>
            <td>${m.dosagem || '-'}</td>
            <td>${m.frequencia || '-'}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="3">Nenhum medicamento em uso.</td></tr>';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 30px; color: #362317; }
            .header { text-align: center; border-bottom: 2px solid #C47A47; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { color: #C47A47; margin: 0; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #C47A47; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #F7EFE5; color: #362317; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Petin - Prontuário Médico</h1>
            <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div class="section">
            <div class="section-title">Informações do Pet</div>
            <div class="info-grid">
              <p><strong>Nome:</strong> ${pet.nome}</p>
              <p><strong>Espécie:</strong> ${pet.especie}</p>
              <p><strong>Raça:</strong> ${pet.raca}</p>
              <p><strong>Peso:</strong> ${pet.peso ? `${pet.peso} kg` : 'Não informado'}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Histórico de Vacinas</div>
            <table>
              <thead>
                <tr>
                  <th>Vacina</th>
                  <th>Data Prevista</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${linhasVacinas}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Medicamentos</div>
            <table>
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Dosagem</th>
                  <th>Frequência</th>
                </tr>
              </thead>
              <tbody>
                ${linhasMedicamentos}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  },
};