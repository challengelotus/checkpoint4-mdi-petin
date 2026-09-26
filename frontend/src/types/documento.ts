export interface Documento {
  id: string;
  petId: string;
  nome: string;
  fotoLink: string;
  data: string;
}

export interface CriarDocumentoDTO {
  petId: string;
  nome: string;
  fotoLink: string;
  data?: string;
}

export interface AtualizarDocumentoDTO {
  nome?: string;
  fotoLink?: string;
  data?: string;
}

export interface DocumentoService {
  listarPorPet(petId: string): Promise<Documento[]>;
  buscarPorId(id: string): Promise<Documento | null>;
  cadastrar(dados: CriarDocumentoDTO): Promise<Documento>;
  atualizar(id: string, dados: AtualizarDocumentoDTO): Promise<Documento>;
  remover(id: string): Promise<void>;
  uploadAnexo(
    petId: string, 
    fileBuffer: ArrayBuffer | Blob, 
    fileExtension: string
  ): Promise<string>;
}