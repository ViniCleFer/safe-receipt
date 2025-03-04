import { TipoEvidencia } from '@/services/requests/laudos/types';

const bucketName = 'evidencias';

export function generateFolderName(
  isLaudoCrm: boolean,
  laudoCrmId?: string | null,
  divergenciaId?: string | null,
  tipoEvidencia?: TipoEvidencia | null,
): string {
  return isLaudoCrm
    ? `${bucketName}/laudoCrm/${laudoCrmId}/${tipoEvidencia}`
    : `${bucketName}/divergencia/${divergenciaId}`;
}
