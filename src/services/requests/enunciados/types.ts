export enum GrupoEnunciado {
  PALETE = 'PALETE',
  CAIXA_E_FARDO = 'CAIXA_E_FARDO',
}

export interface Enunciado {
  id: string;
  descricao: string;
  posicao: number;
  ativo: boolean;
  grupo: GrupoEnunciado;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface EnunciadoPost {
  descricao: string;
  posicao: number;
}

export interface EnunciadoPut extends EnunciadoPost {
  id: string;
}
