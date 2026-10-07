import { supabase } from './client';
import { redirecionarParaAssinatura } from '../../utils/planoLimite';
import {
  Medicamento,
  DoseMedicamento,
  MedicamentoService,
  CriarMedicamentoDTO,
  AtualizarMedicamentoDTO,
  StatusDoseMedicamento,
} from '../../types/medicamento';

export const medicamentoService: MedicamentoService = {
  async listarPorPet(petId: string): Promise<Medicamento[]> {
    const { data: medicamentos, error: medError } = await supabase
      .from('medicamentos')
      .select('*, doses_medicamentos(*)')
      .eq('pet_id', petId)
      .order('id', { ascending: true });

    if (medError) throw new Error(`Erro ao listar medicamentos: ${medError.message}`);

    const agora = new Date();

    return (medicamentos ?? []).map((med) => ({
      id: med.id,
      petId: med.pet_id,
      nome: med.nome,
      dosagem: med.dosagem,
      observacoes: med.observacoes,
      doses: (med.doses_medicamentos ?? []).map((d: any) => {
        let statusCalculado: StatusDoseMedicamento = d.status;
        if (
          d.status === 'PENDENTE' &&
          new Date(d.data_prevista) < agora
        ) {
          statusCalculado = 'ATRASADO';
        }

        return {
          id: d.id,
          medId: d.med_id,
          numeroDose: d.numero_dose,
          dataPrevista: d.data_prevista,
          dataAplicacao: d.data_aplicacao,
          status: statusCalculado,
        };
      }),
    }));
  },

  async buscarPorId(id: string): Promise<Medicamento | null> {
    const { data: med, error } = await supabase
      .from('medicamentos')
      .select('*, doses_medicamentos(*)')
      .eq('id', id)
      .single();

    if (error || !med) return null;

    const agora = new Date();

    return {
      id: med.id,
      petId: med.pet_id,
      nome: med.nome,
      dosagem: med.dosagem,
      observacoes: med.observacoes,
      doses: (med.doses_medicamentos ?? []).map((d: any) => {
        let statusCalculado: StatusDoseMedicamento = d.status;
        if (
          d.status === 'PENDENTE' &&
          new Date(d.data_prevista) < agora
        ) {
          statusCalculado = 'ATRASADO';
        }

        return {
          id: d.id,
          medId: d.med_id,
          numeroDose: d.numero_dose,
          dataPrevista: d.data_prevista,
          dataAplicacao: d.data_aplicacao,
          status: statusCalculado,
        };
      }),
    };
  },

  async cadastrar(dto: CriarMedicamentoDTO): Promise<Medicamento> {
    // 1. Verificar plano do dono do pet
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('usuario_id')
      .eq('id', dto.petId)
      .single();

    if (petError || !pet) throw new Error('Pet não encontrado.');

    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('plano')
      .eq('id', pet.usuario_id)
      .single();

    if (userError || !usuario) throw new Error('Usuário proprietário do pet não encontrado.');

    // Trava do Plano FREE (Exemplo: Máximo de 3 medicamentos ativos por pet)
    if (usuario.plano === 'FREE') {
      const { count } = await supabase
        .from('medicamentos')
        .select('id', { count: 'exact', head: true })
        .eq('pet_id', dto.petId);

      if ((count ?? 0) >= 3) {
        throw redirecionarParaAssinatura(
          'O plano Gratuito permite no máximo 3 medicamentos por pet. Assine o Premium para medicamentos ilimitados.'
        );
      }
    }

    // 2. Inserir Medicamento
    const { data: medicamento, error: medError } = await supabase
      .from('medicamentos')
      .insert({
        pet_id: dto.petId,
        nome: dto.nome,
        dosagem: dto.dosagem,
        observacoes: dto.observacoes,
      })
      .select()
      .single();

    if (medError) throw new Error(`Erro ao cadastrar medicamento: ${medError.message}`);

    // 3. Inserir Doses vinculadas
    let dosesCriadas: DoseMedicamento[] = [];
    if (dto.doses && dto.doses.length > 0) {
      const payloadDoses = dto.doses.map((dose) => ({
        med_id: medicamento.id,
        numero_dose: dose.numeroDose,
        data_prevista: dose.dataPrevista,
        status: 'PENDENTE',
      }));

      const { data: dosesData, error: dosesError } = await supabase
        .from('doses_medicamentos')
        .insert(payloadDoses)
        .select();

      if (dosesError) throw new Error(`Erro ao cadastrar doses: ${dosesError.message}`);

      dosesCriadas = (dosesData ?? []).map((d) => ({
        id: d.id,
        medId: d.med_id,
        numeroDose: d.numero_dose,
        dataPrevista: d.data_prevista,
        dataAplicacao: d.data_aplicacao,
        status: d.status,
      }));
    }

    return {
      id: medicamento.id,
      petId: medicamento.pet_id,
      nome: medicamento.nome,
      dosagem: medicamento.dosagem,
      observacoes: medicamento.observacoes,
      doses: dosesCriadas,
    };
  },

  async atualizar(id: string, dto: AtualizarMedicamentoDTO): Promise<Medicamento> {
    const payload: Record<string, unknown> = {};
    if (dto.nome !== undefined) payload.nome = dto.nome;
    if (dto.dosagem !== undefined) payload.dosagem = dto.dosagem;
    if (dto.observacoes !== undefined) payload.observacoes = dto.observacoes;

    const { data, error } = await supabase
      .from('medicamentos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar medicamento: ${error.message}`);

    const buscou = await this.buscarPorId(id);
    if (!buscou) throw new Error('Erro ao carregar medicamento atualizado.');

    return buscou;
  },

  async remover(id: string): Promise<void> {
    const { error } = await supabase.from('medicamentos').delete().eq('id', id);
    if (error) throw new Error(`Erro ao remover medicamento: ${error.message}`);
  },

  async atualizarStatusDose(
    doseId: string,
    status: StatusDoseMedicamento,
    dataAplicacao?: string
  ): Promise<DoseMedicamento> {
    const payload: Record<string, unknown> = { status };

    if (status === 'CONCLUIDO') {
      payload.data_aplicacao = dataAplicacao || new Date().toISOString();
    } else {
      payload.data_aplicacao = null;
    }

    const { data, error } = await supabase
      .from('doses_medicamentos')
      .update(payload)
      .eq('id', doseId)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar status da dose: ${error.message}`);

    return {
      id: data.id,
      medId: data.med_id,
      numeroDose: data.numero_dose,
      dataPrevista: data.data_prevista,
      dataAplicacao: data.data_aplicacao,
      status: data.status,
    };
  },
};