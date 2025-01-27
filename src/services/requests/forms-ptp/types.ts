export enum FormPtpStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
}

export interface FormPtp {
  id: string;
  dataExecucao: Date;
  conferente: string;
  notaFiscal: string;
  opcaoUp: string;
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
}

export interface FormPtpPut extends FormPtpPost {
  id: string;
}
