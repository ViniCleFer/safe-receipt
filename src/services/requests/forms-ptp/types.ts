export enum FormPtpStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
}

export enum TipoCodigoProduto {
  MISTO = 'MISTO',
  EXCLUSIVO = 'EXCLUSIVO',
}

export interface FormPtp {
  id: string;
  dataExecucao: Date;
  conferente: string;
  notaFiscal: string;
  opcaoUp: string;
  qtdAnalisada: number;
  tipoCodigoProduto: TipoCodigoProduto;
  status: FormPtpStatus;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface FormPtpPost {
  dataExecucao: Date;
  conferente: string;
  notaFiscal: string;
  opcaoUp: string;
  status: FormPtpStatus;
  qtdAnalisada: number;
  tipoCodigoProduto: TipoCodigoProduto;
}

export interface FormPtpPut extends FormPtpPost {
  id: string;
}

export interface FormPtpToLaudoCrm extends FormPtp {
  lotes?: string[] | null;
  codigoProdutos?: string[] | null;
  qtdCaixasNaoConformes?: string[] | null;
  detalheNaoConformidade: string[];
}
