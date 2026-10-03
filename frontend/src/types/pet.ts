export type StatusPet = 'Em Dia' | 'Atenção' | 'Atrasado';

export interface Pet {
  id: string;
  usuarioId: string;
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  peso?: number;
  microchip?: string;
  fotoLink?: string;
  ativo: boolean;
  status?: StatusPet;
  createdAt?: string;
}

export interface HistoricoPet {
  id: string;
  petId: string;
  peso?: number;
  fotoLink?: string;
  dataCarga: string;
}

export interface CriarPetDTO {
  usuarioId: string;
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  peso?: number;
  microchip?: string;
  fotoLink?: string;
}

export interface AtualizarPetDTO extends Partial<CriarPetDTO> {}

export interface PetService {
  listarPorUsuario(usuarioId: string): Promise<Pet[]>;
  buscarPorId(id: string): Promise<Pet | null>;
  cadastrar(petData: CriarPetDTO): Promise<Pet>;
  atualizar(id: string, petData: AtualizarPetDTO): Promise<Pet>;
  remover(id: string): Promise<void>;
  uploadFotoPerfil(petId: string, fileBuffer: ArrayBuffer | Blob, fileExtension: string): Promise<string>;
  obterHistorico(petId: string): Promise<HistoricoPet[]>;
  registrarHistorico(petId: string, peso?: number, fotoLink?: string): Promise<HistoricoPet>;
}